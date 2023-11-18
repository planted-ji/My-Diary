import { styled } from "styled-components";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  margin-top: 50px;
  background-color: white;
  transition: all 0.2s;
  &:hover {
    opacity: 0.8;
  }
  font-family: "NPSfontBold";
  font-size: 15px;
  width: 100%;
  color: #000;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function googleButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button type="button" onClick={onClick}>
      <Logo src="/google-logo.svg"></Logo>
      구글 계정으로 시작하기
    </Button>
  );
}
