import { styled } from "styled-components";
import { IRecord } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin: 0 20px 0 20px;
  background-color: rgba(255, 255, 255, 0.8);
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Section = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: #845f99;
`;

const Date = styled.time`
  font-size: 11px;
  color: #514f66;
`;

const Payload = styled.p`
  margin: 15px 0 10px 0;
  font-size: 18px;
  color: #514f66;
  margin-right: 10px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  &:hover {
    background-color: #db462b;
  }
  transition: all 0.2s;
  color: white;
  font-weight: 600;
  border: 0;
  font-family: "NPSfontBold";
  font-size: 12px;
  padding: 8px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
`;

export default function Record({
  username,
  photo,
  record,
  userId,
  id,
  createdAt,
}: IRecord) {
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("정말 이 기록을 삭제하시겠습니까?");
    // 로그인 유저 ID와 작성자 ID가 다를 경우, 함수 종료
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "records", id));
      if (photo) {
        const photoRef = ref(storage, `records/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{record}</Payload>
        <Section>
          <Date>{createdAt.toLocaleString()}</Date>
          {user?.uid === userId ? (
            <DeleteButton onClick={onDelete}>삭제</DeleteButton>
          ) : null}
        </Section>
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
