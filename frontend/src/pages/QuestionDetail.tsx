import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowUp, ArrowDown, Check, MessageSquare, Share, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";

// Mock data for demonstration
const mockQuestion = {
  id: "1",
  title: "How to join 2 columns in a data set to make a separate column in SQL?",
  description: "I'm new to SQL and I'm trying to concatenate two columns to create a new column. I've tried using CONCAT but I'm getting an error. Can someone help me understand the correct syntax?\n\nHere's what I've tried:\n\n```sql\nSELECT CONCAT(first_name, last_name) AS full_name\nFROM users;\n```\n\nBut I keep getting a syntax error. I'm using MySQL 8.0.",
  tags: ["SQL", "Database", "MySQL"],
  votes: 15,
  author: "johndoe",
  createdAt: "2 hours ago",
  isBookmarked: false
};

const mockAnswers = [
  {
    id: "1",
    content: "The syntax looks correct for MySQL. The issue might be that you need to handle NULL values. Try this:\n\n```sql\nSELECT CONCAT(IFNULL(first_name, ''), ' ', IFNULL(last_name, '')) AS full_name\nFROM users;\n```\n\nAlternatively, you can use CONCAT_WS (concatenate with separator) which automatically handles NULL values:\n\n```sql\nSELECT CONCAT_WS(' ', first_name, last_name) AS full_name\nFROM users;\n```",
    votes: 12,
    isAccepted: true,
    author: "sql_expert",
    createdAt: "1 hour ago"
  },
  {
    id: "2", 
    content: "Another approach is to use the pipe operator if you're using MySQL in ANSI mode:\n\n```sql\nSELECT first_name || ' ' || last_name AS full_name\nFROM users;\n```\n\nBut CONCAT is the preferred method in MySQL.",
    votes: 5,
    isAccepted: false,
    author: "developer123",
    createdAt: "30 minutes ago"
  }
];

const QuestionDetail = () => {
  const { id } = useParams();
  const [newAnswer, setNewAnswer] = useState("");
  const [questionVotes, setQuestionVotes] = useState(mockQuestion.votes);
  const [isBookmarked, setIsBookmarked] = useState(mockQuestion.isBookmarked);

  const handleVote = (type: "up" | "down") => {
    if (type === "up") {
      setQuestionVotes(prev => prev + 1);
      toast({ title: "Voted up!" });
    } else {
      setQuestionVotes(prev => prev - 1);
      toast({ title: "Voted down!" });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({ 
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks" 
    });
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please write an answer before submitting.",
        variant: "destructive"
      });
      return;
    }

    toast({ title: "Answer submitted!" });
    setNewAnswer("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Question */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {mockQuestion.title}
          </h1>

          <div className="flex gap-4 mb-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="stackit-vote-button upvote"
                onClick={() => handleVote("up")}
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
              <span className="text-lg font-semibold text-foreground">{questionVotes}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="stackit-vote-button downvote"
                onClick={() => handleVote("down")}
              >
                <ArrowDown className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`mt-2 ${isBookmarked ? 'text-warning' : 'text-muted-foreground'}`}
                onClick={handleBookmark}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="prose max-w-none mb-4">
                <p className="text-foreground whitespace-pre-line">
                  {mockQuestion.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mockQuestion.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="stackit-tag">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <span>asked by <span className="font-medium">{mockQuestion.author}</span></span>
                <span>{mockQuestion.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {mockAnswers.length} Answer{mockAnswers.length !== 1 ? 's' : ''}
          </h2>

          <div className="space-y-6">
            {mockAnswers.map((answer) => (
              <div key={answer.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex gap-4">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center space-y-2">
                    <Button variant="ghost" size="sm" className="stackit-vote-button upvote">
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-foreground">{answer.votes}</span>
                    <Button variant="ghost" size="sm" className="stackit-vote-button downvote">
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    {answer.isAccepted && (
                      <div className="mt-2 p-2 bg-success rounded-full">
                        <Check className="w-4 h-4 text-success-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Answer Content */}
                  <div className="flex-1">
                    <div className="prose max-w-none mb-4">
                      <p className="text-foreground whitespace-pre-line">
                        {answer.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="h-auto p-1">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Comment
                        </Button>
                        <Button variant="ghost" size="sm" className="h-auto p-1">
                          <Share className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        {answer.isAccepted && (
                          <Badge variant="secondary" className="text-success">
                            Accepted Answer
                          </Badge>
                        )}
                        <span>answered by <span className="font-medium">{answer.author}</span></span>
                        <span>{answer.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Answer Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Your Answer
          </h3>

          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <Textarea
              placeholder="Write your answer here... Be clear and concise. Include code examples if relevant."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="min-h-[150px] resize-y"
            />
            
            <div className="flex gap-4">
              <Button type="submit" className="bg-primary hover:bg-primary-hover">
                Post Your Answer
              </Button>
              <Button type="button" variant="outline">
                Preview
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;