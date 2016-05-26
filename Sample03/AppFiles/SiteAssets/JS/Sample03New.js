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
        self.webServerUrl(userContext.webAbsoluteUrl);
    };

    self.uploadViewModel = {
        uploads: ko.observableArray([]),
        hasContent: ko.observable(false)
    };

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
        var folderUrl = String.format("{0}/Shared Documents/{1}", self.webServerUrl(), folderName);
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

    /*
    Send the request and return the response. This call returns the SharePoint file.
    */
    self.addFileToFolder = function (fileNameWithPath, serverRelativeUrlToFolder, arrayBuffer) {

        // Get the file name from the file input control on the page.
        var serverUrl = self.webServerUrl();
        var fileName = fileNameWithPath.name;

        // Construct the endpoint.
        var fileCollectionEndpoint = String.format(
                "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
                "/add(overwrite=true, url='{2}')",
                serverUrl, serverRelativeUrlToFolder, fileName);

        // Send the request and return the response.
        // This call returns the SharePoint file.
        return jQuery.ajax({
            url: fileCollectionEndpoint,
            type: "POST",
            data: arrayBuffer,
            processData: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-length": arrayBuffer.byteLength
            }
        });
    };

    /**
     @method leverage HTML form data for handling multipart uploads
     @param jqueryId {string} element id for jquery to toggle
     @param jqueryTargetId {string} element id for jquery to manipulate text
     @param files {FormData.Files} collection of form multipart/form-data files
     */
    self.uploadFiles = function (jqueryId, jqueryTargetId, files) {

        try {
            // HTML5 Form Data
            if (window.FormData !== undefined) {
                self.uploadViewModel.hasContent(false);

                //var dataStack = new FormData();
                var dataIndex = 0;
                var filesUploaded = 0;
                var filesToUpload = self.numberOfFiles();

                jQuery(".idUploadBox").toggle();

                self.getOrCreateFolder(self.userDate())
                    .done(function (folderUrl) {

                        ns.utils.consoleLog("Folder created..... " + folderUrl);

                        for (var i = 0; i < filesToUpload; i++) {
                            var datafile = files[i];
                            ns.utils.consoleLog(datafile);

                            self.getFileBuffer(datafile)
                                .done(function (fileObject, fileBuffer) {
                                    var fileName = fileObject.name;
                                    ns.utils.consoleLog(String.format("Loaded {0} into buffer stack.", fileName));

                                    try {
                                        self.addFileToFolder(fileObject, folderUrl, fileBuffer)
                                            .done(function (file, status, xhr) {
                                                ns.utils.consoleLog(String.format("File {0} uploaded....", file.d.Name));
                                                //self.uploadCallBackSuccess(res);
                                                var fileModel = new ns.models.uploadModel(file.d.Name, file.d.Length, file.d.ServerRelativeUrl, jqueryTargetId);
                                                self.uploadViewModel.uploads.push(fileModel);
                                                self.uploadViewModel.hasContent(true);
                                                filesUploaded++;
                                                if (filesToUpload == filesUploaded) {
                                                    self.uploadCallBackSuccess();
                                                    jQuery(".idUploadBox").toggle();
                                                }
                                            })
                                            .fail(function (jqXHR, textStatus, errorThrown) {
                                                ns.utils.consoleLog('Error uploading document: ' + errorThrown);
                                                self.isUploading(false);
                                            });

                                        //dataStack.append("file" + i, datafile);
                                        dataIndex++;
                                    }
                                    catch (ex) {
                                        ns.utils.consoleLog(ex.get_message());
                                    }
                                })
                                .fail(function (sender, args) {
                                    ns.utils.consoleLog(args.get_message());
                                });


                            var btnUploader = $('#koUploader');
                            if (btnUploader && btnUploader.length != 0) {
                                btnUploader.attr("disabled", "disabled");
                            }
                        }
                    })
                    .fail(function (sender, args) {
                        ns.utils.consoleLog("Request failed: " + args.get_message());
                    });
            }
            else {
                ns.utils.consoleLog('Unsupported Browser. Try Google Chrome.');
            }
        }
        catch (e) {
            ns.utils.consoleLog(e.get_message());
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


    _tmpReturnValue = ns.sp.setFormValidationError("Last Updated Required Field", "Date", 9);
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
            SP.UI.ModalDialog.showWaitScreenWithNoClose('Creating database entry', 'Almost done...', 350, 600);
        }
        else {
            SP.UI.ModalDialog.showWaitScreenWithNoClose('Processing...', 'Please wait while we save your form...', 350, 600);
        }
    }

    return _flag_validation;
}

function getUploadedFilesbyField(targetId) {
    var arrOfFiles = [], targetIdClean = targetId.toUpperCase();
    var filteredFiles = jQuery.grep(vmmodel.uploadViewModel.uploads(), function (nfile, idx) {
        return (nfile.targetId().toUpperCase() == targetIdClean);
    });
    for (var idx = 0; idx < filteredFiles.length; idx++) {
        arrOfFiles.push(filteredFiles[idx].hrefTag());
    }
    return arrOfFiles;
}

function copyFieldsForWorkflow() {

    try {
        var SampleCSRDescAttachments = getUploadedFilesbyField("SampleCSRDescAttachments");
        var SampleCSRSecondaryAttachments = getUploadedFilesbyField("SampleCSRSecondaryAttachments");
        var SampleCSRCoverLetterAttachments = getUploadedFilesbyField("SampleCSRCoverLetterAttachments");

        ns.sp.setFormFieldValue("Description Attachments", "TextArea", SampleCSRDescAttachments.join("#--#"));
        ns.sp.setFormFieldValue("Secondary Attachments", "TextArea", SampleCSRSecondaryAttachments.join("#--#"));
        ns.sp.setFormFieldValue("Cover Letter Attachments", "TextArea", SampleCSRCoverLetterAttachments.join("#--#"));
        return true;
    }
    catch (e) {
        ns.utils.consoleLog(e.message);
    }
    return false;
}