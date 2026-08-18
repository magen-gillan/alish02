import json
from pathlib import Path

source = Path('/tmp/100avatars.json')
items = json.loads(source.read_text())
for item in items:
    if item.get('format') == 'VRM' and item.get('is_public') and item.get('model_file_url'):
        print(json.dumps({
            'name': item.get('name'),
            'number': item.get('metadata', {}).get('number'),
            'model_file_url': item.get('model_file_url'),
            'thumbnail_url': item.get('thumbnail_url'),
            'project_id': item.get('project_id'),
        }, ensure_ascii=False))
