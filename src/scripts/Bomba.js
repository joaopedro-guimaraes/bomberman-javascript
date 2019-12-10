
function Bomba(x, y) {
  this.x = x;
  this.y = y;
  this.ciclos = Bomba.nCiclosAtual;
  this.cicloAtual = 0;
  this.raio = Bomba.raioAtual;

  Mapa.atual[y][x] = Mapa.BOMBA;
  this.desenhar = function(ctx) {
    var raio = Mapa.largura / 2;
    var prop = 0.5 + ((0.5 * this.cicloAtual) / this.ciclos);
  
    if (prop > 1) {
      prop = 1;
    }
  
    ctx.fillStyle = "rgb(" + Math.round(prop * 255) +", " +
    Math.round(prop * 100) + ", 0)";
  
    if (this.cicloAtual <= this.ciclos) {
      ctx.beginPath();
      ctx.arc(this.x * Mapa.largura + raio, this.y *
      Mapa.largura + raio, raio, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    } else {
      //Pinta o ponto central da explosão
      ctx.fillRect(this.x * Mapa.largura, this.y * Mapa.largura,
      Mapa.largura, Mapa.largura);
      var nx, ny, r; //Para cima
  
      for (r = 1; r <= this.raio; r++) {
        ny = this.y - r;
        if (ny >= 0) {
          if (Mapa.atual[ny][this.x] == Mapa.PAREDE) {
            break;
          } else {
            ctx.fillRect(this.x * Mapa.largura, ny *
            Mapa.largura, Mapa.largura, Mapa.largura);
          }
          if (Mapa.atual[ny][this.x] == Mapa.TIJOLO) {
            break;
          }
        } //Fecha if (ny >= 0)
      } //Fecha for (r)
  
      for (r = 1; r <= this.raio; r++) {
        ny = this.y + r;
        if (ny < Mapa.linhas) {
          if (Mapa.atual[ny][this.x] == Mapa.PAREDE) {
            break;
          } else {
            ctx.fillRect(this.x * Mapa.largura, ny *
            Mapa.largura, Mapa.largura, Mapa.largura);
          }
          if (Mapa.atual[ny][this.x] == Mapa.TIJOLO) {
            break;
          }
        } //Fecha if (ny)
      } //Fecha for (r)
      //Para esquerda
  
      for (r = 1; r <= this.raio; r++) {
        nx = this.x - r;
        if (nx >= 0) {
          if (Mapa.atual[this.y][nx] == Mapa.PAREDE) {
            break;
          } else {
            ctx.fillRect(nx * Mapa.largura, this.y *
            Mapa.largura, Mapa.largura, Mapa.largura);
          }
          if (Mapa.atual[this.y][nx] == Mapa.TIJOLO) {
            break;
          }
        } //Fecha if (nx)
      } //Fecha for (r)
      //Para direita
  
      for (r = 1; r <= this.raio; r++) {
        nx = this.x + r;
        if (nx < Mapa.colunas) {
          if (Mapa.atual[this.y][nx] == Mapa.PAREDE) {
            break;
          } else {
            ctx.fillRect(nx * Mapa.largura, this.y *
            Mapa.largura, Mapa.largura, Mapa.largura);
          }
          if (Mapa.atual[this.y][nx] == Mapa.TIJOLO) {
            break;
          }
        } //Fecha if (nx)
      } //Fecha for (r)
    } //Fecha o else
  }; //Fecha o método desenhar()

  this.executarCiclo = function () {
    this.cicloAtual++;
    if (this.cicloAtual > this.ciclos) {
      if (this.cicloAtual == this.ciclos + 1 && Bomba.som !=
      null) {
        Bomba.som.currentTime = 0;
        Bomba.som.play();
      }
      this.explodir();
      //console.log('explodir')
    }
  };
  
  this.explodir = function () {
    var nx, ny, r, continua;
    //Para cima
    continua = false;
    for (r = 1; r <= this.raio; r++) {
      ny = this.y - r;
      if (ny >= 0) {
        continua = this.verificaEstrago(this.x, ny);
      }
      if (!continua) {
        break;
      }
    } //Fim do for

    //Explode no meio
    for (r = 0 ; r <= this.raio; r++) {
      ny = this.y - r;
      if (ny >= 0) {
        continua = this.verificaEstrago(this.x, ny);
      }
      if (!continua) {
        break;
      }
    } //Fim do for
  
    //Para baixo
    continua = false;
    for (r = 1; r <= this.raio; r++) {
      ny = this.y + r;
      if (ny < Mapa.linhas) {
        continua = this.verificaEstrago(this.x, ny);
      }
      if (!continua) {
        break;
      }
    }
  
    //Para esquerda
    continua = false;
    for (r = 1; r <= this.raio; r++) {
      nx = this.x - r;
      if (nx >= 0) {
        continua = this.verificaEstrago(nx, this.y);
      }
      if (!continua) {
        break;
      }
    }
  
    //Para direita
    continua = false;
    for (r = 1; r <= this.raio; r++) {
      nx = this.x + r;
      if (nx < Mapa.colunas) {
        continua = this.verificaEstrago(nx, this.y);
      }
      if (!continua) {
        break;
      }
    }
  
    //Garante o tempo da explosão ativa
    if (this.cicloAtual > this.ciclos + Bomba.nCiclosPos) {
      var posicao = Bomba.todas.indexOf(this);
      Bomba.todas.splice(posicao, 1);
      Mapa.atual[this.y][this.x] = Mapa.LIVRE;
    }
  }; //Fim do método explodir()
  
  this.verificaEstrago = function (x, y) {
    //Se encontrar uma parede, para o avanço da explosão
    if (Mapa.atual[y][x] == Mapa.PAREDE) {
      return false;
    }

    if (Mapa.atual[y][x] == Mapa.ITEMBOMBA) {
      return false;
    }

    //Se encontrar um tijolo, quebra e para
    if (Mapa.atual[y][x] == Mapa.TIJOLO) {
      if (this.cicloAtual > this.ciclos +
      Bomba.nCiclosPos) {
        var random = Math.floor(Math.random() * 10);
        if (random != 0){
          Mapa.atual[y][x] = Mapa.LIVRE;
        } else {
          Mapa.atual[y][x] = Mapa.ITEMBOMBA;
          Bomba.maxBombas++;
          setTimeout(function(){ Mapa.atual[y][x] = Mapa.LIVRE; }, 2000);         
          let nBombasSpan = document.querySelector('#bombas');
          nBombasSpan.innerHTML = `${desenharBombas(Bomba.maxBombas)}`;
        }
      }
      return false;
    }
  
    //Se encontrar uma bomba, explode quando for necessário
    var i;
    for (i = 0; i < Bomba.todas.length; i++) {
      if (Bomba.todas[i].x == x &&
        Bomba.todas[i].y == y &&
        this != Bomba.todas[i] &&
        Bomba.todas[i].cicloAtual < Bomba.todas[i].ciclos) {
          //Vai explodir
          Bomba.todas[i].cicloAtual = Bomba.todas[i].ciclos;
      }
    }
    //Se encontrar o jogador, fim de jogo
    if (Jogador.x == x && Jogador.y == y) {
      gameOver();
    }
  
    //Se encontrar um inimigo, mata-o
    i = 0;
    while (i < Inimigo.todos.length) {
      if (Inimigo.todos[i].x == x && Inimigo.todos[i].y == y) {
        Inimigo.todos.splice(i, 1);
        nInimigos++;
        const placar = document.querySelector('#placar');
        placar.textContent = nInimigos;
        if(Inimigo.todos.length === 0){
          vitorias++
          let placar = nInimigos;
          setTimeout(() => {
            reiniciar(placar);
          }, 1500);
          
        }
      } else {
        i++;
      }
    }
    return true;
  };//Fim do método verificaEstrago()
}

Bomba.som = null;
Bomba.todas = new Array();
Bomba.todas.length = 0;
Bomba.maxBombas = 1; //Valor definido no "novo jogo"
Bomba.nCiclosAtual = 15;
Bomba.raioAtual = 2;
Bomba.nCiclosPos = 2;
Bomba.imgFogo = new Image();
Bomba.imgFogo.src = "src/images/fire.png";

Bomba.desenharTodas = function (ctx) {
  var i;
  for (i = 0; i < Bomba.todas.length; i++) {
    Bomba.todas[i].desenhar(ctx);
  }
};

Bomba.executarTodosCiclos = function () {
  var i;
  for (i = 0; i < Bomba.todas.length; i++) {
    Bomba.todas[i].executarCiclo();
  }
};

const desenharBombas = nBombas => {
  const imgBomba = 'src/images/minbomba.png'
  let html = ``;

  for(let i=0; i < nBombas; i++){
    html += `<img src="${imgBomba}" />`;
  }

  return html;
}