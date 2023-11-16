import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { Timestamp, addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AddFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AddFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function recordForm() {
  const [isLoading, setLoading] = useState(false);
  const [record, setRecord] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRecord(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // auth에서 현재 사용자를 요청해 user 변수에 저장
    const user = auth.currentUser;
    if (!user || isLoading || record === "" || record.length > 180) return;

    try {
      setLoading(true);
      // 새로운 document를 생성하는 Firebase 함수
      const createdAt = Timestamp.now();
      const doc = await addDoc(collection(db, "records"), {
        record,
        createdAt,
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `records/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        // 업로드한 사진의 url 반환
        const url = await getDownloadURL(result.ref);
        // record doc에 이미지 url 저장
        await updateDoc(doc, {
          photo: url,
        });
      }
      setRecord("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={record}
        placeholder="무슨 일이 일어나고 있나요?"
      ></TextArea>
      <AddFileButton htmlFor="file">
        {file ? "업로드 완료 ✅" : "이미지 업로드"}
      </AddFileButton>
      <AddFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn type="submit" value={isLoading ? "입력 중..." : "등록하기"} />
    </Form>
  );
}
