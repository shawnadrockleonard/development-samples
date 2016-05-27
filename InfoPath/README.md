# Development-Samples
InfoPath Example and Description


### Summary ###
Please note: We will use the succeeding posts to project the form into a full application.  I will provide brief screenshots to detail the form and its purpose.

InfoPath 2010/2013 was a promising platform which allowed non-developers to enable and deploy amazing things.  You could create minor applications or major enterprise applications with InfoPath.  The back end is XML which was an ultra portable file format.  The integration with SharePoint made this a fantastic way to design forms, design workflow, attach binary, and collect digital signatures.  With XML you could push this to an organizational record management system or transform the result data however you saw fit.  You could push it to a SQL database and leverage XQuery or other techniques to run reporting.   However, Form Services never panned out to be user friendly.  A SharePoint patch caused your working form to collapse or a workstation patch caused your InfoPath Designer or Client to stop functioning correctly.   You developed InfoPath forms with conditional formatting, binding, new schema updates, and versions.  You developed various techniques to manage and work with InfoPath but it never felt "programmer friendly".    This part of the development strategy is not to show you how to develop for InfoPath but to start the dialog on how to progress away from InfoPath using a real world example.    This particular example is a mock-up of an actual application that ran into web server, configuration, and authentication limitations.  It began as a promising development experiment but quickly became frustrating to users and developers (i.e., Server limitations, File attachment size limitations, User profile integration, and security based conditional activities.)   We will use the succeeding posts to project the form into a full application. 


The intent of this form was to collect metadata with attachments (i.e., MS Word, MS PowerPoint, and/or other files.)  The aggregate of this metadata and the files were submitted for approval via workflow.
<figure>
    <img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/InfoPath/imgs/infopath-sample1.PNG" width="500" />
    <br />
    <figcaption>The sample InfoPath form</figcaption>
</figure>

<br />

InfoPath is based completely on a XML with a well defined schema. The IDE is easy to use and allows you to rapidly create fields and mappings.
<figure>
    <img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/InfoPath/imgs/infopath-schema.PNG" width="500" />
    <br />
    <figcaption>The XSD markup drives the strict XML output</figcaption>
</figure>


<br />

The output of the form is raw XML with various namespaces that InfoPath and SharePoint use to render and process the XML.
<figure>
    <img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/InfoPath/imgs/infopath-samplexml.PNG" width="500" />
    <br />
    <figcaption>Note the core XML structure appears as the XSD has defined it.</figcaption>
</figure>


<br />
InfoPath leverages Extensible Stylesheet Language (XSL) to transform the XML into a view.  XSL is the backbone of many SharePoint Add-Ins and continues to be the core backbone for rendering components of SharePoint into HTML.  We will navigate through each sample to identify similiar capabilities with development:

1. XSD/XML schema = List Definition
2. XSL = Convert list schema to HTML via DataViewWebParts/ListViewWebParts
3. Conditional binding and controls = SharePoint web controls and jQuery
<figure>
    <img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/InfoPath/imgs/infopath-samplexsl.PNG" width="500" />
    <br />
    <figcaption>The XSL transforms the XML into a specific view in the InfoPath form</figcaption>
</figure>


### Disclaimer ###
**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

Microsoft provides programming examples for illustration only, without 
warranty either expressed or implied, including, but not limited to, the
implied warranties of merchantability and/or fitness for a particular 
purpose.  

This sample assumes that you are familiar with the programming language
being demonstrated and the tools used to create and debug procedures. 
Microsoft support professionals can help explain the functionality of a
particular procedure, but they will not modify these examples to provide
added functionality or construct procedures to meet your specific needs. 
If you have limited programming experience, you may want to contact a 
Microsoft Certified Partner or the Microsoft fee-based consulting line 
at (800) 936-5200. 

It is your responsiblity to review the code and understand what is being performed.