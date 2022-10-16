module.exports = {
  checkenv: require("./_checkenv"),
  cleantime: require("./_cleantime"),
  combineArr: require("./_combineArr"),
  converttime: require("./_converttime"),
  _cooldown: require("./_cooldown"),
  _decoder: require("../express/functions/_decoder"),
  editchan: require("./_editchan"),
  _encoder: require("../express/functions/_encoder"),

  id: require("./_id"),
  log: require("./_log"),
  logcode: require("./_logcode"),
  mainpath: require("./_mainpath"),
  pad2: require("./_pad2"),
  _percentage: require("./_percentage"),
  permission: require("./_permission"),
  _pi_blink: require("./_pi_blink"),
  _pi_gpio: require("./_pi_gpio"),
  _pickrandom: require("./_pickrandom"),
  pixelize: require("./_pixelize"),
  requestopts: require("./_requestopts"),
  returner: require("./_returner"),
  returnerr: require("./_returnerr"),
  _rf: require("./_rf"),
  _stackname: require("./_stackname"),
  _staticspacer: require("./_staticspacer"),
  syncfile: require("./_syncfile"),
  timer: require("./_timer"),
  wf: require("./_wf"),
  _wf: require("./_wf"),
  cache: require("./cache"),
  channel: require("./channel"),

  regex: require("./_regex"),

  badgestoarr: require("./badgestoarr"),
  createclip: require("./createclip"),
  checktoken: require("./gettoken"),
  privmsg_parser: require("./privmsg_parser"),
  whisper_parser: require("./whisper_parser"),
  revoketoken: require("./revoketoken"),
  getuser: require("./getuser"),
  getuserbyid: require("./getuserbyid"),
  getuserid: require("./getuserid"),
  getuserperm: require("./getuserperm"),
  send: require("./send"),
  token: require("./token"),
  uptime: require("./uptime"),
  userperms: require("./userperms"),
  
  api: {
    api_requestheaders: require("./api/api_requestheaders"),
    
  }
};
