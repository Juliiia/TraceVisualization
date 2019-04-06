#!/usr/bin/python3.6
import os
import csv
import json

from models.path_name_manager import *


class CsvExporter:
    def __init__(self, artifact):
        self.artifact = artifact
        self.path_to_main_json = getPathOfMainJsonFile(artifact)
        self.path_to_export_csv = getPathOfEntityOutputCSVFile(artifact)

    def createCSVFile(self):
        if os.path.isfile(self.path_to_main_json):
            self.write_csv_file()
            return self.path_to_export_csv
        else:
            return 'file not exists'

    # form of columns: EntityId, EntityName, EntityType, Incominglinks, Outgoinglinks, independence
    def write_csv_file(self):

        main_file = open(self.path_to_main_json, 'r')
        main_file_data = json.load(main_file)

        with open(self.path_to_export_csv, 'w') as csvfile:
            filewriter = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)

            # header
            filewriter.writerow(['Id', 'Name', 'Type', 'Incoming', 'Outgoing', 'Outgoing proportion'])

            for item in main_file_data['entities']:
                row = []
                row.append(item['id'])
                row.append(item['name'])
                row.append(item['type'])
                row.append(item['incomingrelations'])
                row.append(item['outgoingrelations'])
                row.append(item['independence'])
                filewriter.writerow(row)

        csvfile.close()
        return