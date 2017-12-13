# Galactic Index (planetary trade simulation data)

## Overview

### What is this site for?

This site is a tool to view data pulled from a planetary trading simulation, involving buying/selling of minerals, and companies trying to profit from the available simulated market.

### What does it do?

This site will allow people to view data on individual planets, their names, climate, amounts of resources and the prices those are bought and sold at, as well as companies, with names and locations.

### How does it work?

The front end of the site will make extensive use of D3, DC and crossfilter for visualisation of the data, the backend will run on a Flask framwork. it will also use a snapshot of data from a MongoDB database.
The graphs will allow the users to view detailed info on both companies and planets and about what minerals they own/sell. These pages will implement a feature to switch on-page between individual planets data for quick browsing between them. The front page will feature graphs which cover more broad data about the subject and make more use of crossfilter and DC to allow users to see how the different data relates.

### Design Choices

For this project i was interested in creating my own dataset for the project that would create quite a few different statistics to measure. I created a Python Project that Uploaded data to a mongoDB database, which can be found [here](https://github.com/kaiforward/GalacticIndex). It's a simulation of planets and companies interacting by buying and selling minerals from each other and all the data associated with them.

To show all this data i knew i wanted to make use of crossfilter and DC for some of the broader data. It would allow the user to crossfilter data on planets and companies, comparing data between the individuals in each.

To show data for individual planets and companies, i decided to dedicate the full page to graphs and information on one company/planet and allow the user the switch between them on-page, which would let them see new information much more quickly. As there is a lot of data that needed to be shown this was the best approach i could think of.

I had lots of issues designing the UI for this as it was hard to have the graphs resizable for different screen sizes.

## Tech Used

### Some the tech used includes:
- [Bootstrap](http://getbootstrap.com/)
    - I use **Bootstrap** to include some useful layout functionality like tabs.
- [JQuery](https://jquery.com/)
  - **JQuery** is used for extra front-end functionality.
- [D3](https://d3js.org/)
  - **D3** is used to along with other graphic libraries to visualise the data.
- [Crossfilter](https://github.com/square/crossfilter)
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

## My Deployment
After signing up to [Heroku](https://signup.heroku.com/) and [installing](https://devcenter.heroku.com/articles/heroku-cli) it I created a new Heroku app from the Heroku dashboard.

I Then installed gunicorn using the Project settigns in Pycharms, but could also install to the command line using:
```
pip install gunicorn
```

to create a requirements file i navigated the folder where my virtual environments are stored and saved the requirements using:
```
pip freeze --local > requirements.txt
```
or if already running the chosen ENV in the command line.
```
pip freeze > requirements.txt
```

To tell Heroku what to do when opening the website, I create a new file and name it Profcile and inside it include:
```
web: gunicorn school_donations:app
```
Because i am using windows i also added a Procfile.windows which included:
```
web: python school_donations.py
```
To test the server locally after these changes use, for windows:
```
heroku local -f Procfile.windows
```
On Mac/Linux
```
heroku local
```

After pushing these changes to github. we tell heroku to start a 'worker' by typing into the command line:
```
heroku ps:scale web=1
```

The next step was to connect the server to some data from mongoDB.

- After installing MLab MongoDB from the Hroku Add-ons page i created a user with the name root.
- I then copied the commands to connect to mongo shell using my DBuser and DBpassword. I was then able to create a collection for my data.
- Then I input this command using my personal db user settings, hostname, dbname and my datafile:
```
mongoimport -h <hostname> -d <dbname> -c <collectionname> -u <dbuser> -p <dbpassword> --file opendata_projects_clean.csv --type csv --headerline
```

Then i could check in Mongo Management studio wether the data had been sucessfully uploaded.

### Modify routing.py

After checking the data was sucessfully uploaded, the names in my .py files needed to be changed from my local database to the data stored on the server, by changing from MONGODB_HOST, PORT AND NAME to the MONGO_URI given by heroku in the settings tab.

Then push the changes to heroku/git with:
```
git push heroku master
```
The project is ready to be opened with
```
heroku open
```
or can be opened through the heroku dashboard.

