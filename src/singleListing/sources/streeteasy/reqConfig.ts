// Default = { cookie: "_se_t=f43ccf4e-33f7-4fb5-8aa7-dc135cee834c; zjs_user_id=null; zg_anonymous_id=%22cbcd81c9-4786-4dba-bff8-9b2f3c49149f%22; zjs_anonymous_id=%22f43ccf4e-33f7-4fb5-8aa7-dc135cee834c%22; pxcts=ff04de0f-2245-11f0-acd4-8a2d32a77ae3; _pxvid=ff04cad4-2245-11f0-acd1-895d73805b4d; _actor=eyJpZCI6Im1GQ2JuQTJLUE1LV2t4bmo1clBvdnc9PSJ9--8ba982893fb40de7795a3ab8af6d703d8fa0c0a0; g_state=; google_one_tap=0; anon_searcher_stage=search_made; srp=v2; srpUserId=2df9d6c7-d501-4dfd-976f-47444468daa4; windowWidth=1436; rentalsSort=se_score; last_search_tab=rentals; se%3Asearch%3Ashared%3Astate=100||||; se_lsa=2025-04-29+20%3A54%3A22+-0400; tracked_search=3268167; _ses=T20vVnV3czU2WHlTbndha0oyMGdPRWhUOXhhalQvNFdYaSt4U1RxVGljK0lGL2wvSXArM2ppZ0tzS205TzlLelVtOVNHR3o4bE9zc29xWDFUSnpYZ080VnY0RU5jUkwxRGNCSjdwN1BzOGdLWFpsMmVyamJyTDNraXhSbmR4UFd5TXBJZEF5NkxCaHlTYlRpZnBoYnVlRkQ3bWxvV0MrVU44Q0VyMW9mTGRnPS0teUFoU09YR2ZnTmtBREQvMWxmWWZWUT09--6dae08611dfc3483035ea8ae92f80e2c8724ba1a; windowHeight=1013" }
export const defaultCookieParams: string[] = [
  "_se_t=f43ccf4e-33f7-4fb5-8aa7-dc135cee834c",
  "zjs_user_id=null",
  "zg_anonymous_id=%22cbcd81c9-4786-4dba-bff8-9b2f3c49149f%22",
  "zjs_anonymous_id=%22f43ccf4e-33f7-4fb5-8aa7-dc135cee834c%22",
  "pxcts=ff04de0f-2245-11f0-acd4-8a2d32a77ae3",
  "_pxvid=ff04cad4-2245-11f0-acd1-895d73805b4d",
  "_actor=eyJpZCI6Im1GQ2JuQTJLUE1LV2t4bmo1clBvdnc9PSJ9--8ba982893fb40de7795a3ab8af6d703d8fa0c0a0",
  "g_state=",
  "google_one_tap=0",
  "anon_searcher_stage=search_made",
  "srp=v2",
  "srpUserId=2df9d6c7-d501-4dfd-976f-47444468daa4",
  "windowWidth=1436",
  "rentalsSort=se_score",
  "last_search_tab=rentals",
  "se%3Asearch%3Ashared%3Astate=100||||",
  "se_lsa=2025-04-29+20%3A54%3A22+-0400",
  "tracked_search=3268167",
  "_ses=T20vVnV3czU2WHlTbndha0oyMGdPRWhUOXhhalQvNFdYaSt4U1RxVGljK0lGL2wvSXArM2ppZ0tzS205TzlLelVtOVNHR3o4bE9zc29xWDFUSnpYZ080VnY0RU5jUkwxRGNCSjdwN1BzOGdLWFpsMmVyamJyTDNraXhSbmR4UFd5TXBJZEF5NkxCaHlTYlRpZnBoYnVlRkQ3bWxvV0MrVU44Q0VyMW9mTGRnPS0teUFoU09YR2ZnTmtBREQvMWxmWWZWUT09--6dae08611dfc3483035ea8ae92f80e2c8724ba1a",
  "windowHeight=1013",
];

export const defaultHeaders: RequestInit["headers"] = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.8",
  "cache-control": "no-cache",
  pragma: "no-cache",
  priority: "u=0, i",
  "sec-ch-ua": '"Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "sec-gpc": "1",
  "upgrade-insecure-requests": "1",
};

type SlHeaders = NonNullable<RequestInit["headers"]> & { cookie: string };

export const buildHeaders = (cookieParams: string[] = defaultCookieParams): SlHeaders => {
  const cookieStr = cookieParams.join("; ");
  return { ...defaultHeaders, cookie: cookieStr };
};

export const defaultReqConfig: RequestInit = {
  referrerPolicy: "strict-origin-when-cross-origin",
  body: null,
  method: "GET",
};

export const buildReqConfig = (
  cookieParams: string[] = defaultCookieParams
): RequestInit & { headers: SlHeaders } => {
  return { ...defaultReqConfig, headers: buildHeaders(cookieParams) };
};
