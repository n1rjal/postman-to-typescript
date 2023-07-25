const { argv } = require("node:process");

module.exports = ({ required }) => {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("-")) {
      args[arg.substring(1)] = argv[++i];
      continue;
    }
    args._.push(arg);
  }
  if (required && required.length) {
    for (let req of required) {
      if (!(req in args)) {
        console.log(`ps_ts: postman-to-typescript types generator\n`);
        console.log(`Usage: ps_ts -i <filename.json>\n`);
        console.log(`Missing required argument flag: -${req}`);
        process.exit(1);
      }
    }
  }
  return args;
};
