import gulp from "gulp";
import webpack from "webpack";
import chalk from "chalk";
import rimraf from "rimraf";
import {create as createServerConfig} from "./webpack.server";
import {create as createClientConfig} from "./webpack.client";
//we need dynamically load plguins from this file, so use require instead of import
const $ = require("gulp-load-plugins")(); 


//------------------------------------------
//Public tasks
gulp.task("clean:server", cb => rimraf("./build", cb));
gulp.task("clean:client", cb => rimraf("./public/build", cb));
gulp.task("clean", gulp.parallel("clean:server","clean:client"));

gulp.task("dev:server", gulp.series("clean:server", devServerBuild));
gulp.task("dev", gulp.series(
     "clean",
     devServerBuild,
     gulp.parallel(
         devServerWatch,
         devServerReload)));
gulp.task("prod:server", gulp.series("clean:server", prodServerBuild));
gulp.task("prod:client", gulp.series("clean:client",prodClientBuild));
gulp.task("prod",gulp.series("clean",gulp.parallel(prodServerBuild,prodClientBuild)));
//------------------------------------------
// private client tasks

function prodClientBuild(callback){
    const compiler = webpack(createClientConfig(false));
    compiler.run((err,stats)=>{
       outputWebpack("Prod:Client",err, stats);
       callback();
    });
}

//------------------------------------------
// private server tasks
const devServerWebpack = webpack(createServerConfig(true));

function devServerBuild(callback){
   devServerWebpack.run((err,stats)=>{
       outputWebpack("Dev:Server",err,stats);
       callback();
   }); 
}
// watch function watch the src code and rebuild the webpack build
function devServerWatch(){
    devServerWebpack.watch({},(err,stats)=>{
        outputWebpack("Dev:Server",err,stats);
    });
}
// reload watch the build dir and reload the server
function devServerReload(){
    return $.nodemon({
        script: "./build/server.js",
        watch: "./build",
        env: {
            "NODE_ENV": "development",
            "USE_WEBPACK": "true"
        }
    });
}
function prodServerBuild(callback){
   const prodServerWebpack = webpack(createServerConfig(false)); 
      prodServerWebpack.run((err,stats)=>{
       outputWebpack("Prod:Server",err,stats);
       callback();
   }); 
}
//------------------------------------------
//Helpers 
function outputWebpack(label, error, stats){
 if(error)
   throw new Error(error);
 if(stats.hasErrors()){
     $.util.log(stats.toString({colors:true}));
 } else {
     const time = stats.endTime - stats.startTime;
     $.util.log(chalk.bgGreen(`Built ${label} in ${time} ms`));
 }
 //$.util.log(stats.toString()); 
}
