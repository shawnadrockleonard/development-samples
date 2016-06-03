# development-samples
Sample 06:  Demonstrate Append Changes, Version History, and Retrieval of Column History

## Summary
This sample project defines a [Sample Version History] list with a variety of columns in the SampleLibraryDefinition.cs file.  
Expected output from running the console is a file located at AppFiles\Content\Provisioner.json.  We will pass this file into our Infrastructure-As-Code commands to provision resources.  
For this sample we will use a Site Provisioner Model to define our list and its fields.  By automating this process we ensure that the list and its fields are the same in any SharePoint site where it is run.  We can check the .JSON file into source control to version history the Site definition.

### Prerequisites
To debug the following project you will need to follow the guidance (https://github.com/pinch-perfect/Infrastructure-As-Code/blob/master/README.md) and ensure you have the Infrastructure-As-Code repository locally.
This sample extends IaC to deploy a Sample sharepoint list with specific column types.  You can use this similiar technique to provision resources into your SharePoint environment


We created a model to extend the site provisioning model with our specific list and columns details.
<img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/Sample06/imgs/extend-site-provisioner.PNG" width="500" />

After debugging the console we receive the outputed JSON file at AppFiles\Content\Provisioner.json
<img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/Sample06/imgs/Provision-json-file.PNG" width="500" />

A video of the screenshots can be found here (https://mix.office.com/watch/19oryzp2n9r1j)


We've included the provisioner.json in the repo.  If you've performed the prerequisites you can open a powershell window and execute the cmdlets below:
```powershell
cd ("{0}\{1}\Documents\WindowsPowerShell\Modules\InfrastructureAsCode.Powershell" -f $env:HOMEDRIVE,$env:HOMEPATH)

Connect-SPIaC –Url https://[tenant].sharepoint.com –UserName "[user]@[tenant].onmicrosoft.com"

## EX [REPO Drive]\[REPO Path]\development-samples\Sample06\AppFiles
$RelativeOrFullPath = "Local Path to folder where files will be read" 

## Create the Sample 03 File upload list
Set-IaCProvisionResources -SiteContent $RelativeOrFullPath -Verbose

## Upload site assets from the AppFiles\SiteAssets folder
Set-IaCProvisionAssets -SiteContent $RelativeOrFullPath -Verbose

Disconnect-SPIaC
```

After the Powershell cmdlet Set-IaCProvisionResources executes successfully you should see a list "Sample 03 File Upload" in your Site.  

## Videos
We are not going to screen capture creating Custom Forms in the newly provisioned SharePoint list.  You will duplicate this effort by following the videos found [Sample02\readme.md](https://github.com/pinch-perfect/development-samples/blob/master/Sample02/README.md)


Here is a video to watch the completed results from
1 Use the PowerShell Cmd-Lets to create a Sample Version History list and upload Site Assets
2 Use Custom forms for New, Edit, and Display actions in the configured SharePoint list.
3 Walk through of the outcome, New form with uploading attachments, View the results with a customized screen, and Edit the form by moving the attachment to a separate field.

<img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/Sample03/imgs/provision-list-video.PNG" width="500" />
https://mix.office.com/watch/1chj3lxmaa387



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