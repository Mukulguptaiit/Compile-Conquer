import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Clock, Check, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { VoteButtons } from "@/components/questions/VoteButtons";
import { Header } from "@/components/layout/Header";

interface Answer {
  id: string;
  content: string;
  author: { name: string };
  votes: number;
  createdAt: string;
  isAccepted?: boolean;
}

const MOCK_ANSWERS: Answer[] = [
  {
    id: "1",
    content: "You can use the CONCAT function to join two columns in SQL. Here's an example:\n\n```sql\nSELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;\n```\n\nThis will create a new column called 'full_name' that combines the first_name and last_name columns with a space in between.",
    author: { name: "Database Expert" },
    votes: 15,
    createdAt: "1 hour ago",
    isAccepted: true,
  },
  {
    id: "2", 
    content: "Another approach is to use the pipe operator (||) if you're using PostgreSQL:\n\n```sql\nSELECT first_name || ' ' || last_name AS full_name FROM users;\n```\n\nBoth methods will achieve the same result, but CONCAT is more widely supported across different SQL databases.",
    author: { name: "SQL Developer" },
    votes: 8,
    createdAt: "30 minutes ago",
  },
];

const QuestionDetailPage = () => {
  const { id } = useParams();
  const [newAnswer, setNewAnswer] = useState("");

  // Mock question data
  const question = {
    id,
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I'm trying to combine two columns in a SQL database to create a new column. What's the best way to do this with a SQL query? I've tried a few approaches but I'm not getting the expected results.",
    author: { name: "Alex Turner" },
    votes: 12,
    tags: ["SQL", "Database", "Data"],
    createdAt: "2 hours ago",
  };

  const handleSubmitAnswer = () => {
    if (newAnswer.trim()) {
      // Handle answer submission
      console.log("Submitting answer:", newAnswer);
      setNewAnswer("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-32 left-16 w-40 h-40 bg-gradient-warm rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute top-64 right-24 w-32 h-32 bg-gradient-sunset rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-32 w-48 h-48 bg-gradient-primary rounded-lg rotate-12 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-64 right-16 w-36 h-36 bg-gradient-warm rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Questions
            </Link>
          </Button>

          {/* Question */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <VoteButtons 
                  initialVotes={question.votes} 
                  size="lg"
                />
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-3">{question.title}</h1>
                    <p className="text-foreground leading-relaxed">{question.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Author and Time */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Asked by {question.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{question.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answers Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {MOCK_ANSWERS.length} Answer{MOCK_ANSWERS.length !== 1 ? 's' : ''}
            </h2>

            {MOCK_ANSWERS.map((answer) => (
              <Card key={answer.id} className={answer.isAccepted ? "border-success" : ""}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <VoteButtons 
                      initialVotes={answer.votes} 
                      size="md"
                    />
                    
                    <div className="flex-1 space-y-4">
                      {answer.isAccepted && (
                        <div className="flex items-center space-x-2 text-success font-medium">
                          <Check className="w-5 h-5" />
                          <span>Accepted Answer</span>
                        </div>
                      )}
                      
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans">{answer.content}</pre>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{answer.author.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{answer.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Answer */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
              <div className="space-y-4">
                <Textarea
                  placeholder="Write your answer here... You can use markdown formatting."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Use markdown for formatting. Be clear and helpful!
                  </p>
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!newAnswer.trim()}
                    variant="warm"
                    className="hover:scale-105 transition-transform"
                  >
                    🎯 Post Answer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;