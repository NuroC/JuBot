const gettoken = require("../functions/gettoken");
const getuser = require("../functions/getuser");
const token = require("../functions/token");
const _pixelize = require("../functions/_pixelize");
const _regex = require("../functions/_regex");
const _returnerr = require("../functions/_returnerr");
const _usertoken = require("../functions/_usertoken");
let j = require("../variables/j");

module.exports = {
    name: "oauth",
    id: "global_commands_oauth",
    aliases: ["token"],
    state: 1,
    add_version: "0.0.6",
    add_user: "jubewe",
    permission: j.c().perm.default,
    cooldown: 5000,
    cooldown_user: 5000,
    exec: async (j_) => {
        if(j_.message._.msg.split(" ")[1]){
            switch (j_.message._.msg.split(" ")[1]) {
                case "get": {
                    if(j_.message._.userperms._default){
                        if(j_.message._.msg.split(" ")[2]){
                            let oauthuser = j_.message._.msg.split(" ")[2];

                            getuser(1, oauthuser)
                            .then(u => {
                                _usertoken(0, u[1])
                                .then(t => {
                                    j.send(2, j_, `Raw Tokeninfo for ${_pixelize(u[0])} (${u[1]}): ${JSON.stringify(t)}`);
                                })
                                .catch(e => {
                                   j.send(2, j_, `Error: Could not get tokeninfo for ${_pixelize(u[0])} (${u[1]}): ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                                })
                            })
                            .catch(e => {
                                console.error(new Error(e));
                                j.send(2, j_, `Error: Could not recieve userid ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                            })
                        } else {
                            j.send(2, j_, `Error: Expected user at position 2`);
                        }
                    } else {
                        j.send(2, j_, `Error: You do not have permission to perform that action`);
                    }

                    break;
                }

                case "set": {
                    if(j_.message._.msg.split(" ")[2]){
                        let oauthtoken = j_.message._.msg.split(" ")[2];
                        if(!_regex.tokenreg().test(oauthtoken)){
                            j.send(2, j_, `Error: Token on position 2 does not match the twitch token pattern`);
                            return;
                        }
                        let oauthuser = j_.message._.user;
                        if(j_.message._.msg.split(" ")[3]){
                            if(j_.message._.userperms._default){
                                oauthuser = j_.message._.msg.split(" ")[3];
                            } else {
                                j.send(2, j_, `Error: You do not have permission to perform that action`);
                                return;
                            }
                        }
                        
                        getuser(1, oauthuser)
                        .then(u => {
                            _usertoken(1, u[1], oauthtoken)
                            .then(t => {
                                j.send(2, j_, `Successfully set token for ${_pixelize(oauthuser)} (${u[1]}) [Expires in: ${t.expires_in}, Scopes: ${t.scopes.length}]`);
                            })
                            .catch(e => {
                                j.send(2, j_, `Error: Could not set token ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                            })
                        })
                        .catch(e => {
                            j.send(2, j_, `Error: Could not get userid of ${_pixelize(oauthuser)}`);
                        })
                    } else {
                        j.send(2, j_, `Error: No token specified`);
                    }

                    break;
                }

                case "revoke": {
                    if(j_.message._.msg.split(" ")[2]){
                        if(_regex.tokenreg().test(j_.message._.msg.split(" ")[2])){
                            let oauthtoken = j_.message._.msg.split(" ")[2];
                            token(0, oauthtoken)
                            .then(t => {
                                token(4, oauthtoken, t.client_id)
                                .then(t2 => {
                                    j.send(2, j_, `Successfully revoked token - Note: You cannot use this token anymore`);
                                })
                                .catch(e => {
                                    console.error(e)
                                    j.send(2, j_, `Error: Could not revoke token: ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                                })
                            })
                            .catch(e => {
                                j.send(2, j_, `Error: Could not recieve tokeninfo`);
                            })
                        } else {
                            let oauthuser = j_.message._.user;

                            if(j_.message._.msg.split(" ")[2]){
                                if(j_.message._.userperms._default){
                                    oauthuser = j_.message._.msg.split(" ")[2];
                                } else {
                                    j.send(2, j_, `Error: You do not have permission to perform that action`);
                                    return;
                                }
                            }

                            getuser(1, oauthuser)
                            .then(u => {
                                _usertoken(3, u[1])
                                .then(t => {
                                    j.send(2, j_, `Successfully revoked and deleted token of ${_pixelize(u[0])}`);
                                })
                                .catch(e => {
                                    // console.error(new Error(e))
                                    j.send(2, j_, `Error: Could not revoke token of ${_pixelize(u[0])} (${u[1]}) ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                                })
                            })
                            .catch(e => {
                                console.error(new Error(e));
                                console.error(e);
                                j.send(2, j_, `Error: Could not recieve userid`);
                            })
                        }
                    } else {
                        j.send(2, j_, `Error: No token to revoke given`);
                    }

                    break;
                }

                case "info": {
                    if(j_.message._.msg.split(" ")[2]){
                        let oauthtoken = j_.message._.msg.split(" ")[2];

                        if(!_regex.tokenreg().test(oauthtoken)){
                            if(_regex.usernamereg().test(oauthtoken)){
                                if(j_.message._.userperms._default){
                                    getuser(1, oauthtoken)
                                    .then(u => {
                                        _usertoken(0, u[1])
                                        .then(t => {
                                            j.send(2, j_, `Tokeninfo: Clientid: ${t.client_id}, Expires in: ${t.expires_in}, User login: ${t.login}, User id: ${t.user_id}, Scopes: ${t.scopes.length},`);
                                        })
                                        .catch(e => {
                                            j.send(2, j_, `Error: Could not recieve tokeninfo of ${_pixelize(u[0])} (${u[1]}) ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                                        })
                                    })
                                    .catch(e => {
                                        j.send(2, j_, `Error: Could not recieve userid of ${_pixelize(oauthtoken)} ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                                        return;
                                    })
                                } else {
                                    j.send(2, j_, `Error: You do not have permission to perform that action`);
                                    return;
                                }
                            }
                        } else {
                            gettoken(oauthtoken)
                            .then(t => {
                                j.send(2, j_, `Tokeninfo: Clientid: ${t.client_id}, Expires in: ${t.expires_in}, User login: ${t.login}, User id: ${t.user_id}, Scopes: ${t.scopes.length},`);
                            })
                            .catch(e => {
                                j.send(2, j_, `Error: Could not recieve tokeninfo ${_returnerr(e, 0)} ${_returnerr(e, 1)}`);
                            })
                        }

                    } else {
                        j.send(2, j_, `Error: No token given`);
                    }

                    break;
                }

                default: {
                    j.send(2, j_, `Error: Option not found`);
                }
            }
        } else {
            j.send(2, j_, `Error: No option specified`);
        }
    }
}