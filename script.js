document.addEventListener("DOMContentLoaded", function () {

    // Load table data from local storage based on the current course
    var currentCourse = getCurrentCourse();
    loadTableData(currentCourse);

    // Load the course name from local storage during the DOMContentLoaded event
    loadCourseName();

    // Attach event listeners for input elements after loading data
    attachEventListeners();

    // Calculate and display the average after loading data
    calculateAndDisplayAverage();
});

// Function to attach event listeners for input elements
function attachEventListeners() {
    // Add event listener for the grade input elements
    var gradeInputs = document.querySelectorAll('#assessmentTable input[placeholder="Grade"]');
    gradeInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            validateGrade(this);
            saveTableData(); // Save data on grade input change
        });
    });

    // Add event listener for the weight input elements
    var weightInputs = document.querySelectorAll('#assessmentTable input[placeholder="Weight"]');
    weightInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            validateWeight(this);
            saveTableData(); // Save data on weight input change
        });
    });
}

// Function to add a new row to the table
function addRow() {
    var table = document.getElementById("assessmentTable");
    var rowCount = table.rows.length;

    // Check if the total weight is already 100
    var totalWeight = calculateTotalWeight();
    if (totalWeight > 100) {
        alert("Total weight cannot exceed 100.");
        return;
    }

    // Add a new row to the table
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.innerHTML = '<input type="text" placeholder="Assessment">';
    cell2.innerHTML = '<input type="text" placeholder="Grade">';
    cell3.innerHTML = '<input type="text" placeholder="Weight" oninput="validateWeight(this)">';
    cell4.innerHTML = '<button onclick="clearRow(this)">Clear</button>';
    cell5.innerHTML = '<button onclick="deleteRow(this)">Remove</button>';
    
    // Save table data to local storage after adding a row
    saveTableData();
}

// Function to clear a row in the table
function clearRow(button) {
    var row = button.parentNode.parentNode;
    var cells = row.getElementsByTagName("input");

    // Clear input values
    for (var i = 0; i < cells.length; i++) {
        cells[i].value = "";
    }

    // Update total weight after clearing a row
    updateTotalWeight();

    // Save table data to local storage after clearing a row
    saveTableData();
}

// Function to delete a row from the table
function deleteRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    // Update total weight after removing a row
    updateTotalWeight();

    // Save table data to local storage after removing a row
    saveTableData();
}

// Function to calculate the total weight of all rows
function calculateTotalWeight() {
    var table = document.getElementById("assessmentTable");
    var rows = table.getElementsByTagName("tr");
    var totalWeight = 0;

    for (var i = 1; i < rows.length; i++) {
        var weightInput = rows[i].getElementsByTagName("input")[2];
        totalWeight += parseFloat(weightInput.value) || 0;
    }
    return totalWeight;
}

// Function to validate the weight input
function validateWeight(input) {
    var value = parseFloat(input.value) || 0;

    // Ensure the value is between 0 and 100
    if (value < 0) {
        input.value = 0;
    } else if (value > 100) {
        input.value = 100;
    }

    // Update total weight after input change
    updateTotalWeight();

    // Save table data to local storage after input change
    saveTableData();

    // Calculate and display the average after input change
    calculateAndDisplayAverage();
}

// Function to validate the grade input
function validateGrade(input) {
    var value = parseFloat(input.value) || 0;

    // Ensure the value is between 0 and 100
    if (value < 0) {
        input.value = 0;
    } else if (value > 100) {
        input.value = 100;
    }

    // Calculate and display the average after input change
    calculateAndDisplayAverage();
}

// Function to update the total weight display
function updateTotalWeight() {
    var totalWeight = calculateTotalWeight();
    console.log("Total Weight:", totalWeight);
}

// Function to calculate and display the average, letter grade, and GPA
function calculateAndDisplayAverage() {
    var table = document.getElementById("assessmentTable");
    var rows = table.getElementsByTagName("tr");
    var total = 0;
    var totalWeight = 0;

    // Add event listener for the grade input elements
    var gradeInputs = document.querySelectorAll('#assessmentTable input[placeholder="Grade"]');
    gradeInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            validateGrade(this);
        });
    });

    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("input");
        var grade = parseFloat(cells[1].value) || 0;
        var weight = parseFloat(cells[2].value) || 0;

        total += (grade * weight / 100);
        totalWeight += weight;
    }

    var average = totalWeight > 0 ? total / totalWeight * 100 : 0;
    console.log("Average:", average);

    // Calculate letter grade and GPA based on the specified criteria
    var letterGrade, gpa;

    if (average >= 90) {
        letterGrade = "A+";
        gpa = 4.3;
    } else if (average >= 85) {
        letterGrade = "A";
        gpa = 4.0;
    } else if (average >= 80) {
        letterGrade = "A-";
        gpa = 3.7;
    } else if (average >= 77) {
        letterGrade = "B+";
        gpa = 3.3;
    } else if (average >= 73) {
        letterGrade = "B";
        gpa = 3.0;
    } else if (average >= 70) {
        letterGrade = "B-";
        gpa = 2.7;
    } else if (average >= 67) {
        letterGrade = "C+";
        gpa = 2.3;
    } else if (average >= 60) {
        letterGrade = "C";
        gpa = 2.0;
    } else if (average >= 50) {
        letterGrade = "D";
        gpa = 1.0;
    } else {
        letterGrade = "F";
        gpa = 0;
    }

    // Display the average, letter grade, and GPA
    var percentageAverage = average.toFixed(2) + "%";
    document.getElementById("averageDisplay").innerText =
    "Average: " + percentageAverage +
    "\nLetter Grade: " + letterGrade +
    "\nGPA: " + gpa;
}

// Function to save table data to local storage
function saveTableData() {
    console.log("Current Course (Save):", currentCourse);
    var currentCourse = getCurrentCourse();
    var tableData = [];
    var table = document.getElementById("assessmentTable");
    var rows = table.getElementsByTagName("tr");

    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("input");
        var rowData = {
        assessment: cells[0].value,
        grade: cells[1].value,
        weight: cells[2].value
        };
    tableData.push(rowData);
    }

    // Save data to local storage with a key based on the current course
    localStorage.setItem("assessmentTableData_" + currentCourse, JSON.stringify(tableData));

    // Calculate and display the average after saving data
    calculateAndDisplayAverage();
}

function loadTableData(course) {
    console.log("Current Course (Load):", course);
    var tableDataString = localStorage.getItem("assessmentTableData_" + course);

    if (tableDataString) {
        var tableData = JSON.parse(tableDataString);
        var table = document.getElementById("assessmentTable");

        // Clear existing rows before loading data
        clearTableRows(table);

        tableData.forEach(function (rowData) {
            var row = table.insertRow(table.rows.length);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);

            cell1.innerHTML = '<input type="text" value="' + rowData.assessment + '" placeholder="Assessment">';
            cell2.innerHTML = '<input type="text" value="' + rowData.grade + '" placeholder="Grade">';
            cell3.innerHTML = '<input type="text" value="' + rowData.weight + '" placeholder="Weight" oninput="validateWeight(this)">';
            cell4.innerHTML = '<button onclick="clearRow(this)">Clear</button>';
            cell5.innerHTML = '<button onclick="deleteRow(this)">Remove</button>';
        });

        // Attach event listener for the grade input elements
        var gradeInputs = document.querySelectorAll('#assessmentTable input[placeholder="Grade"]');
        gradeInputs.forEach(function (input) {
            input.addEventListener('input', function () {
                validateGrade(this);
                saveTableData(); // Save data on grade input change
            });
        });

        // Attach event listener for the weight input elements
        var weightInputs = document.querySelectorAll('#assessmentTable input[placeholder="Weight"]');
        weightInputs.forEach(function (input) {
            input.addEventListener('input', function () {
                validateWeight(this);
                saveTableData(); // Save data on weight input change
            });
        });

        // Calculate and display the average after loading data
        calculateAndDisplayAverage();

        // Call validateGrade and validateWeight to ensure correct behavior on page load
        gradeInputs.forEach(function (input) {
            validateGrade(input);
        });

        weightInputs.forEach(function (input) {
            validateWeight(input);
        });
    }
}

// Function to clear existing rows in the table
function clearTableRows(table) {
    var rowCount = table.rows.length;

    // Remove rows starting from the second row
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

// Function to change and save the course name
function changeCourseName() {
    var courseNameInput = document.getElementById("courseNameInput");
    var courseTitle = document.getElementById("courseTitle");

    // Get the entered course name
    var newCourseName = courseNameInput.value.trim();

    // Update the course name if it's not empty
    if (newCourseName !== "") {
        courseTitle.innerText = newCourseName;
        courseNameInput.value = ""; // Clear the input field
        saveCourseName(newCourseName); // Save the course name to local storage
    }
}

// Function to handle "Enter" key press
function handleEnterKey(event) {
    if (event.key === "Enter") {
        changeCourseName();
    }
}

// Function to get the current course
function getCurrentCourse() {
    // Use the page title as a unique identifier for each course
    var pageTitle = document.title.trim();

    // Use a default course name if the page title is empty
    return pageTitle || "defaultCourseName";
}

// Function to save the course name to local storage
function saveCourseName(courseName) {
    // Use the page title as a unique identifier for each course
    var pageTitle = document.title.trim();

    // Save the course name to local storage with a key based on the page title
    localStorage.setItem("courseName_" + pageTitle, courseName);
}

// Function to load the course name from local storage
function loadCourseName() {
    // Use the page title as a unique identifier for each course
    var pageTitle = document.title.trim();

    var courseName = localStorage.getItem("courseName_" + pageTitle);
    var courseTitle = document.getElementById("courseTitle");

    if (courseName) {
        courseTitle.innerText = courseName;
    }
}

// Add the following line to the "DOMContentLoaded" event to load the course name
loadCourseName();