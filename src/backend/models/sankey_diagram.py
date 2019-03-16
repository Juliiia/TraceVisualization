#!/usr/bin/python3.6
import os
import json

from models.path_name_manager import *


class SankeyDiagram:
    def __init__(self, artifact_name):
        self.artifact_name = artifact_name
        self.req_func_view = True

    def createSankeyDiagram(self):
        # is file available
        if self.doFileExist():
            # create json structure
            json_structure = self.createJsonStructure()
            # save json structure
            path_to_json = getPathOfSankeyDiagram(self.artifact_name)
            self.writeJsonFile(path_to_json, json_structure)
            return path_to_json
        return 'waiting'

    def doFileExist(self):
        if os.path.isfile(getPathOfMainJsonFile(self.artifact_name)):
            return True
        return False

    def createJsonStructure(self):
        main_file = open(getPathOfMainJsonFile(self.artifact_name), 'r')
        unique_nodes_list = []

        json_links_type_source = []
        json_links_source_relation = []
        json_links_relation_target = []
        json_links_target_type = []

        json_nodes = []
        json_links = []

        main_file_data = json.load(main_file)

        # create links from Source Type -> Source Entity and from Target Entity -> Target Type
        types_by_id_map = self.getEntityTypesById(main_file_data['entities'])

        # create links from Source Entity -> Relation and from Relation -> Target Entity
        for item in main_file_data['links']:

            source_type_id = types_by_id_map[item['sourceId']]

            if self.req_func_view and self.artifact_name == 'Requirements' and source_type_id != 'REQU':
                continue

            if self.req_func_view and self.artifact_name == 'SourceCode' and source_type_id != 'FUNC':
                continue

            source_type_name = 'sourceType' + source_type_id
            source_name = 'sourceEntity' + item['sourceId']
            relation = item['relation']
            target_name = 'targetEntity' + item['targetId']
            target_type_id = types_by_id_map[item['targetId']]
            target_type_name = 'targetType' + target_type_id

            index_source_type = -1
            index_source = -1
            index_relation = -1
            index_target = -1
            index_target_type = -1

            # add nodes to set
            # add SOURCE TYPE
            if source_type_name not in unique_nodes_list:
                json_nodes.append(self.addNode(source_type_name, source_type_id, 'sourceType'))
                unique_nodes_list.append(source_type_name)
            index_source_type = unique_nodes_list.index(source_type_name)

            # add SOURCE ENTITY
            if source_name not in unique_nodes_list:
                json_nodes.append(self.addNode(source_name, item['sourceId'], 'sourceEntity'))
                unique_nodes_list.append(source_name)
            index_source = unique_nodes_list.index(source_name)

            # add RELATION
            if relation not in unique_nodes_list:
                json_nodes.append(self.addNode(relation, relation, 'relation'))
                unique_nodes_list.append(relation)
            index_relation = unique_nodes_list.index(relation)

            # add TARGET ENTITY
            if target_name not in unique_nodes_list:
                json_nodes.append(self.addNode(target_name, item['targetId'], 'targetEntity'))
                unique_nodes_list.append(target_name)
            index_target = unique_nodes_list.index(target_name)

            # add TARGET TYPE
            if target_type_name not in unique_nodes_list:
                json_nodes.append(self.addNode(target_type_name, target_type_id, 'targetType'))
                unique_nodes_list.append(target_type_name)
            index_target_type = unique_nodes_list.index(target_type_name)

            # add links
            type_to_source = self.addLink(index_source_type, index_source, source_type_id, 1)
            source_to_relation = self.addLink(index_source, index_relation, relation, 1)
            relation_to_target = self.addLink(index_relation, index_target, relation, 1)
            target_to_type = self.addLink(index_target, index_target_type, target_type_id, 1)

            json_links_type_source = self.addNewNodeAndCalcValue(json_links_type_source, type_to_source)
            json_links_source_relation = self.addNewNodeAndCalcValue(json_links_source_relation, source_to_relation)
            json_links_relation_target = self.addNewNodeAndCalcValue(json_links_relation_target, relation_to_target)
            json_links_target_type = self.addNewNodeAndCalcValue(json_links_target_type, target_to_type)

        json_completed = {}
        json_completed['nodes'] = json_nodes

        json_links.extend(json_links_type_source)
        json_links.extend(json_links_source_relation)
        json_links.extend(json_links_relation_target)
        json_links.extend(json_links_target_type)
        json_completed['links'] = json_links

        return json_completed

    def addNode(self, name, node_id, group):
        json_item = {}
        json_item['name'] = name
        json_item['group'] = group
        json_item['nodeid'] = node_id
        return json_item

    def addLink(self, source, target, linkType, value):
        link_item = {}
        link_item['source'] = source
        link_item['target'] = target
        link_item['type'] = linkType
        link_item['value'] = value
        return link_item

    def getEntityTypesById(self, entity_json):
        types_by_id_map = {}
        for entity in entity_json:
            if entity['id'] not in types_by_id_map:
                types_by_id_map[entity['id']] = entity['type']

        return types_by_id_map

    def addNewNodeAndCalcValue(self, json_links, new_link):
        found_equal_link = False
        for link in json_links:
            if new_link['source'] == link['source'] and new_link['target'] == link['target']:
                link['value'] = link['value'] + 1
                found_equal_link = True
                break

        if found_equal_link:
            return json_links
        else:
            json_links.append(new_link)
            return json_links

    def addToCounterPerAxis(self, unique_axis_json, node):
        if node not in unique_axis_json:
            unique_axis_json[node] = 0
        else:
            unique_axis_json[node] = unique_axis_json[node] + 1
        return unique_axis_json

    def writeJsonFile(self, path_file, content):
        print('writeJsonFile ' + path_file)
        outputfile = open(path_file, 'w')
        try:
            json.dump(content, outputfile)
        finally:
            outputfile.close()
        return
