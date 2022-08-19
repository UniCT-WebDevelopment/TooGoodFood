fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];

        const url = 'http://' + ipServer + ':' + +myPort + '/home';
        var list_products;


        var check = {}
        data = {}
            //FUNZIONE PER IL CHECK DELLA QUANTITÀ PER OGNI INGREDIENTE
        async function checkIngredienti(myIngredients) {
            var results = {}
            var checked;
            var ingredientiURL = 'http://' + ipServer + ':' + +myPort + '/ingredienti'

            for (var i = 0; i < myIngredients.length; i++) {
                var mysplit = myIngredients[i].split(':');
                console.log(mysplit);
                const myData = {
                    name: mysplit[0],
                    qty: mysplit[1]
                }
                const res = await fetch(ingredientiURL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ myData })
                    })
                    .then(function(response) { return response.json(); })
                    .then(function(data2) {
                        console.log(data2);
                        checked = data2;


                    })
                    .catch(function() {
                        console.log('NO data');
                    });


                results[mysplit[0]] = checked;

            }
            return results;
        }

        class Product {
            id;
            name;
            category;
            image;
            price;
            Product() {};
            Product(data) {
                this.id = data['id'];
                this.name = data['name'];
                this.category = data['category'];
                this.image = data['image'];
                this.price = data['price'];
                this.ingredients = data['ingredients'];

            }
        }

        function newProduct(data) {
            myP = new Product();
            myP['id'] = data['id'];
            myP['name'] = data['name']
            myP['ingredienti'] = data['ingredienti'];
            myP['image'] = data['image'];
            myP['price'] = data['price'];
            myP['category'] = data['category'];
        }


        fetch(url).then(response => response.json())
            .then(function(data) {

                for (var i = 0; i < data.length; i++) {
                    newProduct(data[i]);
                    var x = myP['image'];
                    createNewForm(myP, x);

                }


            });


        function createNewForm(product, x) {
            var form = document.createElement('form');
            form.setAttribute('method', 'post');
            form.className = 'box'

            var buttonEye = document.createElement('a');
            buttonEye.className = 'fas fa-eye';
            buttonEye.onclick = function() {

                const quickViewURL = 'http://' + ipServer + ':' + +myPort + '/quickView/';

                console.log(quickViewURL + '/' + product['id']);
                console.log('Perfetto puoi andare')

                //fetch(menuURL + '/' + product['id']);
                location.href = quickViewURL + product['id']
                console.log('Successfully');


            }

            var buttonShop = document.createElement('a');
            buttonShop.className = 'fas fa-shopping-cart';




            var productImage = document.createElement('img');

            productImage.src = '../uploaded_img/' + x

            productImage.alt = product['name'] + ' immagine';



            var category = document.createElement('a');
            category.href = '#';
            category.className = 'cat';
            category.innerHTML = product['category'];

            var divName = document.createElement('div');
            divName.className = 'name';
            divName.innerHTML = product['name'];

            var spanPrice = document.createElement('span');
            spanPrice.innerHTML = '$';

            var divPrice = document.createElement('div');
            divPrice.className = 'price';
            divPrice.innerHTML = product['price'];
            divPrice.appendChild(spanPrice);


            var quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.name = 'qty';
            quantityInput.className = 'qty';
            quantityInput.min = 1
            quantityInput.max = 99;
            quantityInput.value = 1;



            //FUNZIONALITÀ SHOP BUTTON
            var myIngredients = product['ingredienti'].split(' ');

            buttonShop.onclick = () => {
                const userURL = 'http://' + ipServer + ':' + +myPort + '/getUser';

                fetch(userURL).then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {

                        //SE NON é LOGGATO NON PUÒ INSERIRE PRODOTTI NEL CARRELLO
                        console.log('ID USER PRIMA FETCH', data['userid']);

                        if (data['message'] == 'Not connected') {
                            Swal.fire({
                                title: 'You have to be logged in',
                                icon: 'info',
                                customClass: 'myAlert'
                            })
                            window.location.href = 'http://' + ipServer + ':' + +myPort + '/';
                        }
                        //USER LOGGED !!!
                        else {

                            if (quantityInput.value <= 0) {
                                Swal.fire({
                                    title: 'Quantity must be greater than zero',
                                    customClass: 'myAlert',
                                    confirmButtonText: 'OK',
                                });
                            } else {

                                //CHIAMO LA FUNZIONE PER IL CHECK DEGLI INGREDIENTI
                                check = checkIngredienti(myIngredients, quantityInput.value).then(function(result) {
                                    console.log(result);

                                    var tuttoOK = true;
                                    var errore = false;
                                    for (var i = 0; i < myIngredients.length; i++) {
                                        var mySplit = myIngredients[i].split(':');
                                        if (result[mySplit[0]] == false) {
                                            errore = true;
                                            //NOTIFICA L'ADMIN  ///
                                            const adminMessageURL = 'http://' + ipServer + ':' + +myPort + '/adminMessage';
                                            alertString = mySplit[0] + ' is not avaible for ' + quantityInput.value + ' ' +
                                                product['name'];
                                            const message = {
                                                ingrediente: mySplit[0],
                                                message: alertString
                                            }
                                            fetch(adminMessageURL, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({ message })
                                            }).then(response => response.json())
                                        }
                                    }
                                    //SE C'È ALMENO UN ERRORE ALLORA NON È TUTTO OK
                                    if (errore) tuttoOK = false;

                                    if (tuttoOK) {

                                        //PRENDO LA QUANTITÀ
                                        var qty = quantityInput.value;

                                        const urlCart = 'http://' + ipServer + ':' + +myPort + '/cart'
                                        console.log(product['name']);
                                        const cartData = {
                                            idUtente: data['userid'],
                                            idProdotto: product['id'],
                                            nomeProdotto: product['name'],
                                            price: product['price'],
                                            qty: parseInt(qty),
                                            image: x
                                        }
                                        console.log(cartData);
                                        fetch(urlCart, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({ cartData })
                                            })
                                            .then(function(response) { return response.json(); })
                                            .then(function(data) {});
                                        Swal.fire({
                                            title: 'Product added to cart!',
                                            customClass: 'myAlert'

                                        });
                                    }
                                    //SE IL CHECK NON VA BENE SIGNIFICA CHE IL PRODOTTO NON È DISPONIBILE 
                                    else {
                                        Swal.fire({
                                            title: 'Il prodotto non è disponibile nella quantità desiderata',
                                            customClass: 'myAlert'

                                        });
                                    }

                                });
                            }
                        }
                    });
            }


            //FINE INGREDIENTI///

            var divFlex = document.createElement('div');
            divFlex.className = 'flex';

            divFlex.appendChild(divPrice);
            divFlex.appendChild(quantityInput);

            form.appendChild(buttonEye);
            form.appendChild(buttonShop);
            form.appendChild(productImage);
            form.appendChild(category);
            form.appendChild(divName);
            form.appendChild(divFlex);


            var box = document.getElementById('contenitoreProductsHome');

            box.appendChild(form);

        }
    });