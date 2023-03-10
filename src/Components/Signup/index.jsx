import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    limit: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = process.env.REACT_APP_USERS_URL;
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
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
    <SignupStyled>
      <div className="signup_container">
        <div className="signup_form_container">
          <div className="left">
            <h1>Welcome Back?!!</h1>
            <Link to="/login">
              <button type="button" className="white_btn">
                Sign in
              </button>
            </Link>
          </div>
          <div className="right">
            <form className="form_container" onSubmit={handleSubmit}>
              <h1>Create Account</h1>
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
                value={data.username}
                required
                className="input"
              />
              <input
                type="email"
                placeholder="Email Id"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="input"
              />
              <input
                type="number"
                placeholder="Min Balance Limit"
                name="limit"
                onChange={handleChange}
                value={data.limit}
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
              <p>
                <b>Note</b>: Password should be 8 characters long, must contain
                a number, capital letter, small letter and a symbol.
              </p>
              <button type="submit" className="green_btn">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </SignupStyled>
  );
};
const SignupStyled = styled.div`
  .signup_container {
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #bfbfbf;
  }

  .signup_form_container {
    width: 55%;
    height: 60%;
    display: flex;
    border-radius: 1.5rem;
    border-color: rgb(69, 69, 69);
    box-shadow: 0rem 0.3rem 0.3rem -0.2rem rgb(0 0 0 / 20%),
      0rem 0.3rem 0.4rem 0rem rgb(0 0 0 / 14%),
      0rem 0.1rem 0.8rem 0rem rgb(0 0 0 / 12%);
  }

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: black;
    border: 3px solid black;
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }

  .left h1 {
    margin-top: 0;
    color: white;
    font-size: 1.5rem;
    text-align: center;
  }

  .right {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(49, 54, 60);
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;

    .form_container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      /* height: 10vh; */

      h1 {
        font-size: 2rem;
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
      p {
        color: white;
        font-size: 0.9rem;
        margin: 0.5rem;
        margin-left: 2.5rem;
        margin-right: 1.5rem;
      }

      .error_msg {
        /* width: 3rem; */
        padding: 0.4rem;
        margin: 0.5rem 0;
        font-size: 1rem;
        background-color: #f34646;
        color: white;
        border-radius: 0.5rem;
        text-align: center;
      }
    }
  }

  .white_btn,
  .green_btn {
    border: none;
    outline: none;
    padding: 0.5rem 0;
    background-color: white;
    border-radius: 20px;
    width: 7rem;
    font-weight: bold;
    font-size: 0.8rem;
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
  @media (max-width: 1024px) {
    .signup_container {
      .signup_form_container {
        .left {
          h1 {
            font-size: 1.2rem;
          }
        }
        .right {
          .form_container {
            h1 {
              font-size: 1.5rem;
            }

            .input {
              width: 60%;
              padding: 0.4rem;
              margin: 0.2rem;
              font-size: 0.7rem;
            }
            p {
              color: white;
              font-size: 0.6rem;
            }

            .error_msg {
              padding: 0.3rem;
              margin: 0.5rem 0;
              font-size: 0.7rem;
            }
          }
        }
      }
    }
  }
  @media (max-width: 768px) {
    .signup_container {
      .signup_form_container {
        .right {
          .form_container {
            h1 {
              font-size: 1.3rem;
            }

            .input {
              width: 60%;
              padding: 0.4rem;
              margin: 0.2rem;
              font-size: 0.7rem;
            }
            p {
              color: white;
              font-size: 0.6rem;
            }

            .error_msg {
              padding: 0.3rem;
              margin: 0.5rem 0;
              font-size: 0.7rem;
            }
          }
        }
      }
    }
  }
  @media (max-width: 425px) {
    .signup_container {
      .signup_form_container {
        width: 70vw;
        height: 25rem;
        display: flex;
        flex-direction: column-reverse;
        .left {
          margin: 0rem;
          border-radius: 1rem;
          border-top-left-radius: 0rem;
          border-top-right-radius: 0rem;
          h1 {
            font-size: 1rem;
          }
          .white_btn {
            padding: 0.3rem;
          }
        }
        .right {
          /* height: 80%; */
          border-radius: 1rem;
          border-bottom-left-radius: 0rem;
          border-bottom-right-radius: 0rem;
          .form_container {
            h1 {
              font-size: 1rem;
            }
            .input {
              width: 80%;
              padding: 0.4rem;
              margin: 0.2rem;
              font-size: 0.7rem;
            }
            p {
              color: white;
              font-size: 0.6rem;
              margin: 0.5rem;
              margin-left: 1.2rem;
            }

            .error_msg {
              padding: 0.3rem;
              margin: 0.5rem 0;
              font-size: 0.7rem;
            }
          }
        }
      }
    }
  }
`;

export default Signup;
