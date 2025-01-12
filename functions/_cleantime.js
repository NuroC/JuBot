let nonarr = [null, undefined];
const _pad2 = require("./_pad2");

/**
 *
 * @param {number} time time: time in ms
 * @param {number} timeopt
 * @param {number} timedigits
 * @returns {time} Parsed time
 */

function _cleantime(time, timeopt, timedigits) {
  if (nonarr.includes(timeopt) || [0].includes(timeopt)) {
    if (time !== undefined) {
      if (time > 1000) {
        time = time / 1000;
        if (time >= 60) {
          time = time / 60;
          if (time >= 60) {
            time = time / 60;
            if (time >= 24) {
              time = time / 24;
              if (time >= 7) {
                time = time / 7;
                if (time >= 4.348125) {
                  // exact avg month weeks
                  time = time / 4.348125;
                  if (time >= 12) {
                    time = (time / 12).toFixed(1) + "y";
                  } else {
                    time = time.toFixed(1) + "mo";
                  }
                } else {
                  time = time.toFixed(1) + "w";
                }
              } else {
                time = time.toFixed(1) + "d";
              }
            } else {
              time = time.toFixed(1) + "h";
            }
          } else {
            time = time.toFixed(1) + "m";
          }
        } else {
          time = time.toFixed(0) + "s";
        }
      } else {
        return time + "ms";
      }
    }
    return time;
  } else if ([1, 2, 3, 4, 5].includes(timeopt)) {
    if (timedigits === "auto") {
    } else if (nonarr.includes(timedigits) || typeof timedigits !== "number" || timedigits <= 0 ) {
      timedigits = 2;
    }
    let dat = { time: [], order: [], tag: "" };
    let t = {
      years: {
        tag_: "yr",
        tag: "year",
        conversion: 365 * 24 * 60 * 60 * 1000,
        time: 0,
      },
      days: {
        tag_: "day",
        tag: "day",
        conversion: 24 * 60 * 60 * 1000,
        time: 0,
      },
      hours: { tag_: "hr", tag: "hour", conversion: 60 * 60 * 1000, time: 0 },
      minutes: { tag_: "min", tag: "minute", conversion: 60 * 1000, time: 0 },
      seconds: { tag_: "sec", tag: "second", conversion: 1000, time: 0 },
      milliseconds: { tag_: "ms", tag: "millisecond", conversion: 1, time: 0 },
    };

    t.milliseconds.time = time;

    for (i = 0; i < Object.keys(t).length - 1; i++) {
      t[Object.keys(t)[i]].time = Math.floor(
        t.milliseconds.time / t[Object.keys(t)[i]].conversion
      );
      t.milliseconds.time =
        t.milliseconds.time % t[Object.keys(t)[i]].conversion;
    }

    t.milliseconds.time = parseInt(
      t.milliseconds.time.toString().substring(0, 3)
    );

    let ctlast = undefined;

    for (i = 0; i < Object.keys(t).length; i++) {
      let cte = t[Object.keys(t)[i]].time;
      if (
        (["auto"].includes(timedigits) &&
          (!["milliseconds"].includes(Object.keys(t)[i]) || dat["time"].length === 0)) && dat["time"].length < 2 ||
        timedigits > 0
      ) {
        if (cte >= 1 || [0].includes(ctlast) || ![undefined].includes(ctlast)) {
          if (ctlast === undefined) {
            dat["tag"] = `${t[Object.keys(t)[i]]["tag"]}${cte > 1 ? "s" : ""}`;
          }
          if (timeopt === 1) {
            dat["time"].push(_pad2(cte).toString());
            dat["order"].push(Object.keys(t)[i]);
          } else if ([2, 3].includes(timeopt)) {
            dat["time"].push(_pad2(cte).toString());
            dat["order"].push(Object.keys(t)[i]);
          } else if ([4, 5].includes(timeopt)) {
            if (cte >= 1) {
              dat["time"].push(
                cte +
                  ` ${
                    t[Object.keys(t)[i]][["tag", "tag_"][timeopt - 4]] !== "ms"
                      ? t[Object.keys(t)[i]][["tag", "tag_"][timeopt - 4]] +
                        (cte > 1 ? "s" : "")
                      : t[Object.keys(t)[i]][["tag", "tag_"][timeopt - 4]]
                  }`
              );
              dat["order"].push(Object.keys(t)[i]);
            }
          }

          if (!["auto"].includes(timedigits)) {
            timedigits--;
          }
          ctlast = cte;
        }
      }
    }

    return dat;
  } else {
    throw new Error("no avaiable option for timeopt");
  }
}

module.exports = _cleantime;
