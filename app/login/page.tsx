"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";

function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onLogin = async () => {
    try {
      setLoading(true);

      // const response = await axios.post("/api/users/login", user);
      const res = await signIn("Credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (res?.error) {
        // setError("Invalid credentials")
        return;
      }
      // console.log("Login ", response.data);
      router.replace("/profile");
    } catch (error: any) {
      console.log("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col max-w-[900px] justify-center mt-4">
        <div>
          <h3>LogIn</h3>
        </div>

        <div className="flex flex-col mt-4">
          <label>Email</label>
          <input
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter Email"
          />
        </div>
        <div className="flex flex-col mt-4">
          <label>Password</label>
          <input
            type="text"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter Password"
          />
        </div>
        <div className="flex flex-col mt-4">
          <button onClick={onLogin}> Login</button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
