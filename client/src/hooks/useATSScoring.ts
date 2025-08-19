import { useMemo } from 'react';
import { ResumeData, ATSScore } from '../types/resume';
import { calculateATSScore, getOverallATSScore } from '../lib/atsScoring';

export function useATSScoring(resumeData: ResumeData) {
  const atsScore = useMemo(() => {
    if (!resumeData) return null;
    return calculateATSScore(resumeData);
  }, [resumeData]);

  const overallScore = useMemo(() => {
    if (!atsScore) return 0;
    return getOverallATSScore(atsScore);
  }, [atsScore]);

  return {
    atsScore,
    overallScore,
    isLoading: false
  };
}
