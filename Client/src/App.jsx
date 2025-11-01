import { Button } from "@/components/ui/button"
import {Login} from "@/pages/Login.jsx"
import Navbar from "./components/Navbar"

function App() {
  return (
    <>
      <Navbar/>
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Login/>
    </div>
    </>
  )
}

export default App