// 前端日志工具：logToServer
export function logToServer(level, msg, extra = {}) {
  // 控制台输出
  if (console[level]) {
    console[level](`[${level}]`, msg, extra);
  } else {
    console.log(`[${level}]`, msg, extra);
  }
  // 发送到后端日志API
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, msg, ...extra })
  }).catch(() => {});
} 