const { Client, GatewayIntentBits, } = require('discord.js');
const palavras = require ('./palavras.js')
const config = require('./config.json')

const { QuickDB } = require('quick.db');
const db = new QuickDB();

const client = new Client({ 
  intents: [ 
  GatewayIntentBits.Guilds,  
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildBans,
  GatewayIntentBits.GuildMessages,
  ]
 });

client.on('ready', async () => {
  console.log(`Aplicação ${client.user.username} ligada com sucesso!`)
  console.log(`Servidores: ${client.guilds.cache.size}`)
  client.user.setActivity('Mamãe Esta cuidando das crianças')
  let teste = await db.get("users")
  console.log(teste)
  
});



client.on("messageCreate", async (message) => { 

if (message.member.permissions.has('ModerateMembers')) return //retorna se o adm do grupo mandar a mensagem
if (message.author.bot) return // retorna se a mensagme for do bot



let user_palavroes = await db.get(`users.${message.author.username}.palavroes`)
let membro = message.guild.members.cache.get(message.author.id)
let mensagem = message.content.split(" ");
let limite_palavrao = 3
let mensagens_palavras_feias = 
[
  ` ${message.author.username}, PARE de usar essas PALAVRAS FEIAS! Se VOCÊ falar mais ${limite_palavrao - user_palavroes} palavrões VOCÊ vai ir DIRETO para o CASTIGO! `, 
  ` ${message.author.username}, EU JA TE AVISEI, PARE de usar essas PALAVRAS FEIAS! Se VOCÊ falar mais ${limite_palavrao - user_palavroes} palavrões VOCÊ vai ir DIRETO para o CASTIGO! `,
  ` ${message.author.username}, PARE IMEDIATAMENTE DE USAR ESSAS PALAVRAS FEIAS! Se VOCÊ falar mais ${limite_palavrao - user_palavroes} palavrões VOCÊ vai ir DIRETO para o CASTIGO! `,
]
  if (user_palavroes == 3){
    membro.timeout(3000,'falou demais').then(() =>{
      message.reply(`${message.author.username}, VAI AGORA FICAR DE CASTIGO 😡`)
      return
    })
    await db.add(`users.${message.author.username}.palavroes`, -3)
  }
  else{

  for (let index = 0; index < mensagem.length; index++) {
    if (palavras.indexOf(mensagem[index].toLowerCase()) != -1) {
      await db.add(`users.${message.author.username}.palavroes`, 1);
      message.reply(mensagens_palavras_feias[Math.floor(Math.random() * mensagens_palavras_feias.length)]);
    }
  }   
}

});                                      


client.login(config.token);