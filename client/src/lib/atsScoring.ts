import { ResumeData, ATSScore } from '../types/resume';

// Technical Skills Keywords (2025 trends)
const TECHNICAL_KEYWORDS = {
  languages: {
    core: ['java', 'python', 'javascript', 'typescript', 'c++', 'go', 'rust', 'kotlin', 'swift'],
    trending: ['rust', 'go', 'kotlin', 'swift', 'dart', 'elixir', 'clojure']
  },
  frameworks: {
    frontend: ['react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt.js', 'gatsby'],
    backend: ['spring boot', 'node.js', 'django', 'flask', 'fastapi', 'express', 'laravel'],
    mobile: ['react native', 'flutter', 'xamarin', 'ionic'],
    trending: ['svelte', 'astro', 'solid', 'qwik']
  },
  tools: {
    cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible'],
    devops: ['jenkins', 'gitlab ci', 'github actions', 'circleci', 'travis ci'],
    monitoring: ['prometheus', 'grafana', 'datadog', 'new relic', 'splunk'],
    databases: ['postgresql', 'mongodb', 'mysql', 'redis', 'elasticsearch', 'dynamodb']
  },
  methodologies: ['agile', 'scrum', 'kanban', 'ci/cd', 'tdd', 'bdd', 'devops', 'gitops', 'sre']
};

// Company Tier Keywords
const COMPANY_TIERS = {
  faang: ['google', 'meta', 'facebook', 'amazon', 'apple', 'netflix', 'microsoft'],
  unicorns: ['stripe', 'airbnb', 'uber', 'lyft', 'robinhood', 'coinbase', 'plaid'],
  established: ['ibm', 'oracle', 'cisco', 'intel', 'amd', 'salesforce', 'adobe']
};

// Education Keywords
const EDUCATION_KEYWORDS = {
  topTier: ['mit', 'stanford', 'harvard', 'berkeley', 'cmu', 'caltech', 'princeton'],
  certifications: {
    aws: ['aws solutions architect', 'aws developer', 'aws devops engineer'],
    gcp: ['google cloud professional', 'google cloud architect'],
    kubernetes: ['cka', 'ckad', 'cks'],
    ai: ['tensorflow', 'pytorch', 'scikit-learn', 'deep learning', 'machine learning']
  }
};

export function calculateATSScore(resumeData: ResumeData): ATSScore {
  let totalScore = 0;
  const breakdown = {
    technicalSkills: 0,
    experience: 0,
    achievements: 0,
    projects: 0,
    education: 0,
    format: 0
  };

  const details = {
    technicalSkills: {
      languages: { score: 0, details: [] },
      frameworks: { score: 0, details: [] },
      tools: { score: 0, details: [] },
      methodologies: { score: 0, details: [] },
      bonuses: { score: 0, details: [] }
    },
    experience: {
      years: { score: 0, details: [] },
      title: { score: 0, details: [] },
      company: { score: 0, details: [] },
      progression: { score: 0, details: [] },
      bonuses: { score: 0, details: [] }
    },
    achievements: {
      metrics: { score: 0, details: [] },
      scale: { score: 0, details: [] },
      quality: { score: 0, details: [] },
      leadership: { score: 0, details: [] },
      business: { score: 0, details: [] }
    },
    projects: {
      complexity: { score: 0, details: [] },
      portfolio: { score: 0, details: [] },
      documentation: { score: 0, details: [] }
    },
    education: {
      degree: { score: 0, details: [] },
      university: { score: 0, details: [] },
      certifications: { score: 0, details: [] }
    },
    format: {
      structure: { score: 0, details: [] },
      headers: { score: 0, details: [] },
      contact: { score: 0, details: [] }
    }
  };

  const suggestions: string[] = [];
  const keywordMatches: string[] = [];
  const missingKeywords: string[] = [];

  // 1. Technical Skills & Keywords (40-50% weight)
  const technicalScore = calculateTechnicalSkillsScore(resumeData, details.technicalSkills, keywordMatches, missingKeywords);
  breakdown.technicalSkills = technicalScore;
  totalScore += technicalScore * 0.45; // 45% weight

  // 2. Professional Experience Relevance (25-30% weight)
  const experienceScore = calculateExperienceScore(resumeData, details.experience, keywordMatches, missingKeywords);
  breakdown.experience = experienceScore;
  totalScore += experienceScore * 0.275; // 27.5% weight

  // 3. Quantified Impact & Achievements (15-20% weight)
  const achievementsScore = calculateAchievementsScore(resumeData, details.achievements, keywordMatches, missingKeywords);
  breakdown.achievements = achievementsScore;
  totalScore += achievementsScore * 0.175; // 17.5% weight

  // 4. Projects & Technical Portfolio (10-15% weight)
  const projectsScore = calculateProjectsScore(resumeData, details.projects, keywordMatches, missingKeywords);
  breakdown.projects = projectsScore;
  totalScore += projectsScore * 0.125; // 12.5% weight

  // 5. Education & Certifications (8-12% weight)
  const educationScore = calculateEducationScore(resumeData, details.education, keywordMatches, missingKeywords);
  breakdown.education = educationScore;
  totalScore += educationScore * 0.1; // 10% weight

  // 6. Resume Format & ATS Compatibility (5-8% weight)
  const formatScore = calculateFormatScore(resumeData, details.format, keywordMatches, missingKeywords);
  breakdown.format = formatScore;
  totalScore += formatScore * 0.075; // 7.5% weight

  // Generate suggestions based on missing areas
  generateSuggestions(totalScore, breakdown, missingKeywords, suggestions);

  return {
    overall: Math.round(totalScore),
    breakdown,
    details,
    suggestions,
    keywordMatches,
    missingKeywords
  };
}

function calculateTechnicalSkillsScore(resumeData: ResumeData, details: any, keywordMatches: string[], missingKeywords: string[]): number {
  let score = 0;
  const skills = resumeData.skills;
  const allText = JSON.stringify(resumeData).toLowerCase();

  // Core Programming Languages (15-20%)
  let languageScore = 0;
  TECHNICAL_KEYWORDS.languages.core.forEach(lang => {
    if (allText.includes(lang)) {
      languageScore += 2;
      keywordMatches.push(lang);
    }
  });
  details.languages.score = Math.min(languageScore, 20);
  score += details.languages.score;

  // Frameworks & Libraries (10-12%)
  let frameworkScore = 0;
  Object.values(TECHNICAL_KEYWORDS.frameworks).flat().forEach(framework => {
    if (allText.includes(framework)) {
      frameworkScore += 1.5;
      keywordMatches.push(framework);
    }
  });
  details.frameworks.score = Math.min(frameworkScore, 12);
  score += details.frameworks.score;

  // Tools & Platforms (8-10%)
  let toolsScore = 0;
  Object.values(TECHNICAL_KEYWORDS.tools).flat().forEach(tool => {
    if (allText.includes(tool)) {
      toolsScore += 1;
      keywordMatches.push(tool);
    }
  });
  details.tools.score = Math.min(toolsScore, 10);
  score += details.tools.score;

  // Methodologies (5-8%)
  let methodologyScore = 0;
  TECHNICAL_KEYWORDS.methodologies.forEach(methodology => {
    if (allText.includes(methodology)) {
      methodologyScore += 1;
      keywordMatches.push(methodology);
    }
  });
  details.methodologies.score = Math.min(methodologyScore, 8);
  score += details.methodologies.score;

  // Bonuses
  let bonusScore = 0;
  
  // Full-Stack Proficiency (+15%)
  if (details.frameworks.score >= 8 && details.languages.score >= 15) {
    bonusScore += 15;
    details.bonuses.details.push('Full-Stack Proficiency');
  }
  
  // Cloud Certifications (+20%)
  if (details.tools.score >= 6) {
    bonusScore += 20;
    details.bonuses.details.push('Cloud & DevOps Skills');
  }
  
  // AI/ML Skills (+25%)
  if (allText.includes('machine learning') || allText.includes('ai') || allText.includes('tensorflow') || allText.includes('pytorch')) {
    bonusScore += 25;
    details.bonuses.details.push('AI/ML Skills (2025 Trend)');
  }
  
  // System Design Experience (+10%)
  if (allText.includes('system design') || allText.includes('architecture') || allText.includes('microservices')) {
    bonusScore += 10;
    details.bonuses.details.push('System Design Experience');
  }

  details.bonuses.score = bonusScore;
  score += bonusScore;

  return Math.min(score, 100);
}

function calculateExperienceScore(resumeData: ResumeData, details: any, keywordMatches: string[], missingKeywords: string[]): number {
  let score = 0;
  const experiences = resumeData.experiences;

  if (!experiences || experiences.length === 0) {
    return 0;
  }

  // Years of Experience Match (8-10%)
  const totalYears = experiences.reduce((total, exp) => {
    if (exp.startDate && exp.endDate && !exp.current) {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      return total + (end.getFullYear() - start.getFullYear());
    }
    return total;
  }, 0);
  
  if (totalYears >= 5) details.years.score = 10;
  else if (totalYears >= 3) details.years.score = 8;
  else if (totalYears >= 1) details.years.score = 6;
  else details.years.score = 4;
  
  score += details.years.score;

  // Job Title Alignment (8-10%)
  let titleScore = 0;
  const techTitles = ['engineer', 'developer', 'architect', 'lead', 'manager', 'consultant'];
  experiences.forEach(exp => {
    if (exp.title) {
      const title = exp.title.toLowerCase();
      techTitles.forEach(techTitle => {
        if (title.includes(techTitle)) {
          titleScore += 2;
          keywordMatches.push(exp.title);
        }
      });
    }
  });
  details.title.score = Math.min(titleScore, 10);
  score += details.title.score;

  // Tech Company Experience (5-7%)
  let companyScore = 0;
  experiences.forEach(exp => {
    if (exp.company) {
      const company = exp.company.toLowerCase();
      Object.values(COMPANY_TIERS).flat().forEach(tierCompany => {
        if (company.includes(tierCompany)) {
          companyScore += 3;
          details.company.details.push(exp.company);
        }
      });
    }
  });
  details.company.score = Math.min(companyScore, 7);
  score += details.company.score;

  // Career Progression (4-5%)
  if (experiences.length >= 2) {
    details.progression.score = 5;
    details.progression.details.push('Multiple positions showing career growth');
  } else {
    details.progression.score = 3;
  }
  score += details.progression.score;

  // Bonuses
  let bonusScore = 0;
  
  // Startup Experience (+5%)
  if (experiences.some(exp => exp.company && exp.company.toLowerCase().includes('startup'))) {
    bonusScore += 5;
    details.bonuses.details.push('Startup Experience');
  }
  
  // Open Source Contributions (+5-10%)
  if (resumeData.projects && resumeData.projects.some(proj => proj.github)) {
    bonusScore += 5;
    details.bonuses.details.push('Open Source Contributions');
  }

  details.bonuses.score = bonusScore;
  score += bonusScore;

  return Math.min(score, 100);
}

function calculateAchievementsScore(resumeData: ResumeData, details: any, keywordMatches: string[], missingKeywords: string[]): number {
  let score = 0;
  const achievements = resumeData.achievements;
  const experiences = resumeData.experiences;

  if (!achievements || achievements.length === 0) {
    return 0;
  }

  // Performance Improvements
  let metricsScore = 0;
  achievements.forEach(achievement => {
    const text = achievement.description.toLowerCase();
    if (text.includes('%') || text.includes('improved') || text.includes('reduced') || text.includes('increased')) {
      metricsScore += 4;
      details.metrics.details.push(achievement.title);
    }
  });
  details.metrics.score = Math.min(metricsScore, 20);
  score += details.metrics.score;

  // Scale Metrics
  let scaleScore = 0;
  achievements.forEach(achievement => {
    const text = achievement.description.toLowerCase();
    if (text.includes('million') || text.includes('100k') || text.includes('1m+') || text.includes('users')) {
      scaleScore += 4;
      details.scale.details.push(achievement.title);
    }
  });
  details.scale.score = Math.min(scaleScore, 20);
  score += details.scale.score;

  // Code Quality
  let qualityScore = 0;
  achievements.forEach(achievement => {
    const text = achievement.description.toLowerCase();
    if (text.includes('test coverage') || text.includes('quality') || text.includes('performance')) {
      qualityScore += 4;
      details.quality.details.push(achievement.title);
    }
  });
  details.quality.score = Math.min(qualityScore, 20);
  score += details.quality.score;

  // Team Leadership
  let leadershipScore = 0;
  achievements.forEach(achievement => {
    const text = achievement.description.toLowerCase();
    if (text.includes('team') || text.includes('led') || text.includes('managed')) {
      leadershipScore += 4;
      details.leadership.details.push(achievement.title);
    }
  });
  details.leadership.score = Math.min(leadershipScore, 20);
  score += details.leadership.score;

  // Business Impact
  let businessScore = 0;
  achievements.forEach(achievement => {
    const text = achievement.description.toLowerCase();
    if (text.includes('revenue') || text.includes('business') || text.includes('cost')) {
      businessScore += 4;
      details.business.details.push(achievement.title);
    }
  });
  details.business.score = Math.min(businessScore, 20);
  score += details.business.score;

  return Math.min(score, 100);
}

function calculateProjectsScore(resumeData: ResumeData, details: any, keywordMatches: string[], missingKeywords: string[]): number {
  let score = 0;
  const projects = resumeData.projects;

  if (!projects || projects.length === 0) {
    return 0;
  }

  // Project Complexity
  let complexityScore = 0;
  projects.forEach(project => {
    const description = project.description.toLowerCase();
    
    if (description.includes('microservices') || description.includes('distributed')) {
      complexityScore += 3;
      details.complexity.details.push('System Architecture');
    }
    if (description.includes('machine learning') || description.includes('data pipeline')) {
      complexityScore += 4;
      details.complexity.details.push('Data Engineering');
    }
    if (description.includes('mobile') || description.includes('ios') || description.includes('android')) {
      complexityScore += 2;
      details.complexity.details.push('Mobile Development');
    }
    if (description.includes('full-stack') || description.includes('frontend') && description.includes('backend')) {
      complexityScore += 2;
      details.complexity.details.push('Full-Stack Web');
    }
    if (description.includes('ci/cd') || description.includes('devops') || description.includes('kubernetes')) {
      complexityScore += 3;
      details.complexity.details.push('DevOps/Infrastructure');
    }
  });
  details.complexity.score = Math.min(complexityScore, 30);
  score += details.complexity.score;

  // Portfolio Quality
  let portfolioScore = 0;
  projects.forEach(project => {
    if (project.github) portfolioScore += 5;
    if (project.demo) portfolioScore += 5;
  });
  details.portfolio.score = Math.min(portfolioScore, 40);
  score += details.portfolio.score;

  // Documentation
  let documentationScore = 0;
  projects.forEach(project => {
    if (project.description && project.description.length > 100) {
      documentationScore += 5;
    }
  });
  details.documentation.score = Math.min(documentationScore, 30);
  score += details.documentation.score;

  return Math.min(score, 100);
}

function calculateEducationScore(resumeData: ResumeData, details: any, keywordMatches: string[], missingKeywords: string[]): number {
  let score = 0;
  const education = resumeData.education;

  if (!education || education.length === 0) {
    return 0;
  }

  // Degree Type
  education.forEach((edu) => {
    if (edu.degree) {
      const degree = edu.degree.toLowerCase();
      if (degree.includes('computer science') || degree.includes('engineering')) {
        details.degree.score = 20;
        details.degree.details.push('CS/Engineering Degree');
      } else if (degree.includes('bachelor')) {
        details.degree.score = 15;
        details.degree.details.push('Bachelor\'s Degree');
      } else if (degree.includes('master') || degree.includes('phd')) {
        details.degree.score = 25;
        details.degree.details.push('Advanced Degree');
      }
    }
  });
  score += details.degree.score;

  // University Tier
  education.forEach(edu => {
    if (edu.institution) {
      const institution = edu.institution.toLowerCase();
      const topTiers = (EDUCATION_KEYWORDS?.topTier ?? []);
      for (const topUni of topTiers) {
        if (institution.includes(topUni)) {
          details.university.score = 15;
          details.university.details.push('Top-Tier University');
          break;
        }
      }
    }
  });
  score += details.university.score;

  // Certifications
  let certificationScore = 0;
  const allText = JSON.stringify(resumeData).toLowerCase();
  
  Object.entries(EDUCATION_KEYWORDS.certifications).forEach(([type, certs]) => {
    (certs as string[]).forEach((cert: string) => {
      if (allText.includes(cert)) {
        if (type === 'aws') certificationScore += 12;
        else if (type === 'gcp') certificationScore += 10;
        else if (type === 'kubernetes') certificationScore += 8;
        else if (type === 'ai') certificationScore += 15;
        
        details.certifications.details.push(cert);
      }
    });
  });
  
  details.certifications.score = Math.min(certificationScore, 40);
  score += details.certifications.score;

  return Math.min(score, 100);
}

function calculateFormatScore(resumeData: ResumeData, details: any, keywordMatches: string[], missingKeywords: string[]): number {
  let score = 0;

  // Structure
  if (resumeData.sections && resumeData.sections.length >= 6) {
    details.structure.score = 25;
    details.structure.details.push('Complete section structure');
  } else {
    details.structure.score = 15;
  }
  score += details.structure.score;

  // Headers
  const standardHeaders = ['personal', 'summary', 'experience', 'education', 'skills', 'projects'];
  let headerScore = 0;
  if (resumeData.sections) {
    resumeData.sections.forEach(section => {
      if (standardHeaders.some(header => section.title.toLowerCase().includes(header))) {
        headerScore += 4;
      }
    });
  }
  details.headers.score = Math.min(headerScore, 25);
  score += details.headers.score;

  // Contact Information
  let contactScore = 0;
  if (resumeData.contact.email) contactScore += 10;
  if (resumeData.contact.phone) contactScore += 5;
  if (resumeData.contact.linkedin) contactScore += 5;
  if (resumeData.contact.github) contactScore += 5;
  details.contact.score = contactScore;
  score += contactScore;

  return Math.min(score, 100);
}

function generateSuggestions(overallScore: number, breakdown: any, missingKeywords: string[], suggestions: string[]) {
  if (overallScore < 70) {
    suggestions.push('Focus on adding more technical keywords and skills');
    suggestions.push('Include quantifiable achievements with metrics');
    suggestions.push('Add more detailed project descriptions');
  }
  
  if (breakdown.technicalSkills < 60) {
    suggestions.push('Expand your technical skills section with more programming languages');
    suggestions.push('Include trending technologies like AI/ML, cloud platforms');
  }
  
  if (breakdown.experience < 60) {
    suggestions.push('Highlight career progression and increasing responsibilities');
    suggestions.push('Emphasize experience with well-known tech companies');
  }
  
  if (breakdown.achievements < 60) {
    suggestions.push('Add more quantifiable achievements with specific metrics');
    suggestions.push('Include business impact and scale metrics');
  }
  
  if (breakdown.projects < 60) {
    suggestions.push('Add more complex projects with system architecture details');
    suggestions.push('Include live demos and GitHub links for projects');
  }
  
  if (breakdown.education < 60) {
    suggestions.push('Consider adding relevant certifications (AWS, GCP, Kubernetes)');
    suggestions.push('Highlight any AI/ML coursework or certifications');
  }
  
  if (breakdown.format < 60) {
    suggestions.push('Ensure all standard resume sections are present');
    suggestions.push('Add professional contact information and LinkedIn/GitHub links');
  }
}

export function getOverallATSScore(scores: ATSScore): number {
  return scores.overall;
}
