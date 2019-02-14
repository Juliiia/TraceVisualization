#!/usr/bin/python3.6


def getPathToDataExchangeFolder():
    return 'src/backend/dataExchange/'


def getPathToLogFolder():
    return 'src/backend/log/'


def getPathOfMainJsonFile(artifact_name):
    return getPathToDataExchangeFolder() + artifact_name + '.json'


def getPathOfNetworkJsonFile(artifact_name):
    return getPathToDataExchangeFolder() + artifact_name + '_network.json'

