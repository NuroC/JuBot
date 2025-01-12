const _channel = require("./_channel");
const customcommand = require("./customcommand");
const customcounter = require("./customcounter");
const customkeyword = require("./customkeyword");

const _regex = require("./_regex");

async function replacevariables(){
    let j = require("../variables/j");
    
    let j_ = [...arguments][0];
    let msg = [...arguments][1] || j_.message.content;

    if([null, undefined].includes(j_.message.message.messageText)) return msg;

    let replacements = {
        "user": j_.message._.usertag_,
        "user2": j_.message._.usertag,

        "sender": j_.message.userstate.username,
        "sendername": j_.message.userstate.username,
        "senderdisplayname": j_.message.userstate.displayname,
        "senderid": j_.message.userstate.id,
        "senderismod": j_.message.userstate.ismod,
        "senderismodraw": j_.message.userstate.mod,
        "sendercolor": j_.message.userstate.color,
        "senderissubscriber": j_.message.userstate.subscriber,
        "senderusertype": j_.message.userstate.usertype,
        "senderisturbo": j_.message.userstate.turbo,
        "senderbadges": j_.message.userstate.badges,
        "senderbadgesinfo": j_.message.userstate.badgesinfo,
        
        "channel": j_.message.channel.name,
        "channelname": j_.message.channel.name,
        "channeldisplayname": j_.message.channel.name,
        "channelid": j_.message.channel.id,
        
        "message": j_.message.message.content,
        "messageid": j_.message.message.id,
        "messagetype": j_.message.message.type,
        "messageisaction": j_.message.message.isAction,
        "messageisfirstmsg": j_.message.userstate.firstmsg,
        "messageischeer": j_.message.message.isCheer,
        "messagebits": j_.message.message.bits,
        "messagebitsraw": j_.message.message.bitsraw,
        "messageemotes": j_.message.message.emotesraw,
        "messageemotescount": j_.message.message.emotecount,

        "timestamp": j_.message.server.timestampRaw,
        "timestampraw": j_.message.server.timestamp,

        "prefix": j_.message._.prefix,
        "command": j_.message._.command,
        
    };

    let msgcommandreg = new RegExp(`\\$\\(commands+\\s+[^\\)]+\\)`, "gi");
    if(msgcommandreg.test(msg)){
        let msgcommand = msg.match(msgcommandreg);
        if(msgcommand !== null){
            for(let msgcommand2 in msgcommand){
                let commandname = msgcommand[msgcommand2].split(new RegExp(`\\$\\(commands+\\s+`, "i"))[1].split(new RegExp(`\\)`, "i"))[0].toLowerCase();
                let referenceidtest = _regex.j_id_custom_commandreg().test(commandname);
                await customcommand(0, j_, false, j_.message.channel.id, (referenceidtest ? commandname : null), (referenceidtest ? null : commandname))
                .then(cmd => {
                    msg = msg.replace(msgcommand[msgcommand2], cmd.response);
                })
                .catch(e => {
                    console.error(e)
                    msg = msg.replace(msgcommand[msgcommand2], "");
                })
            }
        } else {
            msg = msg.replace(msgcommandreg, `[Error: Internal Error]`);
        }
    };
    
    let msgkeywordreg = new RegExp(`\\$\\(keywords+\\s+[^\\)]+\\)`, "gi");
    if(msgkeywordreg.test(msg)){
        let msgkeyword = msg.match(msgkeywordreg);
        if(msgkeyword !== null){
            for(let msgkeyword2 in msgkeyword){
                let keywordname = msgkeyword[msgkeyword2].split(new RegExp(`\\$\\(keywords+\\s+`, "i"))[1].split(new RegExp(`\\)`, "i"))[0].toLowerCase();
                let referenceidtest = _regex.j_id_custom_keywordreg().test(keywordname);
                console.log(keywordname)
                await customkeyword(0, j_, false, j_.message.channel.id, (referenceidtest ? keywordname : null), (referenceidtest ? null : keywordname))
                .then(key => {
                    msg = msg.replace(msgkeyword[msgkeyword2], key.response);
                })
                .catch(e => {
                    console.error(e)
                    msg = msg.replace(msgkeyword[msgkeyword2], "");
                })
            }
        } else {
            msg = msg.replace(msgkeywordreg, `[Error: Internal Error]`);
        }
    };

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
                msg = msg.replace(msgindex[msgindex2], (j_.message.message.messageText.split(" ")[indexnum] || ""));
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
                        // Object.assign(this.j_, undefined);
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

    let msgcountreg = new RegExp(`\\$\\(count+(er)*\\s+(increment|update|set|get)+\\s+[\\w]+(\\s+[\\d]+)*\\)`, "gi");
    if(msgcountreg.test(msg)){
        let msgcountmatch = msg.match(msgcountreg);
        if(msgcountmatch !== null){
            for(let msgcount2 in msgcountmatch){
                let msgcountopt = msgcountmatch[msgcount2].split(new RegExp(`\\$\\(count+(er)*\\s+`, "i"))[2].split(new RegExp(`\\s+[\\w]+(\\s+[\\d]+)*\\)`, "i"))[0];
                let msgcountname = msgcountmatch[msgcount2].split(new RegExp(`\\$\\(count+(er)*\\s+(increment|update|set|get)+\\s+`))[3].split(new RegExp(`(\\s+[\\d]+)*\\)`, "i"))[0];
                let msgcountnum = msgcountmatch[msgcount2].split(new RegExp(`\\$\\(count+(er)*\\s+(increment|update|set|get)+\\s+[\\w]+\\s*`, "i"))[3].split(new RegExp(`\\)`, "i"))[0];
                msgcountnum = (msgcountnum.length > 0 ? msgcountnum : undefined);

                let msgcountidtest = _regex.j_id_custom_counterreg().test(msgcountname);
                switch (msgcountopt){
                    case "increment": {
                        await customcounter(5, j_, false, j_.message.channel.id, (msgcountidtest ? msgcountname : undefined), (msgcountidtest ? undefined : msgcountname), msgcountnum)
                        .then(counter => {
                            msg = msg.replace(msgcountmatch[msgcount2], counter.num);
                        })
                        .catch(e => {
                            msg = msg.replace(msgcountmatch[msgcount2], `[Error: ${e.msg || "code error"}]`);
                        })
                        break;
                    }

                    case "get": {
                        await customcounter(0, j_, false, j_.message.channel.id, (msgcountidtest ? msgcountname : undefined), (msgcountidtest ? undefined : msgcountname), msgcountnum)
                        .then(counter => {
                            msg = msg.replace(msgcountmatch[msgcount2], counter.num);
                        })
                        .catch(e => {
                            msg = msg.replace(msgcountmatch[msgcount2], `[Error: ${e.msg || "code error"}]`);
                        })
                        break;
                    }

                    case "set":
                    case "update": {
                        await customcounter(4, j_, false, j_.message.channel.id, (msgcountidtest ? msgcountname : undefined), (msgcountidtest ? undefined : msgcountname), msgcountnum)
                        .then(counter => {
                            msg = msg.replace(msgcountmatch[msgcount2], counter.num);
                        })
                        .catch(e => {
                            msg = msg.replace(msgcountmatch[msgcount2], `[Error: ${e.msg || "code error"}]`);
                        })
                        break;
                    }
                }
            }
        }
    };

    msg = msg.replace("$(test)", `$\(${Object.keys(replacements).join("\) $\(")}\)`);

    for(let replacement in replacements){
        msg = msg.replace(new RegExp(`\\$\\(${replacement}\\)`, "gi"), replacements[replacement]);
    };

    met = msg.replace(msgindexreg, "");
    msg = msg.replace(msgcommandreg, "");
    msg = msg.replace(msgkeywordreg, "");

    return msg;
};

module.exports = replacevariables;