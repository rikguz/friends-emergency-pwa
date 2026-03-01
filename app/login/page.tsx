"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    // si ya tiene sesión, vámonos a friends
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/friends");
    });
  }, [router]);

  async function enterWithPin() {
    setMsg("");

    // 1) login anónimo (sin email)
    const { error: anonErr } = await supabase.auth.signInAnonymously();
    if (anonErr) {
      setMsg(`Error: ${anonErr.message}`);
      return;
    }

    // 2) validar PIN contra allowed_pins
    const pinHash = await sha256Hex(pin.trim());

    const { data: allowed, error } = await supabase
      .from("allowed_pins")
      .select("id, is_active")
      .eq("pin_hash", pinHash)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !allowed) {
      await supabase.auth.signOut();
      setMsg("PIN incorrecto o desactivado.");
      return;
    }

    // 3) guardamos marca local para que friends sepa que pasó el PIN
    localStorage.setItem("pin_ok", "true");
    router.replace("/friends");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Ingreso</h1>
        <p className="mt-2 text-sm opacity-80">
          Escribe el PIN para ver los contactos.
        </p>

        <input
          className="w-full mt-4 rounded-xl border px-3 py-2 text-center tracking-widest"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          inputMode="numeric"
        />

        <button
          className="w-full mt-4 rounded-xl bg-black text-white py-2 disabled:opacity-60"
          disabled={!pin.trim()}
          onClick={enterWithPin}
        >
          Entrar
        </button>

        {msg && <p className="mt-4 text-sm">{msg}</p>}
      </div>
    </main>
  );
}