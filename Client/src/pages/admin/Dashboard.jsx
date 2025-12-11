import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/purchaseApi";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading)
    return (
      <h1 className="text-center mt-20 text-xl font-semibold text-pink-600">
        Loading...
      </h1>
    );

  if (isError)
    return (
      <h1 className="text-center mt-20 text-xl text-red-500">
        Failed to load dashboard data
      </h1>
    );

  const { purchasedCourse } = data || [];

  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId.courseTitle,
    price: course.courseId.coursePrice,
  }));

  const totalRevenue = purchasedCourse.reduce(
    (acc, element) => acc + (element.amount || 0),
    0
  );

  const totalSales = purchasedCourse.length;

  return (
    <div
      className="
      grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
      mt-10 px-4
      "
    >
      <Card
        className="
        bg-white/70 dark:bg-white/10 backdrop-blur-xl
        border border-pink-300/50 dark:border-pink-700/40
        shadow-lg hover:shadow-pink-300/50 dark:hover:shadow-pink-900/40
        transition-all rounded-2xl
      "
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pink-700 dark:text-pink-300">
            Total Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-pink-600 dark:text-pink-300">
            {totalSales}
          </p>
        </CardContent>
      </Card>

      <Card
        className="
        bg-white/70 dark:bg-white/10 backdrop-blur-xl
        border border-pink-300/50 dark:border-pink-700/40
        shadow-lg hover:shadow-pink-300/50 dark:hover:shadow-pink-900/40
        transition-all rounded-2xl
      "
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-pink-700 dark:text-pink-300">
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-pink-600 dark:text-pink-300">
            ₹{totalRevenue}
          </p>
        </CardContent>
      </Card>

      <Card
        className="
        col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 
        bg-white/70 dark:bg-white/10 backdrop-blur-xl
        border border-pink-300/50 dark:border-pink-700/40
        shadow-lg hover:shadow-pink-300/40 dark:hover:shadow-pink-900/40
        transition-all rounded-2xl
      "
      >
        <CardHeader>
          <CardTitle
            className="
            text-xl font-bold 
            bg-gradient-to-r from-pink-600 to-purple-600 
            dark:from-pink-300 dark:to-purple-300
            bg-clip-text text-transparent
          "
          >
            Course Price Overview
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3c4dc" />

              <XAxis
                dataKey="name"
                stroke="#d63384"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fill: "#d63384", fontSize: 11 }}
              />

              <YAxis
                stroke="#d63384"
                tick={{ fill: "#d63384" }}
              />

              <Tooltip
                formatter={(value) => [`₹${value}`, "Price"]}
                contentStyle={{
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: "10px",
                  border: "1px solid pink",
                }}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#d63384"
                strokeWidth={4}
                dot={{ stroke: "#d63384", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
