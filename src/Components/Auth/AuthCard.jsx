import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button/Button";
import Field from "../Form/Field";

function AuthCard({ mode }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    limit: "",
  });
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const url = process.env.REACT_APP_USERS_URL;
        const { data: res } = await axios.post(url, data);
        login(res.email, res.username);
      } else {
        const url = process.env.REACT_APP_AUTH_URL;
        const { data: res } = await axios.post(url, {
          email: data.email,
          password: data.password,
        });
        login(res.email, res.username);
      }
      navigate("/");
    } catch (err) {
      if (
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 500
      ) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <div className="brand">
          <div className="brand-mark">X$</div>
          <div>
            <div className="brand-name">Xpenz</div>
            <div className="brand-tag">Track and Analyse</div>
          </div>
        </div>

        <div className="auth-tabs">
          <Link
            to="/login"
            className={"auth-tab" + (!isSignup ? " active" : "")}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className={"auth-tab" + (isSignup ? " active" : "")}
          >
            Sign up
          </Link>
        </div>

        <h2>{isSignup ? "Create your account" : "Welcome back"}</h2>
        <p className="sub">
          {isSignup
            ? "A minute to set up, a habit for life."
            : "Sign in to track your money."}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <Field label="Username" required>
              <input
                type="text"
                className="input"
                name="username"
                value={data.username}
                onChange={handleChange}
                placeholder="your handle"
                autoComplete="username"
                required
              />
            </Field>
          )}
          <Field label="Email" required>
            <input
              type="email"
              className="input"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>
          {isSignup && (
            <Field label="Min savings limit (₹)" required>
              <input
                type="number"
                className="input"
                name="limit"
                value={data.limit}
                onChange={handleChange}
                placeholder="5000"
                required
              />
            </Field>
          )}
          <Field label="Password" required>
            <input
              type="password"
              className="input"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
            />
          </Field>
          {isSignup && (
            <p className="note">
              <strong>Note:</strong> Password should be 8+ characters, with a
              number, capital letter, small letter, and a symbol.
            </p>
          )}
          {error && <div className="error_msg">{error}</div>}
          <div className="submit-row">
            <Button
              type="submit"
              name={isSignup ? "Create account" : "Sign in"}
              variant="primary"
              size="lg"
              block
            />
          </div>
        </form>

        <Link to="/home" className="back-home">
          ← Back home
        </Link>
      </div>
    </AuthShell>
  );
}

const AuthShell = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: var(--s-6);
  background:
    radial-gradient(60% 60% at 20% 10%, rgba(66, 173, 0, 0.08), transparent 60%),
    radial-gradient(60% 60% at 80% 90%, rgba(111, 168, 220, 0.06), transparent 60%),
    var(--bg-deep);

  .auth-card {
    width: 100%;
    max-width: 420px;
    background: var(--bg-surface);
    border: 1px solid var(--line);
    border-radius: var(--r-xl);
    padding: var(--s-6);
    box-shadow: var(--shadow-pop);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    margin-bottom: var(--s-5);
  }
  .brand-mark {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--accent-income);
    color: #0b0d10;
    display: grid;
    place-items: center;
    font-weight: 900;
    font-size: 13px;
    letter-spacing: -0.02em;
    flex-shrink: 0;
  }
  .brand-name {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--fg);
  }
  .brand-tag {
    font-size: 11px;
    color: var(--fg-faint);
    margin-top: -2px;
    font-weight: 500;
  }

  .auth-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--bg-deep);
    padding: 4px;
    border-radius: var(--r-sm);
    margin-bottom: var(--s-5);
    border: 1px solid var(--line);
  }

  .auth-tab {
    padding: 8px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    color: var(--fg-muted);
    text-align: center;
    cursor: pointer;
    min-height: 36px;
    display: grid;
    place-items: center;
    text-decoration: none;
  }
  .auth-tab.active {
    background: var(--bg-surface);
    color: var(--fg);
    box-shadow: inset 0 0 0 1px var(--line);
  }

  h2 {
    margin: 0 0 var(--s-1);
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--fg);
  }
  .sub {
    margin: 0 0 var(--s-5);
    font-size: 13px;
    color: var(--fg-muted);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  .input {
    width: 100%;
    height: 44px;
    padding: 0 var(--s-3);
    background: var(--bg-inset);
    color: var(--fg);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: border-color 120ms, background 120ms;
  }
  .input::placeholder {
    color: var(--fg-faint);
  }
  .input:focus {
    border-color: var(--line-focus);
    background: var(--bg-inset-2);
  }

  .note {
    font-size: 11px;
    color: var(--fg-muted);
    line-height: 1.5;
    margin: 0;
  }

  .error_msg {
    padding: 10px 12px;
    background: rgba(232, 60, 50, 0.12);
    color: #ff857d;
    border: 1px solid rgba(232, 60, 50, 0.3);
    border-radius: var(--r-sm);
    font-size: 13px;
    font-weight: 600;
  }

  .submit-row {
    margin-top: var(--s-2);
  }

  .back-home {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: var(--s-3);
    padding: 10px;
    border-radius: var(--r-sm);
    color: var(--fg-muted);
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: var(--fg);
    }
  }
`;

export default AuthCard;
