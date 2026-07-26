import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load env
dotenv.config({ path: '.env.local' });
dotenv.config();

// Ensure keys exist
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Missing Cloudinary keys in .env.local");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const certFiles = [
  "0340168-AN.OISN2.PCF.II.2024 MUHAMMAD ARKAN MARIADI.pdf",
  "0350264-AN.FOBN.PCF.II.2024 MUHAMMAD ARKAN MARIADI .pdf",
  "1736-SPTN.OISN2.PCF.II.2024 MUHAMMAD ARKAN MARIADI.pdf",
  "80jt4mcd-767ba5d9-b1e1-4779-81b3-83d36d39a2be.pdf",
  "SERTIFIKAT SMK TELKOM MALANG-MUHAMMAD ARKAN MARIADI.pdf",
  "Sertifikat Attendance Pelatihan Cyber Security.pdf",
  "Sertifikat Bionix Muhammad Arkan Mariadi.pdf",
  "Sertifikat IS Class_Muhammad Arkan Mariadi.pdf",
  "Sertifikat Kelulusan Pelatihan Cyber Security SMK Telkom Malang.pdf",
  "certificate-hn4t6tv794pw-1785041152.pdf",
  "certificate-vc5gpn626ypu-1785041535.pdf",
  "sertifikat_course_123_4647483_260726082414.pdf",
  "sertifikat_course_256_4647483_260726112400.pdf",
  "sertifikat_course_315_4647483_260726152008.pdf",
  "sertifikat_course_905_4647483_260726082500.pdf"
];

async function main() {
  const inputDir = path.join(process.cwd(), 'certificate');
  const outputDir = path.join(process.cwd(), 'public', 'certificates');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const generatedUrls: Record<string, string> = {};

  for (const file of certFiles) {
    const inputPath = path.join(inputDir, file);
    const parsedName = path.parse(file).name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 40);
    const outputPath = path.join(outputDir, `${parsedName}.jpg`);

    console.log(`Processing: ${file}`);
    try {
      if (fs.existsSync(inputPath)) {
        // Upload to Cloudinary to get JPG preview
        const result = await cloudinary.uploader.upload(inputPath, {
          folder: 'certificates',
          public_id: parsedName,
          format: 'jpg',
          resource_type: 'image',
          flags: 'attachment',
        });

        const cloudinaryUrl = result.secure_url;
        generatedUrls[file] = cloudinaryUrl;

        // Download image back to public/certificates
        const res = await fetch(cloudinaryUrl);
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`Saved screenshot to ${outputPath}`);
      } else {
        console.warn(`File not found: ${inputPath}`);
      }
    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }

  // Write a JSON map of the URLs so I can use it in seed.ts
  fs.writeFileSync('scripts/generated-urls.json', JSON.stringify(generatedUrls, null, 2));
  console.log("Screenshot processing completed. URLs saved to scripts/generated-urls.json");
}

main().catch(console.error);
