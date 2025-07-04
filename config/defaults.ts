import { swapRoutes } from '@/services/osmosis'
import { GeneratedType, Registry } from '@cosmjs/proto-signing'
import { AminoTypes } from '@cosmjs/stargate'
import {
  cosmosAminoConverters,
  cosmosProtoRegistry,
  cosmwasmAminoConverters,
  cosmwasmProtoRegistry,
  ibcAminoConverters,
  ibcProtoRegistry,
  osmosisAminoConverters,
  osmosisProtoRegistry,
} from 'osmojs'

const protoRegistry: ReadonlyArray<[string, GeneratedType]> = [
  ...cosmosProtoRegistry,
  ...cosmwasmProtoRegistry,
  ...ibcProtoRegistry,
  ...osmosisProtoRegistry,
]

const aminoConverters = {
  ...cosmosAminoConverters,
  ...cosmwasmAminoConverters,
  ...ibcAminoConverters,
  ...osmosisAminoConverters,
}

export const NUMIA_API_KEY = "";

export const registry = new Registry(protoRegistry)
export const aminoTypes = new AminoTypes(aminoConverters)

export const stargazeRPCUrl = 'https://rpc.cosmos.directory/stargaze'
export const rpcUrl = 'https://osmosis-rpc.polkachu.com/' //'https://g.w.lavanet.xyz:443/gateway/osmosis/rpc-http/c6667993e9a0fac0a9c98d29502aa0a7' //'https://rpc.cosmos.directory/osmosis' // 'https://osmosis-rpc.polkachu.com/' //////'https://rpc.cosmos.directory/osmosis' //'https://rpc.osmosis.zone/'//// //

export const delayTime = 1200; // State update Delay time in millisecond
export const loopMax = 5;

export const INPUT_DELAY = 300;

////Specifics for Osmosis services//////
export const SWAP_SLIPPAGE = 1.5; //1.5% slippage
export const USDC_CL_RATIO = 0.115; //11.5% CL

//Rangebound Converation Rate checkpoints
export const rb_conversion_rates = {
  "119D": 2745965,
}

export const colors = {
  globalBG: "#091326", //"#212121",
  global: "rgb(229, 222, 223)",
  tabBG: "#4fcabb",
  rangeBoundBox: "#3d414b", //"#7990fe",
  rangeBoundBorder: "#091326",
  summaryScheme: "rgb(156, 178, 145)",
  noState: "rgb(176, 176, 184)",
  link: "primary.200",
  linkHover: "primary.300",
  sliderCardBorder: "rgb(133, 98, 203)",
  slider: "#4fcabb",
  alert: "rgb(215, 80, 80)",
  textHighlight: "rgb(133, 98, 203)",
  earnText: "rgb(229, 222, 223)",
  sliderThumb: "#4fcabb",
  collateralScrollBG: "rgb(7, 9, 25)",
  sliderTrack: "rgb(229, 222, 223)",
  sliderFilledTrack: "#20d6ff",
  walletIcon: "#7990fe",
  emptyLoader: "rgba(250, 129, 253, 0.57)",
  loader: "primary.500",
  cardBG: "rgb(90, 90, 90)",
  inputBorder: "rgb(127, 79, 128)",
  inputBG: "rgb(12, 5, 15)",
  modalBG: "rgb(22, 24, 39)",
  textLight: "rgba(255, 255, 255, 0.6)",
  p100: "rgb(194, 233, 248)",
  p200: "#4fcabb",
  p300: "rgb(22, 121, 196)",
  p400: "rgb(18, 95, 163)",
  p500: "rgb(16, 75, 140)",
  p600: "rgb(13, 62, 114)",
  p700: "rgb(10, 49, 89)",
  p800: "rgb(7, 36, 63)",
  p900: "rgb(4, 24, 39)"
}

//Original colors
// {
//   tabBG: "primary.200",
//     summaryScheme: "green",
//       noState: "gray",
//         link: "primary.200",
//           linkHover: "primary.300",
//             sliderCardBorder: "rebeccapurple",
//               slider: "#20d6ff",
//                 alert: "#e73a3a",
//                   textHighlight: "rgb(196, 69, 240)",
//                     earnText: "rgb(226, 216, 218)",
//                       sliderThumb: "blue.500",
//                         collateralScrollBG: '#05071B',
//                           sliderTrack: "#E2D8DA",
//                             walletIcon: '#C445F0',
//                               emptyLoader: "rgba(250, 129, 253, 0.57)",
//                                 loader: "primary.500",
//                                   cardBG: '#281E3C',
//                                     inputBorder: '#824784',
//                                       inputBG: '#0C0410',
//                                         modalBG: '#141628',
//                                           textLight: 'rgba(255, 255, 255, 0.6)',
//                                             globalBG: '#05071B',
//                                               global: '#E2D8D',
//                                                 p100: '#B3E9FF',
//                                                   p200: '#00A3F9',
//                                                     p300: '#0079D6',
//                                                       p400: '#005EB2',
//                                                         p500: '#004998',
//                                                           p600: '#003D7C',
//                                                             p700: '#003061',
//                                                               p800: '#002345',
//                                                                 p900: '#00182A',
// }


/// Mainnet addrs
export const mainnetAddrs = {
  launch: "osmo1g6hgj3eu9ju4vuaprjxdzj97ecnuczytve3junulgnwlamnndl5q6k73w6",

  discount_vault: "osmo1v8wckds5lvsdd0xrragvleu8srxprjpwdl7mga5uygnwmz5e7qzsl5zexw",
  governance: "osmo1wk0zlag50ufu5wrsfyelrylykfe3cw68fgv9s8xqj20qznhfm44qgdnq86", //old gov: osmo19h8huy2hz4q7detxzv2r2erlsvlq8hzlsquu6n5x83775va4qgkskf20kq //new gov: osmo1wk0zlag50ufu5wrsfyelrylykfe3cw68fgv9s8xqj20qznhfm44qgdnq86
  liq_queue: "osmo1ycmtfa7h0efexjxuaw7yh3h3qayy5lspt9q4n4e3stn06cdcgm8s50zmjl",
  liquidity_check: "osmo1xxx0yuqhmwekt44q00jrf3rwvfa70rpeu622q0x56yaf423vq93q3qpzux",
  mbrn_auction: "osmo1qwdlg9le9kdrvgyp35jxz53m8zhdssyvxvyevmdxcn852h6dq9gqknf2aa",
  oracle: "osmo16sgcpe0hcs42qk5vumk06jzmstkpka9gjda9tfdelwn65ksu3l7s7d4ggs", //old oracle: osmo160t4k7x8axfd335s0rj5jdffzag684tjrzchlwmqk23xte32alvq6nfz6k //new oracle: osmo16sgcpe0hcs42qk5vumk06jzmstkpka9gjda9tfdelwn65ksu3l7s7d4ggs
  osmosis_proxy: "osmo1s794h9rxggytja3a4pmwul53u98k06zy2qtrdvjnfuxruh7s8yjs6cyxgd",
  positions: "osmo1gy5gpqqlth0jpm9ydxlmff6g5mpnfvrfxd3mfc8dhyt03waumtzqt8exxr",
  stability_pool: "osmo1326cxlzftxklgf92vdep2nvmqffrme0knh8dvugcn9w308ya9wpqv03vk8",
  staking: "osmo1fty83rfxqs86jm5fmlql5e340e8pe0v9j8ez0lcc6zwt2amegwvsfp3gxj",
  system_discounts: "osmo1p0hvtat69dash8f0w340n2kjdkdfq0ggyp77mr426wpnfwp3tjyqq6a8vr",
  vesting: "osmo1flwr85scpcsdqa8uyh0acgxeqlg2ln8tlklzwzdn4u68n3p5wegsgspjf6",
  rangeboundLP: "osmo17rvvd6jc9javy3ytr0cjcypxs20ru22kkhrpwx7j3ym02znuz0vqa37ffx"
};

export const denoms = {
  MBRN: ["factory/osmo1s794h9rxggytja3a4pmwul53u98k06zy2qtrdvjnfuxruh7s8yjs6cyxgd/umbrn", 6],
  CDT: ["factory/osmo1s794h9rxggytja3a4pmwul53u98k06zy2qtrdvjnfuxruh7s8yjs6cyxgd/ucdt", 6],
  OSMO: ["uosmo", 6],
  //mainnet atom ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2
  ATOM: ["ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2", 6],
  //mainnet axlUSDC ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858
  "USDC.axl": ["ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858", 6],
  //mainnet "gamm/pool/1"
  atomosmo_pool: ["gamm/pool/1", 18],
  //mainnet "gamm/pool/678"
  osmousdc_pool: ["gamm/pool/678", 18],
  //Noble USDC
  USDC: ["ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4", 6],
  //Stride Atom
  stATOM: ["ibc/C140AFD542AE77BD7DCC83F13FDD8C5E5BB8C4929785E6EC2F4C636F98F17901", 6],
  //Stride Osmo
  stOSMO: ["ibc/D176154B0C63D1F9C6DCFB4F70349EBF2E2B5A87A05902F57A6AE92B863E9AEC", 6],
  //TIA
  TIA: ["ibc/D79E7D83AB399BFFF93433E54FAA480C191248FC556924A2A8351AE2638B3877", 6],
  //USDT
  USDT: ["ibc/4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB", 6],
  //WBTC.axl
  "WBTC.axl": ["ibc/D1542AA8762DB13087D8364F3EA6509FD6F009A34F00426AF9E4F9FA85CBBF1F", 8],
  //WBTC
  WBTC: ["factory/osmo1z0qrq605sjgcqpylfl4aa6s90x738j7m58wyatt0tdzflg2ha26q67k743/wbtc", 8],
  //ETH, //This is ETH.axl that Osmosis is using as canonical denom rn
  ETH: ["ibc/EA1D43981D5C9A1C4AAEA9C23BB1D4FA126BA9BC7020A25E0AE4AA841EA25DC5", 18],
  INJ: ["ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273", 18],
  DYDX: ["ibc/831F0B1BBB1D08A2B75311892876D71565478C532967545476DF4C2D7492E48C", 18],
  USDY: ["ibc/23104D411A6EB6031FA92FB75F227422B84989969E91DCAD56A535DD7FF0A373", 18]
};

export const CDT_ASSET = { base: denoms.CDT[0] as string, symbol: 'CDT', logo: '/images/cdt.svg', decimal: 6 };

export const stableSymbols = ["USDC", "USDT", "USDC.axl"];
export const stableDenoms = ["ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4", "ibc/4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB", "ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858"];
export const MAX_CDP_POSITIONS = 9;

export const LPJoinDate = new Date("2024-10-25T17:15:59.903Z");
//Position IDs of CL range testers
export const clPositions = [{
  lowerTick: -200000,
  upperTick: -190000,
  id: "9041881"
}, {
  lowerTick: -190000,
  upperTick: -180000,
  id: "9041869"
}, {
  lowerTick: -180000,
  upperTick: -170000,
  id: "9041865"
}, {
  lowerTick: -170000,
  upperTick: -160000,
  id: "9041855"
}, {
  lowerTick: -160000,
  upperTick: -150000,
  id: "9041894"
}, {
  lowerTick: -150000,
  upperTick: -140000,
  id: "9041827"
}, {
  lowerTick: -140000,
  upperTick: -130000,
  id: "9041820"
}, {
  lowerTick: -130000,
  upperTick: -120000,
  id: "9041380"
}, {
  lowerTick: -120000,
  upperTick: -110000,
  id: "9041365"
}, {
  lowerTick: -110000,
  upperTick: -100000,
  id: "9041353"
}, {
  lowerTick: -100000,
  upperTick: -90000,
  id: "9041334"
}, {
  lowerTick: -90000,
  upperTick: -80000,
  id: "9041327"
}, {
  lowerTick: -80000,
  upperTick: -70000,
  id: "9041321"
}, {
  lowerTick: -70000,
  upperTick: -60000,
  id: "9041320"
}, {
  lowerTick: -60000,
  upperTick: -50000,
  id: "9041318"
}, {
  lowerTick: -50000,
  upperTick: -40000,
  id: "9041313"
}, {
  lowerTick: -40000,
  upperTick: -30000,
  id: "9041310"
}, {
  lowerTick: -30000,
  upperTick: -20000,
  id: "9041305"
}, {
  lowerTick: -20000,
  upperTick: -10000,
  id: "9041299"
},
{
  lowerTick: -10000,
  upperTick: 100,
  id: "9041292"
},]

//all CDT pairs
export const cdtRoutes = {
  "MBRN": [
    {
      poolId: BigInt(1225),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "CDT": [],
  "OSMO": [
    {
      poolId: BigInt(1263),
      tokenOutDenom: denoms.USDC[0],
    }
  ],
  "ATOM": [
    {
      poolId: BigInt(1),
      tokenOutDenom: denoms.OSMO[0],
    },
  ],
  "USDC": [
    {
      poolId: BigInt(1268),
      tokenOutDenom: denoms.CDT[0],
    },
  ],
  "USDT": [
    {
      poolId: BigInt(1220),
      tokenOutDenom: denoms.USDC[0],
    }
  ],
  "TIA": [
    {
      poolId: BigInt(1247),
      tokenOutDenom: denoms.USDC[0],
    }
  ],
  "stTIA": [
    {
      poolId: BigInt(1428),
      tokenOutDenom: denoms.TIA[0],
    }
  ],
  "milkTIA": [
    {
      poolId: BigInt(1475),
      tokenOutDenom: denoms.TIA[0],
    }
  ],
  "stATOM": [
    {
      poolId: BigInt(1283), //1136
      tokenOutDenom: denoms.ATOM[0],
    }
  ],
  "stOSMO": [
    {
      poolId: BigInt(833),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "USDC.axl": [
    {//This is the transmuter pool
      poolId: BigInt(1212), //1223
      tokenOutDenom: denoms.USDC[0],
    }
  ],
  "WBTC.axl": [
    {
      poolId: BigInt(712),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "ETH": [ //This is ETH.axl that Osmosis is using as canonical denom rn
    {
      poolId: BigInt(704),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "WBTC": [
    {
      poolId: BigInt(1422),
      tokenOutDenom: denoms["WBTC.axl"][0],
    }
  ],
  "INJ": [
    {
      poolId: BigInt(1319),
      tokenOutDenom: denoms.USDC[0],
    }
  ],
  "AKT": [
    {
      poolId: BigInt(1093),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "LAB": [
    {
      poolId: BigInt(1655),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "DYM": [
    {
      poolId: BigInt(1449),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "ISLM": [
    {
      poolId: BigInt(1632),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "NLS": [
    {
      poolId: BigInt(1797),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "FLIX": [
    {
      poolId: BigInt(1895),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "DYDX": [
    {
      poolId: BigInt(1246),
      tokenOutDenom: denoms.USDC[0],
    }
  ],
  "stDYDX": [
    {
      poolId: BigInt(1423),
      tokenOutDenom: denoms.DYDX[0],
    }
  ],
  "UMEE": [
    {
      poolId: BigInt(1110),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "LVN": [
    {
      poolId: BigInt(1325),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "USTC": [
    {
      poolId: BigInt(560),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "JKL": [
    {
      poolId: BigInt(832),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "QSR": [
    {
      poolId: BigInt(1314),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "DVPN": [
    {
      poolId: BigInt(5),
      tokenOutDenom: denoms.OSMO[0],
    }
  ],
  "SOL": [
    {
      poolId: BigInt(1294),
      tokenOutDenom: denoms.USDC[0],
    }
  ],
  "SAGA": [
    {
      poolId: BigInt(1671),
      tokenOutDenom: denoms.USDC[0],
    }
  ],
} as swapRoutes;

// Static oracle pools for use in UI
export const STATIC_ORACLE_POOLS = [
  { pool_id: 1464, base_asset_denom: 'uosmo', quote_asset_denom: 'ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4' }, // OSMO/USDC
  { pool_id: 1943, base_asset_denom: 'factory/osmo1z6r6qdknhgsc0zeracktgpcxf43j6sekq07nw8sxduc9lg0qjjlqfu25e3/alloyed/allBTC', quote_asset_denom: 'ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4' }, // allBTC/USDc
  { pool_id: 1251, base_asset_denom: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2', quote_asset_denom: 'ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4' }, // ATOM/USDC
  // Add more static pools as needed
];
