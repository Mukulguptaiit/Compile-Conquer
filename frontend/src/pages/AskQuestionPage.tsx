import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bold, Italic, List, Link2, Image, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TagSelector } from "@/components/questions/TagSelector";
import { Header } from "@/components/layout/Header";
import { postQuestion } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await postQuestion(formData);
      toast({
        title: "Question posted!",
        description: "Your question has been posted successfully.",
      });
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to post question");
      toast({
        title: "Error",
        description: err.message || "Failed to post question.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-warm rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-sunset rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      
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

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Ask a Public Question</CardTitle>
              <p className="text-muted-foreground">
                Get help from millions of developers around the world
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., How to center a div in CSS?"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific and imagine you're asking a question to another person
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Body</Label>
                  
                  {/* Rich Text Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
                    <Button type="button" variant="ghost" size="sm">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <Italic className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button type="button" variant="ghost" size="sm">
                      <List className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <Link2 className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <Image className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button type="button" variant="ghost" size="sm">
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <Textarea
                    id="description"
                    placeholder="Include all the information someone would need to answer your question"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[300px]"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe your problem in detail. Include what you've tried and what you expected to happen.
                  </p>
                </div>

                {/* Tags */}
                <TagSelector
                  selectedTags={formData.tags}
                  onTagsChange={(tags) => setFormData({ ...formData, tags })}
                  placeholder="Add up to 5 tags to describe what your question is about"
                />

                {/* Error */}
                {error && <div className="text-destructive text-sm">{error}</div>}

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    By posting your question, you agree to our terms of service
                  </p>
                 <Button 
                    type="submit" 
                    variant="warm"
                    disabled={loading || !formData.title.trim() || !formData.description.trim() || formData.tags.length === 0}
                  >
                    {loading ? "Posting..." : "🚀 Post Your Question"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Writing a good question</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Make your title specific and imagine you're asking a question to another person</li>
                <li>• Pretend you're talking to a busy colleague and have to sum up your entire question in one sentence</li>
                <li>• Include details about what you've tried and exactly what you are trying to do</li>
                <li>• Review your question and fix any spelling or grammar mistakes</li>
                <li>• Use tags to help others find and answer your question</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionPage;