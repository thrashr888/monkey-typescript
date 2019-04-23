export class Configuration {
  quiet: boolean;
  outputNULL: boolean;
  outputFullFunction: boolean;

  constructor({ quiet = false, outputNULL = false, outputFullFunction = true }) {
    this.quiet = quiet;
    this.outputNULL = outputNULL;
    this.outputFullFunction = outputFullFunction;
  }
}

export default new Configuration({});
