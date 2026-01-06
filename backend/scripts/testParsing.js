// Test the parsing logic locally
const options_raw = "Security of computers,Protection from digital attacks,Network security,Firewalls";

console.log("Testing option parsing:\n");
console.log("Raw options:", options_raw);

let opts = [];
try {
  // Try parsing as JSON first
  opts = JSON.parse(options_raw || "[]");
  console.log("✅ Parsed as JSON:", opts);
} catch (e) {
  console.log("❌ JSON parse failed:", e.message);
  // If JSON fails, try splitting by comma
  try {
    opts = (options_raw || "").split(",").map(opt => opt.trim());
    console.log("✅ Parsed as comma-separated:", opts);
  } catch (e2) {
    console.error("❌ Failed to parse options:", e.message);
    opts = [];
  }
}

console.log("\nResult:");
console.log({
  option_a: opts[0] || null,
  option_b: opts[1] || null,
  option_c: opts[2] || null,
  option_d: opts[3] || null,
});
