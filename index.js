const mysql = require("mysql");
const inquirer = require("inquirer");
const { allowedNodeEnvironmentFlags } = require("process");
const consoleTable = require("console.table");
const { identity } = require("rxjs");

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
                "View Departments",
                "View Roles",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Update Employee Role",
                "End"
            ]
        })
    .then(function({task}) {
         switch (task) {
            case "View Employees":
                viewEmployees();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "Add Employee":
                addEmployee();  
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            case "End":
                connection.end();
                break;           
        }
    });    
};

async function viewEmployees() {
    var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, CONCAT(m.first_name, ' ', m.last_name)
    FROM EMPLOYEE AS e
    LEFT JOIN role AS r
        ON e.role_id = r.id
    LEFT JOIN department AS d
        ON d.id = r.department_id
    LEFT JOIN employee AS m
        ON m.id = e.manager_id;` 
    
    connection.query(query, function(err, res) {
        if (err) throw err
        console.log(`EMPLOYEES:`)
        console.table(res);
        start();    
    });
};

async function viewDepartments() {
    var query = `SELECT * FROM department`
    
    connection.query(query, function(err, res) {
        if (err) throw err
        console.log("DEPARTMENTS:")
        console.table(res)
        departmentPrompts();
    });

    function departmentPrompts() {
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "departmentID",
                    message: "Select a department.",
                    choices: ["1", "2", "3", "4"]
                }
            ])
            .then(function (answer) {
                console.log("answer", answer.departmentID)

                var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
                FROM employee AS e
                LEFT JOIN role AS r
                    ON e.role_id = r.id
                LEFT JOIN department AS d
                    ON d.id = r.department_id
                WHERE d.id = ?`

                connection.query(query, answer.departmentID, function (err, res) {
                    if (err) throw err;

                    console.log(`Employess in ${answer.departmentID}`)
                    console.table(res);
                    start();
                })
            });
    
    
        }; 
        
     
    };      


async function viewRoles() {
    var query = `SELECT * FROM role`
    
    connection.query(query, function(err, res) {
        if (err) throw err
        console.log("ROLES:")
        console.table(res)
        start();
    });
    
};       

async function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?"
            },
            {
                type: "number",
                name: "roleID",
                message: "What is their role ID?"
            },
            {
                type: "number",
                name: "managerID",
                message: "What is their manager's ID?"
            }
        ])
        .then(function(res) {
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [res.firstName, res.lastName, res.roleID, res.managerID], function(err, data) {
                if (err) throw err;
                console.table("Employee Added", res)
                start();
            })
        })
    
    
};

async function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "department",
                message: "What department would you like to add?"
            }
        ]).then(function(res) {
            connection.query(`INSERT INTO department (name) VALUES (?)`, [res.department], function(err, data) {
                if (err) throw err;
                console.log("Department Added");
                start();
            })
        })
};

async function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "Enter Job Title"
            },
            {
                type: "number",
                name: "salary",
                message: "Enter Salary"
            },
            {
                type: "number",
                name: "departmentID",
                message: "Enter Department ID Number"
            }
        ]).then(function(res) {
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [res.title, res.salary, res.departmentID], function (err, res) {
                console.log("Position Added");
                start();
            })
            
        })
};

async function updateRole() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "Please enter the last name of the employee you wish to update."
            },
            {
                type: "number",
                name: "roleID",
                message: "Please enter the new role ID"
            }
        ]).then(function(res) {
            connection.query(`UPDATE employee SET role_id = ? WHERE last_name = ?`, [res.roleID, res.name], function(err, data) {
                console.log("Employee Updated");
                start();
            })
        })
}