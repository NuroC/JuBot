let j = require("../variables/j");

module.exports = {
    name: "eval",
    id: "global_commands_eval",
    aliases: [],
    state: 1,
    add_version: "0.0.2",
    add_user: "jubewe",
    permission: j.c().perm.botdefault,
    send_msg_noperm: true,
    cooldown: -1,
    cooldown_user: -1,
    exec: async (j_) => {
        if(j_.message._.msg.split(" ")[1] !== undefined){
            let evalmsg = j_.message._.msg.split(" ");
            evalmsg.shift();
            evalmsg = evalmsg.join(" ");
            try {
                let eval_ = await eval(`(async () => {${evalmsg}})()`);
                j.send(2, j_, `Successfully executed code [${typeof eval_}]> ${eval_}`);
            } catch(e){
                console.error(e);
                j.send(2, j_, `Error: Could not execute code: ${e.message}`);
            }
        } else {
            j.send(2, j_, `Error: Nothing to execute given`);
        }
    }
};