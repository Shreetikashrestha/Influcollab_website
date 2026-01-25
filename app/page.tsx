"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { use } from "react";

export default function Home() {
  const {user, logout} = useAuth();
  return (
    <div>
      Home
      {user && <div>Welcome, {user.email}</div>}
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
}
