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
            message: chalk.blueBright("What would you like to do?"),
            choices: [
                "View company directory",
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
                    console.log(chalk.yellow("\nDepartment added successfully!"))
                    homeQuestions();
                })
        })
}

function addRole() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;

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
                    type: "rawlist",
                    message: chalk.magenta("Which department does this role belong in?"),
                    choices: function () {
                        let deptArray = [];
                        for (let i = 0; i < results.length; i++) {
                            deptArray.push(results[i].dept_name);
                        }
                        return deptArray;
                    }

                }
            ])
            .then(function (answer) {
                let chosenDeptID;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].dept_name === answer.dept) {
                        chosenDeptID = results[i].id
                    }
                }

                connection.query("INSERT INTO role SET ?",
                    {
                        title: answer.name,
                        salary: answer.salary,
                        department_id: chosenDeptID

                    },
                    function (err, res) {
                        if (err) console.log(err);
                        console.log(chalk.yellow("\nRole added successfully!"))
                        homeQuestions();
                    }
                )

            })

    })
}

function addEmployee() {
    let query = "SELECT employee.emp_id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.id, role.title, role.salary, role.department_id, department.id, department.dept_name ";
    query += "FROM employee JOIN role ON (employee.role_id = role.id)";
    query += "JOIN department ON (role.department_id = department.id)";

    connection.query(query, function (err, results) {
        if (err) throw err;

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
                    name: "title",
                    type: "rawlist",
                    message: chalk.magenta("What is their position?"),
                    choices: function () {
                        let roleArray = [];

                        for (let i = 0; i < results.length; i++) {
                            if (roleArray.indexOf(results[i].title) === -1) {
                                roleArray.push(results[i].title);
                            }
                        }
                        return roleArray;
                    }
                },
                {
                    name: "manager",
                    type: "rawlist",
                    message: chalk.magenta("Who is their manager?"),
                    choices: function () {
                        let managerArray = [];

                        for (let i = 0; i < results.length; i++) {
                            if (managerArray.indexOf(results[i].first_name) === -1) {
                                managerArray.push(results[i].first_name);
                            }
                        }
                        return managerArray;
                    }
                }
            ])
            .then(function (answers) {
                let roleID;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].title === answers.title) {
                        roleID = results[i].role_id;
                    }
                }

                let managerID;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].first_name === answers.manager) {
                        managerID = results[i].emp_id;
                    }
                }
                
                connection.query(
                    "INSERT INTO employee SET ? ",
                    [
                        {
                            first_name: answers.first,
                            last_name: answers.last,
                            role_id: roleID,
                            manager_id: managerID
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(chalk.yellow("\nEmployee record sucessfully created!"));
                        homeQuestions();
                    }
                );
            });

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


function updateEmployee() {
    let query = "SELECT employee.emp_id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, department.dept_name ";
    query += "FROM employee JOIN role ON (employee.role_id = role.id) ";
    query += "JOIN department ON (role.department_id = department.id)";

    connection.query(query, function (err, results) {
        if (err) throw err;
        
        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "rawlist",
                    message: chalk.redBright("Which employee you would like to update?"),
                    choices: function () {
                        let empArray = [];
                        for (let i = 0; i < results.length; i++) {
                            empArray.push(results[i].first_name + " " + results[i].last_name);
                        }
                        return empArray;
                    }
                },
                {
                    name: "roleName",
                    type: "rawlist",
                    message: chalk.redBright("What is their new role?"),
                    choices: function () {
                        let roleArray = [];

                        for (let i = 0; i < results.length; i++) {
                            // if (roleArray.indexOf(results[i].title) === -1) {
                                roleArray.push(results[i].title);
                            // }
                        }
                        return roleArray;
                    }
                }
            ])
            .then(function (answers) {
                let chosenRoleID;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].title === answers.roleName) {
                        chosenRoleID = results[i].role_id;
                    }
                }

                let chosenEmpFull = (answers.employee);
                let chosenEmpSplit = chosenEmpFull.split(' ');
                let chosenEmp = chosenEmpSplit[0];


                connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                        {
                            role_id: chosenRoleID
                        },
                        {
                            first_name: chosenEmp
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(chalk.yellow("\nEmployee role sucessfully updated!"));
                        homeQuestions();
                    }
                );
            });
    });

}



// BONUS
function deleteDRE() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: chalk.blue("Do you want to delete a department, a role, or an employee?"),
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

function deleteDepartment() {
    let query = "SELECT * FROM department";

    connection.query(query, function (err, results) {
        if (err) throw err;

        inquirer
            .prompt({
                name: "deptName",
                type: "rawlist",
                message: chalk.blueBright("Which department would you like to delete?"),
                choices: function () {
                    let deptArray = [];

                    for (let i = 0; i < results.length; i++) {
                        deptArray.push(results[i].dept_name);
                    }
                    return deptArray;
                }
            }).then(function (answer) {

                let chosenDeptID;

                for (let i = 0; i < results.length; i++) {
                    if (results[i].dept_name === answer.deptName) {
                        chosenDeptID = results[i].id;
                    }
                }

                connection.query("DELETE FROM department WHERE ?",
                    {
                        id: chosenDeptID
                    },
                    function (error, results) {
                        if (error) throw error;
                        console.log(chalk.yellow('Department deleted successfully!'));
                        homeQuestions();
                    }
                )
            })
    })

}

function deleteRole() {
    let query = "SELECT * FROM role";

    connection.query(query, function (err, results) {
        if (err) throw err;

        inquirer
            .prompt({
                name: "positionName",
                type: "rawlist",
                message: chalk.blueBright("Which role would you like to delete?"),
                choices: function () {
                    let positionArray = [];

                    for (let i = 0; i < results.length; i++) {
                        positionArray.push(results[i].title);
                    }
                    return positionArray;
                }
            }).then(function (answer) {

                let chosenPositionID;

                for (let i = 0; i < results.length; i++) {
                    if (results[i].title === answer.positionName) {
                        chosenPositionID = results[i].id;
                    }
                }

                connection.query("DELETE FROM role WHERE ?",
                    {
                        id: chosenPositionID
                    },
                    function (error, results) {
                        if (error) throw error;
                        console.log(chalk.yellow('Role deleted successfully!'));
                        homeQuestions();
                    }
                )
            })
    })
}

function deleteEmployee() {
    console.log("delete employee)")
}

function viewEmpByMgr() {

    // let query = "SELECT employee.manager_id";
    // query += "FROM employee INNER JOIN role ON (employee.role_id = role.name AND role.department_id";
    // query += "= role.id) WHERE (employee.role_id = ? AND role.department_id = ?) ORDER BY role.id";

    // connection.query(query, function(err, res) {
    //     if (err) console.log(err);

    //     for (let i = 0; i < res.length; i++) {
    //         console.table(
    //             i+1 + ".) " +
    //             "Manager: " +
    //             res[i].manager_id +
    //             " Role: " +
    //             res[i].role_id +
    //             " Department: " +
    //             res[i].department_id
    //         );
    //     }
    // });
}


function viewBudget() {
    console.log("6")
}










