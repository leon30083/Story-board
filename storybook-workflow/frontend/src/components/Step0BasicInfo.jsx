import React, { useEffect, useState } from 'react';

export default function Step0BasicInfo({ value = {}, onChange, onNext }) {
  const [styles, setStyles] = useState([]);
  const [form, setForm] = useState({ theme: '', age: '', style: '', keywords: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/styles')
      .then(res => res.json())
      .then(data => setStyles(data));
  }, []);

  // 父组件数据变化时同步
  useEffect(() => {
    setForm(value || { theme: '', age: '', style: '', keywords: '' });
  }, [value]);

  // 表单变更同步到父组件
  const handleChange = (k, v) => {
    const newForm = { ...form, [k]: v };
    setForm(newForm);
    onChange && onChange(newForm);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm">主题</label>
          <input type="text" className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" placeholder="例如：草船借箭"
            value={form.theme} onChange={e => handleChange('theme', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">适龄段</label>
          <select className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" value={form.age} onChange={e => handleChange('age', e.target.value)}>
            <option value="">请选择</option>
            <option>3-5 岁</option>
            <option>5-8 岁</option>
            <option>8-10 岁</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">故事风格</label>
          <select className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" value={form.style} onChange={e => handleChange('style', e.target.value)}>
            <option value="">请选择</option>
            {styles.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <label className="block text-sm">关键词</label>
          <input type="text" className="w-full p-2 border rounded focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition hover:border-pink-400" placeholder="例如：勇敢、智慧、合作"
            value={form.keywords} onChange={e => handleChange('keywords', e.target.value)} />
        </div>
      </div>
      {/* 可选：风格模板预览 */}
      {form.style && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <div className="font-bold mb-1">风格模板示例：</div>
          <ul className="list-disc pl-5 text-xs text-gray-700">
            {(styles.find(s => String(s.id) === String(form.style))?.template || []).map((tpl, idx) => (
              <li key={idx}>{tpl}</li>
            ))}
          </ul>
        </div>
      )}
      {error && <div className="mt-4 text-red-500 text-sm font-semibold">{error}</div>}
      <div className="mt-6 flex justify-end">
        <button
          className="px-6 py-2 bg-pink-500 text-white rounded shadow hover:bg-pink-600 transition font-bold text-lg"
          onClick={() => {
            if (!form.theme || !form.age || !form.style) {
              setError('请填写完整主题、适龄段和故事风格！');
              return;
            }
            setError('');
            onNext && onNext(form);
          }}
        >
          下一步 →
        </button>
      </div>
    </div>
  );
} 