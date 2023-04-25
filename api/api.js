/*
    This file connects the api routes to the main app.js file
*/
const APIRoute = require('express').Router();
const retrieveCampuses = require('./admin/retrieveCampuses');
const assignAccountAPI = require('./admin/assignAccounts');
const assignCampus = require('./admin/assignCampus');
const getOfficeOpcr = require('./pmt/getOfficeOpcr');

////////////////////////////////////
//  routes with admin permission  //
////////////////////////////////////
APIRoute.use('/campus/all', retrieveCampuses);
APIRoute.use('/campus', assignCampus);
APIRoute.use('/assign', assignAccountAPI);

//////////////////////////////////
//  routes with pmt permission  //
//////////////////////////////////
APIRoute.use('/office', getOfficeOpcr);

module.exports = APIRoute;