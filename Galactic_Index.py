from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

# MONGODB_HOST = 'localhost'
# MONGODB_PORT = 27017
MONGO_URI = os.getenv("MONGO_URI", 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'Galactic_stream')
# DBS_NAME = 'Galactic_stream'
PLANET_COLLECTION = 'planets'
COMPANY_COLLECTION = 'companies'

# This is where i define connection parameters for my mongo database and collections


@app.route("/")
def home():
    # html template used a flask page
    return render_template("home.html")


@app.route("/planets")
def planets():
    # html template used a flask page
    return render_template("planets.html")


@app.route("/companies")
def companies():
    # html template used a flask page
    return render_template("companies.html")


@app.route("/Galactic_index/Planets")
def galactic_planets():
    # route for passing data into flask from mongoDB
    # A constant that defines the record fields that we wish to retrieve.
    PLANET_FIELDS = {"_id": False,
                     "PlanetName": True,
                     "Habitability": True,
                     "Climate": True,
                     "Location": True,
                     "EconomicStatus": True,
                     "Population": True,
                     "LandSpecies": True,
                     "PlantSpecies": True,
                     "MarineSpecies": True,
                     "MineralsGas": True,
                     "MineralsLiquid": True,
                     "MineralsSolid": True
                     }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    # The MONGO_URI connection is required when hosted using a remote mongo db.
    with MongoClient(MONGO_URI) as conn:
        # Define which collection we wish to access
        planet_collection = conn[DBS_NAME][PLANET_COLLECTION]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        planets = planet_collection.find(projection=PLANET_FIELDS, limit=55000)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(planets))


@app.route("/Galactic_index/Companies")
def galactic_companies():
    # route for passing data into flask from mongoDB
    # Company fields
    COMPANY_FIELDS = {"_id": False,
                      "CompanyName": True,
                      "Money": True,
                      "profit": True,
                      "spent": True,
                      "expenses": True,
                      "StockPrices": True,
                      "MineralsGas": True,
                      "MineralsLiquid": True,
                      "MineralsSolid": True,
                      "TradeList": True,
                      "SellList": True,
                      "NumberOfSpaceports": True,
                      "NumberOfSpaceships": True,
                      "CompanyAge": True,
                      }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGO_URI) as conn:
        # Define which collection we wish to access
        company_collection = conn[DBS_NAME][COMPANY_COLLECTION]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        companies = company_collection.find(projection=COMPANY_FIELDS, limit=55000)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(companies))


if __name__ == "__main__":
    app.run(debug=True)
