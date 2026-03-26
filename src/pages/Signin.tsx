import { useState } from "react"
import InputField from "../components/Inputs/InputField"
import Button from "../components/Buttons/Button"
import Logo from "../assets/images/logo-dark-theme.svg?react"
import { useLocation, useNavigate, Link } from 'react-router-dom';

type SignupState = {
  fullName: string,
  email: string,
  password: string
}

const Signin = () => {
  const location = useLocation();
  const signupState = location.state as SignupState | undefined;
  const [emailInput, setEmailInput] = useState(signupState?.email ?? "");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();

  const signinAction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!signupState){
      return console.error('No signup data found. Please create an account first.');
    }
    if(emailInput !== signupState.email){
      return console.error('Email is incorrect.')
    }
    if(passwordInput !== signupState.password){
      return console.error('Password does not match.')
    }
    navigate('/home', {
      state: {
        fullName: signupState.fullName,
        email: signupState.email
      }
    })
  }

  return (
    <main id="signin">
      <div className="form-container">
        <div className="logo">
          <Logo />
        </div>
        
        <form id="login-form" onSubmit={signinAction}>
          <div className="form-header">
          <h1 className="fh-1">Log in to your account</h1>
          <h2 className="fh-4 clr-100">Welcome back! Please enter your details.</h2>
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="email">Email</label>
            <InputField
              id="email"
              name="email"
              type="email"
              value={emailInput}
              placeholder="Enter your email"
              ariaLabel="Email"
              required
              onChange={(event) => setEmailInput(event.target.value)}
            />
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="password">Password</label>
            <InputField
              id="password"
              name="password"
              type="password"
              value={passwordInput}
              placeholder="Enter your password"
              ariaLabel="Password"
              required
              onChange={(event) => setPasswordInput(event.target.value)}
            />
          </div>
          <Button name="Log in" variant="primary" size="large" textAlign="center" type="submit" />
        </form>

        <p className="fh-4 clr-100 tx-center">Forgot password? <span className="fh-4-sb clr-0">Reset it</span></p>
        
        <p className="fh-4 clr-100 tx-center">Don't have an account? <span className="fh-4-sb clr-0"><Link to="/signup">Sign up</Link></span></p>
      </div>
    </main>
  )
}

export default Signin
