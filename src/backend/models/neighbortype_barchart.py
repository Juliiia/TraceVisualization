#!/usr/bin/python3.6
import os
import json

from models.path_name_manager import *


class NeighborTypeBarchart:
    def __init__(self):
        self.name = 'neigborTypeBarchart'
        self.req_artifact_name = 'Requirements'
        self.code_artifact_name = 'SourceCode'
        self.size_of_one_entity = 5
        self.space_between_two_entities = 5
        self.space_between_two_artifacts = 30
        self.max_outgoing_relations = 0
        self.min_outgoing_relations = -1
        self.sort_by = 'outgoingRelations'

    def createBarchart(self):
        # check if files exists
        if self.doFilesExist():
            map_requ = self.createStructure('REQU', self.req_artifact_name)
            map_fuc = self.createStructure('FUNC', self.code_artifact_name)

            json_requ_coordinates = self.calculateCoordinates(map_requ, 0, 'left')
            json_func_coordinates = self.calculateCoordinates(map_fuc, 0 + self.space_between_two_artifacts, 'right')

            json_requ_coordinates['info'] = self.getInfoItem('REQU')
            json_func_coordinates['info'] = self.getInfoItem('FUNC')

            path_requ = getPathOfNeighborBarchart(self.req_artifact_name)
            path_func = getPathOfNeighborBarchart(self.code_artifact_name)

            self.writeJsonFile(path_requ, json_requ_coordinates)
            self.writeJsonFile(path_func, json_func_coordinates)

            return path_requ + ';' + path_func
        return 'waiting'

    def doFilesExist(self):
        if os.path.isfile(getPathOfMainJsonFile(self.req_artifact_name)):
            if os.path.isfile(getPathOfMainJsonFile(self.code_artifact_name)):
                return True
        return False

    def getInfoItem(self, types):
        infoItem = {}
        infoItem['selectedType'] = types
        infoItem['entitySize'] = self.size_of_one_entity
        infoItem['spaceBetweenEntitiesSize'] = self.space_between_two_entities
        infoItem['spaceBetweenArtifactsSize'] = self.space_between_two_artifacts
        infoItem['max'] = self.max_outgoing_relations
        infoItem['min'] = self.min_outgoing_relations
        return infoItem

    def createStructure(self, typ_name, aritfact_name):
        # TODO: later more connections
        # get REQU from Requirements json
        main_file = open(getPathOfMainJsonFile(aritfact_name), 'r')
        list_of_entities = self.getAllTypesFromJsonWithNeighbors(main_file, typ_name)
        main_file.close()

        map_entities = self.getMapByOutgoingLinks(list_of_entities)
        return map_entities

    def getAllTypesFromJsonWithNeighbors(self, main_json, typ):
        list_of_entities = []

        main_file_data = json.load(main_json)

        if main_file_data['entities']:
            for item in main_file_data['entities']:
                if item['type'] == typ:
                    list_of_entities.append(item)

        return list_of_entities

    def getMapByOutgoingLinks(self, list_of_all_entities):
        map_of_entities_by_outgoing_relations = {}
        for entity in list_of_all_entities:
            if entity['outgoingRelations'] in map_of_entities_by_outgoing_relations:
                list_of_entities = map_of_entities_by_outgoing_relations[entity['outgoingRelations']]
                list_of_entities.append(entity['id'])
                map_of_entities_by_outgoing_relations[entity['outgoingRelations']] = list_of_entities
            else:
                # set min / max
                print(self.max_outgoing_relations)
                print('out ' + str(entity['outgoingRelations']))
                if entity['outgoingRelations'] > self.max_outgoing_relations:
                    self.max_outgoing_relations = entity['outgoingRelations']
                else:
                    # initial set min
                    if self.min_outgoing_relations == -1:
                        self.min_outgoing_relations = entity['outgoingRelations']

                    if entity['outgoingRelations'] < self.min_outgoing_relations:
                        self.min_outgoing_relations = entity['outgoingRelations']
                # add new element
                list_of_entities = []
                list_of_entities.append(entity['id'])
                map_of_entities_by_outgoing_relations[entity['outgoingRelations']] = list_of_entities

        # END OF LOOP ----
        print(len(map_of_entities_by_outgoing_relations))
        return map_of_entities_by_outgoing_relations

    def calculateCoordinates(self, map_by_nr_of_relations, x_start, direction):
        entities_with_coordinates = {}
        for element in map_by_nr_of_relations:

            x_value = x_start
            for entity in map_by_nr_of_relations[element]:
                coordinates = {}
                coordinates['y'] = (-element) * (self.size_of_one_entity + self.space_between_two_entities)
                coordinates['x'] = x_value

                if direction == 'left':
                    x_value = x_value - (self.size_of_one_entity + self.space_between_two_entities)
                else:
                    x_value = x_value + (self.size_of_one_entity + self.space_between_two_entities)

                entities_with_coordinates[entity] = coordinates

        return entities_with_coordinates

    def writeJsonFile(self, path_file, content):
        print('writeJsonFile ' + path_file)
        outputfile = open(path_file, 'w')
        try:
            json.dump(content, outputfile)
        finally:
            outputfile.close()
        return