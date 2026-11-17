import Link from "next/link";
export const metadata = { title: "Page not found" };
export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-7xl font-bold text-volt">404</p>
        <p className="mt-2 text-slate-400">This page could not be found.</p>
        <Link href="/" className="btn mt-6 inline-block">Back to EV HEXA</Link>
      </div>
    </main>);
}
