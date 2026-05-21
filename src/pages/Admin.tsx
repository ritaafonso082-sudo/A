import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [gallery, setGallery] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
      } else {
        setLoginError("Password incorreta.");
      }
    } catch (err) {
      setLoginError("Erro de ligação.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    const galleryArray = gallery
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify({
          title,
          description,
          thumbnail,
          gallery: galleryArray,
          year,
          location
        })
      });

      if (res.ok) {
        setSuccessMsg("Projeto publicado com sucesso!");
        setTitle("");
        setDescription("");
        setThumbnail("");
        setGallery("");
        setYear("");
        setLocation("");
      } else {
        setSuccessMsg("Erro ao publicar o projeto. Verifique os dados.");
      }
    } catch (err) {
      setSuccessMsg("Erro ao publicar o projeto.");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white p-8 border border-zinc-200">
          <h2 className="text-2xl font-medium tracking-tight text-zinc-900 mb-6 text-center">Admin Privado</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Palavra-passe</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-shadow"
              />
            </div>
            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-3 uppercase tracking-widest text-xs font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? "A entrar..." : "Entrar"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Voltar ao site</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft size={16} />
          <span className="text-sm uppercase tracking-widest">Voltar ao site público</span>
        </Link>
        
        <h2 className="text-3xl font-medium tracking-tight text-zinc-900 mb-8">Adicionar Novo Projeto</h2>
        
        <div className="bg-white p-8 border border-zinc-200 shadow-sm">
          {successMsg && (
            <div className={`p-4 mb-6 text-sm ${successMsg.includes("sucesso") ? "bg-green-50 text-green-800 border bg-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmitProject} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Título do Projeto *</label>
              <input 
                type="text" required
                value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Ano</label>
                <input 
                  type="text"
                  value={year} onChange={(e) => setYear(e.target.value)}
                  placeholder="Ex: 2024"
                  className="w-full border border-zinc-300 p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Localização</label>
                <input 
                  type="text" 
                  value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Lisboa, Portugal"
                  className="w-full border border-zinc-300 p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">URL da Imagem Principal (Thumbnail) *</label>
              <input 
                type="url" required
                value={thumbnail} onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">URLs da Galeria (Separados por vírgula)</label>
              <textarea 
                rows={3}
                value={gallery} onChange={(e) => setGallery(e.target.value)}
                placeholder="https://exemplo.com/img1.jpg, https://exemplo.com/img2.jpg"
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Descrição do Projeto</label>
              <textarea 
                rows={6}
                value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-zinc-300 p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-4 uppercase tracking-widest text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "A publicar..." : "Publicar Projeto"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
