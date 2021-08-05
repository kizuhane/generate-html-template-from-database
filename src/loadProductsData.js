const { createReadStream } = require("fs");
const { join } = require("path");
const csv = require("csv-parser");
const config = require("config");

const CONFIG_SEPARATOR = config.get("dbInputConfig.separator");
const CONFIG_INDEX_COLUMN_NAME = config.get("dbInputConfig.Index_column_name");
const CONFIG_ATTRIBUTES_START = config.get(
  "dbInputConfig.Attributes_start_column_number"
);
const CONFIG_INPUT_DB_EXTENSION = config.get("dbInputConfig.Input_db_extension");

/**
 * @param {string[]} csvProductFiles
 * @return {object} merged data from all product databases
 * hashMap: {object} {'index':indexInArray} => {'W-97446':0,'W-97976':1}
 * dataArray {array<object>} [{name:string,index:string;attributes:{${atr}...:(string|num)}}]
 */
const getProductDB = async (csvProductFiles) => {
  let counter = 0;

  const data = await csvProductFiles.map(async (csvFile) => {
    const dbProdData = await new Promise((resolve, reject) => {
      const hashMap = {};
      const dataArray = [];

      createReadStream(
        join(__dirname, "../input/database/", `${csvFile}.${CONFIG_INPUT_DB_EXTENSION}`)
      )
        // TODO: add error handing if files don exist
        .on("error", (error) => {
          reject(error);
        })
        .pipe(csv({ separator: CONFIG_SEPARATOR }))
        .on("data", (data) => {
          Object.assign(hashMap, { [data[CONFIG_INDEX_COLUMN_NAME]]: counter });

          const rowData = {
            name: data["Nazwa"],
            index: data[CONFIG_INDEX_COLUMN_NAME],
          };

          const attributes = Object.entries(data)
            .slice([CONFIG_ATTRIBUTES_START - 1]) // select only attributes columns
            .filter((_, index) => !(index % 3 === 2)) // remove every third column
            .map((el) => el.slice(1)) // remove column name from database
            .filter((el, index, arr) => {
              if (index % 2 === 0) return el.push(...arr[index + 1]);
            }) // marge attribute key name with attribute value
            .filter((el) => el[0])
            .map(([key, value]) => ({ [key]: value })) // change array to object
            .reduce((acc, cur) => Object.assign(acc, cur)); // flatten object

          //add 'Nazwa' attribute to attributes
          Object.assign(attributes, { Nazwa: data["Nazwa"] });

          dataArray.push({ ...rowData, attributes: attributes });

          counter++;
        })
        .on("end", async () => {
          resolve({ hashMap, dataArray });
        });
    });
    return dbProdData;
  });
  const allData = await Promise.all(data);

  return allData.reduce((acc, cur) => {
    return {
      hashMap: { ...acc.hashMap, ...cur.hashMap },
      dataArray: [...acc.dataArray, ...cur.dataArray],
    };
  });
};

module.exports = getProductDB;
