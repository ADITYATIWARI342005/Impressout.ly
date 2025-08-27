import {
	users,
	resumes,
	portfolios,
	coverLetters,
	projects,
	type User,
	type UpsertUser,
	type Resume,
	type Portfolio,
	type CoverLetter,
	type Project,
	type InsertResume,
	type InsertPortfolio,
	type InsertCoverLetter,
	type InsertProject,
} from "./schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
	// User operations
	getUser(id: string): Promise<User | undefined>;
	upsertUser(user: UpsertUser): Promise<User>;
	
	// Resume operations
	createResume(resume: InsertResume): Promise<Resume>;
	getResume(id: string): Promise<Resume | undefined>;
	getUserResumes(userId: string): Promise<Resume[]>;
	updateResume(id: string, data: Partial<InsertResume>): Promise<Resume>;
	deleteResume(id: string): Promise<void>;
	
	// Portfolio operations
	createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
	getUserPortfolios(userId: string): Promise<Portfolio[]>;
	updatePortfolio(id: string, data: Partial<InsertPortfolio>): Promise<Portfolio>;
	deletePortfolio(id: string): Promise<void>;
	
	// Cover Letter operations
	createCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter>;
	getUserCoverLetters(userId: string): Promise<CoverLetter[]>;
	updateCoverLetter(id: string, data: Partial<InsertCoverLetter>): Promise<CoverLetter>;
	deleteCoverLetter(id: string): Promise<void>;
	
	// Project operations
	createProject(project: InsertProject): Promise<Project>;
	getUserProjects(userId: string): Promise<Project[]>;
	updateProject(id: string, data: Partial<InsertProject>): Promise<Project>;
	deleteProject(id: string): Promise<void>;
}

// Mock storage for local development without database
class MockStorage implements IStorage {
	private resumes: Resume[] = [];
	private portfolios: Portfolio[] = [];
	private coverLetters: CoverLetter[] = [];
	private projects: Project[] = [];
	private users: User[] = [];

	async getUser(id: string): Promise<User | undefined> {
		return this.users.find(u => u.id === id);
	}

	async upsertUser(userData: UpsertUser): Promise<User> {
		const userId = 'mock-user-id';
		const existingUser = this.users.find(u => u.id === userId);
		if (existingUser) {
			Object.assign(existingUser, { ...userData, updatedAt: new Date() });
			return existingUser;
		} else {
			const newUser = { 
				id: userId,
				...userData, 
				createdAt: new Date(), 
				updatedAt: new Date() 
			} as User;
			this.users.push(newUser);
			return newUser;
		}
	}

	async createResume(resume: InsertResume): Promise<Resume> {
		const newResume = {
			id: `resume-${Date.now()}`,
			...resume,
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Resume;
		this.resumes.push(newResume);
		return newResume;
	}

	async getResume(id: string): Promise<Resume | undefined> {
		return this.resumes.find(r => r.id === id);
	}

	async getUserResumes(userId: string): Promise<Resume[]> {
		return this.resumes.filter(r => r.userId === userId);
	}

	async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume> {
		const resume = this.resumes.find(r => r.id === id);
		if (!resume) throw new Error('Resume not found');
		Object.assign(resume, { ...data, updatedAt: new Date() });
		return resume;
	}

	async deleteResume(id: string): Promise<void> {
		const index = this.resumes.findIndex(r => r.id === id);
		if (index > -1) this.resumes.splice(index, 1);
	}

	async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
		const newPortfolio = {
			id: `portfolio-${Date.now()}`,
			...portfolio,
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Portfolio;
		this.portfolios.push(newPortfolio);
		return newPortfolio;
	}

	async getUserPortfolios(userId: string): Promise<Portfolio[]> {
		return this.portfolios.filter(p => p.userId === userId);
	}

	async updatePortfolio(id: string, data: Partial<InsertPortfolio>): Promise<Portfolio> {
		const portfolio = this.portfolios.find(p => p.id === id);
		if (!portfolio) throw new Error('Portfolio not found');
		Object.assign(portfolio, { ...data, updatedAt: new Date() });
		return portfolio;
	}

	async deletePortfolio(id: string): Promise<void> {
		const index = this.portfolios.findIndex(p => p.id === id);
		if (index > -1) this.portfolios.splice(index, 1);
	}

	async createCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter> {
		const newCoverLetter = {
			id: `cover-letter-${Date.now()}`,
			...coverLetter,
			createdAt: new Date(),
			updatedAt: new Date(),
		} as CoverLetter;
		this.coverLetters.push(newCoverLetter);
		return newCoverLetter;
	}

	async getUserCoverLetters(userId: string): Promise<CoverLetter[]> {
		return this.coverLetters.filter(c => c.userId === userId);
	}

	async updateCoverLetter(id: string, data: Partial<InsertCoverLetter>): Promise<CoverLetter> {
		const coverLetter = this.coverLetters.find(c => c.id === id);
		if (!coverLetter) throw new Error('Cover letter not found');
		Object.assign(coverLetter, { ...data, updatedAt: new Date() });
		return coverLetter;
	}

	async deleteCoverLetter(id: string): Promise<void> {
		const index = this.coverLetters.findIndex(c => c.id === id);
		if (index > -1) this.coverLetters.splice(index, 1);
	}

	async createProject(project: InsertProject): Promise<Project> {
		const newProject = {
			id: `project-${Date.now()}`,
			...project,
			createdAt: new Date(),
			updatedAt: new Date(),
		} as Project;
		this.projects.push(newProject);
		return newProject;
	}

	async getUserProjects(userId: string): Promise<Project[]> {
		return this.projects.filter(p => p.userId === userId);
	}

	async updateProject(id: string, data: Partial<InsertProject>): Promise<Project> {
		const project = this.projects.find(p => p.id === id);
		if (!project) throw new Error('Project not found');
		Object.assign(project, { ...data, updatedAt: new Date() });
		return project;
	}

	async deleteProject(id: string): Promise<void> {
		const index = this.projects.findIndex(p => p.id === id);
		if (index > -1) this.projects.splice(index, 1);
	}
}

export class DatabaseStorage implements IStorage {
	// User operations
	async getUser(id: string): Promise<User | undefined> {
		if (!db) return undefined;
		const [user] = await db.select().from(users).where(eq(users.id, id));
		return user;
	}

	async upsertUser(userData: UpsertUser): Promise<User> {
		if (!db) throw new Error('Database not available');
		const [user] = await db
			.insert(users)
			.values(userData)
			.onConflictDoUpdate({
				target: users.id,
				set: {
					...userData,
					updatedAt: new Date(),
				},
			})
			.returning();
		return user;
	}

	// Resume operations
	async createResume(resume: InsertResume): Promise<Resume> {
		if (!db) throw new Error('Database not available');
		const [newResume] = await db.insert(resumes).values(resume).returning();
		return newResume;
	}

	async getResume(id: string): Promise<Resume | undefined> {
		if (!db) return undefined;
		const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
		return resume;
	}

	async getUserResumes(userId: string): Promise<Resume[]> {
		if (!db) return [];
		return await db
			.select()
			.from(resumes)
			.where(eq(resumes.userId, userId))
			.orderBy(desc(resumes.updatedAt));
	}

	async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume> {
		if (!db) throw new Error('Database not available');
		const [updatedResume] = await db
			.update(resumes)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(resumes.id, id))
			.returning();
		return updatedResume;
	}

	async deleteResume(id: string): Promise<void> {
		if (!db) return;
		await db.delete(resumes).where(eq(resumes.id, id));
	}

	// Portfolio operations
	async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
		if (!db) throw new Error('Database not available');
		const [newPortfolio] = await db.insert(portfolios).values(portfolio).returning();
		return newPortfolio;
	}

	async getUserPortfolios(userId: string): Promise<Portfolio[]> {
		if (!db) return [];
		return await db
			.select()
			.from(portfolios)
			.where(eq(portfolios.userId, userId))
			.orderBy(desc(portfolios.updatedAt));
	}

	async updatePortfolio(id: string, data: Partial<InsertPortfolio>): Promise<Portfolio> {
		if (!db) throw new Error('Database not available');
		const [updatedPortfolio] = await db
			.update(portfolios)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(portfolios.id, id))
			.returning();
		return updatedPortfolio;
	}

	async deletePortfolio(id: string): Promise<void> {
		if (!db) return;
		await db.delete(portfolios).where(eq(portfolios.id, id));
	}

	// Cover Letter operations
	async createCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter> {
		if (!db) throw new Error('Database not available');
		const [newCoverLetter] = await db.insert(coverLetters).values(coverLetter).returning();
		return newCoverLetter;
	}

	async getUserCoverLetters(userId: string): Promise<CoverLetter[]> {
		if (!db) return [];
		return await db
			.select()
			.from(coverLetters)
			.where(eq(coverLetters.userId, userId))
			.orderBy(desc(coverLetters.updatedAt));
	}

	async updateCoverLetter(id: string, data: Partial<InsertCoverLetter>): Promise<CoverLetter> {
		if (!db) throw new Error('Database not available');
		const [updatedCoverLetter] = await db
			.update(coverLetters)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(coverLetters.id, id))
			.returning();
		return updatedCoverLetter;
	}

	async deleteCoverLetter(id: string): Promise<void> {
		if (!db) return;
		await db.delete(coverLetters).where(eq(coverLetters.id, id));
	}

	// Project operations
	async createProject(project: InsertProject): Promise<Project> {
		if (!db) throw new Error('Database not available');
		const [newProject] = await db.insert(projects).values(project).returning();
		return newProject;
	}

	async getUserProjects(userId: string): Promise<Project[]> {
		if (!db) return [];
		return await db
			.select()
			.from(projects)
			.where(eq(projects.userId, userId))
			.orderBy(desc(projects.updatedAt));
	}

	async updateProject(id: string, data: Partial<InsertProject>): Promise<Project> {
		if (!db) throw new Error('Database not available');
		const [updatedProject] = await db
			.update(projects)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(projects.id, id))
			.returning();
		return updatedProject;
	}

	async deleteProject(id: string): Promise<void> {
		if (!db) return;
		await db.delete(projects).where(eq(projects.id, id));
	}
}

// Use mock storage for local development without database
export const storage = new MockStorage();
// Prefer database storage when a database client is available
export const persistentStorage: IStorage = db ? new DatabaseStorage() : new MockStorage();


