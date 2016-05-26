/// <reference path="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.3.min.js" />
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2014.02/jquery.SPServices.min.js" />
/// <reference path="ns.utils.js" />


if (ns === undefined) {
    var ns = ns || {};
}

if (ns.sp === undefined) {
    ns.sp = ns.sp || {};
}


if (ns.models === undefined) {
    ns.models = ns.models || {};
}


/*
 * Represents a file upload
 */
ns.models = (function() {

    var self = this;

    /*
     Represents a single file with specific file properties
     @param {string} name: Filename without path
     @param {number} size: the File size in bytes
     @param {string} serverUrl: represents the absolute web url
     @param {string} targetId: the DOM element
     @param {object} errorCode: the error code associated with the file action
     */
    self.uploadModel = function (name, size, serverUrl, targetId, errorCode) {
        var self = this;

        self.name = ko.observable(name);
        self.size = ko.observable(size);
        self.serverUrl = ko.observable(serverUrl);
        self.targetId = ko.observable(targetId);
        self.errorCode = ko.observable(errorCode);

        self.round = function (x, digits) {
            return parseFloat(x.toFixed(digits))
        }

        self.sizeMB = ko.computed(function () {
            var retValue = 0;
            if (self.size() !== undefined || self.size() !== 0) {
                var parsedValue = self.size() / 1048576; // div by MB std
                retValue = self.round(parsedValue, 3);
            }
            return retValue;
        }, this, { deferEvaluation: true });

        self.sizeGB = ko.computed(function () {
            var retValue = 0;
            if (self.size() !== undefined || self.size() !== 0) {
                var parsedValue = self.size() / 1073741824 // div by GB std
                retValue = self.round(parsedValue, 3);
            }
            return retValue;
        }, this, { deferEvaluation: true });

        self.hrefTag = ko.computed(function () {
            var retValue = String.format("{0}#-#{1}#-#{2}", self.serverUrl(), self.name(), self.size());
            return retValue;
        }, this, { deferEvaluation: true });

        return self;
    };

    return self;
})();