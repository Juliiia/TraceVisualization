#!/usr/bin/python3.6
class NetworkGraph:
    def __init__(self, file):
        self.file = file

    def testoutput(self):
        fp = open("networkgraph.txt", "w")
        fp.write(self.file)
        return "network graph"
