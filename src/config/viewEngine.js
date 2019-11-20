import express from "express";
import expressEjsExtend from "express-ejs-extend";

//Config view engine for app

let configViewEngine = (app) => {
  app.use(express.static("./src/public")); //Cotain UI libs
  app.engine("ejs", expressEjsExtend);
  app.set("view engine", "ejs"); //Set view engine
  app.set("views", "./src/views"); //Set view folder
};

module.exports = configViewEngine;