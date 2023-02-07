//calling all dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();
//questions for inquirer
const questions = ['What would you like to do?', 'What department would you like to add? ', 'What role would you like to add? ', 'What is the salary for this role? ', 'What department would you like this role to be a part of? ', 'What is the employees first name? ', 'What is the employees last name?', 'What is the employees role? ', 'Who is the employees manager? ', 'What employees role do you want to update? ', 'What is the employees new role? '];
//arrays for list questions
var departmentsArray=[];
var rolesArray=[];
var employeesArray=[];
// connect to database
const db = mysql.createConnection(
   {
      host: 'localhost',
      user: process.env.USER,
      password: process.env.PASS,
      database: process.env.DB
   },
   console.log ('Connected to hr_db database.')
);
//recurring question being asked from user
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
   .then((data) =>{ //display the departments
      if(data.nextRequest === 'view all departments'){
         db.query('SELECT * FROM departments', function(err, results) {
            console.table(results);
            askBaselineQuestions();
         });
      } else if(data.nextRequest === 'view all roles'){ //display the roles
         db.query('SELECT roles.id, roles.title, departments.department_name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id', function (err, results) {
            console.table(results);
            askBaselineQuestions();
         });
      } else if(data.nextRequest === 'view all employees'){ //display the employees
         db.query('SELECT e.id, e.first_name, e.last_name, roles.title, departments.department_name AS department, roles.salary, IFNULL(CONCAT(m.first_name, m.last_name), NULL) AS manager FROM employees e JOIN roles ON e.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON m.id = e.manager_id', function(err, results) {
            console.table(results);
            askBaselineQuestions();
         });
      } else if(data.nextRequest === 'add a department'){ //call add department function
         askDepartmentQuestion();
      } else if(data.nextRequest === 'add a role'){ // call add role function
         askroleQuestions();
      } else if(data.nextRequest === 'add an employee'){ // call add employee function
         askEmployeeQuestions();
      } else if(data.nextRequest === 'update an employee role'){ //call update employee function
         askUpdatedEmployeeInfo();
      }
   })
}
//adding a department
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
//get all of the current departments and add them to an array
getDepartments =function(){
   db.query('SELECT * FROM departments', function(err, results) {
      for(let i=0; i<results.length; i++){
         departmentsArray[i]=results[i].department_name;
      }
      //console.log(departmentsArray);
      //return departmentsArray;
   });
}
//get all potential employee roles
getRoles = function(){
   db.query('SELECT * FROM roles', function(err, results) {
      for(let i=0; i<results.length; i++){
         rolesArray[i]=results[i].title;
      }
      //console.log(rolesArray);
      //return rolesArray;
   });
}
// get all employees
getEmployees = function(){
   db.query('SELECT * FROM employees', function(err, results) {
      for(let i=0; i<results.length; i++){
         employeesArray[i]=results[i].first_name + ', ' + results[i].last_name;
      }
      //console.log(employeesArray);
      //return employeesArray;
   });
}
// add a new role to the db
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
//add a new employee to the db
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
      }; //inserts the new employee to the db
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

//update employee role
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
   .then((data) =>{ // updates employees new role
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
//before starting the app gets the current employees and roles into their respective arrays (done this way due to the inquirer issues with mysql2)
getEmployees();
getRoles();
//initializes the app
askBaselineQuestions();

