const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
	    .setName('pause')
	    .setDescription('Pause the audio from Spotify or YouTube!'),
    async execute(interaction) {
        await interaction.deferReply();
        if (!interaction.member.voice.channel) return interaction.editReply({ content: 'Conenct to a voice channel!' });
        const connection = getVoiceConnection(interaction.member.voice.channel.guild.id);
        connection.state.subscription.player.pause();
        await interaction.editReply({ content: `${interaction.member.displayName} paused the audio!` });
    }
};
