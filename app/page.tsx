import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="rounded-2xl border p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold">Friends Emergency</h1>
        <p className="text-sm text-gray-600 mt-2">
          Acceso privado para ver contactos en caso de emergencia.
        </p>

        <Link
          className="inline-block mt-6 rounded-xl bg-black text-white px-4 py-2"
          href="/login"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}