"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function sendMagicLink() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/friends",
      },
    });

    if (error) setStatus(error.message);
    else setStatus("Revisa tu correo para entrar.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="border p-6 rounded-xl">
        <h1 className="text-xl font-semibold">Login</h1>

        <input
          className="border p-2 mt-4 w-full"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="bg-black text-white p-2 mt-4 w-full rounded"
          onClick={sendMagicLink}
        >
          Enviar enlace
        </button>

        <p className="mt-4 text-sm">{status}</p>
      </div>
    </main>
  );
}