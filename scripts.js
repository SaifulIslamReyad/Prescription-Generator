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

    return `${index + 1}. ${medicineName}\n${dosage} ${eatingTime} ${days} দিন`;
  });

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
    printWindow.print();
  };
}
/////

function convertToBengaliNumerals(number) {
  const bengaliNumerals = "০১২৩৪৫৬৭৮৯";
  return number
    .toString()
    .split("")
    .map((digit) => bengaliNumerals[digit] || digit)
    .join("");
}
