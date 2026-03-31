import mongoose from "mongoose";
import Job from "./models/Job.js";

const fallbackJobs = [
  {
    title: "Senior Java Full Stack Developer (React)",
    location: "Pune (Hybrid)",
    experience: "8–10 years",
    description: "Job ID: ADR-JFS-270326-001\n\nThis role is for an experienced developer who can handle both backend and frontend development. The main responsibility is to build and maintain enterprise-level applications.\nOn the backend side, you will work with Java (versions 8, 11, or 17) and frameworks like Spring Boot, Spring MVC, and Spring Security. You will create REST APIs and microservices, handle database operations using Hibernate/JPA, and ensure security using OAuth2 and JWT.\nOn the frontend, you will build user interfaces using React.js, JavaScript (ES6+), or TypeScript. You should know state management tools like Redux or Context API and be able to create reusable UI components.\nYou will also work with databases like Oracle or SQL Server, use Git for version control, and support CI/CD pipelines using tools like Jenkins or GitHub Actions. Knowledge of Docker and cloud platforms (AWS or Azure) is a plus.\nThe role requires working in Agile teams, collaborating with different departments, solving production issues, and maintaining high-quality, secure code.",
    skills: ["Java (8/11/17)", "Spring Boot", "React.js", "REST APIs", "Hibernate/JPA", "SQL", "Git", "Docker", "AWS/Azure"],
    active: true
  },
  {
    title: "Generative AI Engineer (Agentic AI / MCP)",
    location: "Gurgaon (Hybrid)",
    experience: "7+ years",
    description: "Job ID: ADR-GAI-260327-002\n\nThis role is focused on Artificial Intelligence, especially Generative AI and modern LLM (Large Language Model) systems.\nYou will design and develop AI solutions using technologies like RAG (Retrieval-Augmented Generation), NLP, and predictive modeling. You will also work on agent-based AI systems (Agentic AI) and MCP frameworks.\nThe main programming language is Python, and you should have strong experience in machine learning and AI workflows. You will also handle OCR and image processing tasks.\nAdditionally, you will be responsible for deploying AI solutions using CI/CD pipelines, Docker, and Kubernetes. You will work closely with stakeholders and take ownership of designing complete AI systems.",
    skills: ["Python", "Generative AI", "LLMs", "RAG", "NLP", "Agentic AI", "MCP", "Docker", "Kubernetes"],
    active: true
  },
  {
    title: "IBM Sterling B2B Integrator (B2Bi) Developer",
    location: "Hyderabad (Hybrid)",
    experience: "5+ years",
    description: "Job ID: ART-STL-B2B-260327-003\n\nThis role is for professionals experienced in B2B integrations using IBM Sterling tools.\nYou will design and build business processes, manage file transfers between systems, and create maps for trading partner integrations. You will also handle translation and transmission flows.\nA key part of the role is monitoring file processing, identifying issues, and fixing them quickly. You will also work with dashboards, troubleshoot protocols, and support production systems.\nExperience with Sterling File Gateway (SFG) is important, along with the ability to handle both development and support tasks.",
    skills: ["IBM Sterling B2Bi", "Sterling File Gateway (SFG)", "B2B Integrations", "Mapping", "Troubleshooting"],
    active: true
  },
  {
    title: "OpenText Archive Migration Specialist (SAP)",
    location: "Hyderabad (Hybrid)",
    experience: "5+ years",
    description: "Job ID: ART-SAPOT-260327-004\n\nThis role focuses on migrating archive systems from on-premise to cloud.\nYou will manage the full migration process of OpenText Archive systems to the cloud version. This includes exporting data, validating it, preparing cloud systems, and testing integration with SAP.\nYou will also verify that archived documents (both old and new) are working properly after migration. The role involves coordination with multiple teams like SAP, database admins, cloud teams, and OpenText support.\nStrong knowledge of OpenText Archive, SAP integration, and data migration is required.",
    skills: ["OpenText Archive", "SAP Integration", "Data Migration", "Cloud Migration"],
    active: true
  },
  {
    title: "Senior React.js Developer / Frontend Lead",
    location: "Pune (Hybrid)",
    experience: "5+ years",
    description: "Job ID: ART-RFE-260327-005\n\nThis is a leadership role focused on frontend development using React.js.\nYou will lead the development of frontend features, make architectural decisions, and ensure the application is scalable and high-performing. You will also mentor team members and guide them through code reviews and best practices.\nYour work includes building responsive UI, optimizing performance, managing state, and integrating APIs. You will collaborate with product, UX, QA, and DevOps teams to deliver projects on time.",
    skills: ["React.js", "Frontend Architecture", "State Management", "API Integration", "Mentoring", "Performance Optimization"],
    active: true
  },
  {
    title: "Java Backend Developer",
    location: "Bangalore (Hybrid)",
    experience: "4–7 years",
    description: "Job ID: ADR-JBD-280326-006\n\nRole Overview\nWe are looking for a skilled Java Backend Developer to build scalable and secure backend services. The ideal candidate should have strong experience in Java and Spring Boot, along with the ability to design and develop RESTful APIs.\n\nKey Responsibilities\n- Develop and maintain backend services using Java and Spring Boot\n- Design and build REST APIs and microservices\n- Work with databases and optimize performance\n- Collaborate with frontend and DevOps teams\n- Ensure code quality, security, and scalability\n- Troubleshoot and resolve production issues",
    skills: ["Java (8/11/17)", "Spring Boot", "Spring MVC", "REST API", "Hibernate / JPA", "SQL", "Git"],
    active: true
  },
  {
    title: "Senior Frontend Developer (React.js)",
    location: "Hyderabad (Hybrid)",
    experience: "6–9 years",
    description: "Job ID: ADR-SFE-280326-007\n\nRole Overview\nWe are seeking a Senior Frontend Developer to build modern, scalable, and high-performance user interfaces using React.js.\n\nKey Responsibilities\n- Develop responsive and reusable UI components\n- Lead frontend architecture and design decisions\n- Optimize application performance\n- Collaborate with backend and design teams\n- Maintain code quality and best practices",
    skills: ["React.js (advanced)", "JavaScript (ES6+) / TypeScript", "HTML5", "CSS3", "Redux / Context API", "API integration"],
    active: true
  },
  {
    title: "Backend Developer (Node.js)",
    location: "Pune (Hybrid)",
    experience: "3–6 years",
    description: "Job ID: ADR-BED-280326-008\n\nRole Overview\nWe are looking for a Node.js Backend Developer to build efficient, scalable server-side applications.\n\nKey Responsibilities\n- Develop APIs and backend services using Node.js\n- Work with databases and server-side logic\n- Ensure security and performance\n- Integrate third-party services and APIs\n- Debug and fix backend issues",
    skills: ["Node.js", "Express.js", "REST APIs", "MongoDB / SQL", "JavaScript", "Git"],
    active: true
  },
  {
    title: "Full Stack Developer (Java + React)",
    location: "Chennai (Hybrid)",
    experience: "5–8 years",
    description: "Job ID: ADR-FSD-280326-009\n\nRole Overview\nWe are hiring a Full Stack Developer with expertise in both backend (Java) and frontend (React.js) to deliver end-to-end solutions.\n\nKey Responsibilities\n- Develop backend services using Java and Spring Boot\n- Build frontend applications using React.js\n- Work on API integration and system design\n- Collaborate across teams\n- Ensure high-quality code and performance",
    skills: ["Java", "Spring Boot", "React.js", "REST APIs", "SQL databases", "Git"],
    active: true
  },
  {
    title: "Junior Java Developer",
    location: "Remote / Hybrid",
    experience: "1–3 years",
    description: "Job ID: ADR-JJD-280326-010\n\nRole Overview\nWe are looking for a passionate Junior Java Developer to support development and maintenance of applications.\n\nKey Responsibilities\n- Assist in developing Java applications\n- Write clean and maintainable code\n- Fix bugs and support testing\n- Learn and grow with senior developers",
    skills: ["Basic Java knowledge", "Spring Boot (basic)", "SQL", "Problem-solving skills"],
    active: true
  }
];

async function seed() {
  let mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careers";
  mongoUri = mongoUri.replace(/^["']|["']$/g, "").trim();
  
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");
    
    await Job.deleteMany({});
    console.log("Cleared existing jobs.");
    
    await Job.insertMany(fallbackJobs);
    console.log("Inserted new fallback jobs.");
    
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
