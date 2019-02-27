#!/usr/bin/python3.6
import csv
import json

from models.path_name_manager import *


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
        all_nodes_with_num_id = {}

        # to count neighbors
        node_is_source_node = {}
        node_is_target_node = {}

        # to collect all outgoing link ids by Type
        relations_by_node_id = {}

        error_lines = ''
        counter = 0  # to get short and unique ids

        reader = csv.reader(file, quotechar='"', delimiter=";", quoting=csv.QUOTE_NONE, skipinitialspace=True)
        next(reader, None)  # skip the headers

        for line in reader:
            # for line in reader:

            # HANDLE NODES
            # SOURCE NODE //////////////////////////
            if len(line) > 1 and '/*' not in line[0]:

                source_node_id = line[0].strip() + ':' + line[1].strip()
                source_node_id_numeric = ''

                if source_node_id not in unique_nodes_set:
                    # create and add node json
                    counter = counter + 1
                    source_node_id_numeric = getNodeId(self.name, counter)
                    json_node_source = self.getNodeJson(line[0], line[1], source_node_id_numeric)
                    array_nodes.append(json_node_source)
                    # store numeric id to node
                    all_nodes_with_num_id[source_node_id] = source_node_id_numeric
                    # increment source node counter
                    node_is_source_node[source_node_id_numeric] = 1
                    node_is_target_node[source_node_id_numeric] = 0
                    # add id to unique_nodes_set
                    unique_nodes_set.add(source_node_id)
                else:
                    # get numeric id
                    source_node_id_numeric = all_nodes_with_num_id[source_node_id]
                    # increment source node counter
                    node_is_source_node[source_node_id_numeric] = node_is_source_node[source_node_id_numeric] + 1

                # TARGET NODE //////////////////////////
                if len(line) > 3:
                    target_node_id = line[3].strip() + ':' + line[4].strip()
                    target_node_id_numeric = ''
                    relation = line[2]

                    if target_node_id not in unique_nodes_set:
                        # create and add node json
                        counter = counter + 1
                        target_node_id_numeric = getNodeId(self.name, counter)
                        json_node_target = self.getNodeJson(line[3], line[4], target_node_id_numeric)
                        array_nodes.append(json_node_target)
                        # store numeric id to node
                        all_nodes_with_num_id[target_node_id] = target_node_id_numeric
                        # increment target node counter
                        node_is_target_node[target_node_id_numeric] = 1
                        node_is_source_node[target_node_id_numeric] = 0
                        # add id to unique_nodes_set
                        unique_nodes_set.add(target_node_id)
                    else:
                        # get numeric id
                        target_node_id_numeric = all_nodes_with_num_id[target_node_id]
                        # increment target node counter
                        node_is_target_node[target_node_id_numeric] = node_is_target_node[target_node_id_numeric] + 1

                    # add Relation to source node
                    relations_by_type = {}
                    if source_node_id_numeric in relations_by_node_id:
                        relations_by_type = relations_by_node_id[source_node_id_numeric]
                    else:
                        relations_by_node_id[source_node_id_numeric] = relations_by_type

                    if relation in relations_by_type:
                        relations_by_type[relation].append(target_node_id_numeric)
                    else:
                        relations = []
                        relations.append(target_node_id_numeric)
                        relations_by_type[relation] = relations

                        relations_by_node_id[source_node_id_numeric] = relations_by_type

                    # HANDEL RELATIONS
                    json_link = {}
                    json_link['sourceId'] = source_node_id_numeric
                    json_link['targetId'] = target_node_id_numeric
                    json_link['relation'] = relation
                    json_link['artifact'] = self.name
                    json_link['approved'] = 'false'
                    json_link['origin'] = 'matching algorithm'
                    json_link['responsible'] = 'tool'

                    array_links.append(json_link)

                else:
                    error_lines = error_lines + '\n' + 'empty target entity ' + line[0] + ';' + line[1]

            else:
                error_lines = error_lines + '\n' + 'empty source entity'

            # END OF LOOP ----

        array_nodes = self.addRelToEntities(array_nodes, node_is_source_node, node_is_target_node, relations_by_node_id)

        # add part arrays to json
        self.json_complete['entities'] = array_nodes
        self.json_complete['links'] = array_links

        self.writeToFile(self.log_path + 'unique.txt', unique_nodes_set, True)
        self.writeToFile(self.log_path + 'error_lines.txt', error_lines, False)
        return

    def addRelToEntities(self, entity_array, node_is_source_node, node_is_target_node, relations_by_node_id):
        for entity in entity_array:
            # add link counter
            incoming = node_is_target_node[entity['id']]
            outgoing = node_is_source_node[entity['id']]

            entity['outgoingRelations'] = outgoing
            entity['incomingRelations'] = incoming

            # calculate independence
            independence = 100
            if incoming != 0:
                independence = (outgoing/(incoming + outgoing))*100

            entity['independence'] = independence

            # add outgoing links by types
            if entity['id'] in relations_by_node_id:
                entity['addictByTypes'] = relations_by_node_id[entity['id']]
            else:
                entity['addictByTypes'] = 0

            # END OF LOOP ----
        return entity_array

    def getNodeJson(self, node_type, node, node_id):
        # remove space
        node_type = node_type.strip()
        node = node.strip()
        # create json
        json_node_source = {}
        json_node_source['type'] = node_type
        json_node_source['name'] = node
        json_node_source['artifact'] = self.name
        json_node_source['id'] = node_id
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