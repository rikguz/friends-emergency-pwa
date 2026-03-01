"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Friend = {
  id: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  emergency_name: string | null;
  emergency_phone: string | null;
  email: string | null;
  car_plates: string | null;
  car_info: string | null;
};

export default function FriendsPage() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((f) => (f.full_name ?? "").toLowerCase().includes(q));
  }, [friends, query]);

useEffect(() => {
  async function load() {
    setLoading(true);
    setErrorMsg(null);

const pinOk = typeof window !== "undefined" && localStorage.getItem("pin_ok") === "true";
if (!pinOk) {
  router.replace("/login");
  return;
}
    // 1) Sesión
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) {
      setErrorMsg(sessionErr.message);
      return;
    }

    if (!sessionData?.session) {
      router.replace("/login");
      return;
    }


    // 3) Cargar contactos
    const { data, error } = await supabase
      .from("friends")
      .select(
        "id, full_name, phone, address, emergency_name, emergency_phone, email, car_plates, car_info"
      )
      .order("full_name", { ascending: true });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setFriends(data ?? []);
	setLoading(false);
  }

  load();
}, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Contactos (Emergencia)</h1>
        <button className="rounded-xl border px-3 py-2" onClick={signOut}>
          Salir
        </button>
      </div>

      <input
        className="w-full mt-6 rounded-xl border px-3 py-2"
        placeholder="Buscar por nombre…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading ? (
{errorMsg && (
  <div className="mt-4 rounded-xl border p-3 text-sm">
    Error: {errorMsg}
  </div>
)}
	{loading && <p>Cargando...</p>}
        <p className="mt-6">Cargando…</p>
      ) : errorMsg ? (
        <p className="mt-6 text-red-600">Error: {errorMsg}</p>
      ) : filtered.length === 0 ? (
        <p className="mt-6">No hay registros.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((f) => (
            <li key={f.id} className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-lg">{f.full_name}</div>

                  {f.phone && (
                    <div className="text-sm mt-1">
                      <a className="underline" href={`tel:${f.phone}`}>
                        Llamar: {f.phone}
                      </a>
                    </div>
                  )}

                  {f.email && (
                    <div className="text-sm mt-1">
                      <a className="underline" href={`mailto:${f.email}`}>
                        Email: {f.email}
                      </a>
                    </div>
                  )}

                  {f.address && (
                    <div className="text-sm mt-1">
                      <a
                        className="underline"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          f.address
                        )}`}
                      >
                        Abrir dirección en Maps
                      </a>
                    </div>
                  )}

                  {(f.car_plates || f.car_info) && (
                    <div className="text-sm mt-3">
                      <div className="font-medium">Carro</div>
                      {f.car_plates && <div>Placas: {f.car_plates}</div>}
                      {f.car_info && <div>{f.car_info}</div>}
                    </div>
                  )}
                </div>

                {(f.emergency_name || f.emergency_phone) && (
                  <div className="text-sm text-right">
                    <div className="font-medium">Persona Contacto</div>
                    {f.emergency_name && <div>{f.emergency_name}</div>}
                    {f.emergency_phone && (
                      <a className="underline" href={`tel:${f.emergency_phone}`}>
                        {f.emergency_phone}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}