import prismadb from "@/lib/prismadb";

import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/app/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { name, username, email, password } = reqBody;

    //check if user already exists
    const user = await prismadb.user.findFirst({
      where: {
        email: email,
      },
      select: { email: true },
    });

    if (user) {
      return NextResponse.json(
        { error: "User already Exists" },
        {
          status: 500,
        }
      );
    }

    //hash password

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prismadb.user.create({
      data: {
        userName: username,
        email: email,
        password: hashedPassword,
        name: name,
      },
    });

    await sendEmail({ email, emailType: "VERIFY", userId: newUser.id });
    
    return NextResponse.json(
      { message: "User created Successfully", success: true },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
