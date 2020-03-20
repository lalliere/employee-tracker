DROP DATABASE IF EXISTS company_db;
CREATE database company_db;

USE company_db;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NOT NULL,
  manager_id INT Null,
  PRIMARY KEY (id)
);

CREATE TABLE position (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  salary DECIMAL(9,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);


SELECT * FROM employee;
SELECT * FROM position;
SELECT * FROM department;