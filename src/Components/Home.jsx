import React from "react";
import styled from "styled-components";
import xpenz from "../img/xpenz.png";

export const Home = () => {
  const github = () => {
    window.open("https://github.com/madhoora-mohan/xpen--frontend", "_blank");
  };
  return (
    <HomeStyled>
      <div className="home">
        <div className="content">
          <div className="left">
            <div className="text">
              <h1>Xpenz</h1>
              <h3>Track, Analyse and Learn from your finances.</h3>
              <p>
                Our website offers a user-friendly interface to track expenses
                and income, with visual graphs for easy analysis of financial
                data. Users can establish a savings threshold and receive email
                notifications if the balance falls below the threshold. Our
                comprehensive solution provides a streamlined approach to
                managing personal finances.
              </p>
              <ul>
                <li>Track finances visually</li>
                <li>Set savings threshold</li>
                <li>Export data when needed</li>
              </ul>
              <div className="btns">
                <a href="/signup" className="signup">
                  Get started!
                </a>
                <a href="/login" className="login">
                  Login
                </a>
              </div>
              <button className="git" onClick={() => github()}>
                <img
                  src="https://img.icons8.com/ios-filled/30/ffffff/github.png"
                  alt="github"
                />
                View on Github
              </button>
            </div>
          </div>
          <div className="right">
            <img src={xpenz} alt="xpenz" />
          </div>
        </div>
      </div>
    </HomeStyled>
  );
};

const HomeStyled = styled.div`
  * {
    transition: all 150ms ease-in-out;
  }
  .home {
    /* background: rgb(33, 38, 45); */
    background: linear-gradient(0.65turn, #000, rgb(33, 38, 45), #000);
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .content {
      border: 0.3rem solid rgb(48, 55, 60);
      display: flex;
      justify-content: center;
      border-radius: 1.5rem;
      height: 85%;
      width: 90%;
      .left {
        display: flex;
        width: 55%;
        /* border: 1rem solid black; */
        flex-direction: column;
        background-color: black;
        /* border-radius: 1rem; */
        border-bottom-left-radius: 1rem;
        border-top-left-radius: 1rem;
        margin: 0rem;
        .text {
          width: 100%;
          padding: 1rem;
          padding-left: 2rem;
          h1 {
            font-size: 3rem;
            font-weight: 800;
          }
          h3 {
            font-size: 1.4rem;
          }
          p {
            color: #ffffff;
            font-size: 1.1rem;
            line-height: 1.7rem;
            padding-top: 1.5rem;
          }
          ul {
            color: white;
            padding-top: 0.5rem;
            padding-left: 1rem;
            li {
              display: list-item;
              margin-left: 1rem;
              line-height: 1.7rem;
              font-size: 1.1rem;
              list-style-type: disc;
            }
          }
          .btns {
            width: 100%;
            display: flex;
            padding-top: 1rem;
            padding-bottom: 0.75rem;
            justify-content: space-between;
            .signup {
              width: 48%;
              border-radius: 0.6rem;
              background-color: #ffffff;
              padding: 0.75rem;
              text-align: center;
              color: #000000;
              font-weight: 700;
              border: 0.2rem solid #ffffff;
              text-decoration: none;
              :hover {
                cursor: pointer;
                color: #ffffff;
                background-color: #000000;
              }
            }
            .login {
              width: 48%;
              border-radius: 0.6rem;
              background-color: #ffffff;
              padding: 0.75rem;
              text-align: center;
              font-weight: 700;
              border: 0.2rem solid #ffffff;
              color: #000000;
              text-decoration: none;
              :hover {
                cursor: pointer;
                color: #ffffff;
                background-color: #000000;
              }
            }
          }
          button {
            background-color: #000;
            color: #ffffff;
            border: 0.1rem solid white;
            width: 100%;
            padding: 0.7rem;
            border-radius: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
            font-weight: 500;
            :hover {
              cursor: pointer;
              font-size: 1.25rem;
              padding: 0.71rem;
              text-decoration: underline;
            }
            img {
              background-color: #000;
              color: #000;
              padding-right: 0.5rem;
            }
          }
        }
      }
      .right {
        width: 45%;
        background-color: #000000;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom-right-radius: 1rem;
        border-top-right-radius: 1rem;
        img {
          width: 30rem;
        }
      }
    }
  }
`;
