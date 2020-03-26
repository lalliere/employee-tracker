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


INSERT INTO department (dept_name) values ('Executive');
INSERT INTO department (dept_name) values ('Potato');
INSERT INTO department (dept_name) values ('HR');
INSERT INTO department (dept_name) values ('Beverage');

INSERT INTO role (title, salary, department_id) values ('Boss', '250000', '1');
INSERT INTO role (title, salary, department_id) values ('Potato Analyst', '120000', '2');
INSERT INTO role (title, salary, department_id) values ('Office Cat', '600', '3');
INSERT INTO role (title, salary, department_id) values ('Expert Barista', '85000', '4');
INSERT INTO role (title, salary, department_id) values ('Tea Master', '100000', '4');

INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Emily', 'Lallier', '1', NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Hannah', 'Yudkin', '1', NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Michael', 'Fearsnothing', '2', '2');
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Bobby', 'Hoffburger', '2', '1');
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Wayne', 'Whiskers', '3', NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Lara', 'Latte', '4', '1');
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('Carrie', 'Chamomile', '5', '2');


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;