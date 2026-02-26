const FOOTER_PHONE = "3333-3333";
const FOOTER_EMAIL = "nit.dominio.com";

export function Footer() {
  return (
    <footer className="mt-10 bg-[#1c1c1c]">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center gap-1 leading-snug">
          <p className="text-xs text-gray-400">Telefone: {FOOTER_PHONE}</p>
          <p className="text-xs text-gray-400">E-mail: {FOOTER_EMAIL}</p>
        </div>
        <div className="mt-5 border-t border-white/10 pt-3 text-center">
          <p className="text-xs text-gray-500">NIT - Maple Bear São Luís</p>
        </div>
      </div>
    </footer>
  );
}
