import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Project } from "../types";
import { getDirectImageUrl } from "../utils";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load projects", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 uppercase tracking-widest text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="fixed top-0 left-0 w-full p-8 z-10 mix-blend-difference text-white">
        <h1 className="text-2xl font-medium tracking-tight">ARQ. STUDIOS</h1>
      </header>

      <main className="pt-32 pb-24 px-8 md:px-16 w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              to={`/project/${project.id}`}
              className="group block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-zinc-200">
                <img 
                  src={getDirectImageUrl(project.thumbnail)} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-90"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4 flex justify-between items-center text-zinc-900">
                <h2 className="text-lg tracking-tight font-medium">{project.title}</h2>
                <span className="text-sm text-zinc-500">{project.year}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-zinc-200 mt-12 py-16 px-8 md:px-16 text-center text-zinc-900">
        <h3 className="text-xl tracking-tight mb-6">Contactos</h3>
        <p className="text-sm text-zinc-500 mb-2">geral@arqstudios.pt</p>
        <p className="text-sm text-zinc-500 mb-2">+351 912 345 678</p>
        <p className="text-sm text-zinc-500 mt-8 mb-4">Lisboa, Portugal</p>
        <p className="text-xs text-zinc-400 mt-12">&copy; {new Date().getFullYear()} Arq. Studios. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
