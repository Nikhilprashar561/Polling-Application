import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { routes, getPageRoutes } from "./routes";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import FloatingNavigator from "./Components/FloatingNavigator";
import { AppProvider } from "./context/AppProvider";

function AppContent() {
  // const location = useLocation();

  // const showFooter = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <div className="noise min-h-screen bg-white text-black">
      <Toaster position="top-right" />
      <Navbar />

      <div className="min-h-screen">
        <Routes>
          {routes.map((route) => (
            <Route key={route.id} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>

      <Footer />

      <FloatingNavigator pageRoutes={getPageRoutes()} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
