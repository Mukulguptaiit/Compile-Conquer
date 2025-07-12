import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Clock, Check, Edit2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { VoteButtons } from "@/components/questions/VoteButtons";
import { Header } from "@/components/layout/Header";
import { getQuestionById, voteQuestion, postAnswer, voteAnswer, acceptAnswer } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";

interface Answer {
  id: string;
  content: string;
  user: { id: string; username: string };
  voteCount: number;
  createdAt: string;
  updatedAt: string;
  isAccepted?: boolean;
}

interface Question {
  id: string;
  title: string;
  description: string;
  user: { id: string; username: string };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolved: boolean;
  upvotes: number;
  downvotes: number;
}

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [questionVotes, setQuestionVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [answerVotes, setAnswerVotes] = useState<Record<string, number>>({});

  const isAuthenticated = authApi.isAuthenticated();
  const currentUser = authApi.getCurrentUser();

  useEffect(() => {
    if (id) {
      fetchQuestionDetails();
    }
  }, [id]);

  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuestionById(id!);
      setQuestion(data.question);
      setAnswers(data.answers);
      setQuestionVotes({ upvotes: data.question.upvotes, downvotes: data.question.downvotes });
      
      // Initialize answer votes
      const votes: Record<string, number> = {};
      data.answers.forEach(answer => {
        votes[answer.id] = answer.voteCount;
      });
      setAnswerVotes(votes);
    } catch (err: any) {
      setError(err.message || "Failed to load question");
      toast({
        title: "Error",
        description: err.message || "Failed to load question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionVote = async (type: "up" | "down") => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      const value = type === "up" ? 1 : -1;
      const response = await voteQuestion(id!, value);
      setQuestionVotes({ upvotes: response.upvotes, downvotes: response.downvotes });
    } catch (err: any) {
      toast({
        title: "Voting failed",
        description: err.message || "Failed to record vote",
        variant: "destructive",
      });
      throw err; // Re-throw to trigger revert in VoteButtons
    }
  };

  const handleAnswerVote = async (answerId: string, type: "up" | "down") => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      const value = type === "up" ? 1 : -1;
      const response = await voteAnswer(answerId, value);
      setAnswerVotes(prev => ({
        ...prev,
        [answerId]: response.voteCount
      }));
    } catch (err: any) {
      toast({
        title: "Voting failed",
        description: err.message || "Failed to record vote",
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleSubmitAnswer = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to post an answer",
        variant: "destructive",
      });
      return;
    }

    if (!newAnswer.trim()) return;

    setSubmittingAnswer(true);
    try {
      await postAnswer(id!, newAnswer);
      toast({
        title: "Answer posted!",
        description: "Your answer has been posted successfully.",
      });
      setNewAnswer("");
      // Refresh the question to get the new answer
      await fetchQuestionDetails();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to post answer",
        variant: "destructive",
      });
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!isAuthenticated || !currentUser) return;

    try {
      await acceptAnswer(answerId);
      toast({
        title: "Answer accepted!",
        description: "The answer has been marked as accepted.",
      });
      // Refresh to update the accepted status
      await fetchQuestionDetails();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to accept answer",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-muted-foreground">Loading question...</div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-destructive">
            {error || "Question not found"}
          </div>
        </div>
      </div>
    );
  }

  const totalVotes = questionVotes.upvotes - questionVotes.downvotes;

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
                  initialVotes={totalVotes}
                  onVote={handleQuestionVote}
                  size="lg"
                  disabled={!isAuthenticated}
                />
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-3">{question.title}</h1>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: question.description }}
                    />
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
                      <span>Asked by {question.user.username}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(question.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answers Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {answers.length} Answer{answers.length !== 1 ? 's' : ''}
            </h2>

            {answers.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No answers yet. Be the first to answer this question!
                </CardContent>
              </Card>
            ) : (
              answers.map((answer) => (
                <Card key={answer.id} className={answer.isAccepted ? "border-success" : ""}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <VoteButtons 
                        initialVotes={answerVotes[answer.id] || 0}
                        onVote={(type) => handleAnswerVote(answer.id, type)}
                        size="md"
                        disabled={!isAuthenticated}
                      />
                      
                      <div className="flex-1 space-y-4">
                        {answer.isAccepted && (
                          <div className="flex items-center space-x-2 text-success font-medium">
                            <Check className="w-5 h-5" />
                            <span>Accepted Answer</span>
                          </div>
                        )}
                        
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: answer.content }}
                        />

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{answer.user.username}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(answer.createdAt)}</span>
                            </div>
                            {currentUser && question.user.id === currentUser.id.toString() && !answer.isAccepted && !question.resolved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAcceptAnswer(answer.id)}
                                className="text-success hover:text-success"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Add Answer */}
          {isAuthenticated ? (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
                <div className="space-y-4">
                  <RichTextEditor
                    value={newAnswer}
                    onChange={setNewAnswer}
                    placeholder="Write your answer here... You can use the formatting tools above."
                    minHeight="200px"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Use the formatting tools above. Be clear and helpful!
                    </p>
                    <Button 
                      onClick={handleSubmitAnswer}
                      disabled={!newAnswer.trim() || submittingAnswer}
                      variant="warm"
                    >
                      {submittingAnswer ? "Posting..." : "🎯 Post Answer"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Please log in to post an answer
                </p>
                <Button asChild variant="warm">
                  <Link to="/login">Login to Answer</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;