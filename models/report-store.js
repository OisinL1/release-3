import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { stationStore } from "./station-store.js";

const db = initStore("reports");

export const reportStore = {
  async getAllReports() {
    await db.read();
    return db.data.reports;
  },

  async addReport(stationId, report) {
    await db.read();
    report._id = v4();
    report.stationid = stationId;
    db.data.reports.push(report);
    await db.write();
    return report;
  },

  async getReportsByStationId(id) {
    await db.read();
    return db.data.reports.filter((report) => report.stationid === id);
  },

  async getReportById(id) {
    await db.read();
    return db.data.reports.find((report) => report._id === id);
  },

  async deleteReport(id) {
    await db.read();
    const index = db.data.reports.findIndex((report) => report._id === id);
    db.data.reports.splice(index, 1);
    await db.write();
  },

  async deleteAllReports() {
    db.data.reports = [];
    await db.write();
  },

  async updateReport(report, updatedReport) {
    report.code = updatedReport.code;
    report.temp = updatedReport.temp;
    report.wind_speed = updatedReport.wind_speed;
    report.pressure = updatedReport.pressure;
    report.wind_direction = updatedReport.wind_direction
    await db.write();
  },

  async getLatestReport(id) {
    await db.read();
    const list =  db.data.reports.filter((report) => report.stationid === id);
    return list.pop();
  },



  async getMaxReport(stationId, field) {
    await db.read();
    const list = db.data.reports.filter((report) => report.stationid === stationId);
  
    
  
    let maxReport = list[0];
    for (const report of list) {
      if (report[field] > maxReport[field]) {
        maxReport = report;
      }
    }
  
    return maxReport; 
  },
  
  async getMinReport(stationId, field) {
    await db.read();
    const list = db.data.reports.filter((report) => report.stationid === stationId);
  
    
  
    let minReport = list[0];
    for (const report of list) {
      if (report[field] < minReport[field]) {
        minReport = report;
      }
    }
  
    return minReport ; 
  },

  async getIconCode(weatherCode) {
    
    const codeString = weatherCode.toString();

    
    const firstDigit = codeString.charAt(0);

    let iconCode;

    if (firstDigit === '2') {
      //Thunderstorm
      iconCode = "11d";
    } else if (firstDigit === '3') {
      // Drizzle
      iconCode = "09d";
    } else if (firstDigit === '5') {
      // Rain
      iconCode = "10d";
    } else if (firstDigit === '6') {
      // Snow
      iconCode = "13d";
    } else if (firstDigit === '7') {
      // Atmosphere
      iconCode = "50d";
    } else if (firstDigit === '8') {
      if (codeString === "800") {
        // Clear sky
        iconCode = "01d";
      } else {
        // Clouds 
        iconCode = "02d";
      }
    } else {
      // Default icon code 
      iconCode = "01d";
    }

    return iconCode;
  },

  async getWeather(weatherCode) {
    
    const codeString = weatherCode.toString();

    
    const firstDigit = codeString.charAt(0);

    let weather;

    if (firstDigit === '2') {
      // Thunderstorm
      weather = "Thunderstrom";
    } else if (firstDigit === '3') {
      // Drizzle
      weather = "Drizzle";
    } else if (firstDigit === '5') {
      // Rain
      weather = "Rain";
    } else if (firstDigit === '6') {
      // Snow
      weather = "Snow";
    } else if (firstDigit === '7') {
      // Atmosphere 
      weather = "Atmosphere";
    } else if (firstDigit === '8') {
      if (codeString === "800") {
        // Clear sky
        weather = "Clear Sky";
      } else {
        // Clouds 
        weather = "Clouds";
      }
    } else {
      // Default weather
      weather = "Default";
    }

    return weather;
  },
};
