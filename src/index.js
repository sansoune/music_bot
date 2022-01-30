const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice")
const yts = require("yt-search")
const ytc = require("ytdl-core")
const Discord = require("discord.js")
const config = require("./config.json")



const client = new Discord.Client({
    intents: 32767
})


client.on("ready", () => {
    console.log("i am ready")
})


client.on("messageCreate", async message =>{
    if (!message.content.startsWith(config.prefix)) return
    const args = message.content.substring(config.prefix.length + 1).split(/ +/)
    const channel = message.member.voice.channel
    if(!channel) return message.channel.send("please join a voice channel")

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    })


    if(args[0] === "play"){
        
        const video = await search(args)
        if(video){
            try {
                const srteam = ytc(video.url, {filter: "audioonly"})
                // await connection.play(srteam, { seek: 0, volume: 1, type: "opus" })
                // .on(finish, () => {
                //     voiceChannel.leave();
                // });
                const player = createAudioPlayer()
                const resource = createAudioResource(srteam)
                player.on('error', (err) => {
                    console.log("error: " + err)
                })
                async function play() {
                    await player.play(resource)
                    connection.subscribe(player)
                }
                play()
            } catch (error) {
                throw error
            }
            
            
        }
    }if(args[0] === "leave"){
        connection.destroy()
    }
})

const search = async (args) => {
    args.splice(0, 1)
    const name = args.join(" ")
    const result = await yts(name)
    return (result.videos.length > 1) ? result.videos[0] : null
}

client.login(config.token)