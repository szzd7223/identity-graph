import { prisma } from "../src/db.js";

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.profile.deleteMany();

  // Create a default test profile
  const profile = await prisma.profile.create({
    data: {
      username: "johndoe",
      fullName: "John Doe",
      title: "Senior Full Stack Engineer",
      bio: "Passionate builder of open-source tools and AI integrations.",
      email: "john.doe@example.com",
      phone: "+1234567890",
      website: "https://johndoe.dev",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      experiences: {
        create: [
          {
            company: "Tech Corp",
            role: "Senior Developer",
            startDate: "2023-01",
            description: "Led team of developers building responsive dashboard metrics and services."
          },
          {
            company: "Web Startups Inc",
            role: "Software Engineer",
            startDate: "2021-06",
            endDate: "2022-12",
            description: "Developed and maintained full-stack web applications using React and Node.js."
          }
        ]
      },
      education: {
        create: [
          {
            institution: "State University",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2017-09",
            endDate: "2021-05"
          }
        ]
      },
      projects: {
        create: [
          {
            title: "IdentityGraph",
            description: "A professional profile portfolio management system featuring MCP integrations.",
            url: "https://github.com/johndoe/identity-graph",
            technologies: "Next.js, Express, SQLite, Prisma, MCP"
          }
        ]
      },
      skills: {
        create: [
          { name: "TypeScript", category: "Languages" },
          { name: "Node.js", category: "Backend" },
          { name: "React", category: "Frontend" },
          { name: "SQLite", category: "Database" }
        ]
      }
    }
  });

  console.log(`Database seeded successfully! Created profile for username: ${profile.username}`);
}

main()
  .catch((e) => {
    console.error("Seeding failed: ", e);
    process.exit(1);
  });
