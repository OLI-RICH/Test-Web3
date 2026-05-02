"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Calendar, ClipboardList } from "lucide-react";

export default function FavoritesPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("loginStateChange"));
    window.location.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* SIDEBAR : Apparaît uniquement si l'utilisateur est Admin */}
      {isAdmin && (
        <aside className="w-72 border-r border-white/5 bg-black p-8 flex flex-col fixed top-20 bottom-0 left-0 z-40">
          <nav className="space-y-3 flex-1">
            <button 
              onClick={() => router.push("/admin/dashboard")} 
              className="w-full flex items-center gap-4 px-5 py-4 bg-white/5 text-gray-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button className="w-full flex items-center gap-4 px-5 py-4 bg-[#2ecc71] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest">
              <ClipboardList className="w-4 h-4" /> Mon Planning
            </button>
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </aside>
      )}

      {/* CONTENU : Se décale si Admin, sinon reste centré pour l'utilisateur normal */}
      <main className={`flex-1 p-12 mt-20 transition-all duration-300 ${isAdmin ? "ml-72" : "max-w-7xl mx-auto"}`}>
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#2ecc71] animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
              {isAdmin ? "Gestion Administrative" : "Espace Personnel"}
            </span>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white">
            Mon <span className="text-[#2ecc71]">Planning</span>
          </h1>
        </header>

        <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[40px] p-20 flex flex-col items-center justify-center text-center">
          <Calendar className="w-12 h-12 text-gray-700 mb-4" />
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Aucun favori</p>
          <p className="text-gray-600 text-sm mt-2">Ajoutez des événements pour les voir apparaître ici.</p>
        </div>
      </main>
    </div>
  );
}