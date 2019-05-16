# Bla-bla-bot

## Instalando o BOT

Você precisará instalar algumas extensões para rodar o Bot:
Começando com o FFMPEG que serve para realizar a codificação/decodificação dos videos que serão reproduzidos no Discord como áudio a partir do YouTube.

Você pode fazer o download a partir deste link [FFMPEG](https://ffmpeg.zeranoe.com/builds/)

A instalação dessa ferramenta é um pouco complicada, eu sugiro que você siga esse [tutorial](https://video.stackexchange.com/questions/20495/how-do-i-set-up-and-use-ffmpeg-in-windows)
caso não tenha a instalado ainda.

Precisaremos também do [nodemon](https://nodemon.io/) - [discord.js](https://discord.js.org/#/) - [eval](https://www.npmjs.com/package/eval) - [node-run-cmd](https://www.npmjs.com/package/node-run-cmd) - [opusscript](https://www.npmjs.com/package/opusscript) - [ytdl-core](https://www.npmjs.com/package/ytdl-core)

	npm install -g nodemon
	npm install discord.js
	npm install eval
	npm install --save node-run-cmd
	npm i opusscript
	npm install ytdl-core


Você precisará ter/criar uma aplicação no Discord, o processo é bem rápido (eu mesmo fiquei impressionado com a facilidade de integração da ferramenta).

1. Para criar a aplicação entre [nesse link](https://discordapp.com/developers/applications/).
2. Clique no botão "New Application" que aparece no canto direto da sua tela.
3. Dê um nome para a sua aplicação, no meu caso eu escolhi "BlaBlaBot2.0".
4. No canto esquerdo da tela, clique na guia "Bot".
5. Clique no botão "Add Bot" e logo em seguida confirme clicando no botão "Yes, do it!".
   
Para o próximo passo é importante que você já tenha criado o servidor no Discord onde o Bot irá atuar.
Nós iremos adicionar o Bot ao servidor, para isso, após ter criado o Bot:

6. No canto esquerdo da tela, clique na guia "General information".
7. Copie o "Client ID" e adicione no lugar em que está escrito "IDDOSEUBOTAQUI" no seguinte link
	
		https://discordapp.com/oauth2/authorize?&client_id=IDDOSEUBOTAQUI&scope=bot&permissions=8

9. Cole o link em uma nova guia e aperte enter.

Nós iremos adicionar o Bot a um servidor agora

10. Escolha o servidor desejado no campo "Selecione um servidor".
11. Clique em "Autorizar" para realizar a ação e logo em seguida confirme o Captcha.
    
## Programando o BOT

Esse é meu primeiro programa em Node.js então eu creio que não ficou tão limpo e polido quando deveria mas o entendimento dele é bem fácil, vindo de alguém que nunca tivera contato tão direto com a linguagem assim antes.

Basicamente você vaí precisar do **ID do servidor** de mensagens, do nome do seu **canal de voz** e do **TOKEN do Bot** 
O TOKEN você pode pegar no mesmo lugar onde você criou a aplicação e o Bot para o seu Discord, já o nome e o ID você consegue encontrar na interface geral do Discord basta clicar com o botão dirento em cima do servidor desejado e copiar o ID.

Bom, no arquivo index.js você vai encontrar na *linha 49* e na *linha 82* a palavra **SERVER_ID**, você deve substituí-la pelo **ID do seu servidor**.
Já na *linha 62* e na *linha 71* você vai encontar a palavra **GREETING** e **GOODBYE** reespectivamente, esses são os nomes dos servidores que você deseja utilizar para mandar mensagens de boas vindas e avisos de remoção de membros. Eu até fiz uma alusão ao VAC Ban da Valve como mensagem, mas sinta-se livre para alterá-la.

Indo para a última *linha 362* você encontrará a palvra **BOT_TOKEN** basta remove-la e adicionar o TOKEN do seu BOT.

## LIGANDO TODOS OS MOTORES

Após todo esse trabalho você só precisará abrir o CMD ou o seu CLI preferido no diretório em que se encontra o arquivo index.js e digitar

	nodemon index.js

E se tudo estiver certo você poderá começar enviando um simples e amigável "Ola mundo" para o seu Bot :)

Você também pode utilizar o comando "!help" onde o Bot irá mostrar todos os seus comandos.

*OBS: Evite de colocar o Bot com o pacote "node-run-cmd" em um servidor público, ainda mais se a opção hack_mode estiver ativa, embora eu tenha deixado apenas o utilitário "help" ativo é sempre bom previnir!*
