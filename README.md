# Angular 5 (Cli Ejected) + Meteor Application With Docker

#### Containers
- Meteor Container (Server, Port 3000)
- Angular Container (Client Webpack-Server, Port 4200), Since meteor uses the same files (Models/Interfaces) for both client and server, Angular and Meteor containers shares those files
- Mongo Container with volume


#### Swarm
- Meteor server is replicated to 3 servers, App server uses only 1 replica (Light)
- Single Mongo Server, Meteor uses cache No need more
