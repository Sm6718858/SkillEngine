import Navbar from "./components/Navbar";
import HeroSection from "./pages/student/HeroSection";
import { Login } from "@/pages/Login";

function App() {
  const showLogin = false; 

  return (
    <>
      <Navbar />
      {showLogin ? (
        <div className="flex min-h-screen items-center justify-center pt-10">
          <Login />
        </div>
      ) : (
        <HeroSection />
      )}
    </>
  );
}

export default App;
