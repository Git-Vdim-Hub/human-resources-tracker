INSERT INTO departments (id, name)
VALUES (001, "Sales"),
       (002, "Engineering"),
       (003, "Finance"),
       (004, "Legal");

INSERT INTO roles (id, title, salary, department_id)
VALUES (001, "Sales Lead", 100000, 1),
       (002, "Salesperson", 80000, 1),
       (003, "Lead Engineer", 150000, 2),
       (004, "Software Engineer", 120000, 2),
       (005, "Accountant", 125000, 3),
       (006, "Account Manager", 160000, 3),
       (007, "Legal Team Lead" 250000, 4),
       (008, "Lawyer", 190000, 4);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (001, "John", "Doe", 1, NULL),
       (002, "Mike", "Chan", 2, 1),
       (003, "Ashley", "Rodriquez", 3,),
       (004, "Kunal", "Singh", 6, NULL),
       (005, "Malia", "Brown", 5, 4),
       (006, "Sara", "Lourd", 7, NULL),
       (007, "Tom", "Allen", 8, 6);

-- id, first_name, last_name, title, department, salary, manager

-- John Doe         Sales lead      Sales       100000 null
-- Mike Chan        Salesperson     Sales       80000 John Doe
-- Ashley Rodriguez Lead Engineer   Engineering 150000 null
-- Kunal Singh      Account Manager Finance     160000 null
-- Malia Brown      Accountant      Finance     125000 Kunal Singh
-- Sarah Lourd      Legal Team Lead Legal       250000 null
-- Tom Allen        Lawyer          Legal       190000 Sarah Lourd