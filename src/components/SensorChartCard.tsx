import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

// Props: title, average, data (array of { timestamp: string | Date, value: number })
export function SensorChartCard({ title, average, data }: {
  title: string,
  average: number,
  data: { timestamp: string | Date, value: number }[]
}) {
  const formattedData = data.map(item => ({
    name: typeof item.timestamp === "string" ? format(new Date(item.timestamp), "dd/MM HH:mm") : format(item.timestamp, "dd/MM HH:mm"),
    value: item.value
  }))

  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold">{average.toLocaleString()}</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={formattedData}>
            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax + 50']} />
            <Tooltip
              labelClassName="text-xs"
              formatter={(value: number) => `${value}`}
              labelFormatter={(label) => `Waktu: ${label}`}
            />
            <Line type="monotone" dataKey="value" stroke="#000" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
