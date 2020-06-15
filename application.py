import os

from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_socketio import SocketIO, emit

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
    print(channels)
    if channel_name in channels: # checks if there's already channel w that name
        return "Error"
    else: 
        channels[channel_name] = [] # adds to dict
        emit("update channels", channels, broadcast=True) #updates
        print(channels)

# click on channel from list to access its messages
@app.route("/channel/<channel_name>", methods=["GET", "POST"])
def channel(channel_name):
    print(channels)
    return render_template("channel.html", channel_name=channels[channel_name])