import dotenv from 'dotenv';

dotenv.config({
  path: process.env.ENV_FILE || '.env.dev',
});

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Variável de ambiente obrigatória "${name}" não foi definida. ` +
        `Verifique o arquivo apontado por ENV_FILE (atual: ${
          process.env.ENV_FILE || '.env.dev'
        }) ou configure a variável diretamente no ambiente de execução (ex: secrets do CI).`
    );
  }

  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  apiUrl: required('API_URL'),
  username: required('SAUCE_USERNAME'),
  password: required('SAUCE_PASSWORD'),
};
