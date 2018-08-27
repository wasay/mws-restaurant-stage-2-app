// js/sw-reg.js

if (navigator.serviceWorker)
{
    //console.log('sw-reg');
    navigator.serviceWorker.register('sw.js').then(function ()
    {
        //console.log('Registration worked!');
    }).catch(function ()
    {
        //console.log('Registration failed!');
    });
}