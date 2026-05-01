import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessions = await prisma.session.findMany({
      where: { eventId: params.id },
      include: {
        room: true,
        speakers: {
          include: {
            speaker: true
          }
        },
        questions: {
          orderBy: { votes: "desc" }
        }
      },
      orderBy: { startTime: "asc" }
    });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}