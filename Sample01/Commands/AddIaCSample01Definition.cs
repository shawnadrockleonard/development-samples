using InfrastructureAsCode.Powershell.CmdLets;
using InfrastructureAsCode.Powershell.Sample01.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;
using System.Text;
using System.Threading.Tasks;

namespace InfrastructureAsCode.Powershell.Sample01.Commands
{
    [Cmdlet(VerbsCommon.Add, "IaCSample01Definition")]
    [CmdletHelp("Returns a report of the entire farm", Category = "Reporting")]
    public class AddIaCSample01Definition : IaCCmdlet
    {
        [Parameter(Mandatory = true)]
        public string RelativePath { get; set; }

        protected override void BeginProcessing()
        {
            base.BeginProcessing();
            if(!System.IO.Directory.Exists(this.RelativePath))
            {
                LogWarning("Directory {0} is not valid.", this.RelativePath);
                throw new Exception("Directory supplied now found.");
            }
        }

        public override void ExecuteCmdlet()
        {
            base.ExecuteCmdlet();

            var model = new FileSampleLibraryDefinition();

            var contents = string.Format("{0}\\Content", this.RelativePath);
            if (!System.IO.Directory.Exists(contents))
            {
                System.IO.Directory.CreateDirectory(contents);
            }
            var siteAssets = string.Format("{0}\\SiteAssets", this.RelativePath);
            if (!System.IO.Directory.Exists(siteAssets))
            {
                System.IO.Directory.CreateDirectory(siteAssets);
            }

            var json = JsonConvert.SerializeObject(model, Formatting.Indented);
            System.IO.File.WriteAllText(String.Format("{0}\\Provisioner.json", contents), json);

            
        }
    }
}
