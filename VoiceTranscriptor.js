const { EndBehaviorType, VoiceConnectionStatus } = require("@discordjs/voice");
const { OpusEncoder } = require("@discordjs/opus");
const userIDs = require('./keys.json')


class VoiceTranscriptor {


  

  // Constructor.
  constructor(Client, data, connection, target) {
    this.receiver = connection.receiver; // <- Audio receiver.
    this.speakers = new Set(); // <- Set of currently listened speakers.
    this.recordedData = Buffer.alloc(0); // <- Array to store recorded audio data.
    this.recordedFlag = false
    this.listeningFlag = false
    this.target = target
    // Remove the default listeners to use a custom function.
    this.receiver.speaking.removeAllListeners();
    
    // When a user is detected.
    this.receiver.speaking.on("start", (userId) => {
        
        if (!this.listeningFlag && userId == target){
          // if userID == answerer is answerer
            this.#listen(Client, data, userId);
        }
    });
  }

  /**
   * Transcribes the received audio from a specific user, provided they are not a bot,
   * have an allowed role, and are not already being listened to.
   * @param {import("discord.js").Client} Client - The Discord client.
   * @param {Object} data - Previously obtained data.
   * @param {String} userId - The ID of the user to listen to.
   */
  async #listen(Client, data, userId) {
    console.log(userId)
    // Classes and functions to use.
    const { DatabaseManager } = Client;
    const { Embeds, Guild, channel, guild } = data;
    console.log(userId)
    this.listeningFlag = true;
    // Subscription between the bot and the user.
    let subscription = this.receiver.subscribe(userId, {
        
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 1500,
      },
    });

    // Buffer for received audio data.
    const buffer = [];
    // Why do I have to have it at 48000?
    const encoder = new OpusEncoder(48000, 1);

    // When the bot receives data.
    subscription.on("data", (chunk) => {
      //console.log(`Received audio chunk. Length: ${chunk.length} bytes`)
      buffer.push(encoder.decode(chunk));
    });
    subscription.once("end", async () => {
        this.listeningFlag = false,
      // Handle the recorded audio data.
        this.recordedData = Buffer.concat(buffer);
        this.recordedFlag = true
    });
  }

  /*getRecordedData() {
    // Return the recorded data array.
    var tmp = this.recordedData
    //this.recordedData = Buffer.alloc(0)
    return tmp;
  }*/

  
}

module.exports = VoiceTranscriptor;
