function Jogador() {
}

Jogador.x = -1;
Jogador.y = -1;
Jogador.som = null;

Jogador.img = new Image();
Jogador.img.src = "src/images/jogador.png";

Jogador.desenhar = function (ctx) {
/* 	ctx.fillStyle = "#00BBBB";
	ctx.fillRect(Jogador.x * Mapa.largura + 2, Jogador.y *
		Mapa.largura + 2, Mapa.largura - 4, Mapa.largura - 4);  */
	ctx.drawImage(Jogador.img, Jogador.x * Mapa.largura + 35, Jogador.y *
		Mapa.largura + 35, Mapa.largura - 65, Mapa.largura - 76); 
};

//Configurações de teclas para o Jogador
Jogador.cmdEsq = 65; //A
Jogador.cmdDir = 68; //D
Jogador.cmdCim = 87; //W
Jogador.cmdBai = 83; //S
Jogador.cmdBomba = 32; //Espaço

//Variáveis para controle de movimentação
Jogador.proximoMov = null;
Jogador.plantarBomba = false;

//Tratar tecla pressionado conforme comportamento do Jogador
Jogador.tratarTecla = function (evt) {
	switch (evt.keyCode) {
		case Jogador.cmdEsq:
		case Jogador.cmdDir:
		case Jogador.cmdCim:
		case Jogador.cmdBai:
			Jogador.proximoMov = evt.keyCode;
			evt.preventDefault();
			break;
		case Jogador.cmdBomba:
			Jogador.plantarBomba = true;
			evt.preventDefault();
			break;
	}
};

//Com base no último movimento solicitado, executa movimento
Jogador.mover = function () {

	var nx = -1;
	var ny = -1;
	switch (Jogador.proximoMov) {
		case Jogador.cmdEsq:
			nx = Jogador.x - 1;
			break;
		case Jogador.cmdDir:
			nx = Jogador.x + 1;
			break;
		case Jogador.cmdCim:
			ny = Jogador.y - 1;
			break;
		case Jogador.cmdBai:
			ny = Jogador.y + 1;
			break;
	}
	
	if (Jogador.plantarBomba) {
		if (Bomba.todas.length < Bomba.maxBombas) {
			Bomba.todas.push(new Bomba(this.x, this.y));
		}
		Jogador.plantarBomba = false;
	}
	
	if (nx >= 0 && nx < Mapa.colunas) {
		switch (Mapa.atual[Jogador.y][nx]) {
			case Mapa.PAREDE:
			case Mapa.TIJOLO:
			case Mapa.BOMBA:
				break;
			default:
				Jogador.x = nx;
				break;
		}
	}
	
	if (ny >= 0 && ny < Mapa.linhas) {
		switch (Mapa.atual[ny][Jogador.x]) {
			case Mapa.PAREDE:
			case Mapa.TIJOLO:
			case Mapa.BOMBA:
				break;
			default:
				Jogador.y = ny;
				break;
		}
	}
	
	Jogador.proximoMov = null;
};

//Verifica se o Jogador morre (contato com inimigo)
Jogador.verificaMorte = function() {
	var i;
	for (i = 0; i < Inimigo.todos.length; i++) {
		if (Jogador.x == Inimigo.todos[i].x &&
		Jogador.y == Inimigo.todos[i].y) {
			return true;
		}
	}
	return false;
};

