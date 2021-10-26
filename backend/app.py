# -*- coding: utf-8 -*

from flask import Flask, jsonify
from flask import make_response
from flask_cors import *

from controllers.search_controller import search_api
from controllers.node_controller import node_api
from controllers.rel_controller import rel_api
from controllers.photo_controller import photo_api

from controllers.user_controller import user_api
from controllers.post_controller import post_api
from controllers.comment_controller import comment_api
from controllers.restaurant_controller import restaurant_api

app = Flask(__name__)
app.register_blueprint(search_api)
app.register_blueprint(node_api)
app.register_blueprint(rel_api)
app.register_blueprint(photo_api)

app.register_blueprint(user_api)
app.register_blueprint(post_api)
app.register_blueprint(comment_api)
app.register_blueprint(restaurant_api)



CORS(app, supports_credentials=True)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
