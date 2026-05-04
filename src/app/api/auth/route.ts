import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, mode } = await req.json();

    // --- MODE INSCRIPTION ---
    if (mode === "register") {
      // On utilise prisma.admin (minuscule) pour correspondre au modèle Admin
      const existingAdmin = await prisma.admin.findUnique({ where: { email } });
      
      if (existingAdmin) {
        return NextResponse.json({ error: "Ce compte existe déjà" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          // Pas de 'name' ou 'role' ici car ils ne sont pas dans ton schéma
        },
      });
      return NextResponse.json({ message: "Compte admin créé !" });
    }

    // --- MODE CONNEXION ---
    const admin = await prisma.admin.findUnique({ where: { email } });
    
    if (!admin) {
      return NextResponse.json({ error: "Compte inexistant." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    return NextResponse.json({ message: "Connexion réussie" });

  } catch (error: any) {
    console.error("ERREUR CRITIQUE :", error.message);
    return NextResponse.json({ error: "Erreur serveur", details: error.message }, { status: 500 });
  }
}