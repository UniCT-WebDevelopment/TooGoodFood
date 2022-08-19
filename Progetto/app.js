const Swal = require('sweetalert2')

const express = require('express')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const fs = require('fs');
var ip = require('ip');
console.log(ip.address());

var data = JSON.parse(fs.readFileSync("config.json", "utf8"));
data['ipServer'] = ip.address();
var myPort = data['portServer']
fs.writeFileSync("config.json", JSON.stringify(data), "utf8");


const app = express()
const port = process.env.PORT || myPort;
const db = require('../Progetto/database/database');

const cors = require('cors');
const { application } = require('express');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware for cookies 
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(cookieParser());
var session;


//LISTEN SERVER TO PORT
app.listen(port, () => console.log(`Listening on port ${port}`))

//INIZIALIZZAZIONE DATABASE

//TABELLA admin
db.getConnection((err, connection) => {
    if (err) throw err
    var sql = "CREATE TABLE IF NOT EXISTS admin (id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, email VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL)";
    connection.query(sql, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {} else {
            console.log(err)
        }
    })
})

//TABELLA cart
db.getConnection((err, connection) => {
    if (err) throw err
    var sql = "CREATE TABLE IF NOT EXISTS cart (id INT(100) AUTO_INCREMENT PRIMARY KEY NOT NULL, user_id INT(100) NOT NULL, pid INT(100) NOT NULL, name VARCHAR(100) NOT NULL, price INT(10) NOT NULL , quantity INT(10) NOT NULL, image VARCHAR(100) NOT NULL)";
    connection.query(sql, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {} else {
            console.log(err)
        }
    })
})

//TABELLA ingredientMessage
db.getConnection((err, connection) => {
    if (err) throw err
    var sql = "CREATE TABLE IF NOT EXISTS ingredientMessage (id INT(100) AUTO_INCREMENT PRIMARY KEY NOT NULL, ingrediente VARCHAR(100) NOT NULL, message VARCHAR(500) NOT NULL, placed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
    connection.query(sql, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {} else {
            console.log(err)
        }
    })
})

//TABELLA messages
db.getConnection((err, connection) => {
    if (err) throw err
    var sql = "CREATE TABLE IF NOT EXISTS messages (id INT(100) AUTO_INCREMENT PRIMARY KEY NOT NULL, name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, number VARCHAR(12) NOT NULL ,message VARCHAR(500) NOT NULL)";
    connection.query(sql, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {} else {
            console.log(err)
        }
    })
})


//TABELLA orders
db.getConnection((err, connection) => {
    if (err) throw err
    var sql = "CREATE TABLE IF NOT EXISTS orders (id INT(100) AUTO_INCREMENT PRIMARY KEY NOT NULL, user_id INT(100) NOT NULL, name VARCHAR(100) NOT NULL,number VARCHAR(12) NOT NULL, consumazione VARCHAR(50) NOT NULL, address VARCHAR(500) NOT NULL, total_products VARCHAR(100) NOT NULL, total_price INT(100) NOT NULL, placed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, status VARCHAR(50) NOT NULL DEFAULT pending)";
    connection.query(sql, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {} else {
            console.log(err)
        }
    })
})


//TABELLA products
db.getConnection((err, connection) => {
    if (err) throw err
    var sql = "CREATE TABLE IF NOT EXISTS products (id INT(100) AUTO_INCREMENT PRIMARY KEY NOT NULL, name VARCHAR(100) NOT NULL, category VARCHAR(100) NOT NULL, price INT(10) NOT NULL, image VARCHAR(100) NOT NULL, ingredienti VARCHAR(100) NOT NULL)";
    connection.query(sql, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {} else {
            console.log(err)
        }
    })
})

//TABELLA product_ingredients
db.getConnection((err, connection) => {
    if (err) throw err
    var sql = "CREATE TABLE IF NOT EXISTS product_ingredients (id INT(100) AUTO_INCREMENT PRIMARY KEY NOT NULL, name VARCHAR(100) NOT NULL, qty INT(10) NOT NULL)";
    connection.query(sql, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {} else {
            console.log(err)
        }
    })
})

//TABELLA users
db.getConnection((err, connection) => {
    if (err) throw err
    var sql = "CREATE TABLE IF NOT EXISTS users (id INT(100) AUTO_INCREMENT PRIMARY KEY NOT NULL, name VARCHAR(20) NOT NULL, email VARCHAR(50) NOT NULL ,number VARCHAR(12) NOT NULL, password VARCHAR(50) NOT NULL, address VARCHAR(500) NOT NULL)";
    connection.query(sql, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {} else {
            console.log(err)
        }
    })
})


//INSERT DEFAULT ADMIN

db.getConnection((err, connection) => {
    if (err) throw err
    var sql = "SELECT * FROM admin";
    connection.query(sql, (err, rows) => {
        connection.release()
        if (!err) {
            if (rows.length > 0) {} else {
                db.getConnection((err, connection) => {
                    if (err) throw err
                    var sql = "INSERT INTO admin(email, password) VALUES(?,?)";
                    var values = ["admin", "111"]
                    connection.query(sql, values, (err, rows) => {
                        connection.release() // return the connection to pool
                        if (!err) {} else {
                            console.log(err)
                        }
                    })
                });
            }
        } else console.log(err)
    })

})









//Inizio della sessione

app.get('/', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.sendFile('front/home.html', { root: __dirname })

    } else {
        res.sendFile('front/login.html', { root: __dirname })
    }
});




//Get some product for HOME PAGE
app.get('/home', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from products LIMIT 10', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})


//Menu root
app.get('/menu', (req, res) => {
    res.sendFile('front/menu.html', { root: __dirname })
});

app.get('/menu/all', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from products ORDER BY category DESC', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows);
            } else {
                console.log(err)
            }


        })
    })
})

//Quick View of product

app.get('/quickView/:id', (req, res) => {
    res.sendFile('front/quickView.html', { root: __dirname })
});

app.post('/quickView/:id', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from products WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows[0])

            } else {
                console.log(err)
            }
        })
    })
})

//CHECK INGREDIENTS LOGIC




app.post('/ingredienti', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from product_ingredients WHERE name = ? AND qty>?', [req.body['myData']['name'], req.body['myData']['qty']], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                if (rows.length > 0) {
                    res.send(true);

                } else {
                    res.send(false);
                }

            } else {
                console.log(err)
            }
        })
    })
});

//UPDATE INGREDIENTS
app.post('/ingredienti/update', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'UPDATE product_ingredients SET qty = qty - ? WHERE name = ? '
        var values = [req.body['myData']['qty'], req.body['myData']['name']]
        connection.query(sql, values, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json({ message: "UPDATED" });

            } else {
                console.log(err)
                res.json({ message: "NOT UPDATED" });

            }
        })
    })
});

//REVERT INGREDIENTS
app.post('/ingredienti/revert', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'UPDATE product_ingredients SET qty = qty + ? WHERE name = ? '
        var values = [req.body['myData']['qty'], req.body['myData']['name']]
        connection.query(sql, values, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json({ message: "REVERTED" });

            } else {
                console.log(err)
                res.json({ message: "NOT REVERTED" });
            }
        })
    })
});


//CART ROOT LOGIC
app.get('/cart', (req, res) => {
    res.sendFile('front/cart.html', { root: __dirname })
});

//GET CART PRODUCTS FOR SPECIFIC USER
app.get('/cart/:id', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from cart WHERE user_id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)


            } else {
                console.log(err)
            }
        })
    })
});

//REMOVE ELEMENT FROM SPECIFIC CART 
app.post('/cart/:id', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
            //DEVO ELIMINARE TUTTI I PRODOTTI
        if (req.body['cartData']['all'] == 1) {
            var sql = 'DELETE FROM cart WHERE user_id = ?';
            var values = [req.params.id];
            connection.query(sql, values, (err, rows) => {
                connection.release() // return the connection to pool
                if (!err) {
                    res.json({ message: "Cart deleted successfully" });

                } else {
                    console.log(err);
                    res.json({ message: "Qualcosa è andato storto" });
                }
            })

        } else {
            var sql = 'DELETE FROM cart WHERE user_id = ? AND pid = ?';
            var values = [req.params.id, req.body['cartData']['idProdotto']];
            connection.query(sql, values, (err, rows) => {
                connection.release() // return the connection to pool
                if (!err) {
                    res.json({ message: "Product deleted successfully" });

                } else {
                    console.log(err);
                    res.json({ message: "Qualcosa è andato storto" });
                }
            })
        }

    })
})


//POST REQUEST TO ADD AN ELEMENT TO CART
app.post('/cart', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from cart WHERE user_id = ? AND pid = ?', [req.body['cartData']['idUtente'], req.body['cartData']['idProdotto']], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                //Se c'è già un record per quel prodotto e quell'utente allora devo solo aggiornarlo
                if (rows.length > 0) {
                    db.getConnection((err, connection) => {
                        if (err) throw err
                        var sql = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND pid = ?'
                        var values = [req.body['cartData']['qty'], req.body['cartData']['idUtente'], req.body['cartData']['idProdotto']];
                        connection.query(sql, values, (err, rows) => {
                            connection.release() // return the connection to pool
                            if (!err) {
                                res.json({ message: "Product added to cart successfully" });

                            } else {
                                console.log(err);
                                res.json({ message: "Qualcosa è andato storto" });
                            }
                        });
                    });
                } else {
                    //Altrimenti devo solo inserire un nuovo record, in questo modo non abbiamo duplicati 
                    db.getConnection((err, connection) => {
                        if (err) throw err
                        var sql = 'INSERT INTO cart(user_id, pid, name, price, quantity, image) VALUES (?,?,?,?,?,?)';
                        var values = [req.body['cartData']['idUtente'], req.body['cartData']['idProdotto'], req.body['cartData']['nomeProdotto'], req.body['cartData']['price'], req.body['cartData']['qty'], req.body['cartData']['image']];
                        connection.query(sql, values, (err, rows) => {
                            connection.release() // return the connection to pool
                            if (!err) {
                                res.json({ message: "Product added to cart successfully" });

                            } else {
                                console.log(err);
                                res.json({ message: "Qualcosa è andato storto" });
                            }
                        });
                    });
                }

            }
        });
    })

});

//ORDER ROOT AND LOGIC

app.get('/orders', (req, res) => {
    res.sendFile('front/orders.html', { root: __dirname })
});

//GET all orders from specific user

app.get('/orders/:id', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'SELECT * FROM orders WHERE user_id = ?'
        var values = [req.params.id];

        connection.query(sql, values, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)

            } else {
                console.log(err);
                res.json({ message: "Qualcosa è andato storto" });
            }
        })

    })
})


//SAVE AN ORDER
app.post('/orders', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'INSERT INTO orders(user_id, name, number, consumazione, address, total_products, total_price) VALUES(?,?,?,?,?,?,?) '
        var values = [req.body['orderData']['user_id'], req.body['orderData']['name'],
            req.body['orderData']['number'], req.body['orderData']['consumazione'],
            req.body['orderData']['address'],
            req.body['orderData']['total_products'], req.body['orderData']['total_price']
        ]
        connection.query(sql, values, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json({ message: "Order added successfully" });

            } else {
                console.log(err);
                res.json({ message: "Qualcosa è andato storto" });
            }
        })

    })
})







//About root

app.get('/about', (req, res) => {
    res.sendFile('front/about.html', { root: __dirname })
});

//Contact US Root

app.get('/contact', (req, res) => {
    res.sendFile('front/contact.html', { root: __dirname })
});


app.post('/contact', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var values = [req.body['messageData']['name'], req.body['messageData']['email'], req.body['messageData']['number'], req.body['messageData']['message']]
        var sql = 'INSERT INTO messages(name, email, number, message) VALUES(?,?,?,?)'
        connection.query(sql, values, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json({ message: "Thanks for sending" });

            } else {
                console.log(err)
                res.json({ message: "Something went wrong" });

            }
        })
    })
});




//SEARCH LOGIC ROOT 
app.get('/search', (req, res) => {
    res.sendFile('front/search.html', { root: __dirname })
});

app.post('/search', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var value = '%' + req.body['searchData']['item'] + '%';
        connection.query('SELECT * from products WHERE name LIKE ?', [value], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                if (rows.length > 0) {
                    res.send(rows);
                } else {
                    res.json({ message: "Not found" })

                }
            } else {
                console.log(err)
            }
        })
    })
});





//User Account Routes and Logic

app.get('/getUser', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.send(session);
    } else {
        res.json({ message: "Not connected" })
    }
});



app.post('/login', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from users WHERE email = ? AND password = ?', [req.body['data']['email'], req.body['data']['pass']], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                if (rows.length > 0) {
                    session = req.session;
                    session.userid = rows[0]['id'];
                    res.json({ message: "Login Successfully" })
                } else {
                    db.getConnection((err, connection) => {
                        if (err) throw err
                        connection.query('SELECT * from admin WHERE email = ? AND password = ?', [req.body['data']['email'], req.body['data']['pass']], (err, rows) => {
                            connection.release() // return the connection to pool
                            if (!err) {
                                if (rows.length > 0) {
                                    session = req.session;
                                    session.userid = rows[0]['email'];
                                    res.json({ message: "Welcome Boss!" })
                                } else {
                                    session = 0;
                                    res.status(401).json({ message: "Incorrect email or password" })
                                }
                            }
                        });
                    });

                }


            } else {
                console.log(err)
            }
        })
    })
})




app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/register', (req, res) => {

    res.sendFile('front/register.html', { root: __dirname })
})

app.post('/register', (req, res) => {
    var sql = 'INSERT INTO users(name, email, number, password, address) VALUES (?,?,?,?,?)';
    var values = [req.body['data']['name'], req.body['data']['email'], req.body['data']['number'], req.body['data']['pass'], req.body['data']['address']];


    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from users WHERE email = ?', [req.body['data']['email']], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                if (rows.length > 0) {
                    res.json({ message: "There is already an user with this email" })


                } else {
                    db.getConnection((err, connection) => {
                        if (err) throw err
                        connection.query(sql, values, (err, rows) => {
                            connection.release() // return the connection to pool
                            res.json({ message: "Register Successfully" })
                        })
                    });
                }
            } else {
                res.send("Server non disponibile")
            }

        });
    });
});

app.get('/profile', (req, res) => {

    session = req.session;
    if (session.userid) {
        res.sendFile('front/profile.html', { root: __dirname })
    } else {
        res.sendFile('front/login.html', { root: __dirname })
    }
})

app.post('/profile', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from users WHERE id = ?', [req.body['myData']['id']], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    })
})


//Fine logica Utente




//ADMIN PAGES

app.get('/adminHome', (req, res) => {
    session = req.session;
    if (session.userid == "admin") {
        res.sendFile('front/adminHome.html', { root: __dirname })
    } else {
        req.session.destroy();
        res.redirect('/');
    }
});


app.post('/adminHome', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'SELECT * FROM products WHERE name = ?'
        var values = [req.body['productData']['name']];
        connection.query(sql, values, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                if (rows.length > 0) {
                    res.json({ message: "Product already exists" });
                }
                //Inserisco un nuovo prodotto
                else {
                    db.getConnection((err, connection) => {
                        if (err) throw err
                        var sql = 'INSERT INTO products(name, category, price, image, ingredienti) VALUES(?,?,?,?,?) '
                        var values = [req.body['productData']['name'], req.body['productData']['category'], req.body['productData']['price'], req.body['productData']['image'], req.body['productData']['ingredienti']];
                        connection.query(sql, values, (err, rows) => {
                            connection.release() // return the connection to pool
                            if (!err) {
                                res.json({ message: "Product added successfully" });
                            } else {
                                console.log(err)
                                res.json({ message: "Qualcosa è andato storto" });
                            }
                        })
                    })
                }
            } else {
                res.json({ message: "Database doesn't respond" });

            }
        });
    });
})
app.post('/adminHome/:id', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'DELETE FROM products WHERE id = ?';
        var value = [req.params.id];
        connection.query(sql, value, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json({ message: "Product deleted successfully!" })

            } else {
                console.log(err)
                res.json({ message: "Something goes wrong!" })
            }
        })
    })
})

//GET INGREDIENT PAGE

app.get('/adminIngredients', (req, res) => {
    session = req.session;
    if (session.userid == "admin") {
        res.sendFile('front/adminIngredients.html', { root: __dirname })
    } else {
        req.session.destroy();
        res.redirect('/');
    }
});

//INSERT OR UPDATE INGREDIENT
app.post('/adminIngredients', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'SELECT * from product_ingredients WHERE name = ?'
        var values = [req.body['ingredientData']['name']]
        connection.query(sql, values, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                if (rows.length > 0) {
                    db.getConnection((err, connection) => {
                        if (err) throw err
                        var sql = 'UPDATE product_ingredients  SET qty = ? WHERE name = ?';
                        var values = [req.body['ingredientData']['qty'], req.body['ingredientData']['name']]
                        connection.query(sql, values, (err, rows) => {
                            connection.release() // return the connection to pool
                            if (!err) {
                                res.json({ message: "Quantity updated successfully!" })
                            }

                        });
                    })
                } else {
                    db.getConnection((err, connection) => {
                        if (err) throw err
                        var sql = 'INSERT INTO product_ingredients(name, qty) VALUES(?,?)'
                        var values = [req.body['ingredientData']['name'], req.body['ingredientData']['qty']]
                        connection.query(sql, values, (err, rows) => {
                            connection.release() // return the connection to pool
                            if (!err) {
                                console.log("No error occurred");
                                res.json({ message: "Ingredient added successfully" });
                            } else {
                                console.log(err)
                                res.json({ message: "Something went wrong" });

                            }
                        });
                    })
                }
            } else {
                console.log(err);
            }
        });

    });

})

//REMOVE AN INGREDIENT
app.post('/adminIngredients/:id', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'DELETE FROM product_ingredients WHERE id = ?';
        var value = [req.params.id];
        connection.query(sql, value, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json({ message: "Ingredient deleted successfully!" })

            } else {
                console.log(err)
                res.json({ message: "Something goes wrong!" })
            }
        })
    })
})


//GET ALL THE INGREDIENT
app.get('/adminIngredients/all', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from product_ingredients ORDER BY id DESC', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows);
            } else {
                console.log(err)
            }

        })
    })
})


//GET ALL ORDERS

app.get('/adminOrders', (req, res) => {
    session = req.session;
    if (session.userid == "admin") {
        res.sendFile('front/adminOrders.html', { root: __dirname })
    } else {
        req.session.destroy();
        res.redirect('/');
    }
})

app.post('/adminOrders', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err

        var sql = 'UPDATE orders SET status = ? WHERE id = ?';
        var value = ["completed", req.body['orderData']['id']]
        connection.query(sql, value, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json({ message: "Ingredient deleted successfully!" })

            } else {
                console.log(err)
                res.json({ message: "Something goes wrong!" })
            }
        })
    })
})


app.get('/adminOrders/all', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from orders ORDER BY placed_on ASC', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows);
            } else {
                console.log(err)
            }

        })
    })
})


//INGREDIENT MESSAGE ADMIN

app.get('/adminMessages', (req, res) => {
    session = req.session;
    if (session.userid == "admin") {
        res.sendFile('front/adminMessages.html', { root: __dirname })
    } else {
        req.session.destroy();
        res.redirect('/');
    }
})
app.get('/adminMessages/all', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from ingredientMessage ORDER BY placed_on ASC', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows);
            } else {
                console.log(err)
            }

        })
    })
})
app.post('/adminMessage', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'SELECT * from ingredientMessage WHERE ingrediente = ?'
        var values = [req.body['message']['ingrediente']]
        connection.query(sql, values, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                if (rows.length > 0) {

                } else {
                    db.getConnection((err, connection) => {
                        if (err) throw err
                        var sql = 'INSERT INTO ingredientMessage(ingrediente, message) VALUES(?,?)'
                        var values = [req.body['message']['ingrediente'], req.body['message']['message']]
                        connection.query(sql, values, (err, rows) => {
                            connection.release() // return the connection to pool
                            if (!err) {
                                res.json({ message: "Message added successfully" });
                            } else {
                                console.log(err)
                                res.json({ message: "Something went wrong" });

                            }
                        });
                    })
                }
            } else {
                console.log(err);
            }
        });

    });

})

//CHECK A MESSAGE
app.post('/adminMessages/:id', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        var sql = 'DELETE FROM  ingredientMessage  WHERE id = ?';
        var value = [req.params.id]
        connection.query(sql, value, (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json({ message: "Message deleted successfully!" })

            } else {
                console.log(err)
                res.json({ message: "Something goes wrong!" })
            }
        })
    })
})

//USER MESSAGES
app.get('/userMessages', (req, res) => {
    session = req.session;
    if (session.userid == "admin") {
        res.sendFile('front/userMessages.html', { root: __dirname })
    } else {
        req.session.destroy();
        res.redirect('/');
    }
})

app.get('/userMessages/all', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from messages ', (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows);
            } else {
                console.log(err)
            }

        })
    })
})


//QUICK VIEW ADMIN

//USER MESSAGES
app.get('/quickViewAdmin/:id', (req, res) => {
    session = req.session;
    if (session.userid == "admin") {
        res.sendFile('front/quickViewAdmin.html', { root: __dirname })
    } else {
        req.session.destroy();
        res.redirect('/');
    }
})


app.post('/quickViewAdmin/:id', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from products WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows[0])

            } else {
                console.log(err)
            }
        })
    })
})