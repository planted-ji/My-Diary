import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Record from "./record";
import { Unsubscribe } from "firebase/auth";

export interface IRecord {
  id: string;
  photo?: string;
  record: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  // Record 배열의 기본값이 빈 배열임을 알려줌
  const [records, setRecord] = useState<IRecord[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchRecords = async () => {
      // 쿼리 생성
      const recordsQuery = query(
        collection(db, "records"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      /*  
       const spanshot = await getDocs(recordsQuery);
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
        */
      // 이벤트 리스너 연결
      unsubscribe = await onSnapshot(recordsQuery, (snapshot) => {
        const records = snapshot.docs.map((doc) => {
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
      });
    };
    fetchRecords();
    // timeline 컴포넌트가 사용되지 않을 때 해당 함수 호출
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {records.map((record) => (
        <Record key={record.id} {...record} />
      ))}
    </Wrapper>
  );
}
