export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse mb-6"></div>
                            <div className="w-32 h-6 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                            <div className="w-24 h-4 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
                            <div className="w-full h-12 bg-gray-200 rounded-2xl animate-pulse mb-6"></div>
                            <div className="w-full grid grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
