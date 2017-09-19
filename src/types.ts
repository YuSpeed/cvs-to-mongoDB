
export interface IAppOption{
    /**
     * app title
     */
    title:string;
    /**
     * app logo
     */
    logo:string;
    /**
     * app menu
     */
    menu?:{};
    /**
     * setting file
     */
    file:string;
    /**
     * search import file using the item
     */
    pattern:string;
    /**
     * using the fields instead of heading when isHeader is false
     */
    fields:string;
    /**
     * True meaning csv file include header
     */
    isHeader:boolean;
    /**
     * is watch mode
     */
    isWatch:boolean;
    /**
     * validate setting
     */
    validate:Function;
    /**
     * the params will enter to setting file
     */
    params: {[key: string]: {
        /**
         * type
         */
        type: string,
        description: string,
        'default'?: Function,
        validate?:Function,
        componentType:string}
    }
}