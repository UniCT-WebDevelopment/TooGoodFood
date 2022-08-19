//READ FILE PORT NUMBER
fetch('../config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];
        console.log(myPort)

        //Make a post request to collect the data of the object specified in the url
        console.log(location.href);

        const myArray = location.href.split('/');
        var id = (myArray[myArray.length - 1]);

        var check = {}
        data = {}
        var url = 'http://' + ipServer + ':' + +myPort + '/quickView';
        url = (url + '/' + id);


        //FUNZIONE PER IL CHECK DELLA QUANTITÀ PER OGNI INGREDIENTE
        async function checkIngredienti(myIngredients, quantitàProdotto) {
            var results = {}
            var checked;
            var ingredientiURL = 'http://' + ipServer + ':' + +myPort + '/ingredienti'

            //PRENDO LA QUANTITÀ IN CUI IL PRODOTTO È STATO ORDINATO E LA MOLTIPLICO PER LA QUANTITÀ DELL'INGREDIENTE


            for (var i = 0; i < myIngredients.length; i++) {
                var mysplit = myIngredients[i].split(':');
                console.log(mysplit);
                const myData = {
                    name: mysplit[0],
                    qty: mysplit[1] * quantitàProdotto
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



        //CLASSE PER LA FLEX DI OGNI PRODOTTO

        class Product {
            id;
            name;
            category;
            image;
            price;
            ingredients;
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

        function createNewForm(product, x) {
            var form = document.createElement('form');
            form.setAttribute('method', 'post');
            form.className = 'box'

            // var buttonEye = document.createElement('a');
            // buttonEye.className = 'fas fa-eye';
            // buttonEye.onclick = function() {
            //     const menuURL = 'http://' + ipServer+ ':' + + myPort + '/quickView/';

            //     console.log(menuURL + '/' + product['id']);
            //     console.log('Perfetto puoi andare')

            //     //fetch(menuURL + '/' + product['id']);
            //     location.href = menuURL + product['id']
            //     console.log('Successfully');


            // }





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
            divName.id = 'name'



            var divTitolIngredient = document.createElement('div');
            divTitolIngredient.className = 'name'
            divTitolIngredient.innerHTML = 'Ingredients'
            divTitolIngredient.style.fontWeight = 'bold';


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

            var divFlex = document.createElement('div');
            divFlex.className = 'flex';

            divFlex.appendChild(divPrice);
            divFlex.appendChild(quantityInput);

            //form.appendChild(buttonEye);
            form.appendChild(productImage);
            form.appendChild(category);
            form.appendChild(divName);
            form.appendChild(divTitolIngredient);

            /////INGREDIENTIII////

            //GENERAZIONE DINAMICA NELL'HTML
            var myIngredients = product['ingredienti'].split(' ');

            for (var i = 0; i < myIngredients.length; i++) {
                console.log(myIngredients[i]);
                var mysplit = myIngredients[i].split(':');
                var divIngredient = document.createElement('div');
                divIngredient.className = 'name'
                divIngredient.innerHTML = mysplit[0]

                form.appendChild(divIngredient);
            }


            //FUNZIONALITÀ SHOP BUTTON



            //FINE INGREDIENTI///


            form.appendChild(divFlex);
            var box = document.getElementById('contenitoreProductsHome');
            box.appendChild(form);

        }


        function newProduct(data) {
            myP = new Product();
            myP['id'] = data['id'];
            myP['name'] = data['name'];
            myP['ingredienti'] = data['ingredienti'];
            myP['image'] = data['image'];
            myP['price'] = data['price'];
            myP['category'] = data['category'];
        }

        var product;

        async function loadingProducts() {


            const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data })
                })
                .then(function(response) { return response.json(); })
                .then(data => product = data)
                .then(function(data) {
                    console.log(data);
                })
                .catch(function() {
                    console.log('NO data');
                });



            newProduct(product);
            var x = myP['image'];
            createNewForm(myP, x);


        }

        loadingProducts();
    });