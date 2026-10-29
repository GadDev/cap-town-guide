export type Currency='EUR'|'USD'|'GBP';
export type Rates={date:string;value:Record<Currency,number>};
export const historicEurZar=18.5339;
export function parseRates(data:unknown):Rates {
if(!Array.isArray(data))throw Error('Rates unavailable');
const a=data as {date?:string;base?:string;quote?:string;rate?:number}[];
const find=(c:string)=>a.find(x=>x.base?.toUpperCase()==='EUR'&&x.quote?.toUpperCase()===c)?.rate;
const zar=find('ZAR'),usd=find('USD'),gbp=find('GBP');
if(![zar,usd,gbp].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>0))throw Error('Missing rate');
const date=a[0]?.date||'';if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Invalid date');
return {date,value:{EUR:zar!,USD:zar!/usd!,GBP:zar!/gbp!}};
}
