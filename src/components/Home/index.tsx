"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./home.module.css";

export const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newUser, setNewUser] = useState<any>();

  const { user, error, isLoading, checkSession } = useUser();

  useEffect(() => {
    checkSession();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleLogin = async () => {
    window.location.href = "/api/auth/login";
  };

  const handleLogout = async () => {
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
