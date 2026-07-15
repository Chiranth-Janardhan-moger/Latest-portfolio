export interface Project {
  id: string;
  name: string;
  meta: string;
  desc: string;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  logs: {
    type: 'VERIFIED' | 'FLAGGED' | 'NOTE';
    text: string;
  }[];
}

export interface Experience {
  id: string;
  role: string;
  company?: string;
  dates: string;
  desc: string;
  url?: string;
  links?: { label: string; url: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
