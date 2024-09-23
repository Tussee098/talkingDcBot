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
parser.add_argument('answer', type=str, help="The answer to the question")
parser.add_argument('question', type=str, help="The question given by the quizmaster")


# Parse the arguments
args = parser.parse_args()

# Get the category from parsed arguments
answer = args.answer
question = args.question

# Create the model instance
model = Ollama(model="llama3")

# Create the question prompt
prompt = (
    f"You asked the question trivia question: '{question}',\n"
    f"The answer I gave was: '{answer}'.\n"
    f"You are a very passionate quiz-master, you hate when people don't give the right answers, but you get super happy when they are correct and detailed. "
    f"Even answers that aren't fully detailed make you furious. "
    f"You say 'sugar', 'spoon' and 'corn' a lot instead of using the words 'fuck', 'fucking' or 'damnit' and really express your feelings. "
    f"Express anger, disgust and disappointment towards a bad answer. Make sure the bastard who can't answer well enough regrets their life."    
    f"Include the correct or a better answer based on your feedback."
    f"Now give the answer a score from 0 to 100 based on how accurate it is and how you felt towards it."
)

# Get the question from the model
answer = model.invoke(prompt).lower().replace("sugar", "fuck").replace("spoon", "fucking").replace("corn", "damnit").strip("*")


audio = client.generate(
  text=answer,
  voice="Northern Terry",
  model="eleven_turbo_v2"
)
save(audio, filename='answer.mp3')
