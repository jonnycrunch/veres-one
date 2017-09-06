/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals should */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const config = bedrock.config;
const equihashSigs = require('equihash-signature');
const fs = require('fs');
const helpers = require('./helpers');
const jsigs = require('jsonld-signatures');
const mockData = require('./mock.data');
let request = require('request');
request = request.defaults({json: true, strictSSL: false});
const url = require('url');
const uuid = require('uuid/v4');
const querystring = require('querystring');

const urlObj = {
  protocol: 'https',
  host: config.server.host,
  pathname: '/dids'
};

// use local JSON-LD processor for signatures
jsigs.use('jsonld', bedrock.jsonld);

describe.skip('Create DID', () => {
  let ledgerAgent;

  it('should allow valid DID to be created', done => {
    const validDdo = bedrock.util.clone(mockData.ddos.valid);
    const registerEvent = bedrock.util.clone(mockData.events.create);
    registerEvent.input = [validDdo];

    async.auto({
      getPrivateKey: callback =>
        fs.readFile(config['veres-one'].privateKey, 'utf8', callback),
      sign: ['getPrivateKey', (results, callback) => jsigs.sign(registerEvent, {
        algorithm: 'LinkedDataSignature2015',
        privateKeyPem: results.getPrivateKey,
        creator: config['veres-one'].ddoPublicKey.id
      }, callback)],
      register: ['sign', (results, callback) => {
        request.post({
          url: config['veres-one'].routes.dids + '/' + validDdo.id,
          body: results.signEvent
        }, (err, res) => {
          should.not.exist(err);
          res.statusCode.should.equal(201);
          callback(null, res.headers.location);
        });
      }]
    }, err => done(err));
  });
  it('should prevent DID creation without proof', done => {
    done();
  });
  it('should prevent DID creation with insufficient work proof', done => {
    done();
  });
  it('should prevent DID creation with invalid proof', done => {
    done();
  });
});