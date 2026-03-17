export class Result {
  constructor(ok, value = null, error = null) {
    this.ok = ok;
    this.value = value;
    this.error = error;

    Object.freeze(this);
  }

  static success(value) {
    return new Result(true, value, null);
  }

  static failure(error) {
    return new Result(false, null, error);
  }

  isSuccess() {
    return this.ok === true;
  }

  isFailure() {
    return this.ok === false;
  }
}
