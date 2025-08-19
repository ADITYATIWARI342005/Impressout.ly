export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Summary {
  content: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skills {
  languages: string;
  frameworks: string;
  databases: string;
  cloud: string;
  tools: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  gpa: string;
  coursework: string;
}

export interface Project {
  id: string;
  name: string;
  technologies: string;
  description: string;
  github: string;
  demo: string;
}

export interface ResumeSection {
  id: string;
  title: string;
  order: number;
  visible: boolean;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: Summary;
  experiences: Experience[];
  skills: Skills;
  achievements: Achievement[];
  education: Education[];
  projects: Project[];
  sections: ResumeSection[];
}

export interface ATSScore {
  overall: number;
  breakdown: {
    technicalSkills: number;
    experience: number;
    achievements: number;
    projects: number;
    education: number;
    format: number;
  };
  details: {
    technicalSkills: {
      languages: { score: number; details: string[] };
      frameworks: { score: number; details: string[] };
      tools: { score: number; details: string[] };
      methodologies: { score: number; details: string[] };
      bonuses: { score: number; details: string[] };
    };
    experience: {
      years: { score: number; details: string[] };
      title: { score: number; details: string[] };
      company: { score: number; details: string[] };
      progression: { score: number; details: string[] };
      bonuses: { score: number; details: string[] };
    };
    achievements: {
      metrics: { score: number; details: string[] };
      scale: { score: number; details: string[] };
      quality: { score: number; details: string[] };
      leadership: { score: number; details: string[] };
      business: { score: number; details: string[] };
    };
    projects: {
      complexity: { score: number; details: string[] };
      portfolio: { score: number; details: string[] };
      documentation: { score: number; details: string[] };
    };
    education: {
      degree: { score: number; details: string[] };
      university: { score: number; details: string[] };
      certifications: { score: number; details: string[] };
    };
    format: {
      structure: { score: number; details: string[] };
      headers: { score: number; details: string[] };
      contact: { score: number; details: string[] };
    };
  };
  suggestions: string[];
  keywordMatches: string[];
  missingKeywords: string[];
}

export interface AIAnalysis {
  suggestions: string[];
  keywordRecommendations: string[];
  improvementAreas: string[];
  overallFeedback: string;
}
