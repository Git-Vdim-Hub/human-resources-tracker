-- View All Roles
SELECT roles.id, roles.title, departments.department_name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id;

-- view all employees
-- Credit to https://www.mysqltutorial.org/mysql-self-join/ for the understanding behind declaring a variable "e" & "m" and using IFNULL for displaying employees with no managers above them.
SELECT e.id, e.first_name, e.last_name, roles.title, departments.department_name AS department, roles.salary, IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'Department Lead') AS manager
FROM employees e
JOIN roles
ON e.role_id = roles.id
JOIN departments
ON roles.department_id = departments.id
LEFT JOIN employees m
ON m.id = e.manager_id;


-- Examples from https://www.mysqltutorial.org/mysql-self-join/ reworked
-- SELECT 
--     CONCAT(m.last_name, ', ', m.first_name) AS manager
-- FROM
--     employees e
-- JOIN employees m 
-- ON m.id = e.manager_id;


-- SELECT 
--     IFNULL(CONCAT(m.lastname, ', ', m.firstname), 'Top Manager') AS 'Manager',
--     CONCAT(e.lastname, ', ', e.firstname) AS 'Direct report'
-- FROM
--     employees e
-- LEFT JOIN employees m ON 
--     m.employeeNumber = e.reportsto
-- ORDER BY 
--     manager DESC;



-- ALTER TABLE roles ADD COLUMN department VARCHAR(30);

-- INSERT INTO roles(department_id) VALUES(value)
-- SELECT
--     name
-- FROM
--     departments;

-- INSERT INTO roles (department_id) VALUES ( SELECT id FROM departments WHERE department_name = ${'Sales'});

-- SELECT id FROM departments WHERE department_name = 'Sales';
-- ALTER TABLE roles
-- ADD departments VARCHAR(30);

-- INSERT INTO roles(departmets)
-- SELECT name
-- FROM departments;


-- SELECT department_id FROM roles INNER JOIN departments USING (id) GROUP BY department;


-- INSERT INTO employees(role_id) SELECT title FROM roles;