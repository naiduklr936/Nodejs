var AWS = require('aws-sdk');
var os = require('os');
//var awsConfig = require('data/awsInstanceInfo').config;
var logger = require('log4js').getLogger('route53Helper');
var awsClientLib = require('lib/modules/route53/route53Client');
var awsClient = new awsClientLib();


function addDNS(config,dnscb) {

    logger.debug("Passing parameters route53Config", config);
    //logger.debug("Passing parameters InstancePublicIp", InstancePublicIP);

    awsClient.init({
        key: config.data.route53.key, //accessKeyID
        secret: config.data.route53.secret, //secretKeyID
        region: config.data.route53.region
    },
        function (err, data) {
            if (!err) {
                console.log("config data -->", data);
                launchRoute53(config, function(err,dnsData){
                    if(err){
                        logger.error(err.message);
                        dnscb(err);
                    }else{
                        dnscb(undefined,dnsData);
                    }
                });
            } else {
                logger.error(err);
                dnscb(err);
            }

        })
}

function launchRoute53(config,  dnsCallback) {
    logger.debug("COnfig data to route 53", config.data.route53);
    logger.debug("COnfig data to route 53 zone", config.data.route53.zone);
  //  var InstancePublicIp = InstancePublicIP;
    var params = {
        "HostedZoneId": config.data.route53.zone, // our Id from the first call
        "ChangeBatch": {
            "Changes": [
                {
                    "Action": config.data.route53.action,
                    "ResourceRecordSet": {
                        "Name": config.data.route53.hostname + "." + config.data.route53.domain,
                        "Type": "A",
                        "TTL": 300,
                        "ResourceRecords": [
                            {
                                "Value": config.data.route53.instancePublicIp
                            }
                        ]
                    }
                }
            ]
        }
    }

    awsClient.changeResourceRecordSets(params, function (err, result) {

        if (err) {
            logger.error('error creating DNS', err.message);
            dnsCallback(err);
        }
        else {
            logger.debug("Success in creating DNS (DNS Details)--> ", result);
            dnsCallback(undefined, config.data.route53.instancePublicIp);
        }
    });
}

module.exports.addDNS = addDNS;
