import Loading from "@/components/Loading/Loading";
import { useAuthStore } from "@/store/useAuthStore";
import { lazy,Suspense } from "react";
import { BrowserRouter as Router,Routes,Route,Navigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";

const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Home = lazy(() => import("@/pages/Home"));
const Mine = lazy(() => import("@/pages/Mine"));

export default function RouterConfig() {
    const token = useAuthStore(s => s.accessToken);
    return (
        <Router>
            <Suspense fallback={<Loading/>}>
                <Routes>
                    <Route path="/login" element={!token ? <Login/> : <Navigate to="/" />}/>
                    <Route path="/register"  element={<Register/>}/>
                    <Route path="/" element={token ? <MainLayout/> : <Navigate to="/login" />}>
                        <Route index element={<Home/>}/>
                        <Route path="mine" element={<Mine/>}/>
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    )
}