// --- CONFIG ---
const API_BASE = "http://127.0.0.1:5000"; // backend base URL

// --- DOM ---
const openCalcBtn = document.getElementById("open-calculator");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const calcBtn = document.getElementById("calc-btn");
const donateBtn = document.getElementById("donate-btn");
const resetBtn = document.getElementById("reset-btn");
const amountInput = document.getElementById("amount");
const causeSelect = document.getElementById("cause");
const resultBox = document.getElementById("result");
const totalAmountEl = document.getElementById("total-amount");
const totalCountEl = document.getElementById("total-count");
const lastDonationEl = document.getElementById("last-donation");
const thanksModal = document.getElementById("thanks");
const thanksMsg = document.getElementById("thanks-msg");
const thanksClose = document.getElementById("thanks-close");
const globalChartEl = document.getElementById("globalChart");

document.getElementById("scroll-to-calc").addEventListener("click", () => openModal());
openCalcBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", () => closeModalFn());
thanksClose.addEventListener("click", () => closeThanks());

calcBtn.addEventListener("click", calculateImpact);
resetBtn.addEventListener("click", resetForm);
donateBtn.addEventListener("click", donateNow);

let globalChart;

// --- UTILS ---
function openModal(){
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden","false");
}
function closeModalFn(){
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden","true");
}
function openThanks(){
  thanksModal.classList.remove("hidden");
  thanksModal.setAttribute("aria-hidden","false");
}
function closeThanks(){
  thanksModal.classList.add("hidden");
  thanksModal.setAttribute("aria-hidden","true");
}
function formatINR(n){
  return "₹" + Number(n).toLocaleString("en-IN");
}

// --- Impact logic ---
function calculateImpact(){
  const amount = parseFloat(amountInput.value);
  const cause = causeSelect.value;
  if (!amount || amount <= 0){
    resultBox.innerHTML = "⚠️ कृपया सही राशि डालें (amount > 0).";
    return;
  }

  let impactText;
  if (cause === "food"){
    const meals = Math.floor(amount / 50);
    impactText = `🍱 ${meals} meals (approx)`;
  } else if (cause === "education"){
    const students = Math.floor(amount / 200);
    impactText = `🎒 ${students} students supported (materials)`;
  } else {
    const treatments = Math.floor(amount / 300);
    impactText = `💊 ${treatments} basic treatments`;
  }
  resultBox.innerHTML = `<span style="color:#0b1220">${impactText}</span>`;
}

// --- Reset ---
function resetForm(){
  amountInput.value = "";
  causeSelect.value = "food";
  resultBox.innerHTML = "";
}

// --- Donate: POST to backend ---
async function donateNow(){
  const amount = parseFloat(amountInput.value);
  const cause = causeSelect.value;
  if (!amount || amount <= 0){
    alert("Please enter a valid amount before donating.");
    return;
  }

  donateBtn.disabled = true;
  donateBtn.textContent = "Processing...";

  try {
    const res = await fetch(`${API_BASE}/donate`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ amount, cause })
    });
    const data = await res.json();
    if (res.ok){
      // show thank you
      thanksMsg.innerHTML = data.message;
      openThanks();
      // refresh stats
      await loadStats();
      resetForm();
      closeModalFn();
    } else {
      alert(data.message || "Server error");
    }
  } catch (err){
    alert("Could not reach the server. Make sure backend is running.");
    console.error(err);
  } finally {
    donateBtn.disabled = false;
    donateBtn.textContent = "Donate Now";
  }
}

// --- Stats & Chart ---
async function loadStats(){
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    // data: { total_amount, count, last, by_cause }
    totalAmountEl.textContent = formatINR(data.total_amount || 0);
    totalCountEl.textContent = data.count || 0;
    lastDonationEl.textContent = data.last ? `${data.last.amount} on ${data.last.date}` : "—";

    // chart
    const labels = Object.keys(data.by_cause);
    const values = Object.values(data.by_cause);
    if (globalChart) globalChart.destroy();
    globalChart = new Chart(globalChartEl, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data: values }]
      },
      options: { plugins:{legend:{position:'bottom'}} }
    });
  } catch (err){
    console.error("Stats load failed", err);
  }
}

// initial load
loadStats();
