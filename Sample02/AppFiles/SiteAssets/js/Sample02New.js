/// <reference path="//ajax.aspnetcdn.com/ajax/jquery/jquery-1.12.0.min.js" />
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2014.02/jquery.SPServices.min.js" />

'use strict'; // Browser enforces Strict Mode http://www.w3schools.com/js/js_strict.asp

$(document).ready(function () {

    jQuery("#titleHeaderId").html('Hello World... I\'ve Run');

});


/*
 * Provides an override for form validation before SharePoint saves the form
 */
function PreSaveAction() {

    // The InfoPath form persisted the Title as -> 'Database Sample - Last Update'
    var lastUpdated = jQuery("Input[Title='Last Updated'").val();
    if (lastUpdated == "" || typeof lastUpdated == undefined) {
        alert('You should check the last updated date.');
        return false; // prevents the from from saving
    }

    // Validation passed: set form fields before it is saved
    var formattedDate = (new Date(lastUpdated)).toISOString();
    console.log(String.format("Formatted Date is {0}", formattedDate));

    var databaseTitle = String.format("Database Sample - {0}", formattedDate);
    jQuery("Input[Title='Title Required Field']").val(databaseTitle);

    return true;
}