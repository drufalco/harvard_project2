document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //when connected, configure button to create new channel
    socket.on('connect', () => {

        // By default, submit button is disabled
        document.querySelector('#add_channel_btn').disabled = true;


        // Enable button only if there is text in the input field
        document.querySelector('#channel_name').onkeyup = () => {
            if (document.querySelector('#channel_name').value.length > 0)
                document.querySelector('#add_channel_btn').disabled = false;
            else
                document.querySelector('#add_channel_btn').disabled = true;
        };


        document.querySelector('#add_channel').onsubmit = () => {
            const channel_name = document.querySelector("#channel_name").value // not sure if this works
            socket.emit('add channel', channel_name)
            
            // disable button
            document.querySelector('#channel_name').value = '';

            // Stop form from submitting
            return false;
        }
    })

    socket.on("update channels", channels => {
        for (channel in channels) {
            //create new list item
            const li = document.createElement('li');
            li.className = "nav-link";
            li.innerHTML = channel;

            //add to list 
            document.querySelector('#channel_nav').append(li)
        }
        // clear input field, disable button
        document.querySelector('#add_channel_btn').disabled = true;
    })
});


