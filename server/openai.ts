import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface ResumeAnalysis {
  suggestions: string[];
  keywordRecommendations: string[];
  improvementAreas: string[];
  overallFeedback: string;
}

export async function analyzeResumeContent(resumeContent: any): Promise<ResumeAnalysis> {
  try {
    const prompt = `Analyze this software engineer resume and provide specific improvement suggestions based on 2025 ATS standards and industry best practices. Focus on:

1. Technical keywords that should be added
2. Quantifiable achievements that could be enhanced
3. ATS optimization improvements
4. Industry-specific recommendations for software engineers

Resume Content: ${JSON.stringify(resumeContent)}

Respond with JSON in this exact format: {
  "suggestions": ["specific actionable suggestion 1", "specific actionable suggestion 2"],
  "keywordRecommendations": ["keyword1", "keyword2", "keyword3"],
  "improvementAreas": ["area1", "area2"],
  "overallFeedback": "comprehensive feedback paragraph"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS resume analyzer and software engineering career coach. Provide detailed, actionable feedback for software engineers looking to improve their resume's ATS score and overall quality."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      suggestions: result.suggestions || [],
      keywordRecommendations: result.keywordRecommendations || [],
      improvementAreas: result.improvementAreas || [],
      overallFeedback: result.overallFeedback || "No feedback available"
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return {
      suggestions: ["Unable to analyze resume at this time. Please try again later."],
      keywordRecommendations: [],
      improvementAreas: [],
      overallFeedback: "Analysis temporarily unavailable"
    };
  }
}

export async function generateJobMatchingKeywords(jobDescription: string, currentResume: any): Promise<string[]> {
  try {
    const prompt = `Compare this job description with the current resume and suggest specific keywords/phrases that should be added to better match the job requirements.

Job Description: ${jobDescription}

Current Resume: ${JSON.stringify(currentResume)}

Respond with JSON: { "keywords": ["keyword1", "keyword2", "keyword3"] }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an ATS keyword optimization expert. Analyze job descriptions and provide specific keyword recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.keywords || [];
  } catch (error) {
    console.error("Error generating keywords:", error);
    return [];
  }
}

export async function improveBulletPoint(bulletPoint: string, role: string): Promise<string> {
  try {
    const prompt = `Improve this resume bullet point for a ${role} position to be more impactful, quantified, and ATS-friendly. Make it more specific and results-oriented.

Original: ${bulletPoint}

Respond with JSON: { "improved": "improved bullet point with metrics and impact" }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer specializing in software engineering roles. Improve bullet points to be more impactful and quantified."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.improved || bulletPoint;
  } catch (error) {
    console.error("Error improving bullet point:", error);
    return bulletPoint;
  }
}
