import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prismadb from "@/lib/prismadb";
import { JWT } from "next-auth/jwt";


export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "text",
          placeholder: "Email here",
        },
        password: {
          label: "Password:",
          type: "text",
          placeholder: "Password here",
        },
      },

      async authorize(credentials) {
        let email = credentials?.email || "";
        let password = credentials?.password || "";
        try {
          const user = await prismadb.user.findFirst({
            where: {
              email: email,
            },
            select: {
              email: true,
              password: true,
              id: true,
              userName: true,
              name: true,
            },
          });

          if (!user) {
            return null;
          }

          //check if password is correct
          const validPassword = await bcryptjs.compare(password, user.password);

          if (!validPassword) {
            return null;
          }

          //create token data
          const userData= {
            id: user.id,
            name: user.name,
            username: user.userName,
            email: user.email,
            role: "  ",
          };

          return userData;
        } catch (error) {
          console.log("ERROR", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
