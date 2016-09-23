/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var fs = require('fs');
module.exports = function(RED) {
    "use strict";

    function TLSConfig(n) {
        RED.nodes.createNode(this,n);
        this.valid = true;
        var certPath = n.cert.trim();
        var keyPath = n.key.trim();
        var caPath = n.ca.trim();

        if ( (certPath.length > 0) !== (keyPath.length > 0)) {
            this.valid = false;
            this.error(RED._("tls.error.missing-file"));
            return;
        }
        this.verifyservercert = n.verifyservercert;

        try {
            if (certPath) {
                this.cert = fs.readFileSync(certPath);
            }
            if (keyPath) {
                this.key = fs.readFileSync(keyPath);
            }
            if (caPath) {
                this.ca = fs.readFileSync(caPath);
            }
        } catch(err) {
            this.valid = false;
            this.error(err.toString());
            return;
        }
    }
    RED.nodes.registerType("tls-config",TLSConfig);

    TLSConfig.prototype.addTLSOptions = function(opts) {
        if (this.valid) {
            if (this.key) {
                opts.key = this.key;
            }
            if (this.cert) {
                opts.cert = this.cert;
            }
            if (this.ca) {
                opts.ca = this.ca;
            }
            opts.rejectUnauthorized = this.verifyservercert;
        }
        return opts;
    }

}
