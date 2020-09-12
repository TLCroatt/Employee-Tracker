const mysql = require("mysql");
const inquirer = require("inquirer");
const { allowedNodeEnvironmentFlags } = require("process");

//connection to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "B00pl3Sn00t%",
    database: "employees_db"
  });

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

function start() {
    inquirer
        .prompt({
            type: "list",
            name: "task",
            message: "What would you like to do?",
            choices: [
                "View Employees",
                "View Department",
                "View Roles",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Update Employee Role",
                "End"
            ]
        })
    .then(function(answer) {
         if (answer.action === "View Employees") {
             viewEmployees();
         } else if (answer.action === "View Department") {
             viewDepartment();
         } else if (answer.action === "View Roles") {
             viewRoles();
         } else if (answer.action === "Add Employee") {
             addEmployee();
         } else if (answer.action === "Add Department") {
             addDepartment();
         } else if (answer.action === "Add Role") {
             addRole(); 
         } else if (answer.action === "Update Employee Role") {
             updateRole();
         } else if (answer.action === "Exit") {
             connection.end();
         }
    });    
};