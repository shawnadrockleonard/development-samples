<xsl:stylesheet xmlns:x="http://www.w3.org/2001/XMLSchema" xmlns:dsp="http://schemas.microsoft.com/sharepoint/dsp" version="1.0" exclude-result-prefixes="xsl msxsl ddwrt" xmlns:ddwrt="http://schemas.microsoft.com/WebParts/v2/DataView/runtime" xmlns:asp="http://schemas.microsoft.com/ASPNET/20" xmlns:__designer="http://schemas.microsoft.com/WebParts/v2/DataView/designer" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:SharePoint="Microsoft.SharePoint.WebControls">
  <xsl:output method="html" indent="no"/>
  <xsl:decimal-format NaN=""/>
  <xsl:param name="dvt_apos">'</xsl:param>
  <xsl:param name="ManualRefresh"></xsl:param>
  <xsl:variable name="dvt_1_automode">0</xsl:variable>
  <xsl:template match="/">
    <xsl:choose>
      <xsl:when test="($ManualRefresh = 'True')">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td valign="top">
              <xsl:call-template name="dvt_1"/>
            </td>
            <td width="1%" class="ms-vb" valign="top">
              <img src="/_layouts/15/images/staticrefresh.gif" id="ManualRefresh" border="0" onclick="javascript: {ddwrt:GenFireServerEvent('__cancel')}" alt="Click here to refresh the dataview."/>
            </td>
          </tr>
        </table>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="dvt_1"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="dvt_1">
    <xsl:variable name="dvt_StyleName">ListForm</xsl:variable>
    <xsl:variable name="Rows" select="/dsQueryResponse/Rows/Row"/>
    <xsl:variable name="dvt_RowCount" select="count($Rows)"/>
    <xsl:variable name="dvt_IsEmpty" select="$dvt_RowCount = 0"/>
    <xsl:choose>
      <xsl:when test="$dvt_IsEmpty">
        <xsl:call-template name="dvt_1.empty"/>
      </xsl:when>
      <xsl:otherwise>
        <table border="0" width="100%">
          <xsl:call-template name="dvt_1.body">
            <xsl:with-param name="Rows" select="$Rows"/>
          </xsl:call-template>
        </table>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="dvt_1.body">
    <xsl:param name="Rows"/>
    <tr>
      <td class="ms-toolbar" nowrap="nowrap">
        <table>
          <tr>
            <td width="99%" class="ms-toolbar" nowrap="nowrap">
              <IMG SRC="/_layouts/15/images/blank.gif" width="1" height="18"/>
            </td>
            <td class="ms-toolbar" nowrap="nowrap" align="right">
              <SharePoint:GoBackButton runat="server" ControlMode="Display" id="gobackbutton1"/>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td class="ms-toolbar" nowrap="nowrap">
        <SharePoint:FormToolBar runat="server" ControlMode="Display"/>
        <SharePoint:ItemValidationFailedMessage runat="server" ControlMode="Display"/>
      </td>
    </tr>
    <xsl:for-each select="$Rows">
      <xsl:call-template name="dvt_1.rowview"/>
    </xsl:for-each>
    <tr>
      <td class="ms-toolbar" nowrap="nowrap">
        <table>
          <tr>
            <td class="ms-descriptiontext" nowrap="nowrap">
              <SharePoint:CreatedModifiedInfo ControlMode="Display" runat="server"/>
            </td>
            <td width="99%" class="ms-toolbar" nowrap="nowrap">
              <IMG SRC="/_layouts/15/images/blank.gif" width="1" height="18"/>
            </td>
            <td class="ms-toolbar" nowrap="nowrap" align="right">
              <SharePoint:GoBackButton runat="server" ControlMode="Display" id="gobackbutton2"/>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </xsl:template>
  <xsl:template name="dvt_1.rowview">
    <script id="uploadedFileTmpl" type="text/html">
      <div>
        <label for="uploadTextId">File:</label>
        <span id="uploadTextId">
          <a id="hrefDownloadId" target="_blank">
            <xsl:attribute name="data-bind">attr: { href: serverUrl, title: name}, text: name</xsl:attribute>
          </a>
        </span> (<span id="fileId">
          <xsl:attribute name="data-bind">text: sizeMB</xsl:attribute>
        </span>Mibs)
      </div>
    </script>
    <tr>
      <td>
        <table border="0" cellspacing="0" width="100%">
          <tr>
            <td width="190px" valign="top" class="ms-formlabel">
              <H3 class="ms-standardheader">
                <nobr>Title</nobr>
              </H3>
            </td>
            <td width="400px" valign="top" class="ms-formbody">
              <xsl:value-of select="@Title"/>
            </td>
          </tr>
          <tr>
            <td width="190px" valign="top" class="ms-formlabel">
              <H3 class="ms-standardheader">
                <nobr>Description</nobr>
              </H3>
            </td>
            <td width="400px" valign="top" class="ms-formbody">
              <xsl:value-of select="@SampleCSRDescription" disable-output-escaping="yes"/>
            </td>
          </tr>
          <tr>
            <td width="190px" valign="top" class="ms-formlabel">
              <H3 class="ms-standardheader">
                <nobr>Description Attachments</nobr>
              </H3>
            </td>
            <td width="400px" valign="top" class="ms-formbody">
              <div id="SampleCSRDescAttachments" style="display:none">
                <xsl:value-of select="@SampleCSRDescAttachments"/>
              </div>
              <div id="SampleCSRDescAttachmentsListing">
                <xsl:attribute name="data-bind">with: uploadViewModel</xsl:attribute>
                <div id="SampleCSRDescAttachmentsId">
                  <xsl:attribute name="data-bind">
                    visible:hasContent, template: { name: "uploadedFileTmpl", foreach: ko.utils.arrayFilter(uploads(), function (elementItem) {
                    return elementItem.targetId() == "SampleCSRDescAttachments";  })}
                  </xsl:attribute>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td width="190px" valign="top" class="ms-formlabel">
              <H3 class="ms-standardheader">
                <nobr>Secondary Attachments</nobr>
              </H3>
            </td>
            <td width="400px" valign="top" class="ms-formbody">
              <div id="SampleCSRSecondaryAttachments" style="display:none">
                <xsl:value-of select="@SampleCSRSecondaryAttachments"/>
              </div>
              <div id="SampleCSRSecondaryAttachmentsListing">
                <xsl:attribute name="data-bind">with: uploadViewModel</xsl:attribute>
                <div id="SampleCSRSecondaryAttachmentsId">
                  <xsl:attribute name="data-bind">
                    visible:hasContent, template: { name: "uploadedFileTmpl", foreach: ko.utils.arrayFilter(uploads(), function (elementItem) {
                    return elementItem.targetId() == "SampleCSRSecondaryAttachments";  })}
                  </xsl:attribute>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td width="190px" valign="top" class="ms-formlabel">
              <H3 class="ms-standardheader">
                <nobr>Cover Letter Attachments</nobr>
              </H3>
            </td>
            <td width="400px" valign="top" class="ms-formbody">
              <div id="SampleCSRCoverLetterAttachments" style="display:none">
              <xsl:value-of select="@SampleCSRCoverLetterAttachments"/>
              </div>
              <div id="SampleCSRCoverLetterAttachmentsListing">
                <xsl:attribute name="data-bind">with: uploadViewModel</xsl:attribute>
                <div id="SampleCSRCoverLetterAttachmentsId">
                  <xsl:attribute name="data-bind">
                    visible:hasContent, template: { name: "uploadedFileTmpl", foreach: ko.utils.arrayFilter(uploads(), function (elementItem) {
                    return elementItem.targetId() == "SampleCSRCoverLetterAttachments";  })}
                  </xsl:attribute>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td width="190px" valign="top" class="ms-formlabel">
              <H3 class="ms-standardheader">
                <nobr>Last Updated</nobr>
              </H3>
            </td>
            <td width="400px" valign="top" class="ms-formbody">
              <xsl:value-of select="@SampleCSRLastUpdated"/>
            </td>
          </tr>
          <tr>
            <td width="190px" valign="top" class="ms-formlabel">
              <H3 class="ms-standardheader">
                <nobr>Comments</nobr>
              </H3>
            </td>
            <td width="400px" valign="top" class="ms-formbody">
              <xsl:value-of select="@SampleCSRComments" disable-output-escaping="yes"/>
            </td>
          </tr>
          <tr id="idAttachmentsRow" style="display:none">
            <td nowrap="true" valign="top" class="ms-formlabel" width="20%">
              <SharePoint:FieldLabel ControlMode="Display" FieldName="Attachments" runat="server"/>
            </td>
            <td valign="top" class="ms-formbody" width="80%">
              <SharePoint:FormField runat="server" id="AttachmentsField" ControlMode="Display" FieldName="Attachments" __designer:bind="{ddwrt:DataBind('u','AttachmentsField','Value','ValueChanged','ID',ddwrt:EscapeDelims(string(@ID)),'@Attachments')}"/>
              <script>
                var elm = document.getElementById("idAttachmentsTable");
                if (elm !== null &amp;&amp; elm.rows.length > 0)
                document.getElementById("idAttachmentsRow").style.display='inline';
              </script>
            </td>
          </tr>
          <xsl:if test="$dvt_1_automode = '1'" ddwrt:cf_ignore="1">
            <tr>
              <td colspan="99" class="ms-vb">
                <span ddwrt:amkeyfield="ID" ddwrt:amkeyvalue="ddwrt:EscapeDelims(string(@ID))" ddwrt:ammode="view"></span>
              </td>
            </tr>
          </xsl:if>
        </table>
      </td>
    </tr>
  </xsl:template>
  <xsl:template name="dvt_1.empty">
    <xsl:variable name="dvt_ViewEmptyText">There are no items to show in this view.</xsl:variable>
    <table border="0" width="100%">
      <tr>
        <td class="ms-vb">
          <xsl:value-of select="$dvt_ViewEmptyText"/>
        </td>
      </tr>
    </table>
  </xsl:template>
</xsl:stylesheet>
