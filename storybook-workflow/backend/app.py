from flask import Flask, request, jsonify
import os, json
from openai import OpenAI
import datetime

app = Flask(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
STYLES_PATH = os.path.join(DATA_DIR, 'styles.json')
SETTINGS_PATH = os.path.join(DATA_DIR, 'settings.json')

# 硅基流动API配置（openai兼容）
client = OpenAI(
    api_key="sk-xldrbsxrglbhrlyfcxjitbctdtcskkcpuelqnpdewbwrgsjk",  # 请替换为你的硅基流动API KEY
    base_url="https://api.siliconflow.cn/v1"
)

# 简单风格模板API
@app.route('/api/styles', methods=['GET'])
def get_styles():
    if not os.path.exists(STYLES_PATH):
        return jsonify([])
    with open(STYLES_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    # 兼容对象或数组格式
    if isinstance(data, dict):
        return jsonify([dict(id=k, **v) for k, v in data.items()])
    return jsonify(data)

# 动态prompt模板（参考gpts-prompt.md）
PROMPT_SYSTEM = (
    "你是一位儿童绘本创作专家，熟练掌握10种语言风格与创作模板（已上传为风格模块 JSON）。"
    "用户会提供目标年龄段、绘本主题、情绪期望或参考绘本风格，你的任务是：\n"
    "1. 如果用户只给出模糊输入，如'我要一个讲勇敢的故事'，你应主动推荐3种风格模板（从JSON中筛选匹配年龄+主题）\n"
    "2. 一旦用户选定某种风格编号，你应自动调用对应风格中的语言模板与句式生成绘本结构/旁白（无需用户重复描述）\n"
    "3. 你必须严格遵守每种风格的语言节奏与主题适配范围\n"
    "4. 所有生成结果需适合2-10岁儿童，语言简洁、画面感强、适合图文同步\n"
    "5. 如果用户请求改编中国传统神话/寓言/经典故事（如《嫦娥奔月》《女娲补天》等），你必须调用《经典改编GPT指导手册》中定义的流程：\n"
    "- 保留原作标题，不得重命名\n"
    "- 保留经典情节节点，不得改写结构\n"
    "- 结合目标年龄段，调整为简洁易懂的语言\n"
    "- 选择与题材最适配的风格（如沉静幻想型用于神话）\n"
    "- 每页生成中英文对照文本与配图建议，结尾强化文化寓意\n"
    "默认输出为中英文对照，如无说明，每页为一句旁白。"
)

def load_settings():
    if os.path.exists(SETTINGS_PATH):
        with open(SETTINGS_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "api_key": os.environ.get("SILICONFLOW_API_KEY", ""),
        "baseurl": "https://api.siliconflow.cn/v1",
        "model": "deepseek-ai/DeepSeek-V3"
    }

def save_settings(settings):
    with open(SETTINGS_PATH, 'w', encoding='utf-8') as f:
        json.dump(settings, f, ensure_ascii=False, indent=2)

@app.route('/api/settings', methods=['GET'])
def get_settings():
    settings = load_settings()
    key = settings.get("api_key", "")
    if key and len(key) > 8:
        key = key[:4] + "****" + key[-4:]
    return jsonify({
        "api_key": key,
        "baseurl": settings.get("baseurl", "https://api.siliconflow.cn/v1"),
        "model": settings.get("model", "deepseek-ai/DeepSeek-V3")
    })

@app.route('/api/settings', methods=['POST'])
def update_settings():
    data = request.json
    settings = load_settings()
    if "api_key" in data:
        settings["api_key"] = data["api_key"]
    if "baseurl" in data:
        settings["baseurl"] = data["baseurl"]
    if "model" in data:
        settings["model"] = data["model"]
    save_settings(settings)
    return jsonify({"success": True})

def log_model_communication(level, msg, extra=None):
    log_path = os.path.join(os.path.dirname(__file__), 'frontend.log')
    log_line = f"{level} | {msg} | {json.dumps(extra or {}, ensure_ascii=False)}"
    with open(log_path, 'a', encoding='utf-8') as f:
        f.write(log_line + "\n")
    print(log_line)

@app.route('/api/generate_script', methods=['POST'])
def generate_script():
    data = request.json
    style = data.get('style', '')
    age = data.get('age', '')
    theme = data.get('theme', '')
    classic = data.get('classic', False)
    keywords = data.get('keywords', '')
    # 动态组装用户prompt
    user_prompt = f"请根据以下要求生成适合儿童的绘本故事文稿，输出每页中英文对照：\n"
    user_prompt += f"风格编号：{style}\n" if style else ''
    user_prompt += f"适龄段：{age}\n" if age else ''
    user_prompt += f"主题：{theme}\n" if theme else ''
    user_prompt += f"关键词：{keywords}\n" if keywords else ''
    if classic:
        user_prompt += "请严格按照中国经典故事改编流程生成，保留原作标题和情节节点。\n"
    user_prompt += "每页为一句旁白，先中文后英文。"
    log_model_communication('info', '大模型请求prompt', {'prompt': user_prompt, 'api': '/api/generate_script'})
    # 调用硅基流动API
    try:
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V3",
            messages=[
                {"role": "system", "content": PROMPT_SYSTEM},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1024
        )
        content = response.choices[0].message.content
        log_model_communication('info', '大模型返回内容', {'response': content, 'api': '/api/generate_script'})
        # 简单分割中英文（如AI输出格式为：每页一行，中文/英文交替）
        zh_lines, en_lines = [], []
        for line in content.split('\n'):
            line = line.strip()
            if not line:
                continue
            if line.startswith('中文') or line.startswith('【中文'):
                zh_lines.append(line)
            elif line.startswith('英文') or line.startswith('【英文'):
                en_lines.append(line)
            elif len(zh_lines) <= len(en_lines):
                zh_lines.append(line)
            else:
                en_lines.append(line)
        zh = '\n'.join(zh_lines)
        en = '\n'.join(en_lines)
        return jsonify({'zh': zh, 'en': en, 'prompt': user_prompt, 'model_response': content})
    except Exception as e:
        log_model_communication('error', '大模型请求异常', {'error': str(e), 'api': '/api/generate_script'})
        return jsonify({'zh': '', 'en': '', 'error': str(e), 'prompt': user_prompt}), 500

@app.route('/api/generate_prompts', methods=['POST'])
def generate_prompts():
    data = request.json
    script_list = data.get('script', [])
    style = data.get('style', '')
    theme = data.get('theme', '')
    # 动态组装prompt
    user_prompt = f"请为以下每个分镜旁白生成简洁的英文分镜提示词，输出JSON数组：\n"
    user_prompt += f"风格编号：{style}\n" if style else ''
    user_prompt += f"主题：{theme}\n" if theme else ''
    user_prompt += "分镜旁白：\n"
    user_prompt += '\n'.join([f"{i+1}. {s}" for i, s in enumerate(script_list)])
    log_model_communication('info', '大模型请求prompt', {'prompt': user_prompt, 'api': '/api/generate_prompts'})
    try:
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V3",
            messages=[
                {"role": "system", "content": "你是一个专业的儿童绘本分镜AI助手，输出JSON数组。"},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        import json as pyjson
        prompts = pyjson.loads(response.choices[0].message.content)
        log_model_communication('info', '大模型返回内容', {'response': response.choices[0].message.content, 'api': '/api/generate_prompts'})
        return jsonify({'prompts': prompts, 'prompt': user_prompt, 'model_response': response.choices[0].message.content})
    except Exception as e:
        log_model_communication('error', '大模型请求异常', {'error': str(e), 'api': '/api/generate_prompts'})
        return jsonify({'prompts': [], 'error': str(e), 'prompt': user_prompt}), 500

@app.route('/api/log', methods=['POST'])
def log_frontend():
    data = request.json
    level = data.get('level', 'INFO')
    msg = data.get('msg', '')
    extra = {k: v for k, v in data.items() if k not in ('level', 'msg')}
    log_line = f"{level} | {msg} | {json.dumps(extra, ensure_ascii=False)}\n"
    log_path = os.path.join(os.path.dirname(__file__), 'frontend.log')
    with open(log_path, 'a', encoding='utf-8') as f:
        f.write(log_line)
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True) 