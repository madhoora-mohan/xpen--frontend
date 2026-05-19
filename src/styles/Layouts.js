import styled from "styled-components";

export const MainLayout = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: var(--nav-w) 1fr;
  background: var(--bg-deep);
  color: var(--fg);

  @media (max-width: 899px) {
    grid-template-columns: 1fr;
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
