import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useEffect, useState } from "react";

type Providers = { google: boolean; github: boolean; linkedin: boolean };

export default function Login() {
  const [providers, setProviders] = useState<Providers>({ google: false, github: false, linkedin: false });
  useEffect(() => {
    fetch("/api/auth/providers").then(r => r.json()).then(setProviders).catch(() => setProviders({ google: true, github: true, linkedin: true }));
  }, []);
  const startGoogle = () => {
    window.location.href = "/api/auth/google";
  };
  const startGitHub = () => {
    window.location.href = "/api/auth/github";
  };
  const startLinkedIn = () => {
    window.location.href = "/api/auth/linkedin";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Sign in</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 space-y-4">
          {providers.google && (
            <button onClick={startGoogle} className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">Continue with Google</button>
          )}
          {providers.github && (
            <button onClick={startGitHub} className="w-full py-3 rounded bg-gray-900 hover:bg-black text-white font-semibold">Continue with GitHub</button>
          )}
          {providers.linkedin && (
            <button onClick={startLinkedIn} className="w-full py-3 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold">Continue with LinkedIn</button>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-6 text-center">By continuing, you agree to our Terms and acknowledge our Privacy Policy.</p>
      </main>
      <Footer />
    </div>
  );
}




