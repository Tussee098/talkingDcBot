# Talking Discord Bot (Trivia)

This is a Discord bot that lets you generate and answer trivia questions inside a Discord voice channel. It can also translate languages for extra fun!  

## Setup  

To connect the bot, follow these steps:  

1. **Download or Clone the Repository.**  
2. **Set Up Your Keys.**  
   - Rename `KeysExample.json` to `keys.json` (note the lowercase "k").  
   - Open `keys.json` and add your API keys:  
     - **Discord Bot Token:** Create a bot in [Discord's Developer Portal](https://discord.com/developers), copy its token, and paste it into `bot_token`. Make sure to grant the necessary permissions.  
     - **ElevenLabs API Key:** Create an account on [ElevenLabs](https://elevenlabs.io/) and add your key for text-to-speech.  
     - **AssemblyAI API Key:** Create an account on [AssemblyAI](https://www.assemblyai.com/) and add your key for speech-to-text.  
3. **Customize Personality & Settings.**  
   - Modify `quiz_llama/answer.py` to adjust the bot's personality and settings.  
4. **Install & Run Ollama Locally.**  
   - The bot uses Ollama for AI-generated trivia. Follow the [Ollama installation guide](https://ollama.com/) to set it up.  
5. **You're Ready to Go!**  
   - Your personal, quirky trivia master is now live. 🎉  

## Commands  

- `!question` – The bot listens to the user who typed the command. Once the speaker stops talking for 1 second, the bot generates a trivia question.  
- `!answer` – The bot listens to the user and, after a 1-second silence, generates an answer based on their response to the previous question.  

## Legal Notice  

The bot records the voice of the user who types `!answer` or `!question` and temporarily saves it on the host's computer (until overwritten by the next recording). The bot's host must ensure that users are informed and consent to this recording.  

## Technologies Used  

- **Ollama** – AI model for trivia generation  
- **ElevenLabs** – Text-to-Speech (TTS)  
- **AssemblyAI** – Speech-to-Text (STT)  
