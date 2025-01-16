import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
      <p className="mb-4">
        Sorry, we couldn&apos;t find the product you&apos;re looking for.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Return to Home
      </Link>
    </div>
  );
}
