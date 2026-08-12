// Sample equipment data

let equipment = JSON.parse(localStorage.getItem("equipment")) || [

    {
        id: 1,
        name: "Wheelchair",
        category: "Mobility",
        price: 300,
        status: "Available"
    },

    {
        id: 2,
        name: "Oxygen Concentrator",
        category: "Respiratory",
        price: 800,
        status: "Available"
    },

    {
        id: 3,
        name: "Hospital Bed",
        category: "Furniture",
        price: 1000,
        status: "Available"
    },

    {
        id: 4,
        name: "Nebulizer",
        category: "Respiratory",
        price: 250,
        status: "Available"
    }

];


// Rental data

let rentals = JSON.parse(localStorage.getItem("rentals")) || [];


// Save data

function saveData() {

    localStorage.setItem(
        "equipment",
        JSON.stringify(equipment)
    );

    localStorage.setItem(
        "rentals",
        JSON.stringify(rentals)
    );
}


// Page navigation

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {

        page.classList.add("hidden");

    });

    document.getElementById(pageName).classList.remove("hidden");

    displayEquipment();
    displayRentals();
    updateDashboard();
    updateEquipmentSelect();
}


// Add equipment

document.getElementById("equipmentForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    let name =
        document.getElementById("equipmentName").value;

    let category =
        document.getElementById("category").value;

    let price =
        Number(document.getElementById("price").value);


    let newEquipment = {

        id: equipment.length > 0
            ? Math.max(...equipment.map(e => e.id)) + 1
            : 1,

        name: name,

        category: category,

        price: price,

        status: "Available"

    };


    equipment.push(newEquipment);

    saveData();

    this.reset();

    displayEquipment();

    updateDashboard();

    updateEquipmentSelect();

    alert("Equipment added successfully!");

});


// Display equipment

function displayEquipment() {

    let table =
        document.getElementById("equipmentTable");

    let search =
        document.getElementById("search").value
        .toLowerCase();


    table.innerHTML = "";


    equipment
        .filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search)
        )
        .forEach(item => {

            table.innerHTML += `

            <tr>

                <td>${item.id}</td>

                <td>${item.name}</td>

                <td>${item.category}</td>

                <td>₹${item.price}</td>

                <td>

                    <span class="${
                        item.status === "Available"
                        ? "available"
                        : "rented"
                    }">

                        ${item.status}

                    </span>

                </td>

                <td>

                    <button
                        class="delete"
                        onclick="deleteEquipment(${item.id})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

}


// Delete equipment

function deleteEquipment(id) {

    let item =
        equipment.find(e => e.id === id);


    if (item.status === "Rented") {

        alert(
            "This equipment is currently rented."
        );

        return;
    }


    if (confirm("Are you sure you want to delete this equipment?")) {

        equipment =
            equipment.filter(e => e.id !== id);

        saveData();

        displayEquipment();

        updateDashboard();

        updateEquipmentSelect();

    }

}


// Equipment selection

function updateEquipmentSelect() {

    let select =
        document.getElementById("equipmentSelect");

    select.innerHTML =
        `<option value="">Select Equipment</option>`;


    equipment
        .filter(e => e.status === "Available")
        .forEach(item => {

            select.innerHTML += `

                <option value="${item.id}">

                    ${item.name} - ₹${item.price}/day

                </option>

            `;

        });

}


// Rent equipment

document.getElementById("rentalForm")
.addEventListener("submit", function(event) {

    event.preventDefault();


    let equipmentId =
        Number(
            document.getElementById("equipmentSelect").value
        );


    let patient =
        document.getElementById("patientName").value;


    let phone =
        document.getElementById("phone").value;


    let days =
        Number(
            document.getElementById("days").value
        );


    let item =
        equipment.find(e => e.id === equipmentId);


    if (!item) {

        alert("Please select equipment.");

        return;
    }


    let amount =
        item.price * days;


    let rental = {

        id: rentals.length > 0
            ? Math.max(...rentals.map(r => r.id)) + 1
            : 1,

        patient: patient,

        phone: phone,

        equipmentId: equipmentId,

        equipmentName: item.name,

        days: days,

        amount: amount,

        status: "Active",

        date: new Date().toLocaleDateString()

    };


    rentals.push(rental);

    item.status = "Rented";


    saveData();

    this.reset();

    displayRentals();

    displayEquipment();

    updateDashboard();

    updateEquipmentSelect();


    alert(
        "Equipment rented successfully!\nTotal Amount: ₹"
        + amount
    );

});


// Display rental history

function displayRentals() {

    let table =
        document.getElementById("rentalTable");

    table.innerHTML = "";


    rentals.forEach(rental => {

        table.innerHTML += `

        <tr>

            <td>${rental.id}</td>

            <td>${rental.patient}</td>

            <td>${rental.phone}</td>

            <td>${rental.equipmentName}</td>

            <td>${rental.days}</td>

            <td>₹${rental.amount}</td>

            <td>

                <span class="${
                    rental.status === "Active"
                    ? "rented"
                    : "available"
                }">

                    ${rental.status}

                </span>

            </td>

            <td>

                ${
                    rental.status === "Active"

                    ?

                    `<button
                        class="return"
                        onclick="returnEquipment(${rental.id})">

                        Return

                    </button>`

                    :

                    "Returned"
                }

            </td>

        </tr>

        `;

    });

}


// Return equipment

function returnEquipment(rentalId) {

    let rental =
        rentals.find(r => r.id === rentalId);


    if (!rental) return;


    let item =
        equipment.find(
            e => e.id === rental.equipmentId
        );


    if (item) {

        item.status = "Available";

    }


    rental.status = "Returned";


    saveData();

    displayRentals();

    displayEquipment();

    updateDashboard();

    updateEquipmentSelect();


    alert("Equipment returned successfully!");

}


// Dashboard

function updateDashboard() {

    let total =
        equipment.length;


    let available =
        equipment.filter(
            e => e.status === "Available"
        ).length;


    let rented =
        equipment.filter(
            e => e.status === "Rented"
        ).length;


    let revenue =
        rentals.reduce(
            (total, rental) =>
                total + rental.amount,
            0
        );


    document.getElementById(
        "totalEquipment"
    ).innerText = total;


    document.getElementById(
        "availableEquipment"
    ).innerText = available;


    document.getElementById(
        "rentedEquipment"
    ).innerText = rented;


    document.getElementById(
        "revenue"
    ).innerText =
        "₹" + revenue.toLocaleString("en-IN");

}


// Load application

displayEquipment();

displayRentals();

updateDashboard();

updateEquipmentSelect();