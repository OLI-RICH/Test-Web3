// app/events/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Session = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  room: string;
  speakers: string[];
  isLive: boolean;
};

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Simulation pour l'instant (à remplacer par appel Prisma/Supabase plus tard)
  useEffect(() => {
    // Données mockées pour tester
    setEvent({
      id: eventId,
      title: "TechConf Paris 2026",
      description: "La plus grande conférence tech de France.",
      startDate: "2026-06-15",
      endDate: "2026-06-16",
      location: "Palais des Congrès, Paris"
    });

    setSessions([
      {
        id: "1",
        title: "L'avenir de l'IA en 2026",
        description: "Comment l'intelligence artificielle va transformer tous les secteurs.",
        startTime: "09:00",
        endTime: "10:30",
        room: "Salle Principale",
        speakers: ["Dr. Marie Laurent", "Alex Chen"],
        isLive: true
      },
      {
        id: "2",
        title: "Web3 et Blockchain : Opportunités",
        description: "État des lieux et perspectives pour les développeurs.",
        startTime: "11:00",
        endTime: "12:30",
        room: "Salle B",
        speakers: ["Sami Benali"],
        isLive: false
      }
    ]);
  }, [eventId]);

  const isLive = (session: Session) => {
    // Logique simple pour tester
    return session.isLive;
  };

  const addToFavorites = (sessionId: string) => {
    // À implémenter avec localStorage comme dans ta page planning
    alert(`Session ${sessionId} ajoutée aux favoris !`);
  };

  if (!event) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero de l'événement */}
      <div className="relative h-96 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {event.startDate} - {event.endDate}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {event.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Description de l'événement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            {/* Planning des sessions */}
            <div className="mt-10">
              <h2 className="text-3xl font-bold mb-6">Programme des sessions</h2>
              
              <div className="space-y-6">
                {sessions.map((session) => (
                  <Card key={session.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-semibold">{session.title}</h3>
                            {isLive(session) && (
                              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mt-2">{session.description}</p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          {session.startTime} - {session.endTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {session.room}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {session.speakers.map((speaker, i) => (
                          <Badge key={i} variant="secondary">{speaker}</Badge>
                        ))}
                      </div>

                      <Button 
                        onClick={() => addToFavorites(session.id)}
                        className="mt-6 w-full"
                        variant="default"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Ajouter à mon planning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations pratiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Lieu</p>
                  <p className="font-medium">{event.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{event.startDate} → {event.endDate}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}