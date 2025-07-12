export interface User {
  id: string;
  user_id: string;
  email?: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  reputation: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  user_id: string;
  title: string;
  description: string;
  tags: string[];
  views: number;
  status: 'open' | 'closed' | 'answered';
  accepted_answer_id?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  answers?: Answer[];
  answer_count?: number;
}

export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  votes?: Vote[];
  vote_count?: number;
  user_vote?: 'up' | 'down' | null;
}

export interface Vote {
  id: string;
  user_id: string;
  answer_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'answer' | 'comment' | 'mention' | 'accept';
  title: string;
  message: string;
  related_question_id?: string;
  related_answer_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface QuestionFilters {
  search?: string;
  tags?: string[];
  sort?: 'newest' | 'oldest' | 'most_viewed' | 'unanswered';
  page?: number;
  limit?: number;
}