import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/auth";
import "./AuthPages.css";

const initialForm = {
  name: "",
  age: "",
  occupation: "",
  education_qualification: "",
  email: "",
  password: "",
};

export default function SignupPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup({
        ...form,
        age: Number(form.age),
      });
      navigate("/login", { state: { justSignedUp: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Age
          <input
            name="age"
            type="number"
            min="1"
            max="119"
            value={form.age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Occupation
          <input name="occupation" value={form.occupation} onChange={handleChange} required />
        </label>

        <label>
          Education qualification
          <input
            name="education_qualification"
            value={form.education_qualification}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            minLength={8}
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}