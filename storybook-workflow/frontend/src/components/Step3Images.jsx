import React, { useState } from 'react';

// props: prompts（分镜提示词数组）
export default function Step3Images({ prompts = [
  '分镜1提示词示例',
  '分镜2提示词示例',
  '分镜3提示词示例'
] }) {
  // 每个分镜一张图片，初始为空
  const [images, setImages] = useState(prompts.map((p, idx) => ({
    id: idx + 1,
    prompt: p,
    url: '',
    loading: false,
    error: ''
  })));

  // AI生成全部图片
  const handleGenerateAll = async () => {
    setImages(imgs => imgs.map(img => ({ ...img, loading: true, error: '' })));
    try {
      const resp = await fetch('/api/generate_images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompts: images.map(img => img.prompt) })
      });
      const data = await resp.json();
      // 假设返回格式 { urls: ['url1', 'url2', ...] }
      setImages(imgs => imgs.map((img, i) => ({
        ...img,
        url: data.urls?.[i] || '',
        loading: false,
        error: data.urls?.[i] ? '' : '生成失败'
      })));
    } catch (e) {
      setImages(imgs => imgs.map(img => ({ ...img, loading: false, error: '生成失败' })));
    }
  };

  // 重试单张图片
  const handleRetry = async idx => {
    setImages(imgs => imgs.map((img, i) => i === idx ? { ...img, loading: true, error: '' } : img));
    try {
      const resp = await fetch('/api/generate_images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompts: [images[idx].prompt] })
      });
      const data = await resp.json();
      setImages(imgs => imgs.map((img, i) => i === idx ? {
        ...img,
        url: data.urls?.[0] || '',
        loading: false,
        error: data.urls?.[0] ? '' : '生成失败'
      } : img));
    } catch (e) {
      setImages(imgs => imgs.map((img, i) => i === idx ? { ...img, loading: false, error: '生成失败' } : img));
    }
  };

  // 导出全部图片（简单实现：下载所有图片）
  const handleExportAll = () => {
    images.forEach(img => {
      if (img.url) {
        const a = document.createElement('a');
        a.href = img.url;
        a.download = `分镜${img.id}.jpg`;
        a.click();
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4 flex justify-between items-center">
        <span className="font-semibold text-lg">分镜图片生成</span>
        <div className="flex gap-2">
          <button className="px-4 py-1 bg-green-500 text-white rounded" onClick={handleGenerateAll}>全部生成</button>
          <button className="px-4 py-1 bg-blue-500 text-white rounded" onClick={handleExportAll}>导出全部</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <div key={img.id} className="border rounded p-4 flex flex-col items-center bg-white shadow">
            <div className="font-bold mb-2">分镜{img.id}</div>
            <div className="text-xs text-gray-600 mb-2">提示词：{img.prompt}</div>
            <div className="w-40 h-28 flex items-center justify-center bg-gray-100 rounded mb-2">
              {img.loading ? (
                <span className="text-pink-500">生成中...</span>
              ) : img.url ? (
                <img src={img.url} alt={`分镜${img.id}`} className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-gray-400">未生成</span>
              )}
            </div>
            {img.error && <div className="text-xs text-red-500 mb-2">{img.error}</div>}
            <button className="px-3 py-1 bg-gray-200 rounded text-sm" onClick={() => handleRetry(idx)} disabled={img.loading}>重试</button>
          </div>
        ))}
      </div>
    </div>
  );
} 