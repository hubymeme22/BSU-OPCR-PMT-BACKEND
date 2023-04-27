/*
    This file connects the api routes to the main app.js file
*/
const APIRoute = require('express').Router();
const retrieveCampuses = require('./admin/retrieveCampuses');
const retrieveAccounts = require('./admin/retrieveAccounts');
const assignAccountAPI = require('./admin/assignAccounts');
const assignCampus = require('./admin/assignCampus');
const getOfficeOpcr = require('./pmt/getOfficeOpcr');
const setOpcrStatus = require('./pmt/setOpcrStatus');
const addOpcr = require('./head/addOPCR');

////////////////////////////////////
//  routes with admin permission  //
////////////////////////////////////
APIRoute.use('/admin/campus/all', retrieveCampuses);
APIRoute.use('/admin/campus', assignCampus);
APIRoute.use('/admin/assign', assignAccountAPI);
APIRoute.use('/admin/accounts', retrieveAccounts);

//////////////////////////////////
//  routes with pmt permission  //
//////////////////////////////////
APIRoute.use('/pmt/office/available-opcr', getOfficeOpcr);
APIRoute.use('/pmt/opcr', setOpcrStatus);

///////////////////////////////////
//  routes with head permission  //
///////////////////////////////////
APIRoute.use('/head/opcr', addOpcr);

module.exports = APIRoute;