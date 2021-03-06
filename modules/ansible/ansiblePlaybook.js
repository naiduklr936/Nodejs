 var ansibleClient = require('lib/modules/ansible/ansibleClient')();
 var logger = require('log4js').getLogger();
 //var config = require('data/awsInstanceInfo');

logger.setLevel('DEBUG');

// Install Jenkins in RedHAt instance
function runPlaybook(playbookInfo,callback){
logger.debug("run playbook",playbookInfo);
 ansibleClient.executePlaybook(playbookInfo, function (err, commandOut) {
     if (err) {
         logger.error('Error executing playbook:', err.message)
         return
     }
     logger.info('commandOut:', JSON.stringify(commandOut));  
     callback(undefined,commandOut);
     
 })
}
module.exports.runPlaybook = runPlaybook;