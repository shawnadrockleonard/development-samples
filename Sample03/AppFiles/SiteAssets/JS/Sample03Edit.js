/// <reference path="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.3.min.js" />
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2014.02/jquery.SPServices.min.js" />
/// <reference path="ns.utils.js" />
/// <reference path="ns.sp.js" />

var _returnId = 1;

/*
 * Represents a file upload
 */
var uploadModel = function (name, size, serverUrl, targetId, errorCode) {
    var self = this;

    self.name = ko.observable(name);
    self.size = ko.observable(size);
    self.serverUrl = ko.observable(serverUrl);
    self.targetId = ko.observable(targetId);
    self.errorCode = ko.observable(errorCode);

    self.sizeMB = ko.computed(function () {
        var retValue = 0;
        if (self.size() !== undefined || self.size() !== 0) {
            retValue = self.size() / 1048576; // div by MB std
        }
        return retValue;
    }, this, { deferEvaluation: true });

    self.sizeGB = ko.computed(function () {
        var retValue = 0;
        if (self.size() !== undefined || self.size() !== 0) {
            retValue = self.size() / 1073741824 // div by GB std
        }
        return retValue;
    }, this, { deferEvaluation: true });

    self.hrefTag = ko.computed(function () {
        var retValue = String.format("{0}#-#{1}#-#{2}", self.serverUrl(), self.name(), self.size());
        return retValue;
    }, this, { deferEvaluation: true });

    return self;
}


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

    // hijack the (dragenter) event
    self.dragEnter = function (data, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        $(evt.target).addClass('over');
    };

    // hijack the (dragleave) event
    self.dragLeave = function (data, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        $(evt.target).removeClass('over');
    };

    // hijack the (drop) event
    self.drop = function (data, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        $(evt.target).removeClass('over');

        // TODO: get field and augment the TEXTAREA with server relative URL's
        ns.utils.consoleLog(evt.currentTarget.id + "field id firing");
        var jqueryId = ns.utils.cleanJQuerySelector(evt.currentTarget.id);
        var jqueryTargetId = evt.currentTarget.id.replace("UploadBox", "");

        var files = evt.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            self.isUploading(true);
            self.canUpload(false);
            self.numberOfFiles(files.length);
            self.uploadFiles(jqueryId, jqueryTargetId, files);
        }
    };

    // hijack the (dragover) event
    self.dragOver = function (data, evt) {
        evt.preventDefault();
    };

    self.getOrCreateFolder = function (folderName) {

        var dfd = new jQuery.Deferred();


        var clientContext,
        oWebsite,
        oList,
        itemCreateInfo;

        clientContext = new SP.ClientContext.get_current();
        oWebsite = clientContext.get_web();
        oList = oWebsite.get_lists().getByTitle("Documents");

        // first check for folder
        var folderUrl = self.webServerUrl() + "/Shared Documents/" + folderName;
        var folderObject = oWebsite.getFolderByServerRelativeUrl(folderUrl);

        clientContext.load(folderObject);
        clientContext.executeQueryAsync(
            Function.createDelegate(this, function () {
                var relativeFolderUrl = folderObject.get_serverRelativeUrl();
                successHandler(relativeFolderUrl);
            }),
            Function.createDelegate(this, function (sender, args) {
                if (args.get_errorTypeName() === "System.IO.FileNotFoundException") {
                    // Folder doesn't exist.
                    ns.utils.consoleLog("Folder does not exist.");
                    itemCreateInfo = new SP.ListItemCreationInformation();
                    itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
                    itemCreateInfo.set_leafName(folderName);
                    var oListItem = oList.addItem(itemCreateInfo);
                    oListItem.update();

                    clientContext.load(oListItem);
                    clientContext.executeQueryAsync(
                        Function.createDelegate(this, function () {
                            var relativeFolderUrl = oListItem.get_fieldValues().FileRef
                            successHandler(relativeFolderUrl);
                        }),
                        Function.createDelegate(this, errorHandler)
                    );

                }
                else {
                    // An unexpected error occurred.
                    errorHandler(sender, args);
                }
            })
        );

        function successHandler(relativeFolderUrl) {
            ns.utils.consoleLog("Go to the <a href='" + relativeFolderUrl + "'>new folder</a>.");
            dfd.resolve(relativeFolderUrl);
        }

        function errorHandler(sender, args) {
            dfd.reject(sender, args);
        }

        return dfd.promise();
    }

    // Get the local file as an array buffer.
    self.getFileBuffer = function (fileNameWithPath) {
        var deferred = jQuery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            deferred.resolve(fileNameWithPath, e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(fileNameWithPath);
        return deferred.promise();
    }

    /**
     @method leverage HTML form data for handling multipart uploads
     @param jqueryId {string} element id for jquery to toggle
     @param jqueryTargetId {string} element id for jquery to manipulate text
     @param files {FormData.Files} collection of form multipart/form-data files
     */
    self.uploadFiles = function (jqueryId, jqueryTargetId, files) {
        // HTML5 Form Data
        if (window.FormData !== undefined) {
            self.uploadViewModel.hasContent(false);

            var dataStack = new FormData();
            var dataIndex = 0;
            var filesUploaded = 0;
            var filesToUpload = self.numberOfFiles();

            jQuery(".idUploadBox").toggle();

            var destinationFolder = self.getOrCreateFolder(self.userDate());

            destinationFolder.done(function (folderUrl) {

                ns.utils.consoleLog("Folder created..... " + folderUrl);

                for (var i = 0; i < filesToUpload; i++) {
                    var datafile = files[i];
                    ns.utils.consoleLog(datafile);

                    self.getFileBuffer(datafile)
                    .done(function (fileObject, fileBuffer) {
                        var fileName = fileObject.name;
                        ns.utils.consoleLog(String.format("Loaded {0} into buffer stack.", fileName));

                        // Construct the endpoint.
                        var fileCollectionEndpoint = String.format(
                            "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files/add(overwrite=true, url='{2}')", self.webServerUrl(), folderUrl, fileName);

                        // Send the request and return the response.
                        // This call returns the SharePoint file.
                        jQuery.ajax({
                            url: fileCollectionEndpoint,
                            type: "POST",
                            data: fileBuffer,
                            processData: false,
                            headers: {
                                "accept": "application/json;odata=verbose",
                                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
                                //,"content-length": fileBuffer.byteLength
                            },
                            success: function (file, status, xhr) {
                                ns.utils.consoleLog('File uploaded....');
                                //self.uploadCallBackSuccess(res);
                                var fileModel = new uploadModel(file.d.Name, file.d.Length, file.d.ServerRelativeUrl, jqueryTargetId);
                                self.uploadViewModel.uploads.push(fileModel);
                                self.uploadViewModel.hasContent(true);
                                filesUploaded++;
                                if (filesToUpload == filesUploaded) {
                                    self.uploadCallBackSuccess();
                                    jQuery(".idUploadBox").toggle();
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                ns.utils.consoleLog('Error uploading document: ' + errorThrown);
                                self.isUploading(false);
                            }
                        });
                    })
                    .fail(function (args) {
                        ns.utils.consoleLog(args.get_message());
                    });

                    dataStack.append("file" + i, datafile);
                    dataIndex++;
                }

                var btnUploader = $('#koUploader');
                if (btnUploader && btnUploader.length != 0) {
                    btnUploader.attr("disabled", "disabled");
                }
            })
            .fail(function (sender, args) {

                ns.utils.consoleLog("Request failed: " + args.get_message());
            });
        } else {
            ns.utils.consoleLog('Unsupported Browser. Try Google Chrome.');
        }
    };

    // using FormData() object lets post back to the api controllers
    self.uploadFormData = function (data, evt) {
        if (evt.currentTarget.form == null) {
            var evtSomeFiles = somefile;
        } else {
            var evtSomeFiles = evt.currentTarget.form.somefile;
            if (evtSomeFiles == null) {
                ns.utils.consoleLog('Your browser sucks and its probably IE');
                return;
            }
        }

        var lblMsg = "";
        var files = evtSomeFiles.files;
        if (files != null) {
            var itemCount = files.length;
            if (itemCount > 0) {
                if (itemCount <= 10) {
                    self.isUploading(true);
                    self.canUpload(false);
                    self.numberOfFiles(itemCount);
                    self.uploadFiles(files);
                    return;
                } else {
                    self.showErrorLabel("The number of files selected is greater than 10.");
                }
            } else {
                self.showErrorLabel("Please select a file to upload.");
            }
        }
    };

    // iterates over the results pushing content to the uploadViewModel
    self.uploadCallBackSuccess = function () {
        self.isUploading(false);
        self.uploadViewModel.hasContent(true);
    };

    // the ajax request failed, push an error message to the user
    self.uploadCallBackFailed = function (jqXHR, textStatus, errorThrown) {

        ns.utils.consoleLog(errorThrown);
    };

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

function setFormFields(formFieldId) {
    var htmlField = ns.sp.getFormElement(formFieldId, "TextArea");
    var htmlAttachmentsArr = htmlField.split("#--#");
    if (htmlAttachmentsArr.length > 0) {
        vmmodel.uploadViewModel.hasContent(true);
        for (var idx = 0; idx < htmlAttachmentsArr.length; idx++) {
            var attachment = htmlAttachmentsArr[idx];
            var attachmentObject = attachment.split("#-#");
            ns.utils.consoleLog(String.format("URL:{0} Name:{1} Size:{2}", attachmentObject[0], attachmentObject[1], attachmentObject[2]))
            var model = new uploadModel(attachmentObject[1], attachmentObject[2], attachmentObject[0], formFieldId);
            vmmodel.uploadViewModel.uploads.push(model);
        }
    }
}

//attach event handlers
$("body").on("click", "#removeDoc", function () {

    //retrieve the context
    var context = ko.contextFor(this),
        files = context.$parent.uploads || context.$parent.uploads;

    //remove the data (context.$data) from the appropriate array on its parent (context.$parent)
    files.remove(context.$data);

    return false;
});

$(document).ready(function () {
    ns.utils.consoleLog("Loading modules and js files");

    setFormFields("OAPDescriptionAttachments");
    setFormFields("QMPAttachments");
    setFormFields("CoverLetterAttachments");


});


function PreSaveAction() {

    var _flag_validation = true;
    var _tmpReturnValue = true;
    var _missingFields = "", _missingFieldsOptions = [];
    jQuery("#topBannerMsgId").hide();


    _tmpReturnValue = ns.sp.setFormValidationError("Title Required Field", "Input", 5);
    if (!_tmpReturnValue) {
        _flag_validation = false;
        _missingFieldsOptions.push("Title");
    }


    _tmpReturnValue = ns.sp.setFormValidationError("LastUpdate Required Field", "Date", 9);
    if (!_tmpReturnValue) {
        _flag_validation = false;
        _missingFieldsOptions.push("Enter Last updated");
    }

    if (!_flag_validation) {
        _missingFields = _missingFieldsOptions.join("||");
        var msg = "Missing fields:" + _missingFields;
        ns.utils.consoleLog(msg);
        msg = String.format("<div>Please complete the field(s):</div><div>Missing fields: <br>- {0}</div>",
        	_missingFieldsOptions.join("<br>- "));
        jQuery("#TopBannerDivId").html(msg);
        jQuery("#topBannerMsgId").show();
        return _flag_validation;
    }

    // TODO: add to validation setp
    _flag_validation = copyFieldsForWorkflow();
    if (_flag_validation) {

        //Display loading message
        if (_returnId === 0) {
            SP.UI.ModalDialog.showWaitScreenWithNoClose('Creating database entry', 'Almost done...');
        }
        else {
            SP.UI.ModalDialog.showWaitScreenWithNoClose('Processing...', 'Please wait while we save your form...');
        }
    }

    return _flag_validation;
}

function getUploadedFilesbyField(files, targetId) {
    var arrOfFiles = [];
    var filteredFiles = jQuery.grep(files, function (nfile, idx) {
        return (nfile.targetId().toUpperCase() == targetId);
    });
    for (var idx = 0; idx < filteredFiles.length; idx++) {
        arrOfFiles.push(filteredFiles[idx].hrefTag());
    }
    return arrOfFiles;
}

function copyFieldsForWorkflow() {

    try {
        var files = vmmodel.uploadViewModel.uploads();
        var OAPDescription = getUploadedFilesbyField(files, "OAPDESCRIPTIONATTACHMENTS");
        var QMPAttachments = getUploadedFilesbyField(files, "QMPATTACHMENTS");
        var CoverLetterAttachments = getUploadedFilesbyField(files, "COVERLETTERATTACHMENTS");

        ns.sp.setFormFieldValue("OAPDescriptionAttachments", "TextArea", OAPDescription.join("#--#"));
        ns.sp.setFormFieldValue("QMPAttachments", "TextArea", QMPAttachments.join("#--#"));
        ns.sp.setFormFieldValue("CoverLetterAttachments", "TextArea", CoverLetterAttachments.join("#--#"));
        return true;
    }
    catch (e) {
        ns.utils.consoleLog(e.message);
    }
    return false;
}