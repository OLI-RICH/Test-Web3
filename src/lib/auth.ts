// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "../lib/prisma";
// import bcrypt from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Mot de passe", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Identifiants requis");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email }
//         });

//         if (!user || !user.password) {
//           throw new Error("Email ou mot de passe incorrect");
//         }

//         const isValid = await bcrypt.compare(credentials.password, user.password);

//         if (!isValid) {
//           throw new Error("Email ou mot de passe incorrect");
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         };
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.role = token.role as string;
//         session.user.id = token.id as string;
//       }
//       return session;
//     }
//   },
//   pages: {
//     signIn: "/admin/login",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       email: string;
//       name: string;
//       role: string;
//     }
//   }
  
//   interface User {
//     role: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     role?: string;
//     id?: string;
//   }
// }

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../lib/prisma"; // Assure-toi que ce chemin est correct
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Identifiants requis");
        }

        // --- CORRECTION : Utilise prisma.admin au lieu de prisma.user ---
        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        });

        if (!admin || !admin.password) {
          throw new Error("Email ou mot de passe incorrect");
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password);

        if (!isValid) {
          throw new Error("Email ou mot de passe incorrect");
        }

        // Retourne l'objet admin (Note : ton modèle Admin n'a pas de 'name' ou 'role')
        return {
          id: admin.id,
          email: admin.email,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// --- Mise à jour des types pour correspondre au modèle Admin ---
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}