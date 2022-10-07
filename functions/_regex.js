module.exports = {
    numregex: () => {return new RegExp(`^([\\d]{1,})$`, "g")},
    numregex_: (nur) => {return new RegExp(`^([\\d]{1,})$`, "g").test(nur)},
    usernamereg: () => {return new RegExp(`\\b[\\w]{1,32}\\b`, "g")},
    nobotreg: () => {return new RegExp(`(\\-)+(((no|remove)+bot(s*))|((r|n)+b))`, "g")},
    ranknumreg: () => {return new RegExp(`(\\-)+[\\d]+`, "g")},
    tokenreg: () => {return new RegExp(`\\b[\\w]{30}\\b`, "g")},
    timereg1: () => {return new RegExp(`\\b^([\\d]+[a-z]+)$\\b`, "g")},
    timereg2: () => {return new RegExp(`\\b^(([\\d]{2,}+\:){1,}+([\\d]{2}))$\\b`, "g")},
    timereg3: () => {return new RegExp(`\\b^(\\d{2,}+\:){1,}+(\\d{2})+[a-z]$\\b`, "g")},
    timereg4: () => {return new RegExp(`^(\\d{4}+(\-+\\d{2}+){2}+T+\\d{2}(\:+\\d{2}){2}+\.+[\\d]+Z)$`, "g")},


};