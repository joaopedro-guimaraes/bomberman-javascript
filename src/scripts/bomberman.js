var intervaloJogador = 200;
var intervaloInimigos = 400;
var tempoJogador = null;
var tempoInimigos = null;
var nBombas = document.querySelector('#bomb');
var ul = document.createElement('div');
var vitorias = 0;
var nInimigos;

var canvas = document.getElementById("tela");
var ctx = canvas.getContext("2d");

Bomba.som = document.querySelector("#sndBomba");
const tema = document.querySelector("#sndTheme");
Jogador.som = document.querySelector("#sndDeath");

let splash = new Image();
splash.src = "src/images/splash.png";
let gameover = new Image();
gameover.src = "src/images/gameover.png"

function reiniciar() {
  if(vitorias === 0) {
    nInimigos = 0;
  }
  Bomba.maxBombas = 1 + Math.floor(nInimigos/10);
  tema.currentTime = 0;
  Inimigo.todos = [];
  if (tempoJogador != null) {
    pausar();
  }
  intervaloJogador = 200;
  intervaloInimigos = intervaloJogador * 2;
  Mapa.carregar(canvas);
  desenharTudo();
  /* document.getElementById("btnIniciar").disabled = false; */
  document.getElementById("btnIniciar").classList.remove('disabled');
  document.getElementById("btnIniciar").innerHTML = "Iniciar";
  intervaloJogador = 200;
  intervaloInimigos = intervaloJogador * 2;
  Bomba.todas.length = 0;
  nBombas.innerHTML = `<p class="bomba-placar"> Bombas Disponíveis: <span id="bombas"><img src="src/images/minbomba.png" /></span> Placar: <span id="placar">${nInimigos}</span></p>`;

  let nBombasSpan = document.querySelector('#bombas');
  nBombasSpan.innerHTML = `${desenharBombas(Bomba.maxBombas)}`;
}

function desenharTudo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Mapa.desenhar(ctx);
  Bomba.desenharTodas(ctx);
  Jogador.desenhar(ctx);
  Inimigo.desenharTodos(ctx);
    ctx.drawImage(splash, splash.x * Mapa.largura +130, splash.y *
      Mapa.largura + 120, Mapa.largura +550, Mapa.largura + 350);
/*       isFirst = false; */
}
reiniciar();


document.onkeydown = function (evt) {
  if (tempoJogador !== null) {
    Jogador.tratarTecla(evt);
  }
}

function pausar() {
  if (tempoJogador == null) {
    splash = new Image();
    tema.play();
    tempoJogador = setInterval("atualizaJogador()",
    (intervaloJogador) - vitorias*10);
    tempoInimigos = setInterval("atualizaInimigos()",
    (intervaloInimigos) - vitorias*50);
    document.getElementById("btnIniciar").innerHTML = "Pausar";
   } else {
    clearInterval(tempoJogador);
    tempoJogador = null;
    clearInterval(tempoInimigos);
    tempoInimigos = null;
    document.getElementById("btnIniciar").innerHTML =
    "Continuar";
    tema.pause();
  }
}

function atualizaJogador() {
  Jogador.mover();
  Bomba.executarTodosCiclos();
  desenharTudo();
  if (Jogador.verificaMorte()) {
    gameOver();
  }
}

function atualizaInimigos() {
  Inimigo.moverTodos();
  desenharTudo();
  if (Jogador.verificaMorte()) {
    gameOver();
  }
}

 function gameOver() {
  ctx.drawImage(gameover, gameover.x * Mapa.largura +270, gameover.y *
    Mapa.largura + 200, Mapa.largura +275, Mapa.largura + 175);
  Jogador.som.currentTime = 0;
  Jogador.som.play();
  if (tempoJogador != null) {
    pausar();
  } 
  document.getElementById("btnIniciar").classList.add('disabled');
} 



