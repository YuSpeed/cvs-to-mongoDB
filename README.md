#  YuSpeed csvToMongoDB

## About YuSpeed csvToMongoDB

The csvToMongoDB is a a high memory efficient flexible and extendable open-source CSV import to mongoDB command-line app for Node js.
The import using mongoimport.

### Features

#### 1. Memory Management Free

This library was designed for low memory usage. It will not accumulate all the rows in the memory. The importer reads a CSV file and executes a callback function line by line.

#### 2. Directory support

This library supports import all files in a directory.

#### 3. Watch support

This library supports watch a directory.Import auto begin when file enter the directory.
 
## Requirements

* Node js 8.3 or later
* MonggoDB mongoimport


## Getting started

 install  from [NPM](https://www.npmjs.com/package/yu-speed-csvToMongoDB):

```bash
npm install --save yu-speed-csvToMongoDB
```
or using yarn

```bash
yarn add yu-speed-csvToMongoDB
```

## First running

```bash
yuCsvToDB
```

input item follow prompt.
The result will save to app.json and will used after running.
```bash
? Please enter your monggoDB hostname localhost
? Please enter your monggoDB port 27017
? Please enter your database name users
? Please enter your collection name ticks
? Please enter your username admin
? Please enter your password [hidden]
? Please enter a import pattern that search csv file. f:/history/data/tick/*.csv
? Please enter the shell command mongoimport path D:/MongoDB/Server/3.4/bin/
? Please enter the backup path f:/history/backup/tick
? Please confirm your input:
{
  "hostname": "localhost",
  "port": 27017,
  "database": "users",
  "collection": "ticks",
  "username": "admin",
  "password": "1",
  "pattern": "f:/history/data/tick/*.csv",
  "mongoimportPath": "D:/MongoDB/Server/3.4/bin/",
  "backupPath": "f:/history/backup/tick"
} Yes
```


## import

```bash
yuCsvToDB -i
```

output on console

```bash

  start import file a1801_1505721922380.csv(2.75MB) estimate 0.02minute.
 
       2017-09-20T07:42:36.377+0800      connected to: localhost:27017
       2017-09-20T07:42:37.478+0800      imported 39769 documents
 
  The file be moved to f:/history/backup/tick
 
 
  start import file a1801_1505723904360.csv(132.39MB) estimate 0.77minute.
 
       2017-09-20T07:42:37.653+0800      connected to: localhost:27017
       2017-09-20T07:42:40.649+0800      [#.......................] users.ticks  7.13MB/132MB (5.4%)
       2017-09-20T07:42:43.648+0800      [##......................] users.ticks  14.9MB/132MB (11.2%)
       2017-09-20T07:42:46.649+0800      [####....................] users.ticks  23.6MB/132MB (17.8%)
       2017-09-20T07:42:49.649+0800      [######..................] users.ticks  33.1MB/132MB (25.0%)
       2017-09-20T07:42:52.649+0800      [#######.................] users.ticks  43.1MB/132MB (32.6%)
       2017-09-20T07:42:55.649+0800      [########................] users.ticks  49.6MB/132MB (37.4%)
       2017-09-20T07:42:58.650+0800      [##########..............] users.ticks  56.4MB/132MB (42.6%)
       2017-09-20T07:43:01.649+0800      [###########.............] users.ticks  64.4MB/132MB (48.7%)
       2017-09-20T07:43:04.649+0800      [#############...........] users.ticks  74.1MB/132MB (56.0%)
       2017-09-20T07:43:07.648+0800      [###############.........] users.ticks  84.9MB/132MB (64.1%)
       2017-09-20T07:43:10.649+0800      [#################.......] users.ticks  95.4MB/132MB (72.1%)
       2017-09-20T07:43:13.649+0800      [###################.....] users.ticks  105MB/132MB (79.2%)
       2017-09-20T07:43:16.650+0800      [####################....] users.ticks  115MB/132MB (87.0%)
       2017-09-20T07:43:19.648+0800      [######################..] users.ticks  126MB/132MB (94.8%)
       2017-09-20T07:43:21.582+0800      [########################] users.ticks  132MB/132MB (100.0%)
       2017-09-20T07:43:21.582+0800      imported 1967782 documents
 
  The file be moved to f:/history/backup/tick
 
  Pattern:  -  2 matches
  Total size:   135.14MB
  Done in 0.76minute
```


## watch

```bash
yuCsvToDB 
```

## reset app.json

```bash
yuCsvToDB -r
```

## [API documentation](https://YuSpeed.github.io/csv-to-mongodb/)

YuSpeed csvToMongoDB is fully documented via inline JSDoc comments. [The docs are also available online](https://YuSpeed.github.io/csv-to-mongodb). When using an IDE like Intellij IDEA or Webstorm the docs are available inline right inside your editor.


## License

MIT © 
