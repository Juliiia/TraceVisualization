#!/usr/bin/python3.6
import csv
import json
from io import StringIO
import plotly.plotly as plotly
import plotly.graph_objs as graphobject
import networkx as network
import pandas as pandas


class NetworkGraph:
    def __init__(self, file):
        self.file = file
        self.json_complete = {}
        self.graph = network.Graph()

    def returnJsonWithCoordinates(self):
        self.createJsonAndGraph()
        path_to_file = self.calculateCoordinates()
        self.addCoordinatesToJson(path_to_file)
        return self.json_complete

    def createJsonAndGraph(self):
        reader = csv.reader(self.file, delimiter=";")
        next(reader, None)  # skip the headers

        array_nodes = []
        array_links = []
        unique_nodes_set = set()

        for line in reader:

            source_node_id = line[0].strip() + ':' + line[1].strip()
            target_node_id = line[3].strip() + ':' + line[4].strip()

            # HANDLE NODES
            if source_node_id not in unique_nodes_set:
                # create and add node json
                json_node_source = self.getNodeJson(line[0], line[1])
                array_nodes.append(json_node_source)
                # add node to graph
                self.graph.add_node(str(source_node_id))
                # add id to unique_nodes_set
                unique_nodes_set.add(source_node_id)

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
            json_link['ralation'] = line[2]
            json_link['approved'] = 'false'
            json_link['origin'] = 'matching algorithm'
            json_link['reposible'] = 'tool'

            # add edge to graph
            self.graph.add_edge(str(source_node_id), str(target_node_id), weight=1)
            array_links.append(json_link)

        # add part arrays to json
        self.json_complete['entities'] = array_nodes
        self.json_complete['links'] = array_links

    def calculateCoordinates(self):
        pos = network.spring_layout(self.graph, k=0.04, iterations=10, scale=100)
        # Set result dataset positions as positions to be used in graph.
        network.set_node_attributes(self.graph, values=pos, name='pos')
        # Set entrance into network and exit from network as top left and bottom right nodes.
        pos[-2] = [100.0, 0.0]
        pos[-1] = [0.0, 100.0]
        # Structure output in pandas dataframe.
        positions = pandas.DataFrame(pos).transpose()
        positions.columns = ['X', 'Y']
        # Export to csv.
        path_to_file = 'src/backend/dataExchange/nodepositions.csv'
        positions.to_csv(path_to_file, encoding='utf-8', index_label='ID')
        return path_to_file

    def addCoordinatesToJson(self, path_to_file):
        all_nodes = self.json_complete['entities']
        with open(path_to_file, 'rt') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            next(csv_reader, None)  # skip the headers

            for item in all_nodes:
                node_id = item['id']

                for row in csv_reader:
                    print(node_id + '  #### ' + row[0])
                    if node_id == row[0]:
                        print('found equel')

                        json_coordinates = {}
                        json_coordinates['x'] = float(row[1])
                        json_coordinates['y'] = float(row[2])
                        item['coordinates'] = json_coordinates
                        break

        self.json_complete['entities'] = all_nodes

    def writeToFile(self, path_file, logcontent):
        log = open(path_file, 'w')
        log.write(logcontent)

    def getNodeJson(self, node_type, node):
        # remove space
        node_type = node_type.strip()
        node = node.strip()
        # create json
        json_node_source = {}
        json_node_source['type'] = node_type
        json_node_source['name'] = node
        source_node_id = node_type + ':' + node
        json_node_source['id'] = source_node_id
        return json_node_source