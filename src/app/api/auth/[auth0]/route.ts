import { handleAuth, handleLogin, handleProfile } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  "update-session": handleProfile({ refetch: true }),
  "silent-login": handleLogin({
    authorizationParams: {
      prompt: "none",
    },
  }),
});
