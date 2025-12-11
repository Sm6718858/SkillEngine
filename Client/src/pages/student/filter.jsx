import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      handleFilterChange(updated, sortByPrice);
      return updated;
    });
  };

  const selectByPriceHandler = (val) => {
    setSortByPrice(val);
    handleFilterChange(selectedCategories, val);
  };

  return (
    <div
      className="
        w-full md:w-[22%]
        bg-white/70 dark:bg-white/10
        backdrop-blur-xl
        rounded-2xl
        border border-pink-300/40 dark:border-pink-700/40
        shadow-xl p-5
        transition-all duration-300
      "
    >
      <div className="flex items-center justify-between">
        <h1
          className="
            text-xl font-extrabold tracking-tight
            bg-gradient-to-r from-pink-600 to-purple-600
            bg-clip-text text-transparent
          "
        >
          Filters
        </h1>

        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger
            className="
              w-[120px] h-10 rounded-xl
              bg-white/80 dark:bg-pink-900/20
              border border-pink-300/40 dark:border-pink-700/40
            "
          >
            <SelectValue placeholder="Sort" />
          </SelectTrigger>

          <SelectContent
            className="
              rounded-xl shadow-lg
              bg-white/90 dark:bg-[#1a0b16]
              border border-pink-300/40 dark:border-pink-700/40
            "
          >
            <SelectGroup>
              <SelectLabel className="text-pink-600 dark:text-pink-300">
                Sort by price
              </SelectLabel>
              <SelectItem value="low">Low → High</SelectItem>
              <SelectItem value="high">High → Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4 bg-pink-200/40 dark:bg-pink-700/40" />

      <div>
        <h1 className="font-semibold mb-3 text-gray-800 dark:text-pink-200">
          Categories
        </h1>

        <div className="space-y-2 max-h-[330px] overflow-y-auto pr-1">
          {categories.map((category) => (
            <div
              key={category.id}
              className="
                flex items-center space-x-3
                p-2 rounded-lg cursor-pointer
                transition-all
                hover:bg-pink-100/50 dark:hover:bg-pink-900/30
              "
            >
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
                className="
                  border-pink-400 dark:border-pink-600 
                  text-pink-600 dark:text-pink-300
                "
              />

              <Label
                htmlFor={category.id}
                className="
                  text-sm font-medium
                  text-gray-700 dark:text-pink-200
                  cursor-pointer
                "
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
