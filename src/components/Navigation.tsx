// "use client";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { Calendar, User, Star, LayoutDashboard } from "lucide-react";

// export default function Navigation() {
//   const { data: session } = useSession();

//   return (
//     <nav className="nav-glass">
//       <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
//         <Link href="/" className="flex items-center gap-3 group">
//           <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform">
//             <Calendar className="w-5 h-5 text-black" />
//           </div>
//           <span className="font-black text-2xl tracking-tighter text-white">EventSync</span>
//         </Link>

//         <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-white/70">
//           <Link href="/" className="hover:text-[#2ecc71] transition">Événements</Link>
//           <Link href="/favorites" className="flex items-center gap-2 hover:text-[#2ecc71] transition">
//             <Star className="w-4 h-4" /> Mon Planning
//           </Link>
//           {session?.user?.role === "ADMIN" && (
//             <Link href="/admin/dashboard" className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition">
//               <LayoutDashboard className="w-4 h-4" /> Admin
//             </Link>
//           )}
//         </div>

//         <div className="flex items-center gap-4">
//           {session ? (
//             <button onClick={() => signOut()} className="text-xs font-bold text-red-400 border border-red-400/20 px-5 py-2 rounded-full hover:bg-red-400 hover:text-white transition">
//               Déconnexion
//             </button>
//           ) : (
//             <Link href="/admin/login" className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-black hover:bg-[#2ecc71] transition-colors">
//               CONNEXION
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Calendar, Star, LayoutDashboard } from "lucide-react";

export default function Navigation() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Déclenche le changement après 20px de scroll
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav-base ${isScrolled ? "nav-scrolled" : "nav-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform">
            <Calendar className="w-5 h-5 text-black" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">EventSync</span>
        </Link>

        {/* LIENS CENTRAUX */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
          <Link href="/" className="hover:text-[#2ecc71] transition">Événements</Link>
          <Link href="/favorites" className="flex items-center gap-2 hover:text-[#2ecc71] transition">
            <Star className="w-3.5 h-3.5" /> Mon Planning
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition">
              <LayoutDashboard className="w-4 h-4" /> Admin
            </Link>
          )}
        </div>

        {/* BOUTON ACTION */}
        <div className="flex items-center gap-4">
          {session ? (
            <button onClick={() => signOut()} className="text-[10px] font-black text-red-400 border border-red-400/20 px-5 py-2 rounded-full hover:bg-red-400 hover:text-white transition uppercase tracking-widest">
              Déconnexion
            </button>
          ) : (
            <Link href="/admin/login" className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black hover:bg-[#2ecc71] transition-colors uppercase tracking-widest">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}