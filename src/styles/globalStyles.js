import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`


  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

export const SpacerTiny = styled.div`
  height: 4px;
  width: 4px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-wrap: wrap;
  
  flex-direction: column;
  justify-content: center;
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  font-weight: 100;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: var(--primary-texta);
  font-size: 14px;
  line-height: 1.6;
  font-family: Arial, Helvetica, sans-serif;

  
  
`;

export const TextDescription2 = styled.p`
color: var(--primary-texta);
font-size: 18px;
line-height: 1.6;
text-decoration: underline;
  
  
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;