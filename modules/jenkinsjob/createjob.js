var jenkinsapi = require('jenkins-api');
var fs = require('fs');
var logger = require('log4js').getLogger('createjob');
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');
var builder = new xml2js.Builder();

function createjob(config,cb) {
  
  console.log("http://"+config.jenkins.jenkinsusername+":"+config.jenkins.jenkinspwd+"@" + config.instanceDef.instanceIp + ":8080");
  
  var jenkins = jenkinsapi.init("http://"+config.jenkins.jenkinsusername+":"+config.jenkins.jenkinspwd+"@" + config.instanceDef.instanceIp + ":8080");
  
  fs.readFile('lib/modules/data/config.xml', 'utf-8', function (err, data) {
    if (err) {
      console.log("ERROR", err);
      cb(err)
    }
    else {
      parseString(data, function (err, result) {
        if (err) { console.log(err); }
        else {
          var json = result;
          json['maven2-moduleset'].scm[0].userRemoteConfigs[0]['hudson.plugins.git.UserRemoteConfig'][0].url[0] = config.jobconfig.githuburl;
          json['maven2-moduleset'].publishers[0]['hudson.plugins.s3.S3BucketPublisher'][0].entries[0]['hudson.plugins.s3.Entry'][0].bucket[0] = config.bucketDef.bucketName;
          json['maven2-moduleset'].publishers[0]['hudson.plugins.s3.S3BucketPublisher'][0].entries[0]['hudson.plugins.s3.Entry'][0].selectedRegion[0] = config.awsAccess.region;
          var xml = builder.buildObject(json);
          fs.writeFile('lib/modules/data/modified.xml', xml, function (err, data) {
            if (err) {
              console.log(err);
              callback(err)
            }
            else {
              console.log("successfully written our update xml to file");
              var data = fs.readFileSync('lib/modules/data/modified.xml', { encoding: 'utf-8' });
              console.log("config data--->", data);
              jenkins.create_job(config.job.jobName, data, function (err, jobData) {
                if (err) {
                  console.log("we are getting error job data ", err.message);
                  cb(err);
                } else {
                  console.log("successfully created the job", jobData);
                  cb(undefined, jobData);
                }
              });
              jenkins.build
            }
          })
        }
      });
    }
  });
}

module.exports.createjob = createjob;
