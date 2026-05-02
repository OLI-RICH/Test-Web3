import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, mode, name } = await req.json();

    // --- MODE INSCRIPTION ---
    if (mode === "register") {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "Ce compte existe déjà" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || "Utilisateur",
          role: "ADMIN",
        },
      });
      return NextResponse.json({ message: "Compte créé avec succès !" });
    }

    // --- MODE CONNEXION ---
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Ce compte n'existe pas. Veuillez le créer." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }

    return NextResponse.json({ message: "Connexion réussie" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}