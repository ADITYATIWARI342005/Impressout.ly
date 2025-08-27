import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
	const [providers, setProviders] = useState<{ google: boolean; github: boolean } | null>(null);

	useEffect(() => {
		fetch(`${API_BASE}/api/auth/providers`)
			.then(res => res.json())
			.then(setProviders)
			.catch(() => setProviders({ google: false, github: false }));
	}, []);

	return (
		<div className="p-4">
			<h1 className="text-xl font-semibold mb-4">Login</h1>
			<div className="space-y-2">
				{providers?.google && (
					<button className="btn" onClick={() => (window.location.href = `${API_BASE}/api/auth/google`)}>Continue with Google</button>
				)}
				{providers?.github && (
					<button className="btn" onClick={() => (window.location.href = `${API_BASE}/api/auth/github`)}>Continue with GitHub</button>
				)}
				{!providers && <div>Loading…</div>}
				{import.meta.env.DEV && (
					<button className="btn" onClick={() => (window.location.href = `${API_BASE}/api/auth/dev-login`)}>Dev Login</button>
				)}
			</div>
		</div>
	);
}




