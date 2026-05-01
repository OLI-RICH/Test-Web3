// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { MapPin, ArrowRight, Search, Clock } from "lucide-react";

// export default function Home() {
//   const [events, setEvents] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState("Tout");

//   useEffect(() => {
//     fetch("/api/events").then(res => res.json()).then(data => {
//       setEvents(data);
//       setLoading(false);
//     });
//   }, []);

//   const filteredEvents = events.filter(e => 
//     e.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center bg-black">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen">
//       {/* SECTION HERO */}
//       <section className="relative h-[85vh] flex items-center overflow-hidden px-6">
//         <div className="absolute inset-0 z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop" 
//             className="w-full h-full object-cover opacity-50" 
//             alt="Hero Background"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto w-full">
//           <span className="inline-block bg-green-500/10 text-green-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-[0.2em] mb-8">
//             • Plateforme EventSync
//           </span>
          
//           <h1 className="hero-title mb-10">
//             Vivez vos <br />
//             <span className="text-[#2ecc71] italic">événements</span> <br />
//             en temps réel
//           </h1>

//           <div className="search-container">
//             <Search className="w-5 h-5 text-white/30 ml-4" />
//             <input 
//               type="text" 
//               placeholder="Trouver un événement..." 
//               className="flex-1 bg-transparent border-none px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <button className="btn-primary">Rechercher</button>
//           </div>
//         </div>
//       </section>

//       {/* SECTION CATALOGUE */}
//       <section className="section-catalogue">
//         <div className="max-w-7xl mx-auto px-6">
          
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
//             <div>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">Catalogue</p>
//               <h2 className="text-5xl font-black tracking-tighter">Tous les événements</h2>
//             </div>

//             <div className="flex bg-gray-200/60 p-1.5 rounded-2xl">
//               {["Tout", "Conférences", "Ateliers"].map((cat) => (
//                 <button 
//                   key={cat}
//                   onClick={() => setActiveCategory(cat)}
//                   className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all ${
//                     activeCategory === cat ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//             {filteredEvents.map((event) => (
//               /* ICI : On ajoute "group" manuellement dans la className */
//               <div key={event.id} className="event-card group">
//                 <div className="relative h-80 overflow-hidden">
//                   <div className="date-badge">15 JUIN</div>
                  
//                   <img 
//                     src={event.imageUrl || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070"} 
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
//                   />
                  
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  
//                   <div className="absolute bottom-8 left-8 pr-8">
//                     <h3 className="text-3xl font-black text-white tracking-tighter leading-none">
//                       {event.title}
//                     </h3>
//                   </div>
//                 </div>
                
//                 <div className="p-10">
//                   <div className="flex items-center gap-2 text-gray-400 mb-6 font-bold text-xs uppercase">
//                     <MapPin className="w-3.5 h-3.5 text-[#2ecc71]" />
//                     <span>{event.location}</span>
//                   </div>
                  
//                   <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-8">
//                     {event.description}
//                   </p>
                  
//                   <div className="flex items-center justify-between pt-8 border-t border-gray-100">
//                     <span className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase italic tracking-widest">
//                       <Clock className="w-3 h-3" /> {event._count?.sessions || 0} SESSIONS
//                     </span>
//                     <Link href={`/events/${event.id}`} className="text-[#2ecc71] font-black flex items-center gap-2 group-hover:gap-4 transition-all uppercase text-[10px] tracking-widest">
//                       Voir le programme <ArrowRight className="w-4 h-4" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Search, Calendar, LayoutGrid } from "lucide-react";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ecc71]"></div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* SECTION HERO */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden px-6 pt-40 pb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50" 
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <span className="inline-block bg-green-500/10 text-green-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-[0.2em] mb-8">
            • Plateforme EventSync
          </span>
          
          <h1 className="hero-title mb-10">
            Vivez vos <br />
            <span className="text-[#2ecc71] italic">événements</span> <br />
            en temps réel
          </h1>

          <div className="search-container">
            <Search className="w-5 h-5 text-white/30 ml-4" />
            <input 
              type="text" 
              placeholder="Rechercher un événement..." 
              className="flex-1 bg-transparent border-none px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-primary">Rechercher</button>
          </div>
        </div>
      </section>

      {/* SECTION CATALOGUE (EXACTEMENT COMME L'IMAGE) */}
      <section className="section-catalogue">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* HEADER CATALOGUE */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <span className="cat-label">Catalogue</span>
              <h2 className="cat-title">Tous les événements</h2>
              <p className="cat-count">{filteredEvents.length} événements disponibles</p>
            </div>

            {/* FILTRES (BOUTONS DROITS) */}
            <div className="mt-6 md:mt-0 flex bg-gray-100 p-1 rounded-xl">
              {["Tous", "À venir", "Passés"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`filter-tab ${
                    activeCategory === tab 
                    ? "bg-white text-black shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* GRILLE D'ÉVÉNEMENTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div key={event.id} className="event-card group">
                {/* IMAGE & TITRE SUR IMAGE */}
                <div className="relative h-64 overflow-hidden">
                  <div className="date-badge">15 juin – 16 juin 2026</div>
                  <img 
                    src={event.imageUrl || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={event.title}
                  />
                  {/* OVERLAY SOMBRE GRADIENT */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* TITRE SUR IMAGE (EN BAS À GAUCHE) */}
                  <div className="absolute bottom-6 left-6 pr-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {event.title}
                    </h3>
                  </div>
                </div>
                
                {/* CONTENU SOUS IMAGE */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-gray-400 mb-4 text-sm">
                    <MapPin className="w-4 h-4 text-[#2ecc71]" />
                    <span>{event.location}</span>
                  </div>
                  
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">
                    {event.description}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-tight">
                      <LayoutGrid className="w-4 h-4 text-[#2ecc71]/50" />
                      {event._count?.sessions || 0} sessions
                    </div>
                    
                    <Link 
                      href={`/events/${event.id}`} 
                      className="text-[#2ecc71] font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Programme <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}