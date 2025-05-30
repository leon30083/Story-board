import React, { useState, useEffect } from 'react';

const DASHBOARD_KEY = 'storybook_projects';

export default function ProjectDashboard({ visible, onClose, onSelect }) {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(DASHBOARD_KEY) || '[]');
    setProjects(data);
  }, [visible]);

  const saveProjects = ps => {
    setProjects(ps);
    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(ps));
  };

  const handleNew = () => {
    if (!newName.trim()) return;
    const id = Date.now();
    const ps = [...projects, { id, name: newName, data: null }];
    saveProjects(ps);
    setNewName('');
  };
  const handleDelete = id => {
    saveProjects(projects.filter(p => p.id !== id));
  };
  const handleRename = (id, name) => {
    saveProjects(projects.map(p => p.id === id ? { ...p, name } : p));
    setEditingId(null);
    setEditingName('');
  };
  const handleSelect = p => {
    onSelect && onSelect(p);
    onClose && onClose();
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative">
        <button className="absolute top-2 right-4 text-gray-400 text-2xl" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-4">项目仪表盘</h2>
        <div className="mb-4 flex gap-2">
          <input className="flex-1 p-2 border rounded" placeholder="新项目名称" value={newName} onChange={e => setNewName(e.target.value)} />
          <button className="px-4 py-1 bg-pink-500 text-white rounded" onClick={handleNew}>新建</button>
        </div>
        <ul className="divide-y">
          {projects.map(p => (
            <li key={p.id} className="flex items-center py-2 gap-2">
              {editingId === p.id ? (
                <>
                  <input className="flex-1 p-1 border rounded" value={editingName} onChange={e => setEditingName(e.target.value)} />
                  <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => handleRename(p.id, editingName)}>保存</button>
                  <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setEditingId(null)}>取消</button>
                </>
              ) : (
                <>
                  <span className="flex-1 cursor-pointer hover:underline" onClick={() => handleSelect(p)}>{p.name}</span>
                  <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => { setEditingId(p.id); setEditingName(p.name); }}>重命名</button>
                  <button className="px-2 py-1 bg-red-400 text-white rounded" onClick={() => handleDelete(p.id)}>删除</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 