
const cards = document.querySelectorAll(".package-card");
const packageField = document.getElementById("packageField");
const selectedLabel = document.getElementById("selectedPackageLabel");
const booking = document.getElementById("booking");
const form = document.getElementById("bookingForm");
const statusEl = document.getElementById("formStatus");

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
  if (!packageField.value) {
    statusEl.textContent = "Please choose a package first.";
    statusEl.className = "form-status error";
    document.getElementById("packages").scrollIntoView({behavior:"smooth"});
    return;
  }

  statusEl.textContent = "Submitting your booking...";
  statusEl.className = "form-status";

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch("/api/book", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Could not submit booking.");

    statusEl.textContent = "Booking registration received. Please check your email for confirmation and payment instructions.";
    statusEl.className = "form-status success";
    form.reset();
    packageField.value = "";
    selectedLabel.textContent = "Choose a package above";
  } catch (err) {
    statusEl.textContent = err.message || "Something went wrong. Please try again.";
    statusEl.className = "form-status error";
  }
});
