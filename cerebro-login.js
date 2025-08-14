// =================================================================================
// CONFIGURAÇÃO - COLOQUE SUAS CHAVES DO SUPABASE AQUI
// =================================================================================
const SUPABASE_URL = 'SUA_URL_SUPABASE'; // Encontrado em: Project Settings > API > Project URL
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_SUPABASE'; // Encontrado em: Project Settings > API > Project API Keys > anon public

// =================================================================================
// INICIALIZAÇÃO DO SUPABASE
// =================================================================================
// Esta linha cria a conexão com o seu projeto Supabase usando as chaves acima.
const supabase = self.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =================================================================================
// LÓGICA DO FORMULÁRIO DE LOGIN
// =================================================================================

// Aqui, o JavaScript "pega" os elementos do HTML para poder interagir com eles.
const loginForm = document.getElementById('login-form'); // Pega o formulário de login
const messageDiv = document.getElementById('message');   // Pega a div de mensagens

// Adiciona um "ouvinte" ao formulário, que espera o usuário clicar no botão "submit" (Entrar).
loginForm.addEventListener('submit', async (event) => {

    // Impede que a página recarregue, que é o comportamento padrão de um formulário.
    event.preventDefault();

    // Pega os valores que o usuário digitou nos campos de email e senha.
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Mostra uma mensagem para o usuário saber que algo está acontecendo.
    messageDiv.textContent = 'Autenticando...';
    messageDiv.style.color = 'black';

    // Esta é a função principal: ela envia o email e a senha para o Supabase para tentar fazer o login.
    // O 'await' faz o código esperar a resposta do Supabase antes de continuar.
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    // Após o Supabase responder, verificamos se deu erro.
    if (error) {
        // Se deu erro, mostra a mensagem de erro para o usuário.
        messageDiv.textContent = `Falha no login: ${error.message}`;
        messageDiv.style.color = 'red';
    } else {
        // Se não deu erro, o login foi um sucesso! Redirecionamos o usuário para a página protegida.
        window.location.href = 'dashboard.html';
    }
});