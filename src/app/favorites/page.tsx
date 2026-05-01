"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Clock, MapPin, User, Trash2 } from "lucide-react";

interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  room: { name: string };
  speakers: Array<{ speaker: { name: string } }>;
  event: { id: string; title: string };
}

export default function FavoritesPage() {
  const [favoriteSessions, setFavoriteSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    
    if (favorites.length === 0) {
      setFavoriteSessions([]);
      setLoading(false);
      return;
    }

    const sessionsData = await Promise.all(
      favorites.map(async (sessionId: string) => {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (res.ok) {
          return await res.json();
        }
        return null;
      })
    );

    setFavoriteSessions(sessionsData.filter(s => s !== null));
    setLoading(false);
  };

  const removeFavorite = (sessionId: string) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavorites = favorites.filter((id: string) => id !== sessionId);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavoriteSessions(favoriteSessions.filter(s => s.id !== sessionId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-8 h-8 text-yellow-500 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900">Mon Planning</h1>
        </div>

        {favoriteSessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune session favorite</h3>
            <p className="text-gray-500 mb-6">Ajoutez des sessions à votre planning pour les retrouver ici</p>
            <Link href="/" className="btn-primary inline-block">
              Voir les événements
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {favoriteSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link href={`/events/${session.event?.id}`} className="text-sm text-blue-600 hover:underline">
                      {session.event?.title}
                    </Link>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{session.title}</h3>
                    <p className="text-gray-600 mt-2">{session.description}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(session.startTime).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {session.room?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {session.speakers?.map(s => s.speaker.name).join(", ")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFavorite(session.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}