import React, { useEffect, useState } from 'react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [promptSystem, setPromptSystem] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setApiKey(data.api_key || '');
        setPromptSystem(data.prompt_system || '');
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setMsg('');
    setLoading(true);
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, prompt_system: promptSystem })
    });
    if (res.ok) {
      setMsg('保存成功！');
    } else {
      setMsg('保存失败，请重试');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <section className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl mt-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-pink-500 text-center">设置</h2>
        {loading ? <div className="text-gray-400">加载中...</div> : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">硅基流动 API KEY</label>
              <div className="flex items-center gap-2">
                <input
                  type={apiKeyVisible ? 'text' : 'password'}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="请输入API KEY"
                  autoComplete="off"
                />
                <button
                  className="px-2 py-1 text-xs bg-gray-100 rounded border hover:bg-gray-200"
                  onClick={() => setApiKeyVisible(v => !v)}
                >{apiKeyVisible ? '隐藏' : '显示'}</button>
              </div>
              <div className="text-xs text-gray-400 mt-1">仅本地保存，前端脱敏显示</div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">主系统Prompt内容</label>
              <textarea
                className="w-full h-32 p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
                value={promptSystem}
                onChange={e => setPromptSystem(e.target.value)}
                placeholder="可自定义AI专家设定、风格要求等..."
              />
              <div className="text-xs text-gray-400 mt-1">建议仅高级用户修改，影响AI生成风格</div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-6 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600 transition font-bold text-lg"
                onClick={handleSave}
                disabled={loading}
              >保存</button>
            </div>
            {msg && <div className="mt-4 text-center text-green-600 font-semibold">{msg}</div>}
          </>
        )}
      </section>
    </div>
  );
} 