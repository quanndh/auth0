import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const POST = withApiAuthRequired(async function myApiRoute(req) {
  const res = new NextResponse();

  const body = await req.json();

  const tokenRes = await fetch(
    "https://dev-iun3xia1tgqbhae3.us.auth0.com/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        client_id: "nmPk3yzYF8wCnBfEb46iLYwgE4fAO8zo",
        client_secret:
          "ZK52HkUjfb5evtjdbEpODLV_Ve96oVNgK-IlHgVkRL7X1EBlr4cwE07HWXXKxEWv",
        audience: "https://dev-iun3xia1tgqbhae3.us.auth0.com/api/v2/",
        grant_type: "client_credentials",
      }),
    }
  );

  const { access_token } = await tokenRes.json();

  if (!access_token) {
    return NextResponse.json(
      {
        message: "Error",
      },
      res
    );
  }

  const createUserRes = await fetch(
    "https://dev-iun3xia1tgqbhae3.us.auth0.com/api/v2/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        ...body,
        connection: "Username-Password-Authentication",
      }),
    }
  );
  const createUserResData = await createUserRes.json();

  return NextResponse.json(createUserResData, res);
});
