import React, { useState, useEffect } from 'react';

const STYLE_KEY = 'storybook_styles';

export default function StyleManager({ visible, onClose, onChange }) {
  const [styles, setStyles] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingDesc, setEditingDesc] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STYLE_KEY) || '[]');
    setStyles(data);
  }, [visible]);

  const saveStyles = ss => {
    setStyles(ss);
    localStorage.setItem(STYLE_KEY, JSON.stringify(ss));
    onChange && onChange(ss);
  };

  const handleNew = () => {
    if (!newName.trim()) return;
    const id = Date.now();
    const ss = [...styles, { id, name: newName, desc: newDesc }];
    saveStyles(ss);
    setNewName('');
    setNewDesc('');
  };
  const handleDelete = id => {
    saveStyles(styles.filter(s => s.id !== id));
  };
  const handleEdit = (id, name, desc) => {
    saveStyles(styles.map(s => s.id === id ? { ...s, name, desc } : s));
    setEditingId(null);
    setEditingName('');
    setEditingDesc('');
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
        <button className="absolute top-2 right-4 text-gray-400 text-2xl" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-4">风格模板管理</h2>
        <div className="mb-4 flex gap-2">
          <input className="flex-1 p-2 border rounded" placeholder="新风格名称" value={newName} onChange={e => setNewName(e.target.value)} />
          <input className="flex-1 p-2 border rounded" placeholder="描述/示例" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <button className="px-4 py-1 bg-pink-500 text-white rounded" onClick={handleNew}>新建</button>
        </div>
        <ul className="divide-y">
          {styles.map(s => (
            <li key={s.id} className="flex items-center py-2 gap-2">
              {editingId === s.id ? (
                <>
                  <input className="flex-1 p-1 border rounded" value={editingName} onChange={e => setEditingName(e.target.value)} />
                  <input className="flex-1 p-1 border rounded" value={editingDesc} onChange={e => setEditingDesc(e.target.value)} />
                  <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => handleEdit(s.id, editingName, editingDesc)}>保存</button>
                  <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setEditingId(null)}>取消</button>
                </>
              ) : (
                <>
                  <span className="flex-1 cursor-pointer hover:underline">{s.name}</span>
                  <span className="flex-1 text-xs text-gray-500">{s.desc}</span>
                  <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => { setEditingId(s.id); setEditingName(s.name); setEditingDesc(s.desc); }}>编辑</button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded" onClick={() => handleDelete(s.id)}>删除</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 