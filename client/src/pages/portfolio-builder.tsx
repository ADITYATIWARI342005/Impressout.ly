import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FileText, Palette, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function PortfolioBuilder() {
  const [, setLocation] = useLocation();

  const options = [
    {
      id: "from-resume",
      title: "Build from Resume",
      description: "Import your resume and auto-generate a portfolio layout.",
      icon: FileText,
      href: "/portfolio-builder/from-resume",
      comingSoon: true,
    },
    {
      id: "create-edit",
      title: "Create / Edit in Templates",
      description: "Use our templates and fill in your details with live preview.",
      icon: Palette,
      href: "/portfolio-templates",
    },
    {
      id: "library",
      title: "Templates Library",
      description: "Explore 10+ professional templates with premium animations.",
      icon: LayoutGrid,
      href: "/portfolio-templates",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Portfolio Builder</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Choose how you want to create your portfolio</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <Card
                key={opt.id}
                className="relative overflow-hidden group cursor-pointer border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 animate-fade-in-up hover:-translate-y-1"
                onClick={() => !opt.comingSoon && setLocation(opt.href)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="h-5 w-5 animate-float" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{opt.title}</h3>
                    </div>
                    {opt.comingSoon && (
                      <Badge variant="secondary">Coming soon</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{opt.description}</p>
                </CardContent>
                <div className="absolute inset-x-0 -bottom-10 h-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 blur-2xl opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all"></div>
              </Card>
            );
          })}
        </div>

        <div className="mt-10">
          <Button variant="outline" onClick={() => setLocation('/portfolio-templates')}>
            Browse Templates
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}


