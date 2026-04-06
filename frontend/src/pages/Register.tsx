import { useState } from "react"
import { useNavigate,Link } from "react-router-dom"
import { Heart,Lock,User,Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function Register() {
    const [form,setForm] = useState({
        username:"",
        password:"",
    });
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const register = useAuthStore.getState().register;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!form.username || !form.password){
            alert("请输入用户名和密码");
            return;
        }
        setLoading(true);
        try{
            await register(form);
            navigate("/");
        }catch(err){
            alert("注册失败，请检查用户名和密码是否正确");
        }finally{
            setLoading(false);
        }
    }
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 p-4">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/50 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-block p-4 bg-rose-500 rounded-3xl shadow-lg shadow-rose-200 animate-pulse">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">加入实验室</h2>
          <p className="text-gray-500 font-medium">开启属于你们的浪漫篇章</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 group-focus-within:text-rose-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="设置用户名"
              className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-rose-50 rounded-2xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-medium"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 group-focus-within:text-rose-500 transition-colors" size={20} />
            <input
              type="password"
              placeholder="设置密码"
              className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-rose-50 rounded-2xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all font-medium"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-400 text-white rounded-2xl font-black text-lg shadow-xl shadow-rose-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:grayscale"
          >
            {loading ? '正在同步宇宙...' : <><Heart size={20} className="fill-white" /> 开启浪漫之旅</>}
          </button>
        </form>

        <p className="text-center text-gray-500 font-bold">
          已有账号？ 
          <Link to="/login" className="text-rose-500 hover:underline ml-1">去登录</Link>
        </p>
      </div>
    </div>
    )
}