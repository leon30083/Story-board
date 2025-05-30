import React, { useState } from 'react';
import './App.css';
import Step0BasicInfo from './components/Step0BasicInfo';
import Step1Script from './components/Step1Script';
import Step2Prompts from './components/Step2Prompts';
import Step3Images from './components/Step3Images';

const steps = [
  '0 用户输入基本信息',
  '1 故事文案创作',
  '2 分镜提示词生成',
  '3 绘本画面局部修改',
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(90deg, #E0F7FA 50%, #FCE4EC 50%)' }}>
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div className="flex items-center space-x-4">
          <img src="https://img.alicdn.com/imgextra/i2/O1CN01Qw1QwB1w6Qw6Qw6Qw_!!6000000000000-2-tps-64-64.png" className="h-8" alt="logo" />
          <span className="font-bold text-xl text-gray-700">罗森 | 一站式绘本创作平台</span>
        </div>
        <nav className="flex items-center space-x-8 text-lg">
          <a href="#" className="font-bold text-pink-500 border-b-2 border-pink-400 pb-1">首页</a>
          <a href="#" className="text-gray-600 hover:text-pink-400">发现</a>
          <a href="#" className="text-gray-600 hover:text-pink-400">博客</a>
          <a href="#" className="text-gray-600 hover:text-pink-400">工作台</a>
        </nav>
        <button className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-2 rounded-full font-bold">登录/注册</button>
      </header>

      {/* 主流程大卡片 */}
      <main className="flex-1 flex justify-center items-start">
        <section className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl mt-8 mb-8">
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
            {currentStep === 0 ? <Step0BasicInfo /> :
              currentStep === 1 ? <Step1Script /> :
              currentStep === 2 ? <Step2Prompts /> :
              currentStep === 3 ? <Step3Images /> :
              <div className="text-gray-500">未知步骤</div>}
          </div>
          {/* 底部按钮（卡片内居中） */}
          <div className="mt-8 flex justify-center">
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
        </section>
      </main>
    </div>
  );
}

export default App;
