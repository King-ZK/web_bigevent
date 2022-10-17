// 每次调用 $.post / $.get / $.ajax
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给 Ajax 提供的配置对象
$.ajaxPrefilter(function(option){
    option.url = 'http://www.liulongbin.top:3007' + option.url;
    console.log(option.url);
})