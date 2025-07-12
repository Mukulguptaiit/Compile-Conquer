import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { Header } from "@/components/layout/Header";
import { fetchQuestions } from "@/lib/api";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  // Placeholder for tags, update when tags endpoint is available
  const [tags] = useState<string[]>(["React", "JavaScript", "Python", "SQL", "Node.js"]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchQuestions({ search: searchQuery, sort: sortBy, filter: filterBy })
      .then((data) => {
        // Transform backend questions to match QuestionCard props
        const mappedQuestions = (data.questions || []).map((q: any) => ({
          id: q.id,
          title: q.title,
          description: q.description,
          author: {
            name: q.User?.name || 'Unknown',
            avatar: q.User?.avatar || undefined,
          },
          votes: (q.upvotes || 0) - (q.downvotes || 0),
          answers: Array.isArray(q.answers) ? q.answers.length : (q.answers || 0),
          tags: Array.isArray(q.Tags) ? q.Tags.map((t: any) => t.name) : (q.tags || []),
          createdAt: q.createdAt ? new Date(q.createdAt).toLocaleDateString() : '',
          hasAcceptedAnswer: q.hasAcceptedAnswer || false,
        }));
        setQuestions(mappedQuestions);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchQuery, sortBy, filterBy]);

  return (
    <div className="min-h-screen bg-gradient-secondary relative">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>
      
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="most-votes">Most Votes</SelectItem>
                    <SelectItem value="most-answers">Most Answers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Filter</label>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Questions</SelectItem>
                    <SelectItem value="unanswered">Unanswered</SelectItem>
                    <SelectItem value="answered">Answered</SelectItem>
                    <SelectItem value="accepted">Has Accepted Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="space-y-3">
              <h3 className="font-medium">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">All Questions</h1>
                  <p className="text-muted-foreground">{questions.length} questions</p>
                </div>
                <Button asChild variant="sunset">
                  <Link to="/ask">
                    <Plus className="w-4 h-4" />
                    🔥 Ask Question
                  </Link>
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Questions List */}
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading questions...</div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">{error}</div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No questions found.</div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))}
                </div>
              )}

              {/* Pagination (optional, not implemented here) */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;