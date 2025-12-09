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

    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="pt-12">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-16 md:py-20 px-6 text-center rounded-b-3xl">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl w-52 h-52 top-8 left-8 rounded-full opacity-20 animate-pulse hidden md:block"></div>

        <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-snug drop-shadow-sm">
          Learn. Grow. Transform Your Career.
        </h1>

        <p className="text-gray-200 text-base md:text-lg max-w-2xl mx-auto mt-3 opacity-90">
          Upgrade your skills with professional, industry-ready courses designed to help you succeed.
        </p>

        <div className="flex items-center justify-center mt-6">
          <form
            onSubmit={searchHandler}
            className="flex w-full max-w-lg shadow-lg rounded-xl overflow-hidden bg-gray-100"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses e.g. Web Dev, AI, DSA..."
              className="flex-1 px-4 py-2 text-gray-700 focus:outline-none bg-gray-100"
            />

            <button
              type="submit"
              className="px-5 flex items-center gap-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition cursor-pointer"
            >
              <Search size={18} /> Search
            </button>
          </form>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button onClick={()=> navigate(`/course/search?query`)} className="bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-lg shadow hover:shadow-md hover:bg-gray-200 transition flex items-center gap-2 cursor-pointer">
            Explore Courses <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
