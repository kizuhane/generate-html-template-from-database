Generate multiple text files based on template text from database in csv format using information from other csv files.

## installation

1. instal [node.js](https://nodejs.org/) (version ^14)
2. clone or download repository to own computer
3. open terminal go to this project and type:
   1. `npm install` - to install all dependency
   2. `npm run start` - to run script

## Setup

### input
All files whats script will be using need be placed in `input` directory

#### DataBase
in folder `input/database` must be placed all needed csv files.

>NOTE: don't use `,` as separator for column in exported files, because comma is used to separate multiple data in single column.

**Main database** - name: `main_database.csv` database with separated with `;` in default. Script using data from this files to generate html files
 - **Model**: main group of products with the same template.
 - **Product group**: used as name of file with data for specific products.
 - **Related product indexes (separated by ",")**: list of index or any unique string to generate text based on template in single group/Model (must be unique).
 - **name of used photos (separated by ",") with extension**: names of photos put in `input/images` with extension (must be unique).
 - **text description**: script don't use this column is only for user readability.
 - **html template**: html template in string format.

**Related product database** - name: `${Product group}.csv` database with name from column *Product group*. Every product is written in row schema (att name,att data,att note,att name,att data,att note...). In [config](/config/default.json) file `config/default.json` as `dbInputConfig.Index_column_name` is specified name of column where index are place in. To indicate which column the attributes begin in the same [config](/config/default.json) file in `dbInputConfig.Attributes_start_column_number` enter the column number starting indexing from 1. 

*Related product database* link with *Main database* using column `Product group` in main database. Next load all product from *Related product database* where in config file `dbInputConfig.Index_column_name` are name of column what have index of loading items. This index must be the same as index in `Related product indexes` column in *Main database*. 

> in directory `input/example` are example files to use

#### images
In directory `input/images` putt all images used in `main_database.csv`

#### template 
Script using simple template language where you put variables inside double curly brackets `{{variable name}}`

**add variables** - to add variable put attribute name inside double curly brackets `{{here}}`

**condition statement** - this script support single condition statement to put text fragment if specific argument pass condition statement, supported condition: `==`, `!=`, `===`, `!==`, `<`, `<=`, `>`, `>=`.
```
{{condition ? (template text... THIS DON'T SUPPORT VARIABLES INSIDE)}}
```
condition must contain the `name of the attribute`, next `comparison operators`, and last `expected value`, so for example: `Attribute1==YES`

full example:
```
{{Attr_12>12 ? (<p>Attr_12 is more then 12<\p>)}}
```

**images** - to link image you need to prefix image name with `image:`, `{{image:image_name.jpg}}`

### output
Base on csv file named `inputDatabase.csv` in `input/database` directory, create folder in `output` directory named like in csv file in column model and generate *text based file* (html as default) from colum template and `assets` folder with all images for this description. To change file type for generated output in config file `config/default.json` change `export.extension` to preferred extension.

#### example
In `/input/example` are place example files for demonstration, copy csv files to `/input/database`, copy image folder to `/input/images` and run program to see demonstration.


**Main database**

| Model        | Product group                | Notes    | Related product indexes (separated by ",") | name of used photos (separated by ",") with extension     | text description           | html template                                                       |
| ------------ | ---------------------------- | -------- | ------------------------------------------ | --------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------- |
| WT-54 EXTREM | Wtyczki i gniazda            | {{name}} | W-97446,W-97976,W-97977,W-98000            | http://placehold.jp/420x350.png,http://placehold.jp/40... | {{Nazwa}} Lorem ipsum d... | `<section style="max-width:1000px;margin:auto"><h3>{{Nazwa}}</h...` |
| PS-HEAVY/S   | Przedłużacze specjalistyczne | {{name}} | 98925,W-98926                              |                                                           | {{Nazwa}} Lorem ipsum d... | `<section style="max-width:1000px;margin:auto"><h3>{{Nazwa}}</h...` |

**Related product database**

see `example_Related_product_database-...` in example folder to understand schema.


**Output**
```
in folder ./output

├─WT-54 EXTREM
│ ├─W-97446
│ │ └─assets
│ │     img_1.jpg
│ │   W-97446_description.html
│ ├─W-97976
│ │ └─assets
│ │     img_1.jpg
│ │     img_2.jpg
│ │     img_3.jpg
│ │     img_4.jpg
│ │   W-97446_description.html
│ ├─W-97977
│ │ └─assets
│ │     img_1.jpg
│ │   W-97446_description.html
│ └─W-98000
│   └─assets
│       img_1.jpg
│       img_2.jpg
│     W-97446_description.html
│
└─GN-54 EXTREM
  ├─W-97448
  │ └─assets
  │     img_1.jpg
  │     img_2.jpg
  │   W-97446_description.html
  ├─W-97978
  ...

```

## Configuration
Script have [config](/config/default.json) file in json format, you can edit it to alter script functionality


#### dbInputConfig
`separator`- {string} separator used to phrase data from csv files (default; `;`)

`Input_db_extension`- {string} filename extension for database file  (default: `csv`)

`Index_column_name`- {string} name of column where placed are indexes to link *Related product database* and *Main database*

`Attributes_start_column_number`- {number} 


#### export
`insert_domain_to_image_url`- {boolean} flag if text from domain_text will be added to every image (default: `false`)

`domain_text`- {string} string to add before every image when generating text from template

`extension`- {string} filename extension for file with generated template(default: `html`)