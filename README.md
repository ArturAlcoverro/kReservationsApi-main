# README

Follow the following link `https://docs.docker.com/get-docker/` for information about how to install docker in your machine.

Start the postgres image
`docker compose -f stack.yml up`

You can login to a postgres manager with `http://localhost:8080/?pgsql=db&username=postgres&db=postgres&ns=public` the password is `example`

Destroy the postgres instance
`docker compose -f stack.yml up`