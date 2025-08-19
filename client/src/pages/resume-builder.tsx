import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Plus, Upload, BarChart3, Download, Save } from 'lucide-react';
import ResumeForm from '../components/resume/resume-form';
import ResumePreview from '../components/resume/resume-preview';
import ATSChart from '../components/resume/ats-chart';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ResumeData } from '../types/resume';
import { useATSScoring } from '../hooks/useATSScoring';
import { useToast } from '../hooks/use-toast';

export default function ResumeBuilder() {
  const [showOptions, setShowOptions] = useState(true);
  const [resumeData, setResumeData] = useLocalStorage<ResumeData>('resumeData', {
    contact: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    summary: {
      content: ''
    },
    experiences: [],
    skills: {
      languages: '',
      frameworks: '',
      databases: '',
      cloud: '',
      tools: ''
    },
    achievements: [
      {
        id: "1",
        title: "Led Development Team",
        description: "Successfully led a team of 8 developers to deliver a critical project 2 weeks ahead of schedule",
        date: "Q4 2023",
        impact: "Improved team productivity by 25% and reduced project delivery time"
      }
    ],
    education: [],
    projects: [],
    sections: [
      { id: "personal", title: "Personal Information", order: 1, visible: true },
      { id: "summary", title: "Professional Summary", order: 2, visible: true },
      { id: "experience", title: "Professional Experience", order: 3, visible: true },
      { id: "skills", title: "Technical Skills", order: 4, visible: true },
      { id: "achievements", title: "Key Achievements", order: 5, visible: true },
      { id: "education", title: "Education", order: 6, visible: true },
      { id: "projects", title: "Projects", order: 7, visible: true },
      { id: "organize", title: "Organize Sections", order: 8, visible: true }
    ]
  });

  const { atsScore, overallScore } = useATSScoring(resumeData);
  const { toast } = useToast();

  // Data validation and migration
  useEffect(() => {
    const validateAndMigrateData = (data: ResumeData): ResumeData => {
      const defaultData = {
        contact: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          portfolio: ''
        },
        summary: {
          content: ''
        },
        experiences: [],
        skills: {
          languages: '',
          frameworks: '',
          databases: '',
          cloud: '',
          tools: ''
        },
        achievements: [],
        education: [],
        projects: [],
        sections: [
          { id: "personal", title: "Personal Information", order: 1, visible: true },
          { id: "summary", title: "Professional Summary", order: 2, visible: true },
          { id: "experience", title: "Professional Experience", order: 3, visible: true },
          { id: "skills", title: "Technical Skills", order: 4, visible: true },
          { id: "achievements", title: "Key Achievements", order: 5, visible: true },
          { id: "education", title: "Education", order: 6, visible: true },
          { id: "projects", title: "Projects", order: 7, visible: true },
          { id: "organize", title: "Organize Sections", order: 8, visible: true }
        ]
      };

      try {
        // Ensure all required arrays exist
        if (!data.achievements) data.achievements = [];
        if (!data.sections) data.sections = defaultData.sections;
        if (!data.experiences) data.experiences = [];
        if (!data.education) data.education = [];
        if (!data.projects) data.projects = [];
        if (!data.skills) data.skills = defaultData.skills;
        if (!data.summary) data.summary = defaultData.summary;
        if (!data.contact) data.contact = defaultData.contact;

        return data;
      } catch (error) {
        console.error('Error validating resume data:', error);
        return defaultData;
      }
    };

    try {
      const validatedData = validateAndMigrateData(resumeData);
      if (JSON.stringify(validatedData) !== JSON.stringify(resumeData)) {
        setResumeData(validatedData);
        toast({
          title: "Data Updated",
          description: "Your resume data has been updated to the latest format.",
        });
      }
    } catch (error) {
      console.error('Error during data validation:', error);
      toast({
        title: "Error",
        description: "There was an issue with your resume data. Please refresh the page.",
        variant: "destructive",
      });
    }
  }, [resumeData, setResumeData, toast]);

  const handleOptionSelect = (option: string) => {
    if (option === 'create') {
      setShowOptions(false);
      toast({
        title: "Resume Builder",
        description: "Welcome to the resume builder! Start filling out your information.",
      });
    } else if (option === 'import') {
      toast({
        title: "Import Feature",
        description: "Import functionality coming soon! For now, start with creating a new resume.",
      });
    } else if (option === 'evaluate') {
      toast({
        title: "ATS Scoring",
        description: "Real-time ATS scoring is now active! Your score updates as you type.",
      });
    }
  };

  const handleSave = () => {
    toast({
      title: "Resume Saved",
      description: "Your resume has been saved successfully!",
    });
  };

  // Show landing page with options
  if (showOptions) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Builder</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Choose how you'd like to get started
            </p>
          </div>
        </div>

        {/* Options Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* First Card - Create New */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleOptionSelect('create')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Create New</h3>
                <p className="text-gray-600 text-sm">
                  Start building your resume from scratch with our intuitive builder
                </p>
              </CardContent>
            </Card>

            {/* Second Card - Import Existing */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleOptionSelect('import')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Import Existing</h3>
                <p className="text-gray-600 text-sm">
                  Upload your existing resume and we'll help you improve it
                </p>
              </CardContent>
            </Card>

            {/* Third Card - ATS Scoring Analysis */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">ATS Scoring Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Get real-time ATS compatibility score and optimization suggestions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show resume builder with ATS scoring
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Resume Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create a professional resume that stands out
              </p>
            </div>
            
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowOptions(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Back to Options
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeForm 
                  resumeData={resumeData} 
                  setResumeData={setResumeData} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Tools */}
          <div className="lg:col-span-3 space-y-4">
            {/* Resume Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResumePreview resumeData={resumeData} />
              </CardContent>
            </Card>

            {/* ATS Scoring Analysis */}
            <ATSChart atsScore={atsScore} />

            {/* Save Button */}
            <Card>
              <CardContent className="p-4">
                <Button 
                  onClick={handleSave}
                  className="w-full"
                  size="lg"
                >
                  Save Resume
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
