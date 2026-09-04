import { prisma } from '../lib/prisma';

async function main() {
  console.log('🚀 Seeding standardized English database for 4RK4N.DEV with all 19 GitHub Repositories...');

  // 1. Profile Seeding (Upsert)
  const profileData = {
    phone: '+62-821-3273-6902',
    email: 'muhammadarkanmariadi@gmail.com',
    address: 'Malang, East Java, Indonesia',
    linkedinUrl: 'https://linkedin.com/in/arkanmariadi',
    instagramUrl: 'https://instagram.com/arkanmariadi',
    githubUrl: 'https://github.com/muhammadarkanmariadi-debug',
    twitterUrl: 'https://twitter.com/arkanmariadi',
    lanyardImageUrl: 'https://images.unsplash.com/photo-1590402494682-bf34f5ce8c50?w=800&auto=format&fit=crop&q=60',
    shortDescription: 'Full-Stack Developer & Software Engineering Student at SMK Telkom Malang specializing in Next.js, Nest.js, Laravel, and cloud architectures.',
    fullBiography: 'I am a Full-Stack Software Engineer currently studying at SMK Telkom Malang. I specialize in designing and shipping production-grade web systems, high-concurrency event platforms, and robust database architectures using Next.js, React, Nest.js, and Laravel.\n\nMy engineering philosophy focuses on system reliability, clean modular architectures, type-safety, and intuitive user experiences. Over the past 2 years, I have architected and deployed multiple live production web applications, including digital event check-in systems and multi-tenant platforms.\n\nI continuously explore agentic workflows, WebGL 3D interaction design, and automated DevOps pipelines with Docker and GitHub Actions.',
    cvFileUrl: '/assets/CV_Muhammad_Arkan_Mariadi.pdf'
  }
  const existingProfile = await prisma.profile.findFirst()
  const profile = existingProfile
    ? await prisma.profile.update({
        where: { id: existingProfile.id },
        data: profileData
      })
    : await prisma.profile.create({
        data: profileData
      })
  console.log('✅ Profile upserted:', profile.email)

  // 2. Timeline Seeding (Education & Experience - Upsert)
  const timelineData = [
    {
      type: 'EDUCATION' as const,
      category: '2023 - 2026',
      title: 'SMK Telkom Malang',
      description: 'Software Engineering Major (Rekayasa Perangkat Lunak). Focus on full-stack web engineering, database architecture, cloud infrastructure, and agile software development.',
      order: 1
    },
    {
      type: 'EXPERIENCE' as const,
      category: '2024 - Present',
      title: 'PIC Studio Musik — Moklet Art Club (MAC)',
      description: 'Managing high-grade digital audio equipment, studio infrastructure maintenance, booking schedules, and live recording setups.',
      order: 1
    },
    {
      type: 'EXPERIENCE' as const,
      category: '2024',
      title: 'Equipment & FOH Lead — MAC A Rhythm',
      description: 'Coordinated front-of-house (FOH) stage audio engineering, signal routing, and technical equipment logistics for live multi-artist showcase.',
      order: 2
    },
    {
      type: 'EXPERIENCE' as const,
      category: '2024',
      title: 'Technical Sound Engineer — Ruang Kita',
      description: 'Operated stage audio engineering consoles, monitored live acoustic balances, and managed stage power distribution.',
      order: 3
    }
  ]
  for (const t of timelineData) {
    const existingTimeline = await prisma.timelineEntry.findFirst({
      where: { title: t.title, category: t.category }
    })
    if (existingTimeline) {
      await prisma.timelineEntry.update({
        where: { id: existingTimeline.id },
        data: t
      })
    } else {
      await prisma.timelineEntry.create({ data: t })
    }
  }
  console.log('✅ Timeline entries upserted:', timelineData.length)

  // 3. Technical Skills Matrix Seeding (Upsert)
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
    { title: 'FastAPI', category: 'BACKEND' as const, logoUrl: 'https://img.icons8.com/color/512/fastapi.png', order: 11 },
    { title: 'Golang', category: 'BACKEND' as const, logoUrl: 'https://img.icons8.com/color/512/golang.png', order: 12 },

    // DATABASE & ORM
    { title: 'PostgreSQL', category: 'DATABASE_ORM' as const, logoUrl: 'https://img.icons8.com/color/512/postgreesql.png', order: 13 },
    { title: 'MySQL', category: 'DATABASE_ORM' as const, logoUrl: 'https://img.icons8.com/color/512/mysql-logo.png', order: 14 },
    { title: 'Prisma ORM', category: 'DATABASE_ORM' as const, logoUrl: 'https://github.com/prisma/presskit/raw/main/Assets/Prisma-LightLogo.png', order: 15 },
    { title: 'Redis', category: 'DATABASE_ORM' as const, logoUrl: 'https://img.icons8.com/color/512/redis.png', order: 16 },

    // OTHER LANGUAGES
    { title: 'Python', category: 'BAHASA_LAINNYA' as const, logoUrl: 'https://img.icons8.com/color/512/python--v1.png', order: 17 },
    { title: 'PHP', category: 'BAHASA_LAINNYA' as const, logoUrl: 'https://img.icons8.com/color/512/php.png', order: 18 },
    { title: 'Java', category: 'BAHASA_LAINNYA' as const, logoUrl: 'https://img.icons8.com/color/512/java-coffee-cup-logo--v1.png', order: 19 },

    // CLOUD & DEVOPS
    { title: 'Docker', category: 'CLOUD_DEPLOYMENT' as const, logoUrl: 'https://img.icons8.com/color/512/docker.png', order: 20 },
    { title: 'Git & GitHub', category: 'VERSION_CONTROL' as const, logoUrl: 'https://img.icons8.com/color/512/git.png', order: 21 },

    // DESIGN & PROTOTYPING
    { title: 'Figma', category: 'DESIGN_PROTOTYPING' as const, logoUrl: 'https://img.icons8.com/color/512/figma--v1.png', order: 22 },

    // OPERATING SYSTEMS
    { title: 'Linux Ubuntu', category: 'SISTEM_OPERASI' as const, logoUrl: 'https://img.icons8.com/color/512/ubuntu--v1.png', order: 23 },
    { title: 'Linux Mint', category: 'SISTEM_OPERASI' as const, logoUrl: 'https://img.icons8.com/color/512/linux-mint.png', order: 24 },
    { title: 'Linux Debian', category: 'SISTEM_OPERASI' as const, logoUrl: 'https://img.icons8.com/color/512/debian.png', order: 25 },
  ]
  const createdSkills: any[] = []
  for (const s of skillsData) {
    const existingSkill = await prisma.skill.findFirst({
      where: { title: s.title }
    })
    const savedSkill = existingSkill
      ? await prisma.skill.update({
          where: { id: existingSkill.id },
          data: s
        })
      : await prisma.skill.create({
          data: s
        })
    createdSkills.push(savedSkill)
  }
  console.log('✅ Skills upserted:', createdSkills.length)

  // 4. Projects Seeding (19 Repositories from GitHub - Upsert)
  const projectsData = [
  {
    "slug": "profile-portofoliov1",
    "githubId": 1131509501,
    "githubFullName": "muhammadarkanmariadi-debug/profile-portofoliov1",
    "title": "4RK4N.DEV Portfolio",
    "category": "Digital Portfolio & Headless CMS",
    "description": "Awwwards-grade digital portfolio and Headless CMS featuring 3D WebGL physics, kinetic typography, Redis caching, and automated GitHub repository synchronization.",
    "role": "Full-Stack Software Engineer & Creative Developer",
    "isDeploy": true,
    "liveUrl": "https://4rkan.dev",
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/profile-portofoliov1",
    "imageUrl": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
    "order": 1,
    "readmeContent": "# 4RK4N.DEV — Creative Developer Portfolio & Headless CMS\n\nAwwwards-grade digital portfolio and CMS engine built with Next.js 16, React 19, Three.js, GSAP 3, and PostgreSQL.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-09-04T13:17:32Z",
    "syncSource": "github",
    "skills": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma ORM",
      "Docker",
      "Git & GitHub"
    ]
  },
  {
    "slug": "Mexpo",
    "githubId": 1327475464,
    "githubFullName": "muhammadarkanmariadi-debug/backup-mexpo",
    "title": "Mexpo Event Management",
    "category": "Web App & Live Infrastructure",
    "description": "High-concurrency event management, digital ticketing, and visitor registration system with sub-50ms QR validation engineered for the live Expo-Expose showcase at Surabaya Grand City.",
    "role": "Lead Backend Engineer & Real-Time API Architecture",
    "isDeploy": true,
    "liveUrl": "https://mexpo.id",
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/backup-mexpo",
    "imageUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",
    "order": 2,
    "readmeContent": "# Mexpo — High-Concurrency Event Management Platform\n\nHigh-performance event registration and QR ticket validation system deployed live at Surabaya Grand City.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-09-01T13:04:32Z",
    "syncSource": "github",
    "skills": [
      "Next.js",
      "Nest.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma ORM",
      "Tailwind CSS",
      "Docker"
    ]
  },
  {
    "slug": "senarai-kik",
    "githubId": 1339102401,
    "githubFullName": "muhammadarkanmariadi-debug/senarai-kik",
    "title": "Senarai KIK — National SMK Product Catalog",
    "category": "Government Enterprise & National Credential Platform",
    "description": "National product catalog and digital credential verification platform for SMK entrepreneurship coursework across Indonesia (Direktorat SMK). Features multi-tier school validation, verifiable digital credentials (OpenBadge 2.0 + signed certificates), Next.js 16 App Router, Prisma 7, Auth.js v5, Redis cache-aside invalidation, and Gemini AI assistant.",
    "role": "Lead Full-Stack Developer & Platform Architect",
    "isDeploy": true,
    "liveUrl": "https://senarai.ditpsmk.net/",
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/senarai-kik",
    "imageUrl": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80",
    "order": 3,
    "readmeContent": "# Senarai KIK — National SMK Product Catalog\n\nNational product catalog platform for SMK entrepreneurship coursework across Indonesia with verifiable OpenBadge 2.0 digital credentials.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-09-04T00:00:00Z",
    "syncSource": "github",
    "skills": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma ORM",
      "Redis",
      "Docker",
      "Git & GitHub"
    ]
  },
  {
    "slug": "jhic-2-0",
    "githubId": 1339102402,
    "githubFullName": "muhammadarkanmariadi-debug/jhic-2.0",
    "title": "Moklet Nexa — School Web Portal (JHIC 2.0)",
    "category": "School Web Portal & Enterprise Information System",
    "description": "Rebuild of the official web portal and centralized academic information system for SMK Telkom Malang built for the Jagoan Hosting Infra Competition (JHIC 2.0), featuring high-availability container orchestration, dynamic campus CMS, and sub-second page performance.",
    "role": "Full-Stack Developer & Cloud Architect",
    "isDeploy": true,
    "liveUrl": "https://jhic.balzz.dev/",
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/jhic-2.0",
    "imageUrl": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
    "order": 4,
    "readmeContent": "# Moklet Nexa — School Information Portal (JHIC 2.0)\n\nHigh-availability next-generation school information portal and campus CMS engine built with Next.js 16 and Docker.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-09-04T00:00:00Z",
    "syncSource": "github",
    "skills": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
      "Prisma ORM",
      "Docker",
      "Git & GitHub"
    ]
  },
  {
    "slug": "hwalock-ai",
    "githubId": 1324704073,
    "githubFullName": "muhammadarkanmariadi-debug/HwaLock-AI",
    "title": "HwaLock AI",
    "category": "AI Telemetry & Workplace Mental Health",
    "description": "AI-driven passive psychological telemetry and workplace wellness monitoring system combining a Chrome Extension (Vite/CRXJS), Next.js dashboard, and Flutter mobile application.",
    "role": "Full-Stack Architect & Signal Escalation Engine",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/HwaLock-AI",
    "imageUrl": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80",
    "order": 5,
    "readmeContent": "# HwaLock AI — Passive Psychological Telemetry System\n\nMonorepo combining Chrome Extension, Next.js web dashboard, and Flutter mobile client for workplace wellness monitoring.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-08-11T07:35:53Z",
    "syncSource": "github",
    "skills": [
      "Next.js",
      "React",
      "TypeScript",
      "Flutter",
      "PostgreSQL",
      "Prisma ORM",
      "Node.js"
    ]
  },
  {
    "slug": "muhammadarkanmariadi-debug",
    "githubId": 1321081034,
    "githubFullName": "muhammadarkanmariadi-debug/muhammadarkanmariadi-debug",
    "title": "Developer Profile & Actions",
    "category": "Developer Telemetry & Automation",
    "description": "Automated GitHub developer profile telemetry with real-time stats aggregation, dynamic snake animation, and interactive game banner.",
    "role": "DevOps & Profile Automation",
    "isDeploy": true,
    "liveUrl": "https://github.com/muhammadarkanmariadi-debug",
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/muhammadarkanmariadi-debug",
    "imageUrl": "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=1200&auto=format&fit=crop&q=80",
    "order": 6,
    "readmeContent": "# Developer Profile & GitHub Telemetry Automation\n\nDynamic profile aggregation with automated GitHub Actions workflows and stats visualization.\n",
    "primaryLanguage": "HTML",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-09-04T02:37:41Z",
    "syncSource": "github",
    "skills": [
      "Git & GitHub"
    ]
  },
  {
    "slug": "jhic-1-0",
    "githubId": 1169655521,
    "githubFullName": "muhammadarkanmariadi-debug/jhic-1.0",
    "title": "JHIC Cloud Infrastructure",
    "category": "Cloud Infrastructure & High Availability",
    "description": "Cloud server infrastructure architecture, containerized deployment, and high-availability load balancing built for Jagoan Hosting Infra Competition (JHIC).",
    "role": "DevOps & Cloud Infrastructure Engineer",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/jhic-1.0",
    "imageUrl": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    "order": 7,
    "readmeContent": "# JHIC 1.0 — High Availability Cloud Infrastructure\n\nContainerized multi-server web architecture with Nginx reverse proxy and Docker Compose.\n",
    "primaryLanguage": "JavaScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-07-27T02:04:05Z",
    "syncSource": "github",
    "skills": [
      "Docker",
      "Linux Ubuntu",
      "PostgreSQL",
      "Git & GitHub"
    ]
  },
  {
    "slug": "inventra-manajemen-inventaris-umkm-monorepo",
    "githubId": 1225697349,
    "githubFullName": "muhammadarkanmariadi-debug/inventra-manajemen-inventaris-umkm-monorepo",
    "title": "Inventra Enterprise ERP",
    "category": "Enterprise ERP & AI Stock Forecasting",
    "description": "Enterprise warehouse and multi-tenant inventory ERP platform featuring AI-powered stock forecasting (Facebook Prophet), batch tracking, and automated delivery document generation.",
    "role": "Lead Full-Stack Architect & AI Forecasting Lead",
    "isDeploy": false,
    "liveUrl": "https://inventra.4rkan.dev",
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/inventra-manajemen-inventaris-umkm-monorepo",
    "imageUrl": "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1200&auto=format&fit=crop&q=80",
    "order": 8,
    "readmeContent": "# Inventra — Enterprise Inventory ERP & AI Stock Forecasting\n\nMulti-tenant warehouse management system with Facebook Prophet AI demand projection and Laravel 12 backend.\n",
    "primaryLanguage": "PHP",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-07-27T01:52:19Z",
    "syncSource": "github",
    "skills": [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Laravel",
      "FastAPI",
      "Python",
      "PHP",
      "MySQL",
      "Redis",
      "Docker",
      "Git & GitHub"
    ]
  },
  {
    "slug": "hijauin-platform-manajemen-sampah",
    "githubId": 1302257908,
    "githubFullName": "muhammadarkanmariadi-debug/hijauin-platform-manajemen-sampah",
    "title": "Hijauin Waste Logistics",
    "category": "Sustainability & Circular Economy Portal",
    "description": "Circular economy and waste logistics platform connecting eco-conscious households with neighborhood waste collector banks with reward points.",
    "role": "Full-Stack Developer & Logistics Dispatch Routing",
    "isDeploy": false,
    "liveUrl": "https://hijauin.app",
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/hijauin-platform-manajemen-sampah",
    "imageUrl": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
    "order": 9,
    "readmeContent": "# Hijauin — Circular Economy & Waste Logistics Portal\n\nDigital logistics platform connecting households with waste collector banks and community recycling incentives.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-07-26T13:47:37Z",
    "syncSource": "github",
    "skills": [
      "Next.js",
      "React",
      "Laravel",
      "PHP",
      "Tailwind CSS",
      "MySQL",
      "TypeScript",
      "Git & GitHub"
    ]
  },
  {
    "slug": "rewear-id-frontend-dev",
    "githubId": 1253517413,
    "githubFullName": "muhammadarkanmariadi-debug/rewear.id-frontend-dev",
    "title": "rewear.id Frontend",
    "category": "Next.js 16 Web Application",
    "description": "Monochrome-styled aesthetic e-commerce interface built with Next.js 16, React 19, and Tailwind CSS v4 for fashion preloved transactions.",
    "role": "Frontend Architect & UI Developer",
    "isDeploy": true,
    "liveUrl": "https://rewear.id",
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/rewear.id-frontend-dev",
    "imageUrl": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80",
    "order": 10,
    "readmeContent": "# rewear.id — Modern Preloved Marketplace Frontend\n\nHigh-performance C2C preloved marketplace frontend with instant checkout flows and responsive product catalogs.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-06-03T07:29:16Z",
    "syncSource": "github",
    "skills": [
      "Next.js",
      "React",
      "Tailwind CSS",
      "TypeScript"
    ]
  },
  {
    "slug": "rewear-id-c2c-marketplace-monorepo",
    "githubId": 1312693888,
    "githubFullName": "muhammadarkanmariadi-debug/rewear.id-c2c-marketplace-monorepo",
    "title": "rewear.id Marketplace",
    "category": "E-Commerce & Escrow State Engine",
    "description": "Peer-to-peer sustainable preloved fashion marketplace incorporating an escrow state-machine payment layer, automated courier shipping calculation, and verified merchant verification.",
    "role": "Lead Full-Stack Developer & Escrow Architecture",
    "isDeploy": true,
    "liveUrl": "https://rewear.id",
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/rewear.id-c2c-marketplace-monorepo",
    "imageUrl": "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=1200&auto=format&fit=crop&q=80",
    "order": 11,
    "readmeContent": "# Rewear.id — C2C Marketplace & Escrow Engine Monorepo\n\nDecoupled full-stack architecture with Next.js 16 frontend and Laravel 13 backend featuring secure middleman escrow transactions.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-07-26T10:17:14Z",
    "syncSource": "github",
    "skills": [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Laravel",
      "PostgreSQL",
      "TypeScript"
    ]
  },
  {
    "slug": "final-assesment-dicoding",
    "githubId": 1312605185,
    "githubFullName": "muhammadarkanmariadi-debug/final-assesment-dicoding",
    "title": "Bookshelf & Note Manager",
    "category": "Interactive Web Application",
    "description": "Interactive web application showcasing modern DOM manipulation, structured Web Storage data handling, and accessible UI layout.",
    "role": "Frontend Developer",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/final-assesment-dicoding",
    "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    "order": 12,
    "readmeContent": "# Bookshelf Web Application\n\nInteractive book catalog and reading tracker utilizing the HTML5 Web Storage API.\n",
    "primaryLanguage": "JavaScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-07-26T07:51:27Z",
    "syncSource": "github",
    "skills": [
      "JavaScript",
      "Bootstrap"
    ]
  },
  {
    "slug": "expense-tracker-starter-dicoding",
    "githubId": 1312602366,
    "githubFullName": "muhammadarkanmariadi-debug/expense-tracker-starter-dicoding",
    "title": "Expense Tracker App",
    "category": "Personal Financial Analytics Tool",
    "description": "Interactive personal financial ledger application for tracking recurring expenditures and budget allocations with local data persistence.",
    "role": "Frontend JavaScript Developer",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/expense-tracker-starter-dicoding",
    "imageUrl": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80",
    "order": 13,
    "readmeContent": "# Expense Tracker Application\n\nPersonal finance ledger and budget management application with dynamic chart calculations.\n",
    "primaryLanguage": "CSS",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-07-26T07:47:17Z",
    "syncSource": "github",
    "skills": [
      "JavaScript",
      "Bootstrap"
    ]
  },
  {
    "slug": "movecycle-frontend",
    "githubId": 1305282811,
    "githubFullName": "muhammadarkanmariadi-debug/movecycle-frontend",
    "title": "MoveCycle Bike Sharing",
    "category": "Urban Mobility & Bike Sharing",
    "description": "Urban mobility and modern bike rental web application with interactive geolocation station mapping and reservation workflows.",
    "role": "Frontend Developer & UI/UX Design",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/movecycle-frontend",
    "imageUrl": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&auto=format&fit=crop&q=80",
    "order": 14,
    "readmeContent": "# MoveCycle — Urban Mobility Web Application\n\nBike sharing and smart mobility platform interface built with Next.js and Tailwind CSS.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-07-18T23:16:45Z",
    "syncSource": "github",
    "skills": [
      "React",
      "Next.js",
      "Tailwind CSS",
      "TypeScript"
    ]
  },
  {
    "slug": "try-to-port-coolest-mod",
    "githubId": 1274845268,
    "githubFullName": "muhammadarkanmariadi-debug/try-to-port-coolest-mod",
    "title": "Super Sentai Craft: Minecraft 1.21.1 Port",
    "category": "Game Engine Architecture & Java Bytecode Porting",
    "description": "Comprehensive version porting of the renowned Super Sentai Craft Minecraft modification from legacy version 1.12.2 to modern 1.21.1, architected with Java, Gradle MDK toolchain, and NeoForged/Forge modding lifecycle APIs.",
    "role": "Lead Java Modding & Game Engine Porting Engineer",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/try-to-port-coolest-mod",
    "imageUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    "order": 15,
    "readmeContent": "# Super Sentai Craft — Minecraft 1.21.1 Version Port\n\nArchitectural modernization and bytecode migration of complex Minecraft mods to modern 1.21.1 NeoForged APIs.\n",
    "primaryLanguage": "Java",
    "starsCount": 0,
    "isFork": true,
    "isArchived": false,
    "pushedAt": "2026-06-30T13:54:24Z",
    "syncSource": "github",
    "skills": [
      "Java",
      "Git & GitHub"
    ]
  },
  {
    "slug": "secret",
    "githubId": 1217634743,
    "githubFullName": "muhammadarkanmariadi-debug/secret",
    "title": "English Discovery Automation Bot",
    "category": "Task Automation & Headless Node.js Bot",
    "description": "Automated educational assignment and task completion bot built purely on vanilla Node.js to streamline English Discovery coursework workflows with custom HTTP request orchestration and session handling.",
    "role": "Automation Engineer & Backend Developer",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/secret",
    "imageUrl": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80",
    "order": 16,
    "readmeContent": "# English Discovery Task Automation Bot\n\nZero-dependency Node.js automation bot for streamlined educational module workflows and session management.\n",
    "primaryLanguage": "JavaScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-06-23T08:57:05Z",
    "syncSource": "github",
    "skills": [
      "JavaScript",
      "Node.js",
      "Git & GitHub"
    ]
  },
  {
    "slug": "analisa-data",
    "githubId": 1259886526,
    "githubFullName": "muhammadarkanmariadi-debug/analisa-data",
    "title": "E-Commerce Data Analytics Pipeline",
    "category": "Data Science & RFM Analytics",
    "description": "End-to-end Python exploratory data analysis (EDA) pipeline evaluating e-commerce transaction trends, RFM customer segmentation, correlation matrices, and predictive inventory demand.",
    "role": "Data Scientist & Python Developer",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/analisa-data",
    "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    "order": 17,
    "readmeContent": "# E-Commerce Data Analytics & RFM Segmentation\n\nPython exploratory data analysis pipeline investigating sales patterns, user cohorts, and RFM behavioral clusters.\n",
    "primaryLanguage": "Python",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-06-05T00:48:36Z",
    "syncSource": "github",
    "skills": [
      "Python",
      "Git & GitHub"
    ]
  },
  {
    "slug": "native-php",
    "githubId": 1197944213,
    "githubFullName": "muhammadarkanmariadi-debug/native-php",
    "title": "Native PHP MVC Engine",
    "category": "Native Web Engine & MVC Framework",
    "description": "Lightweight native PHP Model-View-Controller (MVC) architecture with database abstraction, session security, and clean routing.",
    "role": "PHP Full-Stack Developer",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/native-php",
    "imageUrl": "https://images.unsplash.com/photo-1599507593499-a3f7f7d9a2cc?w=1200&auto=format&fit=crop&q=80",
    "order": 18,
    "readmeContent": "# Native PHP MVC Framework\n\nModular object-oriented PHP architecture built without heavyweight third-party dependencies.\n",
    "primaryLanguage": "PHP",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-04-01T02:15:20Z",
    "syncSource": "github",
    "skills": [
      "PHP",
      "MySQL",
      "Git & GitHub"
    ]
  },
  {
    "slug": "nestjs-ukl-2025-manajemen-matakuliah-backend",
    "githubId": 1108986472,
    "githubFullName": "muhammadarkanmariadi-debug/nestjs-ukl-2025-manajemen-matakuliah-backend",
    "title": "Course Management API",
    "category": "Academic Curriculum Management API",
    "description": "Robust academic course and curriculum management REST API built with Nest.js, TypeScript, PostgreSQL, and Prisma ORM.",
    "role": "Backend REST API Engineer",
    "isDeploy": false,
    "liveUrl": null,
    "sourceCodeUrl": "https://github.com/muhammadarkanmariadi-debug/nestjs-ukl-2025-manajemen-matakuliah-backend",
    "imageUrl": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
    "order": 19,
    "readmeContent": "# Academic Management System — Backend API\n\nEnterprise academic course and semester schedule REST API engineered with Nest.js, TypeScript, and Prisma ORM.\n",
    "primaryLanguage": "TypeScript",
    "starsCount": 0,
    "isFork": false,
    "isArchived": false,
    "pushedAt": "2026-03-01T02:00:37Z",
    "syncSource": "github",
    "skills": [
      "Nest.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma ORM"
    ]
  }
]

  for (const p of projectsData) {
    const { skills, ...projectFields } = p;
    const connectIds = (skills || [])
      .map((name: string) => createdSkills.find(s => s.title.toLowerCase() === name.toLowerCase())?.id)
      .filter(Boolean);

    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        ...projectFields,
        pushedAt: projectFields.pushedAt ? new Date(projectFields.pushedAt) : null,
        techStack: {
          set: connectIds.map((id: string) => ({ id }))
        }
      },
      create: {
        ...projectFields,
        pushedAt: projectFields.pushedAt ? new Date(projectFields.pushedAt) : null,
        techStack: {
          connect: connectIds.map((id: string) => ({ id }))
        }
      }
    })
  }
  console.log('✅ Projects upserted from GitHub:', projectsData.length)

  // 5. Achievements & Certifications Seeding (Upsert)
  const achievementsData = [
    {
      slug: "fobn-gold-medalist-english",
      title: "National Language Olympiad Festival (FOBN)",
      status: "National Gold Medalist",
      description: "National Gold Medalist in English Olympiad organized by Prisma Cendekia Foundation (No. 0350264-AN.FOBN.PCF.II.2024) for exceptional grammatical mastery, reading comprehension, and linguistic reasoning nationwide.",
      date: new Date("2024-02-25T00:00:00.000Z"),
      imageUrl: "/certificates/0350264-an-fobn-pcf-ii-2024-muhammad-arkan-mariadi.jpg",
      order: 1
    },
    {
      slug: "oisn2-silver-medalist-english",
      title: "National Social Science Olympiad II (OISN II)",
      status: "National Silver Medalist",
      description: "National Silver Medalist in English language proficiency organized by Prisma Cendekia Foundation (No. 0340168-AN.OISN2.PCF.II.2024) competing with top student delegates across Indonesia.",
      date: new Date("2024-02-04T00:00:00.000Z"),
      imageUrl: "/certificates/0340168-an-oisn2-pcf-ii-2024-muhammad-arkan-mariadi.jpg",
      order: 2
    },
    {
      slug: "oisn2-participant-english",
      title: "National Social Science Olympiad II — Delegate",
      status: "National Participant",
      description: "Official Certificate of Participation (No. 1736-SPTN.OISN2.PCF.II.2024) representing MTs Khadijah Malang as a National Contestant in the National Social Science Olympiad II (English field).",
      date: new Date("2024-02-04T00:00:00.000Z"),
      imageUrl: "/certificates/1736-sptn-oisn2-pcf-ii-2024-muhammad-arkan-mariadi.jpg",
      order: 3
    },
    {
      slug: "jhic-2025-semi-finalist",
      title: "Jagoan Hosting Infra Competition (JHIC 2025)",
      status: "National Semi-Finalist",
      description: "National Semi-Finalist in high-availability cloud infrastructure design, Docker container orchestration, Nginx load balancing, and server performance optimization supported by KOMDIGI & Garuda Spark.",
      date: new Date("2025-11-21T00:00:00.000Z"),
      imageUrl: "/certificates/80jt4mcd-767ba5d9-b1e1-4779-81b3-83d36d39a2be.jpg",
      order: 4
    },
    {
      slug: "bionix-ise-2025-participant",
      title: "BIONIX Competition — Information Systems Expo 2025",
      status: "National Competition Participant",
      description: "National business and IT olympiad participant (Cert No. 13413/IT2.IX.5.1.5/B/DL.07.00/X/2025) organized by Information Systems Department, Institut Teknologi Sepuluh Nopember (ITS Surabaya).",
      date: new Date("2025-09-28T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-bionix-muhammad-arkan-mariadi.jpg",
      order: 5
    },
    {
      slug: "is-class-ise-2025",
      title: "IS Class — Information Systems Expo 2025",
      status: "Masterclass Participant",
      description: "Completed advanced information systems masterclass (Cert No. 13083/IT2.IX.5.1.5/B/DL.07.00/VIII/2025) covering enterprise architecture, digital product engineering, and data analytics by ITS Surabaya.",
      date: new Date("2025-08-31T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-is-class-muhammad-arkan-mariadi.jpg",
      order: 6
    },
    {
      slug: "claude-code-101-anthropic",
      title: "Claude Code 101",
      status: "Certificate of Completion",
      description: "Certified proficiency in agentic software engineering workflows, terminal LLM tooling, automated test-driven development, and autonomous codebase refactoring directly from Anthropic Education.",
      date: new Date("2026-07-25T00:00:00.000Z"),
      imageUrl: "/certificates/certificate-vc5gpn626ypu-1785041535.jpg",
      order: 7
    },
    {
      slug: "claude-101-anthropic",
      title: "Claude 101",
      status: "Certificate of Completion",
      description: "Certified mastery in Anthropic's Claude foundational architecture, large-context reasoning, system prompts design, and multi-turn conversational AI workflows from Anthropic Education.",
      date: new Date("2026-07-25T00:00:00.000Z"),
      imageUrl: "/certificates/certificate-hn4t6tv794pw-1785041152.jpg",
      order: 8
    },
    {
      slug: "aws-s3-essentials-beyond-basics",
      title: "Amazon S3 Essentials — Beyond the Basics",
      status: "AWS Certified Completion",
      description: "Official AWS Training & Certification in enterprise object storage architecture, S3 lifecycle rules, cross-region replication (CRR), KMS encryption, bucket policies, and high-throughput transfer acceleration.",
      date: new Date("2026-02-02T00:00:00.000Z"),
      imageUrl: "/certificates/4fd60545-586d-46b0-aec7-07f1e67f2918.jpg",
      order: 9
    },
    {
      slug: "aws-introduction-database-migration",
      title: "Introduction to Database Migration",
      status: "AWS Certified Completion",
      description: "Official AWS Training & Certification covering database migration methodologies, AWS Database Migration Service (AWS DMS), Schema Conversion Tool (SCT), and zero-downtime database replication strategies.",
      date: new Date("2026-01-22T00:00:00.000Z"),
      imageUrl: "/certificates/c31b659e-5834-4804-a3c3-b4b73dd41eb7.jpg",
      order: 10
    },
    {
      slug: "hackerrank-problem-solving-basic",
      title: "Problem Solving (Basic)",
      status: "HackerRank Verified Skill",
      description: "HackerRank Skill Certification (ID: DCAB1ACEFBEF) validating algorithmic problem-solving capabilities, data structure manipulations, Big-O complexity analysis, and efficient sorting implementations.",
      date: new Date("2026-07-31T00:00:00.000Z"),
      imageUrl: "/certificates/problem-solving-basic-certificate.jpg",
      order: 11
    },
    {
      slug: "hackerrank-rest-api-intermediate",
      title: "REST API (Intermediate)",
      status: "HackerRank Verified Skill",
      description: "HackerRank Skill Certification (ID: 8B387A668B3D) validating intermediate RESTful API architecture, paginated HTTP integrations, resilient query parsing, and asynchronous payload transformation.",
      date: new Date("2026-08-02T00:00:00.000Z"),
      imageUrl: "/certificates/rest-api-intermediate-certificate.jpg",
      order: 12
    },
    {
      slug: "hackerrank-sql-intermediate",
      title: "SQL (Intermediate)",
      status: "HackerRank Verified Skill",
      description: "HackerRank Skill Certification (ID: 4B7794C77DC8) validating advanced relational database querying, complex multi-table joins, nested subqueries, conditional CASE logic, and query optimization.",
      date: new Date("2026-08-02T00:00:00.000Z"),
      imageUrl: "/certificates/sql-intermediate-certificate.jpg",
      order: 13
    },
    {
      slug: "hackerrank-sql-basic",
      title: "SQL (Basic)",
      status: "HackerRank Verified Skill",
      description: "HackerRank Skill Certification (ID: 892CB0F04199) validating relational database querying fundamentals, filtering operators (WHERE, LIKE, IN), grouping (GROUP BY, HAVING), and aggregation functions.",
      date: new Date("2026-08-02T00:00:00.000Z"),
      imageUrl: "/certificates/sql-basic-certificate.jpg",
      order: 14
    },
    {
      slug: "dicoding-spec-driven-development-kiro",
      title: "Spec-Driven Development with Kiro",
      status: "Certificate of Completion",
      description: "Dicoding Academy Certification (ID: EYX4QDVV6PDL) in Spec-Driven Development (SDD), structured requirements design, professional AI-assisted engineering workflows with Kiro, and architectural clean code.",
      date: new Date("2026-07-28T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-course-929-4647483-300726210859.jpg",
      order: 15
    },
    {
      slug: "dicoding-cloud-genai-aws",
      title: "Cloud Fundamentals and Gen AI on AWS",
      status: "Certificate of Completion",
      description: "Dicoding Academy & AWS Certification (ID: MRZMW2EEKPYQ) covering AWS Global Infrastructure, core cloud computing services (EC2, Lambda, S3), and foundational generative AI solutions on AWS.",
      date: new Date("2026-07-30T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-course-251-4647483-300726210740.jpg",
      order: 16
    },
    {
      slug: "dicoding-javascript-programming",
      title: "Basic JavaScript Programming",
      status: "Certificate of Completion",
      description: "Comprehensive 46-hour Dicoding Academy & AWS Certification (ID: 72ZDJ1GDJZYW) in modern JavaScript ES6+, data structures (Map/Set), OOP & functional paradigms, and asynchronous programming (Promises/async-await).",
      date: new Date("2026-07-26T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-course-256-4647483-260726112400.jpg",
      order: 17
    },
    {
      slug: "dicoding-frontend-web-beginner",
      title: "Front-End Web Development for Beginners",
      status: "Certificate of Completion",
      description: "45-hour Dicoding Academy Certification (ID: JMZVO662OXN9) in client-side engineering: dynamic DOM manipulation, browser event handling, and client-side storage persistence with Web Storage API.",
      date: new Date("2026-07-26T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-course-315-4647483-260726152008.jpg",
      order: 18
    },
    {
      slug: "dicoding-web-programming-basics",
      title: "Basic Web Programming",
      status: "Certificate of Completion",
      description: "41-hour Dicoding Academy Certification (ID: N9ZONW8Y8XG5) in foundational web standards: semantic HTML5 structures, modern CSS layouting (Flexbox & CSS Grid), and responsive layout engineering.",
      date: new Date("2026-07-26T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-course-123-4647483-260726082414.jpg",
      order: 19
    },
    {
      slug: "dicoding-financial-literacy",
      title: "Introduction to Financial Literacy",
      status: "Certificate of Completion",
      description: "Financial Literacy Certification (ID: MEPJO4796Z3V) from Coding Camp powered by DBS Foundation & Dicoding, covering digital money management, future investments, and smart borrowing strategies.",
      date: new Date("2026-07-26T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-course-905-4647483-260726082500.jpg",
      order: 20
    },
    {
      slug: "smk-telkom-cybersecurity-distinction",
      title: "Cyber Security Awareness Training — Passed with Distinction",
      status: "Passed with Distinction",
      description: "Graduated with top honors ('Sangat Baik') in Cyber Security Awareness training by SMK Telkom Malang, Telkom Schools, and Telkom Indonesia (BUMN), demonstrating excellence in network security and threat defense.",
      date: new Date("2024-06-19T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-kelulusan-pelatihan-cyber-security-smk-telkom-malang.jpg",
      order: 21
    },
    {
      slug: "smk-telkom-cybersecurity-attendance",
      title: "Cyber Security Awareness Training — Attendance",
      status: "Certificate of Attendance",
      description: "Official Certificate of Attendance for participating in 'Membangun Kesadaran Siber: Keamanan Digital untuk Generasi Masa Depan' organized by Telkom Education Foundation & Telkom Indonesia.",
      date: new Date("2024-06-19T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-attendance-pelatihan-cyber-security.jpg",
      order: 22
    },
    {
      slug: "amd-classroom-talkshow",
      title: "AMD Classroom Talkshow",
      status: "Talkshow Participant",
      description: "Certificate of Participation in AMD Classroom Talkshow hosted by AMD Indonesia and SMK Telkom Malang, exploring high-performance processing hardware, Ryzen AI acceleration, and silicon innovation.",
      date: new Date("2024-09-27T00:00:00.000Z"),
      imageUrl: "/certificates/sertifikat-smk-telkom-malang-muhammad-arkan-mariadi.jpg",
      order: 23
    },
  ]
  for (const a of achievementsData) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: a,
      create: a
    })
  }
  console.log('✅ Achievements upserted with slugs & badges:', achievementsData.length)

  console.log('🎉 Standardized English database seeded successfully with upsert!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
