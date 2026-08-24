const fs = require("fs");
const http = require("http");
const path = require('path');

const caminhoID = path.join(__dirname, "data", "usuarios.json");
const textoID = fs.readFileSync(caminhoID, "utf-8");
const usuarios= JSON.parse(textoID);

const caminhoPRO = path.join(__dirname, "data", "protocolos.json");
const textoPRO = fs.readFileSync(caminhoPRO, "utf-8");
const protocolos = JSON.parse(textoPRO);

const caminhoMEN = path.join(__dirname, "data", "mensagens.json");
const textoMEN = fs.readFileSync(caminhoMEN, "utf-8");
const mensagens = JSON.parse(textoMEN);

console.log(`✅ Usuários: ${usuarios.length}`);
console.log(`✅ Protocolos: ${protocolos.length}`);
console.log(`✅ Mensagens: ${mensagens.length}`);
console.log('🚀 Servidor pronto!');

//PAGINAÇÃO
function paginar(dados, pagina = 1, limite = 10) {
   pagina = parseInt(pagina) || 1;
   limite = parseInt(limite) || 10;
   
   if (pagina < 1) pagina = 1;
   if (limite < 1) limite = 10;
   if (limite > 100) limite = 100;
   
   const inicio = (pagina - 1) * limite;
   const fim = inicio + limite;
   const total = dados.length;
   const totalPaginas = Math.ceil(total / limite);
   
   return {
      dados: dados.slice(inicio, fim),
      paginacao: {
         paginaAtual: pagina,
         limite: limite,
         total: total,
         totalPaginas: totalPaginas,
         proximaPagina: pagina < totalPaginas ? pagina + 1 : null,
         paginaAnterior: pagina > 1 ? pagina - 1 : null
      }
   };
}
//EXTRAIR PARAMETROS
function extrairQueryParams(url) {
   const params = {};
   const partes = url.split('?');
   
   if (partes.length > 1) {
      const queryString = partes[1];
      const pares = queryString.split('&');
      
      pares.forEach(par => {
         const [chave, valor] = par.split('=');
         if (chave && valor) {
            params[chave] = decodeURIComponent(valor);
         }
      });
   }
   
   return params;
}

const servidor = http.createServer((pedido, resposta)=>{
   const caminho = pedido.url.split('?')[0];
   const queryParams = extrairQueryParams(pedido.url);
   console.log("Tem um pedido: " + caminho);
   console.log("Parâmetros: ", queryParams);   
   
   function enviarJSON(dados, status = 200) {
      resposta.setHeader('Content-Type', 'application/json; charset=utf-8');
      resposta.setHeader('Access-Control-Allow-Origin', '*');
      resposta.statusCode = status;
      resposta.end(JSON.stringify(dados, null, 2));
   }

   function enviarErro(mensagem, status = 400) {
      resposta.setHeader('Content-Type', 'text/plain; charset=utf-8');
      resposta.setHeader('Access-Control-Allow-Origin', '*');
      resposta.statusCode = status;
      resposta.end(mensagem);
   }

//TESTE DA PAGINAÇÃO
/*
   if (caminho === "/teste-paginacao") {
      const dadosTeste = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
      const paginas = queryParams.page || 1;
      const limite = queryParams.limit || 5;
      const resultado = paginar(dadosTeste, paginas, limite);
      enviarJSON(resultado);
      return;
   }
*/

//teste usuarios
   if(caminho ==="/usuarios"){
      let resultado = [...usuarios];

      if (queryParams.nome) {
      const nomeBusca = queryParams.nome.toLowerCase();
      resultado = resultado.filter(controle => 
         controle.nome && controle.nome.toLowerCase() === nomeBusca
      );
   }

    if (queryParams.email) {
      const emailBusca = queryParams.email.toLowerCase();
      resultado = resultado.filter(controle => 
         controle.email && controle.email.toLowerCase().includes(emailBusca)
      );
   }

   if (resultado.length === 0 && (queryParams.nome || queryParams.email)) {
      enviarErro("Erro 404 - Nenhum usuário encontrado com os critérios informados", 404);
      return;
   }
   
   const page = queryParams.page || 1;
   const limit = queryParams.limit || 10;
   const resultadoPaginado = paginar(resultado, page, limit);
   
   enviarJSON(resultadoPaginado);

   }else if(caminho.startsWith("/usuarios/")){
      const idEmTexto = caminho.replace("/usuarios/", "");

      if(idEmTexto == ""){
         enviarJSON(usuarios);
      }else{
         if(idEmTexto.includes("/")){
            enviarErro("Erro 404 - rota não encontrada", 404);
         }else{
            const idEmNum = Number(idEmTexto);
            if(Number.isNaN(idEmNum)||idEmNum<0){
            enviarErro("Erro 400 - falha no parâmetro de busca", 400);
         }else{
            const usuarioID = usuarios.find((controle)=> controle.id === idEmNum);
            if(usuarioID){
               enviarJSON(usuarioID);
            }else{
               enviarErro("Erro 404 - usuário não encontrado", 404);
            }
         }
      }
   }
//teste protocolos
   }else if(caminho ==="/protocolos"){
      let resultado = [...protocolos];

   if (queryParams.usuario_id) {
      const id = parseInt(queryParams.usuario_id);
      if (!isNaN(id) && id >= 0) {
         resultado = resultado.filter(controle => controle.usuario_id === id);
      }
   }

   if (queryParams.status) {
      const statusBusca = queryParams.status.toLowerCase();
      resultado = resultado.filter(controle => 
         controle.status && controle.status.toLowerCase() === statusBusca
      );
   }

   if (queryParams.tipo) {
      const tipoBusca = queryParams.tipo.toLowerCase();
      resultado = resultado.filter(controle => 
         controle.tipo && controle.tipo.toLowerCase() === tipoBusca
      );
   }

   if (queryParams.canal) {
      const canalBusca = queryParams.canal.toLowerCase();
      resultado = resultado.filter(controle => 
         controle.canal && controle.canal.toLowerCase() === canalBusca
      );
   }

   const temFiltroProtocolo = queryParams.usuario_id || queryParams.status || queryParams.tipo || queryParams.canal;
   if (resultado.length === 0 && temFiltroProtocolo) {
      enviarErro("Erro 404 - Nenhum protocolo encontrado com os critérios informados", 404);
      return;
   }

   const page = queryParams.page || 1;
   const limit = queryParams.limit || 10;
   const resultadoPaginado = paginar(resultado, page, limit);
   
   enviarJSON(resultadoPaginado);

//teste do id entre o protocolos e mensagens
   }else if(caminho.startsWith("/protocolos/") && caminho.endsWith("/mensagens")){
      const removerINICIO = caminho.replace("/protocolos/", "");
      
      const removerFINAL = removerINICIO.replace("/mensagens", "");
      const sobra = Number(removerFINAL);
      if(Number.isNaN(sobra)||sobra<0){
         enviarErro("Erro 400 - falha no parâmetro de busca", 400);
      }else{
         const protoEXISTE = protocolos.find((controle)=> controle.id === sobra);
         if(!protoEXISTE){
            enviarErro("Erro 404 - protocolo não encontrado", 404);
         }else{
            const consulta = mensagens.filter((controle)=> controle.protocolo_id === sobra);
            enviarJSON(consulta);
         }
      }

   }else if(caminho.startsWith("/protocolos/")){
      const proEmTexto = caminho.replace("/protocolos/", "");
      if(proEmTexto == ""){
         enviarJSON(protocolos);
      }else if(proEmTexto.includes("/")){
         enviarErro("Erro 404 - rota não encontrada", 404);
      }else{
         const proEmNum = Number(proEmTexto);           
            if(Number.isNaN(proEmNum)||proEmNum<0){
               enviarErro("Erro 400 - falha no parâmetro de busca", 400);
            }else{
               const proPorId = protocolos.find((controle)=> controle.id === proEmNum);
               if(proPorId){
                  enviarJSON(proPorId);
               }else{
                  enviarErro("Erro 404 - protocolo não encontrado", 404);
               }
            }
         }
      

//teste mensagens
   }else if(caminho==="/mensagens"){
      let resultado = [...mensagens];

   if (queryParams.protocolo_id) {
      const id = parseInt(queryParams.protocolo_id);
      if (!isNaN(id) && id >= 0) {
         resultado = resultado.filter(controle => controle.protocolo_id === id);
      }
   }

   if (queryParams.usuario_id) {
      const id = parseInt(queryParams.usuario_id);
      if (!isNaN(id) && id >= 0) {
         resultado = resultado.filter(controle => controle.usuario_id === id);
      }
   }

   if (queryParams.direcao) {
      const direcaoBusca = queryParams.direcao.toLowerCase();
      resultado = resultado.filter(controle => 
         controle.direcao && controle.direcao.toLowerCase() === direcaoBusca
      );
   }

   if (queryParams.status) {
      const statusBusca = queryParams.status.toLowerCase();
      resultado = resultado.filter(controle => 
         controle.status && controle.status.toLowerCase() === statusBusca
      );
   }

   if (queryParams.canal) {
      const canalBusca = queryParams.canal.toLowerCase();
      resultado = resultado.filter(controle => 
         controle.canal && controle.canal.toLowerCase() === canalBusca
      );
   }

   const temFiltroMensagem = queryParams.protocolo_id || queryParams.usuario_id || queryParams.direcao || queryParams.status || queryParams.canal;
   if (resultado.length === 0 && temFiltroMensagem) {
      enviarErro("Erro 404 - Nenhuma mensagem encontrada com os critérios informados", 404);
      return;
   }

   const page = queryParams.page || 1;
   const limit = queryParams.limit || 10;
   const resultadoPaginado = paginar(resultado, page, limit);
   
   enviarJSON(resultadoPaginado);
   
   }else if(caminho.startsWith("/mensagens/")){
      const msgEmTexto = caminho.replace("/mensagens/", "");
      if(msgEmTexto == ""){
         enviarJSON(mensagens);
      }else if(msgEmTexto.includes("/")){
         enviarErro("Erro 404 - rota não encontrada", 404);
      }else{
         const msgEmNum = Number(msgEmTexto);
         if(Number.isNaN(msgEmNum)||msgEmNum<0){
            enviarErro("Erro 400 - falha no parâmetro de busca", 400);
         }else{
            const msgPorID = mensagens.find((controle)=> controle.id === msgEmNum);
            if(msgPorID){
               enviarJSON(msgPorID);
            }else{
               enviarErro("Erro 404 - mensagem não encontrada", 404);
            }
         
         }
      
      }
      
   }else if(caminho ==="/relatorios/resumo"){
      const custoTotal = (mensagens.reduce((acumulador, controle)=> acumulador + controle.custo, 0).toFixed(2));

      const custoPorCanal = mensagens.reduce((acumulador, controle)=>{ 
         acumulador[controle.canal] = (acumulador[controle.canal]||0) + controle.custo;
         return acumulador;
   },{});

      const mensagensPorStatus = mensagens.reduce((acumulador, controle)=>{
         acumulador[controle.status] = (acumulador[controle.status] ||0) + 1;
         return acumulador;
   },{});

      const qntErro = mensagens.filter((controle)=> controle.status==="erro");
      const qntTotalMSG = mensagens.length;
      const taxaDeErroTotal = ((qntErro.length / qntTotalMSG)*100).toFixed(2);

      const qntEnviadas = mensagens.filter((controle)=> controle.direcao === "enviada");
      const qntErroEnviadas = mensagens.filter((controle)=> controle.direcao === "enviada").filter((controle)=> controle.status === "erro");
      const taxaDeErroEnviadas = ((qntErroEnviadas.length / qntEnviadas.length)*100).toFixed(2);

      const canais = [...new Set(mensagens.map(controle => controle.canal))];
      const taxaDeErroPorCanal = {};
      
      canais.forEach(canal => {
          const msgsCanal = mensagens.filter(controle => controle.canal === canal);
          const errosCanal = msgsCanal.filter(controle => controle.status === "erro");
          const taxa = msgsCanal.length > 0 ? (errosCanal.length / msgsCanal.length) * 100 : 0;
          taxaDeErroPorCanal[canal] = taxa.toFixed(2) + "%";
      });

      const resumoFINAL = {
         totalDeUsuarios : usuarios.length,
         custoTotal : custoTotal,
         custoPorCanal : custoPorCanal,
         qntMensagensPorStatus : mensagensPorStatus,
         taxaDeErroTotal : taxaDeErroTotal + "%",     
         taxaDeErroEnviadas: taxaDeErroEnviadas + "%",
         taxaDeErroPorCanal: taxaDeErroPorCanal
         
      };
      enviarJSON(resumoFINAL);

   }else if(caminho==="/relatorios/analises"){
      const custoPorCanal = mensagens.reduce((acumulador, controle)=>{ 
         acumulador[controle.canal] = (acumulador[controle.canal]||0) + controle.custo;
         return acumulador;
   },{});

      const canalMaiorCusto = Object.entries(custoPorCanal).reduce((valorA, valorB)=> valorA[1]>valorB[1] ? valorA : valorB);
      const nomeCanalMaiorCusto = canalMaiorCusto[0];
      const valorCusto = (canalMaiorCusto[1]).toFixed(2);

      const totalAtivo = protocolos.filter((controle)=> controle.tipo ==="ativo").length;
      const totalReceptivo = protocolos.filter((controle)=> controle.tipo ==="receptivo").length;
      const predominante = totalAtivo >= totalReceptivo ? "ativo" : "receptivo";

      const horario = mensagens.reduce((controle1, controle2)=>{
         const hora = new Date(controle2.enviada_em).getHours();
         controle1[hora] = (controle1[hora]||0)+1;
         return controle1;
      },{});
      const picoGeral = Object.entries(horario).reduce((valorA, valorB)=> valorA[1]>valorB[1]? valorA:valorB);
      const picoGeralFormatado ={ hora: parseInt(picoGeral[0]), qtd: picoGeral[1]};

      const qntEnviadas = mensagens.filter((controle)=> controle.direcao === "enviada");
      const qntErroEnviadas = mensagens.filter((controle)=> controle.direcao === "enviada").filter((controle)=> controle.status === "erro");
      const taxaDeErroEnviadas = ((qntErroEnviadas.length / qntEnviadas.length)*100).toFixed(2);

      const custoTotalGeral = mensagens.reduce((acumulador, controle) => acumulador + controle.custo, 0);
      const mediaCustoPorMensagem = (custoTotalGeral / mensagens.length).toFixed(2);

      const analiseFINAL = {
         canalMaiorCusto : nomeCanalMaiorCusto,
         valorCanalMaiorCusto : valorCusto,
         mediaCustoPorMensagem: mediaCustoPorMensagem,
         taxaDeErroEnviadas: taxaDeErroEnviadas + "%",
         totalDePerfisAtivos : totalAtivo,
         totalDePerfisReceptivos : totalReceptivo,
         perfilMaisPredominante : predominante,
         horarioPico : picoGeralFormatado,
      }
      enviarJSON(analiseFINAL);

   }else if(caminho.startsWith("/relatorios/")){
      const relatorioEmTexto = caminho.replace("/relatorios/", "");
      if(relatorioEmTexto===""){
         enviarErro("Erro 400 - falha no parâmetro de busca", 400);
      }else if(relatorioEmTexto){
         enviarErro("Erro 404 - pedido " + relatorioEmTexto + " não encontrado", 404);
      }
      
   }else{
      enviarErro("404 - Rota não encontrada", 404);
   }  
});

servidor.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});