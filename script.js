const cardNumberInput = document.getElementById("cardNumber");
const cardPreviewNumber = document.getElementById("cardPreviewNumber");
const periodSelect = document.getElementById("periodSelect");
const dateResult = document.getElementById("dateResult");
const cardDate = document.getElementById("cardDate");
const cardForm = document.getElementById("cardForm");
const statusMessage = document.getElementById("statusMessage");

// Formatera kortnummer: 1234567812345678 -> 1234 5678 1234 5678
cardNumberInput.addEventListener("input", function () {
  let value = this.value.replace(/\D/g, ""); // bara siffror
  value = value.substring(0, 16); // max 16 siffror

  let formattedValue = value.match(/.{1,4}/g)?.join(" ") || "";
  this.value = formattedValue;

  // Visa på fake-kortet
  if (formattedValue.length > 0) {
    cardPreviewNumber.textContent = formattedValue;
  } else {
    cardPreviewNumber.textContent = "XXXX XXXX XXXX XXXX";
  }
});

// Uppdatera datum när man väljer period
periodSelect.addEventListener("change", function () {
  const days = parseInt(this.value);

  if (!days) {
    dateResult.textContent = "";
    cardDate.textContent = "DATE";
    statusMessage.textContent = "";
    return;
  }

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + days);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  const start = formatDate(today);
  const end = formatDate(endDate);
  const periodText = `${start} - ${end}`;

  // Visa under formuläret
  dateResult.textContent = periodText;

  // Visa på fake-kortet
  cardDate.textContent = periodText;

  statusMessage.textContent = "";
});

// Submit-knapp
cardForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const cardNumber = cardNumberInput.value.trim();
  const selectedPeriod = dateResult.textContent.trim();

  if (!cardNumber || !selectedPeriod) {
    statusMessage.textContent = "Please enter card number and choose a period.";
    statusMessage.style.color = "red";
    return;
  }

  const existingPeriod = localStorage.getItem(cardNumber);

  if (existingPeriod) {
    statusMessage.textContent = `This card is already registered for period: ${existingPeriod}`;
    statusMessage.style.color = "red";
  } else {
    localStorage.setItem(cardNumber, selectedPeriod);
    statusMessage.textContent = "Card has been registered successfully.";
    statusMessage.style.color = "green";
  }
});
