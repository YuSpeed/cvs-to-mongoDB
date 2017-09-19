import * as fs from 'fs';
import * as path from 'path';
import FileTools from 'mocoolka-tools-io';
import {isEmpty, isPlainObject} from 'mocoolka-type';
import {notPredicate} from 'mocoolka-function';
import {components, propComponents, schemaComponent, execCommandFile} from 'mocoolka-cli';
const {logo} = propComponents;
const {display} = components;
const {editRecord} = schemaComponent;
import {monocle, option,either}from 'mocoolka-algebraic';
import config from './config';
import {IAppOption} from './types';
const {Prism, Lens}=monocle;
const {fromPredicate}=option;
interface IAppConfig{
    hostname,port,database,collection,username,password,pattern,mongoimportPath,backupPath
}
/**
 * format number
 * @param n
 */
const formatNumber = (n)=> n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
/**
 * Csv to mongoDB App
 */
class App {
    /**
     * App setting
     */
    options: IAppOption;
    /**
     * is watch mode
     * @type {boolean}
     */
    isWatch:boolean;
    /**
     * watch timer
     */
    timer;

    private appConfig: IAppConfig;
    private speedRate:number;
    private totalTime:number;
    private size:number;
    /**
     * create a instance
     * @param _isWatch
     */
    constructor() {
        this.options = config;
        this.options.isWatch=this.options.isWatch||false;
        this.isWatch=this.options.isWatch;
        this.totalTime=0;
        this.size=0;

    }

    validImport=(thisArg,flags)=>{
        either.fromOption(null)(option.fromNullable(flags.import)).fold(()=>{
            thisArg.start(true)},()=>{thisArg.start(false)})
    }
    validReset=(thisArg,flags)=>{
        either.fromOption(flags)(option.fromNullable(flags.reset)).fold(()=>thisArg.validImport(thisArg,flags),()=>init(thisArg.options))
    }
    argv=(flags)=>{
        this.validReset(this,flags)
    }
    /**
     * start import
     */
     start=async(isWatch:boolean)=> {
        this.options.isWatch=isWatch;
        this.isWatch=isWatch
        process.stdout.write(logo('logo')(this.options));
        console.log(`\n`)
        console.log(display`{green.bold  ${this.options.title}}`)
        if(this.options.isWatch) watchText();
        this.run();
    }
    private calRate=(rate:{size:number,total:number})=>{
        this.totalTime+=rate.total;
        this.size+=rate.size;
        this.speedRate=this.size/this.totalTime;
    }
    private  startImport=async ()=> {
        this.appConfig =  FileTools.openFile(this.options.file) as {hostname,port,database,collection,username,password,pattern,mongoimportPath,backupPath};
        const result=await execute(this.options,this.appConfig,this.speedRate);
        this.calRate(result)

    }

    /**
     * running import program
     */
    private  run=async()=> {
        if (this.isWatch) this.stopWatch();
        const prism = Prism.fromPredicate<string>(FileTools.fileExist);

        await prism.getOption(this.options.file).fold(async ()=> {
            const result=await init(this.options);
                await result.map(this.startImport);
        }, async()=> {
                await this.startImport();
            }
        );

        if (this.isWatch) {
           // console.log(display`{yellow.bold watching start.Press Ctrl+C quit. }`)
            this.startWatch();
        }
    }

    /**
     * stop watch
     */
    stopWatch=()=> {
        if (this.timer)
            clearInterval(this.timer);
    }
    /**
     * start watch
     */
    startWatch=()=>{

        this.timer = setInterval(function (thisArg) {
            thisArg.run();
        }, 1000,this);
    }
    /**
     * instead of new App
     * @return {App}
     */
    static of() {
        return new App();
    }

}
/**
 * execute when empty directory
 */
const emptyFiles=async (options:IAppOption)=> {
    if(!options.isWatch) console.log(display` {yellow.bold No any matched file be found}`)
    return {size:0,total:0};
};
/**
 * build app.json
 */
const init =async(options)=> {
    const result = await editRecord.of(options.params).render();
    return fromPredicate(isPlainObject)(result).map(function (result) {
        FileTools.saveFile(options.file, result);
        return result;
    })

}
/**
 * import every file in directory
 */
const  execute=async(options:IAppOption,appConfig:IAppConfig,speedRate:number)=>{
    let files = FileTools.findFiles(appConfig.pattern);
    const isEmptyPrism = Prism.fromPredicate<Array<string>>(notPredicate(isEmpty)).getOption(files);
    return await isEmptyPrism.fold(()=>emptyFiles(options), async(files)=> {
        const fileObjects = files.filter(notPredicate(FileTools.isLocked)).map(file=> ({
            size: fs.statSync(file).size,
            name: path.basename(file),
            path: file
        }));
        const totalSize=fileObjects.reduce((prev,current)=>{
           return current.size+prev
        },0);
        const beginTime=Date.now();
        for (let file of fileObjects) {
            await csvToFile(file, appConfig,options,speedRate)
        }
        const endTime=Date.now();

        console.log(display` Pattern:  -  {yellow.bold ${fileObjects.length}} matches\n Total size:   {yellow.bold ${formatNumber(totalSize/1024/1024)}MB}\n Done in {yellow.bold ${formatNumber((endTime-beginTime)/1000/60)}minute}`);
        if(options.isWatch) watchText();
        return {
           total:(endTime-beginTime),
           size:totalSize
       }
    });
};
/**
 * import a file to mongoDB
 * @param options
 * @param file
 * @param speedRate
 * @param appConfig
 */
const  csvToFile =async (file, appConfig,options:IAppOption,speedRate)=> {
    const mongoimport = path.resolve(appConfig.mongoimportPath, 'mongoimport');
    let commandOptions = ['--host', appConfig.hostname, '--port', appConfig.port, '--db',
        appConfig.database, '--collection', appConfig.collection, '--type', 'csv', '--ignoreBlanks', '--file', `${file.path}`];
    const isHeader = Prism.fromPredicate(Lens.fromProp<IAppOption,'isHeader'>('isHeader').get).getOption(options);
    isHeader.fold(()=> commandOptions.push('--fields', options.fields), ()=> commandOptions.push(`--headerline`));
    const time=(speedRate>0)?formatNumber(file.size/speedRate/1000/60):'?';
    console.log(display`\n start import file {green.bold ${file.name}}({green.bold ${formatNumber(file.size / 1024 / 1024)}MB}) estimate {green.bold ${time}minute}.\n`);
    await execCommandFile(mongoimport, commandOptions, process.stdout, '      ');
    try {
        fs.renameSync(file.path, path.resolve(appConfig.backupPath, 'B' + Date.now() + '_' + file.name));
        console.log(display`\n The file be moved to {yellow.bold ${appConfig.backupPath}}\n`);
    }
    catch (error){
        if(error && error.code === 'EBUSY'){
            console.log(display`\n {red.bold The file be locked and can't move} \n`)
        }else {
            console.error(error)
        }
   }

};

const watchText=()=>console.log(display` Watching start.Press  {yellow.bold Ctrl+C} quit.`);

export default App;