using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sample06
{
    class Program
    {
        static void Main(string[] args)
        {
            var thisPath = System.Reflection.Assembly.GetExecutingAssembly().Location;
            var pathcurrent = new System.IO.DirectoryInfo(thisPath);
            var binFullPath = string.Format("{0}\\AppFiles", pathcurrent.Parent.Parent.Parent.FullName);

            var pathContent = string.Format("{0}\\Content\\", binFullPath);
            if (!System.IO.Directory.Exists(pathContent))
            {
                var outputPathDir = System.IO.Directory.CreateDirectory(pathContent);
                System.Console.WriteLine(string.Format("Directory {0} created", outputPathDir.FullName));
            }

            var pathSiteAssets = string.Format("{0}\\SiteAssets", binFullPath);
            if (!System.IO.Directory.Exists(pathSiteAssets))
            {
                var outputPathDir = System.IO.Directory.CreateDirectory(pathSiteAssets);
                System.Console.WriteLine(string.Format("Directory {0} created", outputPathDir.FullName));
            }

            var model = new SampleLibraryDefinition();
            var jsonPath = string.Format("{0}\\Provisioner.json", pathContent);
            var jsonProvisioner = JsonConvert.SerializeObject(model, Newtonsoft.Json.Formatting.Indented, new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore
            });
            System.IO.File.WriteAllText(jsonPath, jsonProvisioner);
        }
    }
}
