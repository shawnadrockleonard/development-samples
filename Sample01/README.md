# development-samples
Light Customizations

### Summary ###
This sample powershell project will help define a list with a variety of columns.  After building the solution it should deploy the module to your home directory.  Once deployed the module and its cmd-lets will be available for use.  These cmd-lets will configure a SharePoint site based on the JSON file specified.  For this sample we will use a Site Provisioner Model to define our list and its fields.  We will run a cmd-let to generate the JSON file that we will feed into the ETL cmd-let to provision the list and its fields.  By automating this process we ensure that the list and its fields are the same in any SharePoint site where it is run.  We can check the .JSON file into source control to version history the Site definition.

#Debug and run locally
To debug the following project you will need to follow the guidance (https://github.com/pinch-perfect/Infrastructure-As-Code/blob/master/README.md) and ensure you have the Infrastructure-As-Code repository locally.


#Running the sample
This sample extends IaC to deploy Sample sharepoint list with specific column types.  You can use this similiar technique to provision resources into your SharePoint environment

We have created a model to extend the site provisioning model with our specific list and columns details.
<img src="imgs\extend-site-provisioner.PNG" width="500" />

This project will compile as a Binary Powershell module and deployed to your [Users/Documents/WindowsPowershell/Module/InfrastructureAsCode.Powershell.Sample01] folder.  If you attempt to debug the project and it does not launch Powershell, navigate to the Project Debug tab and specified the external program powershell.exe with a -noexit argument.  
<img src="imgs\project-config-powershell-debug.PNG" width="500" />


You can however just build the project and then open a powershell windows and execute the cmdlets below:
```powershell
Connect-SPIaC –Url https://[tenant].sharepoint.com –UserName "[user]@[tenant].onmicrosoft.com
$RelativeOrFullPath = "Local Path to folder where files will be written"
Add-IaCSample01Definition -RelativePath $RelativeOrFullPath -Verbose
Set-IaCProvisionResources -SiteContent $RelativeOrFullPath -Verbose
Disconnect-SPIaC
```
At the root of the project is a sample .ps1 file which will run the same series of commands.

After the Powershell cmdlet Set-IaCProvisionResources has executed successfully you should see a list "Sample 01 File Upload" in your Site.  The following videos will demonstrate how to execute the cmdlets and the user experience with the form.  You can quickly see that the Out of the Box controls are very similiar to InfoPath.  The control in native SharePoint however, do not suffer from a variety of file upload limits and schema drift.

#Video demonstration
Here is a video to watch how you can go from Build to configuration of a SharePoint site.

<iframe width="608" height="391" src="https://mix.office.com/embed/1hqxzxbj2h51c" frameborder="0" allowfullscreen></iframe>

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