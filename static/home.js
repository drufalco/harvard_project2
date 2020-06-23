document.addEventListener('DOMContentLoaded', () => {
    
    // CODE FOR UPDATING CHANNEL LISTS
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //when connected, configure button to create new channel
    socket.on('connect', () => {

        // By default, submit button is disabled
    
        channel_buttons_array = document.querySelectorAll('.btn');
        channel_buttons_array.forEach(button => button.disabled = true);

        // Enable button only if there is text in the input field
        document.querySelector('#channel_name').onkeyup = () => {
            if (document.querySelector('#channel_name').value.length > 0) {
                document.querySelector('#add_channel_btn').disabled = false;
            } else {
                document.querySelector('#add_channel_btn').disabled = true;
            }
        };


        document.querySelector('#sidebar_channel_name').onkeyup = () => {
            if (document.querySelector('#sidebar_channel_name').value.length > 0) {
                document.querySelector('#sidebar_channel_btn').disabled = false;
            } else {
                document.querySelector('#sidebar_channel_btn').disabled = true;
            }
        };

        // submit form - one for each form 
        document.querySelector('#add_channel').onsubmit = () => {
            const channel_name = document.querySelector("#channel_name").value; // not sure if this works

            socket.emit('add channel', channel_name);
            
            // disable button
            document.querySelector('#channel_name').value = '';

            // Stop form from submitting
            return false;
        }

        document.querySelector('#sidebar_add_channel').onsubmit = () => {
            const channel_name = document.querySelector("#sidebar_channel_name").value; // not sure if this works
            socket.emit('add channel', channel_name);
            
            // disable button
            document.querySelector('#sidebar_channel_name').value = '';

            // Stop form from submitting
            return false;
        }
    })

    // update channels list after the new channel has been added to the dictionary
    socket.on("update channels", channels => {

        document.querySelector('#channel_nav').innerHTML = "";
        for (channel in channels) {
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
        document.querySelector('#add_channel_btn').disabled = true;
        document.querySelector('#sidebar_channel_btn').disabled = true;
    });

})