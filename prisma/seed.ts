import { prisma } from '../lib/prisma';

async function main() {
  console.log('Seeding database...')

  // 1. Profile
  await prisma.profile.deleteMany()
  const profile = await prisma.profile.create({
    data: {
      phone: '+62-821-3273-6902',
      email: 'muhammadarkanmariadi@gmail.com',
      address: 'Malang, Jawa Timur, Indonesia',
      linkedinUrl: 'https://linkedin.com/in/arkanmariadi',
      instagramUrl: 'https://instagram.com/arkanmariadi',
      githubUrl: 'https://github.com/arkanmariadi',
      twitterUrl: '#',
      lanyardImageUrl: 'https://images.unsplash.com/photo-1590402494682-bf34f5ce8c50?w=800&auto=format&fit=crop&q=60',
      shortDescriptionEn: 'Full-stack developer building production web apps — currently studying Software Engineering at SMK Telkom Malang.',
      shortDescriptionId: 'Full-stack developer yang membangun aplikasi web produksi — saat ini menempuh pendidikan Rekayasa Perangkat Lunak di SMK Telkom Malang.',
      fullBiographyEn: 'I am a Full-Stack Developer currently studying Software Engineering at SMK Telkom Malang. I specialize in developing end-to-end web applications using Next.js, React, Nest.js, and Laravel.\n\nMy development approach prioritizes system reliability: structuring modular REST APIs, optimizing database schemas, and maintaining automated CI/CD workflows with Docker and GitHub Actions.\n\nTo date, I have shipped 5 production full-stack systems, including live event management platforms deployed for real-world audiences.',
      fullBiographyId: 'Saya adalah Full-Stack Developer yang saat ini menempuh pendidikan Rekayasa Perangkat Lunak di SMK Telkom Malang. Saya berspesialisasi dalam membangun aplikasi web end-to-end menggunakan Next.js, React, Nest.js, dan Laravel.\n\nPendekatan saya memprioritaskan keandalan sistem: merancang REST API modular, mengoptimalkan skema basis data, dan menerapkan alur kerja CI/CD otomatis dengan Docker dan GitHub Actions.\n\nHingga kini, saya telah merilis 5 sistem full-stack produksi, termasuk platform manajemen acara berskala nyata.',
      cvFileUrl: '/assets/CV_Muhammad_Arkan_Mariadi.pdf'
    }
  })
  console.log('Profile created.')

  // 2. Timeline
  await prisma.timelineEntry.deleteMany()
  const timelineData = [
    {
      type: 'EDUCATION' as const,
      categoryEn: '2023 - 2026',
      categoryId: '2023 - 2026',
      titleEn: 'SMK Telkom Malang',
      titleId: 'SMK Telkom Malang',
      descriptionEn: 'Software Engineering Major (Rekayasa Perangkat Lunak).',
      descriptionId: 'Jurusan Rekayasa Perangkat Lunak.',
      order: 1
    },
    {
      type: 'EDUCATION' as const,
      categoryEn: '2020 - 2023',
      categoryId: '2020 - 2023',
      titleEn: 'SMPN 3 Singosari',
      titleId: 'SMPN 3 Singosari',
      descriptionEn: 'Junior High School.',
      descriptionId: 'Sekolah Menengah Pertama.',
      order: 2
    },
    {
      type: 'EXPERIENCE' as const,
      categoryEn: '2024 - Present',
      categoryId: '2024 - Sekarang',
      titleEn: 'PIC Studio Musik - Moklet Art Club (MAC)',
      titleId: 'PIC Studio Musik - Moklet Art Club (MAC)',
      descriptionEn: 'Managing audio equipment facilities, scheduling, and studio infrastructure maintenance.',
      descriptionId: 'Mengelola fasilitas peralatan audio, penjadwalan, dan perawatan studio musik.',
      order: 1
    },
    {
      type: 'EXPERIENCE' as const,
      categoryEn: '2024',
      categoryId: '2024',
      titleEn: 'Equipment & FOH Lead - MAC A Rhythm',
      titleId: 'Sie Perlengkapan & FOH - MAC A Rhythm',
      descriptionEn: 'Coordinated stage audio routing (Front of House) and live event equipment logistics.',
      descriptionId: 'Mengoordinasikan routing audio panggung (Front of House) dan logistik acara panggung.',
      order: 2
    },
    {
      type: 'EXPERIENCE' as const,
      categoryEn: '2024',
      categoryId: '2024',
      titleEn: 'FOH & Technical Logistics - Ruang Kita',
      titleId: 'Sie FOH & Perlengkapan - Ruang Kita',
      descriptionEn: 'Operated audio engineering systems and managed technical stage execution.',
      descriptionId: 'Mengoperasikan sistem tata suara dan mengelola eksekusi teknis perlengkapan.',
      order: 3
    }
  ]
  for (const t of timelineData) {
    await prisma.timelineEntry.create({ data: t })
  }
  console.log('Timeline seeded.')

  // 3. Skills
  await prisma.skill.deleteMany()
  const skillsData = [
    { title: 'Next.js', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/nextjs.png', order: 1 },
    { title: 'React', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/react-native.png', order: 2 },
    { title: 'Tailwind CSS', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/tailwindcss.png', order: 3 },
    { title: 'Bootstrap', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/bootstrap.png', order: 4 },
    { title: 'Flutter', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/flutter.png', order: 5 },

    { title: 'Nest.js', category: 'BACKEND' as const, logoUrl: 'https://img.icons8.com/color/512/nestjs.png', order: 6 },
    { title: 'Laravel', category: 'BACKEND' as const, logoUrl: 'https://img.icons8.com/color/512/laravel.png', order: 7 },
    { title: 'Golang', category: 'BACKEND' as const, logoUrl: 'https://img.icons8.com/color/512/golang.png', order: 8 },

    { title: 'MySQL', category: 'DATABASE_ORM' as const, logoUrl: 'https://img.icons8.com/color/512/mysql-logo.png', order: 9 },
    { title: 'PostgreSQL', category: 'DATABASE_ORM' as const, logoUrl: 'https://img.icons8.com/color/512/postgreesql.png', order: 10 },
    { title: 'Prisma', category: 'DATABASE_ORM' as const, logoUrl: 'https://github.com/prisma/presskit/raw/main/Assets/Prisma-LightLogo.png', order: 11 },

    { title: 'Git', category: 'VERSION_CONTROL' as const, logoUrl: 'https://img.icons8.com/color/512/git.png', order: 12 },
    { title: 'Docker', category: 'CLOUD_DEPLOYMENT' as const, logoUrl: 'https://img.icons8.com/color/512/docker.png', order: 13 },

    { title: 'JavaScript', category: 'BAHASA_LAINNYA' as const, logoUrl: 'https://img.icons8.com/color/512/javascript--v1.png', order: 14 },
    { title: 'TypeScript', category: 'BAHASA_LAINNYA' as const, logoUrl: 'https://img.icons8.com/color/512/typescript.png', order: 15 },
    { title: 'Java', category: 'BAHASA_LAINNYA' as const, logoUrl: 'https://img.icons8.com/color/512/java-coffee-cup-logo--v1.png', order: 16 },
    { title: 'Python', category: 'BAHASA_LAINNYA' as const, logoUrl: 'https://img.icons8.com/color/512/python--v1.png', order: 17 },

    { title: 'Linux Mint', category: 'SISTEM_OPERASI' as const, logoUrl: 'https://img.icons8.com/color/512/linux-mint.png', order: 18 },
    { title: 'Linux Ubuntu', category: 'SISTEM_OPERASI' as const, logoUrl: 'https://img.icons8.com/color/512/ubuntu--v1.png', order: 19 },
    { title: 'Linux Debian', category: 'SISTEM_OPERASI' as const, logoUrl: 'https://img.icons8.com/color/512/debian.png', order: 20 },
  ]
  const createdSkills = []
  for (const s of skillsData) {
    createdSkills.push(await prisma.skill.create({ data: s }))
  }
  console.log('Skills seeded.')

  // 4. Projects
  await prisma.project.deleteMany()
  const projectsData = [
    {
      categoryEn: 'Web App',
      categoryId: 'Aplikasi Web',
      titleEn: 'Mexpo',
      titleId: 'Mexpo',
      descriptionEn: 'Event management and automated visitor registration platform deployed for the Expo-Expose event at Surabaya Grand City.',
      descriptionId: 'Platform manajemen event dan registrasi pengunjung otomatis yang dideploy untuk acara Expo-Expose di Surabaya Grand City.',
      roleEn: 'Led backend architecture and real-time check-in API integration',
      roleId: 'Memimpin arsitektur backend dan integrasi API check-in real-time',
      isDeploy: true,
      liveUrl: 'https://mexpo.id',
      sourceCodeUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
      order: 1,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'Nest.js')?.id },
          { id: createdSkills.find(s => s.title === 'Tailwind CSS')?.id }
        ].filter(t => t.id)
      }
    },
    {
      categoryEn: 'Enterprise System',
      categoryId: 'Sistem Enterprise',
      titleEn: 'Inventra',
      titleId: 'Inventra',
      descriptionEn: 'Multi-tenant inventory management platform featuring AI-driven demand forecasting to prevent stockouts.',
      descriptionId: 'Platform manajemen inventaris multi-tenant dengan prediksi stok AI untuk mencegah kehabisan stok.',
      roleEn: 'Engineered multi-tenant data layer, forecasting service, and Docker deployment',
      roleId: 'Membangun core multi-tenant, integrasi layanan forecasting, dan deployment Docker',
      isDeploy: false,
      liveUrl: '',
      sourceCodeUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop&q=60',
      order: 2,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'Laravel')?.id },
          { id: createdSkills.find(s => s.title === 'Docker')?.id }
        ].filter(t => t.id)
      }
    },
    {
      categoryEn: 'E-Commerce',
      categoryId: 'E-Commerce',
      titleEn: 'rewear.id',
      titleId: 'rewear.id',
      descriptionEn: 'Peer-to-peer preloved apparel marketplace with built-in escrow payment protection.',
      descriptionId: 'Marketplace pakaian preloved C2C dengan perlindungan sistem pembayaran rekening bersama (escrow).',
      roleEn: 'Built checkout flow, escrow transaction state machine, and seller dashboard',
      roleId: 'Membangun alur checkout, state machine transaksi escrow, dan seller dashboard',
      isDeploy: true,
      liveUrl: 'https://rewear.id',
      sourceCodeUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?w=800&auto=format&fit=crop&q=60',
      order: 3,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'React')?.id },
          { id: createdSkills.find(s => s.title === 'Tailwind CSS')?.id },
          { id: createdSkills.find(s => s.title === 'Laravel')?.id }
        ].filter(t => t.id)
      }
    },
    {
      categoryEn: 'Academic Portal',
      categoryId: 'Portal Akademik',
      titleEn: 'Jagoan Hosting Portal',
      titleId: 'Portal Sekolah Jagoan Hosting',
      descriptionEn: 'Centralized school academic portal for course tracking and student resource distribution.',
      descriptionId: 'Portal akademik sekolah terpusat untuk pelacakan kursus dan distribusi materi belajar siswa.',
      roleEn: 'Developed authentication layer and RESTful API backend',
      roleId: 'Mengembangkan sistem autentikasi dan backend REST API',
      isDeploy: false,
      liveUrl: '',
      sourceCodeUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
      order: 4,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'Laravel')?.id }
        ].filter(t => t.id)
      }
    },
    {
      categoryEn: 'Sustainability',
      categoryId: 'Keberlanjutan',
      titleEn: 'Hijauin',
      titleId: 'Hijauin',
      descriptionEn: 'Waste management and recycling platform connecting households with verified local collectors.',
      descriptionId: 'Platform pengelolaan sampah dan daur ulang yang menghubungkan rumah tangga dengan pengepul lokal.',
      roleEn: 'Built multi-role dashboard and centralized API client layer',
      roleId: 'Membangun dashboard multi-role dan lapisan klien API terpusat',
      isDeploy: false,
      liveUrl: '',
      sourceCodeUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
      order: 5,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'Laravel')?.id }
        ].filter(t => t.id)
      }
    }
  ]
  for (const p of projectsData) {
    await prisma.project.create({ data: p })
  }
  console.log('Projects seeded.')

  // 5. Achievements
  await prisma.achievement.deleteMany()
  const achievementsData = [
    {
      titleId: "Olimpiade Ilmu Sosial Nasional II",
      titleEn: "National Social Science Olympiad II",
      statusId: "Peraih Medali Perak Nasional",
      statusEn: "National Silver Medalist",
      descriptionId: "Peraih Medali Perak Nasional bidang Bahasa Inggris yang diselenggarakan oleh Prisma Cendekia Foundation.",
      descriptionEn: "National Silver Medalist in English language proficiency organized by Prisma Cendekia Foundation.",
      date: new Date("2024-02-04"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056247/certificates/0340168-AN-OISN2-PCF-II-2024-MUHAMMAD-AR.jpg",
      order: 1
    },
    {
      titleId: "Festival Olimpiade Bahasa Nasional",
      titleEn: "National Language Olympiad Festival",
      statusId: "Peraih Medali Emas Nasional",
      statusEn: "National Gold Medalist",
      descriptionId: "Peraih Medali Emas Nasional bidang Bahasa Inggris dari Prisma Cendekia Foundation.",
      descriptionEn: "National Gold Medalist in English Olympiad organized by Prisma Cendekia Foundation.",
      date: new Date("2024-02-25"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056255/certificates/0350264-AN-FOBN-PCF-II-2024-MUHAMMAD-ARK.jpg",
      order: 2
    },
    {
      titleId: "Jagoan Hosting Infra Competition (JHIC)",
      titleEn: "Jagoan Hosting Infra Competition (JHIC)",
      statusId: "Semi Finalis Nasional",
      statusEn: "National Semi-Finalist",
      descriptionId: "Semi Finalis pada kompetisi infrastruktur cloud dan web server nasional oleh Jagoan Hosting.",
      descriptionEn: "National Semi-Finalist in cloud infrastructure and web server competition by Jagoan Hosting.",
      date: new Date("2025-11-21"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056264/certificates/80jt4mcd-767ba5d9-b1e1-4779-81b3-83d36d3.jpg",
      order: 3
    },
    {
      titleId: "Claude Code 101",
      titleEn: "Claude Code 101",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Sertifikasi kemahiran agentic coding dan LLM workflows langsung dari Anthropic.",
      descriptionEn: "Certified proficiency in agentic coding workflows and terminal LLM tooling from Anthropic.",
      date: new Date("2025-01-11"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056299/certificates/certificate-vc5gpn626ypu-1785041535.jpg",
      order: 4
    },
    {
      titleId: "Belajar Dasar Pemrograman JavaScript",
      titleEn: "Basic JavaScript Programming",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Kelulusan materi JavaScript modern, asynchronous programming, dan OOP dari Dicoding Academy.",
      descriptionEn: "Completed modern JavaScript, asynchronous architecture, and OOP certification from Dicoding Academy.",
      date: new Date("2023-07-26"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056317/certificates/sertifikat-course-256-4647483-2607261124.jpg",
      order: 5
    },
    {
      titleId: "Belajar Membuat Front-End Web Pemula",
      titleEn: "Front-End Web Development",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Kelulusan manipulasi DOM, Web Storage, dan perancangan antarmuka responsif dari Dicoding Academy.",
      descriptionEn: "Certified in DOM manipulation, Web Storage APIs, and responsive interface architecture from Dicoding Academy.",
      date: new Date("2023-07-26"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056330/certificates/sertifikat-course-315-4647483-2607261520.jpg",
      order: 6
    }
  ]
  for (const a of achievementsData) {
    await prisma.achievement.create({ data: a })
  }
  console.log('Achievements seeded.')

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
