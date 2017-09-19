import {args,upgrade} from 'mocoolka-cli';
import App from './index';
const pkg = require('../package.json');

upgrade({pkg}).notify();
const cli= args(`
	Usage
	  $ yuCsvToDB   import csv files in directory to db using app.json

	Options
	  --watch,      -w  Watch a directory
	  --import,     -i  import csv files in directory to db
	  --reset,      -r  setup app.json
	  --help,       -h  output usage information
	  
	Visit https://github.com/YuSpeed/cvs-to-mongoDB to learn more about yuCsvToDB.
	  

`, {
    alias: {
        w: 'watch',
        i: 'import',
        r: 'reset',
        h: 'help',
    }



});
App.of().argv(cli.flags);