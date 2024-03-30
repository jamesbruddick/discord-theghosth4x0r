import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import ytdl from 'ytdl-core-discord';

export default {
	data: new SlashCommandBuilder()
		.setName('audio')
		.setDescription('Listen to audio from Spotify or YouTube!')
		.addStringOption(option =>
			option.setName('yt')
				.setDescription('The YouTube video url...')
				.setRequired(true)
		),
	async execute(interaction) {
		if (!interaction.member.voice.channel) return interaction.reply({ content: 'Conenct to a voice channel!', ephemeral: true });
		await interaction.deferReply({ ephemeral: false });
		const connection = joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId:  interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
			selfDeaf: false
		});
		const player = createAudioPlayer();
		const info = await ytdl.getInfo(interaction.options.getString('yt'));
		const title = info.videoDetails.title;
		const stream = await ytdl(interaction.options.getString('yt'), { filter: 'audioonly' });
		const resource = createAudioResource(stream, { inputType: 'opus' });
		connection.subscribe(player);
		player.play(resource);
		await interaction.editReply({ content: `Now playing: ${title}` });
		player.on(AudioPlayerStatus.Idle, () => {
			connection.disconnect();
		});
	}
}