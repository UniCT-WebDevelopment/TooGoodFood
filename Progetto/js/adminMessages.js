//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];

        class Message {
            id;
            ingrediente;
            message;
            placed_on;
            message() {};
        }

        function newmessage(data) {
            message = new Message();
            message['id'] = data['id'];
            message['message'] = data['message'];
            message['ingrediente'] = data['ingrediente'];
            message['placed_on'] = data['placed_on'];
        }

        function createNewDivmessage(message) {

            var box = document.createElement('div');
            box.className = 'box';

            var h3 = document.createElement('h3');
            h3.innerHTML = 'placed on: ';
            var h3span = document.createElement('span');
            var date = message['placed_on'].split('T');
            var time = date[1].split('.');
            var date_time = date[0] + ' at ' + time[0];

            h3span.innerHTML = date_time
            h3.appendChild(h3span);

            var checkBTN = document.createElement('button');
            checkBTN.type = 'button';
            checkBTN.className = 'fas fa-times';

            checkBTN.onclick = function() {

                const urlRemove = 'http://' + ipServer + ':' + +myPort + '/adminMessages/' + message['id'];

                const messageData = {
                    id: message['id']
                }

                Swal.fire({
                    title: 'Remove this message?',
                    icon: 'question',
                    showDenyButton: true,
                    confirmButtonText: 'Yes',
                    denyButtonText: 'No',
                    customClass: 'myAlert'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        fetch(urlRemove, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ messageData })
                            })
                            .then(function(response) { return response.json(); })
                            .then(function(data) {});

                        window.location.reload();

                    }
                });
            }

            var p_name = document.createElement('p');
            p_name.innerHTML = 'ingredient: ';
            var span_p_name = document.createElement('span');
            span_p_name.innerHTML = message['ingrediente'];
            p_name.appendChild(span_p_name);

            var p_number = document.createElement('p');
            p_number.innerHTML = 'message: ';
            var span_p_number = document.createElement('span');
            span_p_number.innerHTML = message['message'];
            p_number.appendChild(span_p_number);


            box.appendChild(checkBTN);

            box.appendChild(h3);
            box.appendChild(p_name);
            box.appendChild(p_number);



            var container = document.getElementById('message-container');
            container.appendChild(box);

        }


        async function loadingmessages() {
            const messageURL = 'http://' + ipServer + ':' + +myPort + '/adminMessages/all'
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