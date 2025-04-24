document.getElementById("cadastroForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    alert("E-mail inválido!");
    return;
  }

  const form = e.target;

  const tipoSubestacao = [];
  form.querySelectorAll("input[name='tipo_subestacao']:checked").forEach(cb => {
    tipoSubestacao.push(cb.value);
  });

  const formaPagamento = [];
  form.querySelectorAll("input[name='forma_pagamento']:checked").forEach(cb => {
    formaPagamento.push(cb.value);
  });

  const dadosFormulario = {
    nome_empresa: form.nome_empresa.value,
    cpf_cnpj: form.cpf_cnpj.value,
    telefone: form.telefone.value,
    cep: form.cep.value,
    endereco: form.endereco.value,
    cidade: form.cidade.value,
    uf: form.uf.value,
    email: form.email.value,
    concessionaria: form.concessionaria.value,
    unidade_consumidora: form.unidade_consumidora.value,
    potencia: form.potencia.value,
    tensao_rede: form.tensao_rede.value,
    tensao_secundaria: form.tensao_secundaria.value,
    tipo_subestacao: tipoSubestacao,
    forma_pagamento: formaPagamento
  };

  console.log("📦 Enviando:", dadosFormulario); // Verifica o que está indo

  try {
    const response = await fetch("https://agilhomolog.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosFormulario)
    });

    if (response.ok) {
      alert("Cadastro realizado com sucesso!");
      form.reset();
    } else {
      const erro = await response.json();
      alert("Erro ao cadastrar: " + erro.message);
    }
  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor.");
  }
});

// Integração com os Correios (ViaCEP)
document.getElementById("cep").addEventListener("blur", function () {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      if (!data.erro) {
        document.getElementById("endereco").value = data.logradouro;
        document.getElementById("cidade").value = data.localidade;
        document.getElementById("uf").value = data.uf;
        document.getElementById("concessionaria").value =
          data.uf === 'PE' ? 'Neoenergia Pernambuco' : '';
      } else {
        alert("CEP não encontrado.");
      }
    })
    .catch(() => alert("Erro ao buscar o CEP."));
});
