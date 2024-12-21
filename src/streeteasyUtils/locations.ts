import { z } from "zod";
import { zNumeric, type Numeric } from "../utils/zod";

export const SeLocations = z.enum([
  "Hoboken",
  "Civic Center",
  "Financial District",
  "Tribeca",
  "Stuyvesant Town/PCV",
  "Soho",
  "Little Italy",
  "Lower East Side",
  "Chinatown",
  "Two Bridges",
  "Battery Park City",
  "Gramercy Park",
  "Fulton/Seaport",
  "Chelsea",
  "Greenwich Village",
  "East Village",
  "Noho",
  "Midtown",
  "Central Park South",
  "Midtown South",
  "Midtown East",
  "Midtown West",
  "Murray Hill",
  "Beekman",
  "Lincoln Square",
  "Hudson Yards",
  "Hell's Kitchen",
  "West Village",
  "Flatiron",
  "NoMad",
  "Nolita",
  "West Chelsea",
  "Hudson Square",
]);
export type SeLocations = z.infer<typeof SeLocations>;
export type ILocation = {
  id: Numeric;
  name: SeLocations;
  level: number;
  parent_id: number;
  map_coordinates: {
    encoded_boundary: string;
    __typename: "AreaGeometry";
  };
  __typename: "Area";
};
export const locations: { [key in SeLocations]: ILocation } = {
  Hoboken: {
    id: "1004000",
    name: "Hoboken",
    level: 2,
    parent_id: 1000000,
    map_coordinates: {
      encoded_boundary:
        "k}vwFh}zbM}LqEiA}@m@_A{@uCSuCL}BtAqJd@eJGcGlAP[`EbDl@TiBbDt@bBiQ~AZB_AgFiA\\gC`Cf@zAiObARwAjO`Cd@tBuR`@D}ApNhCd@zAsN\\DuApNJEB~@r@KJk@v@VvAqN`@HsApM~A\\rA}MRB}AhOdA\\L]xAyNVD}AzOd@HhAsKb@H{@rId@LDe@KABQbDr@N?HAHWRcCLaAFUFELAl@Hb@RHP?TQnAAz@Bb@JPLBXHH?v@_@X}BOAJqAPB^uDNBu@lHFGn@UBXZOl@qGVFg@dFLLf@Sb@wEPB_@jDNRb@S^@h@AdAFb@KH?EgAM@AQj@E@PO?DhAT?XBtCt@ZNVPb@h@v@`@Ir@bATCTvAXQjBfDr@CNKAAH@LBFF@lDt@DLIr@VD@BA@A@?@@@TTJX^dAv@PLBN{AO_@L]LSVaCNDSnBPILA\\AF@THNJJFLL@DALBHBHBJBH?J?HAJCFCHCDEBGF?BDHBDDDHB@?JBJFFJFR?P@BNDjJlBvAoNrDv@wAhN`AR@ERDB?FQFWDWp@cGh@P@G@AB?B@@D?@THAHD@@IBC??B?@@?@@BA@@B?B?@@@@E@?NHADB@BI@?@?@?@?@@?@?B?@???D?B@@@E@?LHADDBBI??@AB?@??@@@?B??@@?DAD@?BG??NJDB?A@AB?@??@@@?D@BJ[BBQ`@DBH@La@ECJ[CCFQBBDMLJWx@EAMb@JJCFB@AHDB@ED@AFJH?@LFADB@NADB@BCv@C^@DDFB@V?LO?C`@aK`@D{@lTf@~COx@qBrK]dBm@dDsBtKkAhG{AfI???B?@N@AFCX?@GdASzAR`C?@Bh@@F?BBVBVDj@@L@PBR@P@PBP@P@PBP@L?B?BBZe@zCCF_BFq@x@?@q@v@_@b@Y\\KJYV{Am@eCAq@@y@BK?mA?_@UU]EGqAg@m@o@a@o@MUCGMUCEKSCECGEGGIGGICGEIAE?A???C?C?C?iBRkANo@EWAUCWEWEUIWISKSMSMSOQQQQIGIGIEKHGOI?A?QA_@CGC?AACCEAACCCAKGKGAAA?????OMOKA??AA?AA?AA????AA??AKIKMUUa@c@WUc@_@a@_@UQUOSOa@Wc@Wc@UYOe@Qg@Qg@OSIWMSMGECCUOGGEC}@s@}By@YKOEiAa@}Aw@a@WIGADqAq@sYyN",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },

  "Civic Center": {
    id: "103",
    name: "Civic Center",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary:
        "cqnwF|uubMl@c@Rk@Bu@uBwL[eA~OiTqFqDyMaN_@t@}DnK{B@[F_@t@qDeCgAk@mArDeAtCjBjBcAjCpB`B~@qCvB|AiCjH~HlGfCeHfBpAkCfHnLnJ",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },

  "Financial District": {
    id: "104",
    name: "Financial District",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary:
        "_enwFh_wbMp_@bKvAhBbAxFjE_AjHmFlCmDjBcEzAmEZ{B{BqO_BoHfBiBcEsKoQy[sGxHrG{H{GoMcFdG{EaKe[~b@ZhArBbLC`AOh@i@b@vBbBoClHqI~UhVxD",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },

  Tribeca: {
    id: "105",
    name: "Tribeca",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary:
        "ijqwFlbwbMlm@rInAaZb\\vFvIeVdCoHyBcBoLoJjCiHgBoAgCdH_ImGl@eBzAgEwB{A_AnCqB}AbAeCoIaIim@|_A{AbZ",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },

  "Stuyvesant Town/PCV": {
    id: "106",
    name: "Stuyvesant Town/PCV",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary: "}irwFbvpbMx\\}eAaHc@uE?mDnAwCjE{BrB{Bp@cDd@aL`AwApEyHxUra@jX",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },

  Soho: {
    id: "107",
    name: "Soho",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary:
        "}{qwF|evbMpGLwAbYxJz@lAgYzUi_@~Vo`@wC}BoRiPgFaBmI}FgAhHcH~QaHnQm@bNa@tJaAfU",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },

  "Little Italy": {
    id: "108",
    name: "Little Italy",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary: "y}owFfbtbMr@aCj@XtAeFpExBb@aBoE_CtCeMqEkB}EaB_IxV|JnI",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },

  "Lower East Side": {
    id: "109",
    name: "Lower East Side",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary:
        "gyowFfbsbMfFbCzImb@pD`Bv@D|@M|B`n@m@p@h@lBf@}@bMdMhGjEzIgMkC_J_Git@bFk@uD{u@uAgLqCgFsCoCq[gLkNgCkClXwBlHkY`vA`\\~IlEdA",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  Chinatown: {
    id: "110",
    name: "Chinatown",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary:
        "k{nwFjvsbMl@q@{Bym@wB?uD_B_Jnb@uCdMpE~Bc@`BqE}BuAhFm@[s@~BzJpIrCcIbAd@tDdC^u@ZGxBA|DiKo@kB",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },

  "Two Bridges": {
    id: "111",
    name: "Two Bridges",
    level: 4,
    parent_id: 109,
    map_coordinates: {
      encoded_boundary:
        "yxnwFzwsbMi@|@i@oBn@q@GqAgEcjAvBQTOr@?~Iu@hGa@bBtYbE`h@|@dKfA~DbA~C{IdMkGkE{CaDeHaH",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },

  "Battery Park City": {
    id: "112",
    name: "Battery Park City",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary: "gxowFzqvbMmBlZzf@hFx^fFlGv@bGoAzBkC[}Ca@aB{AeBm_@aLyRqC{Bg@yGkA}QmC",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Gramercy Park": {
    id: "113",
    name: "Gramercy Park",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary: "gcswFndrbMbE]dRml@qa@gXmOze@eCdIz\\pU",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Fulton/Seaport": {
    id: "114",
    name: "Fulton/Seaport",
    level: 4,
    parent_id: 104,
    map_coordinates: {
      encoded_boundary: "q`mwFhptbMyGoMcFfG{EcKcJnMaPlTZhArBfLC`AOh@i@`@hItGnIgMhDeGnEgEdFuFrG{H",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  Chelsea: {
    id: "115",
    name: "Chelsea",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary: "q_vwFtkvbMnm@hGbAyXf^yiAy|@kl@gr@~xBd`@tN",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Greenwich Village": {
    id: "116",
    name: "Greenwich Village",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary:
        "_wswFbatbMpKzGdN_H~AYzObKhGtCvFpBfQud@fAyG`EaPuUwGqBKyHwAgCs@mCWiOqBiBJkQzj@oFtP",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "East Village": {
    id: "117",
    name: "East Village",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary: "yyrwFdcrbMhOpBlCVfCr@xHvApBJtUvGdYwuA|BsHjCoXkO_DiMoB_RqB_]`fAeRll@hBK",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  Noho: {
    id: "118",
    name: "Noho",
    level: 4,
    parent_id: 116,
    map_coordinates: {
      encoded_boundary: "gerwFlsrbMlCiIxHvApBJxUxGeEfPgApGe_@mZ",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  Midtown: {
    id: "120",
    name: "Midtown",
    level: 3,
    parent_id: 119,
    map_coordinates: {
      encoded_boundary:
        "sgvwFrmobM{S`q@vF`EyMfb@sfA}r@{@c@FaBd@?`N{b@THn@cCMKTgA|@l@jCsIcCaBtKs]hWhQhj@r^",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Central Park South": {
    id: "121",
    name: "Central Park South",
    level: 3,
    parent_id: 119,
    map_coordinates: {
      encoded_boundary: "}lywFrppbMh@?zMsb@PJz@gCUKZaAz@d@jCuI_C}AmUps@XXP^",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Midtown South": {
    id: "122",
    name: "Midtown South",
    level: 3,
    parent_id: 119,
    map_coordinates: {
      encoded_boundary: "a|twFxlpbMyJ_HwGrSm^yUkKh]tFzD{M`b@df@|[|Mwb@{BmAhTyq@",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Midtown East": {
    id: "123",
    name: "Midtown East",
    level: 3,
    parent_id: 119,
    map_coordinates: {
      encoded_boundary:
        "kquwF~wmbM`IjFlH~HlJpFlWzClSRjDtCJ`Cc\\pcA}i@}^uGrSo^}UlG{Rij@u^uVaQ|W{z@rNxJdFdH~SzQnSbO",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Midtown West": {
    id: "124",
    name: "Midtown West",
    level: 3,
    parent_id: 119,
    map_coordinates: {
      encoded_boundary: "uvywFxcqbMkVnv@sAp@wDrMn{AneA~WfInc@{uAwmBkoAmFtPaC{A",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Murray Hill": {
    id: "130",
    name: "Murray Hill",
    level: 4,
    parent_id: 123,
    map_coordinates: {
      encoded_boundary: "kquwF~wmbM`IjFlH|HjJrFc]lfAo^}Uv]mhA",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  Beekman: {
    id: "134",
    name: "Beekman",
    level: 5,
    parent_id: 132,
    map_coordinates: {
      encoded_boundary: "{nvwFztmbMsR_MrFyPjQnOkEhN",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Lincoln Square": {
    id: "136",
    name: "Lincoln Square",
    level: 4,
    parent_id: 137,
    map_coordinates: {
      encoded_boundary: "{mzwFf{rbMjVkv@zBzAhFmPu@i@BkBQc@UUc@Ee@F[Zy[oSiSsMud@~xAvp@|c@rD{MzAm@",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Hudson Yards": {
    id: "146",
    name: "Hudson Yards",
    level: 4,
    parent_id: 124,
    map_coordinates: {
      encoded_boundary: "gnwwFbvrbMUXMXo]bjA|RbN~WfInc@{uA_j@g^yE~N",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Hell's Kitchen": {
    id: "152",
    name: "Hell's Kitchen",
    level: 4,
    parent_id: 124,
    map_coordinates: {
      encoded_boundary: "uvywFzcqbMkVlv@sAr@wDpMngAhv@n]cjANYRWHOnEoNsbAcp@mFtPcCyA",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "West Village": {
    id: "157",
    name: "West Village",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary: "{ptwF`tvbMt@yXRaAd@y@bN{b@fFkPpKzGdN_H~AY|ObKfGtCvFpBqCbp@tFRaAhYsyAqK",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  Flatiron: {
    id: "158",
    name: "Flatiron",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary: "c}rwFpcrbMcE\\{\\qUdCeI{F{DqNkJ{B{AyByAiTxq@zBlA~BzAhNfJti@f^jQ{j@",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  NoMad: {
    id: "159",
    name: "NoMad",
    level: 4,
    parent_id: 158,
    map_coordinates: {
      encoded_boundary: "ydtwFz}pbMmRgMyByAiTxq@dVrOvGqSyBsA~BkHvBxAtGsS",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  Nolita: {
    id: "162",
    name: "Nolita",
    level: 3,
    parent_id: 102,
    map_coordinates: {
      encoded_boundary: "{bqwFvesbMjChBrD`DrF|AnFvE~HyVkDeAwV}G_EzO",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "West Chelsea": {
    id: "163",
    name: "West Chelsea",
    level: 4,
    parent_id: 115,
    map_coordinates: {
      encoded_boundary: "wetwFpdubMi}@il@{[`dAl`@lNnm@hGbAyXbHuT",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
  "Hudson Square": {
    id: "166",
    name: "Hudson Square",
    level: 4,
    parent_id: 107,
    map_coordinates: {
      encoded_boundary: "}{qwF|evbMpGNwA`YxJ|@lAiYzUg_@dAkBi@BwAWsE{AuJsCsH_CeCu@kCw@oAxYaAdU",
      __typename: "AreaGeometry",
    },
    __typename: "Area",
  },
};
/** (Streeteasy) Get/Lookup location info by numeric id */
export const lookupLocationByIdSe = (numericLocationId: Numeric) => {
  const locationId = zNumeric.safeParse(numericLocationId);
  if (!locationId.data) return null;

  return locations[locationId.data];
};
