// Start by making sure the `assemblyai` package is installed.
// If not, you can install it by running the following command:
// npm install assemblyai

const { AssemblyAI } = require( 'assemblyai');

class SpeechToText {
    constructor(api_key, FILE_URL) {
        this.client = new AssemblyAI({
            apiKey: api_key,
        });
        this.FILE_URL = FILE_URL;
        this.data = {
            audio: this.FILE_URL
        };
    }

    async run() {
        try {
            const transcript = await this.client.transcripts.transcribe(this.data);
            console.log(transcript.text);
            return transcript.text;
        } catch (error) {
            console.error('Error during transcription:', error);
        }
    }
}


module.exports = SpeechToText;
