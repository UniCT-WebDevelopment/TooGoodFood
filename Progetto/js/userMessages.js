//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];
        class Message {
            id;
            name;
            email;
            number;
            message;
            Message() {};
        }

        function newmessage(data) {
            message = new Message();
            message['id'] = data['id'];
            message['message'] = data['message'];
            message['name'] = data['name'];
            message['email'] = data['email'];
            message['number'] = data['number'];
        }

        function createNewDivmessage(message) {

            var box = document.createElement('div');
            box.className = 'box';

            var h3 = document.createElement('h3');
            h3.innerHTML = 'Name: ';
            var h3span = document.createElement('span');

            h3span.innerHTML = message['name']
            h3.appendChild(h3span);


            var p_email = document.createElement('p');
            p_email.innerHTML = 'email: ';
            var span_p_email = document.createElement('span');
            span_p_email.innerHTML = message['email'];
            p_email.appendChild(span_p_email);


            var p_number = document.createElement('p');
            p_number.innerHTML = 'number: ';
            var span_p_number = document.createElement('span');
            span_p_number.innerHTML = message['number'];
            p_number.appendChild(span_p_number);

            var p_message = document.createElement('p');
            p_message.innerHTML = 'message: ';
            var span_p_message = document.createElement('span');
            span_p_message.innerHTML = message['message'];
            p_message.appendChild(span_p_message);



            box.appendChild(h3);
            box.appendChild(p_email);
            box.appendChild(p_number);
            box.appendChild(p_message);



            var container = document.getElementById('message-container');
            container.appendChild(box);

        }


        async function loadingmessages() {
            const messageURL = 'http://' + ipServer + ':' + +myPort + '/userMessages/all'
            const res = await fetch(messageURL)
                .then(function(response) {
                    return response.json();
                }).then(data => list_products = data);

            for (var i = 0; i < list_products.length; i++) {
                console.log(list_products[i]);
                newmessage(list_products[i]);
                console.log(message)
                createNewDivmessage(message);
            }
        }

        loadingmessages();
    });