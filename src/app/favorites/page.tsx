// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Star, Clock, MapPin, User, Trash2 } from "lucide-react";

// interface Session {
//   id: string;
//   title: string;
//   description: string;
//   startTime: string;
//   endTime: string;
//   room: { name: string };
//   speakers: Array<{ speaker: { name: string } }>;
//   event: { id: string; title: string };
// }

// export default function FavoritesPage() {
//   const [favoriteSessions, setFavoriteSessions] = useState<Session[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadFavorites();
//   }, []);

//   const loadFavorites = async () => {
//     const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
//     if (favorites.length === 0) {
//       setFavoriteSessions([]);
//       setLoading(false);
//       return;
//     }

//     const sessionsData = await Promise.all(
//       favorites.map(async (sessionId: string) => {
//         const res = await fetch(`/api/sessions/${sessionId}`);
//         if (res.ok) {
//           return await res.json();
//         }
//         return null;
//       })
//     );

//     setFavoriteSessions(sessionsData.filter(s => s !== null));
//     setLoading(false);
//   };

//   const removeFavorite = (sessionId: string) => {
//     const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
//     const newFavorites = favorites.filter((id: string) => id !== sessionId);
//     localStorage.setItem("favorites", JSON.stringify(newFavorites));
//     setFavoriteSessions(favoriteSessions.filter(s => s.id !== sessionId));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex items-center gap-3 mb-8">
//           <Star className="w-8 h-8 text-yellow-500 fill-current" />
//           <h1 className="text-3xl font-bold text-gray-900">Mon Planning</h1>
//         </div>

//         {favoriteSessions.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//             <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune session favorite</h3>
//             <p className="text-gray-500 mb-6">Ajoutez des sessions à votre planning pour les retrouver ici</p>
//             <Link href="/" className="btn-primary inline-block">
//               Voir les événements
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-6">
//             {favoriteSessions.map((session) => (
//               <div key={session.id} className="bg-white rounded-2xl shadow-lg p-6">
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <Link href={`/events/${session.event?.id}`} className="text-sm text-blue-600 hover:underline">
//                       {session.event?.title}
//                     </Link>
//                     <h3 className="text-xl font-bold text-gray-900 mt-1">{session.title}</h3>
//                     <p className="text-gray-600 mt-2">{session.description}</p>
//                     <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
//                       <span className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         {new Date(session.startTime).toLocaleString()}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <MapPin className="w-4 h-4" />
//                         {session.room?.name}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <User className="w-4 h-4" />
//                         {session.speakers?.map(s => s.speaker.name).join(", ")}
//                       </span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => removeFavorite(session.id)}
//                     className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { Star, Calendar, ArrowLeft, Ticket, MapPin, Clock } from "lucide-react";

// export default function MyPlanning() {
//   const [favorites, setFavorites] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulation de récupération des favoris (depuis localStorage par exemple)
//     const saved = localStorage.getItem("event_favorites");
//     if (saved) setFavorites(JSON.parse(saved));
//     setLoading(false);
//   }, []);

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center bg-black">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6">
//       <div className="max-w-7xl mx-auto">
        
//         {/* HEADER DE LA PAGE */}
//         <div className="mb-16">
//           <Link href="/" className="inline-flex items-center gap-2 text-[#2ecc71] font-black text-[10px] uppercase tracking-[0.3em] mb-6 hover:gap-4 transition-all">
//             <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
//           </Link>
//           <div className="flex items-center gap-4">
//              <div className="w-12 h-12 bg-[#2ecc71]/10 rounded-2xl flex items-center justify-center border border-[#2ecc71]/20">
//                 <Star className="w-6 h-6 text-[#2ecc71] fill-[#2ecc71]" />
//              </div>
//              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Mon <span className="text-[#2ecc71] italic">Planning</span></h1>
//           </div>
//           <p className="text-gray-500 mt-4 max-w-xl font-medium">
//             Retrouvez ici toutes les sessions et événements que vous avez marqués comme favoris pour organiser votre visite.
//           </p>
//         </div>

//         {favorites.length === 0 ? (
//           /* ÉTAT VIDE (EMPTY STATE) */
//           <div className="relative group overflow-hidden bg-white/[0.02] border border-white/5 rounded-[40px] p-20 flex flex-col items-center justify-center text-center">
//             {/* Effet de lumière en fond */}
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2ecc71]/10 blur-[100px] rounded-full"></div>
            
//             <div className="relative">
//                 <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
//                     <Calendar className="w-10 h-10 text-gray-600" />
//                 </div>
//             </div>

//             <h2 className="text-3xl font-black tracking-tight mb-4">Aucune session favorite</h2>
//             <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">
//               Votre planning est encore vide. Explorez le catalogue pour ajouter les sessions qui vous intéressent.
//             </p>

//             <Link 
//               href="/#events-section" 
//               className="bg-[#2ecc71] text-black font-black px-10 py-5 rounded-2xl uppercase text-xs tracking-widest hover:bg-green-400 hover:-translate-y-1 transition-all shadow-xl shadow-green-500/20"
//             >
//               Voir les événements
//             </Link>
//           </div>
//         ) : (
//           /* GRILLE DES FAVORIS (SI PRÉSENTS) */
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {favorites.map((session) => (
//               <div key={session.id} className="bg-white/[0.03] border border-white/10 p-8 rounded-[32px] hover:bg-white/[0.05] transition-all group">
//                 <div className="flex justify-between items-start mb-6">
//                     <span className="bg-[#2ecc71]/10 text-[#2ecc71] text-[10px] font-black px-3 py-1 rounded-full border border-[#2ecc71]/20 uppercase tracking-widest">
//                         {session.category || "Session"}
//                     </span>
//                     <button className="text-[#2ecc71] hover:scale-110 transition-transform">
//                         <Star className="w-5 h-5 fill-[#2ecc71]" />
//                     </button>
//                 </div>
//                 <h3 className="text-2xl font-bold mb-4 group-hover:text-[#2ecc71] transition-colors">{session.title}</h3>
//                 <div className="space-y-3 mb-8">
//                     <div className="flex items-center gap-3 text-gray-400 text-sm">
//                         <Clock className="w-4 h-4 text-[#2ecc71]" />
//                         <span>{session.time || "09:00 - 10:30"}</span>
//                     </div>
//                     <div className="flex items-center gap-3 text-gray-400 text-sm">
//                         <MapPin className="w-4 h-4 text-[#2ecc71]" />
//                         <span>{session.room || "Salle de conférence A"}</span>
//                     </div>
//                 </div>
//                 <Link href={`/events/${session.eventId}`} className="flex items-center justify-between pt-6 border-t border-white/5 group-hover:border-[#2ecc71]/30 transition-colors">
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Détails de l'événement</span>
//                     <ArrowLeft className="w-4 h-4 rotate-180 text-[#2ecc71]" />
//                 </Link>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* SECTION DÉCORATIVE BAS DE PAGE */}
//         <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#2ecc71]/5 to-transparent border border-[#2ecc71]/10">
//                 <Ticket className="w-8 h-8 text-[#2ecc71] mb-4" />
//                 <h4 className="font-bold mb-2 text-white">Réservation</h4>
//                 <p className="text-gray-500 text-xs leading-relaxed">Vos favoris sont sauvegardés localement. N'oubliez pas de réserver vos places officiellement.</p>
//             </div>
//             {/* On peut ajouter d'autres cartes d'info ici */}
//         </div>
//       </div>
//     </div>
//   );
// }


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