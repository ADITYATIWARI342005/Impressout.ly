import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FileText, Search, Grid, List, Plus, Edit, Trash2, Copy, Download, BarChart3, Briefcase, Mail, Code } from "lucide-react";
import { useLocation } from "wouter";
import type { Resume, Portfolio, CoverLetter, Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch user data
  const { data: resumes, isLoading: resumesLoading, error: resumesError } = useQuery<Resume[]>({
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

  // Delete resume mutation
  const deleteResumeMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/resumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    },
  });

  // Delete portfolio mutation
  const deletePortfolioMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/portfolios/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      toast({
        title: "Success",
        description: "Portfolio deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete portfolio",
        variant: "destructive",
      });
    },
  });

  // Delete cover letter mutation
  const deleteCoverLetterMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/cover-letters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cover-letters"] });
      toast({
        title: "Success",
        description: "Cover letter deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete cover letter",
        variant: "destructive",
      });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (type: string, id: string) => {
    switch (type) {
      case 'resume':
        deleteResumeMutation.mutate(id);
        break;
      case 'portfolio':
        deletePortfolioMutation.mutate(id);
        break;
      case 'coverLetter':
        deleteCoverLetterMutation.mutate(id);
        break;
      case 'project':
        deleteProjectMutation.mutate(id);
        break;
    }
  };

  const filteredResumes = resumes?.filter(resume =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredPortfolios = portfolios?.filter(portfolio =>
    portfolio.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredCoverLetters = coverLetters?.filter(coverLetter =>
    coverLetter.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredProjects = projects?.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your resumes, portfolios, cover letters, and projects
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resumes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resumes ({filteredResumes.length})
            </TabsTrigger>
            <TabsTrigger value="portfolios" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Portfolios ({filteredPortfolios.length})
            </TabsTrigger>
            <TabsTrigger value="coverLetters" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Cover Letters ({filteredCoverLetters.length})
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Projects ({filteredProjects.length})
            </TabsTrigger>
          </TabsList>

          {/* Resumes Tab */}
          <TabsContent value="resumes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Resumes</h3>
              <Button onClick={() => setLocation("/resume-builder")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </div>
            
            {resumesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredResumes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No resumes yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first resume to get started
                  </p>
                  <Button onClick={() => setLocation("/resume-builder")}>
                    Create Resume
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredResumes.map((resume) => (
                  <Card key={resume.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{resume.title}</CardTitle>
                        <Badge variant="secondary">
                          {resume.atsScore || 0}% ATS
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Updated {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : ''}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/resume/${resume.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* TODO: Implement copy */}}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* TODO: Implement download */}}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{resume.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete('resume', resume.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Portfolios Tab */}
          <TabsContent value="portfolios" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Portfolios</h3>
              <Button onClick={() => setLocation("/portfolio-builder")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Portfolio
              </Button>
            </div>
            
            {portfoliosLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPortfolios.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No portfolios yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first portfolio to showcase your work
                  </p>
                  <Button onClick={() => setLocation("/portfolio-builder")}>
                    Create Portfolio
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredPortfolios.map((portfolio) => (
                  <Card key={portfolio.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{portfolio.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Updated {portfolio.updatedAt ? new Date(portfolio.updatedAt).toLocaleDateString() : ''}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/portfolio/${portfolio.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* TODO: Implement copy */}}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Portfolio</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{portfolio.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete('portfolio', portfolio.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Cover Letters Tab */}
          <TabsContent value="coverLetters" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Cover Letters</h3>
              <Button onClick={() => setLocation("/cover-letter")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Cover Letter
              </Button>
            </div>
            
            {coverLettersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCoverLetters.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No cover letters yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first cover letter to get started
                  </p>
                  <Button onClick={() => setLocation("/cover-letter")}>
                    Create Cover Letter
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredCoverLetters.map((coverLetter) => (
                  <Card key={coverLetter.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{coverLetter.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Updated {coverLetter.updatedAt ? new Date(coverLetter.updatedAt).toLocaleDateString() : ''}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/cover-letter/${coverLetter.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* TODO: Implement copy */}}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* TODO: Implement download */}}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Cover Letter</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{coverLetter.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete('coverLetter', coverLetter.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Projects</h3>
              <Button onClick={() => setLocation("/projects")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </div>
            
            {projectsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No projects yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first project to showcase your work
                  </p>
                  <Button onClick={() => setLocation("/projects")}>
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Created {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      {project.technologies && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Technologies:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.split(',').map((tech, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tech.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/projects/${project.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {project.githubUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => project.githubUrl && window.open(project.githubUrl as string, '_blank')}
                          >
                            <Code className="h-4 w-4 mr-1" />
                            GitHub
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => project.liveUrl && window.open(project.liveUrl as string, '_blank')}
                          >
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Live Demo
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{project.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete('project', project.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
