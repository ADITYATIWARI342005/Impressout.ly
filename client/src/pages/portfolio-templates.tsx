import { useMemo } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Sparkles, ExternalLink } from "lucide-react";

type Template = {
  id: string;
  name: string;
  style: string;
  description: string;
};

export default function PortfolioTemplates() {
  const [, setLocation] = useLocation();

  const templates: Template[] = useMemo(() => [
    { id: "clean-tech", name: "Clean Tech", style: "from-sky-50 to-blue-50", description: "Minimal, typography-first." },
    { id: "bold-gradient", name: "Bold Gradient", style: "from-fuchsia-100 to-rose-100", description: "Vibrant gradients and bold headings." },
    { id: "neo-brutal", name: "Neo Brutal", style: "from-yellow-50 to-amber-100", description: "Cardy, chunky and playful." },
    { id: "glassmorphism", name: "Glassmorphism", style: "from-slate-50 to-slate-100", description: "Frosted panels with depth." },
    { id: "dark-pro", name: "Dark Pro", style: "from-gray-900 to-slate-900", description: "Sleek and professional in dark mode." },
    { id: "paper-craft", name: "Paper Craft", style: "from-stone-50 to-zinc-50", description: "Editorial, resume-like layout." },
    { id: "product-designer", name: "Product Designer", style: "from-pink-50 to-rose-50", description: "Case-study focused." },
    { id: "developer-folio", name: "DeveloperFolio", style: "from-indigo-50 to-purple-50", description: "Classic developer showcase." },
    { id: "grid-mag", name: "Grid Mag", style: "from-blue-50 to-cyan-50", description: "Magazine grid with image focus." },
    { id: "terminal", name: "Terminal", style: "from-gray-900 to-black", description: "Retro hacker vibe." },
    { id: "folio-hero", name: "Folio Hero", style: "from-emerald-50 to-teal-50", description: "Hero-first conversion layout." },
    { id: "elevation", name: "Elevation", style: "from-violet-50 to-indigo-50", description: "Raised panels and subtle motion." },
    { id: "parallax-hero", name: "Parallax Hero", style: "from-sky-100 to-indigo-100", description: "Scroll parallax hero with reveal sections." },
    { id: "split-panels", name: "Split Panels", style: "from-amber-50 to-orange-100", description: "Split layout with animated section transitions." },
    { id: "cards-masonry", name: "Cards Masonry", style: "from-lime-50 to-emerald-100", description: "Animated cards grid with staggered reveal." },
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Templates Library</h1>
            <p className="text-gray-600 dark:text-gray-400">15 professional, animated templates inspired by popular open-source portfolios</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> Animated
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="overflow-hidden group border border-gray-200 dark:border-gray-800 animate-fade-in-up hover:shadow-xl transition-all duration-300">
              <div className={`h-36 bg-gradient-to-br ${tpl.style} relative`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute -inset-12 bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tpl.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tpl.description}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="transition-transform hover:-translate-y-0.5" onClick={() => setLocation(`/portfolio-editor/${tpl.id}`)}>
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline" className="transition-transform hover:-translate-y-0.5" onClick={() => setLocation(`/portfolio-editor/${tpl.id}?preview=true`)}>
                    <ExternalLink className="h-4 w-4 mr-1" /> Preview & Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>Inspired by open-source portfolios: <a className="text-primary underline" href="https://github.com/emmabostian/developer-portfolios" target="_blank" rel="noopener noreferrer">Emma Bostian’s list</a>, <a className="text-primary underline" href="https://github.com/1hanzla100/developer-portfolio" target="_blank" rel="noopener noreferrer">Developer Portfolio</a>, <a className="text-primary underline" href="https://github.com/saadpasta/developerFolio" target="_blank" rel="noopener noreferrer">developerFolio</a>, <a className="text-primary underline" href="https://github.com/RyanFitzgerald/devportfolio" target="_blank" rel="noopener noreferrer">devportfolio</a>, <a className="text-primary underline" href="https://github.com/VitoMedlej/free-developer-portfolio-template" target="_blank" rel="noopener noreferrer">Free Portfolio Template</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}


