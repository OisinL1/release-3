import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { stationStore } from "./station-store.js";

const db = initStore("reports"); // Initialize database for reports

export const reportStore = {
  async getAllReports() {
    await db.read();        //read data from databse
    return db.data.reports; //return all reports
  },

  async addReport(stationId, report) { 
    await db.read();    //read the database
    report._id = v4();  //create id for report
    report.stationid = stationId; //assign station id to report
    db.data.reports.push(report); //put report to the end of the list
    await db.write();             // write new report back to the data base
    return report;                // return the report
  },

  async getReportsByStationId(id) {
    await db.read();  //check the database
    return db.data.reports.filter((report) => report.stationid === id); //filter reports by station id and return the list of reports with stationid
  },

  async getReportById(id) {
    await db.read(); //read database
    return db.data.reports.find((report) => report._id === id); //find report with corect id and return it
  },

  async deleteReport(id) {
    await db.read(); //check data base
    const index = db.data.reports.findIndex((report) => report._id === id); //find report by id
    db.data.reports.splice(index, 1); //remove report from list
    await db.write(); //update database
  },

  async deleteAllReports() {
    db.data.reports = []; //empty reports list
    await db.write();     //write back to database
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
    await db.read(); //read database
    const list =  db.data.reports.filter((report) => report.stationid === id); //filter reports by stationid 
    return list.pop(); //return station from the end of the list (latest report)
  },



  async getMaxReport(stationId, field) {
    await db.read(); //read database
    const list = db.data.reports.filter((report) => report.stationid === stationId); //filter reports by station id
  
    
  
    let maxReport = list[0]; 
    for (const report of list) { //iterate through every report
      if (report[field] > maxReport[field]) { //if field is bigger in a report make it the new max report
        maxReport = report; 
      }
    }
  
    return maxReport; 
  },
  
  async getMinReport(stationId, field) {
    await db.read();
    const list = db.data.reports.filter((report) => report.stationid === stationId);
  
    
  
    let minReport = list[0];
    for (const report of list) { //iterate through every report
      if (report[field] < minReport[field]) { //if field is smaller in a report make it the new max report
        minReport = report;
      }
    }
  
    return minReport ; 
  },

  async getIconCode(weatherCode) {
    
    const codeString = weatherCode.toString(); //get weathercode as a string

    
    const firstDigit = codeString.charAt(0); //get the first character

    let iconCode;

    if (firstDigit === '2') {   //use first digit to differentiate between different weather types
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
    
    const codeString = weatherCode.toString(); //get weather code as a string

    
    const firstDigit = codeString.charAt(0);  //get the first character and use it to differentiate between weather types

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
