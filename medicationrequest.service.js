const { loggers, resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const logger = loggers.get('default');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');

const MedicationRequest = resolveSchema('4_0_0', 'medicationrequest'); // const Patient = resolveSchema(args.base_version, 'patient'); args not available yet, so put in version directly
const BundleEntry = resolveSchema('4_0_0', 'bundleentry');
const Bundle = resolveSchema('4_0_0', 'bundle');
const OperationOutcome = resolveSchema('4_0_0','operationoutcome');

function GetBaseUrl(context) {
    var baseUrl = "";
    const FHIRVersion = "/4_0_0/";
    var protocol = "http://";
    if (context.req.secure) { protocol = "https://"; }
    baseUrl = protocol + context.req.headers.host + FHIRVersion;
    return baseUrl;
}

// search by patient id to find medicationRequests
async function search(args, context) { 
    
    // search parameter: ?subject = id for example ?subject=0c5822350c2042a793ac08cf9064ba65
    let subject = args['subject']; 
    
    // working sql: SELECT * FROM medicationrequests where Reference_subject = 'Patient/pat1'
    const db = new Database('./persondb2.db', { verbose: console.log })
    const stmt = db.prepare('SELECT * FROM medicationrequests where Reference_subject = ?');
    const medReqRecords = stmt.all(`Patient/${subject}`); 

    // convert personArray (records from database) into an array of patient resource objects
    // const medReqResources = await Promise.all(
    //     medReqRecords.map( async (medReqRecord) => {return mapMedReqRecordToMedReqResource(medReqRecord)})
    // )
    // mapMedReqRecordToMedReqResource is not an async functinon
    const medReqResources = medReqRecords.map(record => mapMedReqRecordToMedReqResource(record))

    let baseUrl = GetBaseUrl(context)
    const count = medReqResources.length

    //2. Assemble the patient objects into entries
    let entries = medReqResources.map((medReqResource) => 
        {   
            let entry = new BundleEntry
            ({
                fullUrl: baseUrl + '/MedicationRequest/' + medReqResource.id,
                resource: medReqResource
            })
            return entry
        })

    // 3. Assemble the entries into a search bundle With the type, total, entries, id, and meta
    let bundle = new Bundle({
            id: uuidv4(),
            link: [{
                relation: "self",
                url: baseUrl + "/MedicationRequest"
            }],
            meta: { lastUpdated: new Date()},
            type: "searchset",
            total: count,
            entry: entries
        })
    return bundle;
}    


// convert data table record into fhir resource
function mapMedReqRecordToMedReqResource(medReqRecord) {

    // define a new fhir medReq resource instance
    let medReqResource = new MedicationRequest

    // set data from medReqRecord to medReq resource instance
    medReqResource.id = medReqRecord.id
    medReqResource.text = JSON.parse(medReqRecord.text)
    medReqResource.identifier = JSON.parse(medReqRecord.identifier)
    medReqResource.status = medReqRecord.status
    medReqResource.intent = medReqRecord.intent
    medReqResource.medicationReference = JSON.parse(medReqRecord.medicationReference)
    medReqResource.subject = JSON.parse(medReqRecord.subject)
    medReqResource.encounter = JSON.parse(medReqRecord.encounter)
    medReqResource.authoredOn = medReqRecord.authoredOn
    medReqResource.requester = JSON.parse(medReqRecord.requester)
    medReqResource.reasonCode = JSON.parse(medReqRecord.reasonCode)
    medReqResource.dosageInstruction = JSON.parse(medReqRecord.dosageInstruction)
    medReqResource.contained = medReqRecord.contained
    medReqResource.dispenseRequest = JSON.parse(medReqRecord.dispenseRequest)
    medReqResource.substitution = JSON.parse(medReqRecord.substitution)
    medReqResource.resourceType = medReqRecord.resourceType;
//note does not display properly, why? cannot use JSON.parse on it
    medReqResource.note = medReqRecord.note;
    return medReqResource
}

module.exports = {
    search, 
    mapMedReqRecordToMedReqResource
}