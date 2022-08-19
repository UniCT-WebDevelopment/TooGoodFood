//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];
        var cart_total = 0;
        var pcart_total = document.getElementById('cart-total-span');
        var check = {};
        var counter = 0;
        //FUNZIONE PER IL CHECK DELLA QUANTITÀ PER OGNI INGREDIENTE
        async function checkIngredienti(myIngredients, quantitàProdotto, queryProduct, counter) {
            var results = {}
            var lista = {}

            var checked;
            var ingredientiURL = 'http://' + ipServer + ':' + +myPort + '/ingredienti'
                //PRENDO LA QUANTITÀ IN CUI IL PRODOTTO È STATO ORDINATO E LA MOLTIPLICO PER LA QUANTITÀ  NECESSARIA DELL'INGREDIENTE
            for (var i = 0; i < myIngredients.length; i++) {
                var mysplit = myIngredients[i].split(':');
                const myData = {
                    name: mysplit[0],
                    qty: mysplit[1] * quantitàProdotto
                }
                console.log('CHECK SU QUESTO INGREDIENTE', myData);
                var name = mysplit[0];
                var qty = mysplit[1];
                const res = await fetch(ingredientiURL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ myData })
                    })
                    .then(function(response) { return response.json(); })
                    .then(function(data2) {
                        checked = data2;
                    })
                    .catch(function() {
                        console.log('NO data');
                    });

                lista[mysplit[0]] = mysplit[1] * quantitàProdotto;
                results[mysplit[0]] = checked;


            }

            const data = [results, lista]
            return data;

        }

        //PRODUCT PREVIEW
        class Product {
            id;
            name;
            image;
            price;
            qty;
            Product() {};

        }

        function newProduct(data) {
            myP = new Product();
            myP['id'] = data['pid'];
            myP['name'] = data['name']
            myP['image'] = data['image'];
            myP['price'] = data['price'];
            myP['qty'] = data['quantity'];
        }



        function createNewForm(product, x, user_id) {

            var form = document.createElement('form');
            form.setAttribute('method', 'post');
            form.className = 'box'

            var buttonEye = document.createElement('a');
            buttonEye.className = 'fas fa-eye';
            buttonEye.onclick = function() {
                const quickViewURL = 'http://' + ipServer + ':' + +myPort + '/quickView/';

                console.log(quickViewURL + '/' + product['id']);

                //fetch(menuURL + '/' + product['id']);
                location.href = quickViewURL + product['id']
                console.log('Successfully');


            }

            //DELETE BUTTON LOGIC
            var buttonDelete = document.createElement('button');
            buttonDelete.type = 'button';
            buttonDelete.className = 'fas fa-times';

            buttonDelete.onclick = function() {

                const urlCart = 'http://' + ipServer + ':' + +myPort + '/cart/' + user_id;

                const cartData = {
                    idProdotto: product['id']
                }
                console.log(user_id);
                console.log(urlCart);

                Swal.fire({
                    title: 'Remove this product?',
                    icon: 'question',
                    showDenyButton: true,
                    confirmButtonText: 'Yes',
                    denyButtonText: 'No',
                    customClass: 'myAlert'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        fetch(urlCart, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ cartData })
                            })
                            .then(function(response) { return response.json(); })
                            .then(function(data) {
                                //alert(data['message']);

                            });

                        window.location.reload();
                    }
                })

            }


            var productImage = document.createElement('img');

            productImage.src = '../uploaded_img/' + x

            productImage.alt = product['name'] + ' immagine';


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
            quantityInput.readOnly = true;
            quantityInput.value = product['qty'];

            var divFlex = document.createElement('div');
            divFlex.className = 'flex';

            var subTotalDiv = document.createElement('div');
            subTotalDiv.className = 'sub-total';
            subTotalDiv.innerHTML = 'sub total: ';

            var sub_total_int = parseInt(product['price'] * parseInt(product['qty']))
                //Aggiorno il counter di prezzi
            cart_total += sub_total_int;

            var span_sub_total = document.createElement('span');
            span_sub_total.innerHTML = sub_total_int + '$'

            subTotalDiv.appendChild(span_sub_total);


            divFlex.appendChild(divPrice);
            divFlex.appendChild(quantityInput);




            form.appendChild(buttonEye);
            form.appendChild(buttonDelete);
            form.appendChild(productImage);
            form.appendChild(divName);
            form.appendChild(divFlex);
            form.appendChild(subTotalDiv);


            var box = document.getElementById('box-container');

            box.appendChild(form);


        }

        const userURL = 'http://' + ipServer + ':' + +myPort + '/getUser';
        var user_id;

        async function getUser() {
            var user_id
            await fetch(userURL).then(response => response.json())
                .then(data => user_id = (data['userid']));


            //L'UTENTE È CONNESSO
            if (user_id) {
                console.log('Current user id', user_id);

                //OOTENIAMO I DATI DEL CARRELLO PER LO SPECIFICO UTENTE

                const cartURL = 'http://' + ipServer + ':' + +myPort + '/cart/' + user_id;

                //cart_total è usata per mantenere traccia del cart total

                async function loadingProducts() {

                    const res = await fetch(cartURL)
                        .then(function(response) { return response.json(); })
                        .then(data => list_products = data)
                        .then(function(data) {

                        })
                        .catch(function() {
                            console.log('NO data');
                        });

                    for (var i = 0; i < list_products.length; i++) {
                        newProduct(list_products[i]);
                        var x = myP['image'];
                        createNewForm(myP, x, user_id);
                    }


                    pcart_total.innerHTML = (cart_total) + '$'

                }

                loadingProducts();


                var orderBTN = document.getElementById('orderBTN');
                orderBTN.onclick = () => {
                    Swal.fire({
                        title: 'Commit This Order?',
                        icon: 'question',
                        showDenyButton: true,
                        confirmButtonText: 'Yes',
                        denyButtonText: 'No',
                        customClass: 'myAlert'
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {

                            if (list_products.length > 0) {

                                //Conservo quantità e nomi dei prodotti ordinati
                                var prodotti_ordinati = '';
                                for (var i = 0; i < list_products.length; i++) {
                                    prodotti_ordinati += list_products[i]['name'] + ':' + list_products[i]['quantity'] + ' ';
                                }

                                //Consumazione
                                var select = document.getElementById('consumazione');
                                var value = select.options[select.selectedIndex].value;

                                //Ottengo i dati dell'utente
                                const userURL = 'http://' + ipServer + ':' + +myPort + '/profile';
                                const myData = {
                                    id: user_id
                                }
                                fetch(userURL, {
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

                                        var productsAvaible = {};
                                        var lista_ingredienti = [];
                                        var complete = true;
                                        //PER OGNI PRODOTTO OTTENGO I DATI SUI SUOI INGREDIENTI E POI FACCIO UN ULTIMO CHECK PER VERIFICARNE LA DISPONIBILITITÀ
                                        function checkInIntervals(howManyTimes, howOften) {
                                            var i = 0;

                                            var interval = setInterval(function() {
                                                if (i == howManyTimes - 1) { clearInterval(interval); }
                                                complete = false;
                                                console.log(i)
                                                var quantita = list_products[i]['quantity'];
                                                var queryProduct = list_products[i]['name'];
                                                console.log('Log query product', queryProduct)
                                                    // console.log(quantita)
                                                async function getProductsIngredients(quantita, queryProduct) {
                                                    var myIngredients;
                                                    var quickViewURL = 'http://' + ipServer + ':' + +myPort + '/quickView/' + list_products[i]['pid'];
                                                    const res = await fetch(quickViewURL, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            //body: JSON.stringify({ data })
                                                        })
                                                        .then(function(response) { return response.json(); })
                                                        .then(function(data) {
                                                            myIngredients = data['ingredienti'];
                                                        })

                                                    //CHECK CHE TUTTI GLI INGREDIENTI CI SIANO PER QUEL PRODOTTO
                                                    console.log('Ingredienti ottenuti: ', myIngredients)

                                                    var myIngredients = myIngredients.split(' ');
                                                    checkIngredienti(myIngredients, quantita, queryProduct).then(function(data) {

                                                        tuttoOK = true;
                                                        var errore = false;
                                                        for (var i = 0; i < myIngredients.length; i++) {
                                                            var mySplit = myIngredients[i].split(':');
                                                            if (data[0][mySplit[0]] == false) {
                                                                errore = true;

                                                                //NOTIFICA L'ADMIN  ///
                                                                //FALLA QUI PERCHÈ HAI I NOMI DI OGNI Ingrediente
                                                                const adminMessageURL = 'http://' + ipServer + ':' + +myPort + '/adminMessage';
                                                                alertString = mySplit[0] + ' is not avaible for ' + quantita + ' ' +
                                                                    queryProduct
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

                                                                console.log('Notifica fatta')

                                                            }
                                                        }

                                                        //SE C'È ALMENO UN ERRORE ALLORA NON È TUTTO OK
                                                        if (errore) tuttoOK = false;
                                                        if (tuttoOK) {
                                                            console.log('Ci sono tutti gli ingredienti per: ', queryProduct);
                                                            console.log('Ecco la lista dei suoi ingredienti ', data[1]);

                                                            // const updateProvvisorio = async function() {
                                                            //AGGIORNO LISTA INGREDIENTI PROVVISORIAMENTE

                                                            const updateIngredientiURL = 'http://' + ipServer + ':' + +myPort + '/ingredienti/update'
                                                            for (var i = 0; i < myIngredients.length; i++) {
                                                                var mySplit = myIngredients[i].split(':');
                                                                const myData = {
                                                                    name: mySplit[0],
                                                                    qty: data[1][mySplit[0]]
                                                                }
                                                                fetch(updateIngredientiURL, {
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Content-Type': 'application/json'
                                                                        },
                                                                        body: JSON.stringify({ myData })
                                                                    }).then(response => response.json())
                                                                    .then(data => console.log(data['message']));


                                                                console.log('Ingrediente ', myData, ' aggiornato');

                                                            }



                                                            // }
                                                            //Aggiorno la lista degli elementi per cui ho fatto l'update
                                                            //updateProvvisorio();
                                                            lista_ingredienti.push(data[1])
                                                            complete = true;

                                                        } else {
                                                            alertString = queryProduct + ' is not avaible in this quantity anymore!'
                                                            Swal.fire({
                                                                title: alertString,
                                                                icon: 'info',
                                                                customClass: 'myAlert',
                                                                confirmButtonText: 'OK'
                                                            })
                                                            complete = true;

                                                        }
                                                        productsAvaible[i] = tuttoOK;
                                                    });
                                                }
                                                getProductsIngredients(quantita, queryProduct, productsAvaible);



                                                i++;
                                            }, howOften);




                                            //for (var i = 0; i < list_products.length && complete; i++) {
                                        }

                                        checkInIntervals(list_products.length, 300);

                                        function resultOrder() {




                                            var result = true;
                                            console.log('Numero prodotti processati', productsAvaible)
                                            for (var i in productsAvaible) {
                                                if (productsAvaible[i] === false) {
                                                    result = false;
                                                    break;
                                                }
                                            }

                                            console.log('Conferma per tutti i prodotti', result); // 👉️ true
                                            // SE QUALCHE PRODOTTO NON È DISPONIBILE NON LO FACCIO PROSEGUIRE
                                            //INOLTRE ANNULLO L'AGGIORNAMENTO DELLA TABELLA INGREDIENTI
                                            if (!result) {

                                                console.log('REVERT ')


                                                console.log('QUESTA è la lista degli ingredienti su cui fare il revert', lista_ingredienti);
                                                //REVERT DELL'UPDATE DEI PRODOTTI
                                                const updateIngredientiURL = 'http://' + ipServer + ':' + +myPort + '/ingredienti/revert'
                                                for (var i = 0; i < lista_ingredienti.length; i++) {
                                                    for (let key in lista_ingredienti[i]) {
                                                        console.log('Revert di', key, ' ', lista_ingredienti[i][key])
                                                        const myData = {
                                                            name: key,
                                                            qty: lista_ingredienti[i][key]
                                                        }
                                                        console.log(myData)
                                                        fetch(updateIngredientiURL, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                body: JSON.stringify({ myData })
                                                            }).then(response => response.json())
                                                            .then(data => console.log(data['message']));
                                                    }

                                                }


                                            } else {

                                                const orderData = {
                                                    user_id: user_id,
                                                    name: data[0]['name'],
                                                    number: data[0]['number'],
                                                    consumazione: value,
                                                    address: data[0]['address'],
                                                    total_products: prodotti_ordinati,
                                                    total_price: cart_total,
                                                }
                                                console.log(orderData);

                                                const orderURL = 'http://' + ipServer + ':' + +myPort + '/orders';
                                                fetch(orderURL, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({ orderData })
                                                    })
                                                    .then(function(response) {
                                                        return response.json();
                                                    }).then(data => console.log(data['message']));


                                                Swal.fire({
                                                    title: 'Order Sent Successfully!',
                                                    icon: 'info',
                                                    confirmButtonText: 'OK',
                                                    customClass: 'myAlert'
                                                }).then((result) => {


                                                    //RIMUOVO TUTTI GLI ELEMENTI DAL CARRELLO
                                                    const urlCart = 'http://' + ipServer + ':' + +myPort + '/cart/' + user_id;

                                                    const cartData = {
                                                        all: 1
                                                    }

                                                    fetch(urlCart, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({ cartData })
                                                        })
                                                        .then(function(response) { return response.json(); })
                                                        .then(function(data) {
                                                            //alert(data['message']);

                                                        });

                                                    window.location.reload();




                                                    setTimeout(window.location.reload(), 100);
                                                });

                                            }

                                        }


                                        const myResultOrder = setTimeout(resultOrder, 2000);

                                    });
                            } else {
                                Swal.fire({
                                    title: 'Cart Is Empty!',
                                    customClass: 'myAlert'

                                });
                            }

                        }
                    });
                }
            }

        }

        getUser();
    });