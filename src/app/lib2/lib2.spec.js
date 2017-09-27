describe("Example Lib2 Tests", function () {

  /**
   * Example showing how to test
   */
  it("should add two numbers together (4 + 8 = 12)", function (done) {
    var query =
      '<import path="<%= root_path %>.lib2.lib2" />' +
      '<insert block="add" input1="4" input2="8"/>';

    this.queryToJson({isInlineQuery: true}, query, function (results) {
      expect(results[0].answer).toBe('12');
      done();
    });
  });

  /**
   Example showing how to test a query which uses variables defined in a dynamic. In addition it demonstrates
   using a query stored in an external file.
   */
  it("should add together, two numbers defined in a <dynamic/> tag  (7 + 6 = 13)", function (done) {
    var specFile = '<%= build_dir %>/app/lib2/lib2.spec.xml';
    this.queryQuickAppToJson({tokens: {NUM1: 7}}, specFile, function (results) {
      expect(results[0].answer).toBe('13');
      done();
    });
  });

});