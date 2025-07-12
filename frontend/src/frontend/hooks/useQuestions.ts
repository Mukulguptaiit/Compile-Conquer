import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question, QuestionFilters } from '../types';
import toast from 'react-hot-toast';

export const useQuestions = (filters: QuestionFilters = {}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('questions')
        .select(`
          *,
          user:profiles!questions_user_id_fkey(
            username,
            display_name,
            avatar_url,
            reputation
          ),
          answers!inner(id)
        `, { count: 'exact' });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      // Apply sorting
      switch (filters.sort) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'most_viewed':
          query = query.order('views', { ascending: false });
          break;
        case 'unanswered':
          query = query.eq('status', 'open');
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // Transform data to include answer count
      const questionsWithCounts = data?.map(question => ({
        ...question,
        answer_count: Array.isArray(question.answers) ? question.answers.length : 0,
      })) || [];

      setQuestions(questionsWithCounts as unknown as Question[]);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      setError(err.message);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters.search, filters.tags, filters.sort, filters.page]);

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('questions-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'questions'
      }, () => {
        fetchQuestions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    questions,
    loading,
    error,
    totalCount,
    refetch: fetchQuestions
  };
};

export const useQuestion = (questionId: string) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('questions')
        .select(`
          *,
          user:profiles!questions_user_id_fkey(
            username,
            display_name,
            avatar_url,
            reputation
          ),
          answers(
            *,
            user:profiles!answers_user_id_fkey(
              username,
              display_name,
              avatar_url,
              reputation
            ),
            votes(
              vote_type,
              user_id
            )
          )
        `)
        .eq('id', questionId)
        .single();

      if (fetchError) throw fetchError;

      // Transform answers to include vote counts and user's vote
      const answersWithVotes = Array.isArray(data?.answers) ? data.answers.map(answer => {
        const votes = answer.votes || [];
        const upvotes = votes.filter(v => v.vote_type === 'up').length;
        const downvotes = votes.filter(v => v.vote_type === 'down').length;
        const vote_count = upvotes - downvotes;
        
        return {
          ...answer,
          vote_count,
          votes
        };
      }) : [];

      setQuestion({
        ...data,
        answers: answersWithVotes
      } as Question);

      // Increment view count
      await supabase
        .from('questions')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', questionId);
    } catch (err: any) {
      console.error('Error fetching question:', err);
      setError(err.message);
      toast.error('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!questionId) return;

    const channel = supabase
      .channel(`question-${questionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'answers',
        filter: `question_id=eq.${questionId}`
      }, () => {
        fetchQuestion();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'votes'
      }, () => {
        fetchQuestion();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [questionId]);

  return {
    question,
    loading,
    error,
    refetch: fetchQuestion
  };
};