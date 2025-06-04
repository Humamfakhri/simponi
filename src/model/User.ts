import { Timestamp } from "firebase/firestore";

export interface User {
  name: string;
  email: string;
  // devices: string[];
  createdAt: Timestamp;
}

export type SharedUser = {
  uid: string;
  name: string;
  email: string;
};