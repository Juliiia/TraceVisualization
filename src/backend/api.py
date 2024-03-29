#!/usr/bin/python3.6
import json
from io import StringIO
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin

from models.network_graph import NetworkGraph
from models.csv_translater import CsvTranslater
from models.neighbortype_barchart import NeighborTypeBarchart
from models.sankey_diagram import SankeyDiagram
from models.csv_exporter import CsvExporter

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
    sortby = request.args.get('sortby')
    barchart = NeighborTypeBarchart(sortby)
    response = barchart.createBarchart()
    return response


@app.route("/sankeydiagram", methods=["GET"])
def get_type_sankey_diagram():
    name = request.args.get('name')
    sankey = SankeyDiagram(name)
    response = sankey.createSankeyDiagram()
    return response


@app.route("/csvexport", methods=["GET"])
def get_csv_export():
    artifact = request.args.get('artifact')
    csv_exporter = CsvExporter(artifact)
    response = csv_exporter.createCSVFile()
    return response


if __name__ == "__main__":
    app.run(threaded=True)

