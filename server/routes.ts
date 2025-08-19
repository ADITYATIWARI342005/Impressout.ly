import type { Express } from "express";
import { createServer, type Server } from "http";
import { persistentStorage as storage } from "./storage";
import { insertResumeSchema, insertPortfolioSchema, insertCoverLetterSchema, insertProjectSchema } from "@shared/schema";
// import { analyzeResumeContent, generateJobMatchingKeywords, improveBulletPoint } from "./openai";
import passport from "passport";
import jwt from "jsonwebtoken";
import multer from "multer";
import { z } from "zod";

// Setup file upload middleware
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowedTypes.includes(file.mimetype));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Discover available OAuth providers based on env
  app.get('/api/auth/providers', (_req, res) => {
    res.json({
      google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      github: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      linkedin: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
    });
  });
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
      const user: any = (req as any).user;
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev-secret', { algorithm: 'HS256', expiresIn: '7d' });
      res.redirect(`/auth/callback?token=${token}`);
    });
  } else {
    app.get('/api/auth/google', (_req, res) => res.status(501).json({ message: 'Google auth not configured' }));
    app.get('/api/auth/google/callback', (_req, res) => res.status(501).json({ message: 'Google auth not configured' }));
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
    app.get('/api/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
      const user: any = (req as any).user;
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev-secret', { algorithm: 'HS256', expiresIn: '7d' });
      res.redirect(`/auth/callback?token=${token}`);
    });
  } else {
    app.get('/api/auth/github', (_req, res) => res.status(501).json({ message: 'GitHub auth not configured' }));
    app.get('/api/auth/github/callback', (_req, res) => res.status(501).json({ message: 'GitHub auth not configured' }));
  }

  // LinkedIn OAuth
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    app.get('/api/auth/linkedin', passport.authenticate('linkedin'));
    app.get('/api/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
      const user: any = (req as any).user;
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'dev-secret', { algorithm: 'HS256', expiresIn: '7d' });
      res.redirect(`/auth/callback?token=${token}`);
    });
  } else {
    app.get('/api/auth/linkedin', (_req, res) => res.status(501).json({ message: 'LinkedIn auth not configured' }));
    app.get('/api/auth/linkedin/callback', (_req, res) => res.status(501).json({ message: 'LinkedIn auth not configured' }));
  }

  // Remove legacy local login endpoints in favor of OAuth-only flow

  const requireJwt = passport.authenticate('jwt', { session: false });

  // Current user endpoint for client hook
  app.get('/api/auth/user', requireJwt, async (req, res) => {
    const userId = (req.user as any)?.id || (req as any).user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  });
  // Resume routes
  app.post('/api/resumes', requireJwt, async (req, res) => {
    try {
      const userId = (req.user as any)?.id || (req as any).user?.sub || 'local-user';
      const resumeData = insertResumeSchema.parse({ ...req.body, userId });
      const resume = await storage.createResume(resumeData);
      res.json(resume);
    } catch (error) {
      console.error("Error creating resume:", error);
      res.status(400).json({ message: "Failed to create resume" });
    }
  });

  app.get('/api/resumes', requireJwt, async (req, res) => {
    try {
      const userId = (req.user as any)?.id || (req as any).user?.sub;
      const resumes = await storage.getUserResumes(userId || 'local-user');
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.get('/api/resumes/:id', requireJwt, async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  app.put('/api/resumes/:id', requireJwt, async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const updateData = insertResumeSchema.partial().parse(req.body);
      const updatedResume = await storage.updateResume(req.params.id, updateData);
      res.json(updatedResume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(400).json({ message: "Failed to update resume" });
    }
  });

  app.delete('/api/resumes/:id', requireJwt, async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      await storage.deleteResume(req.params.id);
      res.json({ message: "Resume deleted successfully" });
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Resume upload route
  app.post('/api/resumes/upload', requireJwt, upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // TODO: Implement PDF/DOC parsing to extract resume content
      // For now, return a placeholder response
      res.json({ 
        message: "File uploaded successfully",
        filename: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error("Error uploading resume:", error);
      res.status(500).json({ message: "Failed to upload resume" });
    }
  });

  // AI endpoints disabled
  app.all('/api/ai/*', (_req, res) => res.status(501).json({ message: 'AI features disabled' }));

  // Portfolio routes
  app.post('/api/portfolios', requireJwt, async (req, res) => {
    try {
      const userId = (req.user as any)?.id || (req as any).user?.sub || 'local-user';
      const portfolioData = insertPortfolioSchema.parse({ ...req.body, userId });
      const portfolio = await storage.createPortfolio(portfolioData);
      res.json(portfolio);
    } catch (error) {
      console.error("Error creating portfolio:", error);
      res.status(400).json({ message: "Failed to create portfolio" });
    }
  });

  app.get('/api/portfolios', requireJwt, async (req, res) => {
    try {
      const userId = (req.user as any)?.id || (req as any).user?.sub;
      const portfolios = await storage.getUserPortfolios(userId || 'local-user');
      res.json(portfolios);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });

  // Cover Letter routes
  app.post('/api/cover-letters', requireJwt, async (req, res) => {
    try {
      const userId = (req.user as any)?.id || (req as any).user?.sub || 'local-user';
      const coverLetterData = insertCoverLetterSchema.parse({ ...req.body, userId });
      const coverLetter = await storage.createCoverLetter(coverLetterData);
      res.json(coverLetter);
    } catch (error) {
      console.error("Error creating cover letter:", error);
      res.status(400).json({ message: "Failed to create cover letter" });
    }
  });

  app.get('/api/cover-letters', requireJwt, async (req, res) => {
    try {
      const userId = (req.user as any)?.id || (req as any).user?.sub;
      const coverLetters = await storage.getUserCoverLetters(userId || 'local-user');
      res.json(coverLetters);
    } catch (error) {
      console.error("Error fetching cover letters:", error);
      res.status(500).json({ message: "Failed to fetch cover letters" });
    }
  });

  // Project routes
  app.post('/api/projects', requireJwt, async (req, res) => {
    try {
      const userId = (req.user as any)?.id || (req as any).user?.sub || 'local-user';
      const projectData = insertProjectSchema.parse({ ...req.body, userId });
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get('/api/projects', requireJwt, async (req, res) => {
    try {
      const userId = (req.user as any)?.id || (req as any).user?.sub;
      const projects = await storage.getUserProjects(userId || 'local-user');
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
