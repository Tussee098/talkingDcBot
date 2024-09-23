import argparse
from elevenlabs.client import ElevenLabs
from elevenlabs import save
from deep_translator import GoogleTranslator
from loader import Loader

loader = Loader()

client = ElevenLabs(
  api_key=loader.get_key("e_labs_key")  # Defaults to ELEVEN_API_KEY
)

# Create the argument parser
parser = argparse.ArgumentParser(description="Translator.")
parser.add_argument('text', type=str, help="The text that will be translated")
parser.add_argument('language', type=str, help="The language it will translate into")

# Parse the arguments
args = parser.parse_args()

# Example usage:
# Get the category from parsed arguments
text = args.text
language = args.language

language_codes = {
    'english': 'en',
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt',
    'russian': 'ru',
    'chinese': 'zh-cn',
    'japanese': 'ja',
    'korean': 'ko',
    # Add more languages as needed
}

def translate_text(text, language):
    # Convert the language name to lowercase to ensure case-insensitivity
    language = language.lower().strip(".")
    print(language)
    # Get the language code from the dictionary
    language_code = language_codes.get(language)
    print(language_code)
    if not language_code:
        return f"Language '{language}' is not supported."

    # Initialize the translator
    translator = GoogleTranslator(target=language_code)

    # Translate the text
    translated = translator.translate(text)

    # Return the translated text
    return translated


translated_text = translate_text(text, language)

audio = client.generate(
  text=translated_text,
  voice="EMIL",
  model="eleven_multilingual_v2"
)

save(audio, filename='answer.mp3')
