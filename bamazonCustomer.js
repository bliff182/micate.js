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

    console.log('\nWelcome to Bamazon! Please see our product list below:\n');
    console.log('=====================================\n');

    for (var i = 0; i < res.length; i++) {
      console.log('Product ID ' + res[i].item_id + ': ' + res[i].product_name + ' || Price: $' + res[i].price);
    }

    purchase();

  });
}

function purchase() { // REMEMBER TO CONFIRM THAT THE INPUT IS VALID
  console.log('\n=====================================\n');
  inquirer.prompt([
    {
      name: 'id',
      type: 'input',
      message: 'Enter the ID of the product you would like to purchase.',
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: 'productAmount',
      type: 'input',
      message: 'How many would you like to purchase?',
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        } 
        // I tried this to check if input was within the ID range. Why doesn't it work?
        // else if (value < 1) {
        //   return false;
        // }
        return false;
      }
    }
  ]).then(function (answer) {

    var query = 'SELECT item_id, price, stock_quantity FROM products WHERE item_id=?';

    connection.query(query, answer.id, function (err, res) {
      if (err) throw err;

      productId = res[0].item_id;
      purchaseQuantity = parseFloat(answer.productAmount);
      stockQuantity = res[0].stock_quantity;

      var totalCost = res[0].price * purchaseQuantity;
      var fixedCost = totalCost.toFixed(2);

      console.log('\n=====================================\n');
      // console.log(res);
      // console.log(res[0].item_id); // ID OF CHOSEN PRODUCT

      if (purchaseQuantity > stockQuantity) {
        console.log('Unfortunately we have insufficient quantity of your selected product. Your order could not be completed.');
        console.log('\n=====================================\n');
        connection.end();
      }
      else {
        console.log('Thank you for your purchase! That will be $' + fixedCost + ' please.');
        console.log('\n=====================================\n');
        updateStock();
      }
    });
  });
}

function updateStock() {
  connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        stock_quantity: stockQuantity - purchaseQuantity
      },
      {
        item_id: productId
      }
    ],
    function (err, res) {
      if (err) throw err;
    });

  // console.log(query.sql);
  connection.end();
}
