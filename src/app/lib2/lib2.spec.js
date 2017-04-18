describe("Example Lib2 Tests", function () {

  var importLib = '<import path="<%= root_path %>.lib2.lib2" />';

  it("should add two numbers together (4 + 8 = 12)", function (done) {
    var query = importLib + '<insert block="add" input1="4" input2="8"/>';

    this.queryToJson({isInlineQuery: true}, query, function (results) {
      expect(results[0].answer).toBe('12');
      done();
    });
  });
});