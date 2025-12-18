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
import CourseTable from "./pages/admin/course/courseTable";
import AddCourse from "./pages/admin/course/addCourse";
import EditCourse from "./pages/admin/course/editCourse";
import CreateLecture from "./pages/admin/lecture/createLecture";
import EditLecture from "./pages/admin/lecture/editLecture";
import CourseDetail from "./pages/student/courseDetail";
import CourseProgress from "./pages/student/courseProgress";
import SearchPage from "./pages/student/searchPage";
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from "./components/protectedRoute";
import PurchaseCourseProtectedRoute from "./components/purchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/themeProvider";
import InterviewPage from "./pages/Placement/interviewPage";
import Aptitude from "./pages/Placement/aptitude";
import CodingRound from "./pages/Placement/codingRound";
import GroupStudy from './pages/student/groupStudy';

function App() {
  // const showLogin = false; 

  const appRouter = createBrowserRouter([
    {
      path: "/", element: <MainLayout />,
      children: [
        {
          path: '/', element: <>
            <HeroSection />
            <Courses />
          </>
        },
        {
          path: '/login', element: <AuthenticatedUser>
            <Login />
          </AuthenticatedUser>
        },
        {
          path: '/myLearning', element: <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        },
        {
          path: '/profile', element: <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        },
        {
          path: '/groupStudy',element: <ProtectedRoute><GroupStudy/></ProtectedRoute>
        },
        {
          path: '/interview', element: <ProtectedRoute><InterviewPage/></ProtectedRoute>
        },
        {
          path: '/aptitude', element: <ProtectedRoute><Aptitude/></ProtectedRoute>
        },
        {
          path: '/codingRound', element: <ProtectedRoute><CodingRound/></ProtectedRoute>
        },
        {
          path: '/course/search', element: <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        },
        {
          path: '/courseDetail/:courseId', element: <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        },
        {
          path: '/course-progress/:courseId', element: <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        },

        {
          path: "/admin", element: <AdminRoute>
            <Sidebar />
          </AdminRoute>,
          children: [
            {
              path: 'dashboard',
              element: <Dashboard />
            },
            {
              path: 'course',
              element: <CourseTable />
            },
            {
              path: 'course/create',
              element: <AddCourse />
            },
            {
              path: 'course/:courseId',
              element: <EditCourse />
            },
            {
              path: 'course/:courseId/lecture',
              element: <CreateLecture />
            },
            {
              path: 'course/:courseId/lecture/:lectureId',
              element: <EditLecture />
            },
          ]
        }
      ]
    },
  ])
  return (
    <>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </>
  );
}

export default App;
