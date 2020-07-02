# Project 2

Web Programming with Python and JavaScript

Slack-style messaging app for Harvard CS50. Users can create a username, create new channels, and send messages in real-time to other users via the channels. Users can delete their own messages. 

File contents:
- project2.css: styling for app; 
- index.html: Users see this page when they enter app. They choose their username and are redirected to home.html; 
- home.html: Home page once logged in. Users can add a channel via the main form or the form on the sidebar. The sidebar lists all the existing channels. Users can click a channel to be redirected there; 
- channel.html: Template for each channel, which shows the messages that users have sent in that channel. Users can send new messages & delete their own messages. Users can navigate to other channels or add new channels via the sidebar.;
- application.py: Holds all server-side python code, including routes for all pages, socket routes for adding channels and messages, and all the data for channels and messages;
- home.js: Allows users to fill out form to add new channels on the home page;
- channel.js: Allows users to fill out form to add new channels or send messages on each channel page; 
- functions.js: Here lives some functions that are used several times across the app to add/update messages and channels. 
