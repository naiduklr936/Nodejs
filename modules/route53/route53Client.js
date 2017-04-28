var AWS = require('aws-sdk');
var os = require('os');
var logger = require('log4js').getLogger('route53Client');

function route53Client() {
  this.config = undefined;
  this.route53 = undefined;

}

route53Client.prototype.init = function (config, cb) {
  this.config = config;

  AWS.config.update({
    accessKeyId: config.key,
    secretAccessKey: config.secret,
    region: config.region
  });

  this.route53 = new AWS.Route53();
  cb(undefined, true);
}

route53Client.prototype.changeResourceRecordSets=function (resource,cb){
logger.debug("Create DNS Parms", resource );
this.route53.changeResourceRecordSets(resource,cb);
}

module.exports = route53Client;


