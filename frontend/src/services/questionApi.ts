import { makeRequest } from "../lib/api";

// ----------------------------
// Types
// ----------------------------

export type Question = {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
  };
  upvotes: number;
  downvotes: number;
  answers: number;
  tags: { name: string }[];
  createdAt: string;
  hasAcceptedAnswer?: boolean;
};

export type FetchQuestionsParams = {
  search?: string;
  sort?: string;
  filter?: string;
  tags?: string[];
  page?: number;
  limit?: number;
};

export type FetchQuestionsResponse = {
  questions: Question[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// ----------------------------
// API Functions
// ----------------------------

export const questionApi = {
  async fetchQuestions({
    search,
    sort,
    filter,
    tags = [],
    page = 1,
    limit = 10,
  }: FetchQuestionsParams): Promise<FetchQuestionsResponse> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (sort) params.append("sort", sort);
    if (filter && filter !== "all") params.append("filter", filter);
    if (tags.length > 0) params.append("tags", tags.join(","));
    params.append("page", String(page));
    params.append("limit", String(limit));

    return makeRequest<FetchQuestionsResponse>(`/questions/all?${params.toString()}`);
  },

  async getQuestionById(id: string): Promise<Question> {
    return makeRequest<Question>(`/questions/get/${id}`);
  },

  async postQuestion(data: {
    title: string;
    description: string;
    tags: string[];
  }): Promise<Question> {
    return makeRequest<Question>("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async voteQuestion(
    id: string,
    value: 1 | -1
  ): Promise<{ success: boolean }> {
    return makeRequest<{ success: boolean }>(`/questions/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ value }),
    });
  },
};
