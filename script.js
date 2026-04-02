const cardNumberInput = document.getElementById("cardNumber");
const cardPreviewNumber = document.getElementById("cardPreviewNumber");
const periodSelect = document.getElementById("periodSelect");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const dateResult = document.getElementById("dateResult");
const cardDate = document.getElementById("cardDate");
const cardForm = document.getElementById("cardForm");
const statusMessage = document.getElementById("statusMessage");

// Mappar enum-värden (från backend) till antal dagar. Detta används bara i frontend för att räkna ut datum
const planDaysMap = {
  DAYS_7: 7,
  DAYS_30: 30,
  DAYS_90: 90,
  DAYS_365: 365,
};

// =======================
// FORMATERA KORTNUMMER
// =======================
cardNumberInput.addEventListener("input", function () {
  // Tar bort allt som inte är siffror
  let value = this.value.replace(/\D/g, "");

  // Begränsar till max 16 siffror
  value = value.substring(0, 16);

  // Delar upp i grupper om 4 siffror (1234 5678 1234 5678)
  let formattedValue = value.match(/.{1,4}/g)?.join(" ") || "";

  // Sätter tillbaka det formaterade värdet i inputfältet
  this.value = formattedValue;

  // Visar kortnumret på "fake-kortet"
  // Om inget är skrivet visas placeholder
  cardPreviewNumber.textContent = formattedValue || "XXXX XXXX XXXX XXXX";
});

// =======================
// NÄR ANVÄNDAREN VÄLJER PERIOD
// =======================
periodSelect.addEventListener("change", function () {
  // Hämtar enum-värdet (t.ex. DAYS_30)
  const planType = this.value;

  // Hämtar antal dagar baserat på enum
  const days = planDaysMap[planType];

  // Om inget valts → rensa UI
  if (!days) {
    dateResult.textContent = "";
    cardDate.textContent = "DATE";
    statusMessage.textContent = "";
    return;
  }

  // Skapar dagens datum
  const today = new Date();

  // Skapar slutdatum genom att lägga till antal dagar
  const endDate = new Date();
  endDate.setDate(today.getDate() + days);

  // Funktion för att formatera datum: YYYY.MM.DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  // Start- och slutdatum
  const start = formatDate(today);
  const end = formatDate(endDate);

  // Kombinerar till periodtext
  const periodText = `${start} - ${end}`;

  // Visar under formuläret
  dateResult.textContent = periodText;

  // Visar på kortet
  cardDate.textContent = periodText;

  // Rensar tidigare statusmeddelande
  statusMessage.textContent = "";
});

// =======================
// NÄR FORMULÄRET SKICKAS
// =======================
cardForm.addEventListener("submit", async function (event) {
  // Stoppar sidan från att reloadas
  event.preventDefault();

  // Hämtar kortnummer och tar bort mellanslag
  const cardId = cardNumberInput.value.replace(/\s/g, "").trim();

  // Hämtar enum-värdet (t.ex. DAYS_30)
  const planType = periodSelect.value;

  // Hämtar namn
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();

  // Validering – kolla att alla fält är ifyllda
  if (!cardId || !planType || !firstName || !lastName) {
    statusMessage.textContent = "Please fill in all fields.";
    statusMessage.style.color = "red";
    return;
  }

  // Skapar objektet som ska skickas till backend
  // Detta måste matcha din Java record exakt
  const requestBody = {
    cardId: cardId,
    planType: planType,
    firstName: firstName,
    lastName: lastName,
  };

  try {
    // Skickar POST-request till backend
    const response = await fetch("http://localhost:30080/cards/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // talar om att vi skickar JSON
      },
      body: JSON.stringify(requestBody), // konverterar JS-objekt → JSON
    });

    // Om backend svarar med error (t.ex. 400/500)
    if (!response.ok) {
      const errorText = await response.text();

      statusMessage.textContent = `Registration failed: ${errorText}`;
      statusMessage.style.color = "red";
      return;
    }

    // Om allt gick bra
    statusMessage.textContent = "Card has been registered successfully.";
    statusMessage.style.color = "green";

    // Rensar formuläret
    cardForm.reset();

    // Återställer UI
    cardPreviewNumber.textContent = "XXXX XXXX XXXX XXXX";
    cardDate.textContent = "DATE";
    dateResult.textContent = "";
  } catch (error) {
    // Om backend inte nås (t.ex. servern är nere)
    statusMessage.textContent = "Could not connect to backend.";
    statusMessage.style.color = "red";

    console.error(error);
  }
});
