const chalk = require("chalk");

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const method = chalk.bold.blue(req.method.toUpperCase());
    const url = chalk.bold.cyan(req.originalUrl);
    const time = chalk.bold.magenta(`${duration}ms`);

    const statusColor =
      res.statusCode < 300
        ? chalk.bold.green
        : res.statusCode < 400
        ? chalk.bold.yellow
        : chalk.bold.red;

    const status = statusColor(res.statusCode);

    console.log("\n" + chalk.gray("=".repeat(60)));
    console.log(`🔹 ${method} ${url} ${status} - ${time}`);
    console.log(chalk.gray("=".repeat(60)) + "\n");
  });

  next();
}

module.exports = requestLogger;
