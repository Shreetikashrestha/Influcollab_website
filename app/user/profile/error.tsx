"use client"
import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

export default function Error({
     error,
     reset
}: {
     error: Error & { digest?: string },
     reset: () => void
}) {

     useEffect(() => {
         console.error('Profile error:', error)
     },[error])

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-8">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-red-100 shadow-sm">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
                <p className="text-gray-500 mb-6">
                    {error.message || "We encountered an error while loading your profile."}
                </p>
                <button 
                    onClick={reset}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
