"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Si ya hay sesión, manda a /friends
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/friends");
    });

    // Escucha cambios de auth (cuando vuelves del magic link)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/friends");
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [router]);

  async function sendMagicLink() {
    setStatus("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/friends`,
      },
    });

    if (error) setStatus(`Error: ${error.message}`);
    else setStatus("Revisa tu correo para entrar.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Login</h1>

        <input
          className="w-full mt-4 rounded-xl border px-3 py-2"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full mt-4 rounded-xl bg-black text-white py-2 disabled:opacity-60"
          disabled={!email}
          onClick={sendMagicLink}
        >
          Enviar enlace
        </button>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </main>
  );
}