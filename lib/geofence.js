var InNOut = require('in-n-out'),
    config = require('konfig')();

// Use only first geofence for now
var gf = new InNOut.Geofence(config.app.Geofences[0].polygon);

module.exports = gf;