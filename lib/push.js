var assert = require('assert'),
  futils = require('./fhutils'),
  aeroGearLoaded = false;

module.exports = function (cfg) {
  assert.ok(cfg, 'cfg is undefined');
  var fhutils = new futils(cfg);

  var props = fhutils.getMillicoreProps();
  var headers = {
    'X-Project-Id': props.widget,
    'X-App-Id': props.instance
  };
  fhutils.addAppApiKeyHeader(headers);
  var settings = {
    url: 'https://' + props.millicore + ':' + props.port + '/box/api/unifiedpush/mbaas/',
    applicationId: "fake", // we have to use fake ID, it will be added by supercore
    masterSecret: "fake", // we have to use fake secret, it will be added by supercore
    headers: headers
  };


  // $fh.push
  var sender;
  return function push(message, options, callback) {
    if (!aeroGearLoaded) {
      var AeroGear = require("unifiedpush-node-sender");
      sender = AeroGear.Sender(settings);
      aeroGearLoaded = true;
    }

    if (!message) return callback(new Error("Missing required 'message' parameter"));
    if (!options) return callback(new Error("Missing required 'options' parameter"));
    if (!options.broadcast) {
      if (!options.apps) return callback(new Error("Missing required 'options.apps' parameter while 'options.broadcast' not specified" + JSON.stringify(options)));
    }
    if (sender){
      sender.send(message, options, callback);
    }
  }
};

