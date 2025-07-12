import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "@/components/ui/question-card";
import Navbar from "@/components/layout/Navbar";

// Mock data for demonstration
const mockQuestions = [
  {
    id: "1",
    title: "How to join 2 columns in a data set to make a separate column in SQL?",
    description: "I'm new to SQL and I'm trying to concatenate two columns to create a new column. I've tried using CONCAT but I'm getting an error. Can someone help me understand the correct syntax?",
    tags: ["SQL", "Database", "MySQL"],
    votes: 15,
    answers: 3,
    isAnswered: true,
    author: "johndoe",
    createdAt: "2 hours ago"
  },
  {
    id: "2", 
    title: "React component re-rendering issue with useEffect",
    description: "My React component keeps re-rendering infinitely when I use useEffect. I think it's related to the dependency array but I'm not sure how to fix it.",
    tags: ["React", "JavaScript", "Hooks"],
    votes: 8,
    answers: 1,
    isAnswered: false,
    author: "reactdev",
    createdAt: "4 hours ago"
  },
  {
    id: "3",
    title: "Best practices for JWT authentication in Node.js",
    description: "I'm implementing JWT authentication in my Node.js application. What are the security best practices I should follow? Should I store the token in localStorage or httpOnly cookies?",
    tags: ["Node.js", "JWT", "Authentication", "Security"],
    votes: 23,
    answers: 5,
    isAnswered: true,
    author: "securityexpert",
    createdAt: "1 day ago"
  },
  {
    id: "4",
    title: "How to optimize database queries for large datasets?",
    description: "I have a table with millions of records and my queries are becoming very slow. What are some strategies to optimize performance?",
    tags: ["Database", "Performance", "Optimization"],
    votes: 12,
    answers: 2,
    isAnswered: false,
    author: "dba_user",
    createdAt: "2 days ago"
  }
];

const Home = () => {
  const [filter, setFilter] = useState("newest");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">All Questions</h1>
            <p className="text-muted-foreground">
              {mockQuestions.length} questions
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-hover">
            Ask Question
          </Button>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="newest">Newest</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
            <TabsTrigger value="most-voted">Most Voted</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Questions List */}
        <div className="space-y-4">
          {mockQuestions.map((question) => (
            <QuestionCard key={question.id} {...question} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-8 space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;