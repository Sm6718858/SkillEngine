import React, { useState } from "react";
import Filter from "./filter";
import SearchResult from "./searchResult.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSearchCourseQuery } from "@/features/courseApi";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [selectedCategories, setSelectedCatgories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const isEmpty = !isLoading && data?.courses?.length === 0;

  const handleFilterChange = (categories, price) => {
    setSelectedCatgories(categories);
    setSortByPrice(price);
  };

  return (
    <div
      className="
        max-w-7xl mx-auto 
        px-4 md:px-8 py-14 
        animate-fadeSlide
      "
    >
      <div className="mb-10">
        <h1
          className="
            text-3xl md:text-4xl font-extrabold 
            bg-gradient-to-r from-pink-600 via-purple-600 to-fuchsia-600 
            bg-clip-text text-transparent
            tracking-tight
          "
        >
          Search Results
        </h1>

        <p className="mt-1 text-gray-600 dark:text-gray-300 text-lg">
          Showing results for{" "}
          <span className="font-bold italic text-purple-600 dark:text-purple-400">
            “{query}”
          </span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <Filter handleFilterChange={handleFilterChange} />

        <div className="flex-1 space-y-6">

          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {data?.courses?.map((course) => (
                <SearchResult key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;


const CourseNotFound = () => {
  return (
    <div
      className="
      flex flex-col items-center justify-center 
      rounded-2xl p-10 
      bg-white/70 dark:bg-white/10 backdrop-blur-xl
      border border-pink-300/40 dark:border-pink-900/30
      shadow-xl animate-fadeIn
    "
    >
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        No Courses Found
      </h1>

      <p className="text-gray-700 dark:text-gray-300 text-base mb-6">
        Sorry, we couldn’t find any results. Try different keywords.
      </p>

      <Link to="/course/search?query=">
        <Button
          className="
            bg-gradient-to-r from-pink-600 to-purple-600 
            text-white rounded-xl px-6 py-2
            hover:scale-[1.03] hover:shadow-lg transition-all
          "
        >
          Browse All Courses →
        </Button>
      </Link>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div
      className="
      flex flex-col md:flex-row gap-5 
      p-6 rounded-2xl 
      bg-white/70 dark:bg-white/10 backdrop-blur-lg 
      border border-pink-300/30 dark:border-pink-900/30
      shadow-md
    "
    >
      <div className="h-32 w-full md:w-64 overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>

      <div className="flex flex-col gap-3 flex-1 py-2">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>

      <div className="flex items-start justify-end min-w-[80px]">
        <Skeleton className="h-6 w-12 rounded-md" />
      </div>
    </div>
  );
};
