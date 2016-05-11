# Connect-SPIaC -Url "https://[tenant].sharepoint.com" -UserName "[user]@[tenant].onmicrosoft.com" # open Connection

# Location of my SiteAssets folder which contains my JS, XSL, CSS, and other artifacts
$relativePath = "K:\sleonard\vGIT\development-samples\Sample03\AppFiles"

Set-IaCProvisionAssets -SiteContent $relativePath -SiteActionFile "js" -Verbose # Uploads JS

Set-IaCProvisionAssets -SiteContent $relativePath -SiteActionFile "html" -Verbose # Uploads HTML

Set-IaCProvisionAssets -SiteContent $relativePath -SiteActionFile "css" # Uploads everything in the CSS folder

Set-IaCProvisionAssets -SiteContent $relativePath -SiteActionFile "xsl" # SUploads XSL

Set-IaCProvisionAssets -SiteContent $relativePath # uploads all SiteAssets

Disconnect-SPIaC # close the ClientContext cache