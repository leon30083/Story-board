import React, { useEffect, useState } from 'react';

// 新增：自动加载经典改编内容
async function fetchClassicGuide() {
  const resp = await fetch('/classic_guide.md');
  return await resp.text();
}

export default function Step1Script({ prevData = {}, value = {}, onChange }) {
  // 1. 风格列表
  const [styles, setStyles] = useState([]);
  // 2. 表单参数，支持回显和修改
  const [params, setParams] = useState({
    style: prevData.style || '',
    age: prevData.age || '',
    theme: prevData.theme || '',
    classic: value.classic || false,
    keywords: prevData.keywords || ''
  });
  // 3. AI生成的中英文脚本
  const [zhText, setZhText] = useState(value.zh || '');
  const [enText, setEnText] = useState(value.en || '');
  const [loading, setLoading] = useState(false);
  const [classicGuide, setClassicGuide] = useState('');
  const [error, setError] = useState('');

  // 获取风格列表
  useEffect(() => {
    fetch('/api/styles')
      .then(res => res.json())
      .then(data => setStyles(data));
  }, []);
  // 加载经典改编内容
  useEffect(() => {
    fetchClassicGuide().then(setClassicGuide);
  }, []);

  // AI生成脚本
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      // 拼接prompt
      const prompt = `风格：${params.style}\n适龄段：${params.age}\n主题：${params.theme}\n关键词：${params.keywords}\n${params.classic ? classicGuide : ''}\n请根据以上要求生成适合儿童的中英文故事脚本。`;
      const resp = await fetch('/api/generate_script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: params.style,
          age: params.age,
          theme: params.theme,
          classic: params.classic,
          keywords: params.keywords,
          prompt
        })
      });
      const data = await resp.json();
      setZhText(data.zh || '');
      setEnText(data.en || '');
      onChange && onChange({ ...params, zh: data.zh || '', en: data.en || '' });
      if (!data.zh || !data.en) setError('生成失败，请重试');
    } catch (e) {
      setZhText('');
      setEnText('');
      setError('生成失败，请重试');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* 左侧参数区 */}
      <div className="w-full md:w-1/3 space-y-4 bg-white rounded shadow p-4 border">
        <div>
          <label className="block text-sm">风格</label>
          <select className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" value={params.style} onChange={e => setParams(p => ({ ...p, style: e.target.value }))}>
            <option value="">请选择</option>
            {styles.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm">适龄段</label>
          <select className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" value={params.age} onChange={e => setParams(p => ({ ...p, age: e.target.value }))}>
            <option value="">请选择</option>
            <option>3-5 岁</option>
            <option>5-8 岁</option>
            <option>8-10 岁</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">主题</label>
          <input className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" value={params.theme} onChange={e => setParams(p => ({ ...p, theme: e.target.value }))} placeholder="如：勇敢、成长" />
        </div>
        <div>
          <label className="block text-sm">关键词</label>
          <input className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" value={params.keywords} onChange={e => setParams(p => ({ ...p, keywords: e.target.value }))} placeholder="如：勇敢、智慧、合作" />
        </div>
        <div className="flex items-center mt-2">
          <input type="checkbox" id="classic" checked={params.classic} onChange={e => setParams(p => ({ ...p, classic: e.target.checked }))} />
          <label htmlFor="classic" className="ml-2 text-sm">经典改编</label>
        </div>
        <button className="w-full bg-pink-500 text-white py-2 rounded mt-4 shadow hover:bg-pink-600 transition font-bold text-lg" onClick={handleGenerate} disabled={loading}>{loading ? '生成中...' : 'AI生成脚本'}</button>
      </div>
      {/* 右侧中英双栏编辑器 */}
      <div className="w-full md:w-2/3 flex flex-col gap-4 bg-white rounded shadow p-4 border">
        <div>
          <label className="block text-sm mb-1">中文脚本</label>
          <textarea className="w-full h-32 p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" value={zhText} onChange={e => setZhText(e.target.value)} placeholder="AI将生成中文故事脚本..." />
        </div>
        <div>
          <label className="block text-sm mb-1">英文脚本</label>
          <textarea className="w-full h-32 p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" value={enText} onChange={e => setEnText(e.target.value)} placeholder="AI will generate the English script..." />
        </div>
        {error && <div className="text-red-500 text-sm font-semibold mt-2">{error}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button className="px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition font-bold text-lg">保存</button>
          <button className="px-6 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600 transition font-bold text-lg">下一步 →</button>
        </div>
      </div>
    </div>
  );
} 