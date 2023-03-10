import styled from "styled-components";

export const MainLayout = styled.div`
  padding: 1.5rem;
  height: 100%;
  display: flex;
  gap: 1.5rem;
  @media (max-width: 920px) {
    gap: 0px;
    padding-left: 0rem;
    padding-bottom: 0rem;
  }
`;

export const InnerLayout = styled.div`
  padding: 1.5rem 1rem;
  /* width: 100%; */
`;
