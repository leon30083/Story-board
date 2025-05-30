import React, { useState } from 'react';

// props: scriptZhList（上一步的中文旁白数组），style, theme 可选
export default function Step2Prompts({ scriptZhList = [
  '分镜1的中文旁白内容...',
  '分镜2的中文旁白内容...',
  '分镜3的中文旁白内容...'
], style = '', theme = '' }) {
  // 初始化分镜提示词列表
  const [prompts, setPrompts] = useState(
    scriptZhList.map((zh, idx) => ({ id: idx + 1, zhText: zh, prompt: '' }))
  );
  const [loading, setLoading] = useState(false);

  // AI生成分镜提示词
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/generate_prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: prompts.map(p => p.zhText), // 传递所有分镜的旁白
          style,
          theme
        })
      });
      const data = await resp.json();
      // 假设返回格式为 { prompts: ['提示词1', '提示词2', ...] }
      setPrompts(ps => ps.map((p, i) => ({ ...p, prompt: data.prompts?.[i] || '' })));
    } catch (e) {
      // 错误处理
      setPrompts(ps => ps.map(p => ({ ...p, prompt: '生成失败，请重试' })));
    }
    setLoading(false);
  };

  // 输入框编辑
  const handleChange = (id, value) => {
    setPrompts(ps => ps.map(p => p.id === id ? { ...p, prompt: value } : p));
  };

  // 保存、导出等功能可后续补充

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <span className="font-semibold text-lg">分镜提示词列表</span>
        <button className="px-4 py-1 bg-green-500 text-white rounded shadow hover:bg-green-600 transition" onClick={handleGenerate} disabled={loading}>
          {loading ? '生成中...' : 'AI生成'}
        </button>
      </div>
      {prompts.map((p, idx) => (
        <div key={p.id} className="mb-4">
          <div className="font-bold">分镜{idx + 1} 旁白：</div>
          <div className="mb-1 text-gray-700 text-sm bg-gray-50 rounded px-2 py-1">{p.zhText}</div>
          <label className="block text-sm mb-1">提示词</label>
          <textarea
            className="w-full h-20 p-2 border rounded"
            value={p.prompt}
            onChange={e => handleChange(p.id, e.target.value)}
            placeholder={`请输入分镜${idx + 1}的提示词...`}
          />
          {/* 示例展示区 */}
          <div className="text-xs text-gray-400 mt-1">示例：分镜{idx + 1}提示词...</div>
          {/* 错误提示 */}
          {p.prompt === '生成失败，请重试' && (
            <div className="text-xs text-red-500 mt-1">生成失败，请重试</div>
          )}
        </div>
      ))}
      <div className="mt-4 flex justify-end gap-2">
        <button className="px-4 py-1 bg-gray-200 rounded shadow hover:bg-gray-300 transition">批量导出</button>
        <button className="px-4 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition">保存</button>
        <button className="px-4 py-1 bg-pink-500 text-white rounded shadow hover:bg-pink-600 transition">下一步 →</button>
      </div>
    </div>
  );
} 