const { createReadStream } = require("fs");
const { join } = require("path");
const csv = require("csv-parser");

const mainDBFile = join(__dirname, "../input/database/main_database.csv");

/**
 *
 * @param {string} csvFile
 * @returns {object} object with data from main database
 * @output
 * data: [{
 * model: string,
 * productDB: string,
 * productList: array,
 * photos: array,
 * template: string,
 * }],
 * productsDB: array
 */
const getMainDB = async (csvFile) => {
  const dbData = await new Promise((resolve, reject) => {
    const mainData = [];

    createReadStream(csvFile)
      // TODO: add error handing if file don exist
      .on("error", (error) => {
        reject(error);
      })
      .pipe(csv({ separator: ";" }))
      .on("data", (data) => {
        mainData.push({
          model: data["Model"],
          productDB: data["Product group"],
          productList: data[Object.keys(data)[3]].split(",").filter((el) => el),
          photos: data[Object.keys(data)[4]].split(",").filter((el) => el),
          template: data["html template"],
        });
      })
      .on("end", async () => {
        resolve([...mainData]);
      });
  });

  return { data: dbData, productsDB: dbData.map((el) => el.productDB) };
};

const mainDbData = getMainDB(mainDBFile);

module.exports = mainDbData;
