async function createEmployeesDataTable() {
    const url = "https://sample-apis-sigma.vercel.app/api/dipendenti";
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
        var json = await response.json();
        console.log(json);

        const employeeCategory = getQueryParameter("employeeCategory");

        const higherEmployees = getHigherEmployees(json, employeeCategory);
        console.log(higherEmployees);

        json = filterJsonByEmployeeCategory(json, employeeCategory);

        json.forEach(employee => {
            getReferenceName(employee, higherEmployees)
        });
        console.log(json)

        const table = new DataTable("#employeesTable", {
        "columns": [
            { "data": "categoria" },
            { "data": "nome" },
            { "data": "cognome" },
            { "data": "dataAssunzione" },
            { "data": "nomeRiferimento" }
        ],
        data: json
        });

        function updateColumnVisibility() {
            const isSmall = window.innerWidth < 768;
            const isVerySmall = window.innerWidth < 460

            table.column(3).visible(!isSmall);
            table.column(1).visible(!isVerySmall);
        }

        updateColumnVisibility();
        window.addEventListener("resize", updateColumnVisibility);

    } catch (error) {
        console.error(error.message);
    }
}

function getReferenceName(employee, higherEmployees) {
    if (employee.categoria != "dirigente") {
        higherEmployees.forEach(higherEmployee => {
            if (higherEmployee.codiceFiscale === employee.nomeRiferimento) {
                employee.nomeRiferimento = higherEmployee.nome + " " + higherEmployee.cognome;
                return employee;
            }
        });
    }
    else {
        return employee;
    }
    
}

function filterJsonByEmployeeCategory(json, employeeCategory) {
    if (employeeCategory) {
        if (employeeCategory === "leggende") {
            const newJson = json.filter(employee => new Date(changeDateFormat(employee.dataAssunzione)) < new Date("2001-01-01"));
            return newJson;
        }
        else {
            const newJson = json.filter(employee => employee.categoria === employeeCategory);
            return newJson;
        }
    }
    else {
        return json;
    }
}

function getHigherEmployees(json, employeeCategory) {
    if (employeeCategory) {
        if (employeeCategory === "tecnico") {
            const higherEmployees = json.filter(employee => employee.categoria === "manager");
            return higherEmployees;
        }
        else if (employeeCategory === "manager") {
            const higherEmployees = json.filter(employee => employee.categoria === "dirigente");
            return higherEmployees;
        }
        else {
            return json;
        }
    }
    else {
        return json;
    }
}

function changeDateFormat(dataAssunzione) {
    const splittedDataAssunzione = dataAssunzione.split("/");

    const nuovaData = splittedDataAssunzione[2] + "-" + splittedDataAssunzione[1] + "-" + splittedDataAssunzione[0];
    return nuovaData;
}

function getQueryParameter (parameterName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

function sendWarningLetter() {
    const employeeFirstName = document.getElementById("employeeFirstName").value
    const employeeLastName = document.getElementById("employeeLastName").value
    const employeeEmail = document.getElementById("employeeEmail").value
    const warningLetterText = document.getElementById("warningLetterText").value
    if (employeeFirstName.trim() && employeeLastName.trim() && employeeEmail.trim() && warningLetterText.trim()) {
        alert("Lettera di richiamo inviata!");
    }
    else {
        return;
    }
}