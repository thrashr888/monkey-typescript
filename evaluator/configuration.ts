export class Configuration {
  quiet: boolean;
  outputNULL: boolean;
  outputFunctionBody: boolean;

  constructor({ quiet = false, outputNULL = true, outputFunctionBody = true }) {
    this.quiet = quiet;
    this.outputNULL = outputNULL;
    this.outputFunctionBody = outputFunctionBody;
  }
}

export default new Configuration({});
