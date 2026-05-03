import { useState } from "react";
import "./auth.css"; // move your CSS into this file
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import SubmitLoader from '../components/SubmitLoader'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({userName:"",email:"",password:""})
  const {register,isRegistering} = useAuthStore()

  const togglePwd = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    register(formData)
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
          <h1>Connect.<br />Converse.<br />Create.</h1>
          <p>A space for real conversations. Join thousands already talking and sharing.</p>
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="right">
        <div className="card">

          <div className="card-header">
            <h2>Create account</h2>
            <p>Already have one? <Link to={'/login'}>Sign in insted</Link></p>
          </div>

          {/* OAuth
          <div className="oauth-row">
            <button className="oauth-btn">Google</button>
            <button className="oauth-btn">GitHub</button>
          </div> */}

          <div className="divider"><span>or</span></div>

          {/* FORM */}
          <form className="form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrap">
                <input type="text" 
                id="name" 
                placeholder="Enter full name"
                value={formData.userName}
                onChange={(e) => setFormData({...formData,userName: e.target.value})}
                />
              </div>
            </div>

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

            {/* Checkbox */}
            <div className="check-row">
              <label className="check-wrap">
                <input type="checkbox" />
              </label>
              <p>
                <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>
              </p>
            </div>

            {/* Submit */}
            <button className="submit-btn" type="submit" disabled={isRegistering}>
              {isRegistering ? <SubmitLoader /> : "Create Account →"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
