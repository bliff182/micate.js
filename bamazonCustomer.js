var mysql = require('mysql');
var inquirer = require('inquirer');

var purchaseQuantity;
var stockQuantity;
var productId;

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon'
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log('connected as id ' + connection.threadId);
  start();
});

function start() {
  var query = 'SELECT item_id, product_name, price FROM products';
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log('\nProduct ID  ' + res[i].item_id + ': ' + res[i].product_name + ' || Price: $' + res[i].price);
      console.log('\n=====================================');
    }
    // connection.end();
    purchase();
  });
}

function purchase() { // REMEMBER TO CONFIRM THAT THE INPUT IS VALID
  console.log('=====================================\n');
  inquirer.prompt([
    {
      name: 'id',
      type: 'input',
      message: 'Enter the ID of the product you would like to purchase.'
    },
    {
      name: 'productAmount',
      type: 'input',
      message: 'How many would you like to purchase?'
    }
  ]).then(function (answer) {

    var query = 'SELECT item_id, price, stock_quantity FROM products WHERE item_id=?';
    
    connection.query(query, answer.id, function(err, res) {
      if (err) throw err;

      productId = res[0].item_id;
      purchaseQuantity = parseInt(answer.productAmount);
      stockQuantity = res[0].stock_quantity;

      console.log('\n=====================================\n');
      console.log(res);
      // console.log(res[0].item_id); // ID OF CHOSEN PRODUCT

      
      if (purchaseQuantity > stockQuantity) {
        console.log('Insufficient quantity!');
        connection.end();
      }
      else {
        console.log('Enough quantity!');
        updateStock();
      }
    });
  });
//   // connection.end();
}

function updateStock() {
  var query = connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        stock_quantity: stockQuantity - purchaseQuantity
      },
      {
        item_id: productId
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + ' products updated!\n');
    });
    console.log(query.sql);
}

// connection.end();