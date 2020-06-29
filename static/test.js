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
    const pathArray = window.location.pathname.split('/');
    let current_channel = pathArray[2];
    if (pathArray.length > 2) {
        localStorage.setItem('current_channel', current_channel);
    } 


    //when connected, configure button to send message
    socket.on('connect', () => {

        // By default, submit button is disabled
        buttons_array = document.querySelectorAll('.btn');
        buttons_array.forEach(button => button.disabled = true);

        forms_array = document.querySelectorAll('.form')
        input_array = document.querySelectorAll('.input')
    

        // Enable button only if there is text in the input field
        input_array.forEach((input, index) => {
        
            input.onkeyup = () => {
                if (input.value.length > 0) {
                    buttons_array[index].disabled = false;
                } else {
                    buttons_array[index].disabled = true;
                }
            }
        })
        

        // send message or add channel
        forms_array.forEach((form, index) => {
            form.onsubmit = () => {
               
                if (form.className === 'add_channel form') {
                    const channel_name = input_array[index].value; // not sure if this works
                    socket.emit('add channel', channel_name);
                
                } else if (form.className === "send_message form") {
                    const message = input_array[index].value;
                    const user = localStorage.getItem('username');
                    const uuid = uuidv4();
                    socket.emit('send message', message, current_channel, user, uuid);
                }

                // disable button and stop form from submitting
                input_array[index].value = '';
                return false;
            }
        })

        let delete_buttons = document.querySelectorAll('.delete_button');
            delete_buttons.forEach(button => {
                button.onclick = () => {
                    let element_uuid = button.dataset.uuid
                socket.emit('delete message', element_uuid, current_channel)
            }
        }) 

    })

    // update messages
    socket.on("update messages", channels => {
        document.querySelector('#messages').innerHTML = "";

        channels[current_channel].forEach(element => {
            
            //create new list items for timestamp & message
            const div = document.createElement('div');
            div.className = "button_div";
            const li_1 = document.createElement('li');
            li_1.innerHTML = element[0].bold() + " " + element[2];
            const li_2 = document.createElement('li');
            li_2.innerHTML = `${element[1]}`;
            const br = document.createElement('BR');

            const hide = document.createElement('button');
            hide.className = 'delete_button btn-primary';
            hide.innerHTML = 'x';

            let element_uuid = element[3]

            // When hide button is clicked, remove post.
            hide.onclick = function() {
                socket.emit('delete message', element_uuid, current_channel)// not sure how to do this
            } 

            //add to list 
            div.appendChild(li_1);
            div.appendChild(hide)
            document.querySelector('#messages').append(div);
            document.querySelector('#messages').append(li_2);
            document.querySelector('#messages').append(br);

        });
        // clear input field, disable button
        document.querySelector('#send_message_btn').disabled = true;
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
        document.querySelector('#sidebar_channel_btn').disabled = true;
    });

});