
var bucket = require('lib/modules/s3/s3Helper');
var playbookLib = require('lib/modules/ansible/ansiblePlaybook');
var createjobjenkin = require('lib/modules/jenkinsjob/createjob');
var util = require('util');
var baseWorkflow  = require('core/baseWorkflow');
var stackdcLib = require('stackdc-library');
var config = require('config/config');
var logger = require('log4js').getLogger('jenkinJobCreateOrchestration'); 

function jenkinJobCreateOrchestration(){
    baseWorkflow.call(this);
    return this;
};

util.inherits(jenkinJobCreateOrchestration,baseWorkflow);

jenkinJobCreateOrchestration.prototype.StartEvent =  function( reqData , done ){
    var workflowData = {input: reqData, attrs:{ }};

    logger.debug("StartEvent");
    done(undefined,workflowData);

};

jenkinJobCreateOrchestration.prototype.Process = function( workflowData , done ){

    logger.debug("Process",workflowData);
    done(undefined,workflowData);
};

jenkinJobCreateOrchestration.prototype.EndEvent =  function( workflowData , done ){
   logger.debug("EndEvent",workflowData);
    done(undefined,workflowData);

};
jenkinJobCreateOrchestration.prototype.CreateBucket = function( workflowData , done ){

    bucket.createBuckets(workflowData.input.data, function (err, bucketDetails) {
        if (err) {
            done(err);
        }
        else {
            console.log("Bucket Details --->", bucketDetails);
            done(undefined, workflowData);
        }
    });
};
jenkinJobCreateOrchestration.prototype.BucketAccess = function( workflowData , done ){

 var playbookConfig = {
        "host": workflowData.input.data.instanceDef.instancePublicIP,
        "port": 22,
        "username": workflowData.input.data.access.user,
        "elevatedPrivelage": true,
        "debug": true,
        "localFile": workflowData.input.data.playbooks.localFile,
        "privateKey": workflowData.input.data.access.keypair.privateKey,
        "vars": {
            "region" : workflowData.input.data.awsAccess.region,
            "awssecretaccesskey" : workflowData.input.data.awsAccess.secretAccessKey,
            "awsaccesskeyid": workflowData.input.data.awsAccess.accessKeyId,
            "bucket_name": workflowData.input.data.bucketDef.bucketName
            }
    }
    logger.debug('Info Passing to PlayBook==>', playbookConfig)
    playbookLib.runPlaybook(playbookConfig, handresult);
    function handresult(error, body) {
        if (!error) {
            logger.debug('Playbook executing result===>', body)
            done(undefined, workflowData)
        }
        else {
            logger.error('Error Executing Playbook ', error)
            done(error)
        }
    }
};
jenkinJobCreateOrchestration.prototype.CreateJob = function( workflowData , done ){

    createjobjenkin.createjob(workflowData.input.data, function (err, jobDetails) {
        if (err) {
            
            done(err);
        }
        else {
            console.log("Job Details --->", jobDetails);
            done(jobDetails);
        }
    });
};
module.exports = jenkinJobCreateOrchestration;