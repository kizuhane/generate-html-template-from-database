Generate multiple html files based on template text from database in csv format using information from other csv files

## input

### DataBase
in folder `input/database` must be placed all needed csv files

**Main database** - name: `main_database.csv` database with separated with `;` in default. Script using data from this files to generate html files
 - **Model**: main group of products with the same template 
 - **Product group**: used as name of file with data for specific products
 - **Related product indexes (separated by ",")**: list of index or other name to generate (must be unique)
 - **name of used photos (separated by ",") with extension**: names of photos put in `input/images` with extension (must be unique)
 - **text description**: script don't use this column is only for user readability
 - **html template**: html template in string format

**Related product database** - name: `${Product group}.csv` database with name from column *Product group*. Every product is written in row schema (att name,att data,att name,att data). In config file (`config/config.json`) as `dbInputConfig.Index_column_name` is specified name of column where index are place is.

> in directory `input/example` are example files to use

### images
in directory `input/images` putt all images used in `main_database.csv`


### template 

**images** - to link image you need to prefix image name with `image:`

## output
base on csv file named `inputDatabase.csv` in `input/database` directory, create folder in `output` named like in csv file in column model and generate `html file` from colum template and `assets` folder with all images for this description.


### example

**Main database**

| Model        | Product group                | Notes      | Related product indexes (separated by ",") | name of used photos (separated by ",") with extension     | text description           | html template                                                       |
|--------------|------------------------------|------------|--------------------------------------------|-----------------------------------------------------------|----------------------------|---------------------------------------------------------------------|
| WT-54 EXTREM | Wtyczki i gniazda            | {{name}}   | W-97446,W-97976,W-97977,W-98000            | http://placehold.jp/420x350.png,http://placehold.jp/40... | {{Nazwa}} Lorem ipsum d... | `<section style="max-width:1000px;margin:auto"><h3>{{Nazwa}}</h...` |
| PS-HEAVY/S   | Przedłużacze specjalistyczne | {{name}}   | 98925,W-98926                              |                                                           | {{Nazwa}} Lorem ipsum d... | `<section style="max-width:1000px;margin:auto"><h3>{{Nazwa}}</h...` |

**Related product database**

**generate**
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

## TODO
- [ ] filtrowanie bazy i generowanie zmiennych
- [ ] wprowadzenie tekstu z bazy
- [ ] dodanie bloków if w template
- [ ] dodane ewentualnej domenu do linków przy zdjęciach
- [ ] wyszukiwanie zdjęć, z bazy wrzuć do tabeli i użyj .find()