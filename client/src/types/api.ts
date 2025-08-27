export type User = {
	id: string;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
	profileImageUrl: string | null;
	createdAt: string | Date;
	updatedAt: string | Date;
};

export type Resume = {
	id: string;
	userId: string;
	title: string;
	content: unknown;
	atsScore: number | null;
	isPublic: boolean | null;
	createdAt: string | Date;
	updatedAt: string | Date;
};

export type Portfolio = {
	id: string;
	userId: string;
	title: string;
	content: unknown;
	resumeId: string | null;
	isPublic: boolean | null;
	createdAt: string | Date;
	updatedAt: string | Date;
};

export type CoverLetter = {
	id: string;
	userId: string;
	title: string;
	content: string;
	resumeId: string | null;
	createdAt: string | Date;
	updatedAt: string | Date;
};

export type Project = {
	id: string;
	userId: string;
	title: string;
	description: string | null;
	technologies: string | null;
	githubUrl: string | null;
	liveUrl: string | null;
	createdAt: string | Date;
	updatedAt: string | Date;
};
