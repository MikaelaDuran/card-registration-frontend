const tableBody = document.getElementById("dashboardTableBody");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let allData = []; // 서버에서 받아올 전체 데이터
let itemsShown = 10;

// 샘플 데이터 (나중에 백엔드 API 연결)
async function fetchCards() {
    // 실제 연결 시: const response = await fetch('http://localhost:8080/cards');
    // 지금은 테스트용 가짜 데이터
    allData = Array.from({ length: 25 }, (_, i) => ({
        cardId: `SL-${5000 + i}`,
        startDate: '2024.03.01',
        endDate: '2024.03.31',
        planType: i % 3 === 0 ? 'DAYS_365' : 'DAYS_30'
    }));
    renderTable();
}

function renderTable() {
    tableBody.innerHTML = "";
    const visibleData = allData.slice(0, itemsShown);

    visibleData.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${item.cardId}</strong></td>
            <td class="hide-on-mobile">${item.startDate}</td>
            <td class="hide-on-mobile">${item.endDate}</td>
            <td><span class="badge ${getBadgeClass(item.planType)}">${item.planType}</span></td>
        `;
        tableBody.appendChild(row);
    });

    if (itemsShown >= allData.length) {
        loadMoreBtn.style.display = "none";
    }
}

function getBadgeClass(type) {
    if (type === 'DAYS_365') return 'bg-success';
    if (type === 'DAYS_30') return 'bg-primary';
    return 'bg-secondary';
}

loadMoreBtn.addEventListener("click", () => {
    itemsShown += 10;
    renderTable();
});

// 초기 실행
fetchCards();