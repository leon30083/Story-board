# 启动前后端开发服务脚本
# 使用方法：右键以PowerShell运行，或在终端输入 ./start-dev.ps1

# 启动后端（Flask）
Start-Process powershell -ArgumentList "cd backend; ..\venv\Scripts\activate; python app.py" -WindowStyle Normal

Start-Sleep -Seconds 2

# 启动前端（React）
Start-Process powershell -ArgumentList "cd frontend; npm start" -WindowStyle Normal 