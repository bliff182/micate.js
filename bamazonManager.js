var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table3');

var addAmount;
var stockQuantity;

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon'
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  showMenu();
});

function showMenu() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View Products for Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product',
        'Exit'
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case 'View Products for Sale':
          viewProducts();
          break;

        case 'View Low Inventory':
          lowInventory();
          break;

        case 'Add to Inventory':
          addInventory();
          break;

        case 'Add New Product':
          addProduct();
          break;

        case 'Exit':
          connection.end();
          break;
      }
    });
}

function viewProducts() {
  var query = 'SELECT * FROM products';
  connection.query(query, function (err, res) {
    if (err) throw err;
    var table = new Table({
      head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'],
      chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
        , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
        , 'right': '║', 'right-mid': '╢', 'middle': '│'
      }
    });
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity]);
    }
    console.log('\n=======================================\n');
    console.log(table.toString());
    console.log('\n=======================================\n');
    showMenu();
  });
}

function lowInventory() {
  var query = 'SELECT * FROM products WHERE stock_quantity < 5';
  connection.query(query, function (err, res) {
    if (err) throw err;
    var table = new Table({
      head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'],
      chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
        , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
        , 'right': '║', 'right-mid': '╢', 'middle': '│'
      }
    });
    for (var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity]);
    }
    console.log('\n=======================================\n');
    console.log(table.toString());
    console.log('\n=======================================\n');
    showMenu();
  });
}

function addInventory() {
  connection.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;

    // var stockQuantity = res[0].stock_quantity;

    inquirer
      .prompt([
        {
          name: 'product',
          type: 'rawlist',
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].product_name);
            }
            return choiceArray;
          },
          message: 'Add inventory to which product?'
        },
        {
          name: 'addAmount',
          type: 'input',
          message: 'How many units are being added?',
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ]).then(function (answer) {
        var query1 = 'SELECT stock_quantity FROM products WHERE product_name=?';
        var query2 = 'UPDATE products SET ? WHERE ?';
        // chosenProduct = answer.product;
        addAmount = parseInt(answer.addAmount);

        connection.query(query1, answer.product, function (err, res) {
          if (err) throw err;
          stockQuantity = res[0].stock_quantity;
          // var newQuantity = stockQuantity + addAmount; 
          connection.query(query2,
            [
              {
                stock_quantity: stockQuantity + addAmount
              },
              {
                product_name: answer.product
              }
            ],
            function (err, res) {
              if (err) throw err;
              console.log('\n=======================================\n');
              console.log('Inventory updated.');
              console.log('\n=======================================\n');
              showMenu();
            });
        });
      });
  });
}

function addProduct() {
  inquirer
    .prompt([
      {
        name: 'product',
        type: 'input',
        message: 'Enter the name of product you are adding.'
      },
      {
        name: 'department',
        type: 'input',
        message: 'Enter the the department category for this product.'
      },
      {
        name: 'price',
        type: 'number',
        message: 'Enter the price at which to list the product.',
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: 'quantity',
        type: 'number',
        message: 'Enter the unit quantity being added.',
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ]).then(function (answer) {
      connection.query(
        'INSERT INTO products SET ?',
        {
          product_name: answer.product,
          department_name: answer.department,
          price: parseFloat(answer.price),
          stock_quantity: parseInt(answer.quantity)
        },
        function (err) {
          if (err) throw err;
          console.log('\n=======================================\n');
          console.log('Item added to Bamazon Database!');
          console.log('\n=======================================\n');
          showMenu();
        }
      );
    });
}