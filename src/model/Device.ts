import { Timestamp } from "firebase/firestore";

export interface Device {
  id: string;
  name: string;
  location: string;
  status: boolean;
  latestReading: Readings | null;
  readings: Readings[];
}

interface Readings {
  id: string;
  TDS: number;
  water_pH: number;
  water_temp: number;
  water_level: number;
  air_temp: number;
  air_humidity: number;
  timestamp: Timestamp;
}
