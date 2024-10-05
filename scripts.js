document.addEventListener("DOMContentLoaded", () => {
  const addMedicineBtn = document.getElementById("add-medicine-btn");
  const medicineList = document.getElementById("medicine-list");

  const dateInput = document.getElementById("date");
  dateInput.value = new Date().toISOString().split("T")[0];

  addMedicineBtn.addEventListener("click", () => {
    fetch("addmedi.html")
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const medicineEntry = doc.querySelector(".medicine-entry");

        const uniqueId = Date.now();
        medicineEntry
          .querySelectorAll('.radio-group input[type="radio"]')
          .forEach((radio) => {
            radio.name = `time-${uniqueId}`;
          });

        medicineEntry.querySelector("button").addEventListener("click", () => {
          medicineEntry.remove();
        });

        medicineList.appendChild(medicineEntry);
      })
      .catch((error) => console.error("Error loading addmedi.html:", error));
  });
});

function getDosageValue(entry) {
  const dosageCheckboxes = entry.querySelectorAll(
    ".checkbox-group input[type='checkbox']"
  );
  const values = Array.from(dosageCheckboxes).map((checkbox) =>
    checkbox.checked ? "১" : "০"
  );
  return values.join("+");
}

function generatePrescription() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const sex = document.getElementById("sex").value;
  const date = document.getElementById("date").value;
  const cc = document.getElementById("cc-input").value;
  const medicines = Array.from(
    document.getElementsByClassName("medicine-entry")
  ).map((entry, index) => {
    const medicineName = entry.querySelector("input[name='medicine']").value;
    const dosage = getDosageValue(entry);
    const beforeEating = entry.querySelector("input[name='before-eating']")
      .checked
      ? "---খাওয়ার আগে---"
      : "";
    const afterEating = entry.querySelector("input[name='after-eating']")
      .checked
      ? "---খাওয়ার পরে---"
      : "";
    const eatingTime = beforeEating ? beforeEating : afterEating;
    // const days = entry.querySelector("input[name='days']").value;
    const days = convertToBengaliNumerals(
      entry.querySelector("input[name='days']").value
    );

    const eatWhenPain = entry.querySelector("input[name='eat-when-pain']")
      .checked
      ? "\nব্যাথা হলে খাবেন"
      : "";

    return `${
      index + 1
    }. ${medicineName}\n${dosage} ${eatingTime} ${days} দিন${eatWhenPain}`;
  });
  // Gather extra investigation and treatment details
  const investigationExtra = document.getElementById(
    "investigation-extra"
  ).value;
  const treatmentExtra = document.getElementById("treatment-extra").value;
  // Gather investigation details
  const investigationInputs = document.querySelectorAll(
    ".investigation-box input"
  );
  const investigationData = Array.from(investigationInputs)
    .map((input) => input.value)
    .join(" | ");

  // Gather treatment details
  const treatmentInputs = document.querySelectorAll(".treatment-box input");
  const treatmentData = Array.from(treatmentInputs)
    .map((input) => input.value)
    .join(" | ");

  const printWindow = window.open("print.html", "", "width=800,height=600");
  printWindow.onload = () => {
    printWindow.document.querySelector(".name").textContent = name;
    printWindow.document.querySelector(".age").textContent = age;
    printWindow.document.querySelector(".sex").textContent = sex;
    printWindow.document.querySelector(".date").textContent = new Date(
      date
    ).toLocaleDateString("en-GB");
    printWindow.document.querySelector(".cc").textContent = cc;
    printWindow.document.querySelector(".medicines").innerHTML = medicines
      .map((med) => `<div style="white-space: pre-line;">${med}</div>`)
      .join("");

    // Add extra investigation and treatment data to the print window
    printWindow.document.querySelector(".investigation-extra").textContent =
      investigationExtra;
    printWindow.document.querySelector(".treatment-extra").textContent =
      treatmentExtra;

    // Add investigation data to the print window
    const investigationDiv = document.createElement("div");
    investigationDiv.className = "investigation";
    investigationDiv.innerHTML = `
      <div class="quadrant">${investigationInputs[0].value || ""}</div>
      <div class="quadrant">${investigationInputs[1].value || ""}</div>
      <div class="quadrant">${investigationInputs[2].value || ""}</div>
      <div class="quadrant">${investigationInputs[3].value || ""}</div>
    `;
    printWindow.document.body.appendChild(investigationDiv);
    // Add treatment data to the print window
    const treatmentDiv = document.createElement("div");
    treatmentDiv.className = "treatment";
    treatmentDiv.innerHTML = `
      <div class="quadrant">${treatmentInputs[0].value || ""}</div>
      <div class="quadrant">${treatmentInputs[1].value || ""}</div>
      <div class="quadrant">${treatmentInputs[2].value || ""}</div>
      <div class="quadrant">${treatmentInputs[3].value || ""}</div>
    `;
    printWindow.document.body.appendChild(treatmentDiv);

    printWindow.print();
  };
}

function convertToBengaliNumerals(number) {
  const bengaliNumerals = "০১২৩৪৫৬৭৮৯";
  return number
    .toString()
    .split("")
    .map((digit) => bengaliNumerals[digit] || digit)
    .join("");
}
///
