"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import React from "react";

const HydroTrack = () => {
  const [tdsData, setTdsData] = useState<
    Array<{ time: number; value: number }>
  >([]);
  const [phData, setPhData] = useState<Array<{ time: number; value: number }>>(
    []
  );
  const [turbidityData, setTurbidityData] = useState<
    Array<{ time: number; value: number }>
  >([]);

  const [currentTds, setCurrentTds] = useState<number>(0);
  const [currentPh, setCurrentPh] = useState<number>(0);
  const [currentTurbidity, setCurrentTurbidity] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    let startTime = Date.now();

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data = event.data;
      console.log("Raw data:", data);

      try {
        // Try to parse as an array if the data is a pH reading
        if (data.includes("pH")) {
          const matches = data.match(/pH\s*:\s*(\d+\.?\d*)/);

          if (matches) {
            const pH = parseFloat(matches[1]);
            const currentTime = (Date.now() - startTime) / 1000;
            setCurrentPh(pH);
            setPhData((prev) => {
              const newData = [...prev, { time: currentTime, value: pH }];
              return newData.slice(-10);
            });
          }
        }
        // Try to parse TDS reading
        else if (data.includes("TDS")) {
          const matches = data.match(/TDS\s*:\s*(\d+\.?\d*)/);
          if (matches) {
            const tds = parseFloat(matches[1]);
            const currentTime = (Date.now() - startTime) / 1000;

            setCurrentTds(tds);
            setTdsData((prev) => {
              const newData = [...prev, { time: currentTime, value: tds }];
              return newData.slice(-10);
            });
          }
        }
        // Try to parse Turbidity reading
        else if (data.includes("Turbidity")) {
          const matches = data.match(/Turbidity\s*:\s*(\d+)/);
          if (matches) {
            const turbidity = parseInt(matches[1], 10);
            const currentTime = (Date.now() - startTime) / 1000;

            setCurrentTurbidity(turbidity);
            setTurbidityData((prev) => {
              const newData = [
                ...prev,
                { time: currentTime, value: turbidity },
              ];
              return newData.slice(-10);
            });
          }
        }
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleDownload = () => {
    const reportUrl =
      "https://github.com/nihaarikha-04/mpmc_dashboard/raw/main/assets/WaterMonitorSystem.pdf";
    const link = document.createElement("a");
    link.href = reportUrl;
    link.download = "WaterMonitor.pdf";
    link.click();
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`p-5 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-end mb-4">
        <Button
          onClick={toggleDarkMode}
          className={isDarkMode ? "bg-white text-black" : "bg-black text-white"}
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
      </div>

      <Card className={isDarkMode ? "bg-gray-800" : ""}>
        <CardHeader>
          <CardTitle className="text-center">
            Water Quality Monitoring System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-left font-bold">Current Readings</h2>
          <div className="flex flex-wrap justify-between mt-4">
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">TDS (ppm):</span>{" "}
              {currentTds.toFixed(2)}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">pH Level:</span>{" "}
              {currentPh.toFixed(2)}
            </div>
            <div className="metric-card text-left flex-1 min-w-[150px]">
              <span className="font-bold">Turbidity:</span>{" "}
              {currentTurbidity.toFixed(2)}
            </div>
          </div>

          <div className="flex flex-wrap justify-between mt-4">
            {/* TDS Chart */}
            <div className="flex-1 min-w-[300px] max-w-full mb-4">
              <h3 className="text-center font-bold">TDS Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={tdsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#444" : "#ccc"}
                  />
                  <XAxis
                    dataKey="time"
                    label={{ value: "Time (s)", position: "bottom" }}
                    stroke={isDarkMode ? "#fff" : "#000"}
                  />
                  <YAxis
                    label={{
                      value: "TDS (ppm)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    stroke={isDarkMode ? "#fff" : "#000"}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="#0088FE"
                    stroke="#0088FE"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* pH Chart */}
            <div className="flex-1 min-w-[300px] max-w-full mb-4">
              <h3 className="text-center font-bold">pH Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={phData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#444" : "#ccc"}
                  />
                  <XAxis
                    dataKey="time"
                    label={{ value: "Time (s)", position: "bottom" }}
                    stroke={isDarkMode ? "#fff" : "#000"}
                  />
                  <YAxis
                    label={{
                      value: "pH Level",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    stroke={isDarkMode ? "#fff" : "#000"}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="#00C49F"
                    stroke="#00C49F"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Turbidity Chart */}
            <div className="flex-1 min-w-[300px] max-w-full mb-4">
              <h3 className="text-center font-bold">Turbidity Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={turbidityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#444" : "#ccc"}
                  />
                  <XAxis
                    dataKey="time"
                    label={{ value: "Time (s)", position: "bottom" }}
                    stroke={isDarkMode ? "#fff" : "#000"}
                  />
                  <YAxis
                    label={{
                      value: "Turbidity",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    stroke={isDarkMode ? "#fff" : "#000"}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill="#FF8042"
                    stroke="#FF8042"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-lg font-medium text-center">
          The Repository with the Report is given below for further
          acknowledgments.
        </p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleDownload}
            className={
              isDarkMode ? "text-white border-white" : "text-black border-black"
            }
          >
            Download Project Report
          </Button>
          <a
            href="https://github.com/nihaarikha-04/mpmc_dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className={
                isDarkMode ? "bg-white text-black" : "bg-black text-white"
              }
            >
              <GitHubLogoIcon className="mr-2" /> View on GitHub
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HydroTrack;
