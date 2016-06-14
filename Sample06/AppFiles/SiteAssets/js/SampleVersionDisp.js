/// <reference path="//ajax.aspnetcdn.com/ajax/jquery/jquery-1.12.0.min.js" />
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2014.02/jquery.SPServices.min.js" />
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js" />

'use strict'; // Browser enforces Strict Mode http://www.w3schools.com/js/js_strict.asp

$(document).ready(function () {

    var listWebUrl = _spPageContextInfo.webAbsoluteUrl;
    var listName = "Sample Version History"
    var listItemId = getQueryStringParameter("ID");
    var fieldName = "My_x0020_Notes";

    getListItemBySPServices(listName, listItemId, fieldName)
        .done(function (dataArray) {
            for (var idx = 0; idx < dataArray.length; idx++) {
                console.log(String.format("SPServices - Name: {0} Modified: {1} By: {2}", dataArray[idx].FieldValue, dataArray[idx].Modified, dataArray[idx].Editor));
            }
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown.message);
        });

    getListItemBySoap(listWebUrl, listName, listItemId, fieldName)
        .done(function (dataArray) {
            var htmlDiv = "";
            for (var idx = 0; idx < dataArray.length; idx++) {
                var item = dataArray[idx];
                console.log(String.format("Trimmed - Name: {0} Modified: {1} By: {2}", item.FieldValue, item.Modified, item.Editor));
                var itemdate = new Date(item.Modified);
                htmlDiv += "<div>" + item.Editor + " (" + moment(itemdate).format('MM/DD/YYYY, h:mm a') + ")" + item.FieldValue + "</div>";
            }

            jQuery("#myNotesAppended").html(htmlDiv);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown.message);
        });

});


//function to get a parameter value by a specific key
function getQueryStringParameter(urlParameterKey) {
    var params = document.URL.split('?')[1].split('&');
    var strParams = '';
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split('=');
        if (singleParam[0] == urlParameterKey)
            return decodeURIComponent(singleParam[1]);
    }
}

function stripEditorField(_editorValue, idx) {
    var editorValue = "", editor = _editorValue.split('#');
    if (editor.length >= idx) {
        editorValue = editor[idx];
        var editorLen = editorValue.length;
        if (editorValue.lastIndexOf(',') == (editorLen - 1)) {
            editorValue = editorValue.substring(0, (editorLen - 1));
        }
    }
    return editorValue.replace(',,', ',');
}

function getListItemBySPServices(listName, listItemId, fieldName) {

    var glispdef = new jQuery.Deferred();

    $().SPServices({
        operation: "GetVersionCollection",
        async: false,
        strlistID: listName,
        strlistItemID: listItemId,
        strFieldName: fieldName,
        completefunc: function (xData, Status) {
            var historyOptions = [];
            $(xData.responseText).find("Version").each(function (i) {
                var editor = stripEditorField($(this).attr("editor"), 1);
                historyOptions.push({
                    Editor: editor,
                    Modified: $(this).attr("Modified"),
                    FieldValue: $(this).attr(fieldName)
                });
            });

            glispdef.resolve(historyOptions);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            glispdef.reject(jqXHR, textStatus, errorThrown);
        }
    });

    return glispdef.promise();
}

function getListItemBySoap(listWebUrl, listName, listItemId, fieldName) {

    var glisoapdef = new jQuery.Deferred();

    var soapHeader = "http://schemas.microsoft.com/sharepoint/soap/";
    var soapBody = String.format("<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>"
        + "<GetVersionCollection xmlns=\"{0}\">"
        + "<strlistID>{1}</strlistID><strlistItemID>{2}</strlistItemID><strFieldName>{3}</strFieldName>"
        + "</GetVersionCollection>"
        + "</soap:Body></soap:Envelope>", soapHeader, listName, listItemId, fieldName);

    var soapAction = String.format("{0}GetVersionCollection", soapHeader);

    $.ajax({
        url: listWebUrl + "/_vti_bin/lists.asmx",
        type: "POST",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("SOAPAction", soapAction);
        },
        dataType: "xml",
        data: soapBody,
        contentType: "text/xml;charset='utf-8'",
        complete: function (xData, status) {
            var historyOptions = [];
            $(xData.responseText).find("Version").each(function (i) {
                var editor = stripEditorField($(this).attr("editor"), 1);
                historyOptions.push({
                    Editor: editor,
                    Modified: $(this).attr("Modified"),
                    FieldValue: $(this).attr(fieldName)
                });
            });

            glisoapdef.resolve(historyOptions);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            glisoapdef.reject(jqXHR, textStatus, errorThrown);
        }
    });

    return glisoapdef.promise();
}
