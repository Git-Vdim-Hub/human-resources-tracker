//PSEUDO CODE
/* dev employee tracker chal 10 with a database dont need to make classes like in unit 10 create a bunch of tables
 reference the pictures/screenshots for the tables values 1 and * association 
 its saying for one department you can have many roles in the dep and for one role you can have many employees for that role
 primary submission view dep roles and employees (SELECT ALL FROM) then adding a department a role and an employee is next
 (INSERT INTO) then update an employee role
 
 Extra credit: update employee managers, view employees by manager view employees by department delete departments, roles and
 employees are all JOINS

 mySql2 functionality breaks with .then import the .promise() const mysql = require ('mysq12/promise');
 mysql breaks the code sometimes inside the inquirer.then

 1. create databases, create seed data.
 2. set up 1 inquire message that lets you view by employees
    - view all departments SELECT * FROM departments;
    - view all roles ref queries.sql
    - view all employees ref queries.sql
    - add a department
    - add a role
    - add an employee
    - update an employee role
 */
//pull down Chal 10 code/ reference
//2. figure out folder stucture (app executes from index.js) need seeds.sql for pre-pop data need schema.sql
// for main sql code,
//3. install dependencies (node, inquirer, console.table, mysql2 and .promise() (check npm link in chal readMe using promise wrapper), dotenv)

const inquirer = require('inquirer');
const mysqlp = require('mysql2/promise');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

const questions = ['What would you like to do?'];

const db = mysql.createConnection(
   {
      host: 'localhost',
      user: process.env.USER,
      password: process.env.PASS,
      database: process.env.DB
   },
   console.log ('Connected to hr_db database.')
);

askBaselineQuestions = function() {
   inquirer
   .prompt([
      {
         type: 'list',
         name: 'nextRequest',
         message: questions[0],
         choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
      }
   ])
   .then((data) =>{
      if(data.nextRequest === 'view all departments'){
         db.query('SELECT * FROM departments', function(err, results) {
            console.table(results);
            askBaselineQuestions();
         });
      } else if(data.nextRequest === 'view all roles'){
         db.query('SELECT roles.id, roles.title, departments.department_name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id', function (err, results) {
            console.table(results);
            askBaselineQuestions();
         });
      } else if(data.nextRequest === 'view all employees'){
         db.query('SELECT e.id, e.first_name, e.last_name, roles.title, departments.department_name AS department, roles.salary, IFNULL(CONCAT(m.first_name, m.last_name), NULL) AS manager FROM employees e JOIN roles ON e.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON m.id = e.manager_id', function(err, results) {
            console.table(results);
            askBaselineQuestions();
         });
      } else if(data.nextRequest === 'add a department'){
         return;
      }
   })
}

askBaselineQuestions();

