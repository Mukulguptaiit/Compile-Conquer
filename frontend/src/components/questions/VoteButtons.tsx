import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  initialVotes: number;
  userVote?: "up" | "down" | null;
  onVote?: (type: "up" | "down") => Promise<void>;
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function VoteButtons({ 
  initialVotes, 
  userVote = null, 
  onVote,
  orientation = "vertical",
  size = "md",
  disabled = false
}: VoteButtonsProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [currentVote, setCurrentVote] = useState(userVote);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (type: "up" | "down") => {
    if (disabled || isVoting) return;

    setIsVoting(true);
    try {
      let newVotes = votes;
      let newVote = type;

      // If clicking the same vote, remove it
      if (currentVote === type) {
        newVotes = type === "up" ? votes - 1 : votes + 1;
        newVote = null;
      } 
      // If switching votes
      else if (currentVote) {
        newVotes = type === "up" ? votes + 2 : votes - 2;
      } 
      // If no previous vote
      else {
        newVotes = type === "up" ? votes + 1 : votes - 1;
      }

      setVotes(newVotes);
      setCurrentVote(newVote);
      
      if (onVote) {
        await onVote(type);
      }
    } catch (error) {
      // Revert on error
      setVotes(initialVotes);
      setCurrentVote(userVote);
      console.error('Voting failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const buttonSize = size === "sm" ? "icon" : size === "lg" ? "lg" : "default";
  const iconSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";

  const containerClass = orientation === "horizontal" 
    ? "flex items-center space-x-2" 
    : "flex flex-col items-center space-y-1";

  return (
    <div className={containerClass}>
      <Button
        variant="vote"
        size={buttonSize}
        onClick={() => handleVote("up")}
        disabled={disabled || isVoting}
        className={cn(
          "transition-all duration-200",
          currentVote === "up" && "bg-vote-up text-white hover:bg-vote-up/90"
        )}
      >
        <ArrowUp className={iconSize} />
      </Button>

      <span className={cn(
        "font-semibold transition-colors",
        currentVote === "up" && "text-vote-up",
        currentVote === "down" && "text-vote-down",
        size === "sm" && "text-sm",
        size === "lg" && "text-lg"
      )}>
        {votes}
      </span>

      <Button
        variant="vote"
        size={buttonSize}
        onClick={() => handleVote("down")}
        disabled={disabled || isVoting}
        className={cn(
          "transition-all duration-200",
          currentVote === "down" && "bg-vote-down text-white hover:bg-vote-down/90"
        )}
      >
        <ArrowDown className={iconSize} />
      </Button>
    </div>
  );
}