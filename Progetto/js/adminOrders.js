//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];

        class Order {
            id;
            name;
            number;
            consumazione;
            address;
            total_products;
            total_price;
            placed_on;
            status;
            Order() {};
        }

        function newOrder(data) {
            order = new Order();
            order['id'] = data['id'];
            order['name'] = data['name']
            order['number'] = data['number']
            order['consumazione'] = data['consumazione']
            order['address'] = data['address']
            order['total_products'] = data['total_products']
            order['total_price'] = data['total_price']
            order['placed_on'] = data['placed_on'];
            order['status'] = data['status'];

        }

        function createNewDivOrder(order) {

            var box = document.createElement('div');
            box.className = 'box';

            var h3 = document.createElement('h3');
            h3.innerHTML = 'placed on: ';
            var h3span = document.createElement('span');
            var date = order['placed_on'].split('T');
            var time = date[1].split('.');
            var date_time = date[0] + ' at ' + time[0];

            h3span.innerHTML = date_time
            h3.appendChild(h3span);

            var checkBTN = document.createElement('button');
            checkBTN.type = 'button';
            checkBTN.className = 'fas fa-edit';

            checkBTN.onclick = function() {

                const urlRemove = 'http://' + ipServer + ':' + +myPort + '/adminOrders/'

                const orderData = {
                    id: order['id']
                }

                Swal.fire({
                    title: 'Complete This Order?',
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
                                body: JSON.stringify({ orderData })
                            })
                            .then(function(response) { return response.json(); })
                            .then(function(data) {});

                        window.location.reload();
                    }
                });

            }

            var p_name = document.createElement('p');
            p_name.innerHTML = 'name: ';
            var span_p_name = document.createElement('span');
            span_p_name.innerHTML = order['name'];
            p_name.appendChild(span_p_name);

            var p_number = document.createElement('p');
            p_number.innerHTML = 'number: ';
            var span_p_number = document.createElement('span');
            span_p_number.innerHTML = order['number'];
            p_number.appendChild(span_p_number);


            var p_address = document.createElement('p');
            p_address.innerHTML = 'address: ';
            var span_p_address = document.createElement('span');
            span_p_address.innerHTML = order['address'];
            p_address.appendChild(span_p_address);

            var p_consumazione = document.createElement('p');
            p_consumazione.innerHTML = 'orderType: ';
            var span_p_consumazione = document.createElement('span');
            span_p_consumazione.innerHTML = order['consumazione'];
            p_consumazione.appendChild(span_p_consumazione);


            var p_products = document.createElement('p');
            p_products.innerHTML = 'products: ';
            var span_p_products = document.createElement('span');
            span_p_products.innerHTML = order['total_products'];
            p_products.appendChild(span_p_products);

            var p_price = document.createElement('p');
            p_price.innerHTML = 'orderTotal: ';
            var span_p_price = document.createElement('span');
            span_p_price.innerHTML = order['total_price'] + '$'
            p_price.appendChild(span_p_price);

            var p_status = document.createElement('p');
            p_status.innerHTML = 'status: ';
            var span_p_status = document.createElement('span');
            span_p_status.innerHTML = order['status'];
            p_status.appendChild(span_p_status);
            if (order['status'] == 'pending')
                p_status.id = 'status';




            box.appendChild(h3);
            box.appendChild(p_name);
            box.appendChild(p_number);
            box.appendChild(p_consumazione)
            if (order['consumazione'] == 'Home Delivery') {
                box.appendChild(p_address);
            }
            box.appendChild(p_products)
            box.appendChild(checkBTN);

            box.appendChild(p_price);
            box.appendChild(p_status);
            if (span_p_status.innerHTML == 'completed') {
                checkBTN.style.visibility = 'hidden';
                checkBTN.disabled = 'disabled';
            }
            var container = document.getElementById('orders-container');
            container.appendChild(box);

        }


        async function loadingOrders() {
            const orderURL = 'http://' + ipServer + ':' + +myPort + '/adminOrders/all'
            const res = await fetch(orderURL)
                .then(function(response) {
                    return response.json();
                }).then(data => list_products = data);

            for (var i = 0; i < list_products.length; i++) {
                console.log(list_products[i]);
                newOrder(list_products[i]);
                createNewDivOrder(order);
            }
        }

        loadingOrders();
    });