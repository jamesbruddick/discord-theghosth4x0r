import { join } from 'node:path';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('TheGhostH4x0r says Hello!'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		if (!interaction.member.voice.channel) return interaction.editReply({ content: 'Connect to a voice channel!' });
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfDeaf: false
		});
		const player = createAudioPlayer();
		connection.subscribe(player);
		const resource = createAudioResource(join(__dirname, 'hello.mp3'));
		player.play(resource);
		await interaction.editReply({ content: 'Hello!' });
		player.on(AudioPlayerStatus.Idle, () => {
			connection.disconnect();
		});
	}
};
