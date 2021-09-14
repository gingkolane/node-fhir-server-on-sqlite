# node-fhir-server-sqlite

This is a FHIR server built on Asymmetrik node-fhir-server-core framework, with a sqlite database as data store. 

Here I experimented a new database structure, in which the data fields in relational database correlates to the first level resource structure. 
Instead of the store in which the whole resource is stored as one entry in one cell. This simplified the mapping from JSON resource to a relational database. 

Data Tables: 
![image](https://user-images.githubusercontent.com/48110809/133317302-d88f81a0-9baa-41e4-a2c7-636e028277ab.png)

Patient table: 
![image](https://user-images.githubusercontent.com/48110809/133317404-d0bec9c2-ff4b-43aa-92e9-a2d78f3399f9.png)

