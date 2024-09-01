import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { reportStore } from "./report-store.js";

const db = initStore("stations");  // initalise data store

export const stationStore = {
  async getAllStations() {
    await db.read(); //read data store
    return db.data.stations; //return all stations
  },

  async addStation(station) {
    await db.read();   //read data store
    station._id = v4(); //create id for station 
    db.data.stations.push(station); //add station to stations list 
    await db.write();  //write data back to database 
    return station;    //return new station
  },

  async getStationById(id) {
    await db.read(); //read database
    const list = db.data.stations.find((station) => station._id === id); //find station from list using station id
    if (list) {
      list.reports = await reportStore.getReportsByStationId(list._id); //if station is found then get all reports
    }
    return list; //return station and reports 
  },

  async getStationsByUserId(userid) {
    await db.read(); //read database
    return db.data.stations.filter((station) => station.userid === userid);  //find station from list using user id
  },

  async deleteStationById(id) {
    await db.read(); //read database
    const index = db.data.stations.findIndex((station) => station._id === id); //find index of station in stations list
    db.data.stations.splice(index, 1); //remove station from list
    await db.write(); //write back to database
  },

  async deleteAllStations() {
    db.data.stations = []; //empty stations list
    await db.write();      // write back to database
  },

  async updateStation(station, updatedStation) {
    station.code = updatedStation.title;
    station.latitude = updatedStation.latitude;
    station.longitude = updatedStation.longitude;
    await db.write();
  },
};
