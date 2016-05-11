/// <reference path="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.3.min.js" />


if (ns === undefined) {
    var ns = ns || {};
}

if (ns.sp === undefined) {
    ns.sp = ns.sp || {};
}


/*
 * Namespace contains a number of helper methods
 */
ns.utils = (function () {

    var self = this;

    /*
     Write message to the console.  Handle any console hooks here for IE not in debug mode 
     @params {string} a message to write to the console
     */
    self.consoleLog = function(message) {
        if ((window.console != undefined) && window.console) {
            console.log(message);
        }
    };

    /*
     * Parse the DOM location and return the root path
     */
    self.getEnvironmentRoot = function () {
        var urlRoot = window.location.href.substring(0, window.location.href.indexOf("_layouts"));
        return urlRoot;
    }

    /*
     * Handles exceptions that occur in a delegate function
     */
    self.eventFunctionFailed = function (sender, args) {
        self.diagnostics('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    };

    self.getParameterByName = function(name, defaultValue) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? defaultValue : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    /*
    Formats a date MM/DD/YYYY
    */
    self.setDate = function() {

        var fullDate = new Date();
        var mLength = (fullDate.getMonth() + 1).toString().length;
        var dLength = fullDate.getDate().toString().length;
        var twoDigitMonth, twoDigitDay;

        if (mLength == '1') {
            twoDigitMonth = '0' + (fullDate.getMonth() + 1);
        } else {
            twoDigitMonth = (fullDate.getMonth() + 1);
        }

        if (dLength == '1') {
            twoDigitDay = '0' + fullDate.getDate();
        } else {
            twoDigitDay = fullDate.getDate();
        }

        var currentDate = fullDate.getFullYear() + "-" + twoDigitMonth + "" + twoDigitDay;
        return currentDate;
    };

    /*
    Formats and ID int something jquery can use
    */
    self.cleanJQuerySelector = function(myid) {
        return "#" + myid.replace(/(:|\.|\$|\[|\]|,)/g, "\\$1");
    };

    /*
    Hide html field based on NOBR preseeding the title
    */
    self.hideFormField = function(formFieldTitle) {
        var formFld = $('nobr:contains("' + formFieldTitle + '")').closest('tr');
        if (formFld != null) {
            formFld.hide();
        }
    };

    /*
     Hide an Onet field
     */
    self.hideOnetField = function(formFieldTitle) {
        var formFld = $(self.cleanJQuerySelector(formFieldTitle)).closest('tr');
        if (formFld != null) {
            formFld.hide();
        }
    };

    /*
     Hide a span field with a title
     */
    self.hideWildCardField = function(formFieldTitle) {
        var formFld = $("span[id*='" + formFieldTitle + "']").closest('table');
        if (formFld != null) {
            formFld.hide();
        }
    };

    return self;
})();