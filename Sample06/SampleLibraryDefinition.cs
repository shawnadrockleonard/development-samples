using InfrastructureAsCode.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;

namespace Sample06
{
    /// <summary>
    /// Defines the JSON file which will provision resources
    /// </summary>
    public class SampleLibraryDefinition : SiteProvisionerModel
    {
        public SampleLibraryDefinition() : base()
        {
            this.Lists.Add(GetSampleLibrary());
        }

        private SPListDefinition GetSampleLibrary()
        {
            var newList = new SPListDefinition()
            {
                ListName = "Sample Version History",
                ListDescription = "Sample Version History for demonstrating version history and append changes.",
                ListTemplate = ListTemplateType.GenericList,
                QuickLaunch = QuickLaunchOptions.On,
                Versioning = true,
                FieldDefinitions = GetSampleFields()
            };

            return newList;
        }

        private List<SPFieldDefinitionModel> GetSampleFields()
        {
            var fields = new List<SPFieldDefinitionModel>();

            fields.Add(new SPFieldDefinitionModel(FieldType.Note)
            {
                AddToDefaultView = true,
                Title = "My Notes",
                Description = "Contains versioned notes",
                FieldGuid = new Guid("d9c65062-cde4-49be-908b-be2982c70dcf"),
                GroupName = "SampleVH",
                InternalName = "My_x0020_Notes",
                AppendOnly = true,
                NumLines = 10,
                RichTextField = true
            });
            fields.Add(new SPFieldDefinitionModel(FieldType.Choice)
            {
                Title = "My Choice",
                Description = "Contains choice for version history",
                FieldGuid = new Guid("a41e9f2a-dc8b-491c-8078-5a1f5082b1e4"),
                GroupName = "SampleVH",
                InternalName = "My_x0020_Choice",
                ChoiceFormat = ChoiceFormatType.Dropdown,
                FieldChoices = new List<SPChoiceModel>() { new SPChoiceModel("None of the Above", true), new SPChoiceModel("Student #1"), new SPChoiceModel("Student #2") }
            });

            return fields;
        }
    }
}
