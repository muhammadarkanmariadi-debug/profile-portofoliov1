# 🚀 AWS EC2 Deployment Guide — Docker & PostgreSQL

This guide walks you through deploying **`4RK4N.DEV`** on an AWS EC2 instance using Docker Compose with an integrated PostgreSQL database container.

---

## 📋 1. AWS EC2 Prerequisites

### A. Recommended Instance Specs
- **Instance Type:** `t3.small` or `t3.medium` (minimum 2 GB RAM recommended for Next.js build & PostgreSQL).
- **OS:** Ubuntu 22.04 LTS or 24.04 LTS.
- **Storage:** 20 GB+ gp3 EBS Volume.

### B. EC2 Security Group Inbound Rules
Ensure your EC2 Security Group permits the following inbound traffic:
| Type | Port | Source | Purpose |
| :--- | :--- | :--- | :--- |
| **SSH** | `22` | Your IP or `0.0.0.0/0` | SSH Terminal Access |
| **HTTP** | `80` | `0.0.0.0/0` | Web Traffic (or Nginx reverse proxy) |
| **HTTPS** | `443` | `0.0.0.0/0` | SSL Encrypted Traffic |
| **Custom TCP** | `5000` | `0.0.0.0/0` | Direct Next.js Web App Access |

---

## 🐳 2. Install Docker & Docker Compose on EC2 (Ubuntu)

SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

Install Docker and the Docker Compose plugin:
```bash
# Update package index
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group (avoids typing sudo every time)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

---

## 📦 3. Clone Repository & Configure Environment

```bash
# Clone the repository
git clone https://github.com/muhammadarkanmariadi-debug/profile-portofoliov1.git portfolio
cd portfolio

# Copy the docker environment template
cp .env.docker.example .env

# Edit .env with your credentials
nano .env
```

### Fill in your `.env` values:
- `POSTGRES_PASSWORD`: A strong random password for the PostgreSQL container.
- `ADMIN_EMAIL`: Your login email for the admin terminal.
- `ADMIN_PASSWORD_HASH`: Your bcrypt-hashed administrator password.
- `JWT_SECRET`: A 32+ character random string.
- `CLOUDINARY_*`: Your Cloudinary credentials for media uploads.
- `GITHUB_*`: Your GitHub username and Personal Access Token for repository synchronization.

---

## 🚀 4. Launch the Containers

Start both the PostgreSQL database and Next.js web application:

```bash
# Build and run containers in detached mode
docker compose up -d --build
```

### Check Container Status & Logs
```bash
# Check running containers
docker compose ps

# View live application logs
docker compose logs -f app

# View database logs
docker compose logs -f postgres
```

> [!NOTE]
> The container automatically runs `npx prisma db push` on startup through `docker-entrypoint.sh` to ensure all PostgreSQL tables, indexes, and relations are automatically created without manual migration commands.

---

## 🌱 5. (Optional) Seed Initial Database Content

If you want to run the initial Prisma seed script to populate sample projects, skills, and profile data:

```bash
docker compose exec app npx tsx prisma/seed.ts
```

---

## 🔄 6. Updating Application After Git Pushes

Whenever you push new changes to GitHub:

```bash
# Pull latest commits
git pull origin main

# Rebuild and restart app container with zero downtime
docker compose up -d --build app
```

---

## 🌐 7. (Recommended) Setup Nginx Reverse Proxy & Free SSL (Let's Encrypt)

To serve your portfolio on standard port 80/443 with custom domain and HTTPS:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Create Nginx server block
sudo nano /etc/nginx/sites-available/portfolio
```

Paste the following configuration (replace `yourdomain.com` with your actual domain):
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and obtain free SSL:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🛠 Useful Docker Management Commands

| Action | Command |
| :--- | :--- |
| **Start Containers** | `docker compose up -d` |
| **Stop Containers** | `docker compose down` |
| **View Live Logs** | `docker compose logs -f` |
| **Restart App Service** | `docker compose restart app` |
| **Inspect DB via psql** | `docker compose exec postgres psql -U postgres -d profile_db` |
| **Backup DB to SQL** | `docker compose exec -T postgres pg_dump -U postgres profile_db > backup.sql` |
| **Restore DB from SQL** | `cat backup.sql \| docker compose exec -T postgres psql -U postgres profile_db` |
