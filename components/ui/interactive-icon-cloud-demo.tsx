"use client"

import { IconCloud } from "@/components/ui/interactive-icon-cloud"

const slugs = [
  "nextdotjs",
  "react",
  "typescript",
  "javascript",
  "tailwindcss",
  "flutter",
  "bootstrap",
  "html5",
  "css3",
  "nestjs",
  "laravel",
  "nodedotjs",
  "express",
  "fastapi",
  "go",
  "php",
  "python",
  "openjdk",
  "postgresql",
  "mysql",
  "mariadb",
  "prisma",
  "redis",
  "docker",
  "git",
  "github",
  "postman",
  "amazonaws",
  "linux",
  "ubuntu",
  "debian",
  "linuxmint",
  "figma",
  "visualstudiocode",
  "threedotjs",
  "greensock"
]

export function IconCloudDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg border bg-background px-20 pb-20 pt-8">
      <IconCloud iconSlugs={slugs} />
    </div>
  )
}
