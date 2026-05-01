import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const speakers = await prisma.speaker.findMany({
      include: {
        sessions: {
          include: {
            session: {
              include: {
                event: true
              }
            }
          }
        }
      }
    });
    return NextResponse.json(speakers);
  } catch (error) {
    console.error("Error fetching speakers:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des intervenants" }, { status: 500 });
  }
}