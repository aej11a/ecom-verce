import Link from "next/link";

export function AdminNavbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold">
          Admin Dashboard
        </Link>
        <div className="space-x-4">
          <Link href="/admin/products" className="hover:text-gray-300">
            Products
          </Link>
          <Link href="/admin/categories" className="hover:text-gray-300">
           Categories
          </Link>
        </div>
      </div>
    </nav>
  );
}
