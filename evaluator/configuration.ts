export class Configuration {
  quiet: boolean;
  outputNULL: boolean;

  constructor({ quiet = false, outputNULL = false }) {
    this.quiet = quiet;
    this.outputNULL = outputNULL;
  }
}

export default new Configuration({});
