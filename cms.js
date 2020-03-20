const mysql = require("mysql");
const inquirer = require("inquirer");

let connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Jennings22!",
    database: "company_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add department, roles, or employee",
                "View department, roles, or emlployees",
                "Update empolyee",
                "View list of employees by manager",
                "Delete departments, roles, or employees",
                "View itemized budget of department"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add department, roles, or employee.":
                    addItem()
                    break
                case "View department, roles, or emlployees.":
                    viewDepartment();
                    break
                case "Update empolyee":
                    updateEmployee();
                    break
                case "View list of employees by manager.":
                    viewEmployees();
                    break
                case "Delete departments, roles, or employees.":
                    deleteDepartment();
                    break
                case "View itemized budget of department.":
                    viewItemization();
                    break
            }
        })
}

function addItem() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Would you like to add a department, a role, or an employee?",
            choices: [
                "Add department",
                "Add role",
                "Add employee"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add department":
                    addDepartment();
                    break
                case "Add role":
                    addrole();
                    break
                case "Add employee":
                    addEmployee();
                    break
            }
        })
}

function viewDepartment() {
    console.log("2")
}

function updateEmployee() {
    console.log("3")
}

function viewEmployees() {
    console.log("4")
}

function deleteDepartment() {
    console.log("5")
}

function viewItemization() {
    console.log("6")
}

function addDepartment() {
    inquirer
        .prompt({
            name: "action",
            type: "input",
            message: "What is the name of the new department?",
            validate: function validateDepartmentName(name) {
                if (name === '') {
                    console.log("You must enter a valid name!")
                    return false;
                }
                else {
                    return true;
                }
            }
        }).
        then(function (answer) {
            console.log(answer.action)
            let query = " INSERT INTO department(name)";
            connection.query(query, function (err, res) {
            })
            VALUES(answer.action)
        })
}

function addrole() {
}

function addEmployee() {
}



