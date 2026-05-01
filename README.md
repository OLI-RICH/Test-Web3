# EventSync — Next.js

Projet migré de Vite/React Router vers **Next.js 14 App Router**.  
L'interface est **identique** à l'originale.

## Ce qui a changé (migration React → Next.js)

| React (Vite) | Next.js |
|---|---|
| `react-router-dom` `<Link>` | `next/link` `<Link>` |
| `useNavigate()` | `useRouter()` de `next/navigation` |
| `<BrowserRouter>` + `<Routes>` | Fichiers `app/page.tsx` (App Router) |
| `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` |
| `src/pages/Index.tsx` | `app/page.tsx` |
| `src/pages/Login.tsx` | `app/connexion/page.tsx` |
| `src/pages/Planning.tsx` | `app/planning/page.tsx` |
| `src/pages/Admin.tsx` | `app/admin/page.tsx` |
| `src/pages/NotFound.tsx` | `app/not-found.tsx` |
| `src/main.tsx` | `app/layout.tsx` + `app/providers.tsx` |

## Installation

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Variables d'environnement

Le fichier `.env.local` est déjà configuré avec tes clés Supabase.  
Si tu veux les changer :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

## Structure

```
app/
  page.tsx          → Page d'accueil (/)
  connexion/        → Page de connexion (/connexion)
  planning/         → Mon planning (/planning)
  admin/            → Espace admin (/admin)
  layout.tsx        → Layout racine
  providers.tsx     → QueryClient + Auth + Toasters
components/
  ui/               → Composants shadcn/ui (inchangés)
hooks/
  useAuth.tsx       → Authentification Supabase
integrations/
  supabase/         → Client et types Supabase
```
