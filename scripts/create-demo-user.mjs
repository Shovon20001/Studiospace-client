// Creates the examiner test account through BetterAuth's HTTP API.
// Usage: node scripts/create-demo-user.mjs http://localhost:3000   (or your live URL)
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const res = await fetch(`${base}/api/auth/sign-up/email`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: base },
  body: JSON.stringify({
    name: "Demo Examiner",
    email: "examiner@studiospace.dev",
    password: "Studio123",
    image: "https://api.dicebear.com/9.x/initials/svg?seed=DE",
  }),
});
console.log(res.status, await res.text());
