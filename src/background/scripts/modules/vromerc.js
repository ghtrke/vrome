var Vromerc = (function() {

  var customJSBegin = 'begin_custom_js';
  var customJSEnd = 'end_custom_js';

  // extract custom JS block
  function extractCustomJS(text) {
    var res = '';

    if (text.indexOf(customJSBegin) != -1) {
      res = text.substring(text.indexOf(customJSBegin), text.indexOf(customJSEnd));
      res += customJSEnd;
    }

    return res;
  }

  // extract JS only from custom JS block
  function extractJS(text) {
    var res = '';

    if (text.indexOf(customJSBegin) != -1) {
      res = text.substring(text.indexOf(customJSBegin) + customJSBegin.length, text.indexOf(customJSEnd));
    }

    return res;
  }

  function parse(text) {
    var res = null;

    var setting = {};
    setting.imap = {};
    setting.map = {};
    setting.cmap = {};
    setting.unmap = {};
    setting.iunmap = {};
    setting.set = {};
    setting.js = {};

    var new_configs = [];

    var customJS = extractCustomJS(text);
    setting.js = extractJS(customJS);

    var configs = text.split("\n");
    for (var i = 0; i < configs.length; i++) {
      var config = configs[i].trim();
      var array = config.split(/\s+/);
      switch (array[0]) {
      case 'imap':
        new_configs.push(config);
        setting.imap[array[1]] = array[2];
        break;
      case 'map':
        new_configs.push(config);
        setting.map[array[1]] = array[2];
        break;
      case 'cmap':
        new_configs.push(config);
        setting.cmap[array[1]] = array[2];
        break;
      case 'unmap':
        new_configs.push(config);
        setting.unmap[array[1]] = true;
        break;
      case 'iunmap':
        new_configs.push(config);
        setting.iunmap[array[1]] = true;
        break;
      case 'set':
        new_configs.push(config);
        var config_left = config.trimFirst(array[0]);
        var setting_key = config_left.split(/\+?=/)[0];
        var setting_value = config_left.trimFirst(setting_key + "=").trimFirst(setting_key + "+=");
        var plus = (config.match(/^\s*set\s+\w+\+=/) ? true : false);
        setting.set[setting_key] = [setting_value, plus];
        break;
      default:
        if (config.match(/^\s*$/)) {
          new_configs.push(config);
        } else {
          new_configs.push(config.replace(/^"?\s{0,1}/, "\" "));
        }
      }
    }

    Settings.add({
      configure: setting
    });

    res = new_configs.join("\n");

    // fix custom JS block so it is not in comments
    var commentedJs = extractCustomJS(res);
    res = res.replace(commentedJs, commentedJs.split("\n\" ").join("\n"));

    return res;
  }

  function loadOnline( /*Boolean*/ scheduleNextReload) {
    var url = Settings.get('onlineVromercUrl');
    if (!url) {
      return false;
    }
    if (!url.match(/^http/)) url = "http://" + url;

    if (scheduleNextReload && Settings.get("onlineVromercReloadInterval")) {
      var interval = Settings.get("onlineVromercReloadInterval") * 1000 * 60;
      setTimeout(function() {
        Vromerc.loadOnline(true);
      }, interval);
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var vromerc = "\" Begin Online Vromerc generated\n" + xhr.responseText + "\n\" End Online Vromerc generated\n\n";
          vromerc = vromerc + Settings.get('vromerc').replace(/" Begin Online Vromerc generated\n(.|\n)+\n" End Online Vromerc generated\n?\n?/gm, '');
          Settings.add({
            vromerc: parse(vromerc)
          });
          Settings.add({
            onlineVromercLastUpdatedAt: new Date().toString()
          });
        }
      }
    };
    xhr.send();
  }

  return {
    parse: parse,
    loadOnline: loadOnline
  };
})();
