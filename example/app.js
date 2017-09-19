const App =require('../lib').default;

App.of(true).start(true).then().catch(console.error)
module.exports=(...args)=>{
    console.log(args)
}
