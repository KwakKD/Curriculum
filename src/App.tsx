import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./components/MainLayout/mainLayout"
import Sub from "./pages/sub"
import Home from "./pages/home"
import { ToastProvider } from "./components/ToastProvider/ToastProvider"
import LoginPage from "./pages/loginPage"
import ProtectedRoute from "./components/ProtectedRoute/protectedRoute"
import SignUpPage from "./pages/signUpPage"
import Union from "./pages/union"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/"
            element={<ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>}
          >
            <Route index element={<Home />} />
            <Route path="Home" element={<Home />} />
            <Route path="Sub" element={<Sub />} />
            <Route path="Union" element={<Union />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
