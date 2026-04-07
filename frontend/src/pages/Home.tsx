import { useState, type ChangeEvent } from 'react';
import { Heart, Sparkles, User, UserPlus, RefreshCw, Palette, MapPin, CheckCircle2 } from 'lucide-react';
import client from '@/api/config' // 使用自定义 Axios 实例
import PhotoUploader from '@/components/PhotoUploader';

// 预定义选项
const STYLES = ['唯美浪漫', '日系动漫', '复古港风', '赛博朋克', '中式婚服'];
const SCENES = ['海边落日', '繁花草坪', '星空教堂', '校园操场', '江南古镇'];

export default function Home() {
  const [files, setFiles] = useState<{ male: File | null; female: File | null }>({ male: null, female: null });
  const [previews, setPreviews] = useState({ male: '', female: '' });
  const [style, setStyle] = useState(STYLES[0]);
  const [scene, setScene] = useState(SCENES[0]);
  
  const [blessing, setBlessing] = useState('');
  const [coupleImg, setCoupleImg] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'generating' | 'success'>('idle');
  const isLocked = status === 'uploading' || status === 'generating';

  // 处理文件选择与本地预览
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'male' | 'female') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  //  核心执行逻辑
  const handleGenerate = async () => {
    if (!files.male || !files.female) return alert('请先上传双方的照片哦~');
    
    setStatus('uploading');

    try {
      // 上传图片到后端 (自动触发 Axios 拦截器注入 Token/无感刷新)
      const uploadTask = async (file: File) => {
        const fd = new FormData();
        fd.append('file', file);
        const { data } = await client.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data.url;
      };

      const [maleUrl, femaleUrl] = await Promise.all([
        uploadTask(files.male),
        uploadTask(files.female)
      ]);

      // 发起流式请求
      setStatus('generating');
      let fullBlessing = '';
      let finalImageUrl = '';
      let currentBlessing = '';
      let currentCoupleImg = '';

      await client.post('/generation/upload', 
        { maleImg: maleUrl, femaleImg: femaleUrl, style, scene },
        {
          // 关键：利用 Axios 的进度回调处理流
          onDownloadProgress: (progressEvent) => {
            const chunk = progressEvent.event.target.responseText;
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const rawData = line.slice(6).trim();
                console.log(rawData);
                if (rawData === '[DONE]') return; // 流结束

                try {
                  const { content, imageUrl } = JSON.parse(rawData);
                  // 匹配后端逻辑：如果是图片 URL，更新大图
                  if (imageUrl && imageUrl !== currentCoupleImg) {
                    currentCoupleImg = imageUrl;
                    setCoupleImg(imageUrl);
                  }
                  // 如果是文本片段，更新打字机效果
                  if (content && !content.trim().startsWith('http')) {
                    currentBlessing += content;
                  }
                } catch (e) {
                    throw e;
                }
              }
            }
            if(currentBlessing) setBlessing(currentBlessing);
            if(currentCoupleImg) setCoupleImg(currentCoupleImg);

            fullBlessing = currentBlessing;
            finalImageUrl = currentCoupleImg;
          }
        }
      );

      // 自动保存记录 
      await client.post('/generation/save', {
        input: { maleImg: maleUrl, femaleImg: femaleUrl, style, scene },
        result: { coupleImgUrl: finalImageUrl, blessing: fullBlessing }
      });
      
      setStatus('success');

    } catch (err) {
      console.error('浪漫实验失败:', err);
      alert('发生错误，请检查网络或重新登录');
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-black bg-gradient-to-r from-pink-600 to-rose-400 bg-clip-text text-transparent flex justify-center items-center gap-4">
          <Heart className="fill-pink-500 text-pink-500" size={48} /> 浪漫 AI 实验室
        </h1>
        <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-sm">定制属于你们的浪漫瞬间</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
        
        
        <section className="bg-white/70 backdrop-blur-xl p-8 rounded-[3rem] shadow-xl border border-white space-y-8 order-2 lg:order-1">
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-700 flex items-center gap-2"><Palette className="text-pink-400" /> 选择风格</h2>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => (
                <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${style === s ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 scale-105' : 'bg-white text-gray-400 border border-pink-50 hover:border-pink-200'}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-700 flex items-center gap-2"><MapPin className="text-rose-400" /> 选择场景</h2>
            <div className="flex flex-wrap gap-2">
              {SCENES.map(s => (
                <button key={s} onClick={() => setScene(s)} className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${scene === s ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105' : 'bg-white text-gray-400 border border-rose-50 hover:border-rose-200'}`}>{s}</button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={status !== 'idle' && status !== 'success'}
            className="w-full py-6 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-[2rem] font-black text-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:grayscale disabled:scale-100 flex items-center justify-center gap-3"
          >
            {status === 'idle' || status === 'success' ? <><Sparkles /> 开始生成浪漫</> : <RefreshCw className="animate-spin" />}
          </button>
        </section>

        
        <section className="grid grid-cols-1 gap-6 order-1 lg:order-2">
          <PhotoUploader label="男方照片" preview={previews.male} onChange={(e: ChangeEvent<HTMLInputElement, Element>) => handleFileChange(e, 'male')} disabled={isLocked} icon={<User className="text-blue-400" />} />
          <PhotoUploader label="女方照片" preview={previews.female} onChange={(e: ChangeEvent<HTMLInputElement, Element>) => handleFileChange(e, 'female')} disabled={isLocked} icon={<UserPlus className="text-pink-400" />} />
        </section>

        {/* 第三栏：结果实时展示 */}
        <section className="bg-white rounded-[3.5rem] p-8 shadow-2xl border-4 border-pink-50 min-h-[550px] flex flex-col items-center order-3 relative overflow-hidden">
          {status === 'generating' && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold animate-pulse shadow-xl flex items-center gap-2">
                <Sparkles size={18} /> AI 正在绘制浪漫...
              </div>
            </div>
          )}

          <div className="w-full h-80 rounded-[2.5rem] bg-pink-50/50 flex items-center justify-center mb-8 overflow-hidden border-4 border-dashed border-pink-100 shadow-inner">
            {coupleImg ? (
              <img src={coupleImg} className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" alt="Generated" />
            ) : (
              <Heart size={80} className="text-pink-100 animate-pulse" />
            )}
          </div>

          <div className="w-full px-4 space-y-4">
            <h3 className="text-pink-400 font-black italic flex items-center gap-2">
              <Sparkles size={18} /> 浪漫寄语
            </h3>
            <p className="text-2xl text-gray-700 font-serif italic leading-relaxed whitespace-pre-wrap min-h-[150px] text-center">
              {blessing || (status === 'generating' ? "正在构思最美的文字..." : "期待属于你们的专属故事")}
            </p>
          </div>
          
          {status === 'success' && (
            <div className="mt-4 flex items-center gap-2 text-green-500 font-bold animate-in slide-in-from-bottom-2">
              <CheckCircle2 size={18} /> 记忆已存入“我的珍藏”
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

