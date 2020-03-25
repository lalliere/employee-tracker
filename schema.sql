DROP DATABASE IF EXISTS company_db;
CREATE database company_db;

USE company_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(9,2) NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) 
  	REFERENCES department(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE employee (
  emp_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (emp_id),
  FOREIGN KEY (role_id) 
  	REFERENCES role(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (manager_id) 
  	REFERENCES employee(emp_id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;