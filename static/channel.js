// create uuid
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    // CODE FOR SENDING MESSAGES
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    // takes channel name from url, saves current channel in case user closes program
    const current_channel = getCurrentChannel();
    if (pathArray.length > 2) {
        localStorage.setItem('current_channel', current_channel);
    } 


    //when connected, configure button to send message
    socket.on('connect', () => {
        arrays()
        
        // send message or add channel
        forms_array.forEach((form, index) => {
            form.onsubmit = () => {
            
                if (form.className === 'add_channel form') {
                    const channel_name = input_array[index].value; // not sure if this works
                    socket.emit('add channel', channel_name);
                
                } else if (form.className === "send_message form") {
                    console.log('test')
                    const message = input_array[index].value;
                    const user = localStorage.getItem('username');
                    const uuid = uuidv4();
                    socket.emit('send message', message, current_channel, user, uuid);
                }
    
                // disable button and stop form from submitting
                input_array[index].value = '';
                return false;
            }
        });

        let delete_buttons = document.querySelectorAll('.delete_button');
            delete_buttons.forEach(button => {
                button.onclick = () => {
                    let element_uuid = button.dataset.uuid
                socket.emit('delete message', element_uuid, current_channel)
            }
        }) 
    })

    // update messages
    socket.on("update messages", updateMessages)

    // update channels list after the new channel has been added to the dictionary
    socket.on("update channels", updateChannels)
});