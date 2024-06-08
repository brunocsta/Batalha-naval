//mantém registros dos navios como onde eles estão,
//se foram atingidos, e se foram afundados
var modelo = {
    //tamanho do tabuleiro
    tamanhoTabuleiro : 7,
    //quantidade de navios existentes no tabuleiro
    numeroNavios : 3,
    //o numero de localizaçoes de cada navio
    comprimentoNavio : 3,
    //quantos navios foram afundados
    naviosAfundados : 0,
    //array de objetos navio e cada um armazena as localizacoes
    //e os acertos de um dos 3 navios
    //essa propriedade é convertida em variável mais abaixo no código
    navios : [
        {localizacoes : [0, 0, 0], acertos : ["", "", ""]},
        {localizacoes : [0, 0, 0], acertos : ["", "", ""]},
        {localizacoes : [0, 0, 0], acertos : ["", "", ""]}
    ],
    //esse método vai converter o palpite do usuário em erro
    //ou acerto
    disparar : function(palpite){
        //itera o argumento sobre cada navio para verificar
        //se houve acerto
        for( var i = 0; i < this.numeroNavios; i++){
            //recebe a localizacao dos navios
            var navio = this.navios[i];
            //aqui o palpite vai ser verificado com os
            //locais do navio
            var index = navio.localizacoes.indexOf(palpite);
            if (navio.acertos[index] === "acertou") {
		visualizacao.mostrarMensagem("Você já acertou essa localização!");
		return true;
	    } else if(index >= 0){
                //se passar o palpite tá no array e 
                //acertou o navio
                navio.acertos[index] = "acertou";
                //se passar aqui o navio foi afundado
                //e a propriedade de contagem de afundados
                //é incrementada
                visualizacao.mostrarAcerto(palpite);
                visualizacao.mostrarMensagem("Você Acertou!");
                if (this.isAfundado(navio)){
                    visualizacao.mostrarMensagem("Você Afundou o Navio!")
                    this.naviosAfundados++;
                }
                return true;
            }
        }
        visualizacao.mostrarErro(palpite);
        visualizacao.mostrarMensagem("Você Errou!");
        return false;
    },
    //recebe um navio e retorna um true se ele foi afundado
    // caso contrario retorna false
    isAfundado: function(navio){
        //busca um "acerto" dentro das posições
        for (var i = 0; i < this.comprimentoNavio; i++){
            //enquanto houver uma posicao que do navio que nao foi atingida
            //retorna false, caso contratio retorna true
            if(navio.acertos[i] !== "acertou"){
                return false;
            }
        }
        return true;
    },
    //cria um array navios no modelo com o numero de navios da propriedade numeroNavios
    gerarLocalizacoesNavio : function(){
        var localizacoes;
        for(var i = 0; i < this.numeroNavios; i ++){
            do{
                localizacoes = this.gerarNavio();
            } while(this.colisao(localizacoes));
            this.navios[i].localizacoes = localizacoes;
        }
    },
    //cria uma array com posições aleatórias para um navio
    gerarNavio : function(){
        //1 navio horizontal, 0 navio vertical
        var direcao = Math.floor(Math.random() * 2)
        var linha, coluna;
        if(direcao === 1){
            linha = Math.floor(Math.random() * this.tamanhoTabuleiro);
            coluna = Math.floor(Math.random() * (this.tamanhoTabuleiro - this.comprimentoNavio));
        }else{
            coluna = Math.floor(Math.random() * this.tamanhoTabuleiro);
            linha = Math.floor(Math.random() * (this.tamanhoTabuleiro - this.comprimentoNavio));
        }
        var novaLocalizacaoNavio = [];
        for(var i = 0; i < this.comprimentoNavio; i ++){
            if(direcao === 1){
                novaLocalizacaoNavio.push(linha + "" + (coluna + i));
            }else{
                novaLocalizacaoNavio.push((linha + i) + "" + coluna);
            }
        }
        
        return novaLocalizacaoNavio;
    },
    //este metodo evita sobreposições de navios
    colisao : function(localizacoes){
        //para cada navio no tabuleiro
        for(var i = 0; i < this.numeroNavios; i++){
            var navio = modelo.navios[i];
            //verifica se alguma posicao do array localizacoes do novo
            //navio está no aarray localizacoes de um navio já existente
            for(var x = 0; x < localizacoes.length; x++){
                //indice maior ou igual a zero significa que coincidiu com uma posição
                //já existente
                if(navio.localizacoes.indexOf(localizacoes[x]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
    
};

//mantém a exibição atualizada com acertos, erros e mensagens para o user
var visualizacao = {
    //usa o DOM para pegar o elemento com o id areaMensagem
    //define o innerHTML desse elemento com a mensagem passada para o método mostrarMensagem, o argumento do parametro msg.
    mostrarMensagem : function(msg){
        var areaMensagem = document.getElementById("areaMensagem")
        areaMensagem.innerHTML = msg;
    },
    //pega um elemento td com o id que foi passado como argumento
    //no parametro localizacao e seta a 
    //a classe de acerto do css com o setAttribute()
    mostrarAcerto : function(localizacao){
        var celula = document.getElementById(localizacao);
        celula.setAttribute("class", "hit");
    },
    //pega um elemento td com o id que foi passado como argumento
    //no parametro localizacao e seta a 
    //classe de erro do css com o settAtrribute()
    mostrarErro : function(localizacao){
        var celula = document.getElementById(localizacao);
        celula.setAttribute("class", "miss");
    }
};

//conecta tudo incluindo a obtenção da entrada do usuário e
//a execução da lógica do jogo
var controlador = {
    palpites : 0 ,
    processarPalpite : function(palpite){
        var localizacao = analisarPalpite(palpite);
        if(localizacao){
            this.palpites++;
            var acerto = modelo.disparar(localizacao);
            if (acerto && modelo.naviosAfundados === modelo.numeroNavios){
                visualizacao.mostrarMensagem("Você afundou todos os navios em "+ this.palpites + " palpites!");
            }
        }
    }
};

//cada navio é um novo objeto
//cada navio tem uma propriedade para localizacao e uma para acertos
var navio1 = {
    //localizacoes é contém um array com todas as localizacoes do 
    //navio no tabuleiro
    localizacoes : ["10", "20", "30"],
    //acertos é um array que contém se o navio foi atingido em cada loxalizacao
    //cada item irá receber a string "acerto" quando o usuário
    //acertar uma localizacao correta respectivamente
    acertos : ["", "", ""]
};
var navio2 = {
    localizacoes : ["32", "33", "34"], 
    acertos : ["", "", ""]
};
var navio3 = {
    localizacoes : ["63", "64", "65"], 
    acertos : ["", "", "acerto"]
};

//para não precisar gerenciar três vars diferentes para conter os navios
//criei uma var array única para conter todos
var navios = {
    //navio1
    localizacoes : ["06", "16", "26"], acertos : ["", "", ""],
    //navio2
    localizacoes : ["24", "34", "44"], acertos : ["", "", ""],
    //navio3
    localizacoes : ["10", "11", "12"], acertos : ["", "", ""],
};

function analisarPalpite(palpite){
    var alfabeto = ["A", "B", "C", "D", "E", "F", "G"];
    if(palpite === null || palpite.length !== 2){
        alert("Por favor, insira uma letra e um número.");
    } else { 
        var primeiroCaractere = palpite.charAt(0);
        var linha = alfabeto.indexOf(primeiroCaractere);
        var coluna = palpite.charAt(1);

        if(isNaN(linha) || isNaN(coluna)){
            alert("Fora dos limites do tabuleiro!");
        } else if(linha < 0 || linha >= modelo.tamanhoTabuleiro || coluna < 0 || coluna >= modelo.tamanhoTabuleiro){
            alert("Fora dos limites do tabuleiro!");
        } else {
            return linha + coluna;
        }
    }
    return null;
};

function manipulandoBtnDisparar(){
    var palpiteJogador = document.getElementById("palpiteJogador");
    var palpite = palpiteJogador.value;
    controlador.processarPalpite(palpite);
    palpite.value = "";
};

function init(){
    var btnDisparar = document.getElementById("botaoAtirar");
    btnDisparar.onclick = manipulandoBtnDisparar;
    // var palpiteInput = document.getElementById("palpiteJogador");
    // palpiteInput.onkeydown = manipulandoBtnDisparar;
    modelo.gerarLocalizacoesNavio();
};
window.onload = init;


// visualizacao.mostrarAcerto("00");
// visualizacao.mostrarErro("11");
// visualizacao.mostrarAcerto("22");
// visualizacao.mostrarErro("33");
// visualizacao.mostrarAcerto("44");
// visualizacao.mostrarErro("55");
// visualizacao.mostrarMensagem("TESTE");

// modelo.disparar("53");
// modelo.disparar("06");
// modelo.disparar("16");

// modelo.disparar("26");
// modelo.disparar("34");
// modelo.disparar("24");

// modelo.disparar("44");
// modelo.disparar("12");
// modelo.disparar("11");
// modelo.disparar("10");

// console.log(analisarPalpite("A0"));
// console.log(analisarPalpite("B6"));
// console.log(analisarPalpite("C6"));
// console.log(analisarPalpite("H0"));

// controlador.processarPalpite("A6");

// controlador.processarPalpite("A0");
// controlador.processarPalpite("B6");
// controlador.processarPalpite("C6");

// controlador.processarPalpite("C4");
// controlador.processarPalpite("D4");
// controlador.processarPalpite("E4");

// controlador.processarPalpite("B0");
// controlador.processarPalpite("B1");
// controlador.processarPalpite("B2");
