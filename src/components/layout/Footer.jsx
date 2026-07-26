import { PERSONAL_INFO } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-transparent">
      <div className="mx-auto flex min-h-[84px] max-w-6xl items-center justify-center px-4 py-6 text-center sm:min-h-[92px] sm:px-6 sm:py-7 lg:min-h-[100px] lg:px-8 lg:py-8">
        <p className="max-w-full text-xs font-medium leading-6 text-blue-100/65 sm:text-sm sm:leading-7">
          © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
