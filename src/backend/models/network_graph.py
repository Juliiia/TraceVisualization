#!/usr/bin/python3.6
import csv
import json
import os
from io import StringIO
import plotly.plotly as plotly
import plotly.graph_objs as graphobject
import networkx as network
import pandas as pandas

from models.path_manager import *


class NetworkGraph:
    def __init__(self, name):
        self.name = name
        self.pathToJson = getPathOfMainJsonFile(self.name)
        self.graph = network.Graph()
        self.log_path = 'src/backend/log/'
        self.dataexchange_path = 'src/backend/dataExchange/'

    def addNode(self, node_id):
        self.graph.add_node(str(node_id))

    def addEdge(self, source_id, target_id):
        self.graph.add_edge(str(source_id), str(target_id), weight=1)

    def returnNodesWithCoordinates(self):
        response = 'waiting'
        result = self.createGraph()
        if result:
            self.calculateCoordinates()
            json_data = self.createJsonData()
            response = getPathOfNetworkJsonFile(self.name)
            self.writeJsonFile(response, json_data)

        return response

    def createGraph(self):
        print('createGraph')
        if os.path.isfile(self.pathToJson):
            json_file = open(self.pathToJson, 'r')
        else:
            return False

        links = json.load(json_file)
        if links['links']:
            for item in links['links']:
                self.graph.add_edge(str(item['sourceId']), str(item['targetId']), weight=1)
            return True
        else:
            return False

    def calculateCoordinates(self):
        print('calculateCoordinates')
        pos = network.spring_layout(self.graph, k=0.04, iterations=10, scale=100)
        # Set result dataset positions as positions to be used in graph.
        network.set_node_attributes(self.graph, values=pos, name='pos')
        # Set entrance into network and exit from network as top left and bottom right nodes.
        pos[-2] = [0.0, 0.0]
        pos[-1] = [1000.0, 1000.0]
        return

    def createJsonData(self):
        print('createJson')
        json_data = {}

        for node_id in network.nodes(self.graph):
            node = self.graph.node[node_id]

            json_coordinates = {}
            json_coordinates['x'] = float(node['pos'][0])
            json_coordinates['y'] = float(node['pos'][1])
            json_coordinates['neighbors'] = len(list(self.graph.neighbors(node_id)))
            json_data[node_id] = json_coordinates

        return json_data

    def writeToFile(self, path_file, logcontent, isList):
        print('writeToFile ' + path_file)
        log = open(path_file, 'w')
        try:
            if isList:
                for item in logcontent:
                    log.write('%s\n' % item)
            else:
                log.write(logcontent)
        finally:
            log.close()
        return

    def writeJsonFile(self, path_file, content):
        print('writeJsonFile ' + path_file)
        outputfile = open(path_file, 'w')
        try:
            json.dump(content, outputfile)
        finally:
            outputfile.close()
        return

