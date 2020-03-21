const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const cTable = require("console.table");

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
    homeQuestions();
});

function homeQuestions() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: chalk.blueBright("What would you like to do?"),
            choices: [
                "Add a department, role, or employee",
                "View departments, roles, or employees",
                "Update employee roles",
                "View list of employees by manager",
                "Delete departments, roles, or employees",
                "View the total utilized budget of a department"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add a department, role, or employee":
                    addDRE()
                    break
                case "View departments, roles, or employees":
                    viewDRE();
                    break
                case "Update employee roles":
                    updateEmployee();
                    break
                case "View list of employees by manager":
                    viewEmpByMgr();
                    break
                case "Delete departments, roles, or employees":
                    deleteDRE();
                    break
                case "View the total utilized budget of a department":
                    viewBudget();
                    break
            }
        })
}

function addDRE() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: chalk.magenta("Would you like to add a department, a role, or an employee?"),
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
                    addRole();
                    break
                case "Add employee":
                    addEmployee();
                    break
            }
        })

    console.log("1")
}

function viewDRE() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: chalk.green("Would you like to view a list of departments, roles, or employees?"),
            choices: [
                "View departments",
                "View roles",
                "View employees"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View department":
                    viewDepartments();
                    break
                case "View role":
                    viewRoles();
                    break
                case "View employee":
                    viewEmployees();
                    break
            }
        })
    console.log("2")
}

function updateEmployee() {
    console.log("3")
}

function viewEmpByMgr() {
    console.log("4")
}

function deleteDRE() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: chalk.red("Do you want to delete a department, a role, or an employee?"),
            choices: [
                "Department",
                "Role",
                "Employee"
            ]
        })
        .then(function (answer) {
            if (answer.action === "Department") {
                let query = "SELECT * FROM department";
                console.table()
                connection.query(query, function (err, res) {
                    if (err) console.log(err);
                    console.table(res)
                    deleteDepartment();
                })
            }
        })
    console.log("5")
}

function viewBudget() {
    console.log("6")
}

function addDepartment() {
    inquirer
        .prompt({
            name: "action",
            type: "input",
            message: chalk.magenta("What is the name of the new department?"),
            validate: function validateDepartmentName(name) {
                if (name === '') {
                    console.log(chalk.redBright("You must enter a valid department name!"));
                    return false;
                }
                else {
                    return true;
                }
            }
        })
        .then(function (answer) {
            //console.log(answer.action)
            let query = "INSERT INTO department SET ?";
            connection.query(query,
                {
                    name: answer.action
                },
                function (err, res) {
                    if (err) console.log(err);
                    console.log(chalk.yellow("Department added successfully!"))
                })
        })
}

function addRole() {
}

function addEmployee() {
}

function viewDepartments() {
    let query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) console.log(err);
        console.table(res)
    })
}
function viewRoles() {
}
function viewEmployees() {
}
function deleteDepartment() {
    inquirer
        .prompt({
            name: "id",
            type: "input",
            message: chalk.red("What is the ID of the department you would like to delete?")
        }).then(function (answer) {
            connection.query("DELETE FROM department WHERE ?",
                {
                    id: answer.id
                },
                function (error, results, fields) {
                    if (error) throw error;
                    console.log('deleted ' + results.affectedRows + ' rows');
                    homeQuestions();
                })
        })
}

