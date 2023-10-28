import prismadb from "@/lib/prismadb";

import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    const user = await prismadb.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpiry: {
          gte: Date.now().toString(),
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid token",
        },
        { status: 400 }
      );
    }

    const newUser = await prismadb.user.update({
      where: {
        id: user.id,
      },
      data: {
        isAccountVerifiedByEmail: true,
        verifyToken: "",
        verifyTokenExpiry: "",
      },
    });

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
