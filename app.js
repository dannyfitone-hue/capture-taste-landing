
const cards = document.querySelectorAll(".package-card");
const packageField = document.getElementById("packageField");
const selectedLabel = document.getElementById("selectedPackageLabel");
const booking = document.getElementById("booking");
const form = document.getElementById("bookingForm");
const statusEl = document.getElementById("formStatus");
const submitButton = form.querySelector('button[type="submit"]');
let submitting = false;

document.querySelectorAll(".select-package").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".package-card");
    const pkg = card.dataset.package;
    packageField.value = pkg;
    selectedLabel.textContent = pkg;
    cards.forEach(c => c.classList.remove("chosen"));
    card.classList.add("chosen");
    booking.scrollIntoView({behavior:"smooth"});
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitting) return;
  if (!packageField.value) {
    statusEl.textContent = "Please choose a package first.";
    statusEl.className = "form-status error";
    document.getElementById("packages").scrollIntoView({behavior:"smooth"});
    return;
  }

  statusEl.textContent = "Submitting your booking...";
  statusEl.className = "form-status";
  submitting = true;
  if (submitButton) submitButton.disabled = true;

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch("/api/book", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok !== true) throw new Error(json.error || "Could not submit your request. Please try again or email rl.footage.orangecounty@gmail.com.");

    statusEl.textContent = json.customerEmailSent
      ? "Your booking request has been sent to RL Footage. Please check your email (including spam) for your booking summary and next steps."
      : "Your booking request has been sent to RL Footage. We couldn't send your email copy, but our team will contact you using the details you provided. You do not need to submit again.";
    statusEl.className = "form-status success";
    form.reset();
    packageField.value = "";
    selectedLabel.textContent = "Choose a package above";
    cards.forEach(c => c.classList.remove("chosen"));
  } catch (err) {
    statusEl.textContent = err.message || "Something went wrong. Please email rl.footage.orangecounty@gmail.com.";
    statusEl.className = "form-status error";
  } finally {
    submitting = false;
    if (submitButton) submitButton.disabled = false;
  }
});
