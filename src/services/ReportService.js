import axios from "axios";
import { BASE_URL, ReportsEndpoints } from "../constants/ApiEndpoints";

const ReportService = {
  getAllReports: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${ReportsEndpoints.getAllReports}`
      );
      if (!response.status) {
        throw new Error(`HTTP error ${response.status}`);
      }
      console.log(response);
      return response?.data;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  getReportById: async (reportId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${ReportsEndpoints.reportById(reportId)}`
      );
      if (!response.status) {
        throw new Error(`HTTP error ${response.status}`);
      }
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error fetching report:", error);
      throw error;
    }
  },

  createReport: async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}${ReportsEndpoints.addReport}`
      );
      if (!response.status) {
        throw new Error(`HTTP error ${response.status}`);
      }
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  },
};

export default ReportService;
