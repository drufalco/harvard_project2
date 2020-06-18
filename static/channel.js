document.addEventListener('DOMContentLoaded', () => {
    
    // CODE FOR SENDING MESSAGES
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // takes channel name from url
    const pathArray = window.location.pathname.split('/');
    const channel_name = pathArray[2];

    //when connected, configure button to send message
    socket.on('connect', () => {

        // By default, submit button is disabled
        document.querySelector('#send_message_btn').disabled = true;

        // Enable button only if there is text in the input field
        document.querySelector('#send').onkeyup = () => {
            if (document.querySelector('#send').value.length > 0)
                document.querySelector('#send_message_btn').disabled = false;
            else
                document.querySelector('#send_message_btn').disabled = true;
        };


        document.querySelector('#send_message').onsubmit = () => {
            const message = document.querySelector("#send").value
            const user = localStorage.getItem('username')
            socket.emit('send message', message, channel_name, user) 
            
            // disable button
            document.querySelector('#send').value = '';

            // Stop form from submitting
            return false;
        }
    })


    // update messages
    socket.on("update messages", channels => {
        document.querySelector('#messages').innerHTML = "";

        channels[channel_name].forEach(element => {
            console.log(element);
            console.log("hey");
            //create new list item
            const li = document.createElement('li');
            li.innerHTML = `${element[0]}: ${element[1]}`;

            //add to list 
            document.querySelector('#messages').append(li);
        })
        
        // clear input field, disable button
        document.querySelector('#send_message_btn').disabled = true;
    })
});
