import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";

export const reportController = {
  async index(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Editing Report ${reportId} from Station ${stationId}`);
    const viewData = {
      title: "Edit Report",
      station: await stationStore.getStationById(stationId),
      report: await reportStore.getReportById(reportId),
    };
    response.render("report-view", viewData);
  },

  async update(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    const updatedReport = {
      code: Number(request.body.code),
      temp: Number(request.body.temp),
      wind_speed: Number(request.body.wind_speed),
      pressure: Number(request.body.pressure),
      wind_direction: (request.body.wind_direction),
    };
    console.log(`Updating Report ${reportId} from Station ${stationId}`);
    const report = await reportStore.getReportById(reportId);
    await reportStore.updateReport(report, updatedReport);
    response.redirect("/station/" + stationId);
  },
};
