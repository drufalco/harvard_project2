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

    const pathArray = window.location.pathname.split('/');
    if (pathArray.length > 2) {
        localStorage.setItem('current_channel', current_channel);
    } 

    document.querySelector("title").innerHTML= current_channel + " | Flack"

    //when connected, configure button to send message
    socket.on('connect', () => {

        const arraysObject = arrays();
        let forms_array = arraysObject.forms_array;
        let input_array = arraysObject.input_array;
        
        // send message or add channel
        forms_array.forEach((form, index) => {
            form.onsubmit = () => {
            
                if (form.dataset.name === "channels") {
                    const channel_name = input_array[index].value; // not sure if this works
                    socket.emit('add channel', channel_name);
                
                } else if (form.dataset.name === "messages") {
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
                console.log("delete")
                button.onclick = () => {
                    let element_uuid = button.dataset.uuid
                socket.emit('delete message', element_uuid, current_channel)
            }
        }) 
    })

    // update messages
    socket.on("update messages", channels => updateMessages(channels, socket))

    // update channels list after the new channel has been added to the dictionary
    socket.on("update channels", updateChannels)
});