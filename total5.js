require('total5');

Total.run({ release: true, port: 3500 });
ROUTE('GET /*', ($) => {
    $.view('index').layout('');
});
ROUTE('FILE /assets/*', ($) => {

    let filename = $.split[1];
    console.log('ASSETS: ', filename);
    $.file(PATH.public('assets/' + filename))
})
