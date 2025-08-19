import { ResumeData } from '@/types/resume';

export async function exportToPDF(resumeData: ResumeData, filename: string = 'resume.pdf') {
  try {
    // Create a new window with the resume content for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    const resumeHTML = generateResumeHTML(resumeData);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            ${getResumeCSS()}
          </style>
        </head>
        <body>
          ${resumeHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export resume as PDF');
  }
}

export function exportToTXT(resumeData: ResumeData, filename: string = 'resume.txt') {
  try {
    const textContent = generateResumeText(resumeData);
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to TXT:', error);
    throw new Error('Failed to export resume as TXT');
  }
}

export function exportToDOCX(resumeData: ResumeData, filename: string = 'resume.docx') {
  // For DOCX export, we'll create a simple HTML version and let the user save it
  // A full DOCX implementation would require additional libraries
  try {
    const htmlContent = generateResumeHTML(resumeData);
    const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw new Error('Failed to export resume as DOCX');
  }
}

function generateResumeHTML(resumeData: ResumeData): string {
  const { contact, summary, experiences, skills, education, projects } = resumeData;
  
  return `
    <div class="resume">
      <!-- Header -->
      <div class="header">
        <h1>${contact.firstName} ${contact.lastName}</h1>
        <div class="contact-info">
          <span>${contact.phone}</span> • 
          <span>${contact.email}</span> • 
          <span>${contact.location}</span>
        </div>
        <div class="contact-links">
          <span>${contact.linkedin}</span> • 
          <span>${contact.github}</span> • 
          <span>${contact.portfolio}</span>
        </div>
      </div>

      <!-- Professional Summary -->
      ${summary.content ? `
        <div class="section">
          <h2>PROFESSIONAL SUMMARY</h2>
          <p>${summary.content}</p>
        </div>
      ` : ''}

      <!-- Technical Skills -->
      <div class="section">
        <h2>TECHNICAL SKILLS</h2>
        <div class="skills-grid">
          ${skills.languages ? `<div><strong>Programming Languages:</strong> ${skills.languages}</div>` : ''}
          ${skills.frameworks ? `<div><strong>Frameworks & Libraries:</strong> ${skills.frameworks}</div>` : ''}
          ${skills.databases ? `<div><strong>Databases & Storage:</strong> ${skills.databases}</div>` : ''}
          ${skills.cloud ? `<div><strong>Cloud & DevOps:</strong> ${skills.cloud}</div>` : ''}
          ${skills.tools ? `<div><strong>Tools & Technologies:</strong> ${skills.tools}</div>` : ''}
        </div>
      </div>

      <!-- Professional Experience -->
      ${experiences.length > 0 ? `
        <div class="section">
          <h2>PROFESSIONAL EXPERIENCE</h2>
          ${experiences.map(exp => `
            <div class="experience-item">
              <div class="experience-header">
                <div>
                  <strong>${exp.title}</strong> | ${exp.company}
                </div>
                <div class="date">
                  ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              <div class="experience-description">
                ${exp.description.split('\n').map(line => 
                  line.trim().startsWith('•') ? `<li>${line.substring(1).trim()}</li>` : 
                  line.trim() ? `<li>${line}</li>` : ''
                ).filter(Boolean).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Projects -->
      ${projects.length > 0 ? `
        <div class="section">
          <h2>PROJECTS</h2>
          ${projects.map(project => `
            <div class="project-item">
              <div class="project-header">
                <strong>${project.name}</strong> | ${project.technologies}
              </div>
              <div class="project-description">
                ${project.description.split('\n').map(line => 
                  line.trim().startsWith('•') ? `<li>${line.substring(1).trim()}</li>` : 
                  line.trim() ? `<li>${line}</li>` : ''
                ).filter(Boolean).join('')}
                ${project.github ? `<li>GitHub: ${project.github}</li>` : ''}
                ${project.demo ? `<li>Live Demo: ${project.demo}</li>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Education -->
      ${education.length > 0 ? `
        <div class="section">
          <h2>EDUCATION</h2>
          ${education.map(edu => `
            <div class="education-item">
              <div class="education-header">
                <div>
                  <strong>${edu.degree}</strong>
                </div>
                <div class="date">${edu.year}</div>
              </div>
              <div>${edu.institution}, ${edu.location}</div>
              ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
              ${edu.coursework ? `<div>Relevant Coursework: ${edu.coursework}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function generateResumeText(resumeData: ResumeData): string {
  const { contact, summary, experiences, skills, education, projects } = resumeData;
  
  let text = '';
  
  // Header
  text += `${contact.firstName} ${contact.lastName}\n`;
  text += `${contact.phone} | ${contact.email} | ${contact.location}\n`;
  text += `${contact.linkedin} | ${contact.github} | ${contact.portfolio}\n\n`;
  
  // Professional Summary
  if (summary.content) {
    text += `PROFESSIONAL SUMMARY\n`;
    text += `${summary.content}\n\n`;
  }
  
  // Technical Skills
  text += `TECHNICAL SKILLS\n`;
  if (skills.languages) text += `Programming Languages: ${skills.languages}\n`;
  if (skills.frameworks) text += `Frameworks & Libraries: ${skills.frameworks}\n`;
  if (skills.databases) text += `Databases & Storage: ${skills.databases}\n`;
  if (skills.cloud) text += `Cloud & DevOps: ${skills.cloud}\n`;
  if (skills.tools) text += `Tools & Technologies: ${skills.tools}\n`;
  text += '\n';
  
  // Professional Experience
  if (experiences.length > 0) {
    text += `PROFESSIONAL EXPERIENCE\n`;
    experiences.forEach(exp => {
      text += `${exp.title} | ${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      text += `${exp.description}\n\n`;
    });
  }
  
  // Projects
  if (projects.length > 0) {
    text += `PROJECTS\n`;
    projects.forEach(project => {
      text += `${project.name} | ${project.technologies}\n`;
      text += `${project.description}\n`;
      if (project.github) text += `GitHub: ${project.github}\n`;
      if (project.demo) text += `Live Demo: ${project.demo}\n`;
      text += '\n';
    });
  }
  
  // Education
  if (education.length > 0) {
    text += `EDUCATION\n`;
    education.forEach(edu => {
      text += `${edu.degree} | ${edu.institution} | ${edu.year}\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
      if (edu.coursework) text += `Relevant Coursework: ${edu.coursework}\n`;
      text += '\n';
    });
  }
  
  return text;
}

function getResumeCSS(): string {
  return `
    @page {
      margin: 0.5in;
      size: letter;
    }
    
    body {
      font-family: 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.3;
      color: #000;
      margin: 0;
      padding: 0;
    }
    
    .resume {
      max-width: 8.5in;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 8pt;
      margin-bottom: 12pt;
    }
    
    .header h1 {
      font-size: 18pt;
      font-weight: bold;
      margin: 0 0 6pt 0;
    }
    
    .contact-info, .contact-links {
      font-size: 10pt;
      margin: 3pt 0;
    }
    
    .section {
      margin-bottom: 12pt;
    }
    
    .section h2 {
      font-size: 12pt;
      font-weight: bold;
      border-bottom: 1px solid #666;
      margin: 0 0 6pt 0;
      padding-bottom: 2pt;
    }
    
    .skills-grid div {
      margin-bottom: 2pt;
      font-size: 10pt;
    }
    
    .experience-item, .project-item, .education-item {
      margin-bottom: 8pt;
    }
    
    .experience-header, .project-header, .education-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2pt;
      font-size: 10pt;
    }
    
    .date {
      font-size: 10pt;
      color: #666;
    }
    
    .experience-description, .project-description {
      font-size: 10pt;
      margin-left: 12pt;
    }
    
    .experience-description li, .project-description li {
      margin-bottom: 1pt;
      list-style-type: disc;
    }
    
    ul {
      margin: 0;
      padding-left: 12pt;
    }
    
    li {
      margin-bottom: 2pt;
    }
    
    strong {
      font-weight: bold;
    }
  `;
}
