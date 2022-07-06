using InfrastructureAsCode.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;

namespace Sample04
{
    /// <summary>
    /// Defines the JSON file which will provision resources
    /// </summary>
    public class Sample04LibraryDefinition : SiteProvisionerModel
    {
        public Sample04LibraryDefinition() : base()
        {
            this.Lists.Add(GetSampleLibrary());
        }

        private SPListDefinition GetSampleLibrary()
        {
            var newList = new SPListDefinition()
            {
                ListName = "Sample 04 File Upload",
                ListDescription = "Sample library for uploading files.",
                ListTemplate = ListTemplateType.GenericList,
                QuickLaunch = QuickLaunchOptions.On,
                Versioning = false,
                FieldDefinitions = GetSampleFields()
            };

            return newList;
        }

        private List<SPFieldDefinitionModel> GetSampleFields()
        {
            var fields =new  List<SPFieldDefinitionModel>();

            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
               AddToDefaultView = true,
               Title = "Description",
               Description = "Contains the description of the database",
               FieldGuid = new Guid("81b59091-34e8-426e-abe8-9d8031e232fa"),
               GroupName = "SampleCSR",
               InternalName = "SampleCSRDescription",
               NumLines = 10,
               RichTextField = true
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
                Title = "Description Attachments",
                Description = "Contains the hyperlinks to the attachments for the database",
                FieldGuid = new Guid("e48f3553-498d-4eea-bdcb-a065f24baa72"),
                GroupName = "SampleCSR",
                InternalName = "SampleCSRDescAttachments",
                NumLines = 10,
                RichTextField = false
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
                Title = "Cover Letter Attachments",
                Description = "Contains the hyperlinks to the cover letter attachments for the database",
                FieldGuid = new Guid("336df8a0-0014-4e4e-9120-7b5362d7ebc7"),
                GroupName = "SampleCSR",
                InternalName = "SampleCSRCoverLetterAttachments",
                NumLines = 10,
                RichTextField = false
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
                Title = "Secondary Attachments",
                Description = "Contains the hyperlinks to the secondary attachments for the database",
                FieldGuid = new Guid("ee3e6f0b-fa54-4956-9709-68919671de5a"),
                GroupName = "SampleCSR",
                InternalName = "SampleCSRSecondaryAttachments",
                NumLines = 10,
                RichTextField = false
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.DateTime)
            {
                AddToDefaultView = true,
                Title = "Last Updated",
                Description = "Contains the date this was last updated",
                FieldGuid = new Guid("b7e7ca56-d150-4551-91bf-f4c679a018ee"),
                GroupName = "SampleCSR",
                InternalName = "SampleCSRLastUpdated",
                DateFieldFormat = DateTimeFieldFormatType.DateOnly,
                Required = true
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
                Title = "Comments",
                Description = "Contains user comments for the database",
                FieldGuid = new Guid("d7783199-1226-4097-a48c-caa748f95857"),
                GroupName = "SampleCSR",
                InternalName = "SampleCSRComments",
                NumLines = 10,
                RichTextField = false
            });

            return fields;
        }
    }
}
