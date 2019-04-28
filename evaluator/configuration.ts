export class Configuration {
  quiet: boolean;
  outputNULL: boolean;
  outputFullFunction: boolean;

  constructor({ quiet = false, outputNULL = true, outputFullFunction = true }) {
    this.quiet = quiet;
    this.outputNULL = outputNULL;
    this.outputFullFunction = outputFullFunction;
  }
}

export default new Configuration({});
