import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FileText, Briefcase, Mail, Code, Plus, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import type { Resume, Portfolio, CoverLetter, Project } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: resumes, isLoading: resumesLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
    retry: false,
  });

  const { data: portfolios, isLoading: portfoliosLoading } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
    retry: false,
  });

  const { data: coverLetters, isLoading: coverLettersLoading } = useQuery<CoverLetter[]>({
    queryKey: ["/api/cover-letters"],
    retry: false,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const features = [
    {
      id: "resume",
      title: "Resume Builder",
      description: "Create professional resumes with our intuitive builder",
      icon: FileText,
      href: "/resume-builder",
      color: "bg-blue-500",
    },
    {
      id: "portfolio",
      title: "Portfolio Creator",
      description: "Build stunning portfolios to showcase your work",
      icon: Briefcase,
      href: "/portfolio",
      color: "bg-green-500",
    },
    {
      id: "cover-letter",
      title: "Cover Letter Generator",
      description: "Write compelling cover letters for job applications",
      icon: Mail,
      href: "/cover-letter",
      color: "bg-purple-500",
    },
    {
      id: "projects",
      title: "Project Showcase",
      description: "Highlight your projects and achievements",
      icon: Code,
      href: "/projects",
      color: "bg-orange-500",
    },
    {
      id: "ats",
      title: "ATS Optimization",
      description: "Optimize your resume for Applicant Tracking Systems",
      icon: BarChart3,
      href: "/ats-optimizer",
      color: "bg-red-500",
    },
  ];

  const stats = [
    {
      label: "Resumes Created",
      value: resumesLoading ? "..." : resumes?.length || 0,
      icon: FileText,
    },
    {
      label: "Portfolios Built",
      value: portfoliosLoading ? "..." : portfolios?.length || 0,
      icon: Briefcase,
    },
    {
      label: "Cover Letters",
      value: coverLettersLoading ? "..." : coverLetters?.length || 0,
      icon: Mail,
    },
    {
      label: "Projects Showcased",
      value: projectsLoading ? "..." : projects?.length || 0,
      icon: Code,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to ImpressOut
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Create professional resumes, portfolios, and cover letters that stand out
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setLocation("/resume-builder")}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Start Building
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation("/dashboard")}
            >
              View Dashboard
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Everything you need to succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setLocation(feature.href)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.color}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to create your professional presence?
              </h3>
              <p className="text-blue-100 mb-6">
                Start building your resume, portfolio, and cover letters today
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setLocation("/resume-builder")}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
