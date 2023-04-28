const fs = require('node:fs');
const { join } = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Routes } = require('discord.js');
const { DISCORD_TOKEN, DISCORD_APP_ID, DISCORD_GUILD_ID } = process.env;
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates
	],
	rest: { version: '10' }
});

client.rest.setToken(DISCORD_TOKEN);

client.commands = new Collection();
const commands = [];

for (const file of fs.readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'))) {
	const filePath = join(join(__dirname, 'commands'), file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	};
};

(async () => {
	try {
    await client.rest.put(Routes.applicationGuildCommands(DISCORD_APP_ID, DISCORD_GUILD_ID), {
      body: commands
    });
    await client.login(DISCORD_TOKEN);
	} catch (error) {
		console.error(error);
	};
})();

client.once(Events.ClientReady, bot => {
	console.log(`[DISCORD] ${bot.user.tag} is Online!`);
});

client.on(Events.InteractionCreate, async interaction => {
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