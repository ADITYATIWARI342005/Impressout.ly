import { ResumeData } from "@/types/resume";
import { useMemo } from "react";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const ResumePreview = ({ resumeData }: ResumePreviewProps) => {
  const { contact, summary, experiences, skills, achievements, education, projects, sections } = resumeData;

  // Memoize expensive operations
  const memoizedSections = useMemo(() => {
    if (!sections) return [];
    return sections
      .filter(section => section.visible)
      .sort((a, b) => a.order - b.order);
  }, [sections]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString + "-01");
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        year: "numeric" 
      });
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  const formatBulletPoints = (text: string) => {
    if (!text) return [];
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.startsWith('•') ? line.substring(1).trim() : line);
  };

  // Function to render sections based on order and visibility
  const renderSection = (sectionId: string) => {
    const section = sections?.find(s => s.id === sectionId);
    if (!section || !section.visible) return null;

    switch (sectionId) {
      case 'summary':
        return summary?.content ? (
          <div key={sectionId} className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-400 pb-1 mb-1">
              PROFESSIONAL SUMMARY
            </h2>
            <p 
              className="text-xs leading-tight"
              data-testid="preview-summary"
            >
              {summary.content}
            </p>
          </div>
        ) : null;

      case 'experience':
        return experiences && experiences.length > 0 ? (
          <div key={sectionId} className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-400 pb-1 mb-1">
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-2">
              {experiences.map((exp, index) => (
                <div key={exp.id || index} className="experience-item">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <strong className="text-xs">{exp.title || "Job Title"}</strong>
                      {exp.company && (
                        <>
                          {" | "}
                          <span className="text-xs">{exp.company}</span>
                        </>
                      )}
                      {exp.location && (
                        <>
                          {" | "}
                          <span className="text-xs">{exp.location}</span>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <ul className="text-xs list-disc list-inside ml-2 space-y-0.25">
                      {formatBulletPoints(exp.description).map((point, pointIndex) => (
                        <li key={pointIndex}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'skills':
        return skills && (skills.languages || skills.frameworks || skills.databases || skills.cloud || skills.tools) ? (
          <div key={sectionId} className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-400 pb-1 mb-1">
              TECHNICAL SKILLS
            </h2>
            <div className="text-xs space-y-0.25">
              {skills.languages && (
                <div>
                  <strong>Languages:</strong> 
                  <span data-testid="preview-skills-languages"> {skills.languages}</span>
                </div>
              )}
              {skills.frameworks && (
                <div>
                  <strong>Frameworks:</strong> 
                  <span data-testid="preview-skills-frameworks"> {skills.frameworks}</span>
                </div>
              )}
              {skills.databases && (
                <div>
                  <strong>Databases:</strong> 
                  <span data-testid="preview-skills-databases"> {skills.databases}</span>
                </div>
              )}
              {skills.cloud && (
                <div>
                  <strong>Cloud & DevOps:</strong> 
                  <span data-testid="preview-skills-cloud"> {skills.cloud}</span>
                </div>
              )}
              {skills.tools && (
                <div>
                  <strong>Tools:</strong> 
                  <span data-testid="preview-skills-tools"> {skills.tools}</span>
                </div>
              )}
            </div>
          </div>
        ) : null;

      case 'achievements':
        return achievements && achievements.length > 0 ? (
          <div key={sectionId} className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-400 pb-1 mb-1">
              ACHIEVEMENTS
            </h2>
            <div className="space-y-1">
              {achievements.map((achievement, index) => (
                <div key={achievement.id || index} className="achievement-item">
                  <div className="mb-0.5">
                    <strong className="text-xs">{achievement.title || "Achievement Title"}</strong>
                    {achievement.date && (
                      <>
                        {" | "}
                        <span className="text-xs text-gray-600">{achievement.date}</span>
                      </>
                    )}
                  </div>
                  {achievement.description && (
                    <div className="text-xs text-gray-700 mb-0.5">
                      {achievement.description}
                    </div>
                  )}
                  {achievement.impact && (
                    <div className="text-xs text-gray-600 italic">
                      Impact: {achievement.impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'education':
        return education && education.length > 0 ? (
          <div key={sectionId} className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-400 pb-1 mb-1">
              EDUCATION
            </h2>
            <div className="space-y-1">
              {education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between items-start mb-0.5">
                    <div>
                      <strong className="text-xs">{edu.degree || "Degree"}</strong>
                    </div>
                    <span className="text-xs text-gray-600">{edu.year}</span>
                  </div>
                  <div className="text-xs">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                  {edu.gpa && (
                    <div className="text-xs">GPA: {edu.gpa}</div>
                  )}
                  {edu.coursework && (
                    <div className="text-xs">
                      Coursework: {edu.coursework}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return projects && projects.length > 0 ? (
          <div key={sectionId} className="mb-3">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-400 pb-1 mb-1">
              PROJECTS
            </h2>
            <div className="space-y-1">
              {projects.map((project, index) => (
                <div key={project.id || index} className="project-item">
                  <div className="mb-0.5">
                    <strong className="text-xs">{project.name || "Project Name"}</strong>
                    {project.technologies && (
                      <>
                        {" | "}
                        <span className="text-xs text-gray-600">{project.technologies}</span>
                      </>
                    )}
                  </div>
                  {project.description && (
                    <ul className="text-xs list-disc list-inside ml-2 space-y-0.25">
                      {formatBulletPoints(project.description).map((point, pointIndex) => (
                        <li key={pointIndex}>{point}</li>
                      ))}
                    </ul>
                  )}
                  <div className="text-xs mt-0.5 ml-2">
                    {project.github && (
                      <div>GitHub: {project.github}</div>
                    )}
                    {project.demo && (
                      <div>Demo: {project.demo}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-white text-black p-4 shadow-lg min-h-[800px] transform scale-90 origin-top-left w-[150%] font-serif"
      data-testid="resume-preview"
      style={{ 
        fontFamily: '"Times New Roman", serif',
        fontSize: '8pt',
        lineHeight: '1.0',
        maxWidth: '210mm', // A4 width
        minHeight: '297mm', // A4 height
        margin: '0 auto',
        // Custom styles for optimal A4 formatting
        '--text-density': '200%',
        '--line-spacing': '1.0',
        '--section-spacing': '0.75rem',
        '--bullet-spacing': '0.125rem'
      } as React.CSSProperties & { [key: string]: string }}
    >
      <div className="max-w-[200mm] mx-auto">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-2 mb-3">
          <h1 
            className="text-xl font-bold text-gray-900 mb-1"
            data-testid="preview-name"
          >
            {contact.firstName || contact.lastName 
              ? `${contact.firstName} ${contact.lastName}`.trim()
              : "Your Name"
            }
          </h1>
          
          {/* Contact Info Line 1 */}
          <div className="flex justify-center items-center flex-wrap gap-2 text-xs mb-1">
            {contact.phone && (
              <>
                <span data-testid="preview-phone">{contact.phone}</span>
                {(contact.email || contact.location) && <span>•</span>}
              </>
            )}
            {contact.email && (
              <>
                <span data-testid="preview-email">{contact.email}</span>
                {contact.location && <span>•</span>}
              </>
            )}
            {contact.location && (
              <span data-testid="preview-location">{contact.location}</span>
            )}
          </div>
          
          {/* Contact Info Line 2 */}
          {(contact.linkedin || contact.github || contact.portfolio) && (
            <div className="flex justify-center items-center flex-wrap gap-2 text-xs">
              {contact.linkedin && (
                <>
                  <span data-testid="preview-linkedin">{contact.linkedin}</span>
                  {(contact.github || contact.portfolio) && <span>•</span>}
                </>
              )}
              {contact.github && (
                <>
                  <span data-testid="preview-github">{contact.github}</span>
                  {contact.portfolio && <span>•</span>}
                </>
              )}
              {contact.portfolio && (
                <span data-testid="preview-portfolio">{contact.portfolio}</span>
              )}
            </div>
          )}
        </div>

        {/* Render sections based on order */}
        {memoizedSections.map(section => renderSection(section.id))}

        {/* Placeholder when empty */}
        {!contact.firstName && !contact.lastName && !summary?.content && 
         experiences && experiences.length === 0 && projects && projects.length === 0 && education && education.length === 0 && 
         (!achievements || achievements.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-2">Resume Preview</p>
            <p className="text-sm">Fill out the form on the left to see your resume preview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
