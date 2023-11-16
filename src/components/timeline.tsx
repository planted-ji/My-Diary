import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Record from "./record";

export interface IRecord {
  id: string;
  photo?: string;
  record: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  // Record 배열의 기본값이 빈 배열임을 알려줌
  const [records, setRecord] = useState<IRecord[]>([]);
  const fetchRecords = async () => {
    const recordsQuery = query(
      collection(db, "records"),
      orderBy("createdAt", "desc")
    );
    const spanshot = await getDocs(recordsQuery);
    // map 함수를 통해 record 배열 안에 return 값 저장
    const records = spanshot.docs.map((doc) => {
      const { record, createdAt, userId, username, photo } = doc.data();
      return {
        record,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    // record 배열을 상태에 저장
    setRecord(records);
  };
  useEffect(() => {
    fetchRecords();
  }, []);
  return (
    <Wrapper>
      {records.map((record) => (
        <Record key={record.id} {...record} />
      ))}
    </Wrapper>
  );
}
