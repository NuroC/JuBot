const fs = require("fs");
const isdebug = require("./isdebug");
const _log = require("./_log");
const _mainpath = require("./_mainpath");
const _staticspacer = require("./_staticspacer");

/**
 * 
 * @param {string} wfpath wfpath > _mainpath()
 * @param {string | object} wffile wffile: string | object
 * @returns nothing
 */

function _wf(wfpath, wffile, filechange){
    if(require("../config.json").handlers.filechange && !filechange){
        return;
    }
    
    if(isdebug("functions", "_wf")){
        _log(1, `${_staticspacer("debug", "_wf")} ${wfpath} (JSON: ${typeof wffile === "object"}, Filechange: ${filechange || "false"}) (${Buffer.from((typeof wffile === "object" ? JSON.stringify(wffile) : wffile), "utf-8").byteLength} b)`);
    }


    if(!wfpath) throw new Error(`_wf: wfpath is undefined`);
    if(!wffile) throw new Error(`_wf: wffile is undefined`);

    if(!wfpath.startsWith(_mainpath(""))){
        wfpath = _mainpath(wfpath);
    }

    try {
        switch (typeof wffile){
            case "string": {
                fs.writeFileSync(wfpath, wffile, "utf-8");
                break;
            }
    
            case "object": {
                if(typeof JSON.stringify(wffile) === "string"){
                    fs.writeFileSync(wfpath, JSON.stringify(wffile), "utf-8");
                } else {
                    throw new Error(`_wf: typeof JSON.stringify(wffile) is ${typeof JSON.stringify(wffile)} (expected string)`);
                }
    
                break;
            }
    
            default: {
                throw new Error(`_wf: typeof wffile is ${typeof(wffile)} (expected string or object)`);
            }
        }
    } catch(e){
        throw new Error(`_wf: Could not write file\n${e}`);
    }
};

// _wf("./data/log.txt")

module.exports = _wf;