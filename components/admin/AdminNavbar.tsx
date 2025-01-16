"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/products", label: "Products" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/customer-segments", label: "Customer Segments" },
  ];

  const getLinkClass = (href: string) =>
    pathname === href
      ? "text-gray-400 underline pointer-events-none"
      : "hover:text-gray-300";

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold">
          Admin Dashboard
        </Link>
        <div className="space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={getLinkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
