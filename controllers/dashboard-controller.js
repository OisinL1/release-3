/**
 * dashboardController handles the operation of the dashboard view for WeatherTop.
 * 
 * This controller is responsible for:
 * 1. Displaying the dashboard view which contains a list of all weather stations aded by the loggied in user.
 * 2. Collecting and processing data for each station, including weather reports, maximum and minimum values for fields, and latest information.
 * 3. Rendering the summary of each station.
 * 4. Allowing users to add new stations and delete existing stations from their dashboard.
 * 
 * The controller uses the stationStore and the reportStore to manage stations and weather reports.
 * It gathers all relevant data and passes it to the dashboard-view for rendering.
 */

import { stationStore } from "../models/station-store.js";
import { accountsController } from "./accounts-controller.js";
import { reportStore } from "../models/report-store.js";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const stations = await stationStore.getStationsByUserId(loggedInUser._id);

    // Array to store all data for each station
    const stationData = [];

    for (const station of stations) {
      const reports = await reportStore.getReportsByStationId(station._id); // retrieve all reports
      const hasReports = reports.length > 0; //check if reports are present

      let latestReport = null; //instantiate fields as null if there are no reports
      let iconCode = "01d";
      let maxTempReport = null;
      let minTempReport = null;
      let maxWindSpeedReport = null;
      let minWindSpeedReport = null;
      let maxPressureReport = null;
      let minPressureReport = null;

      if (hasReports) {
        latestReport = await reportStore.getLatestReport(station._id); //if reports are present, retrieve fields
        iconCode = await reportStore.getIconCode(latestReport.code.toString());
        maxTempReport = await reportStore.getMaxReport(station._id, 'temp');
        minTempReport = await reportStore.getMinReport(station._id, 'temp');
        maxWindSpeedReport = await reportStore.getMaxReport(station._id, 'wind_speed');
        minWindSpeedReport = await reportStore.getMinReport(station._id, 'wind_speed');
        maxPressureReport = await reportStore.getMaxReport(station._id, 'humidity');
        minPressureReport = await reportStore.getMinReport(station._id, 'humidity');
      }

      
      stationData.push({ //push all data to the stationData array
        station: station,
        hasReports: hasReports,
        latestReport: latestReport,
        maxTempReport: maxTempReport,
        minTempReport: minTempReport,
        maxWindSpeedReport: maxWindSpeedReport,
        minWindSpeedReport: minWindSpeedReport,
        maxPressureReport: maxPressureReport,
        minPressureReport: minPressureReport,
        iconCode: iconCode,
      });
    }

    const viewData = {
      title: "Station Dashboard",
      stations: stationData, // Pass the data from the array to view
    };

    response.render("dashboard-view", viewData); //pass view data to dashboard view
  },

  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request); //find the logged in user
    const newStation = {  //instantiate new station
      title: request.body.title, //retrieve and asign all fields from the user
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      userid: loggedInUser._id,
    };
    console.log(`Adding station ${newStation.title}`); //inform user of added station via the console 
    await stationStore.addStation(newStation); //pass new station into addStation
    response.redirect("/dashboard");
  },

  async deleteStation(request, response) { 
    const stationId = request.params.id; //find the station
    console.log(`Deleting Station ${stationId}`); //inform user that station is being deleted via the console 
    await stationStore.deleteStationById(stationId);  //call deleteStation method from stationStore and pass in station id
    response.redirect("/dashboard");  //pass the correct route for deleting the station
  },
};
