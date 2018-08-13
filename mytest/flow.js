// @flow

function foo(x: ?string) {
    if (x) {
      return x;
    }
    return "default string";
  }
  foo()