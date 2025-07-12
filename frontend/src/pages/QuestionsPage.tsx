import { useState } from "react";
import { Search, Filter, SortAsc, Plus } from "lucide-react";
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

const MOCK_QUESTIONS = [
  {
    id: "1",
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I'm trying to combine two columns in a SQL database to create a new column. What's the best way to do this with a SQL query?",
    author: { name: "Alex Turner" },
    votes: 12,
    answers: 3,
    tags: ["SQL", "Database", "Data"],
    createdAt: "2 hours ago",
    hasAcceptedAnswer: true,
  },
  {
    id: "2", 
    title: "Understanding Recursive Functions in Python",
    description: "Can someone provide a simple example and explanation of how to implement recursive functions in Python? I'm struggling with the concept of a base case.",
    author: { name: "Sarah Johnson" },
    votes: 8,
    answers: 2,
    tags: ["Python", "Recursion", "Programming"],
    createdAt: "4 hours ago",
  },
  {
    id: "3",
    title: "Implementing User Authentication with JWT in React and Node.js",
    description: "I'm looking to implement user authentication using JWT. What's the best way to handle user authentication in both the frontend (React) and backend (Node.js)?",
    author: { name: "Mike Chen" },
    votes: 15,
    answers: 5,
    tags: ["React", "Node.js", "JWT", "Authentication"],
    createdAt: "6 hours ago",
    hasAcceptedAnswer: true,
  },
  {
    id: "4",
    title: "Choosing the Right Machine Learning Algorithm for Classification",
    description: "I have a dataset with 10,000 rows and need to choose the right algorithm for a classification task. I have a decision with logistic regression and SVM but can't decide which one.",
    author: { name: "David Kim" },
    votes: 10,
    answers: 4,
    tags: ["Machine Learning", "Classification", "Python", "Algorithm"],
    createdAt: "1 day ago",
  },
];

const QuestionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

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
                {["React", "JavaScript", "Python", "SQL", "Node.js"].map((tag) => (
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
                  <p className="text-muted-foreground">{MOCK_QUESTIONS.length} questions</p>
                </div>
                <Button asChild variant="sunset" className="animate-bounce hover:animate-none">
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
              <div className="space-y-4">
                {MOCK_QUESTIONS.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center space-x-2 pt-8">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button key={page} variant={page === 1 ? "default" : "outline"} size="sm">
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;