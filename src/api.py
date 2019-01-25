from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, origins='http://localhost:8000')


@app.route("/fileuploader", methods=["post"])
def print_out():
    file = request.get_data()
    fp = open("src/static/log/logging.txt", "w")
    fp.write(file.decode("utf-8"))
    return jsonify(file.decode("utf-8"))


if __name__ == "__main__":
    app.run()
