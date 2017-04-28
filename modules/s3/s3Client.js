var AWS = require('aws-sdk');
var logger = require('log4js').getLogger('s3Client');

function s3Client() {
  this.config = undefined;
  this.s3 = undefined;

}

s3Client.prototype.init = function (config, cb) {
  this.config = config;

  AWS.config.update({
    accessKeyId: config.key,
    secretAccessKey: config.secret,
    region: config.region
  });

  this.s3 = new AWS.S3();
  cb(undefined, true);
}

s3Client.prototype.createBucket=function (resource,cb){
var params = {
    Bucket : resource,
    ACL : 'public-read'
}    
    this.s3.createBucket(params,cb);

}
/*
s3Client.prototype.deleteBucketPolicy=function (resource,cb){
    var params = {Bucket:resource}
    this.s3.deleteBucketPolicy(params,cb);
}
*/
/*
s3Client.prototype.listBuckets = function (cb){
    this.s3.listBuckets(cb);
}
*/
/*
s3Client.prototype.getSignedUrl=function(resource1,resource2, cb){
    var params = {Bucket:resource1, Key: resource2 , Expires: 20}
    this.s3.getSignedUrl(params,cb);    }
*/
module.exports = s3Client;
