from flask import Flask, jsonify
import os
import json

app = Flask(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
STYLES_PATH = os.path.join(DATA_DIR, 'styles.json')

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

if __name__ == '__main__':
    app.run(debug=True) 