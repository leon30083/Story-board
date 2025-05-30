import React, { useEffect, useState } from 'react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [baseurl, setBaseurl] = useState('https://api.siliconflow.cn/v1');
  const [model, setModel] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null); // null/true/false
  const [modelsLoading, setModelsLoading] = useState(false);

  // 获取设置和模型列表
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setApiKey(data.api_key || '');
        setBaseurl(data.baseurl || 'https://api.siliconflow.cn/v1');
        setModel(data.model || '');
        setLoading(false);
      });
  }, []);

  // baseurl或key变更时自动刷新模型列表
  useEffect(() => {
    if (!baseurl || !apiKey) return;
    fetchModels();
    // eslint-disable-next-line
  }, [baseurl, apiKey]);

  // 获取模型列表
  const fetchModels = async () => {
    setModelsLoading(true);
    setCheckResult(null);
    setModels([]);
    try {
      const url = baseurl.replace(/\/$/, '') + '/models';
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (!res.ok) throw new Error('API不可用');
      const data = await res.json();
      let modelList = [];
      if (Array.isArray(data.data)) {
        modelList = data.data.map(m => m.id || m.model || m.name).filter(Boolean);
      } else if (Array.isArray(data.models)) {
        modelList = data.models.map(m => m.id || m.model || m.name).filter(Boolean);
      }
      setModels(modelList);
      if (modelList.length && !model) setModel(modelList[0]);
      setCheckResult(true);
    } catch (e) {
      setModels([]);
      setCheckResult(false);
    }
    setModelsLoading(false);
  };

  // 检测API连通性
  const handleCheck = async () => {
    setChecking(true);
    await fetchModels();
    setChecking(false);
  };

  const handleSave = async () => {
    setMsg('');
    setLoading(true);
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, baseurl, model })
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
              <label className="block text-sm font-semibold mb-1">API 地址（baseurl）</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
                value={baseurl}
                onChange={e => setBaseurl(e.target.value)}
                placeholder="https://api.siliconflow.cn/v1"
                autoComplete="off"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">API 密钥（key）</label>
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
                <button
                  className="px-2 py-1 text-xs bg-blue-100 rounded border hover:bg-blue-200"
                  onClick={handleCheck}
                  disabled={checking || !apiKey || !baseurl}
                >检测</button>
                {checking && <span className="text-xs text-gray-400 ml-1">检测中...</span>}
                {checkResult === true && <span className="text-green-600 text-xs ml-1">✔ 可用</span>}
                {checkResult === false && <span className="text-red-500 text-xs ml-1">× 不可用</span>}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">模型名（model）</label>
              <div className="flex items-center gap-2">
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  disabled={modelsLoading || !models.length}
                >
                  {modelsLoading && <option>加载中...</option>}
                  {!modelsLoading && !models.length && <option>无可用模型</option>}
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button
                  className="px-2 py-1 text-xs bg-gray-100 rounded border hover:bg-gray-200"
                  onClick={fetchModels}
                  disabled={modelsLoading || !apiKey || !baseurl}
                >刷新</button>
              </div>
              <div className="text-xs text-gray-400 mt-1">模型名列表由API实时获取</div>
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