# micate.js - Bamazon

Bamazon is a Node-based CLI storefront app that takes in orders from customers using a series of prompts and updates its database accordingly. Additionally, there is a Manager option that allows for additional database manipulation, including viewing products with low inventory, restocking units, and adding new products for sale on the customer side.

## How Bamazon Works

Since Bamazon is intended for use with Node.js, you must first clone this repository to your computer. Once that is done:

1. Open your preferred terminal program.
2. Navigate to the folder containing the repository files.
3. Run `npm install` to install the necessary dependencies.

There are two ways to use the Bamazon app: `bamazonCustomer.js` and `bamazonManager.js`

### bamazonCustomer.js

When the user runs `node bamazonCustomer.js`, the app welcomes them and presents them with the list of products for sale:
![BC_initial](/screenshots/BC_initial.png)

The app automatically prompts the user to enter the ID of the product they wish to purchase, then the purchase quantity. If there is enough in stock, the user will be thanked for their purchase and told their total cost:
![BC_purchase](/screenshots/BC_purchase.png)

If there is not enough stock of the selected item to satisfy the customer's purchase, the customer will be notified of this and the app will exit:
![BC_low-stock](/screenshots/BC_low-stock.png)

### bamazonManager.js

When the user runs `node bamazonManager.js`, the app presents a list of actions the user can take:
![BM_menu](/screenshots/BM_menu.png)

1.  `View Products for Sale`: The app reads from the Bamazon database and displays the ID, name, department, price, and quantity of all products currently being sold:
    ![BM_products](/screenshots/BM_products.png)

2.  `View Low Inventory`: The app displays all products with less than 5 units in stock:
    ![BM_low](/screenshots/BM_low.png)

3.  `Add to Inventory`: The manager can select an item to restock and them amount of inventory to add, and update the database accordingly:
    ![BM_add-item](/screenshots/BM_add-item.png)
    ![BM_inv-updated](/screenshots/BM_inv-updated.png)

4.  `Add New Product`: The manager can add a brand new product to the database. The app will prompt for the necessary information; the product name, department, price, and quantity in stock, and update the database accordingly.
    ![BM_new-product](/screenshots/BM_new-product.png)

## Technologies Used

- JavaScript
- Node.js
- [MySQL](https://www.npmjs.com/package/mysql)
- [Inquirer](https://www.npmjs.com/package/inquirer)
- [CLI Table](https://www.npmjs.com/package/cli-table3)
