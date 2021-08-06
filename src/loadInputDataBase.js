const { createReadStream } = require("fs");
const { join } = require("path");
const csv = require("csv-parser");

const config = require("config");

const CONFIG_INPUT_DB_EXTENSION = config.get("dbInputConfig.Input_db_extension");
const CONFIG_SEPARATOR = config.get("dbInputConfig.separator");

const mainDBFile = join(
  __dirname,
  `../input/database/main_database.${CONFIG_INPUT_DB_EXTENSION}`
);

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
      .pipe(csv({ separator: CONFIG_SEPARATOR }))
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

  return { data: dbData, productsDB: [...new Set(dbData.map((el) => el.productDB))] };
};

const mainDbData = getMainDB(mainDBFile);

module.exports = mainDbData;
