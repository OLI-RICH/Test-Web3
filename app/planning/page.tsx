'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, MapPin, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type PlanningEvent = {
  id: string
  title: string
  date: string
  location: string
  description: string
}

const PLANNING_KEY = 'eventsync-planning'

export default function PlanningPage() {
  const [items, setItems] = useState<PlanningEvent[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(PLANNING_KEY)
    setItems(saved ? JSON.parse(saved) : [])
  }, [])

  const removeItem = (id: string) => {
    const nextItems = items.filter((item) => item.id !== id)
    setItems(nextItems)
    localStorage.setItem(PLANNING_KEY, JSON.stringify(nextItems))
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-hero text-hero-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <CalendarDays className="size-5" />
            </span>
            Event<span className="text-primary">Sync</span>
          </Link>
          <Button variant="nav" size="sm" asChild>
            <Link href="/">Événements</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Mon planning</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-normal">
          Votre sélection d'événements
        </h1>

        <div className="mt-8 grid gap-4">
          {items.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-card">
              <p className="text-muted-foreground">Aucun événement ajouté pour le moment.</p>
              <Button className="mt-5" variant="pill" asChild>
                <Link href="/">Découvrir les événements</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-card"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="text-sm font-bold text-primary">{item.date}</p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-normal">{item.title}</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4 text-primary" /> {item.location}
                    </p>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => removeItem(item.id)}>
                    <Trash2 className="size-4" /> Retirer
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
