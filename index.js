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

const questions = ['What would you like to do?', 'What department would you like to add? ', 'What role would you like to add? ', 'What is the salary for this role? ', 'What department would you like this role to be a part of? ', 'What is the employees first name? ', 'What is the employees last name?', 'What is the employees role? ', 'Who is the employees manager? ', 'What employees role do you want to update? ', 'What is the employees new role? '];

var departmentsArray=[];
var rolesArray=[];
var employeesArray=[];

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
         askDepartmentQuestion();
      } else if(data.nextRequest === 'add a role'){
         askroleQuestions();
      } else if(data.nextRequest === 'add an employee'){
         askEmployeeQuestions();
      } else if(data.nextRequest === 'update an employee role'){
         askUpdatedEmployeeInfo();
      }
   })
}

askDepartmentQuestion = function(){
   inquirer
   .prompt([
      {
         type: 'input',
         name: 'depInput',
         message: questions[1]
      }
   ])
   .then((data) => {
      db.execute('INSERT INTO departments (department_name) VALUES (?)',[data.depInput], function(err, results, fields) {
         if(err){
            console.log(err);
         }else{
            console.log(`Added ${data.depInput} to the database`);
            askBaselineQuestions();
         }
      });
   })

}
getDepartments =function(){
   db.query('SELECT * FROM departments', function(err, results) {
      for(let i=0; i<results.length; i++){
         departmentsArray[i]=results[i].department_name;
      }
      //console.log(departmentsArray);
      //return departmentsArray;
   });
}
getRoles = function(){
   db.query('SELECT * FROM roles', function(err, results) {
      for(let i=0; i<results.length; i++){
         rolesArray[i]=results[i].title;
      }
      //console.log(rolesArray);
      //return rolesArray;
   });
}

getEmployees = function(){
   db.query('SELECT * FROM employees', function(err, results) {
      for(let i=0; i<results.length; i++){
         employeesArray[i]=results[i].first_name + ', ' + results[i].last_name;
      }
      //console.log(employeesArray);
      //return employeesArray;
   });
}

askroleQuestions = function(){
   getDepartments();
   getEmployees();
   inquirer
   .prompt([
      {
         type: 'input',
         name: 'roleTitle',
         message: questions[2]
      },
      {
         type: 'input',
         name: 'roleSalary',
         message: questions[3]
      },
      {
         type: 'list',
         name: 'roleDepartment',
         message: questions[4],
         choices: departmentsArray,
      },
   ])
   .then((data) => {
      //console.log(departmentsArray.indexOf(data.roleDepartment)+1);
      db.execute('INSERT INTO roles(title, salary, department_id) VALUES(?, ?, ?)',[data.roleTitle, data.roleSalary, departmentsArray.indexOf(data.roleDepartment)+1], function(err, results, fields) {
         if(err){
            console.log(err);
         }else{
            console.log(`Added ${data.roleTitle} to the database`);
            askBaselineQuestions();
         }
      })
   })
}

askEmployeeQuestions = function(){
   getRoles();
   getEmployees();
   inquirer
   .prompt([
      {
         type: 'input',
         name: 'firstName',
         message: questions[5]
      },
      {
         type: 'input',
         name: 'lastName',
         message: questions[6]
      },
      {
         type: 'list',
         name: 'role',
         message: questions[7],
         choices: rolesArray,
      },
      {
         type: 'list',
         name: 'manager',
         message: questions[8],
         choices: employeesArray,
      },
   ])
   .then((data) =>{
      let managerIndex=0
      for (let i = 0; i<employeesArray.length; i++){
         if(employeesArray[i]===data.manager){
            managerIndex=i;
         }
      };
      db.execute('INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)', [data.firstName, data.lastName, rolesArray.indexOf(data.role)+1, managerIndex+1], function(err, results, fields) {
         if(err){
            console.log(err);
         }else{
            console.log(`Added ${data.firstName} to the database`);
            askBaselineQuestions();
         }
      })
   })
};
askUpdatedEmployeeInfo = function(){
   getRoles();
   getEmployees();
   // console.log(employeesArray);
   inquirer
   .prompt([
      {
         type: 'list',
         name: 'updateEmployee',
         message: questions[9],
         choices: employeesArray,
      },
      {
         type: 'list',
         name: 'updateRole',
         message: questions[10],
         choices: rolesArray,
      },
   ])
   .then((data) =>{
      console.log(rolesArray.indexOf(data.updateRole)+1);
      console.log(employeesArray.indexOf(data.updateEmployee)+1);
      db.execute('UPDATE employees SET role_id = ? WHERE id = ?',[rolesArray.indexOf(data.updateRole)+1, employeesArray.indexOf(data.updateEmployee)+1], function(err, results, fields) {
         if(err){
            console.log(err);
         }else{
            console.log(`Updated ${data.updateEmployee} role in database`);
            askBaselineQuestions();
         }
      });
   });
}
getEmployees();
getRoles();
askBaselineQuestions();

