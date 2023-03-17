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
  .home {
    background: linear-gradient(0.65turn, #000, #44bb44, #000);
    /* background-color: #000; */
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .content {
      border: 0.5rem solid #44bb44;
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
        background-color: #44bb44;
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
              background-color: rgba(0, 0, 0, 0.95);
              padding: 0.75rem;
              text-align: center;
              color: white;
              text-decoration: none;
            }
            .login {
              width: 48%;
              border-radius: 0.6rem;
              background-color: rgba(0, 0, 0, 0.95);
              padding: 0.75rem;
              text-align: center;
              color: white;
              text-decoration: none;
            }
          }
          button {
            background-color: #000;
            color: #ffffff;
            border: none;
            width: 100%;
            padding: 0.7rem;
            border-radius: 0.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
            font-weight: 500;
            :hover {
              cursor: pointer;
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
        border-radius: 0.8rem;
        img {
          width: 30rem;
        }
      }
    }
  }
`;
