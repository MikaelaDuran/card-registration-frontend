const tableBody = document.getElementById("dashboardTableBody");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let allData = [];
let itemsShown = 10;

async function fetchCards() {
  try {
    const response = await fetch("http://localhost:8080/cards");

    if (!response.ok) {
      throw new Error(
        "Error fetching data from server: " + response.statusText,
      );
    }

    allData = await response.json();

    renderTable();
  } catch (error) {
    console.error("Failed to load data:", error);
    tableBody.innerHTML =
      "<tr><td colspan='4' class='text-center'>Failed to load data from server.</td></tr>";
  }
}

function renderTable() {
  tableBody.innerHTML = "";
  const visibleData = allData.slice(0, itemsShown);

  visibleData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><strong>${item.cardId}</strong></td>
            <td class="hide-on-mobile">${item.startDate}</td>
            <td class="hide-on-mobile">${item.endDate}</td>
            <td><span class="badge ${item.planType.includes("365") ? "bg-success" : "bg-primary"}">${item.planType}</span></td>
        `;
    tableBody.appendChild(row);
  });

  if (itemsShown >= allData.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}

loadMoreBtn.addEventListener("click", () => {
  itemsShown += 10;
  renderTable();
});

fetchCards();
