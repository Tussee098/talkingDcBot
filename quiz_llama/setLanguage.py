from langchain_community.llms import Ollama
import argparse
from elevenlabs.client import ElevenLabs
from elevenlabs import save
from loader import Loader

loader = Loader()

client = ElevenLabs(
  api_key=loader.get_key("e_labs_key")  # Defaults to ELEVEN_API_KEY
)

# Create the argument parser
parser = argparse.ArgumentParser(description="Set Language.")
parser.add_argument('language', type=str, help="The Language")

# Parse the arguments
args = parser.parse_args()

# Get the category from parsed arguments
language = args.language

# Create the model instance
model = Ollama(model="llama3")

# Create the question prompt
text = (
   "The language have been set to " + language + "."
)


audio = client.generate(
  text=text,
  voice="EMIL",
  model="eleven_turbo_v2"
)
save(audio, filename='answer.mp3')
