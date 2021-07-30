const { join } = require("path");
const { createReadStream, readdirSync } = require("fs");
const config = require("config");

const loadInputDataBase = require("./loadInputDataBase.js");
const loadProductsData = require("./loadProductsData.js");
const generateDescription = require("./generateDescription.js");

(async function init() {
  // load main csv file and get main data and names of product csv files
  const { data: mainDatabase, productsDB } = await loadInputDataBase;
  // load all product data from product csv files
  const productData = await loadProductsData(productsDB);
  // generate
  await generateDescription({ mainData: mainDatabase, ProductData: productData });
})();
