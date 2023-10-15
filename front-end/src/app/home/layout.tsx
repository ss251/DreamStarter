"use client";
import React from "react";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  interface NavLink {
    title: string;
    path: string;
  }

  const navLinks: NavLink[] = [
    { title: "Launch ", path: "/home/launch" },
    { title: "Explore", path: "/home/explore" },
    { title: "Dashboard", path: "/home/dashboard" },
  ];

  return (
    <section className="px-2">
      <ul className="flex justify-center gap-10">
        {navLinks.map((link) => (
          <li
            key={link.title}
            className={
              pathname === link.path ? "underline underline-offset-4" : ""
            }
          >
            <Link href={link.path}>{link.title}</Link>
          </li>
        ))}
      </ul>
      <div className="mt-10">{children}</div>
    </section>
  );
};

export default HomeLayout;
