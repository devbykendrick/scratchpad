import React, { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import Navbar from "../Navbar/Navbar";

function Signup() {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await signup(email, password);
  }

  return (
    <>
      <Navbar signedIn={signedIn} setSignedIn={setSignedIn} />
      <form className="mt-20" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button disabled={isLoading}>Sign Up</button>
        {error && <div>{error}</div>}
      </form>
    </>
  );
}

export default Signup;
