import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Nettoyer les anciennes données
  await prisma.question.deleteMany({});
  await prisma.speakerSession.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.speaker.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@eventsync.com" },
    update: {},
    create: {
      email: "admin@eventsync.com",
      password: hashedPassword,
      name: "Administrateur",
      role: "ADMIN",
    },
  });

  // 2. Salles
  const rooms = await Promise.all([
    prisma.room.upsert({ where: { name: "Grand Amphithéâtre" }, update: {}, create: { name: "Grand Amphithéâtre" } }),
    prisma.room.upsert({ where: { name: "Salle Innovation" }, update: {}, create: { name: "Salle Innovation" } }),
    prisma.room.upsert({ where: { name: "Salle Créativité" }, update: {}, create: { name: "Salle Créativité" } }),
    prisma.room.upsert({ where: { name: "Workshop Lab" }, update: {}, create: { name: "Workshop Lab" } }),
  ]);

  // 3. Speakers
  const speakers = await Promise.all([
    prisma.speaker.create({
      data: {
        name: "Dr. Sarah Chen",
        photoUrl: "https://ui-avatars.com/api/?name=Sarah+Chen&background=6366f1&color=fff&size=128",
        bio: "Experte en intelligence artificielle et conférencière TEDx.",
      },
    }),
    prisma.speaker.create({
      data: {
        name: "Marc Lavoie",
        photoUrl: "https://ui-avatars.com/api/?name=Marc+Lavoie&background=10b981&color=fff&size=128",
        bio: "CTO chez TechInnovations, spécialiste en architecture cloud.",
      },
    }),
    prisma.speaker.create({
      data: {
        name: "Julie Martin",
        photoUrl: "https://ui-avatars.com/api/?name=Julie+Martin&background=8b5cf6&color=fff&size=128",
        bio: "Designer UX/UI primée.",
      },
    }),
    prisma.speaker.create({
      data: {
        name: "Thomas Dubois",
        photoUrl: "https://ui-avatars.com/api/?name=Thomas+Dubois&background=f59e0b&color=fff&size=128",
        bio: "Blockchain architect.",
      },
    }),
  ]);

  console.log(`✅ Créé ${speakers.length} intervenants`);

  // 4. Événements
  const techConf = await prisma.event.create({
    data: {
      title: "TechConf Paris 2026",
      description: "La plus grande conférence tech de France. Deux jours de conférences, workshops et networking autour des technologies émergentes.",
      startDate: new Date("2026-06-15T09:00:00Z"),
      endDate: new Date("2026-06-16T18:00:00Z"),
      location: "Palais des Congrès, Paris",
    },
  });

  const designSummit = await prisma.event.create({
    data: {
      title: "Design Summit Lyon 2026",
      description: "Le rendez-vous incontournable des designers et créatifs. Explorez les frontières du design numérique.",
      startDate: new Date("2026-07-20T09:00:00Z"),
      endDate: new Date("2026-07-22T18:00:00Z"),
      location: "Cité Internationale, Lyon",
    },
  });

  const startupWeekend = await prisma.event.create({
    data: {
      title: "Startup Weekend Bordeaux",
      description: "Un weekend intensif pour transformer vos idées en startups. 54 heures pour pitcher, former une équipe et lancer votre projet.",
      startDate: new Date("2026-09-10T18:00:00Z"),
      endDate: new Date("2026-09-12T22:00:00Z"),
      location: "Darwin Ecosystème, Bordeaux",
    },
  });

  console.log(`✅ Créé 3 événements`);

  // 5. Sessions
  const session1 = await prisma.session.create({
    data: {
      title: "Keynote: L'avenir de l'IA générative",
      description: "Découvrez comment l'IA générative va transformer nos métiers.",
      startTime: new Date("2026-06-15T10:00:00Z"),
      endTime: new Date("2026-06-15T11:30:00Z"),
      capacity: 500,
      eventId: techConf.id,
      roomId: rooms[0].id,
      speakers: {
        create: [{ speakerId: speakers[0].id }]
      }
    }
  });

  await prisma.session.create({
    data: {
      title: "Architecture Microservices",
      description: "Bonnes pratiques et retours d'expérience sur l'architecture microservices.",
      startTime: new Date("2026-06-15T14:00:00Z"),
      endTime: new Date("2026-06-15T15:30:00Z"),
      capacity: 200,
      eventId: techConf.id,
      roomId: rooms[1].id,
      speakers: {
        create: [{ speakerId: speakers[1].id }]
      }
    }
  });

  await prisma.session.create({
    data: {
      title: "Web3 et DeFi",
      description: "Introduction au Web3, aux smart contracts et à la finance décentralisée.",
      startTime: new Date("2026-06-16T11:00:00Z"),
      endTime: new Date("2026-06-16T12:30:00Z"),
      capacity: 150,
      eventId: techConf.id,
      roomId: rooms[2].id,
      speakers: {
        create: [{ speakerId: speakers[3].id }]
      }
    }
  });

  await prisma.session.create({
    data: {
      title: "UX Design pour l'IA",
      description: "Comment concevoir des interfaces intuitives.",
      startTime: new Date("2026-07-20T10:30:00Z"),
      endTime: new Date("2026-07-20T12:00:00Z"),
      capacity: 100,
      eventId: designSummit.id,
      roomId: rooms[1].id,
      speakers: {
        create: [{ speakerId: speakers[2].id }]
      }
    }
  });

  await prisma.session.create({
    data: {
      title: "Design Systems à grande échelle",
      description: "Stratégies et outils pour maintenir des design systems cohérents.",
      startTime: new Date("2026-07-21T14:00:00Z"),
      endTime: new Date("2026-07-21T16:00:00Z"),
      capacity: 120,
      eventId: designSummit.id,
      roomId: rooms[0].id,
      speakers: {
        create: [{ speakerId: speakers[2].id }]
      }
    }
  });

  // 6. Questions
  await prisma.question.createMany({
    data: [
      {
        content: "Quelles sont les compétences clés à développer pour l'IA ?",
        author: "Thomas",
        votes: 25,
        sessionId: session1.id,
      },
      {
        content: "Quels sont les risques éthiques ?",
        author: null,
        votes: 32,
        sessionId: session1.id,
      },
    ]
  });

  console.log("✅ Seed completed!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 Admin: admin@eventsync.com");
  console.log("🔑 Password: admin123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });