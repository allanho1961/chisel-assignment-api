# Chisel AI Engineering Assignment
API providing the implementation of a "Least Recently Used" Cache.a

## GITHUB
git clone git@github.com:allanho1961/chisel-assignment-api.git

## Notes
This program contains the API for the maintenance of the Chisel AI assignment cache. Inside this
program are the following API routes. Postman calls are also included

This program is set to run on port 3001

## get /keys
GET    localhost:3001/keys    {url}/keys
Get a list of all cached keys

## purge /keys
PURGE  localhost:3001/keys    {url}/keys
Reset cached key list. Removes all cached keys from list

## put /key
PUT    localhost:3001/key     {url}/key      JSON BODY: { "key": "key", "value": "value" }
Put a new key into the cached key list. If the key specified
already exists, then the program updates the value and timestamp

## get /key/:id
GET    localhost:3001/key/:id {url}/key/:id
Get a single cached key where id matches the key value

## delete /key/:id
DELETE localhost:3001/key/:id {url}/key/:id
Remove a single cached key where the id matches the key value

## How to install
From the code directory, run the following command:
> npm install

## How to run this program

> # nodemon restarts automatically during code development process
> nodemon index.js
or
> node index.js

## Programmed and Submitted by
Allan Holbrook
For Chisel AI assignment
