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
});
