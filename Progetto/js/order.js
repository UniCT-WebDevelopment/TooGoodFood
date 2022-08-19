//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];
        class Order {
            name;
            number;
            consumazione;
            address;
            total_products;
            total_price;
            placed_on;
            Order() {};
        }

        function newOrder(data) {
            order = new Order();
            order['name'] = data['name']
            order['number'] = data['number']
            order['consumazione'] = data['consumazione']
            order['address'] = data['address']
            order['total_products'] = data['total_products']
            order['total_price'] = data['total_price']
            order['placed_on'] = data['placed_on'];

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



            box.appendChild(h3);
            box.appendChild(p_name);
            box.appendChild(p_number);
            box.appendChild(p_consumazione);
            console.log(order['consumazione']);
            if (order['consumazione'] == 'Home Delivery') {
                console.log('YEE')
                box.appendChild(p_address);
            }
            box.appendChild(p_products)
            box.appendChild(p_price);

            var container = document.getElementById('orders-container');
            container.appendChild(box);

        }

        const userURL = 'http://' + ipServer + ':' + +myPort + '/getUser';

        async function getUser() {
            var user_id
            await fetch(userURL).then(response => response.json())
                .then(data => user_id = (data['userid']));


            //L'UTENTE È CONNESSO
            if (user_id) {
                console.log('Current user id', user_id);
                const orderData = {
                        user_id: user_id
                    }
                    //GET THE ORDERS OF THE USER
                async function loadingOrders() {
                    const orderURL = 'http://' + ipServer + ':' + +myPort + '/orders/' + user_id;
                    const res = await fetch(orderURL)
                        .then(function(response) {
                            return response.json();
                        }).then(data => list_products = data);

                    for (var i = 0; i < list_products.length; i++) {
                        newOrder(list_products[i]);
                        console.log(order)
                        createNewDivOrder(order);
                    }
                }

                loadingOrders();
            }
        }

        getUser()
    });