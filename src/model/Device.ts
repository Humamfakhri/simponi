import { Timestamp } from "firebase/firestore";

export interface Device {
  id: string;
  name: string;
  owner: string;
  isShareable: boolean;
  isDebug: boolean;
  sharedWith: string[];
  location: string;
  status: boolean;
  latestReading: Readings | null;
  readings: Readings[];
  note: string;
  sensorConfig: SensorConfig;
}

interface Readings {
  id: string;
  TDS: number;
  water_pH: number;
  water_temp: number;
  water_level: number;
  air_temp: number;
  air_humidity: number;
  ldr: number;
  timestamp: Timestamp;
}

export interface SensorConfig {
  TDS_offset_voltage: number;
  ph4: number;
  ph7: number;
  ph9: number;
  water_level_height: number;
}