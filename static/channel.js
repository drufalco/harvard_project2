document.addEventListener('DOMContentLoaded', () => {
    
    // CODE FOR SENDING MESSAGES
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // takes channel name from url
    const pathArray = window.location.pathname.split('/');
    const channel_name = pathArray[2];

    // saves current channel in case user closes program
    localStorage.setItem('current_channel', channel_name);

    //when connected, configure button to send message
    socket.on('connect', () => {

        // By default, submit button is disabled
        buttons_array = document.querySelectorAll('.btn');
        buttons_array.forEach(button => button.disabled = true);

        // Enable button only if there is text in the input field
        document.querySelector('#send').onkeyup = () => {
            console.log("keyup")
            if (document.querySelector('#send').value.length > 0)
                document.querySelector('#send_message_btn').disabled = false;
            else
                document.querySelector('#send_message_btn').disabled = true;
        };

        // send message
        document.querySelector('#send_message').onsubmit = () => {
            const message = document.querySelector("#send").value
            const user = localStorage.getItem('username')
            console.log(message)
            socket.emit('send message', message, channel_name, user) 
            
            // disable button
            document.querySelector('#send').value = '';

            // Stop form from submitting
            return false;
        }

        // add channel 
        document.querySelector('#sidebar_channel_name').onkeyup = () => {
            if (document.querySelector('#sidebar_channel_name').value.length > 0) {
                document.querySelector('#sidebar_channel_btn').disabled = false;
            } else {
                document.querySelector('#sidebar_channel_btn').disabled = true;
            }
        };

        document.querySelector('#sidebar_add_channel').onsubmit = () => {
            const channel_name = document.querySelector("#sidebar_channel_name").value; // not sure if this works
            socket.emit('add channel', channel_name);
            
            // disable button
            document.querySelector('#sidebar_channel_name').value = '';

            // Stop form from submitting
            return false;
        }
    })

    // update messages
    socket.on("update messages", channels => {
        document.querySelector('#messages').innerHTML = "";

        channels[channel_name].forEach(element => {
            
            //create new list items for timestamp & message
            const li_1 = document.createElement('li');
            li_1.innerHTML = element[0].bold() + " " + element[2];
            const li_2 = document.createElement('li');
            li_2.innerHTML = `${element[1]}`;
            const br = document.createElement('BR');

            //add to list 
            document.querySelector('#messages').append(li_1);
            document.querySelector('#messages').append(li_2);
            document.querySelector('#messages').append(br)
        })
        
        // clear input field, disable button
        document.querySelector('#send_message_btn').disabled = true;
    })

    // update channels list after the new channel has been added to the dictionary
    socket.on("update channels", channels => {

        document.querySelector('#channel_nav').innerHTML = "";
        for (channel in channels) {
            console.log(channel)
            //create new list item
            const li = document.createElement('li');
            li.className = "nav-link";
        
            const a = document.createElement('a');
            a.href = `/channel/${channel}`
            a.innerHTML = channel;
            li.appendChild(a);


            //add to list 
            document.querySelector('#channel_nav').append(li)
        }
        // clear input field, disable button
        document.querySelector('#sidebar_channel_btn').disabled = true;
    });
});
