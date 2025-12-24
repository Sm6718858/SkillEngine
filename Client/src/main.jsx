import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { appStore } from './app/store'
import { Toaster } from "@/components/ui/sonner"
import { useLoadUserQuery } from './features/authApi'

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return <>{children}</>;
};

createRoot(document.getElementById('root')).render(
  <Provider store={appStore}>
    <Custom>
      <App />
      <Toaster />
    </Custom>
  </Provider>
);
