"use client";
import React from "react";
import axios from "axios";
import {signOut, useSession} from 'next-auth/react'
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
function ProfilePage() {
  const {data:session} = useSession({
    required:true,
    onUnauthenticated(){
      redirect("/api/auth/login?callbackUrl=/client")
    }
  });
  const router = useRouter();
  const logout = async () => {
    try {
      signOut();
      // const response = await axios.get("/api/users/logout");
      // router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <button onClick={logout}>Logout</button>
      <div>PRofilePage</div>
      <div>{session?.user?.name}</div>
      <div>{session?.user?.email}</div>
    </div>
  );
}

export default ProfilePage;
