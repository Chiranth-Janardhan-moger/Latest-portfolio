export interface Project {
  id: string;
  name: string;
  meta: string;
  desc: string;
  stack: string[];
  githubUrl?: string;
  demoUrl?: string;
  appDeepLink?: string;
  logs: {
    type: 'VERIFIED' | 'FLAGGED' | 'NOTE';
    text: string;
  }[];
}

export interface Education {
  institution: string;
  location?: string;
  degree: string;
  gpa?: string;
  period?: string;
  logo?: string;
}

export interface Experience {
  id: string;
  role: string;
  company?: string;
  dates: string;
  desc: string;
  url?: string;
  logo?: string;
  logoBg?: string;
  certificate?: string;
  certificateUrl?: string;
  links?: { label: string; url: string }[];
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  period?: string;
  desc?: string;
  logo?: string;
  logoBg?: string;
  skills?: string[];
  certificateUrl?: string;
  credentialUrl?: string;
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

export interface MobileApp {
  id: string;
  name: string;
  category: string;
  tagline: string;
  desc: string;
  stack: string[];
  features: string[];
  status: string;
  version?: string;
  iconUrl?: string;
  githubUrl?: string;
  apkUrl?: string;
  demoUrl?: string;
  architectureHighlights: string[];
  problemStatement?: string;
  solutionStatement?: string;
  solutionPoints?: string[];
  detailedAbout?: string;
  screenshots?: string[];
  screenMockups?: {
    id: string;
    title: string;
    description: string;
    type: 'pin' | 'vault' | 'totp' | 'map' | 'schedule' | 'editor' | 'compiler' | 'stack' | 'search';
  }[];
}
