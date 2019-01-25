class OutPutPrinter:
    def __init__(self, file):
        self.file = file

    def printOut(self):
        fp = open("log/logging.txt", "w")
        fp.write(self.file)
