import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.session.findUnique({
      where: { id: params.id },
      include: {
        room: true,
        speakers: {
          include: {
            speaker: true
          }
        },
        event: true,
        questions: {
          orderBy: { votes: "desc" }
        }
      }
    });
    
    if (!session) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
    }
    
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}