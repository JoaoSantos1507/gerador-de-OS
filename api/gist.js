export default async function handler(request, response) {
  const GIST_ID = process.env.GIST_ID;
  const GIST_TOKEN = process.env.GIST_TOKEN;

  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (!GIST_ID || !GIST_TOKEN) {
    return response.status(500).json({ error: 'Erro de Configuração: Variáveis não encontradas na Vercel.' });
  }

  const gistUrl = `https://api.github.com/gists/${GIST_ID}`;

  try {
    if (request.method === 'GET') {
      const githubRes = await fetch(gistUrl, {
        headers: { Authorization: `token ${GIST_TOKEN}` }
      });
      if (!githubRes.ok) throw new Error('Erro ao ler do GitHub');
      const data = await githubRes.json();
      return response.status(200).json(data);
    } 
    else if (request.method === 'POST') {
      const githubRes = await fetch(gistUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${GIST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.body),
      });
      if (!githubRes.ok) throw new Error('Erro ao salvar no GitHub');
      const data = await githubRes.json();
      return response.status(200).json(data);
    }
    else {
        return response.status(405).json({ error: 'Método inválido' });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
