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

// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { Calendar, Star, LayoutDashboard } from "lucide-react";

// export default function Navigation() {
//   const { data: session } = useSession();
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       // Déclenche le changement après 20px de scroll
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav className={`nav-base ${isScrolled ? "nav-scrolled" : "nav-transparent"}`}>
//       <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
//         {/* LOGO */}
//         <Link href="/" className="flex items-center gap-3 group">
//           <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform">
//             <Calendar className="w-5 h-5 text-black" />
//           </div>
//           <span className="font-black text-2xl tracking-tighter text-white">EventSync</span>
//         </Link>

//         {/* LIENS CENTRAUX */}
//         <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
//           <Link href="/" className="hover:text-[#2ecc71] transition">Événements</Link>
//           <Link href="/favorites" className="flex items-center gap-2 hover:text-[#2ecc71] transition">
//             <Star className="w-3.5 h-3.5" /> Mon Planning
//           </Link>
//           {session?.user?.role === "ADMIN" && (
//             <Link href="/admin/dashboard" className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition">
//               <LayoutDashboard className="w-4 h-4" /> Admin
//             </Link>
//           )}
//         </div>

//         {/* BOUTON ACTION */}
//         <div className="flex items-center gap-4">
//           {session ? (
//             <button onClick={() => signOut()} className="text-[10px] font-black text-red-400 border border-red-400/20 px-5 py-2 rounded-full hover:bg-red-400 hover:text-white transition uppercase tracking-widest">
//               Déconnexion
//             </button>
//           ) : (
//             <Link href="/admin/login" className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black hover:bg-[#2ecc71] transition-colors uppercase tracking-widest">
//               Connexion
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// "use client";
// import Link from "next/link";
// import { Calendar } from "lucide-react";

// export default function Navbar() {
//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         {/* LOGO */}
//         <Link href="/#events-section" className="flex items-center gap-3 group">
//           <div className="w-8 h-8 bg-[#2ecc71] rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform">
//             <Calendar className="w-4 h-4 text-black" />
//           </div>
//           <span className="font-black text-xl tracking-tighter text-white">EventSync</span>
//         </Link>

//         {/* NAVIGATION */}
//         <div className="flex items-center gap-8">
//           <Link 
//             href="/#events-section" 
//             className="text-gray-400 hover:text-[#2ecc71] text-xs font-bold uppercase tracking-widest transition-colors"
//           >
//             Événements
//           </Link>
//           <Link 
//             href="/favorites" 
//             className="text-gray-400 hover:text-[#2ecc71] text-xs font-bold uppercase tracking-widest transition-colors"
//           >
//             Mon Planning
//           </Link>
//           <Link 
//             href="/admin/login" 
//             className="bg-white/5 hover:bg-[#2ecc71] hover:text-black text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
//           >
//             Admin
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// }



// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Calendar, LogOut, User, Shield } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   // Détecte si l'utilisateur est sur une page d'administration
//   const isAdminPath = pathname.startsWith("/admin");
//   const isLoginPage = pathname === "/admin/login";

//   // Fonction de déconnexion simple
//   const handleLogout = () => {
//     // Logique de déconnexion (ex: suppression de cookie/token)
//     router.push("/admin/login");
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">

//         {/* --- LOGO --- */}
//         <Link
//           href="/"
//           className="flex items-center gap-3 group"
//         >
//           <div className="w-8 h-8 bg-[#2ecc71] rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform duration-300">
//             <Calendar className="w-4 h-4 text-black" />
//           </div>
//           <span className="font-black text-xl tracking-tighter text-white">
//             Event<span className="text-[#2ecc71]">Sync</span>
//           </span>
//         </Link>

//         {/* --- NAVIGATION CENTRALE (Cachée sur la page de login) --- */}
//         {!isLoginPage && (
//           <div className="hidden md:flex items-center gap-8">
//             {!isAdminPath ? (
//               <>
//                 <Link
//                   href="/#events-section"
//                   className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
//                 >
//                   Événements
//                 </Link>
//                 <Link
//                   href="/favorites"
//                   className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
//                 >
//                   Mon Planning
//                 </Link>
//               </>
//             ) : (
//               <div className="flex items-center gap-2 px-4 py-1.5 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-full">
//                 <Shield className="w-3 h-3 text-[#2ecc71]" />
//                 <span className="text-[9px] font-black uppercase tracking-widest text-[#2ecc71]">
//                   Mode Administrateur
//                 </span>
//               </div>
//             )}
//           </div>
//         )}

//         {/* --- BOUTON D'ACTION DROIT --- */}
//         <div className="flex items-center gap-4">
//           {isLoginPage ? (
//             <Link
//               href="/"
//               className="text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
//             >
//               Retour au site
//             </Link>
//           ) : isAdminPath ? (
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
//             >
//               <LogOut className="w-3 h-3" />
//               Déconnexion
//             </button>
//           ) : (
//             <Link
//               href="/admin/login"
//               className="group flex items-center gap-2 bg-white/5 hover:bg-[#2ecc71] text-white hover:text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 hover:border-[#2ecc71] shadow-xl hover:shadow-green-500/20"
//             >
//               <User className="w-3 h-3 transition-transform group-hover:scale-110" />
//               Connexion Admin
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }



// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Calendar } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // 1. On vérifie l'état de connexion au montage et lors des changements
//   useEffect(() => {
//     const checkAuth = () => {
//       const status = localStorage.getItem("isLoggedIn") === "true";
//       setIsLoggedIn(status);
//     };

//     checkAuth();

//     // On écoute l'événement personnalisé qu'on a créé pour la connexion/déconnexion
//     window.addEventListener("loginStateChange", checkAuth);
//     window.addEventListener("storage", checkAuth);

//     return () => {
//       window.removeEventListener("loginStateChange", checkAuth);
//       window.removeEventListener("storage", checkAuth);
//     };
//   }, []);

//   // 2. Logique de sélection du contenu de la Navbar
//   // On considère qu'on est en "Mode Admin" seulement si on est connecté ET sur une page admin
//   const showAdminStyle = isLoggedIn && pathname?.startsWith("/admin");

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
//       {/* GAUCHE : Logo (Toujours présent) */}
//       <Link href="/" className="flex items-center gap-3 group">
//         <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform">
//           <Calendar className="w-5 h-5 text-black" />
//         </div>
//         <span className="font-black text-2xl tracking-tighter text-white italic">
//           EventSync<span className="text-[#2ecc71]">.</span>
//         </span>
//       </Link>

//       {/* DROITE : Contenu dynamique */}
//       <div className="flex items-center gap-6">
//         {showAdminStyle ? (
//           /* CAS 1 : CONNECTÉ EN TANT QU'ADMIN sur le Dashboard */
//           <div className="flex items-center gap-2 bg-[#2ecc71]/10 border border-[#2ecc71]/20 px-4 py-2 rounded-full">
//             <div className="w-1.5 h-1.5 rounded-full bg-[#2ecc71] animate-pulse"></div>
//             <span className="text-[#2ecc71] text-[10px] font-black uppercase tracking-widest">
//               Mode Administrateur
//             </span>
//           </div>
//         ) : (
//           /* CAS 2 : VISITEUR ou PAGE DE LOGIN (Navbar normale) */
//           <>
//             <Link 
//               href="/#events-section" 
//               className="text-gray-400 hover:text-white text-sm font-medium transition-colors hidden md:block"
//             >
//               Événements
//             </Link>
//             <Link 
//               href="/admin/login" 
//               className="bg-white/5 border border-white/10 px-5 py-2 rounded-xl text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#2ecc71] hover:text-black transition-all"
//             >
//               Connexion Staff
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }



// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Calendar, LogOut, User, Shield } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();

//   // Détecte si l'utilisateur est sur une page d'administration
//   const isAdminPath = pathname.startsWith("/admin");
//   const isLoginPage = pathname === "/admin/login";
  
//   // NOUVEAU : On vérifie si on est précisément sur le Dashboard pour masquer le bouton du haut
//   const isDashboard = pathname === "/admin/dashboard";

//   const handleLogout = () => {
//     // Nettoyage de la session
//     localStorage.clear();
//     // Notification pour les autres composants (Footer, etc.)
//     window.dispatchEvent(new Event("loginStateChange"));
//     // Redirection vers l'accueil (comme demandé précédemment)
//     window.location.replace("/");
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">

//         {/* --- LOGO --- */}
//         <Link
//           href="/"
//           className="flex items-center gap-3 group"
//         >
//           <div className="w-8 h-8 bg-[#2ecc71] rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:rotate-6 transition-transform duration-300">
//             <Calendar className="w-4 h-4 text-black" />
//           </div>
//           <span className="font-black text-xl tracking-tighter text-white">
//             Event<span className="text-[#2ecc71]">Sync</span>
//           </span>
//         </Link>

//         {/* --- NAVIGATION CENTRALE --- */}
//         {!isLoginPage && (
//           <div className="hidden md:flex items-center gap-8">
//             {!isAdminPath ? (
//               <>
//                 <Link
//                   href="/#events-section"
//                   className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
//                 >
//                   Événements
//                 </Link>
//                 <Link
//                   href="/favorites"
//                   className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
//                 >
//                   Mon Planning
//                 </Link>
//               </>
//             ) : (
//               <div className="flex items-center gap-2 px-4 py-1.5 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-full">
//                 <Shield className="w-3 h-3 text-[#2ecc71]" />
//                 <span className="text-[9px] font-black uppercase tracking-widest text-[#2ecc71]">
//                   Mode Administrateur
//                 </span>
//               </div>
//             )}
//           </div>
//         )}

//         {/* --- BOUTON D'ACTION DROIT --- */}
//         <div className="flex items-center gap-4">
//           {isLoginPage ? (
//             <Link
//               href="/"
//               className="text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
//             >
//               Retour au site
//             </Link>
//           ) : isDashboard ? (
//             /* 
//                SI ON EST SUR LE DASHBOARD : 
//                On ne met RIEN ici pour ne pas avoir de doublon avec la sidebar
//             */
//             <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
//                <User className="w-4 h-4 text-[#2ecc71]" />
//             </div>
//           ) : isAdminPath ? (
//             /* SI ADMIN MAIS PAS DASHBOARD (ex: pages intermédiaires) */
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
//             >
//               <LogOut className="w-3 h-3" />
//               Déconnexion
//             </button>
//           ) : (
//             /* PAGE D'ACCUEIL : Ton bouton original */
//             <Link
//               href="/admin/login"
//               className="group flex items-center gap-2 bg-white/5 hover:bg-[#2ecc71] text-white hover:text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 hover:border-[#2ecc71] shadow-xl hover:shadow-green-500/20"
//             >
//               <User className="w-3 h-3 transition-transform group-hover:scale-110" />
//               Connexion Admin
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }


// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Calendar, Shield, User } from "lucide-react";

// export default function Navbar() {
//   const pathname = usePathname();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const checkAuth = () => {
//       const status = localStorage.getItem("isLoggedIn") === "true";
//       setIsLoggedIn(status);
//     };
//     checkAuth();
//     window.addEventListener("loginStateChange", checkAuth);
//     return () => window.removeEventListener("loginStateChange", checkAuth);
//   }, []);

//   const isAdminPath = pathname?.startsWith("/admin");
//   const isDashboard = pathname === "/admin/dashboard";
//   const isLoginPage = pathname === "/admin/login";
//   const showAdminBadge = (isAdminPath || pathname === "/favorites") && isLoggedIn;

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 h-20 flex items-center justify-between">
//       {/* GAUCHE : Logo */}
//       <Link href="/" className="flex items-center gap-3">
//         <div className="w-8 h-8 bg-[#2ecc71] rounded-lg flex items-center justify-center">
//           <Calendar className="w-4 h-4 text-black" />
//         </div>
//         <span className="font-black text-xl tracking-tighter text-white italic">
//           Event<span className="text-[#2ecc71]">Sync</span>
//         </span>
//       </Link>

//       {/* CENTRE : Liens de navigation (S'affichent si PAS admin) */}
//       {!isAdminPath && !isLoginPage && (
//         <div className="hidden md:flex items-center gap-8">
//           <Link
//             href="/#events-section"
//             className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
//           >
//             Événements
//           </Link>
//           <Link
//             href="/favorites"
//             className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
//           >
//             Mon Planning
//           </Link>
//         </div>
//       )}

//       {/* DROITE : Badge Admin ou Connexion */}
//       <div className="flex items-center gap-4">
//         {showAdminBadge ? (
//           <div className="flex items-center gap-2 px-4 py-2 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-full">
//             <Shield className="w-3 h-3 text-[#2ecc71]" />
//             <span className="text-[9px] font-black uppercase tracking-widest text-[#2ecc71]">
//               Mode Administrateur
//             </span>
//           </div>
//         ) : isLoginPage ? (
//           <Link href="/" className="text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest">
//             Retour au site
//           </Link>
//         ) : (
//           <Link
//             href="/admin/login"
//             className="group flex items-center gap-2 bg-white/5 hover:bg-[#2ecc71] text-white hover:text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
//           >
//             <User className="w-3 h-3" />
//             Connexion Admin
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Shield, User } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const status = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(status);
    };
    checkAuth();
    window.addEventListener("loginStateChange", checkAuth);
    return () => window.removeEventListener("loginStateChange", checkAuth);
  }, []);

  const isAdminPath = pathname?.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isFavorites = pathname === "/favorites";
  
  // La Navbar passe en style Admin si on est dans /admin OU si on est sur Favorites en étant connecté
  const showAdminStyle = (isAdminPath || isFavorites) && isLoggedIn;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-8 h-20 flex items-center justify-between">
      {/* GAUCHE : Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#2ecc71] rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-black" />
        </div>
        <span className="font-black text-xl tracking-tighter text-white italic">
          Event<span className="text-[#2ecc71]">Sync</span>
        </span>
      </Link>

      {/* CENTRE : Liens Navigation (Seulement si PAS Admin Style) */}
      {!showAdminStyle && !isLoginPage && (
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#events-section" className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
            Événements
          </Link>
          <Link href="/favorites" className="text-gray-400 hover:text-[#2ecc71] text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
            Mon Planning
          </Link>
        </div>
      )}

      {/* DROITE : Action Dynamique */}
      <div className="flex items-center gap-4">
        {showAdminStyle ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#2ecc71]/10 border border-[#2ecc71]/20 rounded-full">
            <Shield className="w-3 h-3 text-[#2ecc71]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#2ecc71]">
              Mode Administrateur
            </span>
          </div>
        ) : isLoginPage ? (
          <Link href="/" className="text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest">
            Retour au site
          </Link>
        ) : (
          <Link
            href="/admin/login"
            className="group flex items-center gap-2 bg-white/5 hover:bg-[#2ecc71] text-white hover:text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
          >
            <User className="w-3 h-3" />
            Connexion Admin
          </Link>
        )}
      </div>
    </nav>
  );
}