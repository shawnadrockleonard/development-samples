using IaC.Powershell.CmdLets;
using IaC.Powershell.Sample01.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Management.Automation;
using System.Text;
using System.Threading.Tasks;

namespace IaC.Powershell.Sample01.Commands
{
    [Cmdlet(VerbsCommon.Add, "IaCSample01Definition")]
    [CmdletHelp("Returns a report of the entire farm", Category = "Reporting")]
    public class AddIaCSample01Definition : IaCCmdlet
    {
        public override void ExecuteCmdlet()
        {
            base.ExecuteCmdlet();

            var model = new FileSampleLibraryDefinition();



        }
    }
}
