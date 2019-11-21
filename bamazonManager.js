var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table3');

// var table = new Table({
//   chars: {
//     'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
//     , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
//     , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
//     , 'right': '║', 'right-mid': '╢', 'middle': '│'
//   }
// });

// table.push( // basic table template - remember to delete
//   ['foo', 'bar', 'baz']
//   , ['frob', 'bar', 'quuz']
// );

// console.log(table.toString());

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'bamazon'
});

connection.connect(function (err) {
  if (err) throw err;
  // attempting ES6
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
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
    }

    console.log(table.toString());

  });
}