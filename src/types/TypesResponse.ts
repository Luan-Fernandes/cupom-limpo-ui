export interface CheckCpfResponseType {
  message: string;
  completeCadastro: boolean;
}

export interface AuthResponseType {
  token?: string;
  expiresIn?: number;
  message?: string;
  completeCadastro?: boolean;
}

export interface NotaFiscal {
  id: string;
  xml: string;
  dateEmissao: string;
  value: number;
  noteNumber: string;
  corporateReason: string;
  fantasyName: string;
  userId: string;
  chaveDeAcesso: string;
}

export interface DadosPorFantasia {
  [fantasyName: string]: NotaFiscal[];
}

export interface ApiResponse {
  data: DadosPorFantasia;
  total: number;
}

export enum Rotas {
  loginPass = "/loginpass",
  completecad = "/completecad",
  login = "/login",
  cadcompleto = "/cadcompleto",
  home = "/",
  cadastrar = "/cadastrar",
  minhasNotas = "/minhas-notas",
  estabelecimentos = "/estabelecimentos",
  redefinirSenha = "/redefinir-senha"
}
