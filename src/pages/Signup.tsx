import { useState } from "react"
import InputField from "../components/Inputs/InputField"
import Button from "../components/Buttons/Button"
import Logo from "../assets/images/logo-dark-theme.svg?react"
import { useNavigate, Link } from "react-router-dom"

type SignupState = {
  fullName: string,
  email: string,
  password: string
}

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signupAction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nameLength = name.split(' ').length > 1;
    const formData: SignupState = {
      fullName: name,
      email: email,
      password: password
    }
    if(!name || name.length < 3 || !nameLength ){
      return console.error('Please use a valid full name.')
    }
    if(!email || !email.includes('@')){
      return console.error('Please use a valid email address.')
    }
    if(!password || password.length < 8){
      return console.error('Please use at least 8 characters in length.')
    }
    navigate('/signin', { state: formData })
  }

  return (
    <main id="signup">
      <div className="form-container">
        <div className="logo">
          <Logo />
        </div>
        
        <form id="signup-form" onSubmit={signupAction}>
          <div className="form-header">
          <h1 className="fh-1">Create your account</h1>
          <h2 className="fh-4 clr-100">Join us and start saving your favorite links — organized, searchable, and always within reach.</h2>
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="name">Full name</label>
            <InputField id="name" type="text" name="name" value={name} onChange={(event) => setName(event.target.value)} required/>
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="email">Email address</label>
            <InputField id="email" type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="password">Password</label>
            <InputField id="password" type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
          </div>
          <Button name="Create account" variant="primary" size="large" textAlign="center" type="submit" />
        </form>

        <p className="fh-4 clr-100 tx-center">Already have an account? <span className="fh-4-sb clr-0"><Link to="/signin">Log in</Link></span></p>
      </div>
    </main>
  )
}

export default Signup
