'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 p-8 max-w-md mx-auto">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200 animate-pulse">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Sorry, we couldn`&#39;`t find the page you`&#39;`re looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200 font-medium"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <Home size={20} />
            Return Home
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Need help? <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">Contact us</Link></p>
        </div>
      </div>
    </div>
  );
}