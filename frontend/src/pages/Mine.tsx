import UserIcon from '@/components/UserIcon';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { deleteRecords, getRecords } from '@/api/user';
import { Calendar, Heart, ImageIcon, MapPin, MessageSquareHeart, Palette, Sparkles, Trash2, X } from 'lucide-react';
interface GenerationRecord{
    id:number;
    coupleImgUrl:string;
    blessing:string;
    createdAt:Date;
    style:string;
    scene:string;
}

export default function Mine() {
    const [records,setRecords] = useState<GenerationRecord[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const user = useAuthStore((state) => state.user);
    const [selectedRecord, setSelectedRecord] = useState<GenerationRecord | null>(null);
    
    const getRecord = async () => {
        setLoading(true);
        try{
            const res = await getRecords();
            setRecords(res.data);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const handleDelete = async (id:number) => {
        if(!window.confirm('确定要永久删除这段浪漫记忆吗？')){
            return;
        }
        try{
            await deleteRecords(id);
        }catch(err){
            console.log(err);
        }
        getRecord();
    }
    useEffect(() => {
        getRecord();
    },[]);
    return (
    <div className="min-h-screen p-6 lg:p-12 max-w-7xl mx-auto space-y-10 relative">
      {/* 个人信息头部 */}
      <header className="bg-white/70 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-tr from-pink-400 to-rose-300 rounded-full flex items-center justify-center text-white shadow-lg shadow-pink-100">
          <UserIcon size={40} />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">{user?.name || '浪漫旅人'}</h1>
          <p className="text-pink-400 font-bold flex items-center justify-center md:justify-start gap-2">
            <Heart size={16} className="fill-pink-400" /> 已珍藏 {records.length} 段美好时光
          </p>
        </div>
      </header>

      {/* 历史记录列表 */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-pink-500" />
          <h2 className="text-2xl font-black text-gray-700 tracking-tight">往昔珍藏</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white/50 rounded-[2.5rem] animate-pulse border-2 border-pink-50" />)}
          </div>
        ) : records.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {records.map((record) => (
              <div 
                key={record.id} 
                onClick={() => setSelectedRecord(record)}
                className="group bg-white rounded-[2.5rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 border border-pink-50 cursor-pointer relative"
              >
                {/* 顶部预览图 */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={record.coupleImgUrl} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-rose-900/20 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 font-black bg-pink-500/80 px-6 py-2 rounded-full backdrop-blur-md transition-all shadow-xl">回顾细节</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-pink-600 text-[10px] font-black flex items-center gap-1 shadow-sm">
                    <ImageIcon size={10} /> {record.style}
                  </div>
                </div>

                {/* 卡片简略内容 */}
                <div className="p-6 space-y-4">
                  <p className="italic font-serif line-clamp-2 text-sm text-gray-600 leading-relaxed">
                    "{record.blessing}"
                  </p>
                  <div className="pt-4 border-t border-pink-50 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                      <Calendar size={12} />
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/40 rounded-[3.5rem] border-4 border-dashed border-pink-100 shadow-inner">
            <Heart size={64} className="mx-auto text-pink-100 mb-4 animate-pulse" />
            <p className="text-pink-300 font-black text-xl tracking-tight">还没有谱写你们的故事</p>
            <p className="text-gray-400 text-sm mt-2 font-medium">快去首页开启第一段浪漫之旅吧！</p>
          </div>
        )}
      </section>

      {/* --- 沉浸式详情模态框 --- */}
      {selectedRecord && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      {/* 背景磨砂遮罩 */}
      <div
        className="absolute inset-0 bg-rose-950/40 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={() => setSelectedRecord(null)}
      />

      {/* 详情卡片容器 */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {/* 手机端关闭按钮 */}
        <button
          onClick={() => setSelectedRecord(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full text-pink-500 hover:bg-pink-500 hover:text-white transition-all shadow-xl border border-pink-50 md:top-6 md:right-6 md:p-3"
        >
          <X size={20} />
        </button>

        {/* 左侧：完整大图展示 */}
        <div className="w-full md:w-3/5 h-64 md:h-auto relative group overflow-hidden bg-gray-100">
          <img
            src={selectedRecord.coupleImgUrl}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* 图片上的标签 */}
          <div className="absolute bottom-4 left-4 flex gap-2 md:bottom-8 md:left-8 md:gap-3">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-pink-600 text-[10px] md:text-xs font-black shadow-2xl flex items-center gap-1 md:gap-2 border border-pink-50">
              <Palette size={12} className="md:size-4" /> {selectedRecord.style}
            </span>
            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-rose-600 text-[10px] md:text-xs font-black shadow-2xl flex items-center gap-1 md:gap-2 border border-rose-50">
              <MapPin size={12} className="md:size-4" /> {selectedRecord.scene}
            </span>
          </div>
        </div>

        {/* 右侧：完整祝福语与信息 */}
        <div className="w-full md:w-2/5 p-6 md:p-12 flex flex-col justify-center space-y-6 md:space-y-10 bg-gradient-to-br from-white via-white to-pink-50/50 relative overflow-y-auto custom-scrollbar">
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-2 text-pink-400 font-black tracking-widest uppercase text-[10px]">
              <Sparkles size={12} /> 浪漫记录 · {new Date(selectedRecord.createdAt).toLocaleDateString()}
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight tracking-tighter">
              时光寄语
            </h3>
          </div>

          <div className="relative">
            <MessageSquareHeart className="absolute -top-8 -left-8 text-pink-50/50 hidden md:block" size={100} />
            <p className="relative text-lg md:text-2xl text-gray-700 font-serif italic leading-relaxed whitespace-pre-wrap drop-shadow-sm">
              {selectedRecord.blessing}
            </p>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}