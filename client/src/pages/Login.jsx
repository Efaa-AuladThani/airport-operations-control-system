import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

import api from "../api/api";
import aocsIcon from "../assets/ aocs-icon.png";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Track the email input value.
  const [email, setEmail] = useState("");

  // Track the password input value.
  const [password, setPassword] = useState("");

  // Placeholder for future loading state during authentication.
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder for future authentication error feedback.
  const [error, setError] = useState("");

  // Handle form submission for the login form.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const { token, user } = response.data;

      // Save the authenticated user and token in the auth context.
      login(token, user);

      // Redirect to the dashboard after successful login.
      navigate("/dashboard");
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message || err?.response?.data?.error;
      setError(backendMessage || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <img
            src={aocsIcon}
            alt="AOCS icon"
            className="login-brand__image"
          />
        </div>

        <header className="login-header">
          <h1 id="login-title" className="login-title">
            Welcome Back
          </h1>
          <p className="login-subtitle">Sign in to access airport operations.</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="form-field">
              <Mail className="form-field__icon" aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="form-field">
              <Lock className="form-field__icon" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <footer className="login-footer">AOCS · Airport Operations Control System</footer>
      </section>
    </main>
  );
}

export default Login;
