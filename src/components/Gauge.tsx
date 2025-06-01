// components/Gauge.tsx
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
    // <div className="w-full h-auto">
    //   <GaugeComponent
    //     type="radial"
    //     // arc={{
    //     //   colorArray: ["#FF2121", "#FFD700", "#00FF15", "#FFD700", "#FF2121"],
    //     //   padding: 0.02,
    //     //   subArcs: [
    //     //     { limit: 40 },
    //     //     { limit: 60 },
    //     //     { limit: 70 },
    //     //     {},
    //     //     {},
    //     //   ]
    //     // }}
    //     arc={{
    //       width: 0.2,
    //       // gradient: true,
    //       colorArray: [
    //         'oklch(0.86 0.02 232.94)',
    //         'oklch(0.8 0.12 234.07)',
    //         'oklch(68.5% 0.169 237.323) ',
    //         'oklch(0.8 0.12 234.07)',
    //         'oklch(0.86 0.02 232.94)'
    //       ],
    //       // padding: 0.005,
    //       padding: 0.02,
    //       // cornerRadius: 1,
    //       // gradient: true,
    //       subArcs: [
    //         {
    //           limit: 200,
    //           // color: 'oklch(0.86 0.02 232.94)',
    //           showTick: true,
    //           // tooltip: {
    //           //   text: 'Too low temperature!'
    //           // },
    //         },
    //         {
    //           limit: 300,
    //           // color: 'oklch(0.8 0.12 234.07)',
    //           showTick: true,
    //           // tooltip: {
    //           //   text: 'Low temperature!'
    //           // }
    //         },
    //         {
    //           limit: 600,
    //           // color: 'oklch(68.5% 0.169 237.323) ',
    //           showTick: true,
    //           // tooltip: {
    //           //   text: 'OK temperature!'
    //           // }
    //         },
    //         {
    //           limit: 700,
    //           // color: 'oklch(0.8 0.12 234.07)',
    //           showTick: true,
    //           // tooltip: {
    //           //   text: 'High temperature!'
    //           // }
    //         },
    //         {
    //           // color: 'oklch(0.86 0.02 232.94)',
    //           // tooltip: {
    //           //   text: 'Too high temperature!'
    //           // }
    //         }
    //       ]
    //     }}
    //     pointer={{
    //       // type: "blob",
    //       // type: "arrow",
    //       animationDelay: 0,
    //     }}
    //     labels={{
    //       valueLabel: {
    //         formatTextValue: value => value + ' PPM',
    //         style: { textShadow: "none", fill: "var(--primary)", fontWeight: "bold" },
    //       },
    //       tickLabels: {
    //         type: 'outer',
    //         defaultTickValueConfig: {
    //           formatTextValue: (value: number) => `${value}`,
    //           // formatTextValue: (value: number) => value + 'PPM',
    //           style: { fontSize: 10 }
    //         },
    //         // ticks: [
    //         //   { value: 13 },
    //         //   { value: 22.5 },
    //         //   { value: 32 }
    //         // ],
    //       }
    //     }}
    //     value={value}
    //     minValue={0}
    //     maxValue={900}
    //   />
    // </div>

    // <div className="w-full h-auto">
    //   <GaugeComponent
    //     value={value}
    //     type="radial"
    //     labels={{
    //       valueLabel: {
    //         formatTextValue: value => `${value}`,
    //         style: { textShadow: "none", fill: "var(--primary)", fontWeight: "bold" },
    //         // oklch(0.47 0 0)
    //         // matchColorWithArc: true,
    //         // hide: true
    //       },
    //       tickLabels: {
    //         type: "inner",
    //         ticks: [
    //           { value: 20 },
    //           { value: 40 },
    //           { value: 60 },
    //           { value: 80 },
    //           { value: 100 }
    //         ],
    //         defaultTickValueConfig: {
    //           formatTextValue: (value: number) => `${value}`,
    //           // formatTextValue: (value: number) => value + 'PPM',
    //           style: { fontSize: 10 }
    //         }
    //       }
    //       //       tickLabels: {
    //       //         type: 'outer',
    //       //         defaultTickValueConfig: {
    //       //           formatTextValue: (value: number) => `${value}`,
    //       //           // formatTextValue: (value: number) => value + 'PPM',
    //       //           style: { fontSize: 10 }
    //       //         },
    //     }}
    //     arc={{
    //       colorArray: [
    //         'oklch(0.86 0.02 232.94)',
    //         'oklch(0.8 0.12 234.07)',
    //         'oklch(68.5% 0.169 237.323) ',
    //         'oklch(0.8 0.12 234.07)',
    //         'oklch(0.86 0.02 232.94)'
    //       ],
    //       subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
    //       padding: 0.02,
    //       width: 0.2
    //     }}
    //     pointer={{
    //       type: "needle",
    //       elastic: true,
    //       animationDelay: 0,
    //       length: 0.5,
    //     }}
    //   />
    // </div>

    <div className="w-full h-auto -mt-2">
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
