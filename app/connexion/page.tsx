'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarDays, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

const authSchema = z.object({
  email: z.string().trim().email('Adresse email invalide').max(255),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').max(72),
})

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user, isAdmin, refreshRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && isAdmin) router.replace('/admin')
  }, [user, isAdmin, router])

  const handleEmailAuth = async (event: FormEvent) => {
    event.preventDefault()
    const parsed = authSchema.safeParse({ email, password })
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? 'Vérifiez les champs.')
      return
    }

    setSubmitting(true)
    const credentials = { email: parsed.data.email, password: parsed.data.password }
    const result =
      mode === 'login'
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp({
            ...credentials,
            options: { emailRedirectTo: window.location.origin },
          })
    setSubmitting(false)

    if (result.error) {
      toast.error(result.error.message)
      return
    }

    if (mode === 'login') {
      let hasAdminAccess = await refreshRole()
      if (!hasAdminAccess && result.data.user) {
        await supabase.from('admin_claims').insert({ user_id: result.data.user.id })
        hasAdminAccess = await refreshRole()
      }

      if (!hasAdminAccess) {
        toast.error("Ce compte n'a pas les droits administrateur.")
        return
      }
    }

    toast.success(
      mode === 'login'
        ? 'Connexion réussie.'
        : 'Compte créé. Vérifiez votre email pour confirmer l\'accès.'
    )
    if (mode === 'login') router.push('/admin')
  }

  return (
    <main className="min-h-screen bg-hero text-hero-foreground">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-[1fr_430px] md:px-10">
        <section className="max-w-xl">
          <Link href="/" className="mb-20 inline-flex items-center gap-3 font-bold">
            <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-green">
              <CalendarDays className="size-5" />
            </span>
            <span>
              Event<span className="text-primary">Sync</span>
            </span>
          </Link>
          <p className="mb-5 mt-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary ring-1 ring-primary/30">
            <ShieldCheck className="size-4" /> Accès administrateur
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-normal md:text-6xl">
            Pilotez vos événements depuis un espace sécurisé.
          </h1>
          <p className="mt-6 text-lg leading-8 text-hero-foreground/70">
            Connectez-vous pour gérer le catalogue, préparer les publications et mettre les contenus en ligne.
          </p>
        </section>

        <section className="rounded-lg border border-hero-foreground/12 bg-hero-foreground/10 p-6 shadow-card backdrop-blur-md">
          <div className="mb-6 grid grid-cols-2 rounded-lg bg-hero-foreground/10 p-1">
            <button
              onClick={() => setMode('login')}
              className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                mode === 'login' ? 'bg-primary text-primary-foreground' : 'text-hero-foreground/68'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                mode === 'signup' ? 'bg-primary text-primary-foreground' : 'text-hero-foreground/68'
              }`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-hero-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 text-foreground"
                  placeholder="admin@eventsync.fr"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-hero-foreground">
                Mot de passe
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 text-foreground"
                  placeholder="8 caractères minimum"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>
            </div>
            <Button type="submit" variant="pill" className="w-full" disabled={submitting}>
              {submitting ? 'Traitement…' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
            </Button>
          </form>

          <p className="mt-5 text-sm leading-6 text-hero-foreground/55">
            Connexion locale uniquement. Le premier compte créé devient l'administrateur unique de l'espace.
          </p>
        </section>
      </div>
    </main>
  )
}
