const files = require("../variables/files");
const paths = require("../variables/paths");
const _wf = require("./_wf");

/**
 *
 * @param {number} permopt
 * @param {number} permnum
 * @param {number} permuser userid
 * @returns
 */

function _permission(permopt, permnum, permuser) {
  return new Promise((resolve, reject) => {
    let permissions = files.permissions;
    switch (permopt) {
      default:
      case 0: {
        if (permnum) {
          permnum = permnum.toString();
          if (Object.keys(files.permissions.permissions).includes(permnum)) {
            return resolve({
              num: permnum,
              desc: files.permissions.permissions[permnum].desc,
              name:
                files.permissions.permissions[permnum].name !== undefined
                  ? files.permissions.permissions[permnum].name
                  : null,
            });
          }
        }
        return resolve({
          num: 10,
          desc: files.permissions.permissions[10].desc,
          name: null,
        });
        break;
      }

      case 1: {
        if (permnum) {
          if (permuser) {
            files.permissions.users[permuser] = permnum;
            _wf(paths.permissions, files.permissions);
            return resolve({
              path: [1, 1, 1],
              msg: "Successfully set users perm",
            });
          } else {
            return reject({ path: [1, 1, 0], msg: "permuser is undefined" });
          }
        } else {
          return reject({ path: [1, 0], msg: "permnum is undefined" });
        }
        break;
      }

      case 2: {
        if (permuser) {
          delete files.permissions.users[permuser];
          _wf(paths.permissions, files.permissions);
          return resolve({ path: [2, 1], msg: "Successfully deleted user" });
        } else {
          return reject({ path: [2, 0], msg: "permuser is indefuned" });
        }
        break;
      }
    }
  });
}

module.exports = _permission;
