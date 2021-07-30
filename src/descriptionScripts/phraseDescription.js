//NOTE: can use https://github.com/janl/mustache.js if needed

const phraseDescription = ({ template }) => {
  const regex = new RegExp(/(?={{[^}}]*}})|(?<={{[^}}]*}})/g);
  const templateData = template.split(regex);

  /**
   * conditions {array<object>} = {condition:"",attribute:"",arrayIndex:number,data:""}
   * images {array<object>} = {name:"",attribute:"",arrayIndex:number,data:""}
   * variables {array<object>} = {attributeName:string, arrayIndex:number}
   */
  const templateAttributesList = { conditions: [], images: [], variables: [] };

  templateData.forEach((element, index) => {
    if (element.match(/{{.+?}}/g)) {
      const attName = element.replace(/({+)|(}+)/g, "").trim();

      // find condition
      if (attName.match(/\?/g)) {
        const [conditionString, data] = attName.split("?");
        const condition = conditionString.trim().split(/(<=?|>=?|==+|!=+)/gi);
        const attribute = condition[0];
        templateAttributesList.conditions.push({
          condition: condition,
          attribute: attribute,
          arrayIndex: index,
          data: data.trim().replace(/(^\(\s+)|(\s+\))/g, ""),
        });
        return;
      }

      // find images
      if (attName.startsWith("image:")) {
        const imageName = attName.substr(6);
        templateAttributesList.images.push({
          imgName: imageName,
          arrayIndex: index,
        });
        return;
      }

      // rest attributes
      templateAttributesList.variables.push({
        attributeName: attName,
        arrayIndex: index,
      });
    }
  });

  return { formattedTemplate: templateData, templateAttributesList };
};

module.exports = phraseDescription;

/** NOTE: found this
const get = (path, obj, fb = `\{{${path}}}`) => path.split('.').reduce((res, key) => res[key] || fb, obj)
// const get = (path, obj) => path.split('.').reduce((res, key) => res[key]) 


function parseTpl(template, data,fallback) {
  const regex = new RegExp(/{{.+?}}/g);

  return template.replace(regex, (match) => {
    const path = match.replace(/({+)|(}+)/g, "").trim();
        
    return get(path, data,fallback)    
  });
}

const a = parseTpl('{{name}} is now master of the {{galaxy}} {{xd}}', { 
  name: 'John',
  galaxy: 'Milky Way',
});

console.log(a)

*/
