"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./home.module.css";
import auth0 from "auth0-js";

export const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState<any>();

  const webAuth = new auth0.WebAuth({
    domain: process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL ?? "",
    clientID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? "",
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}/authorized`,
    audience: `${process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL}/api/v2/`,
    scope: "openid profile email",
    responseType: "token",
  });

  const { user, error, isLoading } = useUser();
  let interval: NodeJS.Timeout;
  useEffect(() => {
    const authCheck = sessionStorage.getItem("auth_check");
    if (!authCheck) {
      webAuth.checkSession({}, (err, res) => {
        sessionStorage.setItem("auth_check", "1");
        console.log({ res });
        if (res?.accessToken) {
          window.location.href = "/api/auth/silent-login";
        }
      });
    }

    interval = setInterval(() => {
      webAuth.checkSession({}, (err, res) => {
        if (!res?.accessToken) {
          window.location.href = "/api/auth/logout";
        }
      });
    }, 900 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleLogin = async () => {
    webAuth.checkSession({}, (err, res) => {
      if (res?.accessToken) {
        return (window.location.href = "/api/auth/silent-login");
      }
      window.location.href = "/api/auth/login";
    });
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("auth_check");
    window.location.href = "/api/auth/logout";
  };

  const handleCallProtectedApi = async () => {
    const res = await fetch("/api/protected");
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  const handleInvite = async () => {
    const res = await fetch("/api/invite", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    if (data.user_id) {
      setNewUser(data);
    } else {
      alert(JSON.stringify(data));
    }
  };

  return (
    <>
      <div className={styles.header}>
        <Link href="/protected/ssr" className={styles.headerItem}>
          Protected ssr route
        </Link>
        <Link href="/protected/csr" className={styles.headerItem}>
          Protected csr route
        </Link>
        <button onClick={handleCallProtectedApi} className={styles.headerItem}>
          Protected api
        </button>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button className={styles.headerItem} onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
      {user && (
        <div>
          <h4>User Profile</h4>
          <img src={user.picture ?? ""} alt={user.name ?? ""} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>ID: {user.sub}</p>
        </div>
      )}

      <div>
        <input
          placeholder="Enter email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleInvite}>Invite user</button>
      </div>

      {newUser && (
        <div>
          <h4>New User</h4>
          <img src={newUser.picture ?? ""} alt={newUser.name ?? ""} />
          <h2>{newUser.name}</h2>
          <p>{newUser.email}</p>
          <p>ID: {newUser.user_id}</p>
        </div>
      )}
    </>
  );
};
