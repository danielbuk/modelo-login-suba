// =================================================================================
// CONFIGURAÇÃO - AQUI TAMBÉM COLOCA A JAVA DE API, A MESMA DO CEREBRO
// =================================================================================
const SUPABASE_URL = 'SUA_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_SUPABASE';

// =================================================================================
// INICIALIZAÇÃO DO SUPABASE
// =================================================================================
const supabase = self.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =================================================================================
// LÓGICA DA PÁGINA PROTEGIDA
// =================================================================================

// "Pega" a div onde o conteúdo será inserido.
const conteudoDiv = document.getElementById('conteudo-protegido');

// A função 'checkUser' é chamada assim que a página termina de carregar.
const checkUser = async () => {

    // PASSO 1: VERIFICAR SE EXISTE UMA SESSÃO DE LOGIN VÁLIDA.
    const { data: { session } } = await supabase.auth.getSession();

    // Se não houver 'session', significa que o usuário não está logado.
    if (!session) {
        // Então, expulsamos ele daqui, mandando de volta para a tela de login.
        window.location.href = 'index.html';
        return; // Para a execução do resto do script.
    }

    // Se o script continuou até aqui, significa que o usuário ESTÁ LOGADO.
    console.log('Usuário autenticado:', session.user.email);

    // PASSO 2: BUSCAR O CONTEÚDO SECRETO NO SUPABASE STORAGE.
    // O 'try...catch' é uma forma de lidar com erros. O código tenta executar o que está no 'try'.
    // Se falhar, ele executa o que está no 'catch' em vez de quebrar a página.
    try {
        const { data, error } = await supabase
            .storage
            .from('NOME_DO_SEU_BUCKET') // <-- Coloque o nome do seu bucket aqui
            .download('NOME_DO_ARQUIVO.html'); // <-- Coloque o nome exato do arquivo que seu Python envia

        // Se o Supabase retornar um erro (ex: arquivo não existe, permissão negada), nós o "lançamos" para o catch.
        if (error) throw error;

        // Se tudo deu certo, o 'data' contém nosso arquivo.
        // Convertemos o arquivo para texto e o injetamos diretamente dentro da nossa div.
        conteudoDiv.innerHTML = await data.text();

    } catch (error) {
        // Se qualquer coisa no bloco 'try' falhar, este código será executado.
        conteudoDiv.innerHTML = `<p style="color:red;"><b>Erro ao carregar dados:</b> ${error.message}</p>`;
    }
};

// Chama a função que acabamos de criar.
checkUser();

// Lógica do botão de Logout
document.getElementById('logout-button').addEventListener('click', async () => {
    await supabase.auth.signOut(); // Encerra a sessão no Supabase
    window.location.href = 'index.html'; // Manda o usuário de volta para o login
});