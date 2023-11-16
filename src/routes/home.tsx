import { styled } from "styled-components";
import RecordForm from "../components/record-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;

  grid-template-rows: 1fr 5fr;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function Home() {
  return (
    <Wrapper>
      <RecordForm />
      <Timeline />
    </Wrapper>
  );
}
