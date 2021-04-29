import './styles.css';
import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import firebase from "firebase/app";
import "firebase/auth"
import { FcGoogle } from 'react-icons/fc';
import firebaseConfig from './firebase.config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

function App() {


  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    success: false
  });
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth()
      .signInWithPopup(googleProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signIn = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(signIn);
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorCode, errorMessage, email, credential);
      });
  }
  const handleSignOut = () => {
    firebase.auth().signOut().then((result) => {
      const signOut = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: ''
      };
      setUser(signOut);
    }).catch((error) => {
      // An error happened.
    });
  }

  const onSubmit = data => {
    const { name, email, password } = data;
    console.log(data);
    reset();
  }

  return (
    <div>
      <h4 style={{ textAlign: 'center' }}>Hello {user.name}</h4>
      <div className={`form-box-${newUser ? 'register' : 'login'}`}>
        <div className="login-box">
          <br />
          {
            user.isSignedIn ? <button className="google-btn" onClick={handleSignOut}>
              <FcGoogle className="icon" /> Sign Out
          </button> :
              <button className="google-btn" onClick={handleSignIn}>
                <FcGoogle className="icon" /> Sign in
          </button>
          }

          <h2>Login Here</h2>

          <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} />
          <label htmlFor="newUser"><span className="checkText">New User Sign up</span></label>
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

            <button type="submit" className="register">
              {
                newUser ? 'Register' : 'Login'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
