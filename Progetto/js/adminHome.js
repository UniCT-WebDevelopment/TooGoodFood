//READ FILE PORT NUMBER
fetch('config.json')
    .then(response => response.text())
    .then(config => {
        config = JSON.parse(config);
        var myPort = config['portServer'];
        var ipServer = config['ipServer'];


        var add_product_BTN = document.getElementById('submitInput');
        const urlProducts = 'http://' + ipServer + ':' + +myPort + '/adminHome'


        add_product_BTN.onclick = function() {
            var name = document.getElementById('name').value
            var price = document.getElementById('price').value
            var category = document.getElementById('category').value
            var ingredients = document.getElementById('ingredients').value

            var string_image = document.getElementById('image').value;
            string_image = string_image.split('\\')[2];

            if (name.length > 0 && price.length > 0 && category.length > 0 && ingredients.length > 0 && string_image.length > 0) {
                const productData = {
                    name: name,
                    category: category,
                    price: price,
                    ingredienti: ingredients,
                    image: string_image
                }


                fetch(urlProducts, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ productData })
                    }).then(response => response.json())
                    .then(data => {
                        Swal.fire({
                            title: data['message'],
                            icon: 'info',
                            confirmButtonText: 'OK',
                            customClass: 'myAlert'
                        }).then((result) => {
                            window.location.reload();
                        });
                    });

            } else {
                Swal.fire({
                    title: 'Each field is required',
                    icon: 'info',
                    customClass: 'myAlert',
                    confirmButtonText: 'OK',
                    customClass: 'myAlert'
                }).then((result) => {
                    window.location.reload();
                });


            }
        }




        const url = 'http://' + ipServer + ':' + +myPort + '/menu/all';
        var form_list;

        var check = {}
        data = {}
            //FUNZIONE PER IL CHECK DELLA QUANTITÀ PER OGNI INGREDIENTE
        async function checkIngredienti(myIngredients, quantitàProdotto) {
            var results = {}
            var checked;
            var ingredientiURL = 'http://' + ipServer + ':' + +myPort + '/ingredienti'

            for (var i = 0; i < myIngredients.length; i++) {
                var mysplit = myIngredients[i].split(':');
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
                        checked = data2;


                    })
                    .catch(function() {});


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

        function createNewForm(product, x) {
            var form = document.createElement('form');
            form.setAttribute('method', 'post');
            form.className = 'box'

            var buttonEye = document.createElement('a');
            buttonEye.className = 'fas fa-eye';
            buttonEye.onclick = function() {
                const quickViewURL = 'http://' + ipServer + ':' + +myPort + '/quickViewAdmin/';

                console.log(quickViewURL + '/' + product['id']);
                console.log('Perfetto puoi andare')

                //fetch(menuURL + '/' + product['id']);
                location.href = quickViewURL + product['id']
                console.log('Successfully');


            }

            var buttonDelete = document.createElement('button');
            buttonDelete.type = 'button';
            buttonDelete.className = 'fas fa-times';

            buttonDelete.onclick = function() {

                const urlCart = 'http://' + ipServer + ':' + +myPort + '/adminHome/' + product['id'];

                const cartData = {
                    idProdotto: product['id']
                }
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
                                Swal.fire({
                                    title: data['message'],
                                    icon: 'info',
                                    customClass: 'myAlert'
                                })
                            });

                        window.location.reload();
                    }
                });

            }





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




            var divFlex = document.createElement('div');
            divFlex.className = 'flex';

            divFlex.appendChild(divPrice);
            divFlex.appendChild(quantityInput);

            form.appendChild(buttonEye);
            form.appendChild(buttonDelete)
            form.appendChild(productImage);
            form.appendChild(category);
            form.appendChild(divName);
            form.appendChild(divFlex);


            var box = document.getElementById('contenitoreProductsHome');

            box.appendChild(form);


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

        var list_products;

        async function loadingProducts() {


            const res = await fetch(url)
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
                var nuovo = createNewForm(myP, x);
            }


        }

        loadingProducts();


    });