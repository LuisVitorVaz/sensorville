  // Ativar clique na área de drop
  // Clique ativa o seletor de arquivo
// Clique ativa o seletor de arquivo
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contatoForm');
  const dropArea = document.getElementById('dropArea');
  const fileInput = document.getElementById('imagem');
  const erroDiv = document.getElementById('erroMensagem');
  const nomeArquivo = document.getElementById('nomeArquivo');
  const dropMensagem = document.getElementById('dropMensagem');
  const contadorMensagem = document.getElementById('contadorMensagem');

  mensagem.maxLength = 100; // define limite máximo nativo, para segurança

mensagem.addEventListener('input', () => {
  let texto = mensagem.value;

  if (texto.length > 100) {
    mensagem.value = texto.substring(0, 100); // corta o excesso
  }

  contadorMensagem.textContent = `${mensagem.value.length}/100`;
});

  // Clique ativa o seletor de arquivo
  dropArea.addEventListener('click', () => fileInput.click());

  // Drag & drop
  dropArea.addEventListener('dragover', e => {
    e.preventDefault();
    dropArea.style.backgroundColor = '#eef';
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.style.backgroundColor = 'transparent';
  });

  dropArea.addEventListener('drop', e => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      atualizarNomeArquivo();
    }
    dropArea.style.backgroundColor = 'transparent';
  });

  fileInput.addEventListener('change', atualizarNomeArquivo);

  function atualizarNomeArquivo() {
    if (fileInput.files.length > 0) {
      const nome = fileInput.files[0].name;
      nomeArquivo.textContent = `* ${nome}`;
      dropMensagem.style.display = 'none';
    } else {
      nomeArquivo.textContent = '';
      dropMensagem.style.display = 'inline';
    }
  }

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(form); // pega automaticamente todos os campos do formulário, inclusive o arquivo

  erroDiv.style.display = 'none';

  try {
    const response = await fetch('http://localhost:8000', {
      method: 'POST',
      body: formData, // Envio como multipart/form-data
    });

    if (response.ok) {
      alert('Formulário enviado com sucesso!');
      form.reset();
      nomeArquivo.textContent = '';
      dropMensagem.style.display = 'inline';
    } else if (response.status === 409) {
      const msg = await response.text();
      alert(`Erro: ${msg}`);
      erroDiv.innerText = `* ${msg} Digite novamente.`;
      erroDiv.style.display = 'block';
      form.reset();
      nomeArquivo.textContent = '';
      dropMensagem.style.display = 'inline';
    } else {
      alert('Erro ao enviar o formulário.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro na conexão com o servidor.');
  }
  });
});

// referencias de pesquisas 
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
// https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Structuring_content/HTML_images