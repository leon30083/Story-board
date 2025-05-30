import React, { useState } from 'react';

export default function Step2Prompts() {
  const [prompts, setPrompts] = useState([
    { id: 1, text: '' },
    { id: 2, text: '' },
    { id: 3, text: '' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    // TODO: 调用后端API生成分镜提示词，暂用假数据
    setTimeout(() => {
      setPrompts([
        { id: 1, text: '清晨，森林场景，女主角与小狗...，3D皮克斯风格' },
        { id: 2, text: '午后，魔法蘑菇...，童话风格' },
        { id: 3, text: '傍晚，城堡前对峙大怪兽...，史诗氛围' },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleChange = (id, value) => {
    setPrompts(ps => ps.map(p => p.id === id ? { ...p, text: value } : p));
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <span className="font-semibold">分镜提示词列表</span>
        <button className="px-4 py-1 bg-green-500 text-white rounded" onClick={handleGenerate} disabled={loading}>{loading ? '生成中...' : 'AI生成'}</button>
      </div>
      <div className="space-y-4">
        {prompts.map((p, idx) => (
          <div key={p.id}>
            <label className="block text-sm mb-1">分镜{idx + 1} 提示词</label>
            <textarea className="w-full h-20 p-2 border rounded" value={p.text} onChange={e => handleChange(p.id, e.target.value)} placeholder={`示例：分镜${idx + 1}提示词...`} />
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <button className="px-4 py-1 bg-gray-200 rounded mr-2">批量导出</button>
        <button className="px-4 py-1 bg-blue-500 text-white rounded">保存</button>
      </div>
    </div>
  );
} 