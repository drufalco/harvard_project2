



// create uuid
function getCurrentChannel() {
    const pathArray = window.location.pathname.split('/');
    let current_channel = pathArray[2];
    return current_channel;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function arrays() {
    // By default, submit button is disabled
    let buttons_array = document.querySelectorAll('.btn');
    buttons_array.forEach(button => button.disabled = true);

    let forms_array = document.querySelectorAll('.form')
    let input_array = document.querySelectorAll('.input')

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

    return {buttons_array, forms_array, input_array}
}

function updateMessages(channels, socket) {
    
    const current_channel = getCurrentChannel();
    document.querySelector('#messages').innerHTML = "";

    channels[current_channel].forEach(element => {
                
        //create new list items for timestamp & message
        const div = document.createElement('div');
        div.className = "button_div";
        const li_1 = document.createElement('li');
        li_1.innerHTML = element["user"].bold() + " " + element["time"];
        const li_2 = document.createElement('li');
        li_2.innerHTML = `${element["message"]}`;
        const br = document.createElement('BR');

        const hide = document.createElement('button');
        hide.className = 'delete_button btn-primary';
        hide.innerHTML = 'x';
        hide.dataset.uuid = element["uuid"]

        let element_uuid = element["uuid"]

        // When hide button is clicked, remove post.
        hide.onclick = function() {
            socket.emit('delete message', element_uuid, current_channel)// not sure how to do this
        } 
      
        //add to list 
        div.appendChild(li_1);
        if (localStorage.getItem('username') === element["user"]) {
            div.appendChild(hide)
            }
        document.querySelector('#messages').append(div);
        document.querySelector('#messages').append(li_2);
        document.querySelector('#messages').append(br);

    });
    // clear input field, disable button
    document.querySelector('#send_message_btn').disabled = true
}

function updateChannels(channels) {

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
         
        // clear input field, disable button
    document.querySelector('#sidebar_channel_btn').disabled = true;
    }
   
};
