'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventsService');

module.exports.getEvents = function getEvents(req, res, next) {
    var offset = req.swagger.params['offset'].value;
    var limit = req.swagger.params['limit'].value;
    var country = req.swagger.params['country'].value;
    var month = req.swagger.params['month'].value;
    Event.getEvents(offset, limit, country, month)
        .then(function (response) {
            if (response.events.length === 0) {
                res.writeHead(404);
                res.end();
            } else {
                utils.writeJson(res, response);
            }
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getEventById = function getEventById(req, res, next) {
    var id = req.swagger.params['id'].value;
    Event.getEventById(id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            res.writeHead(404);
            res.end();
        });
};
