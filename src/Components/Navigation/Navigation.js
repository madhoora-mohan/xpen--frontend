import React, { useEffect } from "react";
import styled from "styled-components";
import avatar from "../../img/avatar.png";
import { signout, fileexport, refresh } from "../../utils/Icons";
import { menuItems } from "../../utils/menuItems";
import { useGlobalContext } from "../../context/globalContext";
import { formatRupee } from "../../utils/currency";

const STRIPPED_EXPORT_FIELDS = ["email", "__v", "createdAt", "updatedAt"];

function exportToCSV(rows, filename) {
  if (!rows.length) {
    alert("Nothing to export yet.");
    return;
  }
  const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Navigation({ active, setActive, openn }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    window.location.reload();
  };

  const {
    totalBalance,
    setError,
    incomes,
    expenses,
    getIncomes,
    getExpenses,
  } = useGlobalContext();

  const username = localStorage.getItem("username");
  const emailid = localStorage.getItem("email");

  useEffect(() => {
    getIncomes();
    getExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailid]);

  const handleReload = () => {
    getIncomes();
    getExpenses();
  };

  const handleExport = () => {
    const all = [...incomes, ...expenses];
    const data = all.map((row) => {
      const copy = { ...row };
      STRIPPED_EXPORT_FIELDS.forEach((f) => delete copy[f]);
      return copy;
    });
    exportToCSV(data, `${username} Data ${Date()}.csv`);
  };

  return (
    <NavStyled openn={openn}>
      <button
        className="reload"
        onClick={handleReload}
        title="Reload data"
        aria-label="Reload data"
      >
        {refresh}
      </button>
      <div className="user-con">
        <img src={avatar} alt="" />
        <div className="text">
          <h5>{username}</h5>
          <h5>Savings: {formatRupee(totalBalance())}</h5>
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
  position: relative;
  padding: 0.8rem 0.8rem;
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
  .reload {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: transparent;
    border: none;
    color: rgb(122, 122, 160);
    cursor: pointer;
    font-size: 1rem;
    padding: 0.3rem;
    border-radius: 0.3rem;
    z-index: 1;
    &:hover {
      color: #fff;
      transition: color 0.2s ease-in-out;
    }
  }
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
    top: 3.5rem;
    left: -12.1rem;
    border-top-left-radius: 0rem;
    height: 88%;
    z-index: 1;
    transform: ${({ openn }) => (openn ? "translateX(100%)" : "translateX(0)")};
    transition: transform 0.3s ease-in-out;
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
