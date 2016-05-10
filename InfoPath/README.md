# development-samples
InfoPath Example and Description

Please note: I will provide brief screenshots to detail the form and its purpose.
We will use the succeeding posts to project the form into a full application.

<div>
    Ahh InfoPath 2010 and 2013.  What a promising platform and what amazing things you could do with InfoPath.  You may have created minor applications or major enterprise applications with InfoPath.  The back end was XML and as result an ultra portable file format.  The integration with SharePoint made this a fantastic way to design forms, design workflow, and collect digital signatures.  With XML you could push this to an organizational record management system.   You could transform the result however you saw fit.  You could push it to a SQL database and leverage XQuery or other techniques to run reporting.  It seemed like a great platform.  However, Form Services never really panned out to be user friendly, a SharePoint patch could have caused your working form to collapse, or a workstation patch caused your InfoPath Designer or Client to stop functioning correctly.   You developed InfoPath forms with conditional formatting, binding, new schema updates, versions, and XML changes quickly grew to be a mess.  You developed various techniques to manage and work with InfoPath but it never felt "programmer friendly".  Oh and did I mention the limitations with the browser and enterprise configurations.   This part of the development strategy is not to show you how to develop for InfoPath but to start the dialog on how to progress away from InfoPath using a real world example.    Caveat: the example is an actual application that quickly ran into web server limitations along with authentication limitations.  It began as a promising development experiment but quickly became frustrating to users and developers.
</div>

<div>
    The below sample with a break down of its components has a correlated component in SharePoint out of the box.  We will dive much deeper into SharePoint with each of this components.
</div>

<br />

<div>
    The intent of this form was to collect some metadata long with attachments.  Word documents, Powerpoints, and other files.  The aggregate of this metadata nd the files would be submitted for approval in some specific workflow.
</div>
<figure>
    <img src="https://github.com/pinch-perfect/development-samples/blob/master/InfoPath/imgs/infopath-sample1.PNG" width="500" />
    <br />
    <figcaption>The sample InfoPath form</figcaption>
</figure>

<br />

<div>
    InfoPath is based completely on a XML with a well defined schema.  The IDE is super easy to use and allows you to rapidly create fields and mappings.
</div>
<figure>
    <img src="https://github.com/pinch-perfect/development-samples/blob/master/InfoPath/imgs/infopath-schema.PNG" width="500" />
    <br />
    <figcaption>The XSD markup drives the strict XML output</figcaption>
</figure>


<br />

<div>
    The output of the form is raw XML with various namespaces that InfoPath and SharePoint use to render and process the XML.
</div>
<figure>
    <img src="https://github.com/pinch-perfect/development-samples/blob/master/InfoPath/imgs/infopath-samplexml.PNG" width="500" />
    <br />
    <figcaption>Note the core XML structure appears as the XSD has defined it.</figcaption>
</figure>


<br />
<div>
    InfoPath leverage XSL to transform the XML in a human readable format.  XSL is the backbone of many SharePoint Add-Ins so it made since to leverage this core technology.  The neat part of InfoPath was the ability to leverage this XSL to render in Form Services as well as in external systems if a craft developer could crack open the manifest.
</div>
<figure>
    <img src="https://github.com/pinch-perfect/development-samples/blob/master/InfoPath/imgs/infopath-samplexsl.PNG" width="500" />
    <br />
    <figcaption>The XSL transforms the XML into a specific view in the InfoPath form</figcaption>
</figure>