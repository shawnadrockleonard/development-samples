<#
    .SYNOPSIS
    Executes a series of cmdlets to create a JSON file from a class definition
	Will then use the JSON to provision the resources in SharePoint
    .PARAMETER RelativeOrFullPath
    Specifies the relative path to the JSON file to be used in the site configuration.
    .OUTPUTS
    Nothing
#>  
[CmdletBinding(HelpURI='http://aka.ms/pinch-perfect', DefaultParameterSetName='ConnectionObject')]
[OutputType([bool])]
Param(
    [Parameter(Mandatory = $true)]
    [String]$RelativeOrFullPath
)
BEGIN 
{
	# Configure context to SharePoint site
	Connect-SPIaC -Url "https://shawniq.sharepoint.com" -UserName "sleonard@shawniq.onmicrosoft.com"
}
PROCESS
{
	try {

		Add-IaCSample01Definition -RelativePath $RelativeOrFullPath -Verbose

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