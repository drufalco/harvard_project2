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

# receive and store message
@socketio.on("connect")
def connect():
    emit("update channels", channels, broadcast=True)
    emit("update messages", channels, broadcast=True)

# add channel to channel list
@socketio.on("add channel")
def add(channel_name):
    print(channel_name)
    channel_name = channel_name.replace(" ", "")
    print(channel_name)
    if channel_name in channels: # checks if there's already channel w that name
        return "Error"
    else: 
        channels[channel_name] = [] # adds to dict
        emit("update channels", channels, broadcast=True) #updates

# click on channel from list to access its messages
@app.route("/channel/<channel_name>", methods=["GET", "POST"])
def channel(channel_name):
    return render_template("channel.html", channels=channels, channel_name=channels[channel_name], channel_string=channel_name)
    

# receive and store message
@socketio.on("send message")
def send(message, current_channel, user, uuid):
    #get date
    dt = datetime.now()
    time = dt.strftime("%b X%d X%I:%M%p").replace('X0','X').replace('X','') #formatting to remove zeroes

    if len(channels[current_channel]) > 99: 
        channels[current_channel].pop(0)
    channels[current_channel].append({"user": user, "message": message, "time": time, "uuid": uuid})
    emit("update messages", channels, broadcast=True)

# delete message
@socketio.on("delete message")
def delete(element_uuid, current_channel):
    for message in channels[current_channel]:
        if (element_uuid == message["uuid"]):
            channels[current_channel].remove(message)
            break
    emit("update messages", channels, broadcast=True)

