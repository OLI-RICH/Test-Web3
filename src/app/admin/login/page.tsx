"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Calendar, Loader2, UserPlus, LogIn } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Bascule entre mode Connexion et Inscription
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          mode: isLogin ? "login" : "register" 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          // 1. Enregistrement de la session
          localStorage.setItem("isLoggedIn", "true");
          
          // 2. TRIGGER : Informe le Footer de l'apparition du bouton Dashboard
          window.dispatchEvent(new Event("loginStateChange"));
          
          // 3. Redirection vers le Dashboard
          router.push("/admin/dashboard");
        } else {
          setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
          setIsLogin(true); // Repasse automatiquement en mode connexion
        }
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur PostgreSQL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Effet visuel d'arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2ecc71]/10 blur-[120px] rounded-full -z-10"></div>

      <div className="w-full max-w-md">
        <div className="bg-white/[0.02] border border-white/10 p-10 rounded-[40px] backdrop-blur-2xl shadow-2xl">
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-[#2ecc71] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
              <Calendar className="text-black w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              {isLogin ? "Connexion" : "Inscription"}
            </h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">
              EventSync Admin Panel
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-2xl text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-[#2ecc71] text-[10px] font-black uppercase rounded-2xl text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#2ecc71] transition-colors" />
              <input 
                type="email" 
                placeholder="Email"
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#2ecc71]/30 focus:bg-white/10 transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#2ecc71] transition-colors" />
              <input 
                type="password" 
                placeholder="Mot de passe"
                required
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#2ecc71]/30 focus:bg-white/10 transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#2ecc71] text-black font-black py-4 rounded-2xl uppercase text-[11px] tracking-[0.2em] hover:bg-green-400 hover:-translate-y-1 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {isLogin ? "Se connecter" : "Créer mon compte"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-[#2ecc71] transition-colors"
            >
              {isLogin ? "Pas de compte ? S'inscrire" : "Déjà admin ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}