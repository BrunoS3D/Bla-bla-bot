const { Discord, Client, Attachment, TextChannel } = require('discord.js');
const ytdl = require('ytdl-core');
const client = new Client();

const activities = {
	NONE: "none",
	MATHGAME: "mathgame",
	PLAYSTREAM: "playstream",
}

var activity = activities.NONE;

// status
var waiting_user_input = false;
var last_wrong = false;
var hack_mode = false;

// messages 
var greetings = ["Olá, humano.",
	"Bom dia, estou a sua disposição.",
	"Oi, como vai?",
	"0110111101101001"
];

var thanks = ["Vlw, amigo.",
	"Obrigado. :slight_smile:",
	"Por nada.",
	"Disponha.",
	"Estou sempre a disposição.",
];

// emojis
var positive_emojis = [
	":smile:",
	":slight_smile:",
	":thumbsup:",
	":grinning:",
	":sunglasses:"
]

// game info
var dispatcher;
var a = 0;
var b = 0;
var result;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	const channel = client.channels.get("SERVER_ID");
	if (!channel) return console.error("The channel does not exist!");
	channel.join().then(connection => {
		// Yay, it worked!
		console.log("Successfully connected.");
	}).catch(e => {
		// Oh no, it errored! Let's log it to console :) 
		console.error(e);
	});
});

client.on('guildMemberAdd', member => {
	// Send the message to a designated channel on a server:
	const channel = client.channels.find("name", "GREETING");
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Bem vindo à festa dos bots, ${member}`);
});

client.on('guildMemberRemove', member => {
	// Send the message to a designated channel on a server:
	const channel = client.channels.find("name", "GOODBYE");
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Player ${member} has left the server [VAC Banned from secure servers].`);
});

client.on('message', msg => {
	console.log(`[${msg.author.username}] ${msg.content}`);
	if (msg.author.username != client.user.username) {
		const msgToLowerCase = msg.content.toLowerCase();
		const channel = client.channels.get("SERVER_ID");
		const voiceChannel = client.voiceConnections.find(val => val.channel.name == "Geral");
		switch (activity) {
			// Default = NONE
			default:
				if (msgToLowerCase.includes("!help")) {
					var help_msg = "Aceitar ---------------- sim / ss / s / yes / claro / quero / aham\r\n";
					help_msg += "Negar ------------------ não / nn / n / noop\r\n";
					help_msg += "______________________________\r\n";
					help_msg += "Iniciar MATH-QUIZ --- jogo / jogar / game\r\n";
					help_msg += "Fechar  MATH-QUIZ -- sair / parar / exit / stop\r\n";
					help_msg += "Pular Pergunta ------ proxim / próxim / outr / nao | n & sei / next\r\n";
					help_msg += "Desafiar BOT --------- aposto / duvido / desafio / sabe\r\n";
					help_msg += "______________________________\r\n";
					help_msg += "Agradecimentos    ------- obrigado / brigado / vlw\r\n";
					help_msg += "Risada ------------------ rsrs+ / kkk+ / ksks+ / haha+ / hehe+\r\n";
					help_msg += "Saudações         --------- bom dia / como vai / oi / oie / ola / eai / e ai bot / boa & tarde | noite\r\n";
					help_msg += "______________________________\r\n";
					help_msg += "Iniciar Musica	--------- !play YT-LINK\r\n";
					help_msg += "Parar   Musica	--------- !stop\r\n";
					help_msg += "Pausar  Musica	-------- !pause\r\n";
					help_msg += "Resumir Musica	------- !resume\r\n";
					help_msg += "Alterar Volume	-------- !volume = 0 / 100\r\n";
					help_msg += "______________________________\r\n";
					help_msg += "Topicos de ajuda --------- !help\r\n";
					help_msg += "Checar Status 	--------- !status\r\n";
					help_msg += "Liberar meu PC	--------- hack_mode = true / false\r\n";
					help_msg += "\r\n";
					msg.channel.send(help_msg);
				}
				else if (msgToLowerCase.includes("!status")) {
					msg.channel.send(`Online: ${client.status}`);
					msg.channel.send(`Ping  : ${client.ping}`);
				}
				// game start
				else if (msgToLowerCase.includes("jogo")
					|| msgToLowerCase.includes("jogar")
					|| msgToLowerCase.includes("game")) {
					msg.channel.send(":thinking: Você quer jogar um jogo? :smirk:");
					waiting_user_input = true;
					last_wrong = false;
					// START MATHGAME
					activity = activities.MATHGAME;
				}
				// greetings interaction
				else if (msgToLowerCase.includes("bom dia")
					|| msgToLowerCase.includes("como vai")
					|| msgToLowerCase.includes("oi")
					|| msgToLowerCase.includes("oie")
					|| msgToLowerCase.includes("ola")
					|| msgToLowerCase.includes("eai")
					|| msgToLowerCase.includes("e ai bot")
					|| (msgToLowerCase.includes("boa")
						&& (msgToLowerCase.includes("tarde")
							|| msgToLowerCase.includes("noite")))) {
					msg.reply(greetings[randomAB(0, greetings.length)] + " " + getPositiveEmoji());
				}
				// thanks interaction
				else if (msgToLowerCase.includes("obrigado")
					|| msgToLowerCase.includes("brigado")
					|| msgToLowerCase.includes("vlw")) {
					msg.reply(thanks[randomAB(0, thanks.length)] + " " + getPositiveEmoji());
				}
				else if (msgToLowerCase.includes("!play")) {
					const streamOptions = { seek: 0, volume: 1 };
					const stream = ytdl(msg.content.replace("!play", ""), { filter: 'audioonly' });
					// Get voice channel by ID 
					try {
						channel.join();
						dispatcher = voiceChannel.playStream(stream, streamOptions).on('end', () => {
							channel.leave();
							channel.join();
						});
						msg.channel.send(`Reproduzindo no canal de voz "Geral"`);
						dispatcher.setVolumeLogarithmic(1);
					}
					catch (exep) {
						console.log(exep);
						msg.channel.send("Link quebrado, bip bop :robot:");
					}
				}
				else if (msgToLowerCase.includes("!volume")) {
					dispatcher.setVolumeLogarithmic(eval(msg.content.replace(/\D/g, '')) / 100);
					msg.channel.send("O volume foi alterado para: " + msg.content);
				}
				else if (msgToLowerCase.includes("!pause")) {
					voiceChannel.dispatcher.pause();
					dispatcher.setVolumeLogarithmic(0);
					msg.channel.send("A reprodução está pausada!");
				}
				else if (msgToLowerCase.includes("!resume")) {
					voiceChannel.dispatcher.resume();
					dispatcher.setVolumeLogarithmic(1);
					msg.channel.send(`Reproduzindo no canal de voz "Geral"`);
				}
				else if (msgToLowerCase.includes("!stop")) {
					voiceChannel.dispatcher.end();
					dispatcher.setVolumeLogarithmic(0);
					channel.leave();
					channel.join();
					msg.channel.send("A reprodução foi parada!");
				}
				// simple interaction
				else if (msgToLowerCase.includes("quem sou eu")) {
					msg.channel.send(`Seu nome é ${msg.author} ` + getPositiveEmoji());
				}
				// emoji interaction
				else if (msg.content.includes("emoji")) {
					msg.channel.send(getPositiveEmoji());
				}
				// number interaction
				else if (msg.content.includes("random")) {
					msg.channel.send(randomAB(0, 5));
				}
				// laught interaction
				else if (msgToLowerCase.includes("huas")
					|| msgToLowerCase.includes("aushuah")
					|| msgToLowerCase.includes("ahuah")
					|| msgToLowerCase.includes("ausah")
					|| msgToLowerCase.includes("sahus")
					|| msgToLowerCase.includes("usah")
					|| msgToLowerCase.includes("asdh")
					|| msgToLowerCase.includes("asuhd")
					|| msgToLowerCase.includes("uasdh")
					|| msgToLowerCase.includes("uhas")
					|| msgToLowerCase.includes("ashudas")
					|| msgToLowerCase.includes("ushaduasd")
					|| msgToLowerCase.includes("sdus")
					|| msgToLowerCase.includes("uahsdhsa")
					|| msgToLowerCase.includes("ksks")
					|| msgToLowerCase.includes("kkk")
					|| msgToLowerCase.includes("hue")
					|| msgToLowerCase.includes("rsrs")
					|| msgToLowerCase.includes("hehe")
					|| msgToLowerCase.includes("haha")) {
					msg.channel.send("hahaha bip bop :robot:");
				}
				// indirect interaction
				else if (msgToLowerCase.includes("bot")) {
					msg.reply(":thinking: Falou cmg? " + getPositiveEmoji());
				}
				// cmd commands
				else if (msgToLowerCase.includes("hack_mode")
					|| msgToLowerCase.includes("while")) {
					hack_mode = (msgToLowerCase.includes("true"));
					msg.channel.send(`hack_mode = ${hack_mode}`);
				}
				else if (hack_mode && msg.content.includes("!!")) {
					if (msg.content.toLowerCase() == "!!help") {
						var nrc = require('node-run-cmd');
						var dataCallback = function (data) {
							msg.channel.send(data);
							console.log(data);
						};
						nrc.run(msg.content.replace("!!", ""), { onData: dataCallback });
					}
					else {
						msg.channel.send("CMD_404: COMMAND NOT FOUND!!!");
					}
				}
				break;
			// Default = MATHGAME
			case activities.PLAYSTREAM:

				break;
			// Default = MATHGAME
			case activities.MATHGAME:
				if (waiting_user_input) {
					if (!(msgToLowerCase.includes("nao")
						|| msgToLowerCase.includes("nn")
						|| msgToLowerCase.includes("no")
						|| msgToLowerCase.includes("noop"))
						&&
						(msgToLowerCase.includes("sim")
							|| msgToLowerCase == "s"
							|| msgToLowerCase.includes("yes")
							|| msgToLowerCase.includes("aham")
							|| msgToLowerCase.includes("quero")
							|| msgToLowerCase.includes("claro")
							|| msgToLowerCase.includes("ss"))) {
						if (last_wrong) {
							msg.channel.send(" bora pro jogo! :video_game:");
							msg.channel.send(`Blz, o resultado era ${result}...Aqui vai uma fresquinha: `);
						}
						else {
							msg.channel.send("Blz, bora pro jogo! :video_game:");
						}
						newMathGame(msg);
						waiting_user_input = false;
					}
					else {
						msg.channel.send("Tudo bem, até a próxima! " + getPositiveEmoji());
						// CANCEL MATHGAME
						activity = activities.NONE;
					}
				} else {
					if (msgToLowerCase.includes("sair")
						|| msgToLowerCase.includes("parar")
						|| msgToLowerCase.includes("stop")
						|| msgToLowerCase.includes("exit")
						|| msgToLowerCase.includes("quit")) {
						msg.channel.send("Okay, até a próxima! " + getPositiveEmoji());
						// EXIT MATHGAME
						activity = activities.NONE;
					}
					else if (msg.content.includes(result)) {
						msg.channel.send("Parabéns, aqui vai mais uma! " + getPositiveEmoji());
						last_wrong = false;
						newMathGame(msg);
					}
					else if (msgToLowerCase.includes("nao sei")
						|| msgToLowerCase.includes("n sei")
						|| msgToLowerCase.includes("proxim")
						|| msgToLowerCase.includes("próxim")
						|| msgToLowerCase.includes("next")
						|| msgToLowerCase.includes("outr")) {
						msg.channel.send(`: cry: Tudo bem, o resultado era ${result}.`);
						last_wrong = true;
						newMathGame(msg);
					}
					else if (msgToLowerCase.includes("aposto")
						|| msgToLowerCase.includes("duvido")
						|| msgToLowerCase.includes("desafio")
						|| msgToLowerCase.includes("sabe")) {
						msg.channel.send(`Achou que ia me pegar ? ${result}.`);
						newMathGame(msg);
					}
					else {
						if (last_wrong) {
							msg.channel.send("Que pena, deseja continuar? :grimacing:");
							waiting_user_input = true;
						}
						else {
							msg.channel.send("Que pena, tente novamente! :grimacing:");
							last_wrong = true;
						}
					}
				}
				break;
		}
	}
});

function getPositiveEmoji() {
	return positive_emojis[randomAB(0, positive_emojis.length)];
}

function randomAB(a, b) {
	return Math.floor((Math.random() * b) + a);
}

function newMathGame(msg) {
	var MAX = 4;
	var rand = randomAB(1, MAX);
	if (rand == 1) {
		a = randomAB(1, 100);
		b = randomAB(1, 100);
		msg.channel.send(`Qual é a soma de ${a} + ${b} ? `);
		result = a + b;
	}
	else if (rand == 2) {
		a = randomAB(1, 100);
		b = randomAB(1, 100);
		msg.channel.send(`Qual é o resultado de ${a} - ${b} ? `);
		result = a - b;
	}
	else if (rand == 3) {
		a = randomAB(1, 10);
		b = randomAB(1, 10);
		msg.channel.send(`Qual é o produto de ${a} * ${b} ? `);
		result = a * b;
	}
	else {
		a = randomAB(1, 10);
		b = randomAB(1, 3);
		msg.channel.send(`Qual é a potência de ${a} elevado a ${b} ? `);
		result = Math.pow(a, b);
	}
}

client.login('BOT_TOKEN');
