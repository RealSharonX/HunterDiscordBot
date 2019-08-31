/* eslint-disable no-console */
/*eslint-disable no-unused-vars*/

const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
const Util = require('discord.js');
const TOKEN = require('./config').TOKEN;
const PREFIX = require('./config').PREFIX; 	
const fetch = require('node-fetch');
const axios = require("axios");
const { URL } = require('url');
const region = "euw1";
const api_key = require('./config').API_KEY;
let database = new Object();
let database1 = new Object();		
let database2 = new Object();	
let database3 = new Object();
let database4 = new Object();
let tnPlayers = [];	
let userTeam;								

client.on('ready', () => {
	console.log(`${client.user.tag} is locked and loaded!`);

	client.channels.find(x => x.id === '584801416099528869').send('RankUp activated!');
});


client.on('message', async (message) => {
	if (message.author.bot) return undefined;
	if (!message.content.startsWith(PREFIX)) return undefined;
	const args = message.content.split(' ');
	const username = args.slice(1).join("_");
	let author = message.author.id;
	let xy;		
	

	//FAKE DATABASE FOR TESTS


	database["327548359504166927"] = "lHjwNTEHEhDcVeB_3fOrGaqh7M9TzV1nOeZdQ5Vm48-0je4";
	database1["327548359504166927"] ="AxisPowa1337";
	database2["lHjwNTEHEhDcVeB_3fOrGaqh7M9TzV1nOeZdQ5Vm48-0je4"] = "327548359504166927";
	database3["327548359504166927"] = "4086";
	





	//IT ENDS HERE

	if (message.content.startsWith(`${PREFIX}link`)) {
		xy = await usernameToId(username, message, author);		
		if (author in database) {
			const exampleEmbed1 = new Discord.RichEmbed()
				.setColor('#e2d73d')
				.setTitle('YOU ARE ALREADY LINKED WITH:')
				.setThumbnail(`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${database3[author]}.jpg`)
				.addField(`${database1[author]}`, "If this is not your account use !hchange and link again", true)
				.setFooter(`if u face any problems contact @SharonX`);
			message.channel.send(exampleEmbed1);
		} else if (xy in database2) {
			const exampleEmbed2 = new Discord.RichEmbed()
				.setColor('#c64227')
				.setTitle('Are you sure ?')
				.setThumbnail(`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${database3[database2[username]]}.jpg`)
				.addField("This LOL account is registred with another discord profile named:", `<@${database2[xy]}>`, true)
				.setFooter(`if u face any problems contact @SharonX`);
			message.channel.send(exampleEmbed2);
		} else {
			await pushAccountId(username, message, author);
		}
	}	
	if (message.content.startsWith(`${PREFIX}change`)) {
		await delete database[author];
		await delete database2[database[author]];
		await delete database1[author];
		await delete database3[author];

		message.channel.send("We unlinked your account");
	}
	if (message.content.startsWith(`${PREFIX}show`) && message.author.username === "SharonX") {
		console.log(database);
		console.log(database1);
		console.log(database2);
		console.log(database3);
	}
	if (message.content.startsWith(`${PREFIX}live`)) {
		if (! (author in database)) {
			const exampleEmbed2 = new Discord.RichEmbed()
				.setColor('#d60003')
				.setTitle('YOU MUST LINK YOUR ACCOUNT FIRST')
				.setThumbnail(`https://i.pinimg.com/originals/0f/29/4b/0f294b7526efe50851b6ae365d220a59.jpg`)
				.addField(`Before using this command:`, "you need to link your account using !hlink LOLAccountNameExample", true)
				.setFooter(`if u face any problems contact @SharonX`);
			message.channel.send(exampleEmbed2);
		}
		if (author in database) {
			checkLive(author, message);
		}
	}
});
async function checkLive(author, message) {
	let data2 = await fetch(new URL("https://"+region+".api.riotgames.com/lol/spectator/v4/active-games/by-summoner/"+database[author]+"?api_key="+api_key));
	let main2 = await data2.json();
	if ("status" in main2) {
		message.channel.send("You are not in a game!");
	} else {
		database4[author] = main2.gameID;
		checkRanked(author, message);
	}
}
async function checkRanked(author, message) {
	axios.get("https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/"+database[author]+"?api_key="+api_key)
		.then(function(response){
			let data = response.data;			
			for (let i = 0; i < 10; i++) {
				if ((data.participants[i].summonerId) == database[author]) {
					userTeam = data.participants[i].teamId;
				}
			}
			for (let i = 0; i < 10; i++) {
				if ((data.participants[i].summonerId) in database2 && (data.participants[i].summonerId) != database[author] && (data.participants[i].teamId) != userTeam) {
					tnPlayers.push(data.participants[i].summonerId);
					message.channel.send("You are in a ranked game versus a tunisian !");
				} else {
					message.channel.send("There are no tunisians on the enemy team!");
				}
			}
			console.log(tnPlayers);			
		}); 
}

async function pushAccountId(username, message, author)
{
	let data = await fetch(new URL("https://"+region+".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+username+"?api_key="+api_key));
	let main = await data.json();
	if ("status" in main) {
		message.channel.send("This account name doesn't exist or it is not in EUW server");
	} else {
		database[author] = main.id;
		database1[author] = main.name;
		database2[main.id] = author;
		database3[author] = main.profileIconId;
		const exampleEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setTitle('YOU ARE NOW LINKED WITH:')
			.setThumbnail(`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${main.profileIconId}.jpg`)
			.addField(`${main.name}`, "If this is not your account use !hchange and link again", true)
			.setFooter(`if u face any problems contact @SharonX`);
		message.channel.send(exampleEmbed);
	}
}

async function usernameToId(username, message, author, xy) {
	let data1 = await fetch(new URL("https://"+region+".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+username+"?api_key="+api_key));
	let main1 = await data1.json();
	if ("status" in main1) {
		console.log(main1);
	} else {
		xy = main1.id;
		return xy;
	}
}




client.login(TOKEN);