var Option = (function() {
  var options = {
    nextpattern : ['(下|后)一页','下一頁','^\\s*Next\\s*$','^>$','^More$','(^(>>|››|»))|((»|››|>>)$)'],
    previouspattern : ['(上|前)一页','上一頁','^\\s*Prev(ious)?\\s*$','^<$','(^(<<|‹‹|«))|((<<|‹‹|«)$)'],
    disablesites : "",
    editor : "gvim -f",
    searchengines : {"google":"http://www.google.com/search?q={{keyword}}", "yahoo":"http://search.yahoo.com/search?p={{keyword}}","wikipedia":"http://en.wikipedia.org/wiki/{{keyword}}","answers":"http://www.answers.com/main/ntquery?s={{keyword}}"},
    google_api_key : null
  }

  function get(key) {
    var value  = (Settings.get('background.configure.set') || Settings.get('configure.set'))[key];
    var option = options[key];

    if (value instanceof Array) {
      if (value[1]) {
        if (option instanceof Array) {
          option = option.concat(value[0]);
        } else if (option instanceof Object) {
          var obj = JSON.parse(value[0]);
          for(var i in obj) {
            option[i] = obj[i];
          }
        } else {
          option = options + value[0];
        }
      } else {
        option = value[0];
      }
    }
    return option;
  }

  return { get : get };
})();
