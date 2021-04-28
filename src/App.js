import React, { useRef, useState } from 'react';
import './styles.css';
import { useForm } from "react-hook-form";

function App() {

  const [newUser, setNewUser] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = data => {
    const {name, email, password} = data;
    console.log(data);
    reset();
  }

  return (
    <div>
      <div className="form-box">
        <div className="login-box">
          <br />
          <button className="google-btn">Google Sign in</button>
          <h2>Login Here</h2>

          <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} />
          <label htmlFor="newUser">New User Sign up</label>
          <br /><br />

          <form onSubmit={handleSubmit(onSubmit)}>

            {
              newUser && <span>
                <input type="text" {...register("name", {
                  required: "* Name is required"
                })}
                  placeholder="Name" />
                <br />
                {errors.name && <p className="error">{errors.name.message}</p>}
              </span>
            }

            <input type="email" {...register("email", {
              required: "* Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email address must be valid"
              }
            })}
              placeholder="Email" />
            <br />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <input type="password" {...register("password", {
              required: "* Password is required",
              minLength: {
                value: 6,
                message: "Password must have at least 6 characters"
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
                message: "Password must contain at least one uppercase letter, one lowercase letter and one number digit"
              }
            })}
              placeholder="Password" />
            <br />
            {errors.password && <p className="error">{errors.password.message}</p>}

            {
              newUser && <span>
                <input type="password" {...register("confirmPassword", {
                  required: "* Confirmation password is required",
                  validate: value => value === password.current || "The passwords does not match"
                })}
                  placeholder="Confirm Password" />
                <br />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
              </span>
            }

            <button type="submit" className="register">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
