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
const retrieveOpcr = require('./head/retrieveOPCR');
const deleteCampusAPI = require('./admin/deleteCampus');

////////////////////////////////////
//  routes with admin permission  //
////////////////////////////////////
APIRoute.use('/admin/read/campus/', retrieveCampuses);
APIRoute.use('/admin/create/campus', assignCampus);
APIRoute.use('/admin/delete/campus', deleteCampusAPI);
APIRoute.use('/admin/assign/account', assignAccountAPI);
APIRoute.use('/admin/read/account', retrieveAccounts);

//////////////////////////////////
//  routes with pmt permission  //
//////////////////////////////////
APIRoute.use('/pmt/read/office/', getOfficeOpcr);
APIRoute.use('/pmt/status/opcr', setOpcrStatus);

///////////////////////////////////
//  routes with head permission  //
///////////////////////////////////
APIRoute.use('/head/read/opcr', retrieveOpcr);
APIRoute.use('/head/create/opcr', addOpcr);

APIRoute.use('/*', (req, res) => {
    res.json({
        message: 'Unknown route path',
        error: null
    });
})

module.exports = APIRoute;