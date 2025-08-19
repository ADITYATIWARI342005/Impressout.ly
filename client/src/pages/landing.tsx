import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FileText, Briefcase, Mail, Code } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      id: "resume",
      title: "Resume",
      description: "Create ATS-optimized resumes with real-time scoring and professional templates",
      icon: FileText,
      color: "text-primary",
      href: "/login"
    },
    {
      id: "portfolio",
      title: "Portfolio",
      description: "Showcase your projects and skills with stunning portfolio websites",
      icon: Briefcase,
      color: "text-secondary",
      href: "/portfolio-builder"
    },
    {
      id: "cover-letter",
      title: "Cover Letter",
      description: "Generate personalized cover letters that complement your resume",
      icon: Mail,
      color: "text-accent",
      href: "/login"
    },
    {
      id: "projects",
      title: "Projects",
      description: "Document and showcase your coding projects with detailed case studies",
      icon: Code,
      color: "text-orange-500",
      href: "/login"
    }
  ];

  const handleFeatureClick = (href: string) => {
    window.location.href = href;
  };

  // Token handling moved to dedicated /auth/callback page

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-6xl font-bold text-gray-900 dark:text-white mb-6"
            data-testid="hero-title"
          >
            Impressout.ly
          </h1>
          <p 
            className="text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
            data-testid="hero-tagline"
          >
            Make your next impression stand out
          </p>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.id}
                  className="group cursor-pointer bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                  onClick={() => handleFeatureClick(feature.href)}
                  data-testid={`card-${feature.id}`}
                >
                  <CardContent className="p-0">
                    <div className={`${feature.color} text-5xl mb-6 flex justify-center`}>
                      <IconComponent size={48} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16">
            <Button
              size="lg"
              onClick={() => window.location.href = '/login'}
              className="text-lg px-8 py-4"
              data-testid="button-get-started"
            >
              Get Started - Sign In
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
