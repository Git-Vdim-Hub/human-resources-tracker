INSERT INTO departments (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Accountant", 125000, 3),
       ("Account Manager", 160000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Mike", "Chan", 2, 1),
       ("Ashley", "Rodriquez", 3, NULL),
       ("Kunal", "Singh", 6, NULL),
       ("Malia", "Brown", 5, 4),
       ("Sara", "Lourd", 7, NULL),
       ("Tom", "Allen", 8, 6);

-- id, first_name, last_name, title, department, salary, manager

-- John Doe         Sales lead      Sales       100000 null
-- Mike Chan        Salesperson     Sales       80000 John Doe
-- Ashley Rodriguez Lead Engineer   Engineering 150000 null
-- Kunal Singh      Account Manager Finance     160000 null
-- Malia Brown      Accountant      Finance     125000 Kunal Singh
-- Sarah Lourd      Legal Team Lead Legal       250000 null
-- Tom Allen        Lawyer          Legal       190000 Sarah Lourd