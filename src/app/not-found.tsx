import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-9xl font-bold">404</h1>
        <h2>Not Found</h2>
        <p>Could not find requested page</p>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}
