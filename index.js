const { initialize, loggers, constants } = require('@asymmetrik/node-fhir-server-core');
const { VERSIONS } = constants;

let config = {
  profiles: {
    patient: {
      service: './patient.service.js',
      versions: [
        VERSIONS['4_0_0']
      ]
    },
    medicationrequest: {
      service: './medicationrequest.service.js',
      versions: [VERSIONS['4_0_0']]
    }
  }
};


let server = initialize(config);
let logger = loggers.get('default');

server.listen(3000, () => {
  logger.info('Starting the FHIR Server at localhost:3000');
});