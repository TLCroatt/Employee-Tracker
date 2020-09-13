const mysql = require("mysql");
const inquirer = require("inquirer");
const { allowedNodeEnvironmentFlags } = require("process");
const consoleTable = require("console.table");

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

     //var departmentChoice = res.map(data => ({
       //value: data.id, name: data.name
      //}));

   // departmentPrompts();

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
                })
            });
    
    
        }; 
        
    start(); 
    };      

