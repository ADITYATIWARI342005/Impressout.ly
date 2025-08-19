import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";
import { Sparkles, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface AIAssistantProps {
  resumeData: ResumeData;
}

export default function AIAssistant({ resumeData }: AIAssistantProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [isImprovingBullet, setIsImprovingBullet] = useState(false);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [improvedBullet, setImprovedBullet] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [bulletPoint, setBulletPoint] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const { toast } = useToast();

  const analyzeResume = async () => {
    if (!resumeData.summary?.content && resumeData.experiences.length === 0) {
      toast({
        title: "No Content",
        description: "Please add some content to your resume before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const resumeContent = JSON.stringify(resumeData);
      const response = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const result = await response.json();
      setAnalysis(result.suggestions || []);
      
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully!",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateKeywords = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description to generate keywords.",
        variant: "destructive",
      });
      return;
    }

    if (!resumeData.summary?.content && resumeData.experiences.length === 0) {
      toast({
        title: "No Resume Content",
        description: "Please add some content to your resume first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingKeywords(true);
    try {
      const resumeContent = JSON.stringify(resumeData);
      const response = await fetch("/api/ai/job-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resumeContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate keywords");
      }

      const result = await response.json();
      setKeywords(result.keywords || []);
      
      toast({
        title: "Keywords Generated",
        description: "Job-specific keywords have been generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Keyword Generation Failed",
        description: "Failed to generate keywords. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const improveBulletPoint = async () => {
    if (!bulletPoint.trim() || !role.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both a bullet point and role description.",
        variant: "destructive",
      });
      return;
    }

    setIsImprovingBullet(true);
    try {
      const response = await fetch("/api/ai/improve-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulletPoint, role }),
      });

      if (!response.ok) {
        throw new Error("Failed to improve bullet point");
      }

      const result = await response.json();
      setImprovedBullet(result.improved || "");
      
      toast({
        title: "Bullet Point Improved",
        description: "Your bullet point has been enhanced successfully!",
      });
    } catch (error) {
      toast({
        title: "Improvement Failed",
        description: "Failed to improve bullet point. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImprovingBullet(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          AI Resume Assistant
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get AI-powered insights and improvements for your resume
        </p>
      </div>

      {/* Resume Analysis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={analyzeResume}
            disabled={isAnalyzing}
            className="w-full"
            size="sm"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </Button>
          
          {analysis.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                Suggestions:
              </h5>
              {analysis.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Keywords */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Job Keywords
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[80px] text-xs"
          />
          <Button
            onClick={generateKeywords}
            disabled={isGeneratingKeywords || !jobDescription.trim()}
            className="w-full"
            size="sm"
          >
            {isGeneratingKeywords ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isGeneratingKeywords ? "Generating..." : "Generate Keywords"}
          </Button>
          
          {keywords.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                Keywords:
              </h5>
              <div className="flex flex-wrap gap-1">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bullet Point Improvement */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Improve Bullet Point
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter your bullet point..."
              value={bulletPoint}
              onChange={(e) => setBulletPoint(e.target.value)}
              className="min-h-[60px] text-xs"
            />
            <Textarea
              placeholder="Describe the role/context..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="min-h-[60px] text-xs"
            />
          </div>
          <Button
            onClick={improveBulletPoint}
            disabled={isImprovingBullet || !bulletPoint.trim() || !role.trim()}
            className="w-full"
            size="sm"
          >
            {isImprovingBullet ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isImprovingBullet ? "Improving..." : "Improve Bullet Point"}
          </Button>
          
          {improvedBullet && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                Improved Version:
              </h5>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {improvedBullet}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
