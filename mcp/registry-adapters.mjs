// Fixed allowlist: a new browser registry entry is never automatically exposed remotely.
import { MCP_BROWSER_ADAPTERS } from '../assets/js/core/tool-guide.js';
import { buildToolSchema, runTool } from '../assets/js/core/llm-context.js';
import { REGISTRY } from '../assets/js/core/registry.js';
import { castChart } from '../assets/js/core/astro.js';
import { parseExplicitInstant } from '../assets/js/core/instant-boundary.js';
const schemas=buildToolSchema();
const chartTools=new Set(['castChart','annualProfection','lifeTrajectory','electionScore','talismanRecipe','detectYogas']);
export const REGISTRY_MCP_TOOLS=MCP_BROWSER_ADAPTERS.map(adapter=>{
  const entry=REGISTRY.find(x=>x.id===adapter.id);
  const browser=schemas.find(x=>x.function.name===adapter.exportName)?.function;
  if(!entry?.callable||entry.exportName!==adapter.exportName||!browser)throw new Error(`Stale MCP adapter: ${adapter.id}`);
  const inputSchema=JSON.parse(JSON.stringify(browser.parameters));
  // An MCP call has no current page chart: never infer one or read saved records.
  if(['date','lat','lon'].every(k=>inputSchema.properties[k]))inputSchema.required=[...new Set([...inputSchema.required,'date','lat','lon'])];
  if(adapter.exportName==='lifeTrajectory')inputSchema.required=[...new Set([...inputSchema.required,'currentDate'])];
  return {name:adapter.mcpName,description:`${entry.title}. Strict stateless adapter of ${adapter.exportName}; ${entry.computes} Explicit inputs only; no saved browser context.`,inputSchema,
    calculate:args=>{
      if(adapter.exportName==='lifeTrajectory'){
        const birth=parseExplicitInstant(args.date),reference=parseExplicitInstant(args.currentDate),latest=new Date(+birth),month=birth.getUTCMonth();latest.setUTCFullYear(latest.getUTCFullYear()+150);if(latest.getUTCMonth()!==month)latest.setUTCDate(0);
        if(reference<birth||reference>latest)throw new RangeError('Trajectory evaluation must be from birth through 150 calendar years after birth.');
      }
      const result=runTool(adapter.exportName,args,{}),out={capabilityId:entry.id,source:entry.citation,sourceStatus:'Inherited implementation and citation; not a new validation of the historical claim.',result,method:'Same pure browser dispatcher with strict arguments and no page context.',limitations:['Computed traditional classifications are study material, not outcome probabilities.','MCP clients may retain arguments; no browser records are read automatically.']};
      if(chartTools.has(adapter.exportName)){
        const requested=args.system||(adapter.exportName==='detectYogas'?'whole':'regiomontanus'),chart=castChart(parseExplicitInstant(args.date),args.lat,args.lon,requested);
        const suffix=/([+-])(\d{2}):(\d{2})$/.exec(args.date),isoOffset=suffix?(Number(suffix[2])+Number(suffix[3])/60)*(suffix[1]==='-'?-1:1):null,utcOffset=args.utcOffset??isoOffset;
        out.calculationContext={dateISO:parseExplicitInstant(args.date).toISOString(),lat:args.lat,lon:args.lon,timeZone:args.timeZone??null,utcOffset,requestedHouseSystem:requested,actualHouseSystem:chart.system,houseWarning:chart.houseWarning||null,clockConvention:args.timeZone?'Explicit supplied IANA time zone':args.utcOffset!=null?'Explicit supplied fixed UTC offset':isoOffset!==null?'Fixed UTC offset taken from the explicit ISO suffix':'No IANA zone or numeric offset supplied; engine-specific mean-solar/UTC convention is retained, not inferred from coordinates.'};
      }
      if(adapter.exportName==='solarStations'){
        const available=Object.keys(result).some(k=>!['citation','caveat'].includes(k));
        out.availability={available,status:available?'calculated':'unavailable',reason:available?null:'Required sunrise/sunset interval is unavailable at this observer and date; no complete four-station result is inferred.',clockConvention:'Existing solarStations searches the supplied instant’s UTC calendar date; this adapter has no IANA civil-day option.'};
      }
      return out;
    }};
});
