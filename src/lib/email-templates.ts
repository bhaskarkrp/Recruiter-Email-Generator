export type TemplateType = "job-referral" | "cold-email" | "follow-up";

export type RadioFilers = "all" | "yours" | "admin";
export interface EmailTemplate {
  id: string;
  name: string;
  type: TemplateType;
  subject: string;
  body: string;
  placeholders: string[];
}

export const TEMPLATE_TYPES: TemplateType[] = [
  "job-referral",
  "cold-email",
  "follow-up",
];

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "default-temp-1",
    name: "Standard Job Referral [Default]",
    type: "job-referral",
    subject: "Referral Request for {position} Position at {companyName}",
    body: `Hi {recipientName},
  
I hope you are healthy and doing great!

I recently came across an open position of {position} role at {companyName}. With {yearsOfExperience} years of experience in HTML, CSS, JavaScript, React.JS, Next.JS {additionalSkills}, I believe I would be a strong candidate for this position as it aligns well with my skills.

Would you be open to referring me for this position or helping me connect with the hiring team? I would appreciate it.

I have attached my resume and portfolio below for you to look over.

Resume: {resumeLink}
Portfolio: {portfolioLink}

Thank you for your time and support!

Best regards,
{senderName}`,
    placeholders: [
      "recipientName",
      "companyName",
      "position",
      "yearsOfExperience",
      "additionalSkills",
      "resumeLink",
      "portfolioLink",
      "senderName",
    ],
  },
  {
    id: "default-temp-2",
    name: "Professional Cold Outreach [Default]",
    type: "cold-email",
    subject: "Intrested in {position} Opportunities at {companyName}",
    body: `Hi {recipientName},

I hope you are healthy and doing great! 

I'm a {position} professional with {yearsOfExperience} years of experience, specializing in HTML, CSS, JavaScript, React.JS, Next.JS {additionalSkills}.

I'm particularly interested in {companyName}'s innovative work in {companyIndustry}.

I have attached my resume and portfolio below for you to look over and would love to have a brief conversation about potential opportunities.

Resume: {resumeLink}
Portfolio: {portfolioLink}

I'm looking forward to hearing from you.

Warm regards,
{senderName}`,
    placeholders: [
      "recipientName",
      "companyName",
      "position",
      "yearsOfExperience",
      "additionalSkills",
      "companyIndustry",
      "resumeLink",
      "portfolioLink",
      "senderName",
    ],
  },
  {
    id: "default-temp-3",
    name: "Professional Follow-up [Default]",
    type: "follow-up",
    subject: "Follow-up: {position} Application at {companyName}",
    body: `Hi {recipientName},
  
I wanted to follow up on my recent application for the {position} role at {companyName}. Given my {yearsOfExperience} years of experience in HTML, CSS, JavaScript, React.JS, Next.JS {additionalSkills}, I remain very excited about this opportunity.
  
I would appreciate any updates on the application status. Thank you for your consideration.
  
Best regards,
{senderName}`,
    placeholders: [
      "recipientName",
      "companyName",
      "position",
      "yearsOfExperience",
      "additionalSkills",
      "senderName",
    ],
  },
];

export const ADMIN_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "admin-default-temp-1",
    name: "Standard Job Referral [Default]",
    type: "job-referral",
    subject: "Referral Request for {position} Position at {companyName}",
    body: `Hi {recipientName},
  
I hope you are healthy and doing great!

I recently came across an open position of {position} role at {companyName}. With {yearsOfExperience} years of experience in HTML, CSS, JavaScript, React.JS, Next.JS {additionalSkills}, I believe I would be a strong candidate for this position as it aligns well with my skills.

Would you be open to referring me for this position or helping me connect with the hiring team? I would appreciate it.

I have attached my resume and portfolio below for you to look over.

Resume: https://drive.google.com/file/d/1Ix2QIDau65O2ej7pt6RJGdWfAI4w5SsJ/view?usp=drive_link
Portfolio: portfolio-bhaskarkrp.vercel.app

Thank you for your time and support!

Best regards,
{senderName}`,
    placeholders: [
      "recipientName",
      "companyName",
      "position",
      "yearsOfExperience",
      "additionalSkills",
      "senderName",
    ],
  },
  {
    id: "admin-default-temp-2",
    name: "Professional Cold Outreach [Default]",
    type: "cold-email",
    subject: "Intrested in {position} Opportunities at {companyName}",
    body: `Hi {recipientName},

I hope you are healthy and doing great! 

I'm a {position} professional with {yearsOfExperience} years of experience, specializing in HTML, CSS, JavaScript, React.JS, Next.JS {additionalSkills}.

I'm particularly interested in {companyName}'s innovative work in {companyIndustry}.

I have attached my resume and portfolio below for you to look over and would love to have a brief conversation about potential opportunities.

Resume: https://drive.google.com/file/d/1Ix2QIDau65O2ej7pt6RJGdWfAI4w5SsJ/view?usp=drive_link
Portfolio: portfolio-bhaskarkrp.vercel.app

I'm looking forward to hearing from you.

Warm regards,
{senderName}`,
    placeholders: [
      "recipientName",
      "companyName",
      "position",
      "yearsOfExperience",
      "additionalSkills",
      "companyIndustry",
      "senderName",
    ],
  },
  {
    id: "admin-default-temp-3",
    name: "Professional Follow-up [Default]",
    type: "follow-up",
    subject: "Follow-up: {position} Application at {companyName}",
    body: `Hi {recipientName},
  
I wanted to follow up on my recent application for the {position} role at {companyName}. Given my {yearsOfExperience} years of experience in HTML, CSS, JavaScript, React.JS, Next.JS {additionalSkills}, I remain very excited about this opportunity.
  
I would appreciate any updates on the application status. Thank you for your consideration.
  
Best regards,
{senderName}`,
    placeholders: [
      "recipientName",
      "companyName",
      "position",
      "yearsOfExperience",
      "additionalSkills",
      "senderName",
    ],
  },
];

export function getTemplateById(
  EmailTemplates: EmailTemplate[],
  id: string
): EmailTemplate | undefined {
  return EmailTemplates.find((template) => template.id === id);
}

export function getTemplatesByType(
  type: EmailTemplate["type"]
): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter((template) => template.type === type);
}
