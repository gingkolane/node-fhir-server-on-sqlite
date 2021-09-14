const { loggers, resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const logger = loggers.get('default');
let BundleEntry = resolveSchema(args.base_version, 'bundleentry');
let Bundle = resolveSchema(args.base_version, 'bundle');
const Patient = resolveSchema('4_0_0', 'patient'); // const Patient = resolveSchema(args.base_version, 'patient'); args not available yet, so put in version directly

//search, returns a bundle
module.exports.search = async (args, context) => {
  // You will need to build your query based on the sanitized args
  let query = myCustomQueryBuilder(args);
  let results = await db.patients.find(query).toArray();
  let patients = results.map((result) => new Patient(result));
  let entries = patients.map((patient) => new BundleEntry({ resource: patient }));
  return new Bundle({ entry: entries });
};

// searchById
module.exports.searchById = async (args, context) => {
  let result = await db.patients.find({ _id: args.id });
  return new Patient(result);
};


//searchByVersionId
module.exports.searchByVersionId = async (args, context) => {
  let result = await db.patients.find({ _id: args.id, versionId: args.version_id });
  return new Patient(result);
};

// // history, returns a bundle
// module.exports.history = async (args, context) => {
//   // You will need to build your query based on the sanitized args
//   let query = myCustomQueryBuilder(args);
//   let results = await db.patientHistory.find(query);
//   let patients = results.map((result) => new Patient(result));
//   let entries = patients.map((patient) => new BundleEntry({ resource: patient }));
//   let bundle = new Bundle({ entry: entries });
//   return bundle;
// };

// historyById
module.exports.historyById = async (args, context) => {
  let result = await db.patientHistory.find({ _id: args.id });
  return new Patient(result);
};

// Create
module.exports.create = async (args, context) => {
  let doc = new Patient(args.resource).toJSON();
  let results = await db.patients.insertOne(doc);

  return {
    id: results._id,
    // This is optional if you support versions
    resource_version: 1,
  };
};

// //update
// module.exports.update = async (args, context) => {
// 	let Patient = resolveSchema(args.base_version, 'patient');
// 	let doc = new Patient(args.resource).toJSON();
// 	let results = await db.patients.findOneAndUpdate({
// 		{ _id: args.id },
// 		{ $set: doc },
// 		{ upsert: true },
// 	});

// 	return {
// 		id: results._id,
// 		// This is optional if you support versions
// 		resource_version: 1,
// 	};
// };

// // patch
// module.exports.patch = async (args, context) => {
// 	let Patient = resolveSchema(args.base_version, 'patient');
// 	let doc = new Patient(args.resource).toJSON();
// 	let current = await db.patients.findOne({ _id: args.id });
// 	let patch = insertPatchLibraryHereAndPatchDocuments(doc, current);

// 	let results = await db.patients.findOneAndUpdate({
// 		{ _id: args.id },
// 		{ $set: patch },
// 		{ upsert: true },
// 	});

// 	return {
// 		id: results._id,
// 		// This is optional if you support versions
// 		resource_version: 1,
// 	};
// };

// remove a record by id
const { ServerError } = require('@asymmetrik/node-fhir-server-core');
module.exports.remove = async (args, context) => {
  try {
    await db.patients.remove({ _id: args.id });
  } catch (err) {
    // Must be 405 (Method Not Allowed) or 409 (Conflict)
    // 405 if you do not want to allow the delete
    // 409 if you can't delete because of referential
    // integrity or some other reason
    throw new ServerError(err.message, {
      statusCode: 409,
      issue: [
        {
          severity: 'error',
          code: 'internal',
          details: {
            text: err.message,
          },
        },
      ],
    });
  }

  return;
};