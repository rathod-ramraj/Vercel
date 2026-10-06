export type Skill = { name: string; icon: string; category: SkillCategory };

export type SkillCategory =
  | "Languages"
  | "Frontend"
  | "Styling"
  | "Backend"
  | "Databases"
  | "AI & APIs"
  | "Tools"
  | "Core Subjects";

const dev = (slug: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;
const si = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

export const SKILLS: Skill[] = [
  // Languages
  { category: "Languages", name: "C", icon: dev("c") },
  { category: "Languages", name: "C++", icon: dev("cplusplus") },
  { category: "Languages", name: "JavaScript", icon: dev("javascript") },
  { category: "Languages", name: "Python", icon: dev("python") },

  // Frontend
  { category: "Frontend", name: "React", icon: dev("react") },
  { category: "Frontend", name: "Next.js", icon: dev("nextjs") },
  { category: "Frontend", name: "HTML5", icon: dev("html5") },
  { category: "Frontend", name: "CSS3", icon: dev("css3") },

  // Styling
  { category: "Styling", name: "Tailwind CSS", icon: dev("tailwindcss") },
  { category: "Styling", name: "Bootstrap", icon: dev("bootstrap") },

  // Backend
  { category: "Backend", name: "Node.js", icon: dev("nodejs") },
  { category: "Backend", name: "Express.js", icon: dev("express") },
  { category: "Backend", name: "Flask", icon: dev("flask") },

  // Databases
  { category: "Databases", name: "MongoDB", icon: dev("mongodb") },
  { category: "Databases", name: "PostgreSQL", icon: dev("postgresql") },

  // AI & APIs
  { category: "AI & APIs", name: "Gemini API", icon: si("googlegemini") },
  { category: "AI & APIs", name: "JWT Authentication", icon: si("jsonwebtokens") },
  { category: "AI & APIs", name: "Google OAuth", icon: dev("google") },
  { category: "AI & APIs", name: "REST APIs", icon: si("postman") },

  // Tools
  { category: "Tools", name: "Git", icon: dev("git") },
  { category: "Tools", name: "GitHub", icon: dev("github") },
  { category: "Tools", name: "VS Code", icon: dev("vscode") },
  { category: "Tools", name: "Vercel", icon: dev("vercel") },
  { category: "Tools", name: "Render", icon: si("render") },
  { category: "Tools", name: "Postman", icon: dev("postman") },

  // Core Subjects
  { category: "Core Subjects", name: "Data Structures & Algorithms", icon: si("thealgorithms") },
  { category: "Core Subjects", name: "OOPs", icon: si("diagramsdotnet") },
  { category: "Core Subjects", name: "DBMS", icon: si("databricks") },
  { category: "Core Subjects", name: "Operating Systems", icon: dev("linux") },
  { category: "Core Subjects", name: "Computer Networks", icon: si("cisco") },
];

export const CATEGORIES: SkillCategory[] = [
  "Languages",
  "Frontend",
  "Styling",
  "Backend",
  "Databases",
  "AI & APIs",
  "Tools",
  "Core Subjects",
];
