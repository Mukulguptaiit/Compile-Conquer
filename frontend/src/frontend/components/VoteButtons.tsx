import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface VoteButtonsProps {
  answerId: string;
  initialVoteCount: number;
  userVote?: 'up' | 'down' | null;
  onVoteChange: (newCount: number, newUserVote: 'up' | 'down' | null) => void;
  className?: string;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  answerId,
  initialVoteCount,
  userVote,
  onVoteChange,
  className,
}) => {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    if (isVoting) return;

    try {
      setIsVoting(true);

      // Check if user already voted
      if (userVote === voteType) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.user_id)
          .eq('answer_id', answerId);

        if (error) throw error;

        const adjustment = voteType === 'up' ? -1 : 1;
        onVoteChange(initialVoteCount + adjustment, null);
        toast.success('Vote removed');
      } else {
        // Add or update vote
        const { error } = await supabase
          .from('votes')
          .upsert({
            user_id: user.user_id,
            answer_id: answerId,
            vote_type: voteType,
          });

        if (error) throw error;

        let adjustment = 0;
        if (userVote === null) {
          adjustment = voteType === 'up' ? 1 : -1;
        } else {
          adjustment = voteType === 'up' ? 2 : -2;
        }

        onVoteChange(initialVoteCount + adjustment, voteType);
        toast.success(`${voteType === 'up' ? 'Upvoted' : 'Downvoted'}!`);
      }
    } catch (error: any) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className={cn('flex flex-col items-center space-y-1', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('up')}
        disabled={isVoting || !user}
        className={cn(
          'h-8 w-8 p-0 hover:bg-primary/10',
          userVote === 'up' && 'text-primary bg-primary/10'
        )}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
      
      <span className={cn(
        'text-sm font-medium min-w-[2rem] text-center',
        initialVoteCount > 0 && 'text-green-600',
        initialVoteCount < 0 && 'text-red-600'
      )}>
        {initialVoteCount}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('down')}
        disabled={isVoting || !user}
        className={cn(
          'h-8 w-8 p-0 hover:bg-destructive/10',
          userVote === 'down' && 'text-destructive bg-destructive/10'
        )}
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  );
};