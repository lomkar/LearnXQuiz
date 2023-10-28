import NextAuth from "next-auth/next";

import CredentialsProvider from "next-auth/providers/credentials";
import prismadb from "@/lib/prismadb";
import bcryptjs from "bcryptjs";
import { options } from "./options";




const handler = NextAuth(options);
export { handler as GET, handler as POST };
