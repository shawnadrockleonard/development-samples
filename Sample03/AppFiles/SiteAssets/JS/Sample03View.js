/// <reference path="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.3.min.js" />
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2014.02/jquery.SPServices.min.js" />
/// <reference path="ns.utils.js" />
/// <reference path="ns.models.js" />
/// <reference path="ns.sp.js" />

var _returnId = 0;


var upload = function () {
    var self = this;

    self.userId = ko.observable();
    self.userDate = ko.observable();
    self.webServerUrl = ko.observable();
    self.isUploading = ko.observable(false);
    self.numberOfFiles = ko.observable();
    self.uploadError = ko.observable(false);
    self.uploadErrorMessage = ko.observable();
    self.canUpload = ko.observable(false);

    self.initializePage = function () {
        var userContext = _spPageContextInfo;
        self.userId(userContext.userId);
        self.userDate(ns.utils.setDate());
        self.webServerUrl(userContext.webServerRelativeUrl);
    };

    self.uploadViewModel = {
        uploads: ko.observableArray([]),
        hasContent: ko.observable(false)
    };

    self.hasUploads = ko.computed(function () {
        if (self.uploadViewModel.uploads() && self.uploadViewModel.uploads().length > 0) {
            return true;
        }
        return false;
    }, this, { deferEvaluation: true });

    self.totalUploadSize = ko.computed(function () {
        var fileSize = 0;
        if (self.uploadViewModel.uploads().length > 0) {
            for (var i = 0; i < self.uploadViewModel.uploads().length; i++) {
                fileSize += parseInt(self.uploadViewModel.uploads()[i].size());
            }
        }
        return fileSize;
    }, this, { deferEvaluation: true });

    // handle the error label
    self.showErrorLabel = function (msg) {
        if (msg.length > 0) {
            self.uploadError(true);
            self.uploadErrorMessage(msg);
            return;
        }
    };


};

/*
    This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
*/
var vmmodel = new upload();
ko.applyBindings(vmmodel);
vmmodel.initializePage();

function setFormFields(formFieldTitleId, formFieldId) {
    var htmlSelector = ns.utils.cleanJQuerySelector(formFieldId);
    var htmlField = jQuery(htmlSelector);
    var htmlAttachments = htmlField.html();
    var htmlAttachmentsArr = htmlAttachments.split("#--#");
    if (htmlAttachmentsArr.length > 0 && htmlAttachmentsArr[0] != "") {
        vmmodel.uploadViewModel.hasContent(true);
        for (var idx = 0; idx < htmlAttachmentsArr.length; idx++) {
            var attachment = htmlAttachmentsArr[idx];
            var attachmentObject = attachment.split("#-#");
            ns.utils.consoleLog(String.format("URL:{0} Name:{1} Size:{2}", attachmentObject[0], attachmentObject[1], attachmentObject[2]))
            var model = new ns.models.uploadModel(attachmentObject[1], attachmentObject[2], attachmentObject[0], formFieldId);
            vmmodel.uploadViewModel.uploads.push(model);
        }
    }
}

$(document).ready(function () {
    ns.utils.consoleLog("Loading modules and js files");

    setFormFields("Description Attachments", "SampleCSRDescAttachments");
    setFormFields("Secondary Attachments", "SampleCSRSecondaryAttachments");
    setFormFields("Cover Letter Attachments", "SampleCSRCoverLetterAttachments");
});