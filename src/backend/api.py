#!/usr/bin/python3.6
import json
from io import StringIO
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin

from models.network_graph import NetworkGraph
from models.csv_translater import CsvTranslater
from models.neighbortype_barchart import NeighborTypeBarchart

app = Flask(__name__)
CORS(app, origins='http://localhost:8000')


@app.route("/fileuploader", methods=["POST","GET"])
def print_out():
    path = request.form["path"]
    header = request.form["header"]
    csvTranslater = CsvTranslater(header, path)
    text = csvTranslater.retrunJsonFile()
    return text


@app.route("/networkgraphcreator", methods=["GET"])
def get_graph():
    name = request.args.get('name')
    networkGraph = NetworkGraph(name)
    pathToFile = networkGraph.returnNodesWithCoordinates()
    return pathToFile

@app.route("/typeneighborsbarchartofall", methods=["GET"])
def get_type_neighbors_chart_all():
    barchart = NeighborTypeBarchart()
    response = barchart.createBarchart()
    return response


if __name__ == "__main__":
    app.run(threaded=True)

