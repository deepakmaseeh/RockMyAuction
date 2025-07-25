// /src/app/api/auth/login/route.js
export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 });
  }

  // DEMO: Only allow these credentials
  if (email === "test@example.com" && password === "password123") {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
}
