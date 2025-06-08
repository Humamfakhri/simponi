"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import React from "react";
import Sidebar from "@/components/Sidebar";

// Data dummy
const sampleData = [
  { time: "08:00", value: 10 },
  { time: "09:00", value: 15 },
  { time: "10:00", value: 12 },
  { time: "11:00", value: 20 },
  { time: "12:00", value: 17 },
];

// Konfigurasi 6 sensor
const sensors = [
  { name: "pH Air", color: "#8884d8" },
  { name: "TDS", color: "#82ca9d" },
  { name: "Suhu Air", color: "#ffc658" },
  { name: "Suhu Udara", color: "#ff7300" },
  { name: "Kelembapan Udara", color: "#00c49f" },
  { name: "Ketinggian Air", color: "#0088fe" },
];

export default function HistoriPage() {
  return (
    <main className="min-h-screen bg-main py-8">
      <div className="container mx-auto mt-20 lg:mt-24 lg:mb-8">
        <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
          <Sidebar />
          <div className="grow w-full lg:w-fit px-2 lg:px-0">
            <h1 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">Histori Sensor</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sensors.map((sensor) => (
                <div key={sensor.name} className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-md">
                  <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">{sensor.name}</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={sampleData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke={sensor.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
