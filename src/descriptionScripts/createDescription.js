var { mkdirSync, existsSync, copyFile, writeFileSync } = require("fs");
const { join } = require("path");
const config = require("config");

const CONFIG_EXPORT_INSERT_DOMAIN_TO_IMAGE = config.get(
  "export.insert_domain_to_image_url"
);
const CONFIG_EXPORT_IMAGE_DOMAIN_URL = config.get("export.domain_text");
const CONFIG_EXPORT_EXTENSION = config.get("export.extension");

const createDescription = ({
  groupData,
  exportDirectory,
  templateData,
  descriptionData,
}) => {
  groupData.productList.forEach((item, index) => {
    let outputItemDir = join(exportDirectory, item);
    const thisItemTemplateData = [...templateData.formattedTemplate];
    const itemData = descriptionData.dataArray[descriptionData.hashMap[item]];

    console.log(`│  ├─\x1b[34m creating description file for: ${item}\x1b[0m`);

    // create directory to export description
    if (existsSync(outputItemDir)) {
      try {
        outputItemDir = join(exportDirectory, `${item}_${index}`);
        mkdirSync(`${outputItemDir}`);
        console.log(
          `│  │  └─ [\x1b[33m?\x1b[0m] directory ${item} exist create ${item}_${index} instead\x1b[0m`
        );
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        mkdirSync(`${outputItemDir}`);
        console.log(`│  │  └─ [\x1b[32m✓\x1b[0m] create directory ${item}\x1b[0m`);
      } catch (err) {
        console.error(err);
      }
    }

    // copy all image if this description have one
    if (templateData.templateAttributesList.images.length) {
      console.log(`│  │  ├─ copping images:`);
      try {
        const ExportImgDir = join(outputItemDir, "images");
        if (!existsSync(ExportImgDir)) mkdirSync(ExportImgDir);

        groupData.photos.forEach((img) => {
          copyFile(
            join(process.cwd(), "input", "images", img),
            join(ExportImgDir, img),
            (err) => {
              if (err) console.error(err);
            }
          );
        });

        console.log(`│  │  │  └─ [\x1b[32m✓\x1b[0m] all images was copied`);
      } catch (error) {
        console.error(`│  │  │  └─\x1b[31m [X] unable to copy images`, error);
      }
    }

    // create description file
    console.log(`│  │  ├─ creating descriptions:`);
    for (const [key, value] of Object.entries(templateData.templateAttributesList)) {
      if (key === "conditions") {
        value.forEach((con) => {
          if (
            // phrase if statement  from template
            eval(
              `itemData.attributes[con.condition[0]] ${con.condition[1]} "${con.condition[2]}"`
            )
          ) {
            thisItemTemplateData[con.arrayIndex] = con.data;
          } else {
            thisItemTemplateData[con.arrayIndex] = "";
          }
        });
      }
      if (key === "images") {
        // link images to description images
        value.forEach((img) => {
          // REVIEW: Check if this work
          if (CONFIG_EXPORT_INSERT_DOMAIN_TO_IMAGE) {
            thisItemTemplateData[
              img.arrayIndex
            ] = `${CONFIG_EXPORT_IMAGE_DOMAIN_URL}/images/${img.imgName}`;
          } else {
            thisItemTemplateData[img.arrayIndex] = `images/${img.imgName}`;
          }
        });
      }
      if (key === "variables") {
        // add all variables to template
        value.forEach((attr) => {
          const currentAttr = itemData.attributes[attr.attributeName];
          if (!currentAttr) {
            console.error(
              "│  │  │  ├─ \x1b[31m[X] missing attribute or empty in database: '%s'\x1b[0m",
              attr.attributeName
            );
            return;
          }
          // insert attribute to description
          thisItemTemplateData[attr.arrayIndex] = itemData.attributes[attr.attributeName];
        });
      }
    }
    console.log("│  │  │  └─ [\x1b[32m✓\x1b[0m] add all attributes to description");

    // create export files
    try {
      writeFileSync(
        join(outputItemDir, `description-${item}.${CONFIG_EXPORT_EXTENSION}`),
        thisItemTemplateData.join("")
      );
      console.log("│  │  └─ \x1b[32m[✓] saved generated description\x1b[0m");
    } catch (error) {
      console.log(
        "│  │  └─\x1b[31m unable to create file to save generated description \x1b[0m"
      );
    }

    console.log("│  │");
    //END MESSAGE
  });
};

module.exports = createDescription;
