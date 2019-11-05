/* Copyright 2017 Tristian Flanagan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

'use strict';

/* Dependencies */
const fs = require('fs');
const path = require('path');
const merge = require('lodash.merge');
const debug = require('debug')('fs-config');
const Promise = require('bluebird');

/* FSConfig */
class FSConfig {

	constructor(){
		this.config = {};

		return this;
	}

	loadDir(dir){
		debug('Scanning configuration folder %s...', dir);

		return readdirAsync(dir).each((file) => {
			if(!file){
				return;
			}

			return this.loadFile(path.join(dir, file)).then((localConfig) => {
				this.config = merge(this.config, localConfig);

				return;
			});
		}).then(() => {
			return this.config;
		});
	}

	loadDirSync(dir){
		debug('Scanning configuration folder %s...', dir);

		readdirSync(dir).forEach((file) => {
			if(!file){
				return;
			}

			const localConfig = this.loadFile(path.join(dir, file), true);

			this.config = merge(this.config, localConfig);
		})

		return this.config;
	}

	loadFile(file, sync){
		debug('Loading configuration file %s... ', file);

		const configBase = path.basename(file, '.json');

		const localConfig = {};

		localConfig[configBase] = require(file);

		return sync ? localConfig : Promise.resolve(localConfig);
	}

}

/* Helpers */
const readdirAsync = (dir, options) => {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, options, (err, results) => {
			if(err){
				return reject(err);
			}

			return Promise.map(results, (result) => {
				const resultPath = path.join(dir, result);

				return new Promise((resolve, reject) => {
					fs.stat(resultPath, (err, stats) => {
						if(err){
							return reject(err);
						}

						if(stats.isDirectory()){
							return resolve(readdirAsync(resultPath));
						}

						return resolve(result);
					});
				});
			}).then(resolve).catch(reject);
		});
	});
};

const readdirSync = (dir, options) => {
	return fs.readdirSync(dir, options).map((result) => {
		const resultPath = path.join(dir, result);

		var stats = fs.statSync(resultPath);

		if(stats.isDirectory()){
			return readdirSync(resultPath);
		}

		return result;
	});
};

/* Export Module */
if(typeof(module) !== 'undefined' && module.exports){
	module.exports = FSConfig;
}else
if(typeof(define) === 'function' && define.amd){
	define('FSConfig', [], function(){
		return FSConfig;
	});
}
