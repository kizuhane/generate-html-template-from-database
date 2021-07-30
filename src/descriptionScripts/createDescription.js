var { mkdirSync, existsSync, copyFile } = require("fs");
const { join } = require("path");
const config = require("config");

const createDescription = ({
  groupData,
  exportDirectory,
  templateData,
  descriptionData,
}) => {
  groupData.productList.forEach((item, index) => {
    const outputItemDir = join(exportDirectory, item);

    console.log(`   ──\x1b[34m create description file for: ${item}\x1b[0m`);

    // create directory to export description
    //DEBUG:
    // if (existsSync(outputItemDir)) {
    //   try {
    //     mkdirSync(`${outputItemDir}_${index}`);
    //     console.log(
    //       `   ── [\x1b[33m?\x1b[0m] directory ${item} exist create ${item}_${index} instead\x1b[0m`
    //     );
    //   } catch (err) {
    //     console.error(err);
    //   }
    // } else {
    //   try {
    //     mkdirSync(`${outputItemDir}`);
    //     console.log(`   ── [\x1b[32m✓\x1b[0m] create directory ${item}\x1b[0m`);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }

    // copy all image
    // try {
    //   const ExportImgDir = join(outputItemDir, "images");
    //   if (!existsSync(outputItemDir)) mkdirSync(ExportImgDir);

    //   groupData.photos.forEach((img) => {
    //     copyFile(
    //       join(process.cwd(), "input", "images", img),
    //       join(ExportImgDir, img),
    //       (err) => {
    //         if (err) console.error(err);
    //       }
    //     );
    //   });

    //   console.log(`     ── [\x1b[32m✓\x1b[0m] all images was copied`);
    // } catch (error) {
    //   console.error(error);
    // }

    const ItemData = descriptionData.dataArray[descriptionData.hashMap[item]];

    // create description file
    const doneDescription = "";
    for (const [key, value] of Object.entries(templateData.templateAttributesList)) {
      if (key === "conditions") {
        value.forEach((con) => {
          console.log(`${con.condition[0]} ${con.condition[1]} "${con.condition[2]}"`);
          // if (eval(`${con.condition[0]} ${con.condition[1]} "${con.condition[2]}"`)) {
          //   console.log("yes");
          // }
        });
      }
      if (key === "images") {
        // images
      }
      if (key === "variables") {
        // variables
      }
    }

    //END
  });
};

module.exports = createDescription;
