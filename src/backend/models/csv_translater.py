#!/usr/bin/python3.6
import csv
import json

from models.path_manager import *


class CsvTranslater:
    def __init__(self, name, path):
        self.name = name
        self.path = path
        self.json_complete = {}
        self.log_path = getPathToLogFolder()
        self.dataexchange_path = getPathToDataExchangeFolder()

    def retrunJsonFile(self):
        self.createJsonAndGraph()
        path_to_json = getPathOfMainJsonFile(self.name)
        self.writeJsonFile(path_to_json, self.json_complete)
        return path_to_json

    def createJsonAndGraph(self):
        file = open(self.path, 'r', encoding='utf-8', errors='replace')

        array_nodes = []
        array_links = []
        unique_nodes_set = set()
        all_nodes = []
        error_lines = ''

        reader = csv.reader(file, quotechar='"', delimiter=";", quoting=csv.QUOTE_NONE, skipinitialspace=True)
        next(reader, None)  # skip the headers

        for line in reader:
            # for line in reader:
            source_node_id = ''
            target_node_id = ''
            relation = ''

            # HANDLE NODES
            if len(line) > 1:
                source_node_id = line[0].strip() + ':' + line[1].strip()
                all_nodes.append(source_node_id)

                if source_node_id not in unique_nodes_set:
                    # create and add node json
                    json_node_source = self.getNodeJson(line[0], line[1])
                    array_nodes.append(json_node_source)
                    # add id to unique_nodes_set
                    unique_nodes_set.add(source_node_id)

                if len(line) > 3:
                    target_node_id = line[3].strip() + ':' + line[4].strip()
                    all_nodes.append(target_node_id)
                    relation = line[2]

                    if target_node_id not in unique_nodes_set:
                        # create and add node json
                        json_node_target = self.getNodeJson(line[3], line[4])
                        array_nodes.append(json_node_target)
                        # add id to unique_nodes_set
                        unique_nodes_set.add(target_node_id)

                else:
                    error_lines = error_lines + '\n' + 'empty target entity ' + line[0] + ';' + line[1]

            else:
                error_lines = error_lines + '\n' + 'empty source entity'

            # HANDEL RELATIONS
            json_link = {}
            json_link['sourceId'] = source_node_id
            json_link['targetId'] = target_node_id
            json_link['relation'] = relation
            json_link['approved'] = 'false'
            json_link['origin'] = 'matching algorithm'
            json_link['reposible'] = 'tool'

            array_links.append(json_link)

        # add part arrays to json
        self.json_complete['entities'] = array_nodes
        self.json_complete['links'] = array_links

        self.writeToFile(self.log_path + 'unique.txt', unique_nodes_set, True)
        self.writeToFile(self.log_path + 'error_lines.txt', error_lines, False)
        # self.writeToFile(self.log_path + 'all_nodes.txt', all_nodes, True)
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

    def writeJsonFile(self, path_file, content):
        print('writeJsonFile ' + path_file)
        outputfile = open(path_file, 'w')
        try:
            json.dump(content, outputfile)
        finally:
            outputfile.close()
        return

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