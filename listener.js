const config = require('./keys.json');

bot_token = config.bot_token;
apiKey_assemblyAI = config.assemblyai_key;


const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType, AudioPlayerStatus} = require('@discordjs/voice');
const { Readable } = require('stream');

const player = createAudioPlayer({
    inputType: StreamType.Arbitrary,
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpeg_static);
const VoiceTranscriptor = require('./VoiceTranscriptor'); // Adjust the path based on your project structure
const SpeechToText = require('./speechToText');
const PythonRunner = require('./PythonRunner')

class Sylvie extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates,
            ],
        });
        this.targetChannel = null;
        this.postThread = null;
        this.connection = null
        this.voiceTranscriptor = null
        this.category = null
        this.questionGotten = false
        this.question = null
        this.pause = null
        this.typesOfInput = ['category', 'answer', 'translate', 'language']
        this.input = null
        this.translateLanguage = null
        this.target = null
    }

    async onReady() {
        console.log(`Logged in as ${this.user.tag}`);
    }

    async onMessage(message) {
        console.log("someone wrote and it was user: " + message.author);
        if (message.author.bot) return;
        if (message.content.startsWith('!category')) {
            this.category = message.content.replace('!category', '').trim();
            console.log(this.category)
        }
        if (message.content.startsWith('!join')) {
            const channel = message.member.voice.channel;
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
            
            this.targetChannel = message.channel;
            this.connection = connection
            this.connection.subscribe(player);
            
        }
        if (message.content.startsWith('!category') && this.connection != null) {
            this.input = this.typesOfInput[0]
            this.voiceTranscriptor = new VoiceTranscriptor(this, {}, this.connection, message.author);
            this.postThread = setInterval(() => this.startListener(this.voiceTranscriptor), 1000);

        } else if (message.content.startsWith('!answer') && this.connection != null) {
            this.input = this.typesOfInput[1]
            this.voiceTranscriptor = new VoiceTranscriptor(this, {}, this.connection, message.author);
            this.postThread = setInterval(() => this.startListener(this.voiceTranscriptor), 1000);
        } else if (message.content.startsWith('!translate') && this.connection != null) {
            this.input = this.typesOfInput[2]
            this.voiceTranscriptor = new VoiceTranscriptor(this, {}, this.connection, message.author);
            this.postThread = setInterval(() => this.startListener(this.voiceTranscriptor), 1000);
        } else if (message.content.startsWith('!language') && this.connection != null) {
            this.input = this.typesOfInput[3]
            this.voiceTranscriptor = new VoiceTranscriptor(this, {}, this.connection, message.author);
            this.postThread = setInterval(() => this.startListener(this.voiceTranscriptor), 1000);
        } else if (message.content.startsWith('!question') ) { // To repeat the question
            if(this.question) {
                var resource = createAudioResource('question.mp3')
                player.play(resource);
            }
        } else if(message.content.startsWith('!oldanswer') ) {
            var resource = createAudioResource('.\\answer.mp3')
            player.play(resource);
            console.log("gfgdf")
        }
    }

    startListener(voiceTranscriptor) {
        // VoiceTranscriptor will handle the recording logic
        // You can handle the recorded data in the VoiceTranscriptor class
        var recordedData = voiceTranscriptor.recordedData
        if (voiceTranscriptor.recordedFlag && recordedData.length > 0) {
            clearInterval(this.postThread);
            console.log("recorded")
            fs.appendFileSync('recorded_audio.pcm', recordedData);
            this.createAudioFile() // Make the .pcm file to any listenable audiofile
        }
        
    }

    createAudioFile() {
        const pcmFilePath = 'recorded_audio.pcm';
        const audioFilePath = 'recorded_audio.mp3';
    
        const command = ffmpeg()
            .input(pcmFilePath)
            .inputFormat('s16le')  // Specify the input format for raw PCM data
            .audioCodec('libmp3lame')
            .audioQuality(1) // Adjust the quality parameter based on your preferences (0 to 9, where 0 is the highest quality)
            .audioBitrate(48000)
            .audioFrequency(44100)
            .audioChannels(1)
            .toFormat('mp3')
            .on('end', () => {
                console.log('Audio file conversion finished');
                // Optionally, you can delete the PCM file after conversion
                fs.unlinkSync(pcmFilePath);
                
                this.talk(audioFilePath)
            })
            .on('error', (err) => {
                console.error('Error:', err);
            });
        
        // Save or handle the audio file as needed
        command.save(audioFilePath);
        console.log('Audio file conversion started');
        
    }


    
    async talk(audioFilePath){
        //TO play audio file
        
        //------------------

        const speechToText = new SpeechToText(apiKey_assemblyAI, audioFilePath);
        var textFromSpeech = null
        var runner = null
        await speechToText.run().then(transcript => {
            console.log("Done");
            textFromSpeech = transcript
            runner = new PythonRunner();
            
        }).catch(error => {
            console.error('Error:', error);
        });
        var resource
        if(this.input == this.typesOfInput[0]){
            this.question = await runner.runPythonScript('quiz_llama/question.py', [textFromSpeech])
            resource = createAudioResource('.\\question.mp3')
            
        } else if (this.input == this.typesOfInput[1]){
            await runner.runPythonScript('quiz_llama/answer.py', [textFromSpeech, this.question])
            resource = createAudioResource('.\\answer.mp3')
        }
        else if (this.input == this.typesOfInput[2]){
            await runner.runPythonScript('quiz_llama/translator.py', [textFromSpeech, this.translateLanguage])
            resource = createAudioResource('.\\answer.mp3')
        } else if (this.input == this.typesOfInput[3]){
            await runner.runPythonScript('quiz_llama/setLanguage.py', [textFromSpeech])
            this.translateLanguage = textFromSpeech
            resource = createAudioResource('.\\answer.mp3')
        }
       
        
        player.play(resource)
        console.log(textFromSpeech)
    }

   

    
    // Event listener for player 'error' event
    
}
player.on('error', (error) => {
    console.error('Audio player error:', error);
});
const sylvie = new Sylvie();

sylvie.login(bot_token); // Update with your bot token
sylvie.on('ready', () => sylvie.onReady());
sylvie.on('messageCreate', (message) => sylvie.onMessage(message));


