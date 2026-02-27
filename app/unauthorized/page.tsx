export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="rounded-2xl border p-6 max-w-md w-full">
        <h1 className="text-2xl font-semibold">Acceso no autorizado</h1>
        <p className="mt-2 text-sm text-gray-600">
          Tu correo no está en la lista permitida. Pídele al administrador que te agregue.
        </p>
      </div>
    </main>
  );
}