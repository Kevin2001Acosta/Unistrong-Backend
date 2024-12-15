import ClientCharacteristics from "../../db/models/client.characteristics.models";
import {fn, col, literal} from "sequelize";


class StatisticsService {
  async getMonthlyAverages(clientId: number): Promise<{month: string, averageWeight: number, averageArms: number, averageLegs: number}[]> {
    const result = await ClientCharacteristics.findAll({
        where: {clientId},
        attributes: [
            [fn("TO_CHAR", col("createdAt"), "YYYY-MM"), "month"],
            [fn("AVG", col("weight")), "averageWeight"],
            [fn("AVG", col("arms")), "averageArms"],
            [fn("AVG", col("legs")), "averageLegs"],
        ],
        group: [col("month")],
        order: [literal("month")],
    });
    
    return result.map((row: any) => ({
        month: row.get("month"),
        averageWeight: parseFloat(row.get("averageWeight")),
        averageArms: parseFloat(row.get("averageArms")),
        averageLegs: parseFloat(row.get("averageLegs")),
    }));
}
}
export default new StatisticsService();