<#
    .SYNOPSIS
		Executes a series of cmdlets to create a JSON file from a class definition
		Will then use the JSON to provision the resources in SharePoint
    .PARAMETER RelativeOrFullPath
		Specifies the relative path to the JSON file to be used in the site configuration.
    .OUTPUTS
		Nothing

	Example
		From your home 'Documents' directory
		cd ("{0}\\{1}\\Documents" -f $env:HOMEDRIVE, $env:HOMEPATH)
		$RelativeOrFullPath = Full Path to your Project Folder c:\[YOUR REPO FOLDER]\development-samples\Sample02\AppFiles\

	.\WindowsPowerShell\Modules\InfrastructureAsCode.Powershell.Sample02\script-configure-sample02.ps1 -RelativeOrFullPath $RelativeOrFullPath
#>  
[CmdletBinding(HelpURI='http://aka.ms/pinch-perfect')]
Param(
    [Parameter(Mandatory = $false)]
    [String]$RelativeOrFullPath
)
BEGIN 
{
	# Configured path for my development environment
	if($RelativeOrFullPath -eq $null -or $RelativeOrFullPath.Length -lt 1) 
	{   # if we do not supply a parameter use my local path
		$RelativeOrFullPath = "K:\sleonard\vGIT\development-samples\Sample02\AppFiles"
	}

	# Configure context to SharePoint site
	# Connect-SPIaC -Url "https://[tenant].sharepoint.com" -UserName "[user]@[tenant].onmicrosoft.com"
}
PROCESS
{
	try {

		Add-IaCSample02Definition -RelativePath $RelativeOrFullPath -Verbose

		Set-IaCProvisionResources -SiteContent $RelativeOrFullPath -Verbose

		Set-IaCProvisionAssets -SiteContent $RelativeOrFullPath -Verbose

	}
	catch {
		Write-Error $_.Exception[0]
	}
	finally {
		Disconnect-SPIaC
	}
}