import React, { useEffect, useState } from "react";
import styled from "styled-components";
import avatar from "../../img/avatar.png";
import { signout, fileexport } from "../../utils/Icons";
import { menuItems } from "../../utils/menuItems";
import XLSX from "xlsx";
import { useGlobalContext } from "../../context/globalContext";
import axios from "axios";

function Navigation({ active, setActive, openn }) {
  // let realopen = openn;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    window.location.reload();
  };

  const [sheetData, setSheetData] = useState(null);
  const { totalBalance, setError } = useGlobalContext();

  const username = localStorage.getItem("username");
  const emailid = localStorage.getItem("email");
  useEffect(() => {
    axios
      .get("https://xpens.onrender.com/api/v1/" + `get-incomes/${emailid}`)
      .then((res) => {
        // console.log(res.data);

        setSheetData(res.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get("https://xpens.onrender.com/api/v1/" + `get-expenses/${emailid}`)
      .then((res) => {
        // console.log(res.data);
        setSheetData({ ...sheetData.concat(res.data) });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  // console.log(openn);
  // useEffect(()=>{
  //   // setPleaseWork(openn)
  //   console.log(openn)
  // },[openn]);
  // console.log(pleaseWork)

  const handleExport = () => {
    let data = Object.values(sheetData);
    data.forEach((d) => {
      delete d.email;
      delete d.__v;
      delete d.createdAt;
      delete d.updatedAt;
    });
    // console.log(data);
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(Object.values(sheetData));
    XLSX.utils.book_append_sheet(wb, ws, "MySheet");
    XLSX.writeFile(wb, `${username} Data ${Date()}.xlsx`);
  };

  return (
    <NavStyled openn={openn}>
      <div className="user-con">
        <img src={avatar} alt="" />
        <div className="text">
          <h5>{username}</h5>
          <h5>Savings: ₹{totalBalance()}</h5>
        </div>
      </div>
      <ul className="menu-items">
        {menuItems.map((item) => {
          return (
            <li
              key={item.id}
              onClick={() => setActive(item.id)}
              onClickCapture={() => setError("")}
              className={active === item.id ? "active" : ""}
            >
              {item.icon}
              <span>{item.title}</span>
            </li>
          );
        })}
      </ul>
      <div className="bottom-nav">
        <button className="sign-out" onClick={handleLogout}>
          {signout} Sign Out
        </button>
        <button className="export" onClick={handleExport}>
          {fileexport} Export Data
        </button>
      </div>
    </NavStyled>
  );
}

const NavStyled = styled.nav`
  padding: 0.8rem 0.8rem;
  /* width: 100%; */
  height: 100%;
  background: rgb(32, 38, 44);
  border: 0.3rem solid rgb(49, 54, 60);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
  scroll-behavior: smooth;
  gap: 1rem;
  .user-con {
    height: 5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    img {
      width: 2.5rem;
      border-radius: 0.3rem;
      object-fit: cover;
      background: #fcf6f9;
      border: 0.1rem solid rgb(49, 54, 60);
    }
    h5 {
      color: #fff;
      font-size: 1rem;
      font-weight: 400;
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* flex-flow: column; */
    flex-wrap: nowrap;
    li {
      display: grid;
      grid-template-columns: 2rem auto;
      align-items: center;
      margin: 0.6rem 0rem;
      font-weight: 400;
      font-size: 0.9rem;
      cursor: pointer;
      color: rgb(122, 122, 160);
      padding-left: 1rem;
      position: relative;
      i {
        color: rgb(122, 122, 160);
        font-size: 1rem;
      }
    }
    li:hover {
      color: #fff;
      opacity: 0.8;
      i {
        color: #fff;
        opacity: 0.8;
      }
    }
  }

  .active {
    color: #fff !important;
    i {
      color: #fff !important;
    }
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 0.2rem;
      height: 100%;
      background: #fff;
      border-radius: 0rem 0.2rem 0.2rem 0rem;
      transition: all 0.4s ease-in-out;
    }
  }
  .bottom-nav {
    border: none;
    display: flex;
    justify-content: space-between;
    color: rgb(122, 122, 160) !important;
    .sign-out {
      border: none;
      font-size: 0.9rem;
      padding: 0.3rem;
      color: rgb(122, 122, 160) !important;
      background-color: rgb(32, 38, 44);
    }
    .sign-out:active,
    .sign-out:hover {
      cursor: pointer;
      color: white !important;
      transition: all 0.3s ease-in-out;
    }
    .export {
      border: none;
      font-size: 0.9rem;
      padding: 0.3rem;
      color: rgb(122, 122, 160) !important;
      background-color: rgb(32, 38, 44);
    }
    .export:active,
    .export:hover {
      cursor: pointer;
      color: white !important;
      transition: all 0.3s ease-in-out;
    }
  }
  @media (max-width: 1020px) {
    .user-con {
      h5 {
        font-size: 0.8rem;
      }
    }
    .menu-items {
      li {
        font-size: 0.8rem;
      }
    }
    .bottom-nav {
      gap: 0.3rem;
      .sign-out,
      .export {
        font-size: 0.8rem;
        padding: 0rem;
      }
    }
  }
  @media (max-width: 920px) {
    position: absolute;
    /* margin-top: 3rem;
    margin-left: 0.5rem; */
    top: 3.5rem;
    left: -12.1rem;
    border-top-left-radius: 0rem;
    height: 88%;
    z-index: 1;
    /* background-color: ${({ openn }) => (openn ? "blue" : "red")}; */
    transform: ${({ openn }) => (openn ? "translateX(100%)" : "translateX(0)")};
    transition: transform 0.3s ease-in-out;
    /* display: none; */
    .bottom-nav {
      gap: 0.5rem;
      .sign-out,
      .export {
        font-size: 0.8rem;
        padding: 0rem;
      }
    }
  }
`;

export default Navigation;
