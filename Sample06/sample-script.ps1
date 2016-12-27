<#
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

## SUMMARY ##
	This script will upload the individual files to the SharePoint Site Assets folder

## Example ##
    .\sample-script.ps1 -siteUrl "https://[domain].sharepoint.com" -username "[user]@[tenant]"
#>
[cmdletbinding(SupportsShouldProcess=$True)]
param( 
    [ValidateScript({Test-Path $_ -PathType 'Container'})] 
    [string]$directory = "K:\sleonard\vGIT\development-samples\Sample06\AppFiles",

    [Validate(Mandatory = $true)]
    [string]$siteurl,

    [Validate(Mandatory = $true)]
	[string]$username
)
BEGIN
{
    cd ("{0}\{1}\Documents" -f $env:HOMEDRIVE,$env:HOMEPATH)
}
PROCESS 
{
    Connect-SPIaC -Url $siteurl -UserName $username
    Set-IaCProvisionAssets -SiteContent $directory -SiteActionFile "xsl\SampleVersionDisp" -Verbose
    Set-IaCProvisionAssets -SiteContent $directory -SiteActionFile "js\SampleVersionDisp" -Verbose
    Disconnect-SPIaC
}
END
{

}