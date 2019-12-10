function Inimigo(x, y, imagem) {
	this.x = x;
	this.y = y;
	this.imagem = imagem;
	
	this.direcoes = new Array();
	this.direcaoAtual = 0;//Parado
	
	this.desenhar = function (ctx) {
		ctx.drawImage(this.imagem, this.x * Mapa.largura + 45, this.y *
			Mapa.largura + 45, Mapa.largura - 90, Mapa.largura - 90);
	};

	this.mover = function () {
		this.direcoes.length = 0;
		this.adicionaDirecao(this.direcaoAtual, 8);
		this.adicionaDirecao(Jogador.cmdCim, 4);
		this.adicionaDirecao(Jogador.cmdEsq, 4);
		this.adicionaDirecao(Jogador.cmdDir, 4);
		this.adicionaDirecao(Jogador.cmdBai, 4);
		this.adicionaDirecao(0, 1);//Ficar parado
		var aleat = Math.round(Math.random() * (this.direcoes.length -1));
		this.direcaoAtual = this.direcoes[aleat];

		switch (this.direcaoAtual) {
				case Jogador.cmdCim:
				this.y--;
				break;
				case Jogador.cmdBai:
				this.y++;
				break;
				case Jogador.cmdDir:
				this.x++;
				break;
				case Jogador.cmdEsq:
				this.x--;
				break;
		}
	};

	this.adicionaDirecao = function (dir, vezes) {
		var nx = this.x;
		var ny = this.y;
		switch(dir) {
			case Jogador.cmdEsq: nx--; break;
			case Jogador.cmdDir: nx++; break;
			case Jogador.cmdCim: ny--; break;
			case Jogador.cmdBai: ny++; break;
		} //Fim do switch
		
		if (nx < 0 || ny < 0 || nx >= Mapa.colunas || ny >=	Mapa.linhas) {
			return;
		}
		switch (Mapa.atual[ny][nx]) {
			case Mapa.PAREDE:
			case Mapa.TIJOLO:
			case Mapa.BOMBA:
			return;
		}
		var z;
		for (z = 0; z < vezes; z++) {
			this.direcoes.push(dir);
		}
	}; //Fim do adicionaDirecao()

}

Inimigo.todos = new Array();

Inimigo.desenharTodos = ctx => {	
	var i;
	for (i = 0; i < Inimigo.todos.length; i++) {
		Inimigo.todos[i].desenhar(ctx);
	}
};


//Mover todos os inimigos: método estático!
Inimigo.moverTodos = function() {
	var i;
	for (i = 0; i < Inimigo.todos.length; i++) {
		Inimigo.todos[i].mover();
	}
};
