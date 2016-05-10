# development-samples
Provides a series of projects to offer a gradual progression of development practices for SharePoint.

# Debug and run locally
In order to succesfully compile the InfrastructureAsCode.PowerShell and the Sample solution you will also have to download and build in Visual Studio the InfrastructureAsCode.Core and InfrastructureAsCode.Powershell repository and make the dev branch available. The PowerShell solution depends on it. In order to succesfully compile it, make sure that InfrastructureAsCode.Core and InfrastructureAsCode.Powershell are located at the same level as development-samples.

Example:
```
c:\[YOUR REPO FOLDER]\Infrastructure-As-Code
c:\[YOUR REPO FOLDER]\development-samples
```

<p>
None of the examples provided will require an On-Premise SharePoint installation.  Each project works best in Visual Studio 2015 with the following extensions installed:
<ul>
    <li>Web Essentials 2015</li>
    <li>Grunt Launcher</li>
    <li>Node.js Tools</li>
</ul>

SharePoint has been around for a while. You may have started in the early days with Full Trust code, User Controls, Pages, Timer Jobs, Workflow, InfoPath, etc. The list is limitless and so is the opportunity to develop for SharePoint. The biggest dilemma a programmer will face when approaching SharePoint is Time and frankly Where to start. The goal of this blog series is to walk through the progression of how an app can transform from early development to modern practices. The first part of this blog series is to address some common patterns and suggestions as we move towards the Modern Web and in reality the distributed device environment.

Each blog post will contain a set of sample code to assist in the setup, configuration, and deployment of the code.  This is an extended set of samples based on the OfficeDev PnP Core and PowerShell projects.  Without their assistance these samples would have been much more complicated and labor intensive. 
What we will demonstrate will try to adhere to 4-12 hours of real development time.  You may be tempted to jump right into Provider Hosted Add-Ins or well architect-ed projects that require databases, multi-tier structure, API's, security constraints, and unit testing.  Each of those are great when used in the correct context.  Not all applications or requirements need to jump complicated architecture.  Hopefully at the end of this series you'll have enough sample code and patterns to start new projects with a out of the box mindset first.

Each blog post will point to a specific project in the sample development repository.  You can go to https://github.com/pinch-perfect/development-samples to fork the repository.  This repository does have a dependency on the following https://github.com/pinch-perfect/Infrastructure-As-Code repository to assist in configuring your environment with the requisite libraries and site assets in your site.

<blockquote>
Please note: This is sample code meant to start the dialog.  It is intended to ease you into SharePoint development and assist in demonstrating features, development techniques, and Model-View-ViewModel design within SharePoint.
</blockquote>
<div>
The SharePoint and Office 365 community is more mature than it was a few years ago.  As always go to http://dev.office.com/patterns-and-practices to see the latest and greatest.  There you will find sample code, guidance, and How To's.  Let's get started!
</div>


Step 1: InfoPath, a sample, its future, and next steps (https://github.com/pinch-perfect/development-samples/tree/master/InfoPath)

Step 2: Out of the Box to emulate InfoPath (https://github.com/pinch-perfect/development-samples/tree/master/Sample01)

Step 3: Customization with KnockoutJS, HTML5, and MVVM patterns

Step 4: SharePoint Add-In

Step 5: Provider Hosted Add-In

</p>

<p>
As you can with the PnP-Powershell project you can connect to your On-Premise or SharePoint Online tenant with the following:

To connect with a Credential Prompt use the following.
```powershell
Connect-SPIaC –Url https://[tenant].sharepoint.com –Credentials (Get-Credentials)
```

or to connect with a credential prompt and have your credentials security hashed for reuse

```powershell
Connect-SPIaC –Url https://[tenant].sharepoint.com –UserName "[user]@[tenant].onmicrosoft.com"
```

</p>


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