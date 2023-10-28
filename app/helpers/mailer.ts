import prismadb from "@/lib/prismadb";

import nodemailer from "nodemailer";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    const user = await prismadb.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    let date = Date.now() + 3600000;

    if (emailType === "VERIFY") {
      const newUser = await prismadb.user.update({
        where: {
          id: userId,
        },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: date.toString(),
        },
      });
    } else if (emailType === "RESET") {
      const newUser = await prismadb.user.update({
        where: {
          id: userId,
        },
        data: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: date.toString(),
        },
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "omkar@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.domain}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
