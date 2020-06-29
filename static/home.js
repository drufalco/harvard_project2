document.addEventListener('DOMContentLoaded', () => {
    
    // CODE FOR SENDING MESSAGES
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);


    //when connected, configure button to send message
    socket.on('connect', () => {

       arrays()
        
        // send message or add channel
        forms_array.forEach((form, index) => {
            form.onsubmit = () => {
            
                const channel_name = input_array[index].value; // not sure if this works
                socket.emit('add channel', channel_name);
    
                // disable button and stop form from submitting
                input_array[index].value = '';
                return false;
            }
        })

    })

    // update channels list after the new channel has been added to the dictionary
    socket.on("update channels", updateChannels)

});