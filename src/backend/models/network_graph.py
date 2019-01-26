#!/usr/bin/python3.6
import csv
import json
from io import StringIO
import plotly.plotly as plotly
import plotly.graph_objs as graphobject
import networkx as network


class NetworkGraph:
    def __init__(self, file):
        self.file = file
        self.json_complete = {}

    def returnJsonWithCoordinates(self):
        path_edge_file = self.createBasicDataAndReturnEdges()
        self.calculateCoordinates(path_edge_file)
        return self.json_complete

    def createBasicDataAndReturnEdges(self):
        data = []
        reader = csv.reader(self.file, delimiter=";")

        array_nodes = []
        array_links = []
        edge_content = ''

        for line in reader:

            # source node
            json_node_source = self.getNodeJson(line[0], line[1])
            source_node_id = json_node_source['id']

            # target node
            json_node_target = self.getNodeJson(line[3], line[4])
            target_node_id = json_node_target['id']

            # relation
            json_link = {}
            json_link['sourceId'] = source_node_id
            json_link['targetId'] = target_node_id
            json_link['ralation'] = line[2]
            json_link['approved'] = 'false'
            json_link['origin'] = 'matching algorithm'
            json_link['reposible'] = 'tool'

            # edge_list
            # item = (str(source_node_id), str(target_node_id), '')
            item = source_node_id + ',' + target_node_id + ',' + str(1) + '\n'
            # edge_list.append(item)
            edge_content = edge_content + item

            # add to json
            array_nodes.append(json_node_source)
            array_nodes.append(json_node_target)
            array_links.append(json_link)
            #data.append(line)

        self.json_complete['entities'] = array_nodes
        self.json_complete['links'] = array_links
        path_with_file = 'src/backend/dataExchange/edgeList.txt'
        self.writeToFile(path_with_file, edge_content)
        return path_with_file

    def calculateCoordinates(self, edges):
        graph = network.read_edgelist(edges, delimiter=',', create_using=network.Graph, data=(('weight', float),), nodetype=str)
        print(graph)

        self.calculateCoordinatestest()


    def calculateCoordinatestest(self):
        G = network.random_geometric_graph(100, 0.125)
        pos = network.get_node_attributes(G, 'pos')
        print(pos)

        dmin = 1
        ncenter = 0
        for n in pos:
            x, y = pos[n]
            d = (x - 0.5) ** 2 + (y - 0.5) ** 2
            if d < dmin:
                ncenter = n
                dmin = d

        p = network.single_source_shortest_path_length(G, ncenter)

        # Create Edges
        edge_trace = graphobject.Scatter(
            x=[],
            y=[],
            line=dict(width=0.5, color='#888'),
            hoverinfo='none',
            mode='lines')

        for edge in G.edges():
            x0, y0 = G.node[edge[0]]['pos']
            x1, y1 = G.node[edge[1]]['pos']
            edge_trace['x'] += tuple([x0, x1, None])
            edge_trace['y'] += tuple([y0, y1, None])

        node_trace = graphobject.Scatter(
            x=[],
            y=[],
            text=[],
            mode='markers',
            hoverinfo='text',
            marker=dict(
                showscale=True,
                # colorscale options
                # 'Greys' | 'YlGnBu' | 'Greens' | 'YlOrRd' | 'Bluered' | 'RdBu' |
                # 'Reds' | 'Blues' | 'Picnic' | 'Rainbow' | 'Portland' | 'Jet' |
                # 'Hot' | 'Blackbody' | 'Earth' | 'Electric' | 'Viridis' |
                colorscale='YlGnBu',
                reversescale=True,
                color=[],
                size=10,
                colorbar=dict(
                    thickness=15,
                    title='Node Connections',
                    xanchor='left',
                    titleside='right'
                ),
                line=dict(width=2)))

        for node in G.nodes():
            x, y = G.node[node]['pos']
            node_trace['x'] += tuple([x])
            node_trace['y'] += tuple([y])

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