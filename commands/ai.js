const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

module.exports = {
	data: new SlashCommandBuilder()
	    .setName('ai')
	    .setDescription('OpenAI ChatGPT 3.5')
	    .addStringOption(option =>
		    option.setName('prompt')
			    .setDescription('Type your question...')
			    .setRequired(true)
	    ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        async function openAI() {
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'A helpful assistant' },
                    { role: 'user', content: interaction.options.getString('prompt') }
                ],
            });
            return response.data.choices[0].message.content;
        };
        openAI().then(response => {
            interaction.editReply(`> **${interaction.options.getString('prompt')}**\n\n` + response);
        }).catch( error => {
            if (error) throw error;
        });
    }
};
