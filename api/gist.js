export default async function handler(request, response) {
  // Pega as chaves que guardamos na Vercel
  const GIST_ID = process.env.GIST_ID;
  const GIST_TOKEN = process.env.GIST_TOKEN;

  // Configura permissões para o site conversar com a API
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Verifica se as chaves existem
  if (!GIST_ID || !GIST_TOKEN) {
    return response.status(500).json({ error: 'Erro de Configuração: Variáveis de ambiente não encontradas.' });
  }

  const gistUrl = `https://api.github.com/gists/${GIST_ID}`;

  try {
    // SE FOR PARA LER DADOS (GET)
    if (request.method === 'GET') {
      const githubRes = await fetch(gistUrl, {
        headers: { Authorization: `token ${GIST_TOKEN}` }
      });
      
      if (!githubRes.ok) throw new Error('Erro ao buscar dados no GitHub');
      const data = await githubRes.json();
      return response.status(200).json(data);
    } 
    
    // SE FOR PARA SALVAR DADOS (POST)
    else if (request.method === 'POST') {
      const body = request.body; // Recebe os dados do site
      
      const githubRes = await fetch(gistUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${GIST_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!githubRes.ok) throw new Error('Erro ao salvar dados no GitHub');
      const data = await githubRes.json();
      return response.status(200).json(data);
    }
    
    else {
        return response.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
