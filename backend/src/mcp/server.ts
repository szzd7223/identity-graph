import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { prisma } from "../db.js";

// Initialize the MCP server
const server = new McpServer({
  name: "identity-graph-mcp",
  version: "1.0.0",
});

server.registerTool(
  "get_profile",
  {
    description: "Retrieve a complete professional profile by username. Returns contact details, experiences, education, projects, and skills.",
    inputSchema: z.object({
      username: z.string().describe("The username of the profile to retrieve"),
    }) as any,
  },
  async ({ username }: { username: string }): Promise<any> => {
    try {
      const profile = await prisma.profile.findUnique({
        where: { username },
        include: {
          experiences: true,
          education: true,
          projects: true,
          skills: true,
        },
      });

      if (!profile) {
        return {
          content: [{ type: "text", text: `Profile not found for username: ${username}` }],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error fetching profile: ${error.message}` }],
      };
    }
  }
);

server.registerTool(
  "search_experience",
  {
    description: "Search and filter through a user's professional experiences, projects, and skills using a text query.",
    inputSchema: z.object({
      username: z.string().describe("The profile username to search within"),
      query: z.string().describe("The query search term (searches roles, company names, descriptions, project titles, skills, etc.)"),
    }) as any,
  },
  async ({ username, query }: { username: string; query: string }): Promise<any> => {
    try {
      const profile = await prisma.profile.findUnique({
        where: { username },
        include: {
          experiences: true,
          projects: true,
          skills: true,
        },
      });

      if (!profile) {
        return {
          content: [{ type: "text", text: `Profile not found for username: ${username}` }],
        };
      }

      const lQuery = query.toLowerCase();

      const matchedExperiences = profile.experiences.filter(
        (exp) =>
          exp.company.toLowerCase().includes(lQuery) ||
          exp.role.toLowerCase().includes(lQuery) ||
          exp.description?.toLowerCase().includes(lQuery)
      );

      const matchedProjects = profile.projects.filter(
        (proj) =>
          proj.title.toLowerCase().includes(lQuery) ||
          proj.description.toLowerCase().includes(lQuery) ||
          proj.technologies.toLowerCase().includes(lQuery)
      );

      const matchedSkills = profile.skills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(lQuery) ||
          skill.category?.toLowerCase().includes(lQuery)
      );

      const results = {
        experiences: matchedExperiences,
        projects: matchedProjects,
        skills: matchedSkills,
      };

      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error searching experiences: ${error.message}` }],
      };
    }
  }
);

server.registerTool(
  "generate_formatted_resume",
  {
    description: "Generate a clean, professional, and beautifully formatted Markdown resume for a given user profile.",
    inputSchema: z.object({
      username: z.string().describe("The profile username to generate the resume for"),
    }) as any,
  },
  async ({ username }: { username: string }): Promise<any> => {
    try {
      const profile = await prisma.profile.findUnique({
        where: { username },
        include: {
          experiences: true,
          education: true,
          projects: true,
          skills: true,
        },
      });

      if (!profile) {
        return {
          content: [{ type: "text", text: `Profile not found for username: ${username}` }],
        };
      }

      let md = `# ${profile.fullName}\n`;
      md += `**${profile.title}**\n\n`;
      
      md += `Email: ${profile.email || "N/A"} | Phone: ${profile.phone || "N/A"} | Website: ${profile.website || "N/A"}\n`;
      md += `GitHub: ${profile.github || "N/A"} | LinkedIn: ${profile.linkedin || "N/A"}\n\n`;

      if (profile.bio) {
        md += `## Summary\n${profile.bio}\n\n`;
      }

      if (profile.experiences.length > 0) {
        md += `## Professional Experience\n`;
        profile.experiences.forEach((exp) => {
          const end = exp.endDate || "Present";
          md += `### ${exp.role} - ${exp.company} (${exp.startDate} to ${end})\n`;
          if (exp.description) {
            md += `${exp.description}\n`;
          }
          md += `\n`;
        });
      }

      if (profile.projects.length > 0) {
        md += `## Projects\n`;
        profile.projects.forEach((proj) => {
          md += `### ${proj.title}\n`;
          md += `${proj.description}\n`;
          md += `*Technologies: ${proj.technologies}*\n`;
          if (proj.url) {
            md += `*Link: [GitHub/Live](${proj.url})*\n`;
          }
          md += `\n`;
        });
      }

      if (profile.skills.length > 0) {
        md += `## Skills\n`;
        // Group skills by category
        const categories: Record<string, string[]> = {};
        profile.skills.forEach((skill) => {
          const cat = skill.category || "General";
          if (!categories[cat]) {
            categories[cat] = [];
          }
          categories[cat].push(skill.name);
        });

        for (const [cat, names] of Object.entries(categories)) {
          md += `* **${cat}**: ${names.join(", ")}\n`;
        }
        md += `\n`;
      }

      if (profile.education.length > 0) {
        md += `## Education\n`;
        profile.education.forEach((edu) => {
          const end = edu.endDate || "Present";
          const field = edu.field ? ` in ${edu.field}` : "";
          md += `* **${edu.degree}${field}** - ${edu.institution} (${edu.startDate} to ${end})\n`;
        });
      }

      return {
        content: [{ type: "text", text: md }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error generating formatted resume: ${error.message}` }],
      };
    }
  }
);

// Connect using standard I/O (stdio) transport
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("IdentityGraph MCP Server running on stdio");
