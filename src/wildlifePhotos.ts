export type WildlifePhoto={id:string;name:string;scientific:string;filename:string;author:string;license:string;notes:string};
export const WILDLIFE_PHOTOS:WildlifePhoto[]=[
{id:'cape-cobra',name:'Cape cobra',scientific:'Naja nivea',filename:'Naja_nivea_325326142.jpg',author:'Ryan van Huyssteen',license:'CC BY-SA 4.0',notes:'Colours and posture vary; never approach to identify.'},
{id:'puff-adder',name:'Puff adder',scientific:'Bitis arietans',filename:'Bitis_arietans_by_Danny_S._2.JPG',author:'Danny S.',license:'CC BY-SA 4.0',notes:'Camouflaged; can stay motionless.'},
{id:'boomslang',name:'Boomslang',scientific:'Dispholidus typus',filename:'Dispholidus_typus_333317716.jpg',author:'Miguel da Fonseca',license:'CC0',notes:'Venom effects may be delayed.'},
{id:'black-button',name:'Black button spider',scientific:'Latrodectus indistinctus',filename:'Latrodectus_indistinctus.jpg',author:'Jeremy Miller',license:'CC BY 3.0',notes:'Medically important widow spider.'},
{id:'brown-button',name:'Brown button spider',scientific:'Latrodectus geometricus',filename:'Latrodectus_geometricus,_wyfie,_Pretoria,_a.jpg',author:'JMK',license:'CC BY-SA 4.0',notes:'Medically important widow spider.'},
{id:'violin',name:'Violin spider (representative)',scientific:'Loxosceles simillima',filename:'Loxosceles_simillima_305448291_550737216.jpg',author:'Peter Webb',license:'CC BY 4.0',notes:'Photographed in Northern Cape; an example of this genus, not evidence of a sighting at Monkey Valley.'},
{id:'rain-spider',name:'Rain spider',scientific:'Palystes superciliosus',filename:'Palystes_superciliosus_female_2012_02_11_2534.JPG',author:'JonRichfield',license:'CC BY-SA 3.0',notes:'Large appearance does not necessarily mean a dangerous bite.'},
{id:'cape-thicktail',name:'Cape thicktail scorpion',scientific:'Parabuthus capensis',filename:'Parabuthus_capensis.jpg',author:'Pindgrisen',license:'CC BY-SA 4.0',notes:'Venomous; a child sting needs urgent advice.'},
{id:'rough-thicktail',name:'Rough thicktail scorpion',scientific:'Parabuthus granulatus',filename:'Parabuthus_granulatus_114667175.jpg',author:'Bernard DUPONT',license:'CC BY-SA 4.0',notes:'Drier-region example; not a claimed Cape Town or resort sighting.'},
{id:'chacma',name:'Chacma baboon',scientific:'Papio ursinus',filename:'Papio_ursinus_-_cape_of_good_hope.JPG',author:'Harald Süpfle',license:'CC BY-SA 2.5',notes:'Stay away from animals and food-seeking individuals.'},
{id:'seal',name:'Cape fur seal',scientific:'Arctocephalus pusillus',filename:'Cape_Fur_Seal_(Arctocephalus_pusillus),_Hout_Bay.jpg',author:'Martinvl',license:'CC BY-SA 4.0',notes:'Do not approach or feed; bite/rabies assessment is urgent.'},
{id:'bluebottle',name:'Bluebottle',scientific:'Physalia physalis',filename:'Physalia_physalis.jpg',author:'ThomasLöber',license:'CC BY-SA 3.0',notes:'Stinging tentacles can remain hazardous on the beach.'}
];
export const WILDLIFE_GROUPS:Record<string,string[]>={
'Cape cobra':['cape-cobra'],
'Puff adder':['puff-adder'],
'Boomslang':['boomslang'],
'Button / widow spiders':['black-button','brown-button'],
'Violin spiders':['violin'],
'Rain spiders':['rain-spider'],
'Scorpions':['cape-thicktail','rough-thicktail'],
'Chacma baboons':['chacma'],
'Cape fur seals':['seal'],
'Bluebottles':['bluebottle']
};
export function wildlifeSource(file:string){return 'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file)}
