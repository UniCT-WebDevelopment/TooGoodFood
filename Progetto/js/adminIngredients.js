//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];

        var add_product_BTN = document.getElementById('submitInput');
        const urlIngredients = 'http://' + ipServer + ':' + +myPort + '/adminIngredients/all'


        add_product_BTN.onclick = function() {
            var name = document.getElementById('name').value
            var qty = document.getElementById('qty').value

            if (name.length > 0 && qty.length > 0) {
                const ingredientData = {
                    name: name,
                    qty: qty,
                }

                console.log(ingredientData);
                const urlAdd = 'http://' + ipServer + ':' + +myPort + '/adminIngredients'

                fetch(urlAdd, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ ingredientData })
                    }).then(response => response.json())
                    .then(data => {
                        Swal.fire({
                            title: data['message'],
                            icon: 'info',
                            customClass: 'myAlert',
                            confirmButtonText: 'OK',
                            customClass: 'myAlert'
                        }).then((result) => {
                            window.location.reload();
                        });
                    })

            }

            //No fill
            else {
                Swal.fire({
                    title: 'Each field is required',
                    icon: 'info',
                    customClass: 'myAlert'
                })
            }

        }






        class Ingredient {
            id;
            name;
            price;
            Ingredient() {};
            Ingredient(data) {
                this.id = data['id'];
                this.name = data['name'];
                this.price = data['qty'];
            }
        }

        function createNewForm(product) {
            var form = document.createElement('form');
            form.setAttribute('method', 'post');
            form.className = 'box'


            var buttonDelete = document.createElement('button');
            buttonDelete.type = 'button';
            buttonDelete.className = 'fas fa-times';

            buttonDelete.onclick = function() {

                const urlRemove = 'http://' + ipServer + ':' + +myPort + '/adminIngredients/' + product['id'];

                const cartData = {
                    idProdotto: product['id']
                }
                Swal.fire({
                    title: 'Remove this ingredient?',
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
                                body: JSON.stringify({ cartData })
                            })
                            .then(function(response) { return response.json(); })
                            .then(function(data) {
                                Swal.fire({
                                        title: data['message'],
                                        icon: 'info',
                                        customClass: 'myAlert',
                                        confirmButtonText: 'OK'
                                    })
                                    .then((result) => {
                                        window.location.reload();

                                    })
                            });

                    }
                });

            }


            var divName = document.createElement('div');
            divName.className = 'name';
            divName.innerHTML = product['name'];


            var divPrice = document.createElement('div');
            divPrice.className = 'price';
            divPrice.innerHTML = product['qty'];
            var span_qty = document.createElement('span');
            span_qty.innerHTML = 'g'
            divPrice.appendChild(span_qty);


            var divFlex = document.createElement('div');
            divFlex.className = 'flex';


            divFlex.appendChild(divPrice);

            form.appendChild(buttonDelete)
            form.appendChild(divName);
            form.appendChild(divFlex);


            var box = document.getElementById('contenitoreProductsHome');

            box.appendChild(form);
        }


        function newProduct(data) {
            myP = new Ingredient();
            myP['id'] = data['id'];
            myP['name'] = data['name']
            myP['qty'] = data['qty'];
        }

        var list_products;

        async function loadingProducts() {

            const res = await fetch(urlIngredients)
                .then(function(response) { return response.json(); })
                .then(data => list_products = data)
                .then(function(data) {

                })
                .catch(function() {
                    console.log('NO data');
                });

            for (var i = 0; i < list_products.length; i++) {
                newProduct(list_products[i]);
                console.log(list_products[i]);
                var nuovo = createNewForm(myP);
            }


        }

        loadingProducts();
    });