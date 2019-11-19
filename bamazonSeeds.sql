DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50) NULL,
	department_name VARCHAR(50) NULL,
	price DECIMAL (10,2) NULL,
	stock_quantity INT NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES
		('Jeans', 'Clothing', 24.99, 20),
    ('4K TV', 'Electronics', 619.99, 3),
    ('Golf Club Set', 'Sports', 249.99, 5),
    ('Electric Guitar', 'Musical Instruments', 999.99, 2),
    ('Nintendo Switch', 'Gaming', 298.99, 12),
    ('Blu Ray Player', 'Electronics', 149.00, 10),
    ('Leather Jacket', 'Clothing', 389.99, 8),
    ('PS4', 'Gaming', '335.99', 15),
    ('Acer Laptop', 'Electronics', 308.98, 11),
    ('Table Tennis Set', 'Sports', 499.99, 2);
        
SELECT * FROM products;