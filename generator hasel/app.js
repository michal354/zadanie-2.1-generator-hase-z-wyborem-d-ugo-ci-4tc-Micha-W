const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};
const passwordEl = document.getElementById("password");
const copyBtn = document.getElementById("copy");
const lengthRange = document.getElementById("length");
const lengthNumber = document.getElementById("lengthNumber");
const lengthValue = document.getElementById("lengthValue");
const errorEl = document.getElementById("error");
function clampLength(value) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return 16;
  return Math.min(64, Math.max(4, n));
}
function syncLength(value) {
  const n = clampLength(value);
  lengthRange.value = String(n);
  lengthNumber.value = String(n);
  lengthValue.textContent = String(n);
  return n;
}
function pool() {
  let chars = "";
  for (const [id, set] of Object.entries(SETS)) {
    if (document.getElementById(id).checked) chars += set;
  }
  return chars;
}
function randomIndex(max) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}
function generate() {
  const chars = pool();
  if (!chars) {
    errorEl.hidden = false;
    errorEl.textContent = "Zaznacz przynajmniej jeden zestaw znaków.";
    return;
  }
  errorEl.hidden = true;
  const length = clampLength(lengthRange.value);
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += chars[randomIndex(chars.length)];
  }
  passwordEl.textContent = result;
  copyBtn.disabled = false;
}
lengthRange.addEventListener("input", () => syncLength(lengthRange.value));
lengthNumber.addEventListener("input", () => syncLength(lengthNumber.value));
document.getElementById("generate").addEventListener("click", generate);
copyBtn.addEventListener("click", async () => {
  const text = passwordEl.textContent;
  if (!text) return;
  if (window.desktop?.copy) {
    window.desktop.copy(text);
  } else {
    await navigator.clipboard.writeText(text);
  }
  copyBtn.textContent = "Skopiowano";
  setTimeout(() => {
    copyBtn.textContent = "Kopiuj";
  }, 1200);
});
syncLength(16);
generate();