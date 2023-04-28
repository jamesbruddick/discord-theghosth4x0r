const { join } = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
	    .setName('hello')
	    .setDescription('TheGhostH4x0r says Hello!'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.member.voice.channel) return interaction.editReply({ content: 'Conenct to a voice channel!' });
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId:  interaction.guild.id,
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