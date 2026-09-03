import { prisma } from '../lib/prisma';

async function main() {
  console.log('🚀 Seeding comprehensive database for 4RK4N.DEV...')

  // 1. Profile Seeding
  await prisma.profile.deleteMany()
  const profile = await prisma.profile.create({
    data: {
      phone: '+62-821-3273-6902',
      email: 'muhammadarkanmariadi@gmail.com',
      address: 'Malang, Jawa Timur, Indonesia',
      linkedinUrl: 'https://linkedin.com/in/arkanmariadi',
      instagramUrl: 'https://instagram.com/arkanmariadi',
      githubUrl: 'https://github.com/arkanmariadi',
      twitterUrl: 'https://twitter.com/arkanmariadi',
      lanyardImageUrl: 'https://images.unsplash.com/photo-1590402494682-bf34f5ce8c50?w=800&auto=format&fit=crop&q=60',
      shortDescriptionEn: 'Full-Stack Developer & Software Engineering Student at SMK Telkom Malang specializing in Next.js, Nest.js, Laravel, and cloud architectures.',
      shortDescriptionId: 'Full-Stack Developer & Siswa Rekayasa Perangkat Lunak di SMK Telkom Malang yang berspesialisasi dalam Next.js, Nest.js, Laravel, dan arsitektur cloud.',
      fullBiographyEn: 'I am a Full-Stack Software Engineer currently studying at SMK Telkom Malang. I specialize in designing and shipping production-grade web systems, high-concurrency event platforms, and robust database architectures using Next.js, React, Nest.js, and Laravel.\n\nMy engineering philosophy focuses on system reliability, clean modular architectures, type-safety, and intuitive user experiences. Over the past 2 years, I have architected and deployed multiple live production web applications, including digital event check-in systems and multi-tenant platforms.\n\nI continuously explore agentic workflows, WebGL 3D interaction design, and automated DevOps pipelines with Docker and GitHub Actions.',
      fullBiographyId: 'Saya adalah Full-Stack Software Engineer yang saat ini menempuh pendidikan di SMK Telkom Malang. Saya berspesialisasi dalam merancang dan meluncurkan sistem web tingkat produksi, platform event dengan konkurensi tinggi, dan arsitektur basis data yang andal menggunakan Next.js, React, Nest.js, dan Laravel.\n\nFilosofi rekayasa saya berfokus pada keandalan sistem, arsitektur modular yang bersih, keamanan tipe data, dan pengalaman pengguna yang intuitif. Selama 2 tahun terakhir, saya telah membangun dan merilis beberapa aplikasi web produksi langsung, termasuk sistem check-in digital dan platform multi-tenant.\n\nSaya terus mengeksplorasi alur kerja agen cerdas, interaksi 3D WebGL, serta pipeline DevOps otomatis menggunakan Docker dan GitHub Actions.',
      cvFileUrl: '/assets/CV_Muhammad_Arkan_Mariadi.pdf'
    }
  })
  console.log('✅ Profile seeded:', profile.email)

  // 2. Timeline Seeding (Education & Experience)
  await prisma.timelineEntry.deleteMany()
  const timelineData = [
    {
      type: 'EDUCATION' as const,
      categoryEn: '2023 - 2026',
      categoryId: '2023 - 2026',
      titleEn: 'SMK Telkom Malang',
      titleId: 'SMK Telkom Malang',
      descriptionEn: 'Software Engineering Major (Rekayasa Perangkat Lunak). Focus on full-stack web engineering, database architecture, cloud infrastructure, and agile software development.',
      descriptionId: 'Jurusan Rekayasa Perangkat Lunak. Fokus pada rekayasa web full-stack, arsitektur basis data, infrastruktur cloud, dan pengembangan perangkat lunak agile.',
      order: 1
    },
    {
      type: 'EDUCATION' as const,
      categoryEn: '2020 - 2023',
      categoryId: '2020 - 2023',
      titleEn: 'SMPN 3 Singosari',
      titleId: 'SMPN 3 Singosari',
      descriptionEn: 'Junior High School graduate with academic excellence and national language competition awards.',
      descriptionId: 'Lulusan Sekolah Menengah Pertama dengan prestasi akademik dan penghargaan kompetisi bahasa tingkat nasional.',
      order: 2
    },
    {
      type: 'EXPERIENCE' as const,
      categoryEn: '2024 - Present',
      categoryId: '2024 - Sekarang',
      titleEn: 'PIC Studio Musik — Moklet Art Club (MAC)',
      titleId: 'PIC Studio Musik — Moklet Art Club (MAC)',
      descriptionEn: 'Managing high-grade digital audio equipment, studio infrastructure maintenance, booking schedules, and live recording setups.',
      descriptionId: 'Mengelola fasilitas peralatan audio digital, perawatan infrastruktur studio, jadwal pemakaian, dan setup rekaman live.',
      order: 1
    },
    {
      type: 'EXPERIENCE' as const,
      categoryEn: '2024',
      categoryId: '2024',
      titleEn: 'Equipment & FOH Lead — MAC A Rhythm',
      titleId: 'Koordinator Perlengkapan & FOH — MAC A Rhythm',
      descriptionEn: 'Coordinated front-of-house (FOH) stage audio engineering, signal routing, and technical equipment logistics for live multi-artist showcase.',
      descriptionId: 'Mengoordinasikan routing tata suara panggung (FOH) dan logistik peralatan teknis untuk pagelaran musik multi-artis.',
      order: 2
    },
    {
      type: 'EXPERIENCE' as const,
      categoryEn: '2024',
      categoryId: '2024',
      titleEn: 'Technical Sound Engineer — Ruang Kita',
      titleId: 'Teknisi Audio & FOH — Ruang Kita',
      descriptionEn: 'Operated stage audio engineering consoles, monitored live acoustic balances, and managed stage power distribution.',
      descriptionId: 'Mengoperasikan konsol audio panggung, memonitor keseimbangan akustik live, dan mengelola distribusi daya teknis.',
      order: 3
    }
  ]
  for (const t of timelineData) {
    await prisma.timelineEntry.create({ data: t })
  }
  console.log('✅ Timeline entries seeded:', timelineData.length)

  // 3. Technical Skills Matrix Seeding
  await prisma.skill.deleteMany()
  const skillsData = [
    // FRONTEND
    { title: 'Next.js', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/nextjs.png', order: 1 },
    { title: 'React', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/react-native.png', order: 2 },
    { title: 'TypeScript', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/typescript.png', order: 3 },
    { title: 'Tailwind CSS', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/tailwindcss.png', order: 4 },
    { title: 'JavaScript', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/javascript--v1.png', order: 5 },
    { title: 'Flutter', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/flutter.png', order: 6 },
    { title: 'Bootstrap', category: 'FRONTEND' as const, logoUrl: 'https://img.icons8.com/color/512/bootstrap.png', order: 7 },

    // BACKEND
    { title: 'Nest.js', category: 'BACKEND' as const, logoUrl: 'https://img.icons8.com/color/512/nestjs.png', order: 8 },
    { title: 'Laravel', category: 'BACKEND' as const, logoUrl: 'https://img.icons8.com/color/512/laravel.png', order: 9 },
    { title: 'Node.js', category: 'BACKEND' as const, logoUrl: 'https://img.icons8.com/color/512/nodejs.png', order: 10 },
    { title: 'Golang', category: 'BACKEND' as const, logoUrl: 'https://img.icons8.com/color/512/golang.png', order: 11 },

    // DATABASE & ORM
    { title: 'PostgreSQL', category: 'DATABASE_ORM' as const, logoUrl: 'https://img.icons8.com/color/512/postgreesql.png', order: 12 },
    { title: 'MySQL', category: 'DATABASE_ORM' as const, logoUrl: 'https://img.icons8.com/color/512/mysql-logo.png', order: 13 },
    { title: 'Prisma ORM', category: 'DATABASE_ORM' as const, logoUrl: 'https://github.com/prisma/presskit/raw/main/Assets/Prisma-LightLogo.png', order: 14 },

    // CLOUD & DEVOPS
    { title: 'Docker', category: 'CLOUD_DEPLOYMENT' as const, logoUrl: 'https://img.icons8.com/color/512/docker.png', order: 15 },
    { title: 'Git & GitHub', category: 'VERSION_CONTROL' as const, logoUrl: 'https://img.icons8.com/color/512/git.png', order: 16 },

    // DESIGN & PROTOTYPING
    { title: 'Figma', category: 'DESIGN_PROTOTYPING' as const, logoUrl: 'https://img.icons8.com/color/512/figma--v1.png', order: 17 },

    // OPERATING SYSTEMS
    { title: 'Linux Ubuntu', category: 'SISTEM_OPERASI' as const, logoUrl: 'https://img.icons8.com/color/512/ubuntu--v1.png', order: 18 },
    { title: 'Linux Mint', category: 'SISTEM_OPERASI' as const, logoUrl: 'https://img.icons8.com/color/512/linux-mint.png', order: 19 },
    { title: 'Linux Debian', category: 'SISTEM_OPERASI' as const, logoUrl: 'https://img.icons8.com/color/512/debian.png', order: 20 },
  ]
  const createdSkills = []
  for (const s of skillsData) {
    createdSkills.push(await prisma.skill.create({ data: s }))
  }
  console.log('✅ Skills seeded:', createdSkills.length)

  // 4. Projects Seeding
  await prisma.project.deleteMany()
  const projectsData = [
    {
      slug: 'mexpo-event-management',
      categoryEn: 'Web App & Live Infrastructure',
      categoryId: 'Aplikasi Web & Infrastruktur Live',
      titleEn: 'Mexpo',
      titleId: 'Mexpo',
      descriptionEn: 'High-speed event management and automated visitor registration system engineered for the live Expo-Expose showcase at Surabaya Grand City with instant QR check-in.',
      descriptionId: 'Sistem manajemen event dan registrasi pengunjung berkecepatan tinggi yang dibangun untuk pagelaran Expo-Expose di Surabaya Grand City dengan verifikasi instan QR.',
      roleEn: 'Lead Backend Engineer & Real-Time API Architecture',
      roleId: 'Lead Backend Engineer & Arsitektur API Real-Time',
      isDeploy: true,
      liveUrl: 'https://mexpo.id',
      sourceCodeUrl: 'https://github.com/arkanmariadi/mexpo-backend',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      order: 1,
      readmeContent: `# Mexpo — High-Concurrency Event Management Platform

Mexpo is an enterprise-grade digital ticketing, visitor registration, and real-time attendance tracking platform engineered for high-throughput public expos.

### Key Architecture Highlights:
- **Instant QR Verification**: Sub-50ms check-in validation.
- **Microservice Event Bus**: Scalable visitor telemetry engine.
- **Automated Registration**: Zero-friction attendee onboarding.`,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'Nest.js')?.id },
          { id: createdSkills.find(s => s.title === 'TypeScript')?.id },
          { id: createdSkills.find(s => s.title === 'PostgreSQL')?.id },
          { id: createdSkills.find(s => s.title === 'Tailwind CSS')?.id }
        ].filter(t => t.id)
      }
    },
    {
      slug: 'inventra-inventory-system',
      categoryEn: 'Enterprise Cloud System',
      categoryId: 'Sistem Enterprise Cloud',
      titleEn: 'Inventra',
      titleId: 'Inventra',
      descriptionEn: 'Multi-tenant warehouse and asset inventory management platform featuring predictive stock tracking, role-based access control, and automated restock alerts.',
      descriptionId: 'Platform manajemen aset dan pergudangan multi-tenant dengan pelacakan stok prediktif, kontrol akses berbasis peran (RBAC), dan notifikasi otomatis restock.',
      roleEn: 'Full-Stack Architecture & Multi-Tenant Data Isolation',
      roleId: 'Arsitektur Full-Stack & Isolasi Data Multi-Tenant',
      isDeploy: false,
      liveUrl: 'https://inventra.4rk4n.dev',
      sourceCodeUrl: 'https://github.com/arkanmariadi/inventra-core',
      imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1200&auto=format&fit=crop&q=80',
      order: 2,
      readmeContent: `# Inventra — Multi-Tenant Enterprise Inventory Suite

Inventra provides modular asset tracking, automated purchase-order reconciliation, and predictive supply-chain analytics.`,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'Laravel')?.id },
          { id: createdSkills.find(s => s.title === 'MySQL')?.id },
          { id: createdSkills.find(s => s.title === 'Docker')?.id }
        ].filter(t => t.id)
      }
    },
    {
      slug: 'rewear-preloved-marketplace',
      categoryEn: 'E-Commerce & Escrow',
      categoryId: 'E-Commerce & Rekening Bersama',
      titleEn: 'rewear.id',
      titleId: 'rewear.id',
      descriptionEn: 'Peer-to-peer preloved fashion marketplace incorporating an escrow state-machine payment layer, automated courier shipping calculation, and verified merchant verification.',
      descriptionId: 'Marketplace fashion preloved C2C dengan lapisan pembayaran rekening bersama (escrow), kalkulasi ongkos kirim ekspedisi otomatis, dan verifikasi merchant terpercaya.',
      roleEn: 'Lead Full-Stack Developer & Escrow State Engine',
      roleId: 'Lead Full-Stack Developer & State Engine Rekening Bersama',
      isDeploy: true,
      liveUrl: 'https://rewear.id',
      sourceCodeUrl: 'https://github.com/arkanmariadi/rewear-app',
      imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?w=1200&auto=format&fit=crop&q=80',
      order: 3,
      readmeContent: `# rewear.id — Sustainable Fashion Commerce Engine

Engineered with escrow checkout protection, instantaneous payment webhook callbacks, and responsive buyer-seller negotiation chat.`,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'React')?.id },
          { id: createdSkills.find(s => s.title === 'Tailwind CSS')?.id },
          { id: createdSkills.find(s => s.title === 'Laravel')?.id },
          { id: createdSkills.find(s => s.title === 'PostgreSQL')?.id }
        ].filter(t => t.id)
      }
    },
    {
      slug: 'jagoan-hosting-school-portal',
      categoryEn: 'Academic Cloud Platform',
      categoryId: 'Platform Akademik Cloud',
      titleEn: 'Jagoan Hosting Portal',
      titleId: 'Portal Sekolah Jagoan Hosting',
      descriptionEn: 'Centralized academic management and course material distribution hub for educational cohorts with automated student progress analytics.',
      descriptionId: 'Pusat manajemen akademik dan distribusi materi pembelajaran terpusat untuk siswa dengan analitik progres belajar otomatis.',
      roleEn: 'Backend API Engineer & Authentication Security',
      roleId: 'Backend API Engineer & Keamanan Autentikasi',
      isDeploy: false,
      liveUrl: 'https://portal.jagoanhosting.com',
      sourceCodeUrl: 'https://github.com/arkanmariadi/jh-academic-portal',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      order: 4,
      readmeContent: `# Jagoan Hosting Academic Portal

Robust LMS backend designed with granular role access controls (SuperAdmin, Teacher, Student) and assignment submission engines.`,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'Laravel')?.id },
          { id: createdSkills.find(s => s.title === 'MySQL')?.id }
        ].filter(t => t.id)
      }
    },
    {
      slug: 'hijauin-waste-management',
      categoryEn: 'Sustainability & IoT Portal',
      categoryId: 'Platform Lingkungan & IoT',
      titleEn: 'Hijauin',
      titleId: 'Hijauin',
      descriptionEn: 'Waste recycling logistics web platform connecting eco-conscious households with registered neighborhood waste collector banks with reward point incentives.',
      descriptionId: 'Platform logistik daur ulang sampah yang menghubungkan rumah tangga peduli lingkungan dengan bank sampah terverifikasi disertai poin reward.',
      roleEn: 'Full-Stack Developer & Logistics Dispatch Routing',
      roleId: 'Full-Stack Developer & Routing Pengiriman Logistik',
      isDeploy: false,
      liveUrl: 'https://hijauin.app',
      sourceCodeUrl: 'https://github.com/arkanmariadi/hijauin-web',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
      order: 5,
      readmeContent: `# Hijauin — Smart Circular Economy Platform

Facilitating residential waste pickup schedules, waste weight classification, and immediate digital wallet reward disbursement.`,
      techStack: {
        connect: [
          { id: createdSkills.find(s => s.title === 'Next.js')?.id },
          { id: createdSkills.find(s => s.title === 'Laravel')?.id },
          { id: createdSkills.find(s => s.title === 'Tailwind CSS')?.id }
        ].filter(t => t.id)
      }
    }
  ]
  for (const p of projectsData) {
    await prisma.project.create({ data: p })
  }
  console.log('✅ Projects seeded with slugs & tech stacks:', projectsData.length)

  // 5. Achievements & Certifications Seeding
  await prisma.achievement.deleteMany()
  const achievementsData = [
    {
      slug: 'olimpiade-ilmu-sosial-nasional-ii',
      titleId: "Olimpiade Ilmu Sosial Nasional II",
      titleEn: "National Social Science Olympiad II",
      statusId: "Peraih Medali Perak Nasional",
      statusEn: "National Silver Medalist",
      descriptionId: "Peraih Medali Perak Nasional bidang Bahasa Inggris yang diselenggarakan oleh Prisma Cendekia Foundation dengan partisipasi ribuan siswa dari seluruh Indonesia.",
      descriptionEn: "National Silver Medalist in English language proficiency organized by Prisma Cendekia Foundation competing with thousands of participants across Indonesia.",
      date: new Date("2024-02-04"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056247/certificates/0340168-AN-OISN2-PCF-II-2024-MUHAMMAD-AR.jpg",
      order: 1
    },
    {
      slug: 'festival-olimpiade-bahasa-nasional',
      titleId: "Festival Olimpiade Bahasa Nasional",
      titleEn: "National Language Olympiad Festival",
      statusId: "Peraih Medali Emas Nasional",
      statusEn: "National Gold Medalist",
      descriptionId: "Peraih Medali Emas Nasional bidang Bahasa Inggris dari Prisma Cendekia Foundation atas keunggulan pemahaman tata bahasa, analisis teks, dan komunikasi.",
      descriptionEn: "National Gold Medalist in English Olympiad organized by Prisma Cendekia Foundation for exceptional mastery in grammatical analysis and linguistic comprehension.",
      date: new Date("2024-02-25"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056255/certificates/0350264-AN-FOBN-PCF-II-2024-MUHAMMAD-ARK.jpg",
      order: 2
    },
    {
      slug: 'jagoan-hosting-infra-competition',
      titleId: "Jagoan Hosting Infra Competition (JHIC)",
      titleEn: "Jagoan Hosting Infra Competition (JHIC)",
      statusId: "Semi Finalis Nasional",
      statusEn: "National Semi-Finalist",
      descriptionId: "Semi Finalis pada kompetisi arsitektur infrastruktur server cloud, deployment container, dan optimasi load balancer web server nasional oleh Jagoan Hosting.",
      descriptionEn: "National Semi-Finalist in cloud infrastructure architecture, containerized server deployment, and high-availability load balancing by Jagoan Hosting.",
      date: new Date("2025-11-21"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056264/certificates/80jt4mcd-767ba5d9-b1e1-4779-81b3-83d36d3.jpg",
      order: 3
    },
    {
      slug: 'claude-code-101-anthropic',
      titleId: "Claude Code 101",
      titleEn: "Claude Code 101",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Sertifikasi kemahiran agentic coding, command-line LLM workflows, dan otomatisasi rekayasa perangkat lunak langsung dari Anthropic.",
      descriptionEn: "Certified proficiency in agentic software engineering workflows, terminal LLM tooling, and autonomous code refactoring from Anthropic.",
      date: new Date("2025-01-11"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056299/certificates/certificate-vc5gpn626ypu-1785041535.jpg",
      order: 4
    },
    {
      slug: 'belajar-dasar-pemrograman-javascript',
      titleId: "Belajar Dasar Pemrograman JavaScript",
      titleEn: "Basic JavaScript Programming",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Kelulusan materi fundamental JavaScript modern ES6+, asynchronous programming (Promises & async/await), dan Object-Oriented Programming dari Dicoding Academy.",
      descriptionEn: "Completed modern JavaScript ES6+, asynchronous control flow (Promises, async/await), and OOP architecture certification from Dicoding Academy.",
      date: new Date("2023-07-26"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056317/certificates/sertifikat-course-256-4647483-2607261124.jpg",
      order: 5
    },
    {
      slug: 'belajar-membuat-front-end-web-pemula',
      titleId: "Belajar Membuat Front-End Web untuk Pemula",
      titleEn: "Front-End Web Development for Beginners",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Kelulusan manipulasi DOM interaktif, Web Storage API (localStorage/sessionStorage), dan perancangan antarmuka responsif modern dari Dicoding Academy.",
      descriptionEn: "Certified in interactive DOM manipulation, Web Storage APIs, and responsive UI/UX architecture from Dicoding Academy.",
      date: new Date("2023-07-26"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056330/certificates/sertifikat-course-315-4647483-2607261520.jpg",
      order: 6
    }
  ]
  for (const a of achievementsData) {
    await prisma.achievement.create({ data: a })
  }
  console.log('✅ Achievements seeded with slugs & badges:', achievementsData.length)

  console.log('🎉 Database seeded successfully with comprehensive data!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
