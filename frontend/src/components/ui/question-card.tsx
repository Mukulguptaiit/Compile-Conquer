import { ArrowUp, ArrowDown, MessageSquare, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface QuestionCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  votes: number;
  answers: number;
  isAnswered: boolean;
  author: string;
  createdAt: string;
}

const QuestionCard = ({ 
  id, 
  title, 
  description, 
  tags, 
  votes, 
  answers, 
  isAnswered, 
  author, 
  createdAt 
}: QuestionCardProps) => {
  return (
    <div className="stackit-question-card stackit-fade-in">
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center space-y-2 min-w-[60px]">
          <Button variant="ghost" size="sm" className="stackit-vote-button upvote">
            <ArrowUp className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-foreground">{votes}</span>
          <Button variant="ghost" size="sm" className="stackit-vote-button downvote">
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Answer Count */}
        <div className="flex flex-col items-center justify-center min-w-[60px]">
          <div className={`flex items-center justify-center w-12 h-8 rounded ${
            isAnswered ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {isAnswered && <Check className="w-3 h-3 mr-1" />}
            <span className="text-sm font-medium">{answers}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {answers === 1 ? 'answer' : 'answers'}
          </span>
        </div>

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <Link to={`/questions/${id}`} className="block group">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 mb-2">
              {title}
            </h3>
          </Link>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="stackit-tag">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Author and Time */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>asked by <span className="font-medium">{author}</span></span>
            <span>{createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;