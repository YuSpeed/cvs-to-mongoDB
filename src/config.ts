import * as path from 'path';
import FileTools from 'mocoolka-tools-io';
import {isInteger}from 'mocoolka-type'
import {constant}from 'mocoolka-function'
import {strmap}from 'mocoolka-algebraic';
const {StrMap}=strmap;
const validateInteger= (value)=>isInteger(Number(value))?true:'Please enter a valid integer';
import {IAppOption} from './types'
const AppOption:IAppOption={
    title:'Welcome to use csvToMongoDB. The is a open source program for import data from csv file to MongoDB.',
    logo:'Yu Speed',
    file:'app.json',
    isWatch:true,
    pattern:'',
    isHeader:false,
    fields:'symbol,date,price,volume,openInterest,askPrice1,askVolume1,bidPrice1,bidVolume1',
    validate(data){
       return strmap.toArray(new StrMap(this.params)).reduce(([key,value],pre)=>{
            return pre+value['validate']? (value['validate'](data[key])+'\n'):'';
        },'')
    },
    params: {
        hostname: {
            type: "string",
            description: 'Please enter your monggoDB hostname',
            'default': constant('localhost'),
            componentType:'string',

        },
        port: {
            type: "int",
            description: 'Please enter your monggoDB port',
            'default': constant(27017),
            componentType:'number',
            validate:validateInteger
        },
        database: {
            type: "string",
            description: 'Please enter your database name',
            'default': constant('users'),
            componentType:'string',
        },
        collection: {
            type: "string",
            description: 'Please enter your collection name',
            'default': constant('ticks'),
            componentType:'string',
        },
        username: {
            type: "string",
            description: 'Please enter your username',
            'default': constant('admin'),
            componentType:'string',
        },
        password: {
            type: "string",
            description: 'Please enter your password',
            'default': constant('1'),
            componentType:'password',
        },
        pattern: {
            type: "string",
            description: 'Please enter a import pattern that search csv file.',
            'default': constant('f:/history/data/tick/*.csv'),
            componentType:'string',
        },
        mongoimportPath: {
            type: "string",
            description: 'Please enter the shell command mongoimport path',
            'default': constant('D:/MongoDB/Server/3.4/bin/'),
            componentType:'string',
            validate(value){
                if(!FileTools.fileExist(path.resolve(value,'mongoimport.exe'))) {
                    return'mongoimport path not correct,please check.';
                }
                return true;
            }
        },
        backupPath:{
            type: "string",
            description: 'Please enter the backup path',
            'default': constant('f:/history/backup/tick'),
            componentType:'string',
            validate(value){
                if(!FileTools.directoryExist(path.resolve(value))) {
                    return'backup path not correct,please check.';
                }
                return true;
            }
        }
    }
}
export default AppOption;