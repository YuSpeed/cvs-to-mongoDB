const meow = require('meow');
const foo = require('./app');

const cli = meow(`
	Usage
	  $ foo  import csv files in directory to db using app.json

	Options
	  --watch,  -w  Watch a directory
	  --import, -i  import csv files in directory to db
	  --reset,  -r  setup app.json
	  --help,   -h  output usage information

`, {
    alias: {
        w: 'watch',
        i: 'import',
        r: 'reset',
        h: 'help',
    }
});
/*
 {
 input: ['unicorns'],
 flags: {rainbow: true},
 ...
 }
 */

foo(cli.input[0], cli.flags);