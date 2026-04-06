import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { Heart,Lock,User,ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import type { Credential } from "@/types/Credential";

export default function Login() {
    const [form,setForm] = useState({
        username:"",
        password:""
    });
    const [loading,setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault();
        if(!form.username || !form.password){
            alert("请输入用户名和密码");
            return;
        }
        setLoading(true);
        try{
            await login(form as Credential);
            navigate("/");
        }catch(err){
            alert('登录失败，请检查用户名和密码是否正确');
        }finally{
            setLoading(false);
        }
    }
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-4">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/50 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-block p-4 bg-pink-500 rounded-3xl shadow-lg shadow-pink-200 animate-bounce">
            <Heart className="text-white fill-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">浪漫回归</h2>
          <p className="text-gray-500 font-medium">继续编织你们的专属记忆</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="用户名"
              className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-pink-50 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-medium"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 group-focus-within:text-pink-500 transition-colors" size={20} />
            <input
              type="password"
              placeholder="密码"
              className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-pink-50 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-medium"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:grayscale"
          >
            {loading ? '正在同步记忆...' : <><ArrowRight size={20} /> 开启浪漫之旅</>}
          </button>
        </form>

        <p className="text-center text-gray-500 font-bold">
          还没有账号？ 
          <Link to="/register" className="text-pink-500 hover:underline ml-1">立即注册</Link>
        </p>
      </div>
    </div>
    )
}