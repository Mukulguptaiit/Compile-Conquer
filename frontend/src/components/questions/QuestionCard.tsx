import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown, MessageSquare, Clock, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
  };
  votes: number;
  answers: number;
  tags: string[];
  createdAt: string;
  hasAcceptedAnswer?: boolean;
}

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Card className="hover:shadow-soft transition-all duration-200 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Vote and Stats Section */}
          <div className="flex flex-col items-center space-y-2 min-w-[80px]">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm font-semibold">{question.votes}</span>
              <span className="text-xs text-muted-foreground">votes</span>
            </div>
            
            <div className={`flex flex-col items-center space-y-1 ${question.hasAcceptedAnswer ? "text-success" : ""}`}>
              {question.hasAcceptedAnswer && <Check className="w-4 h-4" />}
              <span className="text-sm font-semibold">{question.answers}</span>
              <span className="text-xs text-muted-foreground">answers</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 space-y-3">
            <div>
              <Link 
                to={`/questions/${question.id}`}
                className="text-lg font-semibold hover:text-primary transition-colors"
              >
                {question.title}
              </Link>
              <p className="text-muted-foreground mt-1 line-clamp-2">
                {question.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="hover:bg-accent cursor-pointer">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Author and Time */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{question.author.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{question.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}