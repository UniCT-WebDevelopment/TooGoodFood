//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];
        var btnSend = document.getElementById('sendBTN');

        btnSend.onclick = function() {

            var username = document.getElementById('username').value
            var email = document.getElementById('email').value
            var number = document.getElementById('number').value
            var message = document.getElementById('myMessage').value

            if (username && email && number && message) {

                const messageData = {
                    name: username,
                    email: email,
                    number: number,
                    message: message
                }

                const messageURL = 'http://' + ipServer + ':' + +myPort + '/contact';
                fetch(messageURL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ messageData })
                    }).then(response => response.json())
                    .then(data => Swal.fire({
                            title: data['message'],
                            icon: 'info',
                            customClass: 'myAlert',
                            confirmButtonText: 'OK'
                        })
                        .then((result) => {
                            window.location.reload()
                        })
                    )


            } else
                Swal.fire({
                    title: 'Some fields are empty',
                    icon: 'info',
                    customClass: 'myAlert'
                });
        }
    });