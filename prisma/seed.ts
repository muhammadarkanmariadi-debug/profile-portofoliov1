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
      titleEn: 'JHIC 2025',
      titleId: 'JHIC 2025',
      statusEn: 'Semi Finalist',
      statusId: 'Semi Finalis',
      descriptionEn: 'Jagoan Hosting Infra Competition (JHIC) 2025. Demonstrated backend & infrastructure capabilities.',
      descriptionId: 'Jagoan Hosting Infra Competition (JHIC) 2025. Mendemonstrasikan kemampuan backend & infrastruktur.',
      date: new Date('2025-11-01'),
      imageUrl: 'https://images.unsplash.com/photo-1590402494682-bf34f5ce8c50?w=800&auto=format&fit=crop&q=60',
      order: 1
    },
    {
      titleEn: 'CodeCollab',
      titleId: 'CodeCollab',
      statusEn: 'Hackathon Participant',
      statusId: 'Peserta Hackathon',
      descriptionEn: 'National Hackathon "CodeCollab: Solving Today\'s Challenges Together", HMSE Telkom University Purwokerto.',
      descriptionId: 'Hackathon Nasional "CodeCollab: Solving Today\'s Challenges Together", HMSE Telkom University Purwokerto.',
      date: new Date('2024-12-01'),
      imageUrl: 'https://images.unsplash.com/photo-1590402494610-2c378a9114c6?w=800&auto=format&fit=crop&q=60',
      order: 2
    },
    {
      titleEn: 'BIONIX',
      titleId: 'BIONIX',
      statusEn: 'Participant',
      statusId: 'Peserta',
      descriptionEn: 'BIONIX Competition, Information Systems Expo (ISE!) 2025, Institut Teknologi Sepuluh Nopember.',
      descriptionId: 'Kompetisi BIONIX, Information Systems Expo (ISE!) 2025, Institut Teknologi Sepuluh Nopember.',
      date: new Date('2025-09-01'),
      imageUrl: '/certificates/sertifikat-bionix-muhammad-arkan-mariadi.png',
      order: 3
    },
    {
      titleEn: 'OISN2 PCF II 2024',
      titleId: 'OISN2 PCF II 2024',
      statusEn: 'Participant',
      statusId: 'Peserta',
      descriptionEn: 'OISN2 PCF II 2024 Participant',
      descriptionId: 'Peserta OISN2 PCF II 2024',
      date: new Date('2024-01-01'),
      imageUrl: '/certificates/0340168-anoisn2pcfii2024-muhammad-arkan-mariadi.png',
      order: 4
    },
    {
      titleEn: 'FOBN PCF II 2024',
      titleId: 'FOBN PCF II 2024',
      statusEn: 'Participant',
      statusId: 'Peserta',
      descriptionEn: 'FOBN PCF II 2024 Participant',
      descriptionId: 'Peserta FOBN PCF II 2024',
      date: new Date('2024-01-02'),
      imageUrl: '/certificates/0350264-anfobnpcfii2024-muhammad-arkan-mariadi-.png',
      order: 5
    },
    {
      titleEn: 'SPTN OISN2 PCF II 2024',
      titleId: 'SPTN OISN2 PCF II 2024',
      statusEn: 'Participant',
      statusId: 'Peserta',
      descriptionEn: 'SPTN OISN2 PCF II 2024 Participant',
      descriptionId: 'Peserta SPTN OISN2 PCF II 2024',
      date: new Date('2024-01-03'),
      imageUrl: '/certificates/1736-sptnoisn2pcfii2024-muhammad-arkan-mariadi.png',
      order: 6
    },
    {
      titleEn: 'Certificate',
      titleId: 'Sertifikat',
      statusEn: 'Participant',
      statusId: 'Peserta',
      descriptionEn: 'Certificate Participant',
      descriptionId: 'Peserta Sertifikat',
      date: new Date('2024-01-04'),
      imageUrl: '/certificates/80jt4mcd-767ba5d9-b1e1-4779-81b3-83d36d39a2be.png',
      order: 7
    },
    {
      titleEn: 'Attendance Cyber Security Training',
      titleId: 'Kehadiran Pelatihan Cyber Security',
      statusEn: 'Participant',
      statusId: 'Peserta',
      descriptionEn: 'Cyber Security Training Attendance',
      descriptionId: 'Kehadiran Pelatihan Cyber Security',
      date: new Date('2024-01-05'),
      imageUrl: '/certificates/sertifikat-attendance-pelatihan-cyber-security.png',
      order: 8
    },
    {
      titleEn: 'IS Class',
      titleId: 'IS Class',
      statusEn: 'Participant',
      statusId: 'Peserta',
      descriptionEn: 'IS Class Participant',
      descriptionId: 'Peserta IS Class',
      date: new Date('2024-01-06'),
      imageUrl: '/certificates/sertifikat-is-class_muhammad-arkan-mariadi.png',
      order: 9
    },
    {
      titleEn: 'Cyber Security Training Graduation',
      titleId: 'Kelulusan Pelatihan Cyber Security',
      statusEn: 'Graduate',
      statusId: 'Lulusan',
      descriptionEn: 'Graduated from Cyber Security Training at SMK Telkom Malang',
      descriptionId: 'Lulus dari Pelatihan Cyber Security di SMK Telkom Malang',
      date: new Date('2024-01-07'),
      imageUrl: '/certificates/sertifikat-kelulusan-pelatihan-cyber-security-smk-telkom-malang.png',
      order: 10
    },
    {
      titleEn: 'SMK Telkom Malang Certificate',
      titleId: 'Sertifikat SMK Telkom Malang',
      statusEn: 'Participant',
      statusId: 'Peserta',
      descriptionEn: 'SMK Telkom Malang Certificate',
      descriptionId: 'Sertifikat SMK Telkom Malang',
      date: new Date('2024-01-08'),
      imageUrl: '/certificates/sertifikat-smk-telkom-malang-muhammad-arkan-mariadi.png',
      order: 11
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
