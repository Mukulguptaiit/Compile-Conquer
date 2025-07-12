import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Link, useNavigate } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../hooks/useAuth';
import { QuestionFilters } from '../types';
import { formatDistanceToNow } from 'date-fns';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState<QuestionFilters>({
    search: '',
    sort: 'newest',
    page: 1,
    limit: 10
  });

  const { questions, loading, totalCount } = useQuestions(filters);
  const totalPages = Math.ceil(totalCount / (filters.limit || 10));

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sort: sort as any, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const QuestionSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Questions</h1>
          <p className="text-muted-foreground">
            Find answers to programming questions or ask your own
          </p>
        </div>
        <Button onClick={() => navigate('/ask')} className="gap-2">
          <Plus className="h-4 w-4" />
          Ask Question
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filters.sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="most_viewed">Most Viewed</SelectItem>
            <SelectItem value="unanswered">Unanswered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <QuestionSkeleton key={i} />
          ))
        ) : questions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No questions found.</p>
              {!user && (
                <p className="text-sm text-muted-foreground mt-2">
                  <Link to="/auth" className="text-primary hover:underline">
                    Sign in
                  </Link>{' '}
                  to ask your first question.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">
                      <Link 
                        to={`/questions/${question.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {question.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      <div dangerouslySetInnerHTML={{ 
                        __html: question.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                      }} />
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{question.views} views</p>
                    <p>{question.answer_count || 0} answers</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    asked by{' '}
                    <span className="font-medium text-foreground">
                      {question.user?.display_name || question.user?.username}
                    </span>
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {filters.page && filters.page > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, (filters.page || 1) - 2) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={pageNum === filters.page}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {filters.page && filters.page < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};