import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const POPULAR_TAGS = [
  "React", "JavaScript", "TypeScript", "Python", "Java", "HTML", "CSS", 
  "Node.js", "Express", "MongoDB", "SQL", "Git", "Docker", "AWS"
];

export function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  placeholder = "Add tags...",
  maxTags = 5 
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, trimmedTag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const availablePopularTags = POPULAR_TAGS.filter(tag => !selectedTags.includes(tag));

  return (
    <div className="space-y-3">
      <Label htmlFor="tags">Tags ({selectedTags.length}/{maxTags})</Label>
      
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="default" className="flex items-center gap-1">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="h-auto p-0 w-4 h-4 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Input */}
      {selectedTags.length < maxTags && (
        <div className="flex gap-2">
          <Input
            id="tags"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button 
            type="button"
            variant="outline" 
            onClick={() => addTag(inputValue)}
            disabled={!inputValue.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Popular Tags */}
      {selectedTags.length < maxTags && availablePopularTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Popular tags:</Label>
          <div className="flex flex-wrap gap-2">
            {availablePopularTags.slice(0, 8).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => addTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add a tag. Maximum {maxTags} tags allowed.
      </p>
    </div>
  );
}