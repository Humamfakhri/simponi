"use client"

import dynamic from "next/dynamic"
import React from "react"
import { SubArc, Tick } from "react-gauge-component";

// Dynamically import the gauge component (no SSR)
const GaugeComponent = dynamic(() => import("react-gauge-component"), { ssr: false })

interface GaugeProps {
  value: number | undefined;
  ticks: Tick[];
  minValue: number;
  maxValue: number;
  subArcs: SubArc[]
}

const Gauge: React.FC<GaugeProps> = ({ value, ticks, minValue, maxValue, subArcs }: GaugeProps) => {
  return (
    <div className="w-full max-w-[275px] h-auto -mt-2">
    {/* <div className="w-full h-auto -mt-2"> */}
      <GaugeComponent
        type="semicircle"
        arc={{
          colorArray: [
            'oklch(0.86 0.02 232.94)',
            // 'oklch(0.8 0.12 234.07)',
            // 'oklch(68.5% 0.169 237.323) ',
            'oklch(76.5% 0.177 163.223)',
            // 'oklch(0.8 0.12 234.07)',
            'oklch(0.86 0.02 232.94)'
          ],
          padding: 0.02,
          subArcs: subArcs
        }}
        pointer={{ type: "blob", animationDelay: 0 }}
        value={value}
        minValue={minValue}
        maxValue={maxValue}
        labels={{
          valueLabel: {
            formatTextValue: value => `${value}`,
            // style: { textShadow: "none", fontWeight: "900" },
            style: { textShadow: "none", fontWeight: "900", fontSize: 44 },
            // oklch(0.47 0 0)
            matchColorWithArc: true,
            // hide: true
          },
          tickLabels: {
            type: "inner",
            ticks: ticks,
            defaultTickValueConfig: {
              formatTextValue: (value: number) => `${value}`,
              // formatTextValue: (value: number) => value + 'PPM',
              style: { fontSize: 10 }
            }
          }
        }}
      />
    </div>
  )
}

export default Gauge
