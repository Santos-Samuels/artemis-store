create database loja_artemis;

use loja_artemis;

CREATE TABLE admin(
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    password varchar(16) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    surname varchar(255) NOT NULL,
    email varchar(100) NOT NULL unique,
    password varchar(16) NOT NULL,
    whatsapp varchar(11),
    adress varchar(100),
    number varchar (5),
    district varchar(30),
    city varchar(30),
    uf varchar(2),
    reference_point varchar(255),
    cep varchar(9),
    PRIMARY KEY(id)
);

CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT,
    product_name varchar(255) NOT NULL,
    product_images varchar(255) NOT NULL,
	description TEXT NOT NULL,
    color_pt varchar(255) NOT NULL,
    color_en varchar(255) NOT NULL,
    size varchar(255) NOT NULL,
	type varchar(255) NOT NULL,
    category varchar(255) NOT NULL,
    quantity INT NOT NULL,
    price decimal(5,2) NOT NULL,
    promotion decimal(5,2) NOT NULL,
    active int not null,
    PRIMARY KEY(id)
);

CREATE TABLE requests(
	id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
	purchase_date date NOT NULL,
	status varchar(255) NOT NULL,
	payment_type INT NOT NULL,
    total_price decimal(5,2) NOT NULL,
    discounted_price decimal(5,2) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE request_products(
	id INT NOT NULL AUTO_INCREMENT,
    request_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    selected_color_pt VARCHAR(20) NOT NULL,
    selected_size VARCHAR(20) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (request_id) REFERENCES requests (id),
	FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE frontpagebanners(
	id INT NOT NULL AUTO_INCREMENT,
    product_id INT,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE wishlist(
	id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

INSERT INTO products values(NULL, "Colar blue stone", "", "Um colar de com uma pedra azul","vermelho, azul","#fc0324,#0600c4", "23, 25, 30"  , "Joia", "Colar", 10, 29.90, 0, 0);
INSERT INTO products values(NULL, "Alianças simple style", "", "Um colar de com uma pedra azul","vermelho, azul","#fc0324,#0600c4", "23, 25, 30" , "Joia", "Anel", 10, 69.90,0, 0);
INSERT INTO products values(NULL, "Colar white stone", "", "Colar white stone","vermelho, azul","#fc0324,#0600c4", "23, 25, 30" , "Joia", "Colar", 10, 29.90, 0, 0);
INSERT INTO products values(NULL, "Conjunto joia gold", "", "Conjunto joia gold","vermelho, azul","#fc0324,#0600c4", "23, 25, 30" , "Joia", "Conjunto", 10, 119.90,0,0);

INSERT INTO products values(NULL, "Calsinha cintura alta nude", "", "Calsinha cintura alta nude","vermelho, azul","#fc0324,#0b03fc", "23, 25, 30"  , "Roupa", "Calcinha", 10, 29.99, 0, 0);
INSERT INTO products values(NULL, "Calsinha cintura alta preto", "", "Calsinha cintura alta preto","vermelho, azul","#fc0324,#0b03fc", "23, 25, 30" , "Roupa", "Calcinha", 10, 24.99, 0, 0);
INSERT INTO products values(NULL, "Calsinha cintura alta nude", "", "Calsinha cintura alta nude","vermelho, azul","#fc0324,#0b03fc", "23, 25, 30" , "Roupa", "Calcinha", 10, 29.90, 0, 0);
INSERT INTO products values(NULL, "Calsinha cintura alta preto", "", "Calsinha cintura alta preto","vermelho, azul","#fc0324,#0b03fc", "23, 25, 30" , "Roupa", "Calcinha", 10, 24.90, 0, 0);

insert into frontpagebanners(id) values(null);
insert into frontpagebanners(id) values(null);
insert into frontpagebanners(id) values(null);
insert into frontpagebanners(id) values(null);

insert into admin VALUES(null, "admin", "MTIzNDU2");