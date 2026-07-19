const projects = [
    {
        id: 1,
        title: "Mexpo",
        category: "Platform Manajemen Event",
        role: "Full-Stack Developer",
        description: "Membangun antarmuka frontend yang responsif (Next.js) dan memimpin pengembangan backend (Nest.js). Sistem ini berhasil diluncurkan untuk acara Expo-Expose 2026 di Surabaya Grand City.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        techStack: ["Next.js", "React", "Nest.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
        liveUrl: "#",
        sourceUrl: "#"
    },
    {
        id: 2,
        title: "Inventra",
        category: "Sistem Inventaris Multi-tenant",
        role: "Full-Stack Developer",
        description: "Platform inventaris perusahaan dengan prediksi stok AI (Algoritma Prophet). Fitur yang disediakan meliputi RBAC, pemindaian QR, dan arsitektur decoupled (Next.js, Laravel, FastAPI, Docker).",
        image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        techStack: ["Next.js", "React", "Laravel", "FastAPI", "Python", "Prophet", "Docker"],
        liveUrl: "#",
        sourceUrl: "#"
    },
    {
        id: 3,
        title: "rewear.id",
        category: "Marketplace C2C",
        role: "Full-Stack Developer",
        description: "Marketplace pakaian bekas pakai yang dibangun dalam sprint MVP 3 hari. Memiliki fitur sistem pembayaran rekber (escrow), dasbor penjual (Next.js 16, React 19, Zustand), dan backend Laravel modular.",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        techStack: ["Next.js 16", "React 19", "Tailwind v4", "Zustand", "Laravel", "MySQL"],
        liveUrl: "#",
        sourceUrl: "#"
    },
];



const timelineData = [
    {
        year: '2024 - Sekarang',
        title: 'SMK Telkom Malang',
        description:
            'Rekayasa Perangkat Lunak (Fullstack). Mempelajari dan menerapkan praktik rekayasa perangkat lunak modern.'
    },
    {
        year: 'Organisasi',
        title: 'PIC Studio Musik',
        description:
            'Moklet Art Club (MAC). Bertanggung jawab atas pengelolaan fasilitas, penjadwalan, dan perawatan perlengkapan studio musik.'
    },
    {
        year: 'Event',
        title: 'Sie Perlengkapan & Front of House',
        description:
            'Kepanitiaan MAC A Rhythm. Mengoordinasikan logistik panggung dan memastikan kualitas output audio (FOH) berjalan optimal selama acara.'
    },
    {
        year: 'Event',
        title: 'Sie FOH & Perlengkapan',
        description:
            'Kepanitiaan Ruang Kita. Mengelola perlengkapan teknis dan audio sistem untuk mendukung kelancaran seluruh rangkaian acara.'
    }
]

interface techStack {
    category: string;
    data: { name: string; iconUrl: string; }[];
}

const techStack: techStack[] = [
    {
        category: "Frontend",
        data: [
            {
                name: "React",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg"
            }, {
                name: "Next.js",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg"
            }, {
                name: "Flutter",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"
            }, {
                name: "Tailwind CSS",
                iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9FxiHJarAk6MJ0bNOEEM47rllqHOKiBpsuA&s"
            }, {
                name: "HTML5",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg"
            }, {
                name: "CSS3",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg"
            }, {
                name: "JavaScript",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
            }, {
                name: "TypeScript",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
            }, {
                name: "Bootstrap",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain-wordmark.svg"
            }
        ]
    }, {
        category: "Backend",
        data: [
            {
                name: "Node.js",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original-wordmark.svg"
            }, {
                name: "Express",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg"
            }, {
                name: "Laravel",
                iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Laravel.svg/1969px-Laravel.svg.png"
            }, {
                name: "NestJS",
                iconUrl: "https://upload.wikimedia.org/wikipedia/commons/3/37/NestJS-logo-wordmark.svg"
            }
        ]
    }, {
        category: "Database & Orm",
        data: [
            {
                name: "MySQL",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg"
            }, {
                name: "PostgreSQL",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg"
            }, {
                name: "MongoDB",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original-wordmark.svg"
            },
            {
                name: "Prisma",
                iconUrl: "https://images.icon-icons.com/3914/PNG/512/prisma_logo_icon_248778.png"
            }
        ]
    }, {
        category: "Bahasa Lainnya",
        data: [
            {
                name: "Java",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original-wordmark.svg"
            }, {
                name: "Python",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original-wordmark.svg"
            }
        ]
    }, {
        category: "Version Control",
        data: [
            {
                name: "Git",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original-wordmark.svg"
            }, {
                name: "GitHub",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg"
            }
        ]
    }, {
        category: "Cloud & Deployment",
        data: [
            {
                name: "Aws",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
            }
        ]
    }, {
        category: "Design & Prototyping",
        data: [
            {
                name: "Figma",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
            }
        ]
    }, {
        category: "Sistem Operasi",
        data: [
            {
                name: "Linux Debian",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-plain.svg"
            },
            {
                name: "Linux Ubuntu",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg"
            }, {
                name: "Linux Mint",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linuxmint/linuxmint-original.svg"
            },
            {
                name: "Windows",
                iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg"
            }
        ]
    }
];



export { timelineData, projects, techStack };