"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

const HydroponicDashboard = () => {
  const [tdsData, setTdsData] = useState<number[]>([])
  const [phData, setPhData] = useState<number[]>([])
  const [waterLevelData, setWaterLevelData] = useState<number[]>([])
  const [timeSeconds, setTimeSeconds] = useState<number[]>([])

  const [currentTds, setCurrentTds] = useState<number>(0)
  const [currentPh, setCurrentPh] = useState<number>(0)
  const [currentWaterLevel, setCurrentWaterLevel] = useState<number>(0)

  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newTdsValue = parseFloat((Math.random() * (1500 - 500) + 500).toFixed(2))
      const newPhValue = parseFloat((Math.random() * (6.5 - 5.5) + 5.5).toFixed(2))
      const newWaterLevelValue = parseFloat((Math.random() * (30 - 10) + 10).toFixed(2))

      setCurrentTds(newTdsValue)
      setCurrentPh(newPhValue)
      setCurrentWaterLevel(newWaterLevelValue)

      setTimeSeconds((prev) => [...prev.slice(-9), counter])
      setTdsData((prev) => [...prev.slice(-9), newTdsValue])
      setPhData((prev) => [...prev.slice(-9), newPhValue])
      setWaterLevelData((prev) => [...prev.slice(-9), newWaterLevelValue])

      setCounter((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [counter])

  const chartData = timeSeconds.map((time, index) => ({
    time,
    tds: tdsData[index],
    ph: phData[index],
    waterLevel: waterLevelData[index],
  })).filter(Boolean)

  return (
    <div className="bg-black text-white p-5 min-h-screen overflow-x-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Hydroponic Plant Monitoring Dashboard</CardTitle>
          <CardDescription className="text-center">Real-time monitoring of TDS, pH levels, and water levels for one hydroponic plant</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-left font-bold">Current Readings</h2>
          <div className="flex flex-wrap justify-between mt-4">
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">TDS (ppm):</span> {currentTds.toFixed(2)}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">pH Level:</span> {currentPh.toFixed(2)}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">Water Level (cm):</span> {currentWaterLevel.toFixed(2)}
            </div>
          </div>

          {/* Graphs Container */}
          <div className="flex flex-wrap justify-between mt-4">
            {/* Chart for TDS */}
            <div className="flex-1 min-w-[300px] max-w-full mb-4"> 
              <h3 className="text-center font-bold">TDS Over Time</h3>
              <div className="overflow-hidden">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={chartData.map(({ time, tds }) => ({ time, tds })).filter(Boolean)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      label={{ value: 'Seconds', position: 'insideBottom', offset: -25, textAnchor: 'middle' }}
                    />
                    <YAxis 
                      label={{ value: 'TDS (ppm)', angle: -90, position: 'insideLeft', offset: 0 }} // Set offset to 0 for consistency
                    />
                    <Area type="monotone" dataKey="tds" fill="blue" stroke="blue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart for pH Level and Water Level */}
            <div className="flex-1 min-w-[300px] max-w-full mb-4">
              <h3 className="text-center font-bold">pH Level and Water Level Over Time</h3>
              <div className="overflow-hidden">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={chartData.map(({ time, ph, waterLevel }) => ({ time, ph, waterLevel })).filter(Boolean)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      label={{ value: 'Seconds', position: 'insideBottom', offset: -25, textAnchor: 'middle' }}
                    />
                    <YAxis 
                      label={{ value: 'Values', angle: -90, position: 'insideLeft', offset: 0 }} // Set offset to 0 for consistency
                    />
                    <Area type="monotone" dataKey="ph" fill="green" stroke="green" />
                    <Area type="monotone" dataKey="waterLevel" fill="orange" stroke="orange" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                January - June 2024
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default HydroponicDashboard