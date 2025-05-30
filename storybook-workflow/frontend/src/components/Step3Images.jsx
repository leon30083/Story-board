import React, { useState } from 'react';

export default function Step3Images() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = e => {
    setUploading(true);
    // TODO: 实现图片上传，暂用假数据
    setTimeout(() => {
      setImages([...images, { url: 'https://placehold.co/120x80', name: `图片${images.length + 1}` }]);
      setUploading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* 左侧上传区 */}
      <aside className="w-full md:w-1/4 space-y-4">
        <div className="border rounded h-32 flex items-center justify-center text-gray-400">上传图片</div>
        <input type="file" accept="image/*" className="w-full" onChange={handleUpload} disabled={uploading} />
        <div className="mt-2 space-y-2">
          {images.map((img, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <img src={img.url} alt={img.name} className="w-12 h-8 object-cover rounded" />
              <span className="text-xs text-gray-600">{img.name}</span>
            </div>
          ))}
        </div>
      </aside>
      {/* 右侧ComfyUI节点编辑器占位 */}
      <div className="w-full md:flex-1 mx-4">
        <div className="h-96 bg-gray-200 flex items-center justify-center text-gray-500 rounded">ComfyUI 节点编辑器（占位）</div>
        <div className="mt-4 flex space-x-2">
          <button className="px-4 py-1 bg-green-500 text-white rounded">全部生成</button>
          <button className="px-4 py-1 bg-gray-200 rounded">重试失败</button>
          <button className="px-4 py-1 bg-blue-500 text-white rounded">导出全部</button>
        </div>
      </div>
    </div>
  );
} 