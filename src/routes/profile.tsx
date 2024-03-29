import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { IRecord } from "../components/timeline";
import Record from "../components/record";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Wrapper = styled.section`
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 20px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  font-size: 22px;
`;

const TopDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #aaa1ff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
`;

const Main = styled.main`
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #f9f9f9;
    border-radius: 50px;
  }
`;

const Records = styled.article`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [records, setRecords] = useState<IRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      // user avatar를 저장할 수 있는 ref 생성
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      // 이미지 url을 얻어 유저 프로필 업데이트
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const fetchRecords = async () => {
    let recordQuery;

    if (selectedDate) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      recordQuery = query(
        collection(db, "records"),
        where("userId", "==", user?.uid),
        where("createdAt", ">=", startOfDay),
        where("createdAt", "<=", endOfDay),
        orderBy("createdAt", "desc"),
        limit(10)
      );
    } else {
      recordQuery = query(
        collection(db, "records"),
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc"),
        limit(10)
      );
    }

    const snapshot = await getDocs(recordQuery);
    const records = snapshot.docs.map((doc) => {
      const { record, createdAt, userId, username, photo } = doc.data();
      return {
        record,
        createdAt: createdAt.toDate(),
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setRecords(records);
  };
  useEffect(() => {
    fetchRecords();
  }, [selectedDate]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <Wrapper>
      <TopDiv>
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
            <AvatarImg src={avatar} />
          ) : (
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          )}
        </AvatarUpload>
        <AvatarInput
          onChange={onAvatarChange}
          id="avatar"
          type="file"
          accept="image/*"
        />
        <Name>{user?.displayName ?? "Anonymous"}</Name>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
        />
      </TopDiv>
      <Main>
        <Records>
          {records.map((record) => (
            <Record key={record.id} {...record} />
          ))}
        </Records>
      </Main>
    </Wrapper>
  );
}
