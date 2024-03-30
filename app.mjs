import 'dotenv/config';
import fs from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { DISCORD_TOKEN, DISCORD_APP_ID, DISCORD_GUILD_ID } = process.env;

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates
	]
});

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

client.commands = new Collection();
const commands = [];

const importPromises = [];
for (const file of fs.readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.mjs'))) {
	const filePath = join(join(__dirname, 'commands'), file);
	importPromises.push(import(filePath).then(commandModule => {
		const command = commandModule.default;
		commands.push(command.data.toJSON());
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}).catch(error => {
		console.error(`Error importing command file ${filePath}:`, error);
	}));
}

try {
	await Promise.all(importPromises);
	await rest.put(Routes.applicationGuildCommands(DISCORD_APP_ID, DISCORD_GUILD_ID), { body: commands });
} catch (error) {
	console.error(error);
}

client.on('ready', () => {
	console.log(`[DISCORD] ${client.user.tag} is Online!`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	console.log(`[DISCORD] ${interaction.member.user.tag} used the /${interaction.commandName} command!`);

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	};
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	};
});

client.login(DISCORD_TOKEN);