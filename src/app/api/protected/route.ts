import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
export const GET = withApiAuthRequired(async function myApiRoute(req) {
  const res = new NextResponse();
  const session = await getSession(req, res);

  return NextResponse.json(
    {
      protected: "My Secret",
      id: session?.user.sub,
      email: session?.user.email,
    },
    res
  );
});
