import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { ATSScore } from '../../types/resume';
import { BarChart3, TrendingUp, Target, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

interface ATSChartProps {
  atsScore: ATSScore | null;
}

export default function ATSChart({ atsScore }: ATSChartProps) {
  if (!atsScore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            ATS Scoring Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Complete your resume to see ATS scoring analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          ATS Scoring Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className={`w-24 h-24 rounded-full ${getScoreColor(atsScore.overall)} flex items-center justify-center text-white text-2xl font-bold`}>
              {atsScore.overall}
            </div>
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-lg font-semibold mt-2">{getScoreLabel(atsScore.overall)}</p>
          <p className="text-sm text-gray-600">Overall ATS Compatibility</p>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Score Breakdown
          </h3>
          
          {/* Technical Skills */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Technical Skills (45%)</span>
              <Badge variant="secondary">{atsScore.breakdown.technicalSkills}/100</Badge>
            </div>
            <Progress value={atsScore.breakdown.technicalSkills} className="h-2" />
            {atsScore.details.technicalSkills.bonuses.details.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {atsScore.details.technicalSkills.bonuses.details.map((bonus, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {bonus}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Experience (27.5%)</span>
              <Badge variant="secondary">{atsScore.breakdown.experience}/100</Badge>
            </div>
            <Progress value={atsScore.breakdown.experience} className="h-2" />
            {atsScore.details.experience.bonuses.details.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {atsScore.details.experience.bonuses.details.map((bonus, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {bonus}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Achievements (17.5%)</span>
              <Badge variant="secondary">{atsScore.breakdown.achievements}/100</Badge>
            </div>
            <Progress value={atsScore.breakdown.achievements} className="h-2" />
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Projects (12.5%)</span>
              <Badge variant="secondary">{atsScore.breakdown.projects}/100</Badge>
            </div>
            <Progress value={atsScore.breakdown.projects} className="h-2" />
          </div>

          {/* Education */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Education (10%)</span>
              <Badge variant="secondary">{atsScore.breakdown.education}/100</Badge>
            </div>
            <Progress value={atsScore.breakdown.education} className="h-2" />
          </div>

          {/* Format */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Format (7.5%)</span>
              <Badge variant="secondary">{atsScore.breakdown.format}/100</Badge>
            </div>
            <Progress value={atsScore.breakdown.format} className="h-2" />
          </div>
        </div>

        {/* Keyword Matches */}
        {atsScore.keywordMatches.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Matched Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {atsScore.keywordMatches.slice(0, 12).map((keyword, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {atsScore.keywordMatches.length > 12 && (
                <Badge variant="outline" className="text-xs">
                  +{atsScore.keywordMatches.length - 12} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {atsScore.suggestions.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Optimization Suggestions
            </h3>
            <div className="space-y-2">
              {atsScore.suggestions.slice(0, 5).map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {atsScore.missingKeywords.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Consider Adding
            </h3>
            <div className="flex flex-wrap gap-2">
              {atsScore.missingKeywords.slice(0, 8).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs text-red-600 border-red-300">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
