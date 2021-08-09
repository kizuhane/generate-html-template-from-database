var { existsSync, mkdirSync, readdirSync } = require("fs");
const { join } = require("path");

const phraseDescription = require("./descriptionScripts/phraseDescription.js");
const createDescription = require("./descriptionScripts/createDescription.js");

const OUTPUT_DIRECTORY = join(__dirname, "../output");

const generateDescription = ({ mainData, ProductData }) => {
  // create output files if don't exist if exist force user to clear output file if not empty
  if (!existsSync(OUTPUT_DIRECTORY)) {
    mkdirSync(OUTPUT_DIRECTORY);
  } else {
    // if output file is not empty force user to clear directory
    if (readdirSync(OUTPUT_DIRECTORY).length) {
      console.log(
        "\n\x1b[41m\x1b[30m PLEASE CLEAR OUTPUT DIRECTORY BEFORE GENERATING NEW FILES \x1b[0m"
      );
      process.exit(0);
    }
  }

  // loop true all model groups and generate description
  mainData.forEach(async (descriptionGroup) => {
    console.log(
      `\x1b[30m\x1b[44m GENERATE DESCRIPTION FOR:\x1b[0m\x1b[1m ${descriptionGroup.model}\x1b[0m`
    );
    console.log("│");

    // check if Product list is empty
    if (!descriptionGroup.productList.length) {
      console.error(
        `\x1b[30m\x1b[41m-- Product list for ${descriptionGroup.model} is empty edit main_database.csv to add products for witch description will be generated --\x1b[0m`
      );
      return console.log(
        `\n\x1b[42m\x1b[30m FINISHED: \x1b[0m ${descriptionGroup.model}\n`
      );
    }

    // crate folder for current product model group (replace '/' with '-')
    const modelGroupDirectoryName = `${descriptionGroup.model}`.replace("/", "-");
    const exportDirectory = join(OUTPUT_DIRECTORY, modelGroupDirectoryName);
    if (!existsSync(exportDirectory)) {
      mkdirSync(exportDirectory);
      console.log(
        `├─ create folder: '\x1b[34m${modelGroupDirectoryName}\x1b[0m' for '\x1b[34m${descriptionGroup.model}\x1b[0m'`
      );
    }

    // check if given photos exist in directory input/images
    console.log(`├─ checking if given ${descriptionGroup.photos.length} photos exist:`);
    if (descriptionGroup.photos.length) {
      try {
        const files = readdirSync(join(__dirname, "../input/images"));
        descriptionGroup.photos.map((photoNameDB) =>
          files.find((imgFile) => photoNameDB === imgFile)
            ? console.log(`│  ├─ [\x1b[32m✓\x1b[0m] found: \x1b[4m${photoNameDB}\x1b[0m`)
            : console.log(`│  ├─ \x1b[31m[X] missing image: \x1b[4m${photoNameDB}\x1b[0m`)
        );
        console.log(`│  └─\x1b[32m all found photos copped\x1b[0m\n│`);
      } catch (err) {
        console.error("\x1b[31m%s\x1b[0m", err);
      }
    } else {
      console.log("│  └─ no photos provided\n│");
    }

    // phrase description from string object
    console.log(`├─ phrasing template\x1b[5m ...\x1b[0m`);
    const templateData = phraseDescription({ template: descriptionGroup.template });
    console.log("│  └─ DONE\n│");

    // map thru all product list and create description files
    console.log(`├─ generating description\x1b[5m \x1b[0m`);
    createDescription({
      groupData: descriptionGroup,
      exportDirectory: exportDirectory,
      templateData,
      descriptionData: ProductData,
    });

    // END
    console.log(`│  │\n\x1b[42m\x1b[30m FINISHED: \x1b[0m ${descriptionGroup.model}\n`);
  });
};

module.exports = generateDescription;
