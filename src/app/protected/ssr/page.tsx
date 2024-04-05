import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";

export default withPageAuthRequired(
  async function ProtectedSsrPage() {
    const session = await getSession();
    return <div>Hello {session?.user.name}</div>;
  },
  { returnTo: "/" }
);

export const fetchCache = "force-no-store";