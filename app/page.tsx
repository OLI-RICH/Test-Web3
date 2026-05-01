'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, LayoutDashboard, MapPin, Search, ShieldCheck, Ticket, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

type EventRow = Tables<'events'>

type DisplayEvent = {
  id: string
  title: string
  date: string
  location: string
  sessions: number
  image: string
  copy: string
  timing: 'upcoming' | 'past'
}

const PLANNING_KEY = 'eventsync-planning'

const fallbackEvents = [
  {
    id: 'techconf-paris-2026',
    title: 'TechConf Paris 2026',
    startsAt: '2026-06-15T09:00:00',
    date: '15 juin – 16 juin 2026',
    location: 'Palais des Congrès, Paris',
    sessions: 7,
    image: 'linear-gradient(135deg, hsl(205 87% 38%), hsl(10 83% 48%))',
    copy: "La plus grande conférence tech de France. Deux jours de conférences, workshops et networking autour de l'innovation.",
  },
  {
    id: 'design-summit-lyon-2026',
    title: 'Design Summit Lyon 2026',
    startsAt: '2026-07-20T09:00:00',
    date: '20 juil. – 22 juil. 2026',
    location: 'Cité Internationale, Lyon',
    sessions: 2,
    image: 'linear-gradient(135deg, hsl(284 72% 58%), hsl(17 92% 58%))',
    copy: 'Le rendez-vous incontournable des designers et créatifs. Explorez les frontières du design numérique.',
  },
  {
    id: 'startup-weekend-bordeaux-2026',
    title: 'Startup Weekend Bordeaux',
    startsAt: '2026-09-05T09:00:00',
    date: '5 sept. – 7 sept. 2026',
    location: 'Darwin Écosystème, Bordeaux',
    sessions: 0,
    image: 'linear-gradient(135deg, hsl(35 76% 55%), hsl(184 42% 38%))',
    copy: 'Un weekend intensif pour transformer vos idées en startups. 54 heures pour pitcher, former une équipe et lancer.',
  },
]

const stats = [
  { value: '3', label: 'Événements', icon: CalendarDays },
  { value: '9', label: 'Sessions', icon: Ticket },
  { value: '6', label: 'Intervenants', icon: Users },
]

export default function IndexPage() {
  const [publishedEvents, setPublishedEvents] = useState<EventRow[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('starts_at', { ascending: true })
      .then(({ data }) => {
        setPublishedEvents(data ?? [])
      })
  }, [])

  const events = useMemo<DisplayEvent[]>(() => {
    const today = new Date()
    const source =
      publishedEvents.length > 0
        ? publishedEvents.map((event, index) => ({
            id: event.id,
            title: event.title,
            date: new Intl.DateTimeFormat('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }).format(new Date(event.starts_at)),
            location: event.location,
            sessions: event.sessions_count,
            image: event.image_url
              ? `linear-gradient(135deg, hsl(143 71% 25% / 0.78), hsl(24 8% 13% / 0.6)), url(${event.image_url}) center/cover`
              : fallbackEvents[index % fallbackEvents.length].image,
            copy: event.description,
            timing:
              new Date(event.starts_at) >= today
                ? ('upcoming' as const)
                : ('past' as const),
          }))
        : fallbackEvents.map((event) => ({
            ...event,
            timing:
              new Date(event.startsAt) >= today
                ? ('upcoming' as const)
                : ('past' as const),
          }))

    return source.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'all' || event.timing === filter
      return matchesSearch && matchesFilter
    })
  }, [publishedEvents, query, filter])

  const addToPlanning = (event: DisplayEvent) => {
    const saved = JSON.parse(
      localStorage.getItem(PLANNING_KEY) ?? '[]'
    ) as Array<Pick<DisplayEvent, 'id'>>
    if (saved.some((item) => item.id === event.id)) return
    localStorage.setItem(
      PLANNING_KEY,
      JSON.stringify([
        ...saved,
        {
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.copy,
        },
      ])
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-[610px] overflow-hidden bg-hero text-hero-foreground md:min-h-[680px]">
        {/* Hero image */}
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80"
          alt="Auditorium moderne préparé pour une conférence EventSync"
          className="absolute inset-0 h-full w-full object-cover"
          width={1600}
          height={900}
        />
        <div className="hero-overlay absolute inset-0" />

        {/* Header */}
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
          <a href="#top" className="flex items-center gap-3 font-bold tracking-tight">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-green">
              <CalendarDays className="size-5" />
            </span>
            <span>
              Event<span className="text-primary">Sync</span>
            </span>
          </a>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Navigation principale">
            <Button variant="nav" size="sm" asChild>
              <a href="#events">Événements</a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-hero-foreground/80 hover:bg-hero-foreground/10 hover:text-hero-foreground"
              asChild
            >
              <Link href="/planning">Mon Planning</Link>
            </Button>
          </nav>
          <Button variant="nav" size="sm" asChild>
            <Link href="/connexion">
              <ShieldCheck className="size-4" /> Admin
            </Link>
          </Button>
        </header>

        {/* Hero content */}
        <div id="top" className="relative z-10 mx-auto max-w-7xl px-6 pt-16 md:px-10 md:pt-24">
          <div className="max-w-xl animate-fade-up">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary ring-1 ring-primary/30">
              <span className="size-2 rounded-full bg-primary animate-soft-pulse" /> Plateforme d'événements
            </div>
            <h1 className="font-display text-6xl font-bold leading-[0.92] tracking-normal md:text-7xl">
              Vivez vos{' '}
              <span className="block text-primary">événements</span>
              <span className="block text-hero-foreground/86">en temps réel</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-hero-foreground/82">
              Plannings interactifs, sessions en direct, Q&A avec les intervenants — tout en un seul endroit.
            </p>
            <label className="mt-8 flex max-w-lg items-center gap-3 rounded-lg border border-hero-foreground/12 bg-hero-foreground/12 px-5 py-4 text-hero-foreground/70 shadow-card backdrop-blur-md transition focus-within:ring-2 focus-within:ring-primary">
              <Search className="size-5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-hero-foreground/55"
                placeholder="Rechercher un événement..."
                aria-label="Rechercher un événement"
              />
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mx-auto mt-12 grid max-w-7xl grid-cols-3 gap-4 px-6 pb-8 md:px-10">
          {stats.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-hero-foreground/84">
              <item.icon className="size-4 text-primary" />
              <strong className="text-2xl text-hero-foreground">{item.value}</strong>
              <span className="hidden text-xs font-bold uppercase md:inline">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Events section */}
      <section id="events" className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Catalogue</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-normal md:text-4xl">Tous les événements</h2>
            <p className="mt-2 text-sm text-muted-foreground">{events.length} événements disponibles</p>
          </div>
          <div className="inline-flex w-fit rounded-lg border border-border bg-surface-elevated p-1 shadow-card">
            {[
              { label: 'Tous', value: 'all' },
              { label: 'À venir', value: 'upcoming' },
              { label: 'Passés', value: 'past' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value as typeof filter)}
                className={`rounded-md px-5 py-2 text-sm font-medium transition ${
                  filter === item.value
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {events.map((event) => (
  <Link 
    key={event.id} 
    href={`/events/${event.id}`}
    className="group block"
  >
    <article className="group overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-green">
      <div className="relative h-48 overflow-hidden" style={{ background: event.image }}>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/82 via-foreground/12 to-transparent" />
        <div className="absolute right-4 top-4 rounded-full bg-card px-3 py-1 text-xs font-bold shadow-card">
          {event.date}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-xl font-extrabold text-primary-foreground">{event.title}</h3>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 text-primary" /> {event.location}
        </p>
        <p className="min-h-16 text-sm leading-6 text-muted-foreground">{event.copy}</p>
        <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="inline-flex items-center gap-2 font-medium text-muted-foreground">
            <LayoutDashboard className="size-4 text-primary" /> {event.sessions} sessions
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-primary transition group-hover:gap-2">
            Voir le programme <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  </Link>
))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hero px-6 py-14 text-hero-foreground md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 border-b border-hero-foreground/10 pb-10 md:grid-cols-[1fr_auto_auto] md:gap-24">
          <div>
            <div className="mb-6 flex items-center gap-3 text-2xl font-bold">
              <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                <CalendarDays />
              </span>
              Event<span className="text-primary">Sync</span>
            </div>
            <p className="max-w-md text-lg leading-8 text-hero-foreground/54">
              La plateforme de gestion d'événements en temps réel pour les organisateurs et participants.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold">Navigation</h3>
            <p className="text-hero-foreground/58">Événements</p>
            <p className="text-hero-foreground/58">Mon Planning</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold">Admin</h3>
            <p className="text-hero-foreground/58">Dashboard</p>
            <p className="text-hero-foreground/58">Connexion</p>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 pt-8 text-hero-foreground/36 md:flex-row">
          <p>© 2026 EventSync. Tous droits réservés.</p>
          <p>
            <span className="text-primary">●</span> Stockage local — vos données restent sur votre machine
          </p>
        </div>
      </footer>
    </main>
  )
}
