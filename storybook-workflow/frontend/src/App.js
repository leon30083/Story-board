import React, { useState, useEffect } from 'react';
import './App.css';
import Step0BasicInfo from './components/Step0BasicInfo';
import Step1Script from './components/Step1Script';
import Step2Prompts from './components/Step2Prompts';
import Step3Images from './components/Step3Images';
import ComfyUIWorkbench from './components/ComfyUIWorkbench';
import ProjectDashboard from './components/ProjectDashboard';
import Settings from './components/Settings';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const steps = [
  '0 用户输入基本信息',
  '1 故事文案创作',
  '2 分镜提示词生成',
  '3 绘本画面局部修改',
];

const DRAFT_KEY = 'storybook_workflow_draft';

function MainFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  // 全局数据流
  const [basicInfo, setBasicInfo] = useState({ theme: '', age: '', style: '', keywords: '' });
  const [script, setScript] = useState({ zh: '', en: '', classic: false });
  const [prompts, setPrompts] = useState(['', '', '']);
  const [images, setImages] = useState([]);
  // 项目仪表盘弹窗
  const [showDashboard, setShowDashboard] = useState(false);
  // 草稿检测
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      if (window.confirm('检测到未完成草稿，是否恢复？')) {
        const data = JSON.parse(draft);
        setBasicInfo(data.basicInfo || {});
        setScript(data.script || {});
        setPrompts(data.prompts || ['', '', '']);
        setImages(data.images || []);
      }
    }
  }, []);
  // 保存草稿
  const handleSaveDraft = () => {
    const data = { basicInfo, script, prompts, images };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    alert('草稿已保存！');
  };
  // 清除草稿
  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    alert('草稿已清除！');
  };
  // 选择项目后切换全局数据
  const handleSelectProject = p => {
    if (p.data) {
      setBasicInfo(p.data.basicInfo || {});
      setScript(p.data.script || {});
      setPrompts(p.data.prompts || ['', '', '']);
      setImages(p.data.images || []);
    } else {
      setBasicInfo({ theme: '', age: '', style: '', keywords: '' });
      setScript({ zh: '', en: '', classic: false });
      setPrompts(['', '', '']);
      setImages([]);
    }
    // 保存到草稿，便于主流程同步
    localStorage.setItem(DRAFT_KEY, JSON.stringify(p.data || { basicInfo: {}, script: {}, prompts: ['', '', ''], images: [] }));
  };
  // 每次全局数据变更时自动同步到当前项目（如有）
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('storybook_projects') || '[]');
    const draft = localStorage.getItem(DRAFT_KEY);
    if (projects.length && draft) {
      // 找到当前选中的项目（假设第一个为当前）
      const currentId = projects[0].id;
      const newProjects = projects.map((p, i) => i === 0 ? { ...p, data: JSON.parse(draft) } : p);
      localStorage.setItem('storybook_projects', JSON.stringify(newProjects));
    }
  }, [basicInfo, script, prompts, images]);
  return (
    <main className="flex-1 flex justify-center items-start">
      <section className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mt-8 mb-8 relative">
        {/* 右上角项目仪表盘按钮 */}
        <button className="absolute top-4 right-4 px-3 py-1 bg-gray-100 rounded shadow text-sm hover:bg-pink-100" onClick={() => setShowDashboard(true)}>
          📋 项目仪表盘
        </button>
        <ProjectDashboard visible={showDashboard} onClose={() => setShowDashboard(false)} onSelect={handleSelectProject} />
        {/* 卡片内分步进度条 */}
        <nav className="flex items-center justify-center text-base mb-8">
          {steps.map((label, i) => (
            <React.Fragment key={i}>
              <span
                className={`cursor-pointer px-2 py-1 rounded ${i === currentStep ? 'text-pink-500 font-bold bg-pink-50' : 'text-gray-400'}`}
                onClick={() => setCurrentStep(i)}
              >{label}</span>
              {i < steps.length - 1 && <span className="mx-2">→</span>}
            </React.Fragment>
          ))}
        </nav>
        {/* 主流程内容 */}
        <div>
          {currentStep === 0 ? <Step0BasicInfo value={basicInfo} onChange={setBasicInfo} /> :
            currentStep === 1 ? <Step1Script prevData={basicInfo} value={script} onChange={setScript} /> :
            currentStep === 2 ? <Step2Prompts scriptZhList={[script.zh]} value={prompts} onChange={setPrompts} /> :
            currentStep === 3 ? <Step3Images prompts={prompts} value={images} onChange={setImages} /> :
            <div className="text-gray-500">未知步骤</div>}
        </div>
        {/* 底部按钮（卡片内居中） */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex gap-2 mb-2">
            <button className="px-4 py-1 bg-gray-100 rounded text-sm" onClick={handleSaveDraft}>保存草稿</button>
            <button className="px-4 py-1 bg-gray-100 rounded text-sm" onClick={handleClearDraft}>清除草稿</button>
          </div>
          <div>
            {currentStep > 0 && (
              <button className="px-6 py-2 bg-gray-200 rounded mr-4" onClick={() => setCurrentStep(currentStep - 1)}>返回</button>
            )}
            <button
              className="px-6 py-2 bg-pink-500 text-white rounded"
              onClick={() => {
                if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
                else alert('创作流程完成！');
              }}
            >{currentStep < steps.length - 1 ? '下一步 →' : '完成'}</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(90deg, #E0F7FA 50%, #FCE4EC 50%)' }}>
        {/* 顶部导航栏 */}
        <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            <img src="https://img.alicdn.com/imgextra/i2/O1CN01Qw1QwB1w6Qw6Qw6Qw_!!6000000000000-2-tps-64-64.png" className="h-8" alt="logo" />
            <span className="font-bold text-xl text-gray-700">罗森 | 一站式绘本创作平台</span>
          </div>
          <nav className="flex items-center space-x-8 text-lg">
            <Link to="/" className="font-bold text-pink-500 border-b-2 border-pink-400 pb-1">首页</Link>
            <a href="#" className="text-gray-600 hover:text-pink-400">发现</a>
            <Link to="/settings" className="text-gray-600 hover:text-pink-400">设置</Link>
            <Link to="/bench" className="text-gray-600 hover:text-pink-400">工作台</Link>
          </nav>
          <button className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-2 rounded-full font-bold">登录/注册</button>
        </header>
        <Routes>
          <Route path="/" element={<MainFlow />} />
          <Route path="/bench" element={<ComfyUIWorkbench />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
