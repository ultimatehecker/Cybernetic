const handleCommand = require('./interactions/command.js');
const handleComponent = require('./interactions/component.js');

module.exports = (Discord, client, interaction) => {
    if(interaction.isChatInputCommand()) return handleCommand(Discord, client, interaction)
    if(interaction.isMessageComponent())  return handleComponent(Discord, client, interaction)
};