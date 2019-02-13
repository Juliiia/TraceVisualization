#!/usr/bin/python3.6
import json
from io import StringIO
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin

from models.network_graph import NetworkGraph

app = Flask(__name__)
CORS(app, origins='http://localhost:8000')


@app.route("/fileuploader", methods=["POST","GET"])
def print_out():
    path = request.form["path"]
    header = request.form["header"]
    networkgraph = NetworkGraph(header, path)
    text = networkgraph.returnJsonWithCoordinatespath()
    return text


if __name__ == "__main__":
    app.run()

