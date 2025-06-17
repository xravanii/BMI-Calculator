let bmiChart;

function drawChart(bmiCategory) {
  const categories = ["Underweight", "Normal weight", "Overweight", "Obese"];
  const data = categories.map(c => c === bmiCategory ? 1 : 0.01);

  if (bmiChart) bmiChart.destroy();

  const ctx = document.getElementById("bmiChart").getContext("2d");
  bmiChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{
        data: data,
        backgroundColor: ["#4fc3f7", "#81c784", "#ffb74d", "#e57373"],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "white"  // 👈 ensures label text under chart is white
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label === bmiCategory ? `${context.label} (You)` : context.label;
            }
          }
        }
      }
    }
  });
}

function calculateBMI() {
  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const heightInput = parseFloat(document.getElementById("height").value);
  const weightInput = parseFloat(document.getElementById("weight").value);
  const heightUnit = document.getElementById("height-unit").value;
  const weightUnit = document.getElementById("weight-unit").value;
  const bmiDisplay = document.getElementById("bmi-display");
  const result = document.getElementById("result");
  const tips = document.getElementById("tips");
  const risk = document.getElementById("risk");

  if (!age || age <= 0 || !gender) {
    result.textContent = "Please enter a valid age and select gender.";
    bmiDisplay.textContent = "";
    return;
  }

  if (!heightInput || !weightInput || heightInput <= 0 || weightInput <= 0) {
    result.textContent = "Please enter valid height and weight!";
    bmiDisplay.textContent = "";
    return;
  }

  let heightInMeters;
  if (heightUnit === "cm") heightInMeters = heightInput / 100;
  else if (heightUnit === "in") heightInMeters = heightInput * 0.0254;
  else if (heightUnit === "ft") heightInMeters = heightInput * 0.3048;

  const weightInKg = weightUnit === "kg" ? weightInput : weightInput * 0.453592;
  const bmi = (weightInKg / Math.pow(heightInMeters, 2)).toFixed(2);

  let category = "";
  let advice = "";
  if (bmi < 18.5) {
    category = "Underweight";
    advice = "Consider a balanced, calorie-rich diet.";
  } else if (bmi < 25) {
    category = "Normal weight";
    advice = "Maintain your healthy lifestyle!";
  } else if (bmi < 30) {
    category = "Overweight";
    advice = "Try regular exercise and healthier meals.";
  } else {
    category = "Obese";
    advice = "Consult a doctor or dietitian for guidance.";
  }

  const minWeight = (18.5 * heightInMeters ** 2).toFixed(1);
  const maxWeight = (24.9 * heightInMeters ** 2).toFixed(1);

  bmiDisplay.textContent = `${bmi}`;
  result.innerHTML = `Category: <strong>${category}</strong><br>${advice}<br>Ideal weight: <strong>${minWeight}kg – ${maxWeight}kg</strong>`;

  const riskText = (bmi >= 30 || (bmi >= 25 && age > 45))
    ? "Higher risk of heart disease or diabetes. Consider medical advice."
    : "Low health risks. Maintain a healthy routine.";
  risk.textContent = `Health Risk: ${riskText}`;

  const tipBank = {
    "Underweight": "Include more protein, carbs, and frequent meals.",
    "Normal weight": "Great! Keep balanced diet and regular exercise.",
    "Overweight": "Cut down on sugars and fried food, increase physical activity.",
    "Obese": "Avoid processed foods and consult a professional."
  };
  tips.innerHTML = `<br><strong>Tip:</strong> ${tipBank[category]}`;

  drawChart(category);
}

document.getElementById("theme").addEventListener("change", function () {
  const selectedTheme = this.value;
  document.body.className = `theme-${selectedTheme}`;
  localStorage.setItem("bmiTheme", selectedTheme);
});

window.onload = function () {
  const savedTheme = localStorage.getItem("bmiTheme") || "default";
  document.getElementById("theme").value = savedTheme;
  document.body.className = `theme-${savedTheme}`;
};
