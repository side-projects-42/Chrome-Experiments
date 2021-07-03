/**
 * Copyright 2016 Google Inc.
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

define(["style/loading.scss"], function (loadingStyle) {

	var loading = document.createElement("DIV");
	loading.id = "Loading";
	document.body.appendChild(loading);

	var minTime = 400;
	var loadStart = Date.now();

	return {
		load : function(instrument){
			loadStart = Date.now();
			loading.classList.add("Visible");
		},
		resolve : function(){
			var diff = Date.now() - loadStart;
			if (diff > minTime){
				loading.classList.remove("Visible");
			} else {
				setTimeout(function(){
					loading.classList.remove("Visible");
				}, minTime - diff);
			}
		}
	};
});