$(function(){
    $('.navbar').on('click','.btn',function(){
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
    });
})

