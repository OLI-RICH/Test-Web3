// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Calendar, Clock, MapPin, Plus, Trash2, X } from "lucide-react";

// interface Event {
//   id: string;
//   title: string;
//   startDate: string;
//   endDate: string;
//   location: string;
//   _count: { sessions: number };
// }

// interface Room {
//   id: string;
//   name: string;
// }

// interface Speaker {
//   id: string;
//   name: string;
// }

// export default function AdminDashboard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [events, setEvents] = useState<Event[]>([]);
//   const [showEventModal, setShowEventModal] = useState(false);
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [speakers, setSpeakers] = useState<Speaker[]>([]);
//   const [newEvent, setNewEvent] = useState({
//     title: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     location: "",
//   });

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/admin/login");
//     }
//     if (session?.user?.role !== "ADMIN") {
//       router.push("/");
//     }
//     fetchData();
//   }, [status, session]);

//   const fetchData = async () => {
//     const [eventsRes, roomsRes, speakersRes] = await Promise.all([
//       fetch("/api/events"),
//       fetch("/api/rooms"),
//       fetch("/api/speakers"),
//     ]);
//     setEvents(await eventsRes.json());
//     setRooms(await roomsRes.json());
//     setSpeakers(await speakersRes.json());
//   };

//   const handleCreateEvent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await fetch("/api/events", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newEvent),
//     });
//     setShowEventModal(false);
//     setNewEvent({ title: "", description: "", startDate: "", endDate: "", location: "" });
//     fetchData();
//   };

//   const handleDeleteEvent = async (id: string) => {
//     if (confirm("Supprimer cet événement ?")) {
//       await fetch(`/api/events/${id}`, { method: "DELETE" });
//       fetchData();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Calendar className="w-8 h-8 text-blue-600" />
//             <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-gray-600">{session?.user?.name}</span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold text-gray-900">Gestion des événements</h2>
//           <button
//             onClick={() => setShowEventModal(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             <Plus className="w-4 h-4" />
//             Nouvel événement
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {events.map((event) => (
//             <div key={event.id} className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="flex justify-between items-start">
//                 <div className="flex-1">
//                   <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
//                   <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
//                     <MapPin className="w-3 h-3" />
//                     <span>{event.location}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
//                     <Clock className="w-3 h-3" />
//                     <span>
//                       {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-2">{event._count.sessions} sessions</p>
//                 </div>
//                 <button
//                   onClick={() => handleDeleteEvent(event.id)}
//                   className="p-1 text-red-500 hover:bg-red-50 rounded"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {showEventModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Nouvel événement</h3>
//               <button onClick={() => setShowEventModal(false)} className="p-1 hover:bg-gray-100 rounded">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <form onSubmit={handleCreateEvent} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Titre"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newEvent.title}
//                 onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
//                 required
//               />
//               <textarea
//                 placeholder="Description"
//                 rows={3}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newEvent.description}
//                 onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
//                 required
//               />
//               <input
//                 type="date"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newEvent.startDate}
//                 onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
//                 required
//               />
//               <input
//                 type="date"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newEvent.endDate}
//                 onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Lieu"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={newEvent.location}
//                 onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
//                 required
//               />
//               <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
//                 Créer
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useRouter } from "next/navigation";
// import { 
//   LogOut, 
//   LayoutDashboard, 
//   PlusCircle, 
//   Users, 
//   Settings,
//   Calendar as CalendarIcon 
// } from "lucide-react";

// export default function AdminDashboard() {
//   const router = useRouter();

//   const handleLogout = () => {
//     // Ici, tu supprimerais normalement le token ou la session
//     // Pour cet exemple, on redirige simplement vers le login
//     router.push("/admin/login");
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white flex">
//       {/* SIDEBAR GAUCHE */}
//       <aside className="w-64 border-r border-white/5 bg-black/50 p-6 flex flex-col">
//         <div className="flex items-center gap-3 mb-12">
//           <div className="w-8 h-8 bg-[#2ecc71] rounded-lg flex items-center justify-center">
//             <CalendarIcon className="w-4 h-4 text-black" />
//           </div>
//           <span className="font-black text-xl tracking-tighter">AdminSync</span>
//         </div>

//         <nav className="space-y-2 flex-1">
//           <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#2ecc71]/10 text-[#2ecc71] rounded-xl text-xs font-black uppercase tracking-widest">
//             <LayoutDashboard className="w-4 h-4" /> Dashboard
//           </button>
//           <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
//             <PlusCircle className="w-4 h-4" /> Ajouter Événement
//           </button>
//         </nav>

//         {/* BOUTON DÉCONNEXION (BAS DE SIDEBAR) */}
//         <button 
//           onClick={handleLogout}
//           className="mt-auto flex items-center gap-3 px-4 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group"
//         >
//           <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//           Déconnexion
//         </button>
//       </aside>

//       {/* CONTENU PRINCIPAL */}
//       <main className="flex-1 p-10">
//         <header className="flex justify-between items-center mb-12">
//           <div>
//             <h1 className="text-4xl font-black tracking-tighter">Tableau de <span className="text-[#2ecc71] italic">Bord</span></h1>
//             <p className="text-gray-500 text-sm mt-1">Bienvenue, Administrateur.</p>
//           </div>
          
//           <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
//             <div className="w-10 h-10 bg-gradient-to-tr from-[#2ecc71] to-green-300 rounded-xl"></div>
//             <div className="pr-4">
//               <p className="text-[10px] font-black uppercase tracking-widest text-white">Bryan Admin</p>
//               <p className="text-[9px] font-bold text-[#2ecc71] uppercase tracking-widest italic">Superuser</p>
//             </div>
//           </div>
//         </header>

//         {/* STATS RAPIDES */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[
//             { label: "Total Événements", val: "12", icon: CalendarIcon },
//             { label: "Inscriptions", val: "1,284", icon: Users },
//             { label: "Sessions", val: "48", icon: Settings },
//           ].map((stat, i) => (
//             <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px]">
//               <stat.icon className="w-6 h-6 text-[#2ecc71] mb-4" />
//               <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
//               <p className="text-3xl font-black mt-1">{stat.val}</p>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

// "use client";
// import { useRouter } from "next/navigation";
// import { LogOut, LayoutDashboard, Calendar, Users, Settings, Plus, Activity } from "lucide-react";

// export default function AdminDashboard() {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("isLoggedIn");
//     router.push("/admin/login");
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white flex">
//       {/* SIDEBAR */}
//       <aside className="w-72 border-r border-white/5 bg-black p-8 flex flex-col">
//         <div className="flex items-center gap-3 mb-16">
//           <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center">
//             <Calendar className="w-5 h-5 text-black" />
//           </div>
//           <span className="font-black text-2xl tracking-tighter italic">EventSync</span>
//         </div>

//         <nav className="space-y-2 flex-1">
//           <button className="w-full flex items-center gap-4 px-5 py-4 bg-[#2ecc71] text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest">
//             <LayoutDashboard className="w-4 h-4" /> Dashboard
//           </button>
//           <button className="w-full flex items-center gap-4 px-5 py-4 text-gray-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 rounded-2xl">
//             <Users className="w-4 h-4" /> Intervenants
//           </button>
//         </nav>

//         <button 
//           onClick={handleLogout}
//           className="mt-auto flex items-center gap-4 px-5 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
//         >
//           <LogOut className="w-4 h-4" /> Déconnexion
//         </button>
//       </aside>

//       {/* CONTENT */}
//       <main className="flex-1 p-12">
//         <header className="flex justify-between items-start mb-12">
//           <div>
//             <h1 className="text-4xl font-black italic tracking-tighter">Panel <span className="text-[#2ecc71]">Admin</span></h1>
//             <p className="text-gray-500 text-sm mt-2">Bienvenue, Administrateur.</p>
//           </div>
//           <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-2xl border border-white/10">
//             <div className="w-10 h-10 bg-gradient-to-br from-[#2ecc71] to-green-600 rounded-xl"></div>
//             <div className="text-[10px] font-black uppercase tracking-wider">Connecté</div>
//           </div>
//         </header>

//         {/* STATS QUICK VIEW */}
//         <div className="grid grid-cols-3 gap-6">
//           <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[30px]">
//             <Activity className="w-5 h-5 text-[#2ecc71] mb-4" />
//             <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Événements</p>
//             <p className="text-3xl font-black">3</p>
//           </div>
//           <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[30px]">
//             <Users className="w-5 h-5 text-blue-500 mb-4" />
//             <p className="text-gray-500 text-[10px] font-black uppercase mb-1">Speakers</p>
//             <p className="text-3xl font-black">4</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// "use client";
// import { useRouter } from "next/navigation";
// import { LogOut, LayoutDashboard, Calendar, Activity, Users, ClipboardList } from "lucide-react";

// export default function AdminDashboard() {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.clear();
//     window.dispatchEvent(new Event("loginStateChange"));
//     window.location.replace("/");
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white flex">
//       {/* SIDEBAR - Fixée à gauche */}
//       <aside className="w-72 border-r border-white/5 bg-black p-8 flex flex-col fixed h-full z-40">
//         <div className="flex items-center gap-3 mb-16">
//           <div className="w-10 h-10 bg-[#2ecc71] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
//             <Calendar className="w-5 h-5 text-black" />
//           </div>
//           <span className="font-black text-2xl tracking-tighter italic">
//             Event<span className="text-[#2ecc71]">Sync</span>
//           </span>
//         </div>

//         <nav className="space-y-3 flex-1">
//           {/* Dashboard - Actif */}
//           <button className="w-full flex items-center gap-4 px-5 py-4 bg-[#2ecc71] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
//             <LayoutDashboard className="w-4 h-4" /> 
//             Dashboard
//           </button>

//           {/* AJOUT : Mon Planning (Admin) */}
//           <button 
//             onClick={() => router.push("/favorites")}
//             className="w-full flex items-center gap-4 px-5 py-4 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
//           >
//             <ClipboardList className="w-4 h-4" /> 
//             Mon Planning
//           </button>

//           <button className="w-full flex items-center gap-4 px-5 py-4 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
//             <Users className="w-4 h-4" /> 
//             Utilisateurs
//           </button>
//         </nav>

//         {/* BOUTON DÉCONNEXION */}
//         <button 
//           onClick={handleLogout}
//           className="mt-auto flex items-center gap-4 px-5 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20 shadow-lg hover:shadow-red-500/20"
//         >
//           <LogOut className="w-4 h-4" /> 
//           Déconnexion
//         </button>
//       </aside>

//       {/* CONTENU PRINCIPAL */}
//       {/* 
//           ml-72 : Pour laisser la place à la sidebar fixe 
//           mt-20 : Pour que le contenu commence SOUS la Navbar du haut
//       */}
//       <main className="flex-1 ml-72 p-12 mt-20">
//         <header className="mb-12">
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-2 h-2 rounded-full bg-[#2ecc71] animate-pulse"></div>
//             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-white">
//               Administrateur Connecté
//             </span>
//           </div>
//           <h1 className="text-4xl font-black italic tracking-tighter text-white">
//             Vue d'ensemble <span className="text-[#2ecc71]">Admin</span>
//           </h1>
//         </header>

//         {/* CARTES DE STATISTIQUES */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//           <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] group hover:border-[#2ecc71]/30 transition-all">
//             <div className="flex items-center gap-2 mb-4">
//               <Activity className="w-5 h-5 text-[#2ecc71]" />
//               <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Base de données</span>
//             </div>
//             <h2 className="text-3xl font-black text-white italic tracking-tighter">
//               Connecté <span className="text-gray-500 font-light opacity-50">(PostgreSQL)</span>
//             </h2>
//           </div>

//           <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[40px] group hover:border-blue-500/30 transition-all">
//             <div className="flex items-center gap-2 mb-4">
//               <Users className="w-5 h-5 text-blue-500" />
//               <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Inscriptions</span>
//             </div>
//             <h2 className="text-3xl font-black text-white italic tracking-tighter">
//               128 <span className="text-gray-500 font-light opacity-50">Participants</span>
//             </h2>
//           </div>
//         </div>

//         {/* SECTION RÉCENTE */}
//         <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[40px] p-20 flex flex-col items-center justify-center text-center">
//           <div className="p-4 bg-white/5 rounded-full mb-6">
//             <Calendar className="w-8 h-8 text-gray-600" />
//           </div>
//           <p className="text-gray-400 font-bold mb-1 uppercase text-[10px] tracking-widest">Historique vide</p>
//           <p className="text-gray-600 text-sm max-w-xs">
//             Aucun événement récent n'a été modifié pour le moment.
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// }


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