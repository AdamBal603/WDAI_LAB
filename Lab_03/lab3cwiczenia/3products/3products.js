let originalData = [];
let displayedData = [];

// Pobranie danych z API
fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {
        originalData = data.products.slice(0, 30);
        displayedData = [...originalData];
        renderTable();
    });

function renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    displayedData.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><img src="${item.thumbnail}" /></td>
            <td>${item.title}</td>
            <td>${item.description}</td>
        `;

        tbody.appendChild(row);
    });
}

// Filtrowanie
document.getElementById("filterInput").addEventListener("input", function () {
    const text = this.value.toLowerCase();

    displayedData = originalData.filter(item =>
        item.title.toLowerCase().includes(text) ||
        item.description.toLowerCase().includes(text)
    );

    applySorting();
    renderTable();
});

// Sortowanie
document.getElementById("sortSelect").addEventListener("change", function () {
    applySorting();
    renderTable();
});

function applySorting() {
    const mode = document.getElementById("sortSelect").value;

    if (mode === "asc") {
        displayedData.sort((a, b) => a.title.localeCompare(b.title));
    }
    else if (mode === "desc") {
        displayedData.sort((a, b) => b.title.localeCompare(a.title));
    }
    else {
        displayedData = [...originalData]; // oryginał
    }

    // po sortowaniu zachowaj też wynik filtra
    const filterText = document.getElementById("filterInput").value.toLowerCase();
    if (filterText) {
        displayedData = displayedData.filter(item =>
            item.title.toLowerCase().includes(filterText) ||
            item.description.toLowerCase().includes(filterText)
        );
    }
}