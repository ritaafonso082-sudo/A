import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Project } from "../types";
import { getDirectImageUrl } from "../utils";
import { ArrowLeft } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProject(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load project", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500 uppercase tracking-widest text-sm">Carregando...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-8 text-center">
        <p className="text-zinc-600 mb-6">Projeto não encontrado.</p>
        <Link to="/" className="text-zinc-900 border-b border-zinc-900 pb-1 hover:text-black transition-colors">Voltar à página inicial</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="fixed top-0 left-0 w-full p-8 z-10 mix-blend-difference text-white flex justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity">
          <ArrowLeft size={20} />
          <span className="font-medium tracking-tight uppercase text-sm">Voltar</span>
        </Link>
      </header>
      
      <main className="pt-24 pb-32">
        <div className="px-8 md:px-16 mx-auto w-full mb-16">
          <div className="h-[60vh] w-full overflow-hidden bg-zinc-200">
             <img 
              src={getDirectImageUrl(project.thumbnail)} 
              alt={project.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="px-8 md:px-16 max-w-4xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="md:w-1/3">
             <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 mb-6">{project.title}</h1>
             <div className="space-y-2 border-t border-zinc-200 pt-6">
                <p className="text-sm text-zinc-500 uppercase tracking-widest">Ano</p>
                <p className="text-base text-zinc-900">{project.year || "N/A"}</p>
             </div>
             <div className="space-y-2 border-t border-zinc-200 pt-6 mt-6 border-b pb-6">
                <p className="text-sm text-zinc-500 uppercase tracking-widest">Localização</p>
                <p className="text-base text-zinc-900">{project.location || "N/A"}</p>
             </div>
          </div>

          <div className="md:w-2/3 mt-2 md:mt-[4.5rem]">
            <p className="text-lg leading-relaxed text-zinc-700 whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-32 px-8 md:px-16 w-full mx-auto space-y-8 md:space-y-16">
            {project.gallery.map((img, index) => (
              <div key={index} className="w-full bg-zinc-200">
                 <img 
                  src={getDirectImageUrl(img)} 
                  alt={`${project.title} galeria ${index + 1}`} 
                  className="w-full h-auto object-cover max-h-[80vh]"
                  referrerPolicy="no-referrer"
                 />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
