//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];


        var url = 'http://' + ipServer + ':' + +myPort + '/login';
        console.log(url)
        var input = document.getElementById('loginBtn');

        input.addEventListener('click', function(e) {
            var email = document.getElementById('emailLogin').value;
            console.log(email);
            var pass = document.getElementById('passLogin').value;
            if (pass.length > 0 && email.length > 0) {

                const data = {
                    email: email,
                    pass: pass
                }

                console.log('Perfetto puoi andare')
                console.log(url)
                fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ data })
                    })
                    .then(res => res.json())
                    .then(response => {

                        Swal.fire({
                            title: response['message'],
                            icon: 'info',
                            confirmButtonText: 'OK',
                            customClass: 'myAlert'
                        }).then((result) => {
                            if (response['message'] === 'Welcome Boss!')
                                window.location.href = '/adminHome';
                            else
                                window.location.reload();
                        })


                    });
            } else {
                Swal.fire({
                    title: 'Some fields are empty!',
                    customClass: 'myAlert'
                });
            }


        });
    });