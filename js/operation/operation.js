$(function(){
	// 点击事件
    $('.navbar').on('click','.btn',function(){
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
    });
    $('.navbar').on('click','.logout',function(){
    	$('#myalert').show();
    });
    $('#alertConfirm').on('click','.right',function(){
    	$('#myalert').hide();
    });
    $('#alertConfirm').on('click','.left',function(){
    	$('#myalert').hide();
        $.getJSON(global_path + "/logout", function(data) {
        	if(data.code == 0){
        		window.location.href = "../login.html";
        	}
        })
    });
})

