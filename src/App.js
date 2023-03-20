import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import styled from "styled-components";
import { MainLayout } from "./styles/Layouts";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import Income from "./Components/Income/Income";
import Expenses from "./Components/Expenses/Expenses";
import Limit from "./Components/Balance/Limit";
import { Home } from "./Components/Home";
// import LeftNav from "./Components/Navigation/LeftNav";
// import
// import { useGlobalContext } from "./context/globalContext";
// import { emailid } from "../src/App.js";
const StyledLeftNav = styled.div`
  height: 1.8rem;
  display: none;
  justify-content: space-evenly;
  flex-flow: column nowrap;
  /* margin-left: 1rem; */
  position: absolute;
  z-index: 1000000;
  /* margin-top: -0.7rem; */

  div {
    width: 1.4rem;
    height: 0.2rem;
    background-color: white;
    border-radius: 5px;
    transform-origin: 0.001rem;
    transition: all 0.3s linear;

    &:nth-child(1) {
      transform: ${({ openn }) => (openn ? "rotate(45deg)" : "rotate(0)")};
    }
    &:nth-child(2) {
      transform: ${({ openn }) =>
        openn ? "translateY(100%)" : "translateY(0)"};
      opacity: ${({ openn }) => (openn ? 0 : 1)};
    }
    &:nth-child(3) {
      transform: ${({ openn }) => (openn ? "rotate(-45deg)" : "rotate(0)")};
    }
  }
  @media (max-width: 920px) {
    display: flex;
    margin-left: 2rem;
    margin-top: -0.5rem;
  }
`;

function App() {
  const [active, setActive] = useState(1);
  const [openn, setopenn] = useState(false);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Limit />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  const user = localStorage.getItem("token");

  return (
    <Routes>
      {user && (
        <Route
          path="/"
          exact
          element={
            <AppStyled className="App">
              <MainLayout>
                <StyledLeftNav openn={openn} onClick={() => setopenn(!openn)}>
                  <div />
                  <div />
                  <div />
                </StyledLeftNav>
                <div className="nav">
                  <Navigation
                    active={active}
                    setActive={setActive}
                    openn={openn}
                  />
                </div>
                <main>{displayData()}</main>
              </MainLayout>
            </AppStyled>
          }
        />
      )}
      {!user && <Route path="/signup" exact element={<Signup />} />}
      {user && (
        <Route path="/signup" exact element={<Navigate replace to="/" />} />
      )}
      {!user && <Route path="/login" exact element={<Login />} />}
      {user && (
        <Route path="/login" exact element={<Navigate replace to="/" />} />
      )}
      {!user && <Route path="/home" exact element={<Home />} />}
      {user && (
        <Route path="/home" exact element={<Navigate replace to="/" />} />
      )}
      {!user && (
        <Route path="/" exact element={<Navigate replace to="/login" />} />
      )}
    </Routes>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  /* width: 100vw; */
  /* background: linear-gradient(0.65turn, #000, rgb(33, 38, 45), #000); */
  background-color: #000;
  /* position: relative; */
  .nav {
    /* width: 30%; */
  }
  main {
    width: 100%;
    background: rgb(32, 38, 44);
    /* height: 100vh; */
    border: 0.3rem solid rgb(49, 54, 60);
    border-radius: 1rem;
  }
  /* @media (max-width: 825px) {
    width: 100%;
  } */
  @media (max-width: 920px) {
    overflow-x: hidden;
    main {
      border: none;
      width: 100vw;
      /* padding: 1rem; */
      gap: 0rem;
      margin: 0%;
      border-radius: 0rem;
    }
  }
  @media (min-width: 1024px) {
    .nav {
      width: 30%;
    }
  }
`;

export default App;
