"use client"

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-semibold">Something went wrong </h2>
      <p className="text-gray-500 mt-2">
        {error.message || "Please try again later."}
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
