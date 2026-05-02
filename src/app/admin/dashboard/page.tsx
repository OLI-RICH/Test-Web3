"use client";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Calendar, Activity, ClipboardList } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("loginStateChange"));
    window.location.replace("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* SIDEBAR : Aligné sous la Navbar (top-20) */}
      <aside className="w-72 border-r border-white/5 bg-black p-8 flex flex-col fixed top-20 bottom-0 left-0 z-40">
        <nav className="space-y-3 flex-1">
          <button className="w-full flex items-center gap-4 px-5 py-4 bg-[#2ecc71] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          
          <button 
            onClick={() => router.push("/favorites")}
            className="w-full flex items-center gap-4 px-5 py-4 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
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

      {/* CONTENU : mt-20 pour passer sous la Navbar et ml-72 pour la Sidebar */}
      <main className="flex-1 ml-72 p-12 mt-20">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic tracking-tighter text-white">
            Panel <span className="text-[#2ecc71]">Admin</span>
          </h1>
        </header>

        <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[#2ecc71]" />
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Base de données</span>
          </div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter">
            Connecté <span className="text-gray-500">(PostgreSQL)</span>
          </h2>
        </div>
      </main>
    </div>
  );
}