# The_Galactic_Index
Visualisation of fictional trade data

# Galactic Index (planetary trade simulation)

## Overview

### What is this site for?

This site is a tool to view data pulled from a planetary trading simulation, involving buying/selling of minerals, and companies trying to profit from the available simulated market.

### What does it do?

This site will allow people to view data on individual planets, their names, climate, amounts of resources and the prices those are bought and sold at, as well as companies, with names and locations.

### How does it work?

The front end of the site will make extensive use of D3, DC and crossfilter for visualisation of the data, the backend will run on a Flask framwork. it will alsio use a snapshot of data from a MongoDB database.
The graphs will allow the users to view detailed info on both companies and planets and about what minerals they own/sell. These pages will implement a feature to switch on-page between individual planets data for quick browsing between them. The front page will feature graphs which cover more broad data about the subject and make more use of crossfilter and DC to allow users to see how the different data relates.

## Tech Used

### Some the tech used includes:
- [Bootstrap](http://getbootstrap.com/)
    - I use **Bootstrap** to include some useful layout functionality like tabs.
- [JQuery](https://jquery.com/)
  - **JQuery** is used for extra front-end functionality.
- [D3](https://d3js.org/)
  - **D3** is used to along with other graphic libraries to visualise the data.
- [Crosffilter](https://github.com/square/crossfilter)
  - **Crossfilter** is used to refine the data for use in our D3 and DC graphs.
- [DC](https://dc-js.github.io/dc.js/)
    - **DC** is used to extend my graph's functionality and improve user experience.
- [MONGODB](https://www.mongodb.com/)
    - MongoDB was used to store the snapshot of data the site uses for the graphs and other information.
- [FLASK](http://flask.pocoo.org/)
    - FLASK is used as the framwork for this project.
  
## Contributing

Firstly you will need to clone this repository by running the git clone <project's Github URL> command

Then make sure you have downloaded and installed pycharm, there is a free community edition that works fine for this set-up. 
- [Pycharm](https://www.jetbrains.com/pycharm/)

This project uses Python version 2.7.14
- [Python 2.7.14](https://www.python.org/downloads/)

### Set up a virtual environment

 - Open the project Root folder in Pycharm and in the menu and navigate to file > settings.
 - Then in the menu look for project:Galactic-index > ProjectInterpreter.
 - Using the Wheel icon select CreateVirtualEn to create virtual environment for this project.
 - Then using the + symbol add the dependencies found in the requirements.txt files in the project root folder.

Now everything should be working correctly you can use the play button at the top right of the pycharm screen to run the local server.
Just choose myrouting.py from the dropdown and click the http link in the console window when the server has loaded.
 
