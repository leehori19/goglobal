const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getOpenAIResponse = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt,
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error.response.data);
    throw new Error('Failed to fetch response from OpenAI.');
  }
};

const getDeepLTranslation = async (text, targetLang) => {
  try {
    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      new URLSearchParams({
        auth_key: process.env.DEEPL_API_KEY,
        text,
        target_lang: targetLang.toUpperCase(),
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.translations[0].text;
  } catch (error) {
    console.error('DeepL API Error:', error.response.data);
    throw new Error('Failed to fetch translation from DeepL.');
  }
};

module.exports = {
  getOpenAIResponse,
  getDeepLTranslation,
};
