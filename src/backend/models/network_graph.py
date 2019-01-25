#!/usr/bin/python3.6
import csv


class NetworkGraph:
    def __init__(self, file):
        self.file = file

    def testOutput(self):
        data = []
        reader = csv.reader(self.file, delimiter=";")
        i=0
        for row in reader:
            if i>0:
                data.append(row)
            i+=1

        return data
