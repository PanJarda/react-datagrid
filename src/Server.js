export default function Server(baseUrl, endpoints) {
	this.baseUrl = baseUrl;
	this.endpoints = endpoints;
}

Server.prototype._handleResponse = function () {
	var xhr = this;

	if (xhr.readyState == 4) {
		if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
			if (xhr.responseType !== 'text' && typeof xhr.response === 'string') {
				switch (xhr.responseType) {
					case 'json':
						xhr.sender[xhr.onSuccess](JSON.parse(xhr.responseText, xhr));
				}
			} else {
				xhr.sender[xhr.onSuccess](xhr.response, xhr);
			}
		} else if (xhr.error) {
			if (xhr.onFailure) {
				xhr.sender[xhr.onFailure](xhr);
			}
		}
	}
};

/*
example:
server.send('q=ahoj', 'search', this, 'receiveResponse', 'displayError');
*/
Server.prototype.send = function (props) {
	var resourcePath = props.resourcePath || '';
	var messageBody = props.messageBody;
	var sender = props.sender;
	var onSuccess = props.onSuccess;
	var onFailure = props.onFailure;
	var xhr = XMLHttpRequest
		? new XMLHttpRequest()
		: new window.ActiveXObject('Microsoft.XMLHTTP');
	xhr.sender = sender;
	xhr.onSuccess = onSuccess;
	xhr.onFailure = onFailure;
	xhr.onreadystatechange = this._handleResponse;
	var endpoint = this.endpoints[props.endpoint];
	xhr.responseType = endpoint.responseType || 'text';
	if (endpoint.method === 'GET') {
		xhr.open(
			endpoint.method,
			this.baseUrl + endpoint.location + resourcePath + '?' + messageBody,
			true
		);
		xhr.send();
	} else {
		xhr.open(
			endpoint.method,
			this.baseUrl + endpoint.location + resourcePath,
			true
		);
		xhr.send(messageBody);
	}
	return xhr;
};

Server.prototype.cancel = function (xhr) {
	xhr.abort();
};
