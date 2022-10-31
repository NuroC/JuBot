const _channel = require("./channel");
const customcommand = require("./customcommand");

const _regex = require("./_regex");

async function replacevariables(){
    // j, msg
    let j = [...arguments][0] || require("../variables/j");

    // let j = require("../variables/j")
    let msg = [...arguments][1] || j.message.content;

    if([null, undefined].includes(j.message.message.messageText)) return msg;

    let replacements = {
        "user": j.message._.usertag_,
        "user2": j.message._.usertag,

        "sender": j.message.userstate.username,
        "sendername": j.message.userstate.username,
        "senderdisplayname": j.message.userstate.displayname,
        "senderid": j.message.userstate.id,
        "senderismod": j.message.userstate.ismod,
        "senderismodraw": j.message.userstate.mod,
        "sendercolor": j.message.userstate.color,
        "senderissubscriber": j.message.userstate.subscriber,
        "senderusertype": j.message.userstate.usertype,
        "senderisturbo": j.message.userstate.turbo,
        "senderbadges": j.message.userstate.badges,
        "senderbadgesinfo": j.message.userstate.badgesinfo,
        
        "channel": j.message.channel.name,
        "channelname": j.message.channel.name,
        "channeldisplayname": j.message.channel.name,
        "channelid": j.message.channel.id,
        
        "message": j.message.message.content,
        "messageid": j.message.message.id,
        "messagetype": j.message.message.type,
        "messageisaction": j.message.message.isAction,
        "messageisfirstmsg": j.message.userstate.firstmsg,
        "messageischeer": j.message.message.isCheer,
        "messagebits": j.message.message.bits,
        "messagebitsraw": j.message.message.bitsraw,
        "messageemotes": j.message.message.emotesraw,
        "messageemotescount": j.message.message.emotecount,

        "timestamp": j.message.server.timestampRaw,
        "timestampraw": j.message.server.timestamp,

        "prefix": j.message._.prefix,
        "command": j.message._.command,
        
    };

    let msgreferencereg = new RegExp(`\\$\\(references+\\s+[^\\)]+\\)`, "gi");
    if(msgreferencereg.test(msg)){
        let msgreference = msg.match(msgreferencereg);
        if(msgreference !== null){
            for(let msgreference2 in msgreference){
                let referencename = msgreference[msgreference2].split(new RegExp(`\\$\\(references+\\s+`, "i"))[1].split(new RegExp(`\\)`, "i"))[0].toLowerCase();
                let referenceidtest = _regex.j_id_custom_commandreg().test(referencename);
                await customcommand(0, j, false, j.message.channel.id, (referenceidtest ? referencename : null), (referenceidtest ? null : referencename))
                .then(cmd => {
                    msg = msg.replace(msgreference[msgreference2], cmd.response);
                })
                .catch(e => {
                    console.error(e)
                    msg = msg.replace(msgreference[msgreference2], "");
                })
            }
        } else {
            msg = msg.replace(msgreferencereg, `[Error: Internal Error]`);
        }
    }

    let msgsettingsreg = new RegExp(`\\$\\(settings+\\s+[\\w]+\\)`, "gi");
    if(msgsettingsreg.test(msg)){
        let msgsettings = msg.match(msgsettingsreg);
        if(msgsettings !== null){
            for(let msgsettings2 in msgsettings){
                let msgsetting = msgsettings[msgsettings2].split(new RegExp(`^\\$\\(settings+\\s+`, "i"))[1].split(new RegExp(`\\)$`))[0].toLowerCase();
                await new Promise((resolve) => {
                    _channel(0, null)
                    .then(ch => {
                        if(Object.keys(ch).includes(msgsetting)){
                            msg = msg.replace(msgsettings[msgsettings2], ch[msgsetting]);
                        } else {
                            msg = msg.replace(msgsettings[msgsettings2], `[Error: Setting not found]`);
                        }
                        return resolve();
                    })
                    .catch(e => {
                        msg = msg.replace(msgsettings[msgsettings2], `[Error: Could not find setting]`);
                        return resolve();
                    })
                })
            }
        } else {
            msg = msg.replace(msgsettingsreg, `[Error: Internal Error]`);
        }
    };

    let msgindexreg = new RegExp(`\\$\\(message\\[[\\d]+\\]\\)`, "gi");
    if(msgindexreg.test(msg)){
        let msgindex = msg.match(msgindexreg);
        if(msgindex !== null){
            for(let msgindex2 in msgindex){
                let indexnum = msgindex[msgindex2].split(new RegExp(`\\$\\(message\\[`))[1].split(new RegExp(`\\]\\)`))[0];
                msg = msg.replace(msgindex[msgindex2], (j.message.message.messageText.split(" ")[indexnum] || ""));
            }
        } else {
            msg = msg.replace(msgindexreg, `[Error: Internal Error]`);
        }
    };

    let msgrequestreg = new RegExp(`\\$\\(request+\\s+[^\\)]+\\)`, "gi");
    let msgrequestreg2 = new RegExp(`\\$\\(request+\\s+[^\\)]+\\)(\\.+[\\w]+)*`, "gi");
    if(msgrequestreg.test(msg)){
        let msgrequest = msg.match(msgrequestreg2);
        if(msgrequest !== null){
            for(let msgrequest2 in msgrequest){
                let msgurl = msgrequest[msgrequest2].split(new RegExp(`\\$\\(request+\\s+`, "i"))[1].split(new RegExp(`\\)`, "i"))[0];
                let msgjsonkey = (msgrequestreg2.test(msg) ? msgrequest[msgrequest2].split(msgrequestreg)[1].split(".")[1] : null);
                if(j.functions()._regex.urlreg().test(msgurl)){
                    await new Promise((resolve) => {
                        j.modules.request(msgurl, {method: "GET"}, (e, r) => {
                            if(e){
                                msg = msg.replace(new RegExp(`\\$\\(request+\\s+${msgurl}\\)`, "i"), `[Error: ${e.code}]`);
                            } else {
                                let dat = r.body;
                                if(j.functions()._regex.jsonreg().test(dat)){
                                    dat = JSON.parse(dat);
                                    if(msgjsonkey){
                                        dat = dat[msgjsonkey];
                                    }

                                    if(typeof dat === "object"){
                                        dat = JSON.stringify(dat);
                                    }
                                }
                                msg = msg.replace(msgrequest[msgrequest2], dat);
                            }
                            return resolve();
                        });
                    })
                } else {
                    msg = msg.replace(new RegExp(`\\$\\(request+\\s+${msgurl}\\)`, "i"), `[Error: URL does not match urlregex]`);
                }
            }
        } else {
            msg = msg.replace(new RegExp(`\\$\\(settings+\\s+${msgsetting}\\)`, "i"), `[Error: Internal Error]`);
        }
    };

    // let msgreplacereg = new RegExp();

    let msgevalreg = new RegExp(`\\$\\(eval+\\s+[^\\)]+\\)`, "gi");
    if(msgevalreg.test(msg)){
        msg = msg.replace(msgevalreg, `[Error: Not finished yet]`);
        /*let msgeval = msg.match(msgevalreg);
        if(msgeval !== null){
            for(let msgeval2 in msgeval){
                let msgeval_ = msgeval[msgeval2].split(new RegExp(`^\\$\\(eval+\\s+`, "i"))[1].split(new RegExp(`\\)$`, "i"))[0]
                try {
                    let a = "a";
                    function exec_(resolve){
                        "use strict";
                        let b = "b";
                        // Object.assign(this.j, undefined);
                        // Object.assign(this.require, undefined);
                        var msgevalexec = eval(msgeval_);
                        return resolve(msgevalexec);
                    };
                    await new Promise(exec_)
                    .then(msgevalexec => {
                        msg = msg.replace(msgeval[msgeval2], `[EVAL] ${msgevalexec}`);
                    })
                } catch(e) {
                    msg = msg.replace(msgeval[msgeval2], `[Error: Could not execute script: ${e.message}`);
                }
            }
        } else {
            msg = msg.replace(msgevalreg `[Error: Internal Error]`);
        }*/
    };

    msg = msg.replace("$(test)", `$\(${Object.keys(replacements).join("\) $\(")}\)`);

    for(let replacement in replacements){
        msg = msg.replace(new RegExp(`\\$\\(${replacement}\\)`, "gi"), replacements[replacement]);
    };

    met = msg.replace(msgindexreg, "");
    msg = msg.replace(msgreferencereg, "");

    return msg;
};

module.exports = replacevariables;