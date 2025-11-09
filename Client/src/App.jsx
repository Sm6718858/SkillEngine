import { createBrowserRouter } from "react-router-dom";
// import Navbar from "./components/Navbar";
import HeroSection from "./pages/student/HeroSection";
import { Login } from "@/pages/Login";
import MainLayout from "./Layout/MainLayout";
import { RouterProvider } from "react-router";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import courseTable from './pages/admin/course/courseTable'

function App() {
  // const showLogin = false; 

  const appRouter = createBrowserRouter([
    {
      path: "/", element: <MainLayout />,
      children: [
        {
          path: '/', element: <>
            <HeroSection />
            <Courses/>
          </>
        },
        { path: '/login', element: <Login /> },
        {path: '/myLearning', element: <MyLearning />},
        {path: '/profile', element: <Profile />},

        {
          path:"/admin",element: <Sidebar/>,
          children:[
            {
              path: 'dashboard',
              element: <Dashboard/>
            },
            {
              path: 'course',
              element: <courseTable/>
            }
          ]
        }
      ]
    },
  ])
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
