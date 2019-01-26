#!/usr/bin/python3.6
import json
from io import StringIO
from flask import Flask, request, jsonify,Response
from flask_cors import CORS, cross_origin

from models.network_graph import NetworkGraph

app = Flask(__name__)
CORS(app, origins='http://localhost:8000')


@app.route("/fileuploader", methods=["POST"])
def print_out():
    file = request.get_data()
    networkgraph = NetworkGraph(StringIO(file.decode("utf-8")))
    text = networkgraph.returnJsonWithCoordinates()
    return jsonify(text)


if __name__ == "__main__":
    app.run()

