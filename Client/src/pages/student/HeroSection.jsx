import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <section className="pt-14">
      <div
        className="
        relative overflow-hidden 
        bg-gradient-to-br 
        from-pink-200 via-rose-100 to-purple-200 
        dark:from-[#1b0e16] dark:via-[#2a1425] dark:to-[#1a0e1f]
        rounded-b-[40px] px-6 py-24 text-center 
        transition-colors duration-300
        "
      >
        <div className="absolute -top-10 left-0 w-72 h-72 
        bg-pink-300/40 dark:bg-pink-500/25 
        blur-[120px] rounded-full animate-pulse"></div>

        <div className="absolute bottom-0 right-0 w-72 h-72 
        bg-purple-300/40 dark:bg-purple-500/25 
        blur-[120px] rounded-full animate-pulse"></div>

        <h1
          className="
          relative text-4xl md:text-6xl font-extrabold 
          text-gray-900 dark:text-pink-200 
          leading-tight tracking-tight drop-shadow-sm
          "
        >
          Engine On. Doubts Off.
        </h1>
        <p
          className="
          relative max-w-2xl mx-auto mt-4 
          text-gray-700 dark:text-pink-100/80
          text-base md:text-lg opacity-95
          "
        >
          Start Your Skill Engine — Your Road to Industry Starts Here
        </p>

        <div className="mt-8 flex justify-center">
          <form
            onSubmit={searchHandler}
            className="
            flex w-full max-w-xl 
            bg-white/70 dark:bg-white/10 
            border border-white/40 dark:border-pink-500/20
            backdrop-blur-xl shadow-xl 
            rounded-2xl overflow-hidden 
            transition
            "
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses e.g. Web Dev, AI, DSA..."
              className="
              flex-1 px-5 py-3 
              text-gray-700 dark:text-pink-100 
              bg-transparent 
              placeholder-gray-500 dark:placeholder-pink-200/50
              focus:outline-none
              "
            />

            <button
              type="submit"
              className="
              px-6 flex items-center gap-2 font-semibold
              bg-gradient-to-r from-pink-500 to-purple-500 
              hover:opacity-90 text-white 
              dark:from-pink-600 dark:to-purple-600 
              transition
              "
            >
              <Search size={18} /> Search
            </button>
          </form>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(`/course/search?query`)}
            className="
            group 
            bg-white dark:bg-white/10 
            text-gray-900 dark:text-pink-200 
            font-semibold px-6 py-3 rounded-xl 
            shadow-lg hover:shadow-2xl 
            border border-gray-200 dark:border-pink-300/20 
            backdrop-blur-xl
            transition flex items-center gap-2
            "
          >
            Unlock Your Engine
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
