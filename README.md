# development-samples
Provides a series of projects to offer a gradual progression of development practices for SharePoint.

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

<p>
None of the examples provided will require an On-Premise SharePoint installation.  Each project works best in Visual Studio 2015 with the following extensions installed:
<ul>
    <li>Web Essentials 2015</li>
    <li>Grunt Launcher</li>
    <li>Node.js Tools</li>
</ul>

SharePoint has been around for a while.  You may have started in the early days with Full Trust code, User Controls, Pages, Timer Jobs, Workflow, InfoPath, etc.  The list is limitless and so is the opportunity to develop for SharePoint.  The biggest dilemma a programmer will face when approaching SharePoint is Time and frankly Where to start.  The goal of this blog series is to walk through the progression of how an app can transform from early development to modern practices.  The first part of this blog series is to address some common patterns and suggestions as we move towards the Modern Web and in reality the distributed device environment.

Each blog post will contain a set of sample code to assist in the setup, configuration, and deployment of the code.  
This is an extended set of samples based on the OfficeDev PnP Core and Powershell projects.   
Without their assistance these samples would have been much more complicated and labor intensive.  
What we will demonstrate will try to adhere to 4-12 hours of real development time.  
You may be tempted to jump right into Provider Hosted Add-Ins or well architected projects that require databases, multi-tier structure, API's, security constraints, and unit testing.  
Each of those are great when used in the correct context.   
Not all applications or requirements need to jump complicated architecture.   
Hopefully at the end of this series you'll have enough sample code and patterns to start new projects with a out of the box mindset first.

<div>
    Please note: This is sample code meant to start the dialog.  This does not adhere to the BEST practices but does try to move us towards a Model-View-ViewModel approach.
</div>
    </p>