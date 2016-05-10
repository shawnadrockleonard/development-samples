# Configure context to SharePoint site
Connect-SPIaC -Url "https://[tenant].sharepoint.com" -UserName "use@[domain].onmicrosoft.com"

Add-IaCSample01Definition -RelativePath "../../AppFiles/" -Verbose

Set-IaCProvisionResources -SiteContent "../../AppFiles/" -Verbose

Set-IaCProvisionAssets -SiteContent "../../AppFiles/" -Verbose

Disconnect-SPIaC