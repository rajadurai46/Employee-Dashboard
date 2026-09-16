let employees = [];
let currentDepartment = "All";
let currentSearch = "";

const API_URL = "https://dummyjson.com/users";



const employeeContainer =
    document.getElementById("employeeContainer");

const employeeCount =
    document.getElementById("employeeCount");

const totalSalary =
    document.getElementById("totalSalary");

const averageSalary =
    document.getElementById("averageSalary");

const highestEmployee =
    document.getElementById("highestEmployee");

const statusMessage =
    document.getElementById("statusMessage");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const employeeForm =
    document.getElementById("employeeForm");

const sortSelect =
    document.getElementById("sortSelect");


function fetchEmployees() {

    statusMessage.textContent = "Loading employees...";

    fetch(API_URL)

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }

            return response.json();
        })

        .then(data => {

        

            employees = data.users.map(user => {

                return {
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    age: user.age,
                    email: user.email,
                    phone: user.phone,
                    department: user.company.department,
                    image: user.image,

              
                    salary: generateSalary(
                        user.company.department
                    )
                };

            });

            statusMessage.textContent =
                "Employee data loaded successfully.";

            displayEmployees(employees);

        })

        .catch(error => {

            console.error(error);

            statusMessage.textContent =
                "Unable to load employee data. Please try again.";

        })

        .finally(() => {

            console.log("API request completed.");

        });
}


function generateSalary(department) {

    const salaries = {
        IT: 70000,
        HR: 55000,
        Finance: 65000,
        Marketing: 60000
    };

    return salaries[department] || 50000;
}


function displayEmployees(employeeList) {

    employeeContainer.innerHTML = "";

    if (employeeList.length === 0) {

        employeeContainer.innerHTML = `
            <div class="empty">
                <h3>No employees found</h3>
                <p>Try another search or department.</p>
            </div>
        `;

        updateEmployeeCount(employeeList);

        calculateSalary(employeeList);

        return;
    }

    employeeList.forEach(employee => {

        const card = document.createElement("div");

        card.className = "employee-card";

        card.innerHTML = `
            <img
                src="${employee.image || "https://via.placeholder.com/300"}"
                alt="${employee.name}"
            >

            <div class="employee-info">

                <h3>${employee.name}</h3>

                <p>
                    <strong>Age:</strong>
                    ${employee.age}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${employee.email}
                </p>

                <p>
                    <strong>Department:</strong>
                    ${employee.department}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${employee.phone || "N/A"}
                </p>

                <p>
                    <strong>Salary:</strong>
                    ₹${employee.salary.toLocaleString("en-IN")}
                </p>

                <button
                    class="delete-btn"
                    data-id="${employee.id}"
                >
                    Delete
                </button>

            </div>
        `;

        employeeContainer.appendChild(card);

    });

    addDeleteEvents();

    updateEmployeeCount(employeeList);

    calculateSalary(employeeList);
}


function addDeleteEvents() {

    const deleteButtons =
        document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            deleteEmployee(id);

        });

    });
}


function deleteEmployee(id) {

    employees = employees.filter(employee => {

        return employee.id !== id;

    });

    applyFilters();
}


function searchEmployees() {

    currentSearch =
        searchInput.value.trim().toLowerCase();

    applyFilters();
}


function filterDepartment(department) {

    currentDepartment = department;

    applyFilters();
}


function applyFilters() {

    let filteredEmployees = [...employees];


    if (currentSearch !== "") {

        filteredEmployees = filteredEmployees.filter(
            employee => {

                return employee.name
                    .toLowerCase()
                    .includes(currentSearch);

            }
        );

    }


    if (currentDepartment !== "All") {

        filteredEmployees = filteredEmployees.filter(
            employee => {

                return employee.department ===
                    currentDepartment;

            }
        );

    }


    filteredEmployees = sortEmployees(filteredEmployees);

    displayEmployees(filteredEmployees);
}


function updateEmployeeCount(employeeList) {

    employeeCount.textContent =
        employeeList.length;
}


function calculateSalary(employeeList) {


    const total = employeeList.reduce(
        (sum, employee) => {

            return sum + employee.salary;

        },
        0
    );

    totalSalary.textContent =
        `₹${total.toLocaleString("en-IN")}`;


    const average =
        employeeList.length > 0
            ? total / employeeList.length
            : 0;

    averageSalary.textContent =
        `₹${Math.round(average).toLocaleString("en-IN")}`;


    calculateHighestSalary(employeeList);
}


function calculateHighestSalary(employeeList) {

    if (employeeList.length === 0) {

        highestEmployee.textContent =
            "No employee data available";

        return;
    }

    const highest = employeeList.reduce(
        (highestEmployee, employee) => {

            return employee.salary >
                highestEmployee.salary
                ? employee
                : highestEmployee;

        }
    );

    highestEmployee.innerHTML = `
        <strong>Name:</strong>
        ${highest.name}
        <br>

        <strong>Salary:</strong>
        ₹${highest.salary.toLocaleString("en-IN")}
    `;
}



function addEmployee(event) {

    event.preventDefault();

    if (!validateEmployee()) {
        return;
    }

    const name =
        document.getElementById("name").value.trim();

    const age =
        Number(document.getElementById("age").value);

    const email =
        document.getElementById("email").value.trim();

    const department =
        document.getElementById("department").value;

    const salary =
        Number(document.getElementById("salary").value);


    const newEmployee = {

        id: Date.now(),

        name: name,

        age: age,

        email: email,

        department: department,

        salary: salary,

        phone: "N/A",

        image: "https://via.placeholder.com/300"
    };


    employees = [
        ...employees,
        newEmployee
    ];


    displayEmployees(employees);

    clearForm();

    currentSearch = "";
    currentDepartment = "All";

    searchInput.value = "";

    document.querySelectorAll(".dept-btn")
        .forEach(button => {

            button.classList.remove("active");

        });

    document
        .querySelector('[data-department="All"]')
        .classList.add("active");
}


function validateEmployee() {

    let isValid = true;

    clearErrors();

    const name =
        document.getElementById("name").value.trim();

    const age =
        Number(document.getElementById("age").value);

    const email =
        document.getElementById("email").value.trim();

    const department =
        document.getElementById("department").value;

    const salary =
        Number(document.getElementById("salary").value);


    if (name === "") {

        document.getElementById("nameError")
            .textContent =
            "❌ Please enter employee name";

        isValid = false;
    }


    if (age <= 18 || isNaN(age)) {

        document.getElementById("ageError")
            .textContent =
            "❌ Age must be greater than 18";

        isValid = false;
    }


    if (email === "") {

        document.getElementById("emailError")
            .textContent =
            "❌ Please enter employee email";

        isValid = false;
    }


    if (department === "") {

        document.getElementById("departmentError")
            .textContent =
            "❌ Please select department";

        isValid = false;
    }



    if (salary <= 0 || isNaN(salary)) {

        document.getElementById("salaryError")
            .textContent =
            "❌ Please enter valid salary";

        isValid = false;
    }


    return isValid;
}


function clearErrors() {

    document.getElementById("nameError")
        .textContent = "";

    document.getElementById("ageError")
        .textContent = "";

    document.getElementById("emailError")
        .textContent = "";

    document.getElementById("departmentError")
        .textContent = "";

    document.getElementById("salaryError")
        .textContent = "";
}



function clearForm() {

    employeeForm.reset();

    clearErrors();
}



function sortEmployees(employeeList) {

    const sortValue =
        sortSelect.value;

    const sortedEmployees =
        [...employeeList];


    if (sortValue === "nameAsc") {

        sortedEmployees.sort((a, b) => {

            return a.name.localeCompare(b.name);

        });

    }

    else if (sortValue === "nameDesc") {

        sortedEmployees.sort((a, b) => {

            return b.name.localeCompare(a.name);

        });

    }

    else if (sortValue === "ageAsc") {

        sortedEmployees.sort((a, b) => {

            return a.age - b.age;

        });

    }

    else if (sortValue === "ageDesc") {

        sortedEmployees.sort((a, b) => {

            return b.age - a.age;

        });

    }

    else if (sortValue === "salaryAsc") {

        sortedEmployees.sort((a, b) => {

            return a.salary - b.salary;

        });

    }

    else if (sortValue === "salaryDesc") {

        sortedEmployees.sort((a, b) => {

            return b.salary - a.salary;

        });

    }


    return sortedEmployees;
}


function updateDateTime() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        now.toLocaleString("en-US", {
            month: "long"
        });

    const day =
        now.getDate();

    let hours =
        now.getHours();

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");

    const period =
        hours >= 12 ? "PM" : "AM";

    hours =
        hours % 12 || 12;


    document.getElementById("date")
        .textContent =
        `Today: ${day} ${month} ${year}`;

    document.getElementById("time")
        .textContent =
        `Time: ${hours}:${minutes}:${seconds} ${period}`;
}



document.querySelectorAll(".dept-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".dept-btn")
                .forEach(btn => {

                    btn.classList.remove("active");

                });

            button.classList.add("active");

            const department =
                button.dataset.department;

            filterDepartment(department);

        });

    });



searchBtn.addEventListener(
    "click",
    searchEmployees
);


searchInput.addEventListener(
    "keyup",
    event => {

        if (event.key === "Enter") {

            searchEmployees();

        }

    }
);



sortSelect.addEventListener(
    "change",
    applyFilters
);



employeeForm.addEventListener(
    "submit",
    addEmployee
);



fetchEmployees();



setInterval(
    updateDateTime,
    1000
);

updateDateTime();