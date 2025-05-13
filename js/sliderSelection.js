const baseDate = new Date("2010-01-01");

const startSlider = document.getElementById("startSlider");
const endSlider = document.getElementById("endSlider");
const startLabel = document.getElementById("startDateLabel");
const endLabel = document.getElementById("endDateLabel");
const startInput = document.getElementById("startDateInput");
const endInput = document.getElementById("endDateInput");

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function offsetToDate(offset) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offset);
  return d;
}

function dateToOffset(dateStr) {
  const date = new Date(dateStr);
  return Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
}

// Called whenever the date changes
function syncFromSliders() { 
  let startOffset = parseInt(startSlider.value);
  let endOffset = parseInt(endSlider.value);

  // Clamp values to each other
  if (startOffset > endOffset) {
    startOffset = endOffset;
  }
  if (endOffset < startOffset) {
    endOffset = startOffset;
  }

  const startDate = offsetToDate(startOffset);
  const endDate = offsetToDate(endOffset);

  startSlider.value = startOffset;
  endSlider.value = endOffset;

  startLabel.textContent = formatDate(startDate);
  endLabel.textContent = formatDate(endDate);

  startInput.value = formatDate(startDate);
  endInput.value = formatDate(endDate);

  updateLineCharts();
}

function syncFromInputs() {
  const startOffset = dateToOffset(startInput.value);
  const endOffset = dateToOffset(endInput.value);

  // Clamp to allowed range
  if (!isNaN(startOffset)) {
    startSlider.value = Math.min(startOffset, endSlider.value);
  }
  if (!isNaN(endOffset)) {
    endSlider.value = Math.max(endOffset, startSlider.value);
  }
  syncFromSliders();
}

startSlider.addEventListener("mouseup", syncFromSliders);
endSlider.addEventListener("mouseup", syncFromSliders);
startInput.addEventListener("change", syncFromInputs);
endInput.addEventListener("change", syncFromInputs);
