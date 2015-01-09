var $ = require('jquery-browserify'),
    guestlistModel = require('./guestlistmodel'),
    guestlistView = require('./guestlistview'),
    $container = $('#container');

$(function init() {
    var guestlistData = guestlistModel.load();
    $guestlist = guestlistView.render(guestlistData);
    $container.empty().append($guestlist);
});
