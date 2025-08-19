import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  Calendar,
  User,
  FileText,
  Code,
  GraduationCap,
  Briefcase,
  Settings
} from "lucide-react";
import { ResumeData, Experience, Education, Project, Achievement } from "@/types/resume";
import { nanoid } from "nanoid";

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

const TOTAL_STEPS = 8;

export default function ResumeForm({ resumeData, setResumeData }: ResumeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Validate resumeData structure
  useEffect(() => {
    if (!resumeData) {
      setError("Resume data is missing");
      return;
    }

    if (!resumeData.achievements) {
      setError("Achievements data is missing");
      return;
    }

    if (!resumeData.sections) {
      setError("Sections configuration is missing");
      return;
    }

    setError(null);
  }, [resumeData]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Data Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Show loading state while data is being validated
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Data Validation Error
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while data is being initialized
  if (!resumeData || !resumeData.achievements || !resumeData.sections) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Initializing resume data...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: "Personal", icon: User, description: "Personal information" },
    { id: 2, title: "Summary", icon: FileText, description: "Professional summary" },
    { id: 3, title: "Experience", icon: Briefcase, description: "Work history" },
    { id: 4, title: "Skills", icon: Code, description: "Technical skills" },
    { id: 5, title: "Achievements", icon: Settings, description: "Key achievements" },
    { id: 6, title: "Education", icon: GraduationCap, description: "Educational background" },
    { id: 7, title: "Projects", icon: Settings, description: "Personal projects" },
    { id: 8, title: "Organize", icon: Settings, description: "Arrange sections" }
  ];

  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/resumes", data);
      return response.json();
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive",
      });
    },
  });

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...resumeData };
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setResumeData(newData);
  };

  const addAchievement = () => {
    const newAchievement = {
      id: nanoid(),
      title: "",
      description: "",
      date: "",
      impact: ""
    };
    
    setResumeData({
      ...resumeData,
      achievements: [...(resumeData.achievements || []), newAchievement]
    });
  };

  const removeAchievement = (id: string) => {
    setResumeData({
      ...resumeData,
      achievements: (resumeData.achievements || []).filter(achievement => achievement.id !== id)
    });
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: any) => {
    setResumeData({
      ...resumeData,
      achievements: (resumeData.achievements || []).map(achievement =>
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      )
    });
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    if (!resumeData.sections) return;
    
    const newSections = [...resumeData.sections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    
    // Update order numbers
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setResumeData({
      ...resumeData,
      sections: updatedSections
    });
  };

  const updateSectionOrder = (sectionId: string, newOrder: number) => {
    if (!resumeData.sections) return;
    
    const sections = [...resumeData.sections];
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    
    if (sectionIndex === -1) return;
    
    // Remove the section from its current position
    const [movedSection] = sections.splice(sectionIndex, 1);
    
    // Insert at the new position (adjust for 0-based index)
    const insertIndex = Math.max(0, Math.min(newOrder - 1, sections.length));
    sections.splice(insertIndex, 0, movedSection);
    
    // Update all order numbers
    const updatedSections = sections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setResumeData({
      ...resumeData,
      sections: updatedSections
    });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    if (!resumeData.sections) return;
    
    setResumeData({
      ...resumeData,
      sections: resumeData.sections.map(section =>
        section.id === sectionId ? { ...section, visible: !section.visible } : section
      )
    });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: nanoid(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    
    setResumeData({
      ...resumeData,
      experiences: [...resumeData.experiences, newExperience]
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.filter(exp => exp.id !== id)
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: nanoid(),
      degree: "",
      institution: "",
      location: "",
      year: "",
      gpa: "",
      coursework: ""
    };
    
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: nanoid(),
      name: "",
      technologies: "",
      description: "",
      github: "",
      demo: ""
    };
    
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, newProject]
    });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(proj => proj.id !== id)
    });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    });
  };

  const handleSave = () => {
    const resumePayload = {
      title: `${resumeData.contact.firstName} ${resumeData.contact.lastName} Resume` || "My Resume",
      content: resumeData,
      atsScore: 0 // Will be calculated on the backend
    };
    
    saveResumeMutation.mutate(resumePayload);
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Resume Builder
          </h3>
          <div className="flex items-center space-x-2">
            {lastSaved && (
              <Badge variant="outline" className="text-xs">
                Saved {lastSaved.toLocaleTimeString()}
              </Badge>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        {/* Step Navigation */}
        <div className="flex flex-wrap gap-2">
          {steps.map((step) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <Button
                key={step.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => goToStep(step.id)}
                className={`flex items-center space-x-2 text-xs ${
                  isCompleted ? "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700" : ""
                }`}
                data-testid={`step-${step.id}`}
              >
                <IconComponent className="h-3 w-3" />
                <span className="hidden sm:inline">{step.title}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Form Content */}
      <div className="space-y-6">
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-6" data-testid="step-contact">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Contact Information
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Enter your personal contact details
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={resumeData.contact.firstName}
                  onChange={(e) => updateField("contact.firstName", e.target.value)}
                  placeholder="John"
                  data-testid="input-firstName"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={resumeData.contact.lastName}
                  onChange={(e) => updateField("contact.lastName", e.target.value)}
                  placeholder="Doe"
                  data-testid="input-lastName"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.contact.email}
                  onChange={(e) => updateField("contact.email", e.target.value)}
                  placeholder="john.doe@email.com"
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={resumeData.contact.phone}
                  onChange={(e) => updateField("contact.phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  data-testid="input-phone"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={resumeData.contact.location}
                  onChange={(e) => updateField("contact.location", e.target.value)}
                  placeholder="San Francisco, CA"
                  data-testid="input-location"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={resumeData.contact.linkedin}
                  onChange={(e) => updateField("contact.linkedin", e.target.value)}
                  placeholder="linkedin.com/in/johndoe"
                  data-testid="input-linkedin"
                />
              </div>
              
              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  type="url"
                  value={resumeData.contact.github}
                  onChange={(e) => updateField("contact.github", e.target.value)}
                  placeholder="github.com/johndoe"
                  data-testid="input-github"
                />
              </div>
              
              <div>
                <Label htmlFor="portfolio">Portfolio URL</Label>
                <Input
                  id="portfolio"
                  type="url"
                  value={resumeData.contact.portfolio}
                  onChange={(e) => updateField("contact.portfolio", e.target.value)}
                  placeholder="johndoe.dev"
                  data-testid="input-portfolio"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Professional Summary */}
        {currentStep === 2 && (
          <div className="space-y-6" data-testid="step-summary">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Professional Summary
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Write a compelling 2-4 sentence summary highlighting your key achievements and skills
              </p>
            </div>
            
            <div>
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={resumeData.summary.content}
                onChange={(e) => updateField("summary.content", e.target.value)}
                placeholder="Results-driven Software Engineer with 3+ years of experience developing scalable web applications and distributed systems. Proficient in Java, Python, and JavaScript with expertise in React, Node.js, and cloud technologies. Proven track record of delivering high-quality software solutions that improved system performance by 40% and reduced development time by 25%."
                rows={6}
                data-testid="textarea-summary"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {resumeData.summary.content.length} characters
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Experience */}
        {currentStep === 3 && (
          <div className="space-y-6" data-testid="step-experience">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Work Experience
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add your professional work experience
                </p>
              </div>
              <Button onClick={addExperience} size="sm" data-testid="button-add-experience">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
            
            <div className="space-y-6">
              {resumeData.experiences.map((experience, index) => (
                <Card key={experience.id} className="p-4">
                  <CardContent className="space-y-4 p-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Experience #{index + 1}
                      </h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(experience.id)}
                        className="text-red-500 hover:text-red-700"
                        data-testid={`button-remove-experience-${experience.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title *</Label>
                        <Input
                          value={experience.title}
                          onChange={(e) => updateExperience(experience.id, "title", e.target.value)}
                          placeholder="Software Engineer"
                          data-testid={`input-experience-title-${experience.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>Company *</Label>
                        <Input
                          value={experience.company}
                          onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                          placeholder="Tech Company Inc."
                          data-testid={`input-experience-company-${experience.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={experience.location}
                          onChange={(e) => updateExperience(experience.id, "location", e.target.value)}
                          placeholder="San Francisco, CA"
                          data-testid={`input-experience-location-${experience.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>Start Date *</Label>
                        <Input
                          type="month"
                          value={experience.startDate}
                          onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                          data-testid={`input-experience-startDate-${experience.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={experience.endDate}
                          onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                          disabled={experience.current}
                          data-testid={`input-experience-endDate-${experience.id}`}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id={`current-${experience.id}`}
                          checked={experience.current}
                          onCheckedChange={(checked) => {
                            updateExperience(experience.id, "current", checked);
                            if (checked) {
                              updateExperience(experience.id, "endDate", "");
                            }
                          }}
                          data-testid={`switch-experience-current-${experience.id}`}
                        />
                        <Label htmlFor={`current-${experience.id}`}>Current Position</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Job Description *</Label>
                      <Textarea
                        value={experience.description}
                        onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                        placeholder="• Developed scalable web applications using React and Node.js, serving 100K+ users&#10;• Implemented microservices architecture, reducing response time by 40%&#10;• Led team of 5 developers in agile environment"
                        rows={6}
                        data-testid={`textarea-experience-description-${experience.id}`}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Use bullet points (•) to list your achievements and responsibilities
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {resumeData.experiences.length === 0 && (
                <Card className="p-8 text-center">
                  <CardContent className="p-0">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No work experience added yet
                    </p>
                    <Button onClick={addExperience} data-testid="button-add-first-experience">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Experience
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Technical Skills */}
        {currentStep === 4 && (
          <div className="space-y-6" data-testid="step-skills">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Technical Skills
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                List your technical skills categorized by type
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="languages">Programming Languages</Label>
                <Input
                  id="languages"
                  value={resumeData.skills.languages}
                  onChange={(e) => updateField("skills.languages", e.target.value)}
                  placeholder="Java, Python, JavaScript, TypeScript, C++, Go"
                  data-testid="input-skills-languages"
                />
              </div>
              
              <div>
                <Label htmlFor="frameworks">Frameworks & Libraries</Label>
                <Input
                  id="frameworks"
                  value={resumeData.skills.frameworks}
                  onChange={(e) => updateField("skills.frameworks", e.target.value)}
                  placeholder="React, Angular, Node.js, Spring Boot, Django, Flask"
                  data-testid="input-skills-frameworks"
                />
              </div>
              
              <div>
                <Label htmlFor="databases">Databases & Storage</Label>
                <Input
                  id="databases"
                  value={resumeData.skills.databases}
                  onChange={(e) => updateField("skills.databases", e.target.value)}
                  placeholder="MySQL, PostgreSQL, MongoDB, Redis, DynamoDB"
                  data-testid="input-skills-databases"
                />
              </div>
              
              <div>
                <Label htmlFor="cloud">Cloud & DevOps</Label>
                <Input
                  id="cloud"
                  value={resumeData.skills.cloud}
                  onChange={(e) => updateField("skills.cloud", e.target.value)}
                  placeholder="AWS, Azure, Docker, Kubernetes, Jenkins, Git, Terraform"
                  data-testid="input-skills-cloud"
                />
              </div>
              
              <div>
                <Label htmlFor="tools">Tools & Technologies</Label>
                <Input
                  id="tools"
                  value={resumeData.skills.tools}
                  onChange={(e) => updateField("skills.tools", e.target.value)}
                  placeholder="RESTful APIs, GraphQL, Microservices, Unit Testing, Agile/Scrum"
                  data-testid="input-skills-tools"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Achievements */}
        {currentStep === 5 && (
          <div className="space-y-6" data-testid="step-achievements">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Key Achievements
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Highlight your most significant accomplishments and their impact
                </p>
              </div>
              <Button onClick={addAchievement} size="sm" data-testid="button-add-achievement">
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            </div>
            
            <div className="space-y-6">
              {(resumeData.achievements || []).map((achievement, index) => (
                <Card key={achievement.id} className="p-4">
                  <CardContent className="space-y-4 p-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Achievement #{index + 1}
                      </h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(achievement.id)}
                        className="text-red-500 hover:text-red-700"
                        data-testid={`button-remove-achievement-${achievement.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Achievement Title *</Label>
                        <Input
                          value={achievement.title}
                          onChange={(e) => updateAchievement(achievement.id, "title", e.target.value)}
                          placeholder="Led team of 5 developers"
                          data-testid={`input-achievement-title-${achievement.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>Date</Label>
                        <Input
                          value={achievement.date}
                          onChange={(e) => updateAchievement(achievement.id, "date", e.target.value)}
                          placeholder="Q4 2023"
                          data-testid={`input-achievement-date-${achievement.id}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description *</Label>
                      <Textarea
                        value={achievement.description}
                        onChange={(e) => updateAchievement(achievement.id, "description", e.target.value)}
                        placeholder="Successfully led a team of 5 developers to deliver a critical project ahead of schedule"
                        rows={3}
                        data-testid={`textarea-achievement-description-${achievement.id}`}
                      />
                    </div>
                    
                    <div>
                      <Label>Impact/Results</Label>
                      <Input
                        value={achievement.impact}
                        onChange={(e) => updateAchievement(achievement.id, "impact", e.target.value)}
                        placeholder="Reduced delivery time by 20%, improved team productivity by 15%"
                        data-testid={`input-achievement-impact-${achievement.id}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!resumeData.achievements || resumeData.achievements.length === 0) && (
                <Card className="p-8 text-center">
                  <CardContent className="p-0">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No achievements added yet
                    </p>
                    <Button onClick={addAchievement} data-testid="button-add-first-achievement">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Achievement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Education */}
        {currentStep === 6 && (
          <div className="space-y-6" data-testid="step-education">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Education
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add your educational background
                </p>
              </div>
              <Button onClick={addEducation} size="sm" data-testid="button-add-education">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
            
            <div className="space-y-6">
              {resumeData.education.map((education, index) => (
                <Card key={education.id} className="p-4">
                  <CardContent className="space-y-4 p-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Education #{index + 1}
                      </h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(education.id)}
                        className="text-red-500 hover:text-red-700"
                        data-testid={`button-remove-education-${education.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Degree *</Label>
                        <Input
                          value={education.degree}
                          onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                          placeholder="Bachelor of Science in Computer Science"
                          data-testid={`input-education-degree-${education.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>Institution *</Label>
                        <Input
                          value={education.institution}
                          onChange={(e) => updateEducation(education.id, "institution", e.target.value)}
                          placeholder="University of Technology"
                          data-testid={`input-education-institution-${education.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={education.location}
                          onChange={(e) => updateEducation(education.id, "location", e.target.value)}
                          placeholder="Boston, MA"
                          data-testid={`input-education-location-${education.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>Graduation Year *</Label>
                        <Input
                          type="number"
                          value={education.year}
                          onChange={(e) => updateEducation(education.id, "year", e.target.value)}
                          placeholder="2024"
                          min="1950"
                          max="2030"
                          data-testid={`input-education-year-${education.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>GPA (Optional)</Label>
                        <Input
                          value={education.gpa}
                          onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                          placeholder="3.8/4.0"
                          data-testid={`input-education-gpa-${education.id}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Relevant Coursework</Label>
                      <Input
                        value={education.coursework}
                        onChange={(e) => updateEducation(education.id, "coursework", e.target.value)}
                        placeholder="Data Structures, Algorithms, Software Engineering, Database Systems"
                        data-testid={`input-education-coursework-${education.id}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {resumeData.education.length === 0 && (
                <Card className="p-8 text-center">
                  <CardContent className="p-0">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No education added yet
                    </p>
                    <Button onClick={addEducation} data-testid="button-add-first-education">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your Education
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Step 7: Projects */}
        {currentStep === 7 && (
          <div className="space-y-6" data-testid="step-projects">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Projects
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showcase your personal and professional projects
                </p>
              </div>
              <Button onClick={addProject} size="sm" data-testid="button-add-project">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            <div className="space-y-6">
              {resumeData.projects.map((project, index) => (
                <Card key={project.id} className="p-4">
                  <CardContent className="space-y-4 p-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Project #{index + 1}
                      </h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
                        className="text-red-500 hover:text-red-700"
                        data-testid={`button-remove-project-${project.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Project Name *</Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, "name", e.target.value)}
                          placeholder="E-commerce Platform"
                          data-testid={`input-project-name-${project.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>Technologies Used *</Label>
                        <Input
                          value={project.technologies}
                          onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                          placeholder="React, Node.js, MongoDB, AWS"
                          data-testid={`input-project-technologies-${project.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>GitHub Repository</Label>
                        <Input
                          type="url"
                          value={project.github}
                          onChange={(e) => updateProject(project.id, "github", e.target.value)}
                          placeholder="https://github.com/username/project"
                          data-testid={`input-project-github-${project.id}`}
                        />
                      </div>
                      
                      <div>
                        <Label>Live Demo (Optional)</Label>
                        <Input
                          type="url"
                          value={project.demo}
                          onChange={(e) => updateProject(project.id, "demo", e.target.value)}
                          placeholder="https://project-demo.com"
                          data-testid={`input-project-demo-${project.id}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Project Description *</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        placeholder="• Developed full-stack e-commerce platform with payment processing&#10;• Implemented user authentication and inventory management&#10;• Achieved 1000+ concurrent users with optimized performance"
                        rows={4}
                        data-testid={`textarea-project-description-${project.id}`}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Use bullet points (•) to describe features and achievements
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {resumeData.projects.length === 0 && (
                <Card className="p-8 text-center">
                  <CardContent className="p-0">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No projects added yet
                    </p>
                    <Button onClick={addProject} data-testid="button-add-first-project">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Step 8: Section Reordering */}
        {currentStep === 8 && (
          <div className="space-y-6" data-testid="step-reordering">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Organize Resume Sections
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Drag and drop to reorder sections. The Personal Information section cannot be moved.
              </p>
            </div>
            
            <div className="space-y-4">
              {resumeData.sections
                ?.filter(section => section.id !== 'personal') // Exclude personal section from reordering
                .sort((a, b) => a.order - b.order) // Sort by order
                .map((section, displayIndex) => {
                  const actualIndex = resumeData.sections.findIndex(s => s.id === section.id);
                  return (
                    <Card key={section.id} className="p-4">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex flex-col items-center space-y-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (actualIndex > 0) {
                                    reorderSections(actualIndex, actualIndex - 1);
                                  }
                                }}
                                disabled={actualIndex === 0}
                                className="h-6 w-6 p-0"
                              >
                                ↑
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (actualIndex < resumeData.sections.length - 1) {
                                    reorderSections(actualIndex, actualIndex + 1);
                                  }
                                }}
                                disabled={actualIndex === resumeData.sections.length - 1}
                                className="h-6 w-6 p-0"
                              >
                                ↓
                              </Button>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {section.title}
                                </h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Current Position: {section.order}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`order-${section.id}`} className="text-xs">New Position:</Label>
                                <Input
                                  id={`order-${section.id}`}
                                  type="number"
                                  min="1"
                                  max={resumeData.sections.length}
                                  value={section.order}
                                  onChange={(e) => {
                                    const newOrder = parseInt(e.target.value);
                                    if (!isNaN(newOrder) && newOrder >= 1 && newOrder <= resumeData.sections.length) {
                                      updateSectionOrder(section.id, newOrder);
                                    }
                                  }}
                                  className="w-16 h-8 text-xs"
                                  data-testid={`input-order-${section.id}`}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={section.visible}
                              onCheckedChange={() => toggleSectionVisibility(section.id)}
                              data-testid={`switch-section-${section.id}`}
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {section.visible ? 'Visible' : 'Hidden'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Section Order:
              </h5>
              <ol className="list-decimal list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>Personal Information (Fixed)</li>
                {resumeData.sections
                  ?.filter(section => section.id !== 'personal')
                  .sort((a, b) => a.order - b.order)
                  .map(section => (
                    <li key={section.id}>
                      {section.title} {!section.visible && '(Hidden)'}
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          data-testid="button-previous"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={saveResumeMutation.isPending}
            data-testid="button-save-draft"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveResumeMutation.isPending ? "Saving..." : "Save Draft"}
          </Button>
          
          {currentStep === TOTAL_STEPS ? (
            <Button
              onClick={() => {}} // Removed onExport prop
              className="bg-secondary hover:bg-green-600"
              data-testid="button-generate-resume"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Resume
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              data-testid="button-next"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
