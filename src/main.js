const { join } = require("path");
const { createReadStream, readdirSync } = require("fs");
const config = require("config");

const loadInputDataBase = require("./loadInputDataBase.js");
const loadProductsData = require("./loadProductsData.js");
const generateDescription = require("./generateDescription.js");

(async function init() {
  const { data: mainDatabase, productsDB } = await loadInputDataBase;
  const productData = await loadProductsData(productsDB);

  // console.log(productData);

  await generateDescription({ mainData: mainDatabase, ProductData: productData });
})();
