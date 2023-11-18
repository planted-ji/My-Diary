import { styled } from "styled-components";

export const Wrapper = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 420px;
`;

export const Title = styled.h1`
  font-size: 42px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
`;

export const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  transition: all 0.2s;
  &[type="submit"] {
    cursor: pointer;
    background-color: #aaa1ff;
    color: white;
    &:hover {
      background-color: #8578ff;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  a {
    color: #ffde8f;
  }
`;
