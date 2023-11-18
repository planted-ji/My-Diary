import { styled } from "styled-components";
import { IRecord } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.article`
  display: grid;
  grid-template-columns: 3fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin: 0 20px 0 20px;
  background-color: rgba(255, 255, 255, 0.8);
  word-break: keep-all;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MainRecord = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 15px 0 10px 0;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin-bottom: 5px;
`;

const Username = styled.span`
  font-size: 14px;
  color: #845f99;
`;

const Date = styled.time`
  font-size: 10px;
  line-height: 120%;
  color: #514f66;
`;

const Payload = styled.p`
  font-size: 16px;
  line-height: 130%;
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
  border: 0;
  font-family: "NPSfontBold";
  font-size: 12px;
  line-height: 110%;
  padding: 8px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin: 0 10px;
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
  const [isDeleted, setIsDeleted] = useState(false); // 삭제 여부 상태 추가

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
      // 상태 업데이트로 컴포넌트 리렌더링
      setIsDeleted(true);
    } catch (e) {
      console.log(e);
    }
  };

  // 삭제된 경우 UI에 아무것도 표시하지 않음
  if (isDeleted) {
    return null;
  }

  return (
    <Wrapper>
      <Username>{username}</Username>
      <MainRecord>
        <Payload>{record}</Payload>
        {photo ? <Photo src={photo} /> : null}
      </MainRecord>
      <Div>
        <Date>{createdAt.toLocaleString()}</Date>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>삭제</DeleteButton>
        ) : null}
      </Div>
    </Wrapper>
  );
}
