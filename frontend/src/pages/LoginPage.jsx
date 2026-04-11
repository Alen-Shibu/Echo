import { useState } from "react";
import "./auth.css"; // move your CSS into this file
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import SubmitLoader from '../components/SubmitLoader'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({userName:"",email:"",password:""})
  const {login,isLoggingIn} = useAuthStore()

  const togglePwd = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <div className="wrapper">
      {/* LEFT PANEL */}
      <div className="left">
        <div className="orbit orbit-1"><div className="orbit-dot"></div></div>
        <div className="orbit orbit-2"><div className="orbit-dot"></div></div>

        <div className="logo">
          <div className="logo-icon"><img src="/logo.png" alt="logo" /></div>
          Echo
        </div>

        <div className="hero-text">
          <h1>Welcome back.<br />Pick up where you left off.<br />Stay connected.</h1>
          <p>Log in to continue your conversations and see what’s new.</p>
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="right">
        <div className="card">

          <div className="card-header">
            <h2>Sign in</h2>
            <p>Don’t have an account? <Link to={'/register'}>Create one</Link></p>
          </div>

          {/* OAuth */}
          <div className="oauth-row">
            <button className="oauth-btn">Google</button>
            <button className="oauth-btn">GitHub</button>
          </div>

          <div className="divider"><span>or continue with</span></div>

          {/* FORM */}
          <form className="form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="field">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrap">
                <input type="email" 
                id="email"
                 placeholder="Enter email" 
                 value={formData.email}
                 onChange={(e) => setFormData({...formData,email: e.target.value})}
                 />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData,password: e.target.value})}
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={togglePwd}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="submit-btn" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? <SubmitLoader /> : "Sign In →"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
