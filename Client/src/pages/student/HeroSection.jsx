import { Search, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-12">
      <div className="relative bg-gradient-to-br from-indigo-500 via-blue-600 to-sky-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-20 px-6 text-center rounded-b-3xl">
        
        <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl w-44 h-44 top-6 left-6 rounded-full opacity-15 animate-pulse hidden md:block"></div>

        <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-snug drop-shadow-sm">
          Master Skills & Shape Your Future
        </h1>

        <p className="text-blue-100 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto mt-3 opacity-90">
          Learn from experts & upgrade your career with industry-ready skills.
        </p>

        <div className="flex items-center justify-center mt-6">
          <div className="flex w-full max-w-lg shadow-md rounded-xl overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Search courses e.g. Web Dev, AI, DSA..."
              className="flex-1 px-4 py-3 text-gray-700 focus:outline-none"
            />
            <button className="px-5 flex items-center gap-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              <Search size={18} /> Search
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-lg shadow hover:shadow-md hover:bg-gray-100 transition flex items-center gap-2">
            Explore Courses <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
