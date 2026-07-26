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
      lanyardImageUrl: 'https://images.unsplash.com/photo-1590402494682-bf34f5ce8c50?w=800&auto=format&fit=crop&q=60', // Placeholder
      shortDescriptionEn: 'Junior Full-Stack Developer with 1+ years of experience building scalable web applications using Next.js, React, Nest.js, and Laravel.',
      shortDescriptionId: 'Junior Full-Stack Developer dengan lebih dari 1 tahun pengalaman membangun aplikasi web yang scalable menggunakan Next.js, React, Nest.js, dan Laravel.',
      fullBiographyEn: 'I am a Junior Full-Stack Developer currently studying Software Engineering at SMK Telkom Malang. I have 1+ years of experience building dynamic web applications using Next.js, React, Nest.js, and Laravel.\n\nI believe that code is a medium for craftsmanship. Accustomed to integrating REST APIs, implementing CI/CD with Docker & GitHub Actions, and collaborating in cross-functional teams, I focus on building scalable web apps that perform seamlessly and efficiently.\n\nTo date, I have delivered 5 full-stack projects, including systems deployed for real-world events. Beyond programming, I maintain a balanced life through music, badminton, and fishing, which helps me cultivate focus and consistency in my development process.',
      fullBiographyId: 'Saya adalah Junior Full-Stack Developer yang saat ini sedang menempuh pendidikan Rekayasa Perangkat Lunak di SMK Telkom Malang. Saya memiliki pengalaman 1+ tahun dalam membangun aplikasi web dinamis menggunakan Next.js, React, Nest.js, dan Laravel.\n\nSaya percaya bahwa kode adalah media untuk berkarya. Terbiasa mengintegrasikan REST API, mengimplementasikan CI/CD dengan Docker & GitHub Actions, dan berkolaborasi dalam tim lintas fungsi, saya fokus pada membangun aplikasi web scalable yang beroperasi dengan mulus dan efisien.\n\nHingga saat ini, saya telah menyelesaikan 5 proyek full-stack, termasuk sistem yang dideploy untuk acara dunia nyata. Di luar pemrograman, saya menjaga keseimbangan hidup melalui musik, bulu tangkis, dan memancing, yang membantu saya memupuk fokus dan konsistensi dalam proses pengembangan saya.',
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
      descriptionEn: 'Person in Charge for the music studio at Moklet Art Club.',
      descriptionId: 'Penanggung jawab studio musik di Moklet Art Club.',
      order: 1
    },
    {
      type: 'EXPERIENCE' as const,
      categoryEn: '2024',
      categoryId: '2024',
      titleEn: 'Sie Perlengkapan & FOH - MAC A Rhythm',
      titleId: 'Sie Perlengkapan & FOH - MAC A Rhythm',
      descriptionEn: 'Handled equipment and Front of House duties for the MAC A Rhythm event.',
      descriptionId: 'Menangani perlengkapan dan tugas Front of House (FOH) untuk kepanitiaan acara MAC A Rhythm.',
      order: 2
    },
    {
      type: 'EXPERIENCE' as const,
      categoryEn: '2024',
      categoryId: '2024',
      titleEn: 'Sie FOH & Perlengkapan - Ruang Kita',
      titleId: 'Sie FOH & Perlengkapan - Ruang Kita',
      descriptionEn: 'Managed Front of House operations and equipment for the Ruang Kita event.',
      descriptionId: 'Mengelola operasi Front of House (FOH) dan perlengkapan untuk kepanitiaan acara Ruang Kita.',
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
      descriptionEn: 'Built a responsive frontend with Next.js and backend with Nest.js for an event management platform. Led backend development ensuring clean and documented code. Implemented the system for the Expo-Expose 2026 event at Surabaya Grand City.',
      descriptionId: 'Membangun frontend responsif dengan Next.js dan backend dengan Nest.js untuk platform manajemen event. Memimpin pengembangan backend dan memastikan kode bersih serta terdokumentasi. Menerapkan sistem untuk event Expo-Expose 2026 di Surabaya Grand City.',
      roleEn: 'Full-Stack Developer',
      roleId: 'Full-Stack Developer',
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
      categoryEn: 'Web App',
      categoryId: 'Aplikasi Web',
      titleEn: 'Inventra',
      titleId: 'Inventra',
      descriptionEn: 'Developed a multi-tenant inventory management platform for distributors and MSMEs. Built AI stock forecasting features to reduce stockout/overstock risks. Designed a decoupled architecture: Next.js, Laravel, FastAPI, and Docker.',
      descriptionId: 'Mengembangkan platform manajemen inventaris multi-tenant untuk distributor dan UMKM. Membangun fitur AI stock forecasting untuk mengurangi risiko stockout/overstock. Merancang arsitektur decoupled: Next.js, Laravel, FastAPI, dan Docker.',
      roleEn: 'Full-Stack Developer',
      roleId: 'Full-Stack Developer',
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
      categoryEn: 'Web App',
      categoryId: 'Aplikasi Web',
      titleEn: 'rewear.id',
      titleId: 'rewear.id',
      descriptionEn: 'Built a C2C marketplace for preloved clothes in a 3-day MVP sprint. Developed checkout flow and escrow system. Built seller dashboard and modular RESTful API backend.',
      descriptionId: 'Membangun marketplace C2C untuk baju preloved dalam sprint MVP 3 hari. Mengembangkan alur checkout dan sistem escrow. Membangun seller dashboard dan RESTful API backend.',
      roleEn: 'Full-Stack Developer',
      roleId: 'Full-Stack Developer',
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
      categoryEn: 'Web App',
      categoryId: 'Aplikasi Web',
      titleEn: 'Jagoan Hosting Portal',
      titleId: 'Portal Sekolah Jagoan Hosting',
      descriptionEn: 'Built Laravel REST API and JWT authentication for a full-stack school portal. Co-developed Next.js frontend for backend integration for JHIC 2025.',
      descriptionId: 'Membangun REST API Laravel dan autentikasi JWT untuk portal sekolah full-stack. Turut mengembangkan frontend Next.js untuk integrasi dengan backend pada JHIC 2025.',
      roleEn: 'Full-Stack Developer',
      roleId: 'Full-Stack Developer',
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
      categoryEn: 'Web App',
      categoryId: 'Aplikasi Web',
      titleEn: 'Hijauin',
      titleId: 'Hijauin',
      descriptionEn: 'Built landing page, authentication flow, and multi-role dashboard. Integrated frontend with REST API backend via centralized service layer. Built modular REST API backend.',
      descriptionId: 'Membangun landing page, alur autentikasi, dan dashboard multi-role. Mengintegrasikan frontend dengan REST API backend melalui service layer terpusat. Membangun REST API backend.',
      roleEn: 'Full-Stack Developer',
      roleId: 'Full-Stack Developer',
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
      descriptionId: "Meraih Medali Perak Nasional pada Olimpiade Ilmu Sosial Nasional II 2024 di bidang Bahasa Inggris yang diselenggarakan oleh Prisma Cendekia Foundation.",
      descriptionEn: "Achieved the National Silver Medal in the 2024 National Social Science Olympiad II for English subject, organized by Prisma Cendekia Foundation.",
      date: new Date("2024-02-04"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056247/certificates/0340168-AN-OISN2-PCF-II-2024-MUHAMMAD-AR.jpg",
      order: 1
    },
    {
      titleId: "Festival Olimpiade Bahasa Nasional",
      titleEn: "National Language Olympiad Festival",
      statusId: "Peraih Medali Emas Nasional",
      statusEn: "National Gold Medalist",
      descriptionId: "Meraih Medali Emas Nasional pada Festival Olimpiade Bahasa Nasional 2024 di bidang Bahasa Inggris yang diselenggarakan oleh Prisma Cendekia Foundation.",
      descriptionEn: "Achieved the National Gold Medal in the 2024 National Language Olympiad Festival for English subject, organized by Prisma Cendekia Foundation.",
      date: new Date("2024-02-25"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056255/certificates/0350264-AN-FOBN-PCF-II-2024-MUHAMMAD-ARK.jpg",
      order: 2
    },
    {
      titleId: "Olimpiade Ilmu Sosial Nasional II",
      titleEn: "National Social Science Olympiad II",
      statusId: "Peserta Tingkat Nasional",
      statusEn: "National Participant",
      descriptionId: "Berpartisipasi aktif pada tingkat Nasional dalam Olimpiade Ilmu Sosial Nasional II 2024 bidang Bahasa Inggris.",
      descriptionEn: "Actively participated at the National level in the 2024 National Social Science Olympiad II for English subject.",
      date: new Date("2024-02-04"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056260/certificates/1736-SPTN-OISN2-PCF-II-2024-MUHAMMAD-ARK.jpg",
      order: 3
    },
    {
      titleId: "Jagoan Hosting Infra Competition",
      titleEn: "Jagoan Hosting Infra Competition",
      statusId: "Semi Finalis",
      statusEn: "Semi Finalist",
      descriptionId: "Berhasil mencapai tahap Semi Final pada ajang kompetisi infrastruktur tingkat nasional yang diadakan oleh Jagoan Hosting (JHIC) 2025.",
      descriptionEn: "Successfully reached the Semi-Final stage in the national infrastructure competition held by Jagoan Hosting (JHIC) 2025.",
      date: new Date("2025-11-21"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056264/certificates/80jt4mcd-767ba5d9-b1e1-4779-81b3-83d36d3.jpg",
      order: 4
    },
    {
      titleId: "AMD Classroom Talkshow",
      titleEn: "AMD Classroom Talkshow",
      statusId: "Peserta Talkshow",
      statusEn: "Talkshow Participant",
      descriptionId: "Mengikuti kegiatan talkshow AMD Classroom inspiratif yang diadakan di SMK Telkom Malang pada 27 September 2024.",
      descriptionEn: "Attended the inspiring AMD Classroom talkshow held at SMK Telkom Malang on September 27, 2024.",
      date: new Date("2024-09-27"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056283/certificates/SERTIFIKAT-SMK-TELKOM-MALANG-MUHAMMAD-AR.jpg",
      order: 5
    },
    {
      titleId: "Pelatihan Cyber Security Awareness",
      titleEn: "Cyber Security Awareness Training",
      statusId: "Peserta Pelatihan",
      statusEn: "Training Participant",
      descriptionId: "Berpartisipasi dalam Pelatihan Cyber Security Awareness bertema 'Membangun Kesadaran Siber: Keamanan Digital untuk Generasi Masa Depan'.",
      descriptionEn: "Participated in the Cyber Security Awareness Training themed 'Building Cyber Awareness: Digital Security for Future Generations'.",
      date: new Date("2024-06-19"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056286/certificates/Sertifikat-Attendance-Pelatihan-Cyber-Se.jpg",
      order: 6
    },
    {
      titleId: "BIONIX Competition ISE 2025",
      titleEn: "BIONIX Competition ISE 2025",
      statusId: "Peserta",
      statusEn: "Participant",
      descriptionId: "Berpartisipasi dalam ajang bergengsi BIONIX Competition pada acara Information Systems Expo (ISE!) 2025 yang diadakan oleh ITS.",
      descriptionEn: "Participated in the prestigious BIONIX Competition at the Information Systems Expo (ISE!) 2025 organized by ITS.",
      date: new Date("2025-09-28"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056290/certificates/Sertifikat-Bionix-Muhammad-Arkan-Mariadi.jpg",
      order: 7
    },
    {
      titleId: "IS Class Information System Expo",
      titleEn: "IS Class Information System Expo",
      statusId: "Peserta",
      statusEn: "Participant",
      descriptionId: "Berpartisipasi dalam IS Class pada rangkaian acara Information System Expo (ISE!) 2025 di Surabaya.",
      descriptionEn: "Participated in the IS Class during the Information System Expo (ISE!) 2025 events in Surabaya.",
      date: new Date("2025-08-31"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056293/certificates/Sertifikat-IS-Class-Muhammad-Arkan-Maria.jpg",
      order: 8
    },
    {
      titleId: "Kelulusan Pelatihan Cyber Security",
      titleEn: "Cyber Security Training Graduation",
      statusId: "Lulus dengan Sangat Baik",
      statusEn: "Graduated with Honors",
      descriptionId: "Telah menyelesaikan Pelatihan Cyber Security Awareness dengan predikat Sangat Baik di SMK Telkom Malang.",
      descriptionEn: "Successfully completed the Cyber Security Awareness Training with Excellent predicate at SMK Telkom Malang.",
      date: new Date("2024-06-19"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056296/certificates/Sertifikat-Kelulusan-Pelatihan-Cyber-Sec.jpg",
      order: 9
    },
    {
      titleId: "Claude 101",
      titleEn: "Claude 101",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Menyelesaikan kursus dasar mengenai pemanfaatan Claude 101 dari Anthropic secara komprehensif.",
      descriptionEn: "Completed the comprehensive foundational course on utilizing Claude 101 from Anthropic.",
      date: new Date("2025-01-10"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056298/certificates/certificate-hn4t6tv794pw-1785041152.jpg",
      order: 10
    },
    {
      titleId: "Claude Code 101",
      titleEn: "Claude Code 101",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Menyelesaikan kursus mendalam mengenai Claude Code 101 yang diselenggarakan langsung oleh Anthropic.",
      descriptionEn: "Completed the in-depth course on Claude Code 101 directly organized by Anthropic.",
      date: new Date("2025-01-11"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056299/certificates/certificate-vc5gpn626ypu-1785041535.jpg",
      order: 11
    },
    {
      titleId: "Belajar Dasar Pemrograman Web",
      titleEn: "Learn Basic Web Programming",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Lulus kelas Belajar Dasar Pemrograman Web (HTML, CSS, Flexbox) dari Dicoding Academy dengan hasil memuaskan.",
      descriptionEn: "Graduated from the Learn Basic Web Programming class (HTML, CSS, Flexbox) at Dicoding Academy.",
      date: new Date("2023-07-26"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056307/certificates/sertifikat-course-123-4647483-2607260824.jpg",
      order: 12
    },
    {
      titleId: "Belajar Dasar Pemrograman JavaScript",
      titleEn: "Learn Basic JavaScript Programming",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Lulus kelas Belajar Dasar Pemrograman JavaScript, mencakup Node.js dan OOP dari Dicoding Academy.",
      descriptionEn: "Graduated from the Learn Basic JavaScript Programming class, covering Node.js and OOP at Dicoding Academy.",
      date: new Date("2023-07-26"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056317/certificates/sertifikat-course-256-4647483-2607261124.jpg",
      order: 13
    },
    {
      titleId: "Belajar Membuat Front-End Web Pemula",
      titleEn: "Learn to Build Front-End Web for Beginners",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Lulus kelas Belajar Membuat Front-End Web untuk Pemula (DOM Manipulation & Web Storage) dari Dicoding Academy.",
      descriptionEn: "Graduated from the Learn to Build Front-End Web for Beginners (DOM Manipulation & Web Storage) at Dicoding Academy.",
      date: new Date("2023-07-26"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056330/certificates/sertifikat-course-315-4647483-2607261520.jpg",
      order: 14
    },
    {
      titleId: "Introduction to Financial Literacy",
      titleEn: "Introduction to Financial Literacy",
      statusId: "Sertifikat Kelulusan",
      statusEn: "Certificate of Completion",
      descriptionId: "Lulus kelas Introduction to Financial Literacy yang didukung oleh DBS Foundation di platform Dicoding Academy.",
      descriptionEn: "Graduated from the Introduction to Financial Literacy class supported by DBS Foundation at Dicoding Academy.",
      date: new Date("2023-07-26"),
      imageUrl: "https://res.cloudinary.com/dvpb6z2oj/image/upload/v1785056335/certificates/sertifikat-course-905-4647483-2607260825.jpg",
      order: 15
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
