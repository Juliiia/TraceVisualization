#!/usr/bin/python3.6


def getPathToDataExchangeFolder():
    return 'src/backend/dataExchange/'


def getPathToLogFolder():
    return 'src/backend/log/'


def getPathToDataOutput():
    return 'src/backend/dataOutput/'


def getPathOfMainJsonFile(artifact_name):
    return getPathToDataExchangeFolder() + artifact_name + '.json'


def getPathOfNetworkJsonFile(artifact_name):
    return getPathToDataExchangeFolder() + artifact_name + '_network.json'


def getPathOfNeighborBarchart(artifact_name):
    return getPathToDataExchangeFolder() + artifact_name + '_neighbor_barchart.json'


def getPathOfSankeyDiagram(artifact_name):
    return getPathToDataExchangeFolder() + artifact_name + '_sankey_diagram.json'


def getPathOfEntityOutputCSVFile(artifact_name):
    return getPathToDataOutput() + artifact_name + '_entity_output.csv'


def getNodeId(artifact_name, counter):
    return artifact_name + 'entity' + str(counter)