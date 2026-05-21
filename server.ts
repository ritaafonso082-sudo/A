import express from "express";
import fs from "fs/promises";
import path from "path";
import { createServer as createViteServer } from "vite";
import { v4 as uuidv4 } from "uuid";

interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  year?: string;
  location?: string;
}

const DATA_FILE = path.join(process.cwd(), "data.json");
const ADMIN_PASS = "xtbsexo";

async function readData(): Promise<Project[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data) as Project[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeData(data: Project[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---
  
  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await readData();
      res.json(projects);
    } catch (e) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projects = await readData();
      const project = projects.find((p) => p.id === req.params.id);
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ error: "Project not found" });
      }
    } catch (e) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  // Login (returns simply ok if password matches)
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASS) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  // Add new project
  app.post("/api/projects", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_PASS}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const { title, description, thumbnail, gallery, year, location } = req.body;
      if (!title || !thumbnail) {
        res.status(400).json({ error: "Title and thumbnail are required" });
        return;
      }

      const projects = await readData();
      
      const newProject: Project = {
        id: uuidv4(),
        title,
        description: description || "",
        thumbnail,
        gallery: Array.isArray(gallery) ? gallery : [],
        year: year || "",
        location: location || ""
      };

      projects.push(newProject);
      await writeData(projects);

      res.status(201).json(newProject);
    } catch (e) {
      res.status(500).json({ error: "Failed to save project" });
    }
  });

  // --- Vite Middleware & SPA Fallback ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
