from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins='http://localhost:8000')
api = Api(app)

@api.resource('/')
class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

@app.route('/fileupload', methode=['POST'])
def fileupload():
    return "uploaded"

if __name__ == "__main__":
    app.run()
