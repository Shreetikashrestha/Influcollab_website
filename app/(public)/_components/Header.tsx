import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">InfluCollab</Link>
        <nav className="flex gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-800">Login</Link>
          <Link href="/register" className="text-sm text-gray-600 hover:text-gray-800">Register</Link>
        </nav>
      </div>
    </header>
  );
}
