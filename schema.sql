DROP DATABASE IF EXISTS company_db;
CREATE database company_db;

USE company_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(9,2) NOT NULL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) 
  	REFERENCES department(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE employee (
  emp_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (emp_id),
  FOREIGN KEY (role_id) 
  	REFERENCES role(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (manager_id) 
  	REFERENCES employee(emp_id)
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;