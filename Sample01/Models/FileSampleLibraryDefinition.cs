using IaC.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;

namespace IaC.Powershell.Sample01.Models
{
    /// <summary>
    /// Defines the JSON file which will provision resources
    /// </summary>
    public class FileSampleLibraryDefinition : SiteProvisionerModel
    {
        public FileSampleLibraryDefinition() : base()
        {
            this.SiteResources = false; // used to provision list specific attributes not at the site level
            this.Lists.Add(GetSample01Library());
        }

        private SPListDefinition GetSample01Library()
        {
            var newList = new SPListDefinition()
            {
                ListName = "Sample 01 File Upload",
                ListDescription = "Sample library for uploading files.",
                ListTemplate = ListTemplateType.GenericList,
                QuickLaunch = QuickLaunchOptions.On,
                Versioning = false,
                FieldDefinitions = GetSample01Fields()
            };

            return newList;
        }

        private List<SPFieldDefinitionModel> GetSample01Fields()
        {
            var fields =new  List<SPFieldDefinitionModel>();

            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
               AddToDefaultView = true,
               DisplayName = "Description",
               Description = "Contains the description of the database",
               FieldGuid = new Guid("81b59091-34e8-426e-abe8-9d8031e232fa"),
               GroupName = "Sample01",
               InternalName = "Sample01Description",
               NumLines = 10,
               RestrictedMode = true,
               RichTextField = true
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
                DisplayName = "Description Attachments",
                Description = "Contains the hyperlinks to the attachments for the database",
                FieldGuid = new Guid("e48f3553-498d-4eea-bdcb-a065f24baa72"),
                GroupName = "Sample01",
                InternalName = "Sample01DescAttachments",
                NumLines = 10,
                RestrictedMode = true,
                RichTextField = true
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
                DisplayName = "Cover Letter Attachments",
                Description = "Contains the hyperlinks to the cover letter attachments for the database",
                FieldGuid = new Guid("336df8a0-0014-4e4e-9120-7b5362d7ebc7"),
                GroupName = "Sample01",
                InternalName = "Sample01CoverLetterAttachments",
                NumLines = 10,
                RestrictedMode = true,
                RichTextField = true
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
                DisplayName = "Secondary Attachments",
                Description = "Contains the hyperlinks to the secondary attachments for the database",
                FieldGuid = new Guid("ee3e6f0b-fa54-4956-9709-68919671de5a"),
                GroupName = "Sample01",
                InternalName = "Sample01SecondaryAttachments",
                NumLines = 10,
                RestrictedMode = true,
                RichTextField = true
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.DateTime)
            {
                AddToDefaultView = true,
                DisplayName = "Last Updated",
                Description = "Contains the date this was last updated",
                FieldGuid = new Guid("b7e7ca56-d150-4551-91bf-f4c679a018ee"),
                GroupName = "Sample01",
                InternalName = "Sample01LastUpdated",
                DateFieldFormat = DateTimeFieldFormatType.DateOnly
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
                DisplayName = "Comments",
                Description = "Contains user comments for the database",
                FieldGuid = new Guid("d7783199-1226-4097-a48c-caa748f95857"),
                GroupName = "Sample01",
                InternalName = "Sample01Comments",
                NumLines = 10,
                RestrictedMode = true,
                RichTextField = true
            });

            return fields;
        }
    }
}
