import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      <h1 className="text-[80px] font-bold text-[#3B3098]">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
      <Link
        href="/"
        className="text-[#3B3098] underline hover:text-[#00A649] transition"
      >
        Go back home
      </Link>
    </div>
  )
}
