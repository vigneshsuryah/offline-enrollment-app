from flask import Flask, render_template, request
import logging
app = Flask(__name__)


@app.route('/')
@app.route('/index')
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit_form():
    payload = request.get_json()
    first_name = payload['first_name']
    middle_name = payload['middle_name']
    last_name = payload['last_name']
    state = payload['state']
    address = payload['address']
    zipcode = payload['zipcode']
    print ('first_name : ' + first_name)
    print ('middle_name : ' + middle_name)
    print ('last_name : ' + last_name)
    print ('state : ' + state)
    print ('address : ' + address)
    print ('zipcode : ' + zipcode)
    return ''


@app.route('/sw.js', methods=['GET'])
def sw():
    resp = app.send_static_file('sw.js')
    resp.headers['Content-Type'] = 'application/javascript'
    return resp

@app.route('/states', methods=['GET'])
def states_get():
    resp = app.send_static_file('states.json')
    resp.headers['Content-Type'] = 'application/json'
    return resp

@app.route('/favicon.ico', methods=['GET'])
def favicon():
    return app.send_static_file('favicon.ico')


app.run(debug=True)