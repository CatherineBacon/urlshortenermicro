$(document).ready(function() {
    $('form').submit(function(event){
        event.preventDefault();
        var longUrl = $('#insert_url').val();
        $.ajax({
            url: '/new/' + longUrl,
            method: 'PUT'
        }).done(function(data) {
            var shortUrl = document.location.protocol + `//` + document.location.host + `/`  + data.small;
            $('.short-result').html(`<a href='${shortUrl}' class='short-url'>${shortUrl}</a> <button class='btn btn-default' data-clipboard-target='.short-url'><span class='glyphicon glyphicon-copy'></span> copy</button> `);

            new Clipboard('.btn');
        });
    });
});
