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

//start the program  
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
         } else if (answer.action === "View Departments") {
             viewDepartments();
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

function viewEmployees() {
    var query = "SELECT * FROM employee";
        connection.query(query, function(err, res) {
            console.log(`EMPLOYEES:`)
        res.forEach(employee => {
            console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
        });
        start();    
    });
};

function viewDepartments() {
    var query = "SELECT * FROM department";
        connection.query(query, function(err, res) {
            console.log(`DEPARTMENTS:`)
        res.forEach(department => {
            console.log (`ID: ${department.id} | Name: ${department.name}`)
        });    
    });
    start();
};    

function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
        console.log(`ROLES:`)
    res.forEach(role => {
        console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
    })
    start();
    });
};

