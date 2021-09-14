# node-fhir-server-on-sqlite

This is a FHIR server built on Asymmetrik node-fhir-server-core framework (https://github.com/Asymmetrik/node-fhir-server-core), with a sqlite database as data store. 

Here I experimented a new database structure, in which the data fields in relational database correlates to the first level resource structure, instead of storing the whole resource as one entry as in the HAPI fhir implementation. This simplifies the mapping from JSON resource to its data store, and could potentially eliminate mapping in a fully implemented server. 

HAPI FHIR data store: (RES_TEXT stores full resource content)

<img width="241" alt="Screen Shot 2021-09-14 at 3 16 18 PM" src="https://user-images.githubusercontent.com/48110809/133320524-9165bc74-4c5d-4064-a1e2-65ccc6387103.png">


Data Tables:

![image](https://user-images.githubusercontent.com/48110809/133317302-d88f81a0-9baa-41e4-a2c7-636e028277ab.png)

Patient table: 

![image](https://user-images.githubusercontent.com/48110809/133317404-d0bec9c2-ff4b-43aa-92e9-a2d78f3399f9.png)

