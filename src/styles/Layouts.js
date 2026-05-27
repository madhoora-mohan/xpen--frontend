import styled from "styled-components";

export const MainLayout = styled.div`
  display: grid;
  grid-template-columns: var(--nav-w) 1fr;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-deep);
  color: var(--fg);

  @media (max-width: 899px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
`;

export const InnerLayout = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: var(--s-6);

  @media (max-width: 899px) {
    padding: var(--s-4) var(--s-4) calc(var(--s-10) + var(--s-6));
  }
`;
