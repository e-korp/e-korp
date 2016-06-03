# E-korp

### Requirements
Make sure you have [Docker](https://www.docker.com/) and
[Docker compose](https://docs.docker.com/compose/) installed on your system.

Versions used in this guide: *Docker 1.11.1 build 5604cbe* and *Docker Compose
1.7.0, build 0d7bf73*

**OBS**
The Dockerfile syntax is changed from version 2>
See https://docs.docker.com/compose/compose-file/#versioning for differences


### Installation & Setup
1. Clone this repository `git clone https://github.com/e-korp/e-korp.git`
2. Run `docker-compose up`

**What is happening?** Probably an error.

Docker-compose builds 4 images:
- ekorp_nginx - *Reverse proxy*
- ekorp_app - *NodeJS app*
- ekorp_mongo - *MongoDb as database*
- ekorp_redis - *Redis for cache*

##### SSL certificates
Nginx expects SSL certificates when starting. They should be placed here:
*./docker/nginx/fullchain.pem*
*./docker/nginx/privkey.pem*

In order for the certificates to work, you need to put the domain in your
`/etc/hosts` file.

Make sure port 443 is not used on the docker host machine.

### Tests
Run and watch tests with `npm test`. Tests are placed next to the implementation
with `.test.js` ending. Mocha will scan recursively and run these tests
automatically


### Todo
Alot...

- Mount MongoDB as volume to persist data
- Update this readme
- Deploying instructions
- Docker clustering (not needed atm).
- Solution for the dependency-building issue
(npm rebuilds all dependencies in the entry-point script).
