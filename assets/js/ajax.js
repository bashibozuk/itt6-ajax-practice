/**
 * 
 */

var Ajax = {
	/**
	 * 
	 * @returns {XMLHttpRequest}
	 */
	createRequest: function() {
		
		var request;
		
		if (typeof XMLHttpRequest != 'undefined') {
			request = new XMLHttpRequest();
		} else if (typeof ActiveXObject != 'undefined') {
			request = new ActiveXObject('Microsoft.XMLHTTP');
		}
		
		if (typeof request == 'udefined') {
			throw new Error('Your browser does not support AJAX');
		}
		
		return request;
	},
	/**
	 * 
	 * @param {String} method - GET / POST
	 * @param {String} url 
	 * @param {Boolean} async
	 * @param {Function} handler
	 * @param {Object} params
	 * @param {String} username
	 * @param {String} password
	 * @returns
	 */
	request: function(method, url, async, handler, params, username, password) {
		var xhr = this.createRequest();
		var _this = this;
		if (async) {
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && _this.statusCodeOK(xhr.status)) {
					handler(xhr.responseText);
				}
			} 
		}
		
		var params = this.parseParams(params);
		if (method == 'GET' && params.length) {
			url = this.addParamsToUrl(url, params);
		}
		
		xhr.open(method, url, async, username, password);
		
		if (method == 'POST') {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		
		
		var requestBody = method == 'POST' ? params : null;
		xhr.send(requestBody);
		
		if (!async) {
			return xhr.responseText;			
		}
		
	},
	
	statusCodeOK : function(code) {
		if (code >= 200 && code < 300) {
			return true;
		}
		
		if (code == 304) {
			return true;
		}
		
		return false;
	},
	
	// {min: 3, max: 10}
	// min=3&max=10
	
	/**
	 * @param {Object} params
	 */
	parseParams: function(params) {
		if (!params) {
			return '';
		}
		
		var result = [];
		
		for (var i in params) {
			var param = encodeURIComponent(i) + '=' + encodeURIComponent(params[i]);
			result.push(param);
		}
		
		return result.join('&');
	},
	
	addParamsToUrl: function(url, params) {
		// http://abv.bg?+ params
		// http://trstcom?a=b + & + params
		
		if (url.indexOf('?') == -1) {
			return url + '?' + params;
		}
		
		if (url.charAt(url.length - 1) == '?' || 
				url.charAt(url.length - 1) == '&') {
			return url + params;
		}
		
		return url + '&' +  params;
	}
}