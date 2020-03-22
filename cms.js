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
            let query = "INSERT INTO department SET ?";
            connection.query(query,
                {
                    name: answer.action
                },
                function (err, res) {
                    if (err) console.log(err);
                    console.log(chalk.yellow("Department added successfully!"))
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
                            deptArray.push(results[i].name);
                        }
                        return deptArray;
                    }

                }
            ])
            .then(function (answer) {
                let chosenDeptID;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].name === answer.dept) {
                        chosenDeptID = results[i].id
                    }
                }

                connection.query("INSERT INTO role SET ?",
                    {
                        name: answer.name,
                        salary: answer.salary,
                        department_id: chosenDeptID

                    },
                    function (err, res) {
                        if (err) console.log(err);
                        console.log(chalk.yellow("Role added successfully!"))
                        homeQuestions();
                    }
                )

            })

    })
}

// NEED TO ADD EMPLOYEE IN .THEN; role_id
function addEmployee() {
    inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "What is the first name of the new employee?",
        validate: function(value) {
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
        message: "What is the last name of the new employee?",
        validate: function(value) {
          if (value === "") {
            return new Error("You must enter a valid name!");
          } else {
            return true;
          }
        }
      }
    ])
    .then(function(answer) {
      console.log("COOL.");
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
                "View employees"
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
            }
        })

}

function viewDepartments() {
    let query = "SELECT * FROM department ORDER BY id";
    connection.query(query, function (err, res) {
        if (err) throw (err);

        for (let i = 0; i < res.length; i++) {
                console.table(
                    "ID" : res.id,
                        Dept_Name: res.name
                    
      

       
                console.table(
                    "ID " +
                    result[i].id +
                    " Name " +
                    result[i].deptName
                );
            }
        // for (let i = 0; i < res.length; i++) {
        //     console.table([
        //         {
        //             ID: res.id,
        //             Dept_Name: res.name
        //         }
        //     ])


        // }
            
 
        //homeQuestions();
    })
}

function viewRoles() {
  
    let query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
        if (err) console.log(err);
        console.table(res);
        homeQuestions();
    });
}

function viewEmployees() {
 
    let query = "SELECT * FROM employee";
    connection.query(query, function(err, res) {
        if (err) console.log(err);
        console.table(res);
        homeQuestions();
    });
}


function updateEmployee() {
    let query = "SELECT role.id, role.name, role.department_id, employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id ";
    query += "FROM employee INNER JOIN role ON (employee.role_id = role.id)";
    
    connection.query(query, function (err, results) {
        if (err) throw err;
     

        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "rawlist",
                    message: "Which employee you would like to update?",
                    choices: function () {
                        let empArray = [];
                        for (let i = 0; i < results.length; i++) {
                            empArray.push(results[i].first_name);
                        }
                        return empArray;
                    }
                },
                {
                    name: "roleName",
                    type: "rawlist",
                    message: "What is their new role?",
                    choices: function () {
                        let roleArray = [];
                        
                        for (let i = 0; i < results.length; i++) {
                            if(roleArray.indexOf(results[i].name) === -1) {
                                roleArray.push(results[i].name);
                            }
                        }
                        return roleArray;
                    }
                }
            ])
            .then(function (answers) {
                let chosenRoleID;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].name === answers.roleName) {
                        chosenRoleID = results[i].role_id;
                    }
                }
                
                connection.query(
                    "UPDATE employee SET ? WHERE ?",
                    [
                        {
                            role_id: chosenRoleID
                        },
                        {
                            first_name: answers.employee
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(chalk.yellow("Employee role sucessfully updated!"));
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
            message: chalk.red("Do you want to delete a department, a role, or an employee?"),
            choices: [
                "Department",
                "Role",
                "Employee"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Department":
                    connection.query("SELECT * FROM department", function (err, res) {
                        if (err) console.log(err);
                        console.table(res)
                        deleteDepartment();
                    })
                    break
                case "Role":
                    deleteRole();
                    break
                case "Employee":
                    deleteEmployee();
                    break
            }
        })

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

function deleteRole() {
    console.log("delete role")
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










