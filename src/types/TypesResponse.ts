export interface CheckCpfResponseType{
  message: string;
  completeCadastro: boolean;
}
export interface AuthResponseType {
  token?: string;
  expiresIn?: number;
  message?: string;
  completeCadastro?: boolean;
}
export enum Rotas {
  loginPass = "/loginpass",
  completecad = "/completecad",
  login = "/login",
  cadcompleto = "/cadcompleto",
  home = "/",
  cadastrar = "/cadastrar"
}