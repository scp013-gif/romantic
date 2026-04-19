import { Link, Outlet } from 'react-router-dom'
import { Heart, User, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { memo } from 'react';

const MainLayout = memo(() => {
    return(
    <div className="min-h-screen bg-rose-50/30">
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 p-4 shadow-sm flex justify-center gap-12 font-bold text-gray-600">
            <Link to="/" className="hover:text-pink-500 flex items-center gap-1 transition-colors"><Heart size={18} /> 浪漫生成</Link>
            <Link to="/mine" className="hover:text-pink-500 flex items-center gap-1 transition-colors"><User size={18} /> 我的记忆</Link>
            <button onClick={() => useAuthStore.getState().logout()} className="text-gray-400 hover:text-red-400 flex items-center gap-1"><LogOut size={18} /> 退出</button>
        </nav>
    <Outlet />
  </div>
    )
});
export default MainLayout;