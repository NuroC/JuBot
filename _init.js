const request = require("request");
const api_requestheaders = require("./functions/api/api_requestheaders");
const { _rf } = require("./functions/_");
const _error = require("./functions/_error");
const _executetimers = require("./functions/_executetimers");
const _log = require("./functions/_log");
const _stackname = require("./functions/_stackname");
const c = require("./config.json");
const urls = require("./variables/urls");
const _checkenv = require("./functions/_checkenv");
const paths = require("./variables/paths");
const _requestopts = require("./functions/_requestopts");
const _regex = require("./functions/_regex");
const _staticspacer = require("./functions/_staticspacer");
const replacevariableslive = require("./functions/replacevariableslive");
const replacevariables = require("./functions/replacevariables");
let queuedreconnect = -1;

global.test = "test";
global.variables = {
    varstatic: require("./variables/varstatic"),
    vars: require("./variables/vars")
};
global.functions = require("./functions/_");

function _init(){
    let j = require("./variables/j");
    // console.clear();
    let channels = _rf(paths.channels, true);

    process.on("unhandledRejection", (rej) => {
        console.error(rej);
        _error(rej)
        // console.error(new Error(rej));
    });

    if(c.connect.twitch){
        j.client.connect(); 
        j.join(_rf(j.paths().clientchannels, true).channels, j.client, "channels");

        j.client.on("ready", () => {
            _log(1, `${_stackname("client", "connect")[3]} Successful`);
            // setTimeout(() => {_pi_blink();setInterval(_pi_blink, 2000)}, ((Date.now().toString().slice(-5, -1))%10000))
        });
        j.client.on("error", error => {
            if(error){
                _log(2, `${_stackname("client", "error")[3]} ${error.message}`);
                if(error.message.toLowerCase().includes("connection closed due to error")){
                    if(queuedreconnect <= 0){
                        reconnect();
                    }
                }
            }
        });

        j.client.on("close", () => {
            _log(2, `${_stackname("client", "close")[3]}`);
            setTimeout(() => {
                reconnect();
            }, 10000);
        });

        setInterval(reconnect, j.c().intervals.reconnect.client);
    };

    if(c.connect.twitch_view){
        j.viewclient.connect(); 
        j.join(_rf(j.paths().clientchannels, true).viewchannels, j.viewclient, "viewchannels");

        j.viewclient.on("ready", () => {
            _log(1, `${_stackname("viewclient", "connect")[3]} Successful`);
        });

        j.viewclient.on("error", error => {
            if(error){_log(2, `${_stackname("viewclient", "error")[3]} ${error.message}`);}
        });
    };

    if(c.connect.discord){
        j.dc.client.login(j.e().DC_TOKEN);

        j.dc.client.on("ready", () => {
            _log(1, `${_stackname("discord", "connect")[3]} Successful`);
        });
    };

    function reconnect(){
        _log(1, `${_stackname("client", "reconnect")[3]} Called`);
        if(j.client.connected){
            _log(1, `${_stackname("client", "reconnect")[3]} Already connected`);
            return;
        }
        if(queuedreconnect > -1) return;
        queuedreconnect = 0;
        // attemptreconnect();
        // let recint = setInterval(() => {
        //     attemptreconnect();
        // }, 15000);

        function attemptreconnect(){
            queuedreconnect++;
            try {
                _log(1, `${_stackname("client", "reconnect")[3]} Triggered`);
                j.client.connect()
                .then(() => {
                    _log(1, `${_stackname("client", "reconnect")[3]} Successfully Reconnected after ${queuedreconnect} attempts`);
                    j.viewclient.connect();
                    queuedreconnect = -1;
                    clearInterval(recint);
                    return;
                })
                .catch(e => {
                    console.error(new Error(e));
                })
            } catch(e) {
                console.error(new Error(e));
                _log(2, `${_stackname("client", "reconnect")[3]} Reconnecting failed (${queuedreconnect}. attempt)`);
            }

            if(queuedreconnect >= 3){
                _log(2, `${_stackname("client", "reconnect")[3]} Restarting process after ${queuedreconnect} failed reconnection attempts`);
                setTimeout(() => {
                    process.exit();
                }, 1000);
            }
        };
    };

    _executetimers();
    _log(1, `${_stackname("timers")[3]} Executed`);

    if(!_checkenv(j.e(), "OS", 0, "Windows_NT")){
        setTimeout(getapierrors, 3000);
        setInterval(getapierrors, j.c().intervals.errors);
    }

    function getapierrors(){
        request(`${urls.api.__url("errors", "GET")}`, {method: "GET", headers: api_requestheaders()}, (e, r) => {
            if(e){
                console.error(new Error(e));
            } else {
                if(j.functions().regex.jsonreg().test(r.body)){
                    let dat = JSON.parse(r.body);
                    _log(1, `${_stackname("api", "get", "errors")[3]} ${dat.data.split("\n").length-1}`);
                    if(dat.status == 200 && dat.data.length > 0){
                        j.client.say(j.env().T_USERNAME, `@JUBOT_ADMIN, Cached ${(dat.data.split("\n").length-1).toFixed(0)} Errors ( ${urls.api._base}:${urls.api._port}${urls.api._endpoints.GET.errors} / \\\\JUPI\\pi\\home\\pi\\FTP\\files\\api\\data\\errors.txt )`);
                    }
                } else {
                    _log(2, `${_stackname("api", "get", "errors", "error")[3]} ${r.body}`);
                }
            }
        })
    };

    if(j.c().connect.twitch_notifications && j.c().modules.notifications){
        setTimeout(getlivechannels, 3000);
        setInterval(getlivechannels, j.c().intervals.live_check);
    }

    async function getlivechannels(){
        let checklivechannels = Object.keys(channels.channels).filter(livechan => {return channels.channels[livechan].notifications && channels.channels[livechan].notifications.live && [1].includes(channels.channels[livechan].notifications.live.state)})
        _log(1, `${_staticspacer("notifications", "get")} [${checklivechannels.length}] ${checklivechannels}`);
        if(checklivechannels.length > 0){
            request(`${urls.twitch.streams.get}?user_id=${checklivechannels.join("&user_id=")}`, _requestopts(), (e, r) => {
                if(e){
                    console.error(e);
                } else {
                    if(_regex.jsonreg().test(r.body)){
                        let dat = JSON.parse(r.body);
                        if(dat.data.length > 0){
                            for(let livechan in dat.data){
                                // console.log(dat.data[livechan])
                                replacevariableslive(channels.channels[dat.data[livechan].user_id].notifications.live.message || j.c().notifications.defaultmessages.live, dat.data[livechan])
                                .then(msg => {
                                    replacevariables(j, msg)
                                    .then(msg2 => {
                                        j.send(0, dat.data[livechan].user_login, msg2)
                                    })
                                    .catch(e => {
                                        j.send(0, dat.data[livechan].user_login, msg)
                                    })
                                })
                            }
                        }
                    }
                }
            })
        }
    };

    // Reference: https://github.com/SevenTV/EventAPI/
    
    if(j.c().connect.ws.api){
        j.ws.client.on("open", e => {
            _log(1, `${_stackname("ws", "api")[3]} Connected`);
            j.ws.client.send(JSON.stringify({"type":"connect","name":"jubot","led_pin":c.raspi.led_pin}));
        });
        
        j.ws.client.on("close", e => {
            _log(2, `${_stackname("ws", "api")[3]} Closed`);
            let wsreconnectint = setInterval(() => {
                if(j.ws.client.readyState !== 1){
                    j.ws.client.close();
                    j.ws.client = new j.modules.ws.WebSocket(`ws://${j.urls().api._base.replace("http://", "")}:${j.urls().ws._port}`)
                    _log(2, `${_stackname("ws", "api")[3]} Re-Created`);
                } else {
                    _log(1, `${_stackname("ws", "api")[3]} Reconnected`);
                    clearInterval(wsreconnectint);
                }
            }, (e == 1006 ? j.c().intervals.reconnect.ws : 30000));
            // ENETUNREACH  1006
        });
    
        j.ws.client.on("error", e => {
            console.error(new Error(e));
            _log(2, `${_stackname("ws", "api")[3]} Error`);
        });
    
        j.ws.client.on("pong", p => {
            j.ws.client.pong(JSON.stringify({"type":"pong","start":p.start,"start_client":Date.now()}));
        });
    };
}

module.exports = _init;