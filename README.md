# node-fhir-server-sqlite

This is a FHIR server built on Asymmetrik node-fhir-server-core framework, with a sqlite database as data store. 

Here I experimented a new database structure, in which the data fields in relational database correlates to the first level resource structure. 
Instead of the store in which the whole resource is stored as one entry in one cell. This simplified the mapping from JSON resource to a relational database.  
