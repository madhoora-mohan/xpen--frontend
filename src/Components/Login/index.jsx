import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://expense-tracker-mern-back-madhoora-mohan.onrender.com/api/auth";
      const { data: res } = await axios.post(url, data);
      console.log(res);
      localStorage.setItem("token", res.data);
      localStorage.setItem("email", res.email);
      localStorage.setItem("username", res.username);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <LoginStyled>
      <div className="login_container">
        <div className="login_form_container">
          <div className="left">
            <form className="form_container" onSubmit={handleSubmit}>
              <h1>Login to Your Account</h1>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="input"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className="input"
              />
              {error && <div className="error_msg">{error}</div>}
              <button type="submit" className="green_btn">
                Sign In
              </button>
            </form>
          </div>
          <div className="right">
            <h1>New Here ?</h1>
            <Link to="/signup">
              <button type="button" className="white_btn">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </LoginStyled>
  );
};

const LoginStyled = styled.div`
  .login_container {
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #bfbfbf;
  }

  .login_form_container {
    width: 55%;
    height: 60%;
    display: flex;
    border-radius: 1.5rem;
    border-color: rgb(69, 69, 69);
    box-shadow: 0rem 0.3rem 0.3rem -0.2rem rgb(0 0 0 / 20%),
      0rem 0.3rem 0.4rem 0rem rgb(0 0 0 / 14%), 0rem 0.1rem 0.8rem 0rem rgb(0 0 0 / 12%);
  }

  .left {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(49, 54, 60);
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  .form_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .form_container h1 {
    font-size: 1.5rem;
    margin-top: 0;
  }

  .input {
    outline: none;
    border: none;
    width: 60%;
    padding: 0.7rem;
    border-radius: 1rem;
    background-color: #edf5f3;
    margin: 0.3rem 0;
    font-size: 0.7rem;
  }

  .error_msg {
    width: 3rem;
    padding: 0.1rem;
    margin: 0.5rem 0;
    font-size: 1rem;
    background-color: #f34646;
    color: white;
    border-radius: 0.5rem;
    text-align: center;
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: black;
    border: 3px solid black;
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }

  .right h1 {
    margin-top: 0;
    color: white;
    font-size: 1.5rem;
    text-align: center;
  }

  .white_btn,
  .green_btn {
    border: none;
    outline: none;
    padding: 0.5rem 0;
    background-color: white;
    border-radius: 20px;
    width: 5rem;
    font-weight: bold;
    font-size: 0.7rem;
    cursor: pointer;
    text-decoration: none;
    transition: 0.9s;
  }

  .green_btn {
    background-color: black;
    color: white;
    margin: 0.5rem;
    text-decoration: none;
  }
  .wb {
    text-decoration: none;
    font-size: 1rem;
    color: #232260;
  }
`;

export default Login;
