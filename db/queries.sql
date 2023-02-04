SELECT departments.department_name AS department, roles.title
FROM roles
LEFT JOIN departments
ON roles.department_id = departments.id;

-- View All Roles
SELECT roles.id, roles.title, departments.department_name AS department, roles.salary
FROM roles
INNER JOIN departments
ON roles.department_id = departments.id;

-- view all employees
SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary
FROM employees
LEFT JOIN roles
ON employees.role_id = roles.id
INNER JOIN departments
ON roles.department_id = departments.id;


SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary
FROM employees
LEFT JOIN roles
ON employees.role_id = roles.id
INNER JOIN departments
ON roles.department_id = departments.id;
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