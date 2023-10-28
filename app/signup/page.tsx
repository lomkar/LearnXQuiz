"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0 &&
      user.name.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
    } catch (error: any) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col max-w-[900px] justify-center mt-4">
        {" "}
        <div>
          <h3>Signup</h3>
        </div>
        <div className="flex flex-col mt-4">
          <label>Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            placeholder="Enter Name"
          />
        </div>
        <div className="flex flex-col mt-4">
          <label>Username</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter Username"
          />
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
          <button onClick={onSignup}> Signup</button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
