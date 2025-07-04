import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi, Configuration, type LoginRequest } from "../ts-client";
import Layout from "../components/Layout";
import { useToast } from "../components/ToastProvider";

export default function Login() {
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const config = new Configuration({
    basePath:
      "https://authapi-production-ab50.up.railway.app",
  });

  const api = new AuthApi(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.login(form);
      localStorage.setItem("token", res.data.token);
      toast("Login successful! 👍🏼");
      navigate("/profile");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed.");
    }
  };

  function animateLabel(labelElement: HTMLElement, text: string) {
    labelElement.innerHTML = text
      .split("")
      .map(
        (letter, idx) =>
          `<span style="transition-delay:${idx * 50}ms">${letter}</span>`
      )
      .join("");
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="form-wave">
          <input
            name="email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <label
            ref={(el) => {
              if (el) animateLabel(el, "Email");
            }}
          />
        </div>
        <div className="form-wave">
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
          <label
            ref={(el) => {
              if (el) animateLabel(el, "Password");
            }}
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        Back to <Link to="/home"> home 🏠</Link>
      </p>
    </Layout>
  );
}
