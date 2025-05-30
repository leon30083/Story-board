import React, { useState } from 'react';

export default function Step1Script() {
  const [params, setParams] = useState({ style: '', age: '', theme: '', classic: false });
  const [zhText, setZhText] = useState('');
  const [enText, setEnText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // TODO: 调用后端API生成脚本，暂用假数据
    setTimeout(() => {
      setZhText('这是AI生成的中文故事脚本。');
      setEnText('This is the AI-generated English script.');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* 左侧参数区 */}
      <div className="w-full md:w-1/3 space-y-4">
        <div>
          <label className="block text-sm">风格</label>
          <input className="w-full p-2 border rounded" value={params.style} onChange={e => setParams(p => ({ ...p, style: e.target.value }))} placeholder="如：沉静幻想型" />
        </div>
        <div>
          <label className="block text-sm">适龄段</label>
          <input className="w-full p-2 border rounded" value={params.age} onChange={e => setParams(p => ({ ...p, age: e.target.value }))} placeholder="如：5-8岁" />
        </div>
        <div>
          <label className="block text-sm">主题</label>
          <input className="w-full p-2 border rounded" value={params.theme} onChange={e => setParams(p => ({ ...p, theme: e.target.value }))} placeholder="如：勇敢、成长" />
        </div>
        <div className="flex items-center mt-2">
          <input type="checkbox" id="classic" checked={params.classic} onChange={e => setParams(p => ({ ...p, classic: e.target.checked }))} />
          <label htmlFor="classic" className="ml-2 text-sm">经典改编</label>
        </div>
        <button className="w-full bg-pink-500 text-white py-2 rounded mt-4" onClick={handleGenerate} disabled={loading}>{loading ? '生成中...' : 'AI生成脚本'}</button>
      </div>
      {/* 右侧中英双栏编辑器 */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        <div>
          <label className="block text-sm mb-1">中文脚本</label>
          <textarea className="w-full h-32 p-2 border rounded" value={zhText} onChange={e => setZhText(e.target.value)} placeholder="AI将生成中文故事脚本..." />
        </div>
        <div>
          <label className="block text-sm mb-1">英文脚本</label>
          <textarea className="w-full h-32 p-2 border rounded" value={enText} onChange={e => setEnText(e.target.value)} placeholder="AI will generate the English script..." />
        </div>
      </div>
    </div>
  );
} 