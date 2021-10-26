# -*- coding: utf-8 -*

from flask import Flask, jsonify
from flask import make_response
from flask_cors import *

from controllers.search_controller import search_api
from controllers.node_controller import node_api
from controllers.rel_controller import rel_api
from controllers.photo_controller import photo_api

app = Flask(__name__)
# app.register_blueprint(search_api)
# app.register_blueprint(node_api)
# app.register_blueprint(rel_api)
app.register_blueprint(photo_api)
CORS(app, supports_credentials=True)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
