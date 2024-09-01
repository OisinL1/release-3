/**
 * stationController.js
 * This module contains the controller for handling the requests for individual stations.
 *  It retrieves and displays details of a specific station based on its ID.
 *  It also handles adding, deleting and displaying reports. 
 *  It carries out the logic for summary view.
 */
import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const stationController = {
    // Index method handles requests for displaying a station and its reports
    async index(request, response) {
        // Retrieve the station by its ID from the request parameters
        const station = await stationStore.getStationById(request.params.id);
        const reports = await reportStore.getReportsByStationId(request.params.id);  //get all reports for the station
        const hasReports = reports.length > 0; //boolean to check for reports
      
        let iconCode = "01d"; 
        let weather = "";
      
        
        if (reports.length > 0) { //if reports are present then all fields are found
          const latestReport = await reportStore.getLatestReport(request.params.id); 
          const weather = await reportStore.getWeather(latestReport.code.toString());
          const iconCode = await reportStore.getIconCode(latestReport.code.toString());
          
          
          const maxTempReport = await reportStore.getMaxReport(request.params.id, 'temp');
        
          const minTempReport = await reportStore.getMinReport(request.params.id, 'temp');
          const maxWindSpeedReport = await reportStore.getMaxReport(request.params.id, 'wind_speed');
          const minWindSpeedReport = await reportStore.getMinReport(request.params.id, 'wind_speed');
          const maxPressureReport = await reportStore.getMaxReport(request.params.id, 'pressure');
          const minPressureReport = await reportStore.getMinReport(request.params.id, 'pressure');
          
          const viewData = { //all data is sent to view
            title: "Station",
            latitude: Number(request, response),
            longitude: Number(request, response),
            station: station,
            reports: reports,
            latestReport: latestReport,
            maxTempReport: maxTempReport,
            minTempReport: minTempReport,
            maxWindSpeedReport: maxWindSpeedReport,
            minWindSpeedReport: minWindSpeedReport,
            maxPressureReport: maxPressureReport,
            minPressureReport: minPressureReport,
            iconCode: iconCode,
            weather: weather,
            hasReports: hasReports
          };
      
          response.render("station-view", viewData);
        } else {
          
          const viewData = { //default values if there are no reports
            title: "Station",
            latitude: Number(request, response),
            longitude: Number(request, response),
            station: station,
            latestReport: null,
            maxTempReport: null,
            minTempReport: null,
            maxWindSpeedReport: null,
            minWindSpeedReport: null,
            maxPressureReport: null,
            minPressureReport: null,
            iconCode: "01d", 
            weather: "",
            hasReports: hasReports
          };
      
          response.render("station-view", viewData); //render station view
        }
      },

      async addReport(request, response) { //method to add new report
        const station = await stationStore.getStationById(request.params.id); //get station first 
        const newReport = { //request fields for no report
          code: Number(request.body.code),
          temp: Number(request.body.temp),
          wind_speed: Number(request.body.wind_speed),
          pressure: Number(request.body.pressure),
          wind_direction: (request.body.wind_direction)
          
        };
        console.log(`adding report ${newReport.code}`);
        await reportStore.addReport(station._id, newReport); //pass newReport into add report method from report store
        response.redirect("/station/" + station._id);
      },

      async deleteReport(request, response) { 
        const stationId = request.params.stationid; //find station id and report id
        const reportId = request.params.reportid;
        console.log(`Deleting Report ${reportId} from Station ${stationId}`); 
        await reportStore.deleteReport(reportId); //pass report id into delete report method
        response.redirect("/station/" + stationId); 
      }, 
};
