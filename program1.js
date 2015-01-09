(function (exports) {
  'use strict';

  // Make sure local storage is supported.
  var ns = 'post',
    supportsLocalStorage =
      (typeof localStorage !== 'undefined')
        && localStorage !== null,

    storage,

    storageInterface = stampit().methods({
      save: function saveStorage() {
        throw new Error('.save() method not implemented.');
      }
    }),

    localStorageProvider = stampit
      .compose(storageInterface)
      .methods({
        save: function saveLocal() {
          localStorage.storage = JSON.stringify(storage);
        }
      }),

    cookieProvider = stampit
      .compose(storageInterface)
      .methods({
        save: function saveCookie() {
          $.cookie('storage', JSON.stringify(storage));
        }
      }),

    post = stampit().methods({
        save: function save() {
          storage[this.id] = this.data;
          storage.save();
          return this;
        },
        set: function set(name, value) {
          this.data[name] = value;
          return this;
        }
      })
      .state({
        data: {
          message: '',
          published: false
        },
        id: undefined
      })
      .enclose(function init() {
        this.id = generateUUID();
        return this;
      }),

    api = post;

  storage = (supportsLocalStorage)
    ? localStorageProvider()
    : cookieProvider();

  exports[ns] = api;

}((typeof exports === 'undefined')
    ? window
    : exports
  ));

$(function () {
  'use strict';

  var myPost = post().set('message', 'Hello, world!');

  test('Interface example', function () {
    var storedMessage,
      storage;

    myPost.save();
    storage = JSON.parse(localStorage.storage);
    storedMessage = storage[myPost.id].message;

    equal(storedMessage, 'Hello, world!',
      '.save() method should save post.');
  });
});
