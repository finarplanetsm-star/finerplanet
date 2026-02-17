export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100">
      {/* Bouncing dots */}
      <div className="flex space-x-2">
        <span className="w-4 h-4 bg-[#3B3098] rounded-full animate-bounce"></span>
        <span className="w-4 h-4 bg-[#6C63FF] rounded-full animate-bounce delay-150"></span>
        <span className="w-4 h-4 bg-[#00A6FF] rounded-full animate-bounce delay-300"></span>
      </div>

      <p className="mt-6 text-lg md:text-2xl text-gray-700 font-semibold animate-pulse">
        Loading ...
      </p>
    </div>
  )
}
