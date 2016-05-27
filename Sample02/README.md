# development-samples
Sample 02

## Summary
This sample project defines a Sample 02 Upload list with a variety of columns in the Sample02LibraryDefinition.cs file.  
Expected output from running the console is a file located at AppFiles\Content\Provisioner.json.  We will pass this file into our Infrastructure-As-Code commands to provision resources.  
For this sample we will use a Site Provisioner Model to define our list and its fields.  By automating this process we ensure that the list and its fields are the same in any SharePoint site where it is run.  We can check the .JSON file into source control to version history the Site definition.

### Prerequisites
To debug the following project you will need to follow the guidance (https://github.com/pinch-perfect/Infrastructure-As-Code/blob/master/README.md) and ensure you have the Infrastructure-As-Code repository locally.
This sample extends IaC to deploy a Sample sharepoint list with specific column types.  You can use this similiar technique to provision resources into your SharePoint environment


### Debug and run locally

We created a model to extend the site provisioning model with our specific list and columns details.
<img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/Sample02/imgs/extend-site-provisioner.PNG" width="500" />

After debugging the console we receive the outputed JSON file at AppFiles\Content\Provisioner.json
<img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/Sample02/imgs/Provision-json-file.PNG" width="500" />

A video of the screenshots can be found here (https://mix.office.com/watch/19oryzp2n9r1j)


We've included the providioner.json in the repo.  If you've performed the prerequisites you can open a powershell window and execute the cmdlets below:
```powershell
cd ("{0}\{1}\Documents\WindowsPowerShell\Modules\InfrastructureAsCode.Powershell" -f $env:HOMEDRIVE,$env:HOMEPATH)

Connect-SPIaC –Url https://[tenant].sharepoint.com –UserName "[user]@[tenant].onmicrosoft.com"

## EX [REPO Drive]\[REPO Path]\development-samples\Sample02\AppFiles
$RelativeOrFullPath = "Local Path to folder where files will be read" 

## Create the Sample 02 File upload list
Set-IaCProvisionResources -SiteContent $RelativeOrFullPath -Verbose

## Upload site assets from the AppFiles\SiteAssets folder
Set-IaCProvisionAssets -SiteContent $RelativeOrFullPath -Verbose

Disconnect-SPIaC
```

After the Powershell cmdlet Set-IaCProvisionResources executes successfully you should see a list "Sample 02 File Upload" in your Site.  

## Videos
The following videos will demonstrate how to customize a SharePoint list with custom forms, extract the XSL, insert a Content Editor web part, and enhance the usability of the form.  You can quickly see that the Out of the Box controls are very similiar to InfoPath.  The control in native SharePoint however, do not suffer from a variety of file upload limits and schema drift.


Video: Configure the list in SharePoint, use SharePoint designer to create new forms, upload SiteAssets from this project, remove XSL from CustomNew form and replace with XslLink from Site assets.

<img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/Sample02/imgs/new-list-file-upload.pngg" width="500" />
https://mix.office.com/watch/bwuc6qngczko


Video: The Sample02New.xsl file has rearranged fields in the display and hides the title field.  Set the CustomNew form as the default form and display the new html markup.

<img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/Sample02/imgs/configured-list-with-xsl.png" width="500" />
https://mix.office.com/watch/2t5mkf31ks43


Video: The Sample02New.js file contains document OnReady logic to process everytime the CustomNew form is loaded in the browser.  This video will demonstrate how to use SharePoint designer to add webparts to a custom form; use Visual Studio to modify XSL; use content link to inject html with JavaScript references, and leverage the PreSaveAction method to validate a form and set hidden fields with specific logic.

<img src="https://raw.githubusercontent.com/pinch-perfect/development-samples/master/Sample02/imgs/configured-form-javascript.png" width="500" />
https://mix.office.com/watch/a4smzpw5qes5



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