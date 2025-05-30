import React, { useRef, useState } from 'react';

// 简单canvas遮罩工具
function MaskCanvas({ image, onMaskChange }) {
  const canvasRef = useRef();
  const [drawing, setDrawing] = useState(false);

  const handleMouseDown = e => {
    setDrawing(true);
    draw(e);
  };
  const handleMouseUp = () => setDrawing(false);
  const handleMouseMove = e => {
    if (drawing) draw(e);
  };
  const draw = e => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.nativeEvent.clientX - rect.left;
    const y = e.nativeEvent.clientY - rect.top;
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
    // 导出mask
    onMaskChange(canvas.toDataURL());
  };
  // 每次图片变化时重置canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image) {
      const img = new window.Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = image;
    }
  }, [image]);
  return (
    <canvas
      ref={canvasRef}
      width={256}
      height={192}
      className="border rounded cursor-crosshair bg-gray-100"
      style={{ display: image ? 'block' : 'none' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
}

export default function ComfyUIWorkbench() {
  // 两张图片和mask
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [mask1, setMask1] = useState(null);
  const [mask2, setMask2] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInput1 = useRef();
  const fileInput2 = useRef();

  // 上传图片
  const handleFileChange = (e, setImg) => {
    const file = e.target.files[0];
    if (file) setImg(URL.createObjectURL(file));
  };

  // 执行一致性处理
  const handleProcess = async () => {
    setLoading(true);
    setError('');
    setResultUrl('');
    try {
      // 实际应上传两图、两mask、prompt到后端
      // 这里只做前端mock
      // const formData = new FormData();
      // formData.append('img1', fileInput1.current.files[0]);
      // formData.append('img2', fileInput2.current.files[0]);
      // formData.append('mask1', mask1);
      // formData.append('mask2', mask2);
      // formData.append('prompt', prompt);
      // const resp = await fetch('/api/comfyui/consistency', { method: 'POST', body: formData });
      // const data = await resp.json();
      // setResultUrl(data.url);
      setTimeout(() => {
        setResultUrl('https://placehold.co/320x220?text=一致性处理结果');
        setLoading(false);
      }, 1500);
    } catch (e) {
      setError('处理失败，请重试');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-6">ComfyUI 一致性换装/局部编辑工作台</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* 参考图 */}
        <div>
          <label className="block mb-1 font-semibold">参考图（图1）</label>
          <input type="file" accept="image/*" ref={fileInput1} onChange={e => handleFileChange(e, setImg1)} className="mb-2" />
          {img1 && <img src={img1} alt="参考图" className="w-64 h-48 object-cover rounded border mb-2" />}
          {img1 && <MaskCanvas image={img1} onMaskChange={setMask1} />}
          <div className="text-xs text-gray-500 mt-1">在图1上涂抹参考区域</div>
        </div>
        {/* 待处理图 */}
        <div>
          <label className="block mb-1 font-semibold">待处理图（图2）</label>
          <input type="file" accept="image/*" ref={fileInput2} onChange={e => handleFileChange(e, setImg2)} className="mb-2" />
          {img2 && <img src={img2} alt="待处理图" className="w-64 h-48 object-cover rounded border mb-2" />}
          {img2 && <MaskCanvas image={img2} onMaskChange={setMask2} />}
          <div className="text-xs text-gray-500 mt-1">在图2上涂抹要处理区域</div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">分镜提示词/参数</label>
        <input type="text" className="w-full p-2 border rounded" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="如：统一服装、鞋子等" />
      </div>
      <div className="mb-4">
        <button className="px-6 py-2 bg-green-500 text-white rounded" onClick={handleProcess} disabled={loading || !img1 || !img2 || !mask1 || !mask2}>
          {loading ? '处理中...' : '执行一致性处理'}
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {resultUrl && (
        <div className="mb-4">
          <div className="font-semibold mb-1">处理结果</div>
          <img src={resultUrl} alt="一致性处理结果" className="w-80 h-56 object-cover rounded border" />
        </div>
      )}
    </div>
  );
} 