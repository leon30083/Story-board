# 启动前后端开发服务脚本
# 使用方法：右键以PowerShell运行，或在终端输入 ./start-dev.ps1

# 启动后端（Flask，自动激活虚拟环境，兼容settings.json和环境变量）
Write-Host "[INFO] 启动后端服务..."
# 自动安装后端依赖
Start-Process powershell -ArgumentList "cd backend; ..\venv\Scripts\activate; if (Test-Path requirements.txt) { pip install -r requirements.txt }; python app.py" -WindowStyle Normal

Start-Sleep -Seconds 2

# 启动前端（React，自动检测依赖）
Write-Host "[INFO] 启动前端服务..."
if (!(Test-Path -Path 'frontend/node_modules')) {
    Write-Host "[INFO] 检测到未安装依赖，正在自动安装npm依赖..."
    Start-Process powershell -ArgumentList "cd frontend; npm install" -Wait
}
Start-Process powershell -ArgumentList "cd frontend; npm start" -WindowStyle Normal 