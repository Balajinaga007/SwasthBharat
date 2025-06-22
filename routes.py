from flask import render_template, request, jsonify
from app import app
from life_stages_data import LIFE_STAGES_DATA

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/life-stages/<stage>')
def life_stage(stage):
    # Convert URL parameter to match our data keys
    stage_key = stage.replace('-', '_').lower()
    
    if stage_key not in LIFE_STAGES_DATA:
        return render_template('404.html'), 404
    
    stage_data = LIFE_STAGES_DATA[stage_key]
    return render_template('life_stage.html', stage_data=stage_data, stage_key=stage_key)

@app.route('/knowledge-center')
def knowledge_center():
    return render_template('knowledge_center.html')

@app.route('/data')
def data():
    return render_template('data.html')

@app.route('/help')
def help_page():
    return render_template('help.html')

@app.route('/api/search-technologies')
def search_technologies():
    query = request.args.get('q', '').lower()
    results = []
    
    for stage_key, stage_data in LIFE_STAGES_DATA.items():
        for tech in stage_data['technologies']:
            if query in tech['title'].lower() or query in tech['description'].lower():
                results.append({
                    'title': tech['title'],
                    'description': tech['description'],
                    'stage': stage_data['title']
                })
    
    return jsonify(results)
