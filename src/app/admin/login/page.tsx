// "use client";

// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Calendar, Lock, Mail } from "lucide-react";

// export default function AdminLogin() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
    
//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (result?.error) {
//       setError("Email ou mot de passe incorrect");
//       setLoading(false);
//     } else {
//       router.push("/admin/dashboard");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <Calendar className="w-8 h-8 text-white" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900">Admin EventSync</h2>
//           <p className="text-gray-500 mt-2">Connectez-vous pour gérer vos événements</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="admin@eventsync.com"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
//           >
//             {loading ? "Connexion..." : "Se connecter"}
//           </button>
//         </form>

//         <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
//           <p>Compte admin par défaut:</p>
//           <p className="font-mono text-xs mt-1">admin@eventsync.com / admin123</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (res?.error) {
//       setError("Identifiants invalides");
//     } else {
//       router.push("/admin/dashboard");
//       router.refresh();
//     }
//   };

//   return (
//     <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900">Administration</h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Connectez-vous pour gérer vos événements
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 text-center">
//               {error}
//             </div>
//           )}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 required
//                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
//               <input
//                 type="password"
//                 required
//                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="group relative flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
//           >
//             Se connecter
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



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