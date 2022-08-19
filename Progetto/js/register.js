//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];
        var url = 'http://' + ipServer + ':' + +myPort + '/register';

        function myFunct(email) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return true
            } else {
                return false
            }
        }

        function passwordCheck(pass) {
            if (pass.length > 8)
                return true
            else return false
        }

        function validate(number) {
            const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            return (regex.test(number));
        }


        var input = document.getElementById('submitInput');

        input.addEventListener('click', function(e) {
            var username = document.getElementById('username').value;
            var email = document.getElementById('email').value;
            var number = document.getElementById('number').value;
            var pass = document.getElementById('pass').value;
            var address = document.getElementById('address').value;
            console.log('Tutto preso')
            if (username && email && number && pass && address) {

                if (passwordCheck(pass)) {
                    if (validate(number)) {
                        if (!myFunct(email)) {
                            Swal.fire({
                                title: 'Insert a valid email address',
                                customClass: 'myAlert'

                            });
                            fetch(url);
                        } else {
                            const data = {
                                name: username,
                                email: email,
                                pass: pass,
                                address: address,
                                number: number
                            }
                            console.log(data)

                            console.log('Perfetto puoi andare')

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
                                        if (response['message'].includes('already'))
                                            location.href = url;
                                        else
                                            location.href = 'http://' + ipServer + ':' + +myPort + '';
                                    })


                                });


                        }
                    } else {
                        Swal.fire({
                            title: 'Insert a valid number',
                            customClass: 'myAlert'

                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Password must be at least 8 digits',
                        customClass: 'myAlert'

                    });
                }
            } else {
                Swal.fire({
                    title: 'Some fields are empty',
                    customClass: 'myAlert'

                });
                fetch(url);

            }

        });

    });