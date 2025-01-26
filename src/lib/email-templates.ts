export interface EmailTemplate {
  id: string;
  name: string;
  type: "job-referral" | "cold-email" | "follow-up";
  subject: string;
  body: string;
  placeholders: string[];
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "job-referral-1",
    name: "Standard Job Referral",
    type: "job-referral",
    subject: "Referral Request for {position} Position at {companyName}",
    body: `Hi {recipientName},
  
I hope you are healthy and doing great!

I recently came across an open position of {position} role at {companyName}. With {yearsOfExperience} years of experience in HTML, CSS, JavaScript, React.JS, Next.JS {additionalSkills}, I believe I would be a strong candidate for this position as it aligns well with my skills.

Would you be open to referring me for this position or heinglp me connect with the hiring team? I would appreciate it.

I have attached my resume and portfolio below for you to look over.

Resume: https://drive.google.com/file/d/1MDN3vimtiGFFmS8Gv9bZ0c5Y_D5mV5sR/view?usp=drivesdk 
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
    id: "cold-email-1",
    name: "Professional Cold Outreach",
    type: "cold-email",
    subject: "Intrested in {position} Opportunities at {companyName}",
    body: `Hi {recipientName},

I hope you are healthy and doing great! 

I'm a {position} professional with {yearsOfExperience} years of experience, specializing in HTML, CSS, JavaScript, React.JS, Next.JS {additionalSkills}.

I'm particularly interested in {companyName}'s innovative work in {companyIndustry}.

I have attached my resume and portfolio below for you to look over and would love to have a brief conversation about potential opportunities.

Resume: https://drive.google.com/file/d/1MDN3vimtiGFFmS8Gv9bZ0c5Y_D5mV5sR/view?usp=drivesdk 
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
    id: "follow-up-1",
    name: "Professional Follow-up",
    type: "follow-up",
    subject: "Follow-up: {position} Application at {companyName}",
    body: `Dear {recipientName},
  
  I'm following up on my recent application for the {position} role at {companyName}. Given my {yearsOfExperience} years of experience in {additionalSkills}, I remain very excited about this opportunity.
  
  I would appreciate any updates on the application status.
  
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

export function getTemplateById(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find((template) => template.id === id);
}

export function getTemplatesByType(
  type: EmailTemplate["type"]
): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter((template) => template.type === type);
}
