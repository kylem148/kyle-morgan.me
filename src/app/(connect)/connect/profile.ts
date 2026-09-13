export type ConnectLink = {
  service: "linkedin" | "website" | "email";
  title: string;
  href: string;
  display: string;
};

export const PROFILE = {
  firstName: "Kyle",
  lastName: "Morgan",
  name: "Kyle Morgan",
  headline: "CS @ Cal Poly SLO",
  work: "SWE Intern",
  company: "AWS DxHub",
  location: "San Luis Obispo",
  education: "California Polytechnic State University",
  degree: "BS in Computer Science",
  skills: ["Computer Science", "Leadership", "AI"],
  email: "kyle@themorganization.com",
  url: "https://kyle-morgan.me/connect",
};

export const LINKS: ConnectLink[] = [
  {
    service: "linkedin",
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/kyle-morgan0",
    display: "linkedin.com/in/kyle-morgan0",
  },
  {
    service: "website",
    title: "Website",
    href: "https://kyle-morgan.me",
    display: "kyle-morgan.me",
  },
  {
    service: "email",
    title: "Email",
    href: "mailto:kyle@themorganization.com",
    display: "kyle@themorganization.com",
  },
];
