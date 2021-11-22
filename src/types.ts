export type ClientOptions = {
  host?: string | undefined;
  path?: string | undefined;
  port?: number | undefined;
  url?: string | undefined;
  cookies?: boolean | undefined;
  headers?: { [header: string]: string } | undefined;
  basic_auth?: { user: string, pass: string } | undefined;
  method?: string | undefined;
}

export type PossibleErrorResponse = {
  error?: string,
}

export type Hash = PossibleErrorResponse & {
  hash_key: string,
  session_id: string,
}

export type RepliesFiltter = {
  car_id?: number,
  date_from?: string,
  date_to?: string,
}

// export type CarData = {
//   address: string,
//   airbag: [],
//   aircondition: [],
//   attractive_offer: boolean,
//   beds: [],
//   body_id: [];
// }