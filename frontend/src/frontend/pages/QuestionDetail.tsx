import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, User, Calendar, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { RichTextEditor } from '../components/RichTextEditor';
import { VoteButtons } from '../components/VoteButtons';
import { useQuestion } from '../hooks/useQuestions';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { question, loading, refetch } = useQuestion(id!);
  const [answerContent, setAnswerContent] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isAcceptingAnswer, setIsAcceptingAnswer] = useState(false);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to post an answer');
      navigate('/auth');
      return;
    }

    if (!answerContent.trim()) {
      toast.error('Please enter your answer');
      return;
    }

    try {
      setIsSubmittingAnswer(true);

      const { error } = await supabase
        .from('answers')
        .insert({
          question_id: id!,
          user_id: user.user_id,
          content: answerContent
        });

      if (error) throw error;

      // Create notification for question owner
      if (question && question.user_id !== user.user_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: question.user_id,
            type: 'answer',
            title: 'New Answer',
            message: `${user.display_name || user.username} answered your question: ${question.title}`,
            related_question_id: question.id
          });
      }

      toast.success('Answer posted successfully!');
      setAnswerContent('');
      refetch();
    } catch (error: any) {
      console.error('Error posting answer:', error);
      toast.error(error.message || 'Failed to post answer');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!user || !question) return;

    try {
      setIsAcceptingAnswer(true);

      // Update the answer as accepted
      const { error: answerError } = await supabase
        .from('answers')
        .update({ is_accepted: true })
        .eq('id', answerId);

      if (answerError) throw answerError;

      // Update question with accepted answer
      const { error: questionError } = await supabase
        .from('questions')
        .update({ 
          accepted_answer_id: answerId,
          status: 'answered'
        })
        .eq('id', question.id);

      if (questionError) throw questionError;

      // Unaccept other answers
      await supabase
        .from('answers')
        .update({ is_accepted: false })
        .eq('question_id', question.id)
        .neq('id', answerId);

      // Create notification for answer author
      const answer = question.answers?.find(a => a.id === answerId);
      if (answer && answer.user_id !== user.user_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: answer.user_id,
            type: 'accept',
            title: 'Answer Accepted',
            message: `Your answer to "${question.title}" was accepted!`,
            related_question_id: question.id,
            related_answer_id: answerId
          });
      }

      toast.success('Answer accepted!');
      refetch();
    } catch (error: any) {
      console.error('Error accepting answer:', error);
      toast.error(error.message || 'Failed to accept answer');
    } finally {
      setIsAcceptingAnswer(false);
    }
  };

  const handleVoteChange = (answerId: string, newCount: number, newUserVote: 'up' | 'down' | null) => {
    // This will be handled by the VoteButtons component
    // and the real-time subscription will update the UI
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Question Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The question you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Question</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <CardTitle className="text-2xl">{question.title}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{question.views} views</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  asked {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={question.user?.avatar_url} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{question.user?.display_name || question.user?.username}</p>
                <p className="text-muted-foreground">{question.user?.reputation || 0} reputation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-semibold">
            {question.answers?.length || 0} Answer{(question.answers?.length || 0) !== 1 ? 's' : ''}
          </h2>
        </div>

        {question.answers?.map((answer) => (
          <Card key={answer.id} className={answer.is_accepted ? 'border-green-500 bg-green-50/50' : ''}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <VoteButtons
                  answerId={answer.id}
                  initialVoteCount={answer.vote_count || 0}
                  userVote={answer.user_vote}
                  onVoteChange={(newCount, newUserVote) => handleVoteChange(answer.id, newCount, newUserVote)}
                />
                
                <div className="flex-1 space-y-4">
                  {answer.is_accepted && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">Accepted Answer</span>
                    </div>
                  )}
                  
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      {user && user.user_id === question.user_id && !answer.is_accepted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcceptAnswer(answer.id)}
                          disabled={isAcceptingAnswer}
                          className="gap-2 text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                          Accept Answer
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        answered {formatDistanceToNow(new Date(answer.created_at), { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={answer.user?.avatar_url} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{answer.user?.display_name || answer.user?.username}</p>
                          <p className="text-muted-foreground">{answer.user?.reputation || 0} reputation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Answer Form */}
      {user ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
            <CardDescription>
              Thanks for contributing an answer! Please be sure to answer the question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <RichTextEditor
                value={answerContent}
                onChange={setAnswerContent}
                placeholder="Write your answer here..."
                height={300}
              />
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAnswerContent('')}
                  disabled={isSubmittingAnswer}
                >
                  Clear
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmittingAnswer || !answerContent.trim()}
                  className="min-w-[120px]"
                >
                  {isSubmittingAnswer ? 'Posting...' : 'Post Answer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              You must be signed in to post an answer.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};