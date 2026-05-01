import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questions = await prisma.question.findMany({
      where: { sessionId: params.id },
      orderBy: { votes: "desc" }
    });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const session = await prisma.session.findUnique({
      where: { id: params.id }
    });
    
    if (!session) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 });
    }
    
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    
    if (now < start || now > end) {
      return NextResponse.json(
        { error: "Les questions ne sont acceptées que pendant la session" },
        { status: 400 }
      );
    }
    
    const question = await prisma.question.create({
      data: {
        content: body.content,
        author: body.author || null,
        sessionId: params.id
      }
    });
    
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'ajout" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { questionId } = await request.json();
    
    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        votes: { increment: 1 }
      }
    });
    
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors du vote" }, { status: 500 });
  }
}