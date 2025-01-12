const getuser = require("../functions/getuser");
const _permission = require("../functions/_permission");
const _pixelize = require("../functions/_pixelize");
const _returnerr = require("../functions/_returnerr");
let j = require("../variables/j");

module.exports = {
    name: "permission",
    id: "global_commands_permission",
    aliases: ["perm"],
    state: 1,
    add_version: "0.1.0",
    add_user: "jubewe",
    permission: j.c().perm.botowner,
    cooldown: -1,
    cooldown_user: -1,
    exec: async (j_) => {
        let permissions = j.files().permissions;

        if(j_.message._.args()[0]){
            let permuser = j_.message._.args()[0];
            if(j_.message._.args()[1]){
                let permnum = j_.message._.args()[1];
                if(!isNaN(permnum) && Object.keys(permissions.permissions).includes(permnum)){
                    getuser(1, permuser)
                    .then(u => {
                        _permission(1, permnum, u[1])
                        .then(p => {
                            console.log(p);
                            j.send(2, j_, `Successfully set perm of ${_pixelize(permuser)} (${u[1]}) to ${permnum}`);
                        })
                        .catch(e => {
                            j.send(2, j_, `Error: Could not set perm of ${_pixelize(permuser)} (${u[1]}) to ${permnum}: ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                        })
                    })
                    .catch(e => {
                        console.error(e);
                        j.send(2, j_, `Error: Could not get user: ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                    })
                } else {
                    j.send(2, j_, `Error: Invalid perm-number`);
                }
            } else {
                j.send(2, j_, `Error: No perm given`);
            }
        } else {
            j.send(2, j_, `Error: No user given`);
        }
    }
}