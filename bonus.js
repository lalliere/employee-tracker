
//BONUS - NOT YET FINISHED

//deletes have issue bc of "ON DELETE RESTRICT" from schema

// function deleteDRE() {
//     inquirer
//         .prompt({
//             name: "action",
//             type: "rawlist",
//             message: chalk.blue("Do you want to delete a department, a role, or an employee?"),
//             choices: [
//                 "Department",
//                 "Role",
//                 "Employee",
//                 "Return to main menu"
//             ]
//         })
//         .then(function (answer) {
//             switch (answer.action) {
//                 case "Department":
//                     deleteDepartment();
//                     break
//                 case "Role":
//                     deleteRole();
//                     break
//                 case "Employee":
//                     deleteEmployee();
//                     break
//                 case "Return to main menu":
//                     homeQuestions();
//                     break
//             }
//         })

// }

// function deleteDepartment() {
//     let query = "SELECT * FROM department";

//     connection.query(query, function (err, results) {
//         if (err) throw err;

//         inquirer
//             .prompt({
//                 name: "deptName",
//                 type: "rawlist",
//                 message: chalk.blueBright("Which department would you like to delete?"),
//                 choices: function () {
//                     let deptArray = [];

//                     for (let i = 0; i < results.length; i++) {
//                         deptArray.push(results[i].dept_name);
//                     }
//                     return deptArray;
//                 }
//             }).then(function (answer) {

//                 let chosenDeptID;

//                 for (let i = 0; i < results.length; i++) {
//                     if (results[i].dept_name === answer.deptName) {
//                         chosenDeptID = results[i].id;
//                     }
//                 }

//                 connection.query("DELETE FROM department WHERE ?",
//                     {
//                         id: chosenDeptID
//                     },
//                     function (error, results) {
//                         if (error) throw error;
//                         console.log(chalk.yellow('Department deleted successfully!'));
//                         homeQuestions();
//                     }
//                 )
//             })
//     })

// }

// function deleteRole() {
//     let query = "SELECT * FROM role";

//     connection.query(query, function (err, results) {
//         if (err) throw err;

//         inquirer
//             .prompt({
//                 name: "positionName",
//                 type: "rawlist",
//                 message: chalk.blueBright("Which role would you like to delete?"),
//                 choices: function () {
//                     let positionArray = [];

//                     for (let i = 0; i < results.length; i++) {
//                         positionArray.push(results[i].title);
//                     }
//                     return positionArray;
//                 }
//             }).then(function (answer) {

//                 let chosenPositionID;

//                 for (let i = 0; i < results.length; i++) {
//                     if (results[i].title === answer.positionName) {
//                         chosenPositionID = results[i].id;
//                     }
//                 }

//                 connection.query("DELETE FROM role WHERE ?",
//                     {
//                         id: chosenPositionID
//                     },
//                     function (error, results) {
//                         if (error) throw error;
//                         console.log(chalk.yellow('Role deleted successfully!'));
//                         homeQuestions();
//                     }
//                 )
//             })
//     })
// }

// function deleteEmployee() {
//     console.log("delete employee)")
// }

// function viewEmpByMgr() {
//     let query = "SELECT * from employee";

//     connection.query(query, function(err, res) {
//         if (err) console.log(err);

//         console.log(res);
//         res.manager_id = res.emp_id;


//         if (res.manager_id === null) {
//            console.log("no manager");
//         }
//         else {
//             console.log(res.first_name);

//         }

//         console.log(res);
//         inquirer
//             .prompt([
//                 {
//                     name: "mgr",
//                     type: "rawlist",
//                     message: chalk.redBright("Which manager's employee list you would like to see?"),
//                     choices: function () {
//                         let mgrArray = [];
//                         for (let i = 0; i < res.length; i++) {
//                             empArray.push(res[i].first_name + " " + res[i].last_name);
//                         }
//                         return empArray;
//                     }
//                 },






//         let mgrName;
//         if (manager_id = emp_id) {
//             let mgrName = 
//         console.table(res)
//         homeQuestions();

//     });
// }


// async function viewBudget() {
//     let query = "SELECT employee.role_id, role.salary, role.department_id ";
//     query += "FROM department JOIN role ON (role.department_id = department.id) ";
//     query += "JOIN employee ON (employee.role_id = role.id) ";
    
//     const joinData = await doQuery(query);
    
//     const deptList = await doQuery("SELECT * FROM department");

//     const deptListChoices = [];
//     deptList.forEach(elem => {
       
//         let currDept = {
//             name: `${elem.dept_name}`,
//             value: elem.id,
//             short: elem.dept_name
//         }
            
//         deptListChoices.push(currDept);
//     });



//     inquirer
//         .prompt([
//             {
//                 name: "dept",
//                 type: "list",
//                 message: chalk.magenta("Which department's total utilized budget would you like to see?"),
//                 choices: deptListChoices
//             }
//         ])
//         .then(function (answer) {
            
//             connection.query("SELECT salary FROM role WHERE (role.department_id = ? AND (role.id = ? FROM employee))",
//                 {
//                     department_id: answer.dept,
//                     id: joinData.COUNT(role_id)
//                 },

//                 function (err, res) {
//                     if (err) console.log(err);

//                     console.log(JSON.stringify(res));

//                     console.log(chalk.yellow(`Department Total: ${res}`))
//                     homeQuestions();
//                 }
//             )

//         })
    
// }










