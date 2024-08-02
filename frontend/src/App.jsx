import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Suspense, lazy, useEffect, useState } from "react";
import Loader from "./components/Loader";
import { useRecoilState } from "recoil";
import { userAtom } from "./store/atom";
import axios from "axios";
import ProtectedRoute from "./components/ProtectedRoute";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Send = lazy(() => import("./pages/Send"));

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    
    (async () => {
      try {
       if(!localStorage.getItem("token")) throw new Error("Invalid token");
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(data.user);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setUser]);
  return isLoading ? (
    <Loader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={user ? true : false}
                redirect={"/login"}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            index
            path="/signup"
            element={
              <ProtectedRoute
                isAuthenticated={user ? false : true}
                redirect={"/dashboard"}
              >
                <Signup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute
                isAuthenticated={user ? false : true}
                redirect={"/dashboard"}
              >
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/send"
            element={
              <ProtectedRoute
                isAuthenticated={user ? true : false}
                redirect={"/login"}
              >
                <Send />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
