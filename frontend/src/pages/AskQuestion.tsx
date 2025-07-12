import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";

const AskQuestion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your question.",
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Description Required", 
        description: "Please provide a description for your question.",
        variant: "destructive"
      });
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Tags Required",
        description: "Please add at least one tag to categorize your question.",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally send the data to your backend
    toast({
      title: "Question Submitted!",
      description: "Your question has been posted successfully.",
    });

    // Navigate back to home
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Ask a Question</h1>
          <p className="text-muted-foreground">
            Get help from the community by asking a clear, detailed question.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              placeholder="e.g., How to join two tables in SQL?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Be specific and imagine you're asking a question to another person.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about your question. Include what you've tried and what you expected to happen..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[200px] text-base resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Include all the details someone would need to answer your question.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium text-foreground">
              Tags <span className="text-destructive">*</span>
            </label>
            
            {/* Tag Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="stackit-tag group">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto w-auto p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <Input
              id="tags"
              placeholder="Type a tag and press Enter (e.g., react, javascript, sql)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              disabled={tags.length >= 5}
            />
            <p className="text-xs text-muted-foreground">
              Add up to 5 tags to describe what your question is about. Press Enter or comma to add.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-4">
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary-hover px-8"
            >
              Post Question
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;