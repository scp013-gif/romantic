import Loading from "@/components/Loading/Loading";
import React, { lazy,Suspense } from "react";
import { BrowserRouter as Router,Routes,Route,Navigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuthStore } from "@/store/useAuthStore";

const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Home = lazy(() => import("@/pages/Home"));
const Mine = lazy(() => import("@/pages/Mine"));

function ProtectedRoute({children}:{children:React.ReactNode}){
    const token = useAuthStore(state => state.accessToken);
    if(!token) {
        return <Navigate to="/login" replace/>
    }
    return <>{children}</>
}

export default function RouterConfig() {
    return (
        <Router>
            <Suspense fallback={<Loading/>}>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register"  element={<Register/>}/>
                    <Route path="/" element={<ProtectedRoute><MainLayout/></ProtectedRoute>}>
                        <Route index element={<Home/>}/>
                        <Route path="mine" element={<Mine/>}/>
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    )
}