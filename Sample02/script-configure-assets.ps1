# Connect-SPIaC -Url "https://[tenant].sharepoint.com" -UserName "[user]@[tenant].onmicrosoft.com" # open Connection

# Location of my SiteAssets folder which contains my JS, XSL, CSS, and other artifacts
$relativePath = "K:\sleonard\vGIT\development-samples\Sample02\AppFiles"

Set-IaCProvisionAssets -SiteContent $relativePath -SiteActionFile "js\Sample02New" -Verbose # Scans the JS folder for prefix Sample02New

Set-IaCProvisionAssets -SiteContent $relativePath -SiteActionFile "css" # Uploads everything in the CSS folder

Set-IaCProvisionAssets -SiteContent $relativePath -SiteActionFile "xsl\Sample02" # Scans the XSL folder for prefix Sample02

Set-IaCProvisionAssets -SiteContent $relativePath # uploads all SiteAssets

Disconnect-SPIaC # close the ClientContext cache