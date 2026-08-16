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
  certificate?: string;
  certificateUrl?: string;
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
    type: 'pin' | 'vault' | 'totp' | 'map' | 'schedule';
  }[];
}

export interface DesignProject {
  id: string;
  title: string;
  category: 'Design System' | 'Mobile UI' | 'Web Architecture' | 'Security UX';
  tagline: string;
  description: string;
  year: string;
  figmaUrl?: string;
  liveUrl?: string;
  palette: { name: string; hex: string; desc: string }[];
  typography: { role: string; family: string; size: string; weight: string }[];
  keyHighlights: string[];
  principles: { title: string; desc: string }[];
  previewType: 'minimal-system' | 'crypto-vault' | 'transit-flow' | 'security-gateway';
}
