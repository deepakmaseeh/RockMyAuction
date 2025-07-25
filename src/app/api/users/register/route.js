import connect from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  const body = await req.json();
  await connect();

  const hash = await bcrypt.hash(body.password, 10);
  await User.create({ ...body, password: hash });

  return Response.json({ success: true });
}
