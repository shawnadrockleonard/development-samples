/// <reference path="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.3.min.js" />
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2014.02/jquery.SPServices.min.js" />
/// <reference path="ns.utils.js" />


if (ns === undefined) {
    var ns = ns || {};
}

if (ns.sp === undefined) {
    ns.sp = ns.sp || {};
}

/*
 * Namespace contains a number of helper methods
 */
ns.sp = (function () {

    var self = this;

    self.getFormElement = function (strFieldTitle, strFieldType) {
        if ((strFieldType == "Input") || (strFieldType == "TextArea")) {
            var elementId = jQuery(strFieldType + "[title='" + strFieldTitle + "']");
            if (elementId != undefined && elementId.length > 0) {
                return elementId.val();
            }
        }
        else if (strFieldType == "Date") {
            var elementId = $("Input[title='" + strFieldTitle + "']");
            if (elementId != undefined && elementId.length > 0) {
                return elementId.val();
            }

        }
        else if (strFieldType == "MultiCheckbox") {

            var elementId = $("td.ms-formlabel:contains(" + strFieldTitle + ")");
            if (elementId != undefined && elementId.length > 0) {
                elementId.next().find('table').find('tr').each(function () {
                    var elementVal = $(this).find('input')[0];
                    if (elementVal.checked) {
                        return elementVal;
                    }
                });
            }
        }
        else if (strFieldType == "peoplePicker") {
            var _peoplePickerField = self.getPeoplePickerField(strFieldTitle);
            return _peoplePickerField;
        }
        else if (strFieldType == "Select") {
            var elementId = $("select[title='" + strFieldTitle + "']");
            if (elementId != undefined && elementId.length > 0) {
                var frmElementId = elementId.attr('id');
                var selectedOption = elementId.find('option:selected');
                if (selectedOption.val() == "0" || selectedOption.text().toUpperCase() == "(NONE)") {
                    return null;
                }
                return selectedOption.text();
            }
        }
        return null;
    }


    /*
    Checks a SP field based on its type and DOM naming prefix
    */
    self.checkFormValidationError = function (strFieldTitle, strFieldType, strLengthRequirement) {
        if ((strFieldType == "Input") || (strFieldType == "TextArea")) {
            if ($(strFieldType + "[title='" + strFieldTitle + "']").val().length < strLengthRequirement) {
                return false;
            } else {
                return true;
            }
        }
        else if (strFieldType == "Date") {
            if ($("Input[title='" + strFieldTitle + "']").val().length < strLengthRequirement) {
                return false;
            } else {
                return true;
            }
        }
        else if (strFieldType == "MultiCheckbox") {
            var _tmpCheck = false;
            $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find('table').find('tr').each(function () {
                if ($(this).find('input')[0].checked) {
                    _tmpCheck = true;
                }
            });
            return _tmpCheck;
        }
        else if (strFieldType == "Radio") {
            var _tmpCheck = false;
            $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find('table').find('tr').each(function () {
                if ($(this).find('input')[0].checked) {
                    _tmpCheck = true;
                }
            });
            return _tmpCheck;
        }
        else if (strFieldType == "peoplePicker") {

            var _peopleDiv = $("[id$='ClientPeoplePicker'][title='" + strFieldTitle + "']");
            var _peopleLabel = String.format("{0}_HiddenInput", _peopleDiv.attr('id'));
            var _peopleHidden = $(ns.utils.cleanJQuerySelector(_peopleLabel));
            if (_peopleHidden.length > 0) {
                var _peopleHiddenValues = _peopleHidden[0].value
                var _peopleStringArray = (new Function("return " + _peopleHiddenValues + ";")());
            }
            var _peopleDict = SPClientPeoplePicker.SPClientPeoplePickerDict[_peopleDiv[0].id];
            if (_peopleDict.TotalUserCount > 0) {
                return true;
            } else {
                return false;
            }
        }
        else if (strFieldType == "Select") {
            var frmElement = $("select[title='" + strFieldTitle + "']");
            if (frmElement === null || frmElement === undefined) {
                consoleLog('Failed to DOM select: ' + strFieldTitle);
            }
            else {
                var frmElementId = frmElement.attr('id');
                var selectedOption = frmElement.find('option:selected');
                if (selectedOption.val() == "0" || selectedOption.text() == "(None)") {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        }
        return false;
    };

    /*
    Checks form fields and evaluates if required and has value, presents error message to the user
    */
    self.setFormValidationError = function (strFieldTitle, strFieldType, strLengthRequirement) {
        var strFieldTypeIsValid = checkFormValidationError(strFieldTitle, strFieldType, strLengthRequirement);
        if ((strFieldType == "Input") || (strFieldType == "TextArea")) {
            if (!strFieldTypeIsValid) {
                $(strFieldType + "[title='" + strFieldTitle + "']").parent().next().attr("class", "ms-formvalidation");
            } else {
                $(strFieldType + "[title='" + strFieldTitle + "']").parent().next().attr("class", "ms-metadata");
            }
        }
        else if (strFieldType == "Date") {
            if (!strFieldTypeIsValid) {
                $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find('span').last('span').attr("class", "ms-formvalidation");
            } else {
                $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find('span').last('span').attr("class", "ms-metadata");
            }
        }
        else if (strFieldType == "MultiCheckbox") {
            if (!strFieldTypeIsValid) {
                $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find("span").last("table").attr("class", "ms-formvalidation");
            } else {
                $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find("span").last("table").attr("class", "ms-metadata");
            }
        }
        else if (strFieldType == "Radio") {
            var radioField = $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().first("span").find('table');
            if (!strFieldTypeIsValid) {
                var _titleSpan = '<span id="errId' + strFieldTitle + '" class="ms-formvalidation">Please select a value for ' + strFieldTitle + '</span>';
                var errId = jQuery("span[id='errId" + strFieldTitle + "']");
                if (errId.length <= 0) {
                    radioField.after(_titleSpan);
                }
                radioField.attr("class", "ms-formvalidation");
            } else {
                radioField.attr("class", "ms-metadata");
                var errId = jQuery("span[id='errId" + strFieldTitle + "']");
                if (errId.length > 0) {
                    errId.remove();
                }
            }
        }
        else if (strFieldType == "peoplePicker") {
            if (strFieldTypeIsValid) {
                $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find("span").last("table").attr("class", "ms-metadata");
            } else {
                $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find("span").last("table").attr("class", "ms-formvalidation");
            }
        }
        else if (strFieldType == "Select") {
            var frmElement = $("select[title='" + strFieldTitle + "']");
            if (frmElement !== null && frmElement !== undefined) {
                var frmElementId = frmElement.attr('id');
                var selectedOption = frmElement.find('option:selected');
                if (!strFieldTypeIsValid) {
                    $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find("span").last("table").attr("class", "ms-formvalidation");
                    var errId = jQuery("span[id='errId" + frmElementId + "']");
                    if (errId.length <= 0) {
                        var _titleSpan = '<span id="errId' + frmElementId + '">Please select a value for ' + strFieldTitle + '</span>';
                        frmElement.next("br").after(_titleSpan);
                    }
                } else {
                    $("td.ms-formlabel:contains(" + strFieldTitle + ")").next().find("span").last("table").attr("class", "ms-metadata");
                    var errId = jQuery("span[id='errId" + frmElementId + "']");
                    if (errId.length > 0) {
                        errId.remove();
                    }
                }
            }
        }
        return strFieldTypeIsValid;
    };

    /*
     * Set the HTML form field with the specified fieldValue
     * @param {strFieldTitle} string the display field name
     * @param {strFieldType} string the field type ex. Input, TextArea, Select, Checkbox
     * @param {fieldValue) string containing the value to be set in the form field
     */
    self.setFormFieldValue = function (strFieldTitle, strFieldType, fieldValue) {

        if ((strFieldType == "Input") || (strFieldType == "TextArea")) {
            var elementId = jQuery(strFieldType + "[title='" + strFieldTitle + "']");
            if (elementId != undefined && elementId.length > 0) {
                return elementId.val(fieldValue);
            }
        }
    };

    self.cleanToolBar = function () {

        //TODO: Hide any ribbon or elements to obfuscate navigation
    };


    /*
    Accepts context as parameter and sets context to people picker resolved instance for current user
    */
    self.renderAssignedTo = function (ctx) {
        //get current user properties
        var displayName = $('div#SuiteNavUserName').text();
        var loginName = String.format('i:0#.f|membership|{0}', _spPageContextInfo.userLoginName);
        var currentUserEntry = self.createUserEntity(loginName, displayName);
        //Set user default value
        ctx.CurrentFieldValue = [];   //Note: it is assumed the user field is a multi-valued field (!)
        ctx.CurrentFieldValue.push(currentUserEntry);
        return SPClientPeoplePickerCSRTemplate(ctx);
    };


    self.createUserEntity = function (userLoginName, userDisplayName) {
        return {
            Description: userLoginName,
            DisplayText: userDisplayName,
            EntityGroupName: "",
            EntityType: "",
            HierarchyIdentifier: null,
            IsResolved: true,
            Key: userLoginName,
            MultipleMatches: [],
            ProviderDisplayName: "",
            ProviderName: ""
        };
    };

    self.getCurrentUser = function (peoplePickerFieldTitle) {

        SP.SOD.executeFunc('sp.js', 'SP.ClientContext',
            function () {
                var context = new SP.ClientContext.get_current();
                var web = context.get_web();
                var currentUser = web.get_currentUser();
                currentUser.retrieve();
                context.load(web);
                context.executeQueryAsync(
                     function onSuccessMethod(sender, args) {
                         var userObject = web.get_currentUser();
                         self.setPeoplePickerField(userObject, peoplePickerFieldTitle);
                         ns.utils.consoleLog(userObject.get_loginName());
                     },
                     ns.utils.eventFunctionFailed);
            });
    };

    /*
    Excercises the web current user JSOM and returns the groups to which the user belongs
        * callback should be a function with parameter containing a string array
    */
    self.getCurrentUserData = function (callback) {

        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var currentUser = web.get_currentUser();
            currentUser.retrieve();
            context.load(web);
            context.executeQueryAsync(function (sender, args) {

                var userObject = web.get_currentUser();
                var groups = userObject.get_groups();
                context.load(groups);
                context.executeQueryAsync(function () {
                    var groupArray = [];
                    var groupEnumerator = groups.getEnumerator();
                    while (groupEnumerator.moveNext()) {
                        groupArray.push(groupEnumerator.get_current());
                    }
                    callback(groupArray);
                });

            }, onFaiureMethodl);



            function onFaiureMethodl(sender, args) {
                ns.utils.consoleLog('request failed ' + args.get_message() + '\n' + args.get_stackTrace());
            }

        });
    };

    /*
     * Set the people picker field based on the user context
     *  Remark: the user context must be hydrated
     @param {object} userContext is the hydrated clientcontext user
     @param {string} peoplePickerFieldTitle this must be wrapped in nobr in the html
     */
    self.setPeoplePickerField = function (userContext, peoplePickerFieldTitle) {

        var thisUserName = userContext.get_title();

        $().SPServices.SPFindPeoplePicker({
            peoplePickerDisplayName: peoplePickerFieldTitle,
            valueToSet: thisUserName,
            checkNames: true
        });
    };

    return self;
})();