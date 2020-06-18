import os

from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = {}

@app.route("/", methods=["POST", "GET"])
def index():
    return render_template("index.html")

@app.route("/home", methods=["POST", "GET"])
def home():
    return render_template("home.html", channels=channels)

# add channel to channel list
@socketio.on("add channel")
def add(channel_name):
    if channel_name in channels: # checks if there's already channel w that name
        return "Error"
    else: 
        channels[channel_name] = [] # adds to dict
        emit("update channels", channels, broadcast=True) #updates

# click on channel from list to access its messages
@app.route("/channel/<channel_name>", methods=["GET", "POST"])
def channel(channel_name):
    return render_template("channel.html", channels=channels, channel_name=channels[channel_name])

# receive and store message
@socketio.on("send message")
def send(message, channel_name, user):
    #get date
    #time_placeholder = datetime.now()
    #time = time_placeholder.hour + ":" + time_placeholder.minute + " " + time_placeholder.month + "/" + time_placeholder.day

    if len(channels[channel_name]) > 99: 
        channels[channel_name].pop(0)
    channels[channel_name].append([user, message])
    emit("update messages", channels, broadcast=True)
