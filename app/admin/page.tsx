'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CalendarDays, FileText, ImagePlus, LogOut, MapPin,
  Newspaper, Plus, ShieldCheck, Ticket, UploadCloud,
} from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import type { Tables, TablesInsert } from '@/integrations/supabase/types'

type EventRow = Tables<'events'>
type ContentRow = Tables<'contents'>
type EventInsert = TablesInsert<'events'>
type ContentInsert = TablesInsert<'contents'>

const eventSchema = z.object({
  title: z.string().trim().min(3).max(120),
  starts_at: z.string().min(1),
  ends_at: z.string().optional(),
  location: z.string().trim().min(2).max(160),
  description: z.string().trim().min(20).max(1200),
  image_url: z.string().trim().url().optional().or(z.literal('')),
  sessions_count: z.coerce.number().int().min(0).max(200),
  status: z.enum(['draft', 'published']),
})

const contentSchema = z.object({
  event_id: z.string().optional(),
  title: z.string().trim().min(3).max(120),
  type: z.enum(['article', 'announcement', 'session']),
  body: z.string().trim().min(20).max(3000),
  status: z.enum(['draft', 'published']),
})

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<EventRow[]>([])
  const [contents, setContents] = useState<ContentRow[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [eventForm, setEventForm] = useState({
    title: '', starts_at: '', ends_at: '', location: '',
    description: '', image_url: '', sessions_count: 0, status: 'draft',
  })
  const [contentForm, setContentForm] = useState({
    event_id: '', title: '', type: 'announcement', body: '', status: 'draft',
  })
  const [eventImage, setEventImage] = useState<File | null>(null)
  const [eventImagePreview, setEventImagePreview] = useState('')
  const [imageInputKey, setImageInputKey] = useState(0)
  const [savingEvent, setSavingEvent] = useState(false)

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.replace('/connexion')
    if (!loading && user && !isAdmin) router.replace('/')
  }, [loading, user, isAdmin, router])

  const publishedCount = useMemo(
    () => events.filter((e) => e.status === 'published').length,
    [events]
  )

  const loadData = async () => {
    setDataLoading(true)
    const [eventsResult, contentsResult] = await Promise.all([
      supabase.from('events').select('*').order('starts_at', { ascending: true }),
      supabase.from('contents').select('*').order('created_at', { ascending: false }),
    ])
    setDataLoading(false)
    if (eventsResult.error || contentsResult.error) {
      toast.error("Impossible de charger l'espace admin.")
      return
    }
    setEvents(eventsResult.data ?? [])
    setContents(contentsResult.data ?? [])
  }

  useEffect(() => {
    if (user && isAdmin) void loadData()
  }, [user, isAdmin])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) { setEventImage(null); setEventImagePreview(''); return }
    if (!file.type.startsWith('image/')) { e.target.value = ''; return toast.error('Ajoutez une image valide.') }
    if (file.size > 5 * 1024 * 1024) { e.target.value = ''; return toast.error("L'image ne doit pas dépasser 5 Mo.") }
    setEventImage(file)
    setEventImagePreview(URL.createObjectURL(file))
  }

  const uploadEventImage = async () => {
    if (!eventImage) return eventForm.image_url || null
    const extension = eventImage.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filePath = `${user?.id ?? 'admin'}/${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage.from('event-images').upload(filePath, eventImage, { contentType: eventImage.type, upsert: false })
    if (error) throw error
    return supabase.storage.from('event-images').getPublicUrl(filePath).data.publicUrl
  }

  const createEvent = async (e: FormEvent) => {
    e.preventDefault()
    const parsed = eventSchema.safeParse(eventForm)
    if (!parsed.success) return toast.error("Vérifiez les informations de l'événement.")
    setSavingEvent(true)
    let imageUrl: string | null = null
    try { imageUrl = await uploadEventImage() } catch (err) {
      setSavingEvent(false)
      return toast.error(err instanceof Error ? err.message : "Impossible d'envoyer l'image.")
    }
    const payload: EventInsert = {
      title: parsed.data.title, starts_at: parsed.data.starts_at,
      ends_at: parsed.data.ends_at || null, location: parsed.data.location,
      description: parsed.data.description, image_url: imageUrl,
      sessions_count: parsed.data.sessions_count, status: parsed.data.status,
      created_by: user?.id ?? null,
    }
    const { error } = await supabase.from('events').insert(payload)
    setSavingEvent(false)
    if (error) return toast.error(error.message)
    toast.success('Événement enregistré.')
    setEventForm({ title: '', starts_at: '', ends_at: '', location: '', description: '', image_url: '', sessions_count: 0, status: 'draft' })
    setEventImage(null); setEventImagePreview(''); setImageInputKey((k) => k + 1)
    void loadData()
  }

  const createContent = async (e: FormEvent) => {
    e.preventDefault()
    const parsed = contentSchema.safeParse(contentForm)
    if (!parsed.success) return toast.error('Vérifiez les informations du contenu.')
    const payload: ContentInsert = {
      title: parsed.data.title, type: parsed.data.type, body: parsed.data.body,
      status: parsed.data.status, event_id: parsed.data.event_id || null,
      published_at: parsed.data.status === 'published' ? new Date().toISOString() : null,
      created_by: user?.id ?? null,
    }
    const { error } = await supabase.from('contents').insert(payload)
    if (error) return toast.error(error.message)
    toast.success('Contenu enregistré.')
    setContentForm({ event_id: '', title: '', type: 'announcement', body: '', status: 'draft' })
    void loadData()
  }

  const toggleEventStatus = async (item: EventRow) => {
    const { error } = await supabase.from('events').update({ status: item.status === 'published' ? 'draft' : 'published' }).eq('id', item.id)
    if (error) return toast.error(error.message)
    void loadData()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-foreground">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <ShieldCheck className="size-5 animate-soft-pulse text-primary" /> Vérification de l'accès…
        </div>
      </main>
    )
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
          <Button variant="nav" size="sm" onClick={signOut}>
            <LogOut className="size-4" /> Déconnexion
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <ShieldCheck className="size-4" /> Espace admin
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-normal">Gestion des événements</h1>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border bg-card p-4 shadow-card"><strong>{events.length}</strong><p className="text-xs text-muted-foreground">événements</p></div>
            <div className="rounded-lg border bg-card p-4 shadow-card"><strong>{publishedCount}</strong><p className="text-xs text-muted-foreground">publiés</p></div>
            <div className="rounded-lg border bg-card p-4 shadow-card"><strong>{contents.length}</strong><p className="text-xs text-muted-foreground">contenus</p></div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          {/* Event form */}
          <form onSubmit={createEvent} className="rounded-lg border bg-card p-5 shadow-card">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
              <Plus className="size-5 text-primary" /> Publier un événement
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2"><Label>Titre</Label><Input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Début</Label><Input type="datetime-local" value={eventForm.starts_at} onChange={(e) => setEventForm({ ...eventForm, starts_at: e.target.value })} /></div>
              <div className="space-y-2"><Label>Fin</Label><Input type="datetime-local" value={eventForm.ends_at} onChange={(e) => setEventForm({ ...eventForm, ends_at: e.target.value })} /></div>
              <div className="space-y-2"><Label>Lieu</Label><Input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} /></div>
              <div className="space-y-2"><Label>Sessions</Label><Input type="number" min="0" value={eventForm.sessions_count} onChange={(e) => setEventForm({ ...eventForm, sessions_count: Number(e.target.value) })} /></div>
              <div className="space-y-2 md:col-span-2">
                <Label>Image</Label>
                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-background p-5 text-center transition hover:border-primary hover:bg-secondary/60">
                  {eventImagePreview
                    ? <img src={eventImagePreview} alt="Aperçu" className="h-40 w-full rounded-md object-cover" />
                    : <><ImagePlus className="size-8 text-primary" /><span className="text-sm font-medium">Ajouter une image depuis votre ordinateur</span><span className="text-xs text-muted-foreground">PNG, JPG ou WebP — 5 Mo max.</span></>
                  }
                  <Input key={imageInputKey} type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                </label>
              </div>
              <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} /></div>
              <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
              <Button type="submit" variant="pill" disabled={savingEvent}>
                {savingEvent ? <><UploadCloud className="size-4 animate-pulse" /> Enregistrement…</> : 'Enregistrer'}
              </Button>
            </div>
          </form>

          {/* Content form */}
          <form onSubmit={createContent} className="rounded-lg border bg-card p-5 shadow-card">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
              <Newspaper className="size-5 text-primary" /> Nouveau contenu
            </h2>
            <div className="space-y-4">
              <Input placeholder="Titre" value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} />
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={contentForm.event_id} onChange={(e) => setContentForm({ ...contentForm, event_id: e.target.value })}>
                <option value="">Sans événement lié</option>
                {events.map((e) => <option value={e.id} key={e.id}>{e.title}</option>)}
              </select>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={contentForm.type} onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}>
                <option value="announcement">Annonce</option>
                <option value="article">Article</option>
                <option value="session">Session</option>
              </select>
              <Textarea placeholder="Corps du contenu" className="min-h-32" value={contentForm.body} onChange={(e) => setContentForm({ ...contentForm, body: e.target.value })} />
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={contentForm.status} onChange={(e) => setContentForm({ ...contentForm, status: e.target.value })}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
              <Button type="submit" variant="pill" className="w-full">Publier le contenu</Button>
            </div>
          </form>
        </div>

        {/* Catalogue */}
        <section className="mt-8 rounded-lg border bg-card p-5 shadow-card">
          <h2 className="mb-5 flex items-center gap-2 text-xl font-bold">
            <Ticket className="size-5 text-primary" /> Catalogue
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dataLoading ? (
              <p className="text-muted-foreground">Chargement…</p>
            ) : (
              events.map((event) => (
                <article key={event.id} className="overflow-hidden rounded-lg border">
                  <div className="h-32 bg-secondary">
                    {event.image_url
                      ? <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
                      : <div className="grid h-full place-items-center text-muted-foreground"><ImagePlus className="size-7" /></div>
                    }
                  </div>
                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-bold">{event.title}</h3>
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                        {event.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                    <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4 text-primary" />{event.location}
                    </p>
                    <p className="mb-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{event.description}</p>
                    <Button variant="secondary" size="sm" onClick={() => toggleEventStatus(event)}>
                      <FileText className="size-4" />{event.status === 'published' ? 'Dépublier' : 'Publier'}
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  )
}
