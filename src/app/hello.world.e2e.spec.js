var _ = require('lodash');

describe('Example Integration Tests', function () {
  configureJasmineAndLogin();

  it('should find 3 "Hello" messages', function () {
    var selector = 'span*=Hello';
    browser.waitForExist(selector);
    var msgs = browser.getText(selector);
    var expected = ['Hello World!', 'Hello From Lib1', 'Hello From Lib2'];

    expect(msgs.length).toEqual(3);
    _.each(msgs, function (msg, index) {
      expect(msg).toStartWith(expected[index]);
    });
  });
});

function configureJasmineAndLogin() {
  // this will add a custom matcher and log into the 1010 platform
  beforeAll(function () {
    jasmine.addMatchers({
      toStartWith: function (utils, customEqualityTesters) {
        return {
          compare: function (actual, expected) {
            return {
              pass: actual.indexOf(expected) === 0,
              message: "Expected " + actual + " to start with" + expected
            }
          }
        }
      }
    });

    login('<%= login.id%>', '<%= login.password %>', '<%= quick_queries.hello_world.url %>', false);
  });
}

function login(uid, password, url, createNewSession) {
  browser.url(url);

  $('#uid').setValue(uid);
  $('#pswd').setValue(password);

  browser.click('#submit_button');

  var isExisting = browser.isExisting('#new_login');
  if (isExisting) {
    if (createNewSession) {
      console.log("Ending current session");
      browser.click('#yes');
    }
    else {
      console.log("Possessing current session");
      browser.click('#possess');
    }
  }
}
