//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];
        const userURL = 'http://' + ipServer + ':' + +myPort + '/getUser';

        const dataURL = 'http://' + ipServer + ':' + +myPort + '/profile';

        var userID;

        function createSectionProfile(data) {
            var section = document.getElementById('user-details');

            var container = document.createElement('div');
            container.className = 'user';


            var image = document.createElement('img');
            image.src = '../images/user-icon.png';
            image.alt = 'User Image';



            var name = document.createElement('p');
            var icon_name = document.createElement('i');
            icon_name.className = 'fas fa-user';
            var span_name = document.createElement('span');
            span_name.innerHTML = data['name'];

            name.appendChild(icon_name);
            name.appendChild(span_name);


            var number = document.createElement('p');
            var icon_number = document.createElement('i');
            icon_number.className = 'fas fa-phone';
            var span_number = document.createElement('span');
            span_number.innerHTML = data['number'];
            number.appendChild(icon_number);
            number.appendChild(span_number);


            var email = document.createElement('p');
            var icon_email = document.createElement('i');
            icon_email.className = 'fas fa-envelope';
            var span_email = document.createElement('span');
            span_email.innerHTML = data['email'];
            email.appendChild(icon_email);
            email.appendChild(span_email);


            var address = document.createElement('p');
            address.className = 'address'
            var icon_address = document.createElement('i');
            icon_address.className = 'fas fa-map-marker-alt';
            var span_address = document.createElement('span');
            span_address.innerHTML = data['address'];
            address.appendChild(icon_address);
            address.appendChild(span_address);

            container.appendChild(image);
            container.appendChild(name);
            container.appendChild(number);
            container.appendChild(email);
            container.appendChild(address);

            section.appendChild(container);

        }

        fetch(userURL).then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                if (data['message'] == 'Not connected') {
                    window.location.href = 'http://' + ipServer + ':' + +myPort + '/';
                } else {
                    const myData = {
                        id: data['userid']
                    }
                    console.log(myData)

                    console.log('Perfetto puoi andare')

                    fetch(dataURL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ myData })
                        })
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(data) {
                            console.log(data[0]['name']);

                            createSectionProfile(data[0]);

                        })


                    .catch(function() {
                        console.log('NO data');
                    });
                }
            })



        .catch(function() {
            console.log('NO data');
        });

    });