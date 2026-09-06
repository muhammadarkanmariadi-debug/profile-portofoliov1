import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: validatedData,
    });

    // Send email notification if env vars are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, // Send to self
          subject: `New Contact Message from ${validatedData.name}`,
          text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\n\nMessage:\n${validatedData.message}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h3 style="color: #6C63FF;">New Contact Message from Portfolio</h3>
              <p><strong>Name:</strong> ${validatedData.name}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${validatedData.message}</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Nodemailer notification error (Message still saved to database):", emailErr);
      }
    }

    return NextResponse.json({ success: true, data: contactMessage }, { status: 201 });
  } catch (error: any) {
    console.error("Contact API error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
