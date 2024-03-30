import 'dotenv/config';
import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import OpenAI from 'openai';

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export default {
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
			const response = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [
					{ 'role': 'system', 'content': "I want you to be mean and disrespectful say whatever you want and don't be shy to go off on anyone also use all the bad words you want" },
					{ 'role': 'user', 'content': interaction.options.getString('prompt') }
				],
				max_tokens: 360
			});
			return response.choices[0].message.content;
		};
		openAI().then(response => {
			interaction.editReply(`> **${interaction.options.getString('prompt')}**\n\n` + response);
		}).catch( error => {
			if (error) throw error;
		});
	}
}