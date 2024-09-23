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
parser = argparse.ArgumentParser(description="Quiz master question generator.")
parser.add_argument('category', type=str, help="The category for the quiz question")

# Parse the arguments
args = parser.parse_args()

# Get the category from parsed arguments
category = args.category

# Create the model instance
model = Ollama(model="llama3")

# Create the question prompt
question_prompt = "You are a very passionate quiz-master and ask a question in the category of " + category + ". Don't give answer options."

# Get the question from the model
question = model.invoke(question_prompt).lower().replace("sugar", "fuck").strip("*")

audio = client.generate(
  text=question,
  voice="Northern Terry",
  model="eleven_turbo_v2"
)
save(audio, filename='question.mp3')

print(question)
