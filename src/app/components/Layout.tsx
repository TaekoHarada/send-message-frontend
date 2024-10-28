// components/Layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <nav className="w-1/4 bg-gray-800 text-white p-4">
        <ul>
          <li>
            <Link href="/">Main</Link>
          </li>
          <li>
            <Link href="/customers">Customer</Link>
          </li>
          <li>
            <Link href="/mail">Mail</Link>
          </li>
        </ul>
      </nav>
      <main className="w-3/4 p-8">{children}</main>
    </div>
  );
}
