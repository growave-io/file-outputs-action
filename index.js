const core = require('@actions/core');
const command = require('@actions/core/lib/command');
const fs = require("fs");
const github = require('@actions/github');

function LineFormatError(line) {
  this.message = `line is not in correct format: ${line}`;
}

try {
  const files = core.getInput('files', { required: true });
  const lines = files.split(/\r?\n/);
  lines.forEach(line => {
    if (line.trim() == '') {
      return;
    }
    const matches = line.match(/^([!]?)([a-zA-Z_][a-zA-Z0-9_-]*)=([^|]+)(?:$|\|(.+))/);
    if (matches === null) {
      throw LineFormatError(line);
    }
    const encoding = matches[5] || "utf8";
    console.log(`reading '${matches[3]}' (encoding: ${encoding}) into output: ${matches[2]}`);
    const data = fs.readFileSync(matches[3], {"encoding": encoding});
    core.setOutput(matches[2], data);
    if (matches[1] == '!') {
      console.log(`output ${matches[2]} is a secret`);
      //core.setSecret(data);
      //command.issueCommand("add-mask", {}, data);
      // multiline secrets are not supported. split into lines...
      data.split(/\r?\n/).forEach(secret_line => {
        if (secret_line.trim() != "") {
          command.issueCommand("add-mask", {}, secret_line);
        }
      });
    }
  });
} catch (error) {
  core.setFailed(error.message);
}
