#!/usr/bin/python3.6
import csv
import json
from io import StringIO
import plotly.plotly as plotly
import plotly.graph_objs as graphobject
import networkx as network
import pandas as pandas


class NetworkGraph:
    def __init__(self, name, file):
        self.name = name
        self.file = file
        self.json_complete = {}
        self.graph = network.Graph()
        self.log_path = 'src/backend/log/'
        self.dataexchange_path = 'src/backend/dataExchange/'

    # workaround
    def returnJsonWithCoordinatespath(self):
        self.createJsonAndGraph()
        self.calculateCoordinates()
        self.addCoordinatesToJson()
        path_to_json = self.dataexchange_path + self.name + '.json'
        self.writeJsonFile(path_to_json, self.json_complete)
        return path_to_json

    def createJsonAndGraph(self):
        reader = csv.reader(self.file, delimiter=";")
        next(reader, None)  # skip the headers

        array_nodes = []
        array_links = []
        unique_nodes_set = set()
        allNodes = []

        for line in reader:

            source_node_id = line[0].strip() + ':' + line[1].strip()
            target_node_id = ''
            relation = ''
            allNodes.append(source_node_id)

            # HANDLE NODES
            if source_node_id not in unique_nodes_set:
                # create and add node json
                json_node_source = self.getNodeJson(line[0], line[1])
                array_nodes.append(json_node_source)
                # add node to graph
                self.graph.add_node(str(source_node_id))
                # add id to unique_nodes_set
                unique_nodes_set.add(source_node_id)

            if len(line) > 3 :
                target_node_id = line[3].strip() + ':' + line[4].strip()
                allNodes.append(target_node_id)
                relation = line[2]

                if target_node_id not in unique_nodes_set:
                    # create and add node json
                    json_node_target = self.getNodeJson(line[3], line[4])
                    array_nodes.append(json_node_target)
                    # add node to graph
                    self.graph.add_node(str(target_node_id))
                    # add id to unique_nodes_set
                    unique_nodes_set.add(target_node_id)



            # HANDEL RELATIONS
            json_link = {}
            json_link['sourceId'] = source_node_id
            json_link['targetId'] = target_node_id
            json_link['relation'] = relation
            json_link['approved'] = 'false'
            json_link['origin'] = 'matching algorithm'
            json_link['reposible'] = 'tool'

            # add edge to graph
            self.graph.add_edge(str(source_node_id), str(target_node_id), weight=1)
            array_links.append(json_link)

        # add part arrays to json
        self.json_complete['entities'] = array_nodes
        self.json_complete['links'] = array_links

        self.writeToFile(self.log_path + 'unique.txt', unique_nodes_set, True)
        self.writeToFile(self.log_path + 'allNodes.txt', allNodes, True)
        return

    def calculateCoordinates(self):
        pos = network.spring_layout(self.graph, k=0.04, iterations=10, scale=100)
        # Set result dataset positions as positions to be used in graph.
        network.set_node_attributes(self.graph, values=pos, name='pos')
        # Set entrance into network and exit from network as top left and bottom right nodes.
        pos[-2] = [0.0, 0.0]
        pos[-1] = [900.0, 900.0]
        return

    def addCoordinatesToJson(self):
        all_nodes = self.json_complete['entities']

        for node_id in network.nodes(self.graph):
            node = self.graph.node[node_id]

            for item in all_nodes:
                if node_id == item['id']:

                    json_coordinates = {}
                    json_coordinates['x'] = float(node['pos'][0])
                    json_coordinates['y'] = float(node['pos'][1])
                    item['coordinates'] = json_coordinates
                    item['neighbors'] = len(list(self.graph.neighbors(node_id)))
        return

    def writeToFile(self, path_file, logcontent, isList):
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
        outputfile = open(path_file, 'w')
        try:
            json.dump(content, outputfile)
        finally:
            outputfile.close()
        return

    def getNodeJson(self, node_type, node):
        # remove space
        node_type = node_type.strip()
        node = node.strip()
        # create json
        json_node_source = {}
        json_node_source['type'] = node_type
        json_node_source['name'] = node
        json_node_source['artifact'] = self.name
        source_node_id = node_type + ':' + node
        json_node_source['id'] = source_node_id
        return json_node_source