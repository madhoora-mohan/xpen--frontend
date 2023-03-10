// import { React, useState } from "react";
// import styled from "styled-components";

// const LeftNav = () => {
//   const [openn, setopenn] = useState(false);
//   return (
//     <>
//       <StyledLeftNav openn={openn} onClick={() => setopenn(!openn)}>
//         <div />
//         <div />
//         <div />
//       </StyledLeftNav>
//     </>
//   );
// };

// const StyledLeftNav = styled.div`
//   height: 1.8rem;
//   display: none;
//   justify-content: space-evenly;
//   flex-flow: column nowrap;
//   margin-left: 1rem;
//   position: absolute;
//   z-index: 1000000;
//   /* margin-top: -0.7rem; */

//   div {
//     width: 1.4rem;
//     height: 0.2rem;
//     background-color: white;
//     border-radius: 5px;
//     transform-origin: 0.001rem;
//     transition: all 0.3s linear;

//     &:nth-child(1) {
//       transform: ${({ openn }) => (openn ? "rotate(45deg)" : "rotate(0)")};
//     }
//     &:nth-child(2) {
//       transform: ${({ openn }) =>
//         openn ? "translateX(100%)" : "translateX(0)"};
//       opacity: ${({ openn }) => (openn ? 0 : 1)};
//     }
//     &:nth-child(3) {
//       transform: ${({ openn }) => (openn ? "rotate(-45deg)" : "rotate(0)")};
//     }
//   }
//   @media (max-width: 920px) {
//     display: flex;
//     margin-left: 2rem;
//     margin-top: -0.5rem;
//   }
// `;
// export default LeftNav;
