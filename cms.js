const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");

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
            message: chalk.blueBright("What would you like to do?\n"),
            choices: [
                "View company directory",
                "Add a department, role, or employee",
                "View departments, roles, or employees",
                "Update employee roles",
                //"View list of employees by manager",
                "Delete a department, role, or employee",
                //"View the total utilized budget of a department",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View company directory":
                    directory();
                    break
                case "Add a department, role, or employee":
                    addDRE()
                    break
                case "View departments, roles, or employees":
                    viewDRE();
                    break
                case "Update employee roles":
                    updateEmployee();
                    break
                case "Delete a department, role, or employee":
                    deleteDRE();
                    break
                case "Exit":
                    process.exit();
                // case "View list of employees by manager":
                //     viewEmpByMgr();
                //     break
                case "View the total utilized budget of a department":
                    viewBudget();
                    break
            }
        });
}

function directory() {
    let query = "SELECT employee.emp_id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, department.dept_name FROM employee JOIN role ON (employee.role_id = role.id) JOIN department ON (role.department_id = department.id)";

    connection.query(query, function (err, results) {
        if (err) throw err;

        console.log(chalk.cyan("\nCompany Directory:\n"))
        console.table(results);
        homeQuestions();
    });
}

function doQuery(query1) {
    return new Promise(function (resolve, reject) {
        connection.query(query1, function (err, results) {
            if (err) reject(err);
            resolve(results);
        })
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
                "Add employee",
                "Return to main menu"
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
                case "Return to main menu":
                    homeQuestions();
                    break
            }
        })

}

function addDepartment() {
    inquirer
        .prompt({
            name: "action",
            type: "input",
            message: chalk.magenta("What is the name of the new department?"),
            validate: function validateDepartmentName(name) {
                if (name === '') {
                    console.log(chalk.red("You must enter a valid department name!"));
                    return false;
                }
                else {
                    return true;
                }
            }
        })
        .then(function (answer) {
            let query = "INSERT INTO department SET ?";
            connection.query(query,
                {
                    dept_name: answer.action
                },
                function (err, res) {
                    if (err) console.log(err);
                    console.log(chalk.yellow("\nDepartment added successfully!\n"))
                    homeQuestions();
                })
        })
}

async function addRole() {
    const deptList = await doQuery("SELECT * FROM department");

    const deptListChoices = [];
    deptList.forEach(elem => {

        let currDept = {
            name: `${elem.dept_name}`,
            value: elem.id,
            short: elem.dept_name
        }

        deptListChoices.push(currDept);
    });

    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: chalk.magenta("What is the title of the new role?"),
                validate: function validateRoleName(name) {
                    if (name === '') {
                        console.log(chalk.redBright("You must enter a valid role title!"));
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                name: "salary",
                type: "input",
                message: chalk.magenta("Enter salary: "),
                validate: function (value) {
                    if (isNaN(parseInt(value)) === true) {
                        return new Error(chalk.redBright("Please delete your entry and enter a valid number!"));
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                name: "dept",
                type: "list",
                message: chalk.magenta("Which department does this role belong in?"),
                choices: deptListChoices
            }
        ])
        .then(function (answer) {

            connection.query("INSERT INTO role SET ?",
                {
                    title: answer.name,
                    salary: answer.salary,
                    department_id: answer.dept

                },
                function (err, res) {
                    if (err) console.log(err);
                    console.log(chalk.yellow("\nRole added successfully!\n"))
                    homeQuestions();
                }
            )

        })


}

async function addEmployee() {
    let query = "SELECT employee.emp_id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.id, role.title, role.salary, role.department_id, department.id, department.dept_name ";
    query += "FROM employee JOIN role ON (employee.role_id = role.id)";
    query += "JOIN department ON (role.department_id = department.id)";

    const aRole = await doQuery("SELECT * FROM role");

    const aEmp = await doQuery(query);

    const aEmpChoices = [];
    aEmp.forEach(elem => {

        let currEmp = {
            name: `${elem.first_name} ${elem.last_name}`,
            value: elem.emp_id,
            short: elem.first_name
        }

        aEmpChoices.push(currEmp);
    });


    const aRoleChoices = [];
    aRole.forEach(elem => {

        let currRole = {
            name: `${elem.title}`,
            value: elem.id,
            short: elem.title
        }

        aRoleChoices.push(currRole);
    });

    inquirer
        .prompt([
            {
                name: "first",
                type: "input",
                message: chalk.magenta("What is the first name of the new employee?"),
                validate: function (value) {
                    if (value === "") {
                        return new Error("You must enter a valid name!");
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "last",
                type: "input",
                message: chalk.magenta("What is the last name of the new employee?"),
                validate: function (value) {
                    if (value === "") {
                        return new Error("You must enter a valid name!");
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "titleID",
                type: "list",
                message: chalk.magenta("What is their position?"),
                choices: aRoleChoices
            },
            {
                name: "manager",
                type: "list",
                message: chalk.magenta("Who is their manager?"),
                choices: aEmpChoices
            }
        ])
        .then(function (answers) {

            connection.query(
                "INSERT INTO employee SET ? ",
                [
                    {
                        first_name: answers.first,
                        last_name: answers.last,
                        role_id: answers.titleID,
                        manager_id: answers.manager
                    }
                ],
                function (err) {
                    if (err) throw err;
                    console.log(chalk.yellow("\nEmployee record sucessfully created!\n"));
                    homeQuestions();
                }
            );
        });


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
                "View employees",
                "Return to main menu"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View departments":
                    viewDepartments();
                    break
                case "View roles":
                    viewRoles();
                    break
                case "View employees":
                    viewEmployees();
                    break
                case "Return to main menu":
                    homeQuestions();
                    break
            }
        })

}

function viewDepartments() {
    let query = "SELECT * FROM department ORDER BY id";
    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.log(chalk.green("\nTable of Departments:"));
        console.table(res);
        homeQuestions();
    })
}

function viewRoles() {
    let query = "SELECT role.title, role.salary, department.dept_name FROM role JOIN department ON (role.department_id = department.id)";

    connection.query(query, function (err, results) {
        if (err) throw err;

        console.log(chalk.green("\nTable of Roles:"));
        console.table(results);
        homeQuestions();
    });

}

function viewEmployees() {
    let query = "SELECT employee.emp_id, employee.first_name, employee.last_name, manager_id, role.title, role.salary, department.dept_name FROM employee JOIN role ON (employee.role_id = role.id) JOIN department ON (role.department_id = department.id)";

    connection.query(query, function (err, results) {
        if (err) throw err;

        console.log(chalk.green("\nTable of Employees:"));
        console.table(results);
        homeQuestions();
    });

}

async function updateEmployee() {
    let query = "SELECT employee.emp_id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, department.dept_name ";
    query += "FROM employee JOIN role ON (employee.role_id = role.id) ";
    query += "JOIN department ON (role.department_id = department.id)";

    const roles = await doQuery("SELECT * FROM role");

    const employees = await doQuery(query);

    const employeeChoices = [];
    employees.forEach(elem => {

        let currEmp = {
            name: `${elem.first_name} ${elem.last_name}`,
            value: elem.emp_id,
            short: elem.first_name
        }

        employeeChoices.push(currEmp);
    });

    const roleChoices = [];
    roles.forEach(elem => {

        let currRole = {
            name: `${elem.title}`,
            value: elem.id,
            short: elem.title
        }

        roleChoices.push(currRole);
    });

    inquirer
        .prompt([
            {
                name: "employee",
                type: "list",
                message: chalk.redBright("Which employee you would like to update?"),
                choices: employeeChoices
            },
            {
                name: "roleName",
                type: "list",
                message: chalk.redBright("What is their new role?"),
                choices: roleChoices
            }
        ])
        .then(function (answers) {

            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                    {
                        role_id: answers.roleName
                    },
                    {
                        emp_id: answers.employee
                    }
                ],
                function (err) {
                    if (err) throw err;
                    console.log(chalk.yellow("\nEmployee role sucessfully updated!\n"));
                    homeQuestions();
                }
            );
        });


}

//BONUS

function deleteDRE() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: chalk.blue("Do you want to delete a department, role, or employee?"),
            choices: [
                "Department",
                "Role",
                "Employee",
                "Return to main menu"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Department":
                    deleteDepartment();
                    break
                case "Role":
                    deleteRole();
                    break
                case "Employee":
                    deleteEmployee();
                    break
                case "Return to main menu":
                    homeQuestions();
                    break
            }
        })

}

async function deleteDepartment() {
    const dDept = await doQuery("SELECT * FROM department");

    const dDeptChoices = [];
    dDept.forEach(elem => {

        let currDept = {
            name: `${elem.dept_name}`,
            value: elem.id,
            short: elem.dept_name
        }

        dDeptChoices.push(currDept);
    })

    inquirer
        .prompt({
            name: "deptName",
            type: "list",
            message: chalk.blue("Which department would you like to delete?"),
            choices: dDeptChoices
        })
        .then(function (answer) {

            connection.query("DELETE FROM department WHERE ?",
                {
                    id: answer.deptName
                },
                function (error, res) {
                    if (error) throw error;
                    console.log(chalk.yellow('\nDepartment deleted successfully!\n'));
                    homeQuestions();
                }
            )
        })

}

async function deleteRole() {
    const dRole = await doQuery("SELECT * FROM role");

    const dRoleChoices = [];
    dRole.forEach(elem => {

        let currRole = {
            name: `${elem.title}`,
            value: elem.id,
            short: elem.title
        }

        dRoleChoices.push(currRole);
    })

    inquirer
        .prompt({
            name: "roleList",
            type: "list",
            message: chalk.blue("Which role would you like to delete?"),
            choices: dRoleChoices
        })
        .then(function (answer) {

            connection.query("DELETE FROM role WHERE ?",
                {
                    id: answer.roleList
                },
                function (error, res) {
                    if (error) throw error;
                    console.log(chalk.yellow('\nRole deleted successfully!\n'));
                    homeQuestions();
                }
            )
        })

}

async function deleteEmployee() {
    const dEmp = await doQuery("SELECT * FROM employee");

    const dEmpChoices = [];
    dEmp.forEach(elem => {

        let currEmp = {
            name: `${elem.first_name} ${elem.last_name}`,
            value: elem.emp_id,
            short: elem.first_name
        }

        dEmpChoices.push(currEmp);
    });

    inquirer
        .prompt({
            name: "emp",
            type: "list",
            message: chalk.blue("Which employee would you like to delete?"),
            choices: dEmpChoices
        })
        .then(function (answer) {

            connection.query("DELETE FROM employee WHERE ?",
                {
                    emp_id: answer.emp
                },
                function (error, res) {
                    if (error) throw error;
                    console.log(chalk.yellow('\nEmployee deleted successfully!\n'));
                    homeQuestions();
                }
            )
        })

}

