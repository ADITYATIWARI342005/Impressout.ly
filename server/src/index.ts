import express, { type Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { registerRoutes } from "./routes";
import session from "express-session";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { storage, persistentStorage } from "./storage";
import cors from "cors";

function log(message: string, source = "express") {
	const formattedTime = new Date().toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
	console.log(`${formattedTime} [${source}] ${message}`);
}

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for client origin
app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
		credentials: true,
	})
);

// Sessions (for OAuth)
app.use(
	session({
		secret: process.env.SESSION_SECRET || "change-me-in-prod",
		resave: false,
		saveUninitialized: false,
	}),
);

app.use(passport.initialize());
app.use(passport.session());

type JwtPayload = { sub: string };
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET || "dev-secret",
			algorithms: ["HS256"],
		},
		async (payload: JwtPayload, done: (err: any, user?: any, info?: any) => void) => {
			try {
				const user = await persistentStorage.getUser(payload.sub);
				if (!user) return done(null, false);
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		},
	),
);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
			},
			async (_accessToken: string, _refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
				try {
					const email = profile.emails?.[0]?.value ?? "";
					const user = await persistentStorage.upsertUser({
						id: profile.id,
						email,
						firstName: profile.name?.givenName ?? "",
						lastName: profile.name?.familyName ?? "",
						profileImageUrl: profile.photos?.[0]?.value ?? "",
					} as any);
					done(null, user);
				} catch (e) {
					done(e as any);
				}
			},
		),
	);
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
	passport.use(
		new GitHubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				callbackURL: process.env.GITHUB_CALLBACK_URL || "/api/auth/github/callback",
			},
			async (_accessToken: string, _refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
				try {
					const email = profile.emails?.[0]?.value ?? "";
					const user = await persistentStorage.upsertUser({
						id: profile.id,
						email,
						firstName: profile.displayName || profile.username || "",
						lastName: "",
						profileImageUrl: profile.photos?.[0]?.value ?? "",
					} as any);
					done(null, user);
				} catch (e) {
					done(e as any);
				}
			},
		),
	);
}


passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await persistentStorage.getUser(id);
		done(null, user || null);
	} catch (e) {
		done(e as any, null);
	}
});

app.use((req, res, next) => {
	const start = Date.now();
	const path = req.path;
	let capturedJsonResponse: Record<string, any> | undefined = undefined;

	const originalResJson = res.json;
	res.json = function (bodyJson, ...args) {
		capturedJsonResponse = bodyJson;
		return originalResJson.apply(res, [bodyJson, ...args]);
	};

	res.on("finish", () => {
		const duration = Date.now() - start;
		if (path.startsWith("/api")) {
			let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
			if (capturedJsonResponse) {
				logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
			}

			if (logLine.length > 80) {
				logLine = logLine.slice(0, 79) + "…";
			}

			log(logLine);
		}
	});

	next();
});

(async () => {
	const server = await registerRoutes(app);

	app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
		const status = err.status || err.statusCode || 500;
		const message = err.message || "Internal Server Error";

		res.status(status).json({ message });
		throw err;
	});

	// Serve API only; client is separate app
	const desiredPort = parseInt(process.env.PORT || '5000', 10);

	function startServer(port: number, attemptsRemaining = 10) {
		const onError = (err: any) => {
			if (err && err.code === 'EADDRINUSE' && attemptsRemaining > 0) {
				const nextPort = port + 1;
				log(`port ${port} in use, trying ${nextPort}`);
				server.removeListener('error', onError);
				startServer(nextPort, attemptsRemaining - 1);
			} else {
				throw err;
			}
		};

		server.once('error', onError);
		server.listen({
			port,
			host: "0.0.0.0",
		}, () => {
			server.removeListener('error', onError);
			log(`API serving on port ${port}`);
		});
	}

	startServer(desiredPort);
})();


