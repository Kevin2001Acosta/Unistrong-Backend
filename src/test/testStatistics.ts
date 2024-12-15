import statisticsService from "../services/client/statistics.services";


async function testStatistics() {
  try {
    const monthlyAverages = await statisticsService.getMonthlyAverages(1);
    console.log("Monthly Averages:", monthlyAverages);
  } catch (error) {
    console.error("Error:", error);
  }
}

testStatistics();