var logger = require('log4js').getLogger('s3Helper');
var awsClientLib = require('lib/modules/s3/s3Client');
var awsClient = new awsClientLib();

function createBuckets(config, cb) {

    awsClient.init({
        key: config.awsAccess.accessKeyId, //accessKeyID
        secret: config.awsAccess.secretAccessKey, //secretKeyID
        region: config.awsAccess.region
    },
        function (err, data) {
            if (!err) {
                console.log("config data -->", data);
                launchCreateBucket(config.bucketDef.bucketName, function (err, bucketData) {
                    if (err) {
                        logger.error("Error in Bucket Creation " + err )
                        cb(err);
                    } else {
                        logger.debug(" Bucket Created Successfully " + bucketData)
                        cb(undefined, bucketData);
                    }
                });
            } else {
                logger.error(err);
                cb(err);
            }

        })
}

function launchCreateBucket(bucketName, bucketCallBack) {

    awsClient.createBucket(bucketName, function (err, result) {
        if (err) {
            logger.error(" bucket error", err)
            bucketCallBack(err);
        } else {
            logger.debug(" bucket list result", result)
            bucketCallBack(undefined, result);
        }
    });
}


module.exports.createBuckets = createBuckets;