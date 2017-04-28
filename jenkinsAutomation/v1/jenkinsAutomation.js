
var util = require('util');
var baseWorkflow = require('core/baseWorkflow');
var stackdcLib = require('stackdc-library');
var config = require('config/config');
var logger = require('log4js').getLogger('jenkinsAutomation');
var dns = require('lib/modules/route53/route53Helper');
var playbookLib = require('lib/modules/ansible/ansiblePlaybook');

function jenkinsAutomation() {
    baseWorkflow.call(this);
    return this;
};

util.inherits(jenkinsAutomation, baseWorkflow);

jenkinsAutomation.prototype.StartEvent = function (reqData, done) {
    var workflowData = { input: reqData, attrs: {} };

    logger.debug("StartEvent");
    done(undefined, workflowData);

};

jenkinsAutomation.prototype.Process = function (workflowData, done) {

    logger.debug("Process", workflowData);
    done(undefined, workflowData);
};

jenkinsAutomation.prototype.EndEvent = function (workflowData, done) {
    logger.debug("EndEvent", workflowData);
    done(undefined, workflowData);

};
jenkinsAutomation.prototype.ConfigDNS = function (workflowData, done) {

    logger.debug("ConfigDNS", workflowData.input);

    dns.addDNS(workflowData.input, function (err, dnsDetails) {
        if (err) {
            console.log("error addRoute53", err);
            done(err);
        }
        else {
            console.log("DNS details --->", dnsDetails);
            done(undefined, workflowData)
        }
    });
};

jenkinsAutomation.prototype.InstallJenkins = function (workflowData, done) {

    logger.debug("InstallJenkins-->", workflowData.input);
        var playbookConfig = {
        "host": workflowData.input.data.route53.instancePublicIp,
        "port": 22,
        "username": workflowData.input.data.access.user,
        "elevatedPrivelage": true,
        "debug": true,
        "localFile": workflowData.input.data.playbooks.localFile,
        "privateKey": workflowData.input.data.access.keypair.privateKey,
        "vars": {

            "jenkins_hostname": workflowData.input.data.route53.instancePublicIp,
            "jenkins_admin_username": workflowData.input.data.playbooks.jenkins_admin_username,//jenkins User name
            "jenkins_admin_password": workflowData.input.data.playbooks.jenkins_admin_password,//jenkins Password
            "manager_user": workflowData.input.data.playbooks.manager_user, //tomcat user name
            "manager_password": workflowData.input.data.playbooks.manager_password //tomcat password
        }
    }
    logger.debug('Info Passing to PlayBook==>', playbookConfig)
    playbookLib.runPlaybook(playbookConfig, handresult);
    function handresult(error, body) {
        if (!error) {
            logger.debug('Playbook executing result===>', body)
            done(undefined, workflowData.input.data.route53.instancePublicIp)

        }
        else {
            logger.error('Error Executing Playbook ', error)
            done(error)
        }
    }
};
module.exports = jenkinsAutomation;