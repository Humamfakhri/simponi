import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"

export default function LineChartWithXAxisPadding() {
  const data = [
    {
      name: 'Page A',
      minTds: 7500,
      pv: 2400,
      maxTds: 2500,
    },
    {
      name: 'Page B',
      minTds: 7500,
      pv: 1398,
      maxTds: 2500,
    },
    {
      name: 'Page C',
      minTds: 7500,
      pv: 9800,
      maxTds: 2500,
    },
    {
      name: 'Page D',
      minTds: 7500,
      pv: 3908,
      maxTds: 2500,
    },
    {
      name: 'Page E',
      minTds: 7500,
      pv: 4800,
      maxTds: 2500,
    },
    {
      name: 'Page F',
      minTds: 7500,
      pv: 3800,
      maxTds: 2500,
    },
    {
      name: 'Page G',
      minTds: 7500,
      pv: 4300,
      maxTds: 2500,
    },
  ];
  return (
    <ResponsiveContainer width="100%" className={"min-h-[300px]"}>
      <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="" vertical={false} stroke="#ccc" strokeWidth={0.3} />
      <XAxis
        stroke="#888"
        strokeWidth="0"
        fontSize={12}
        dataKey="name"
        padding={{ left: 30, right: 30 }}
        tickMargin={16}
        tickLine={false}
      />
      <YAxis
        stroke="#888"
        fontSize={12}
        tickLine={false}
        axisLine={false} />
      <Tooltip />
      {/* <Legend /> */}
      {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
      <Line type="monotone" dataKey="pv" stroke="#0f172b" strokeWidth={2} activeDot={{ r: 4 }} dot={{ r: 3, fill: "#0f172b" }} />
      <Line type="monotone" dataKey="minTds" stroke="#00bc7d" dot={false} opacity={0.7}/>
      <Line type="monotone" dataKey="maxTds" stroke="#00bc7d" dot={false} opacity={0.7}/>
      </LineChart>
    </ResponsiveContainer>
  )
}
