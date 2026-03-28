"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Главная" },
  { href: "/library", label: "Библиотека" },
  { href: "/study", label: "Учить" },
  { href: "/stats", label: "Статистика" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-10 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
      <div className="max-w-2xl mx-auto px-4 flex gap-2">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-3 text-sm font-medium rounded-t transition ${
              pathname === href
                ? "bg-white dark:bg-stone-800 text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 -mb-px"
                : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
