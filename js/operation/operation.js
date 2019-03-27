$(function(){
	// 点击事件
    $('.layui-side-scroll').on('click','.btn',function(){		//左侧导航栏
        $(this).addClass('click_btn').parents('li').siblings().find('.btn').removeClass('click_btn');
    });
    $('.logout').on('click',function(){			//退出登录
    	$('#myalert').show();
    });
    $('#alertConfirm').on('click','.right',function(){			//退出登录弹框取消按钮
    	$('#myalert').hide();
    });
    $('#alertConfirm').on('click','.left',function(){			//退出登录弹框确认按钮
    	$('#myalert').hide();
        $.getJSON(global_path + "/logout", function(data) {
        	if(data.code == 0){
        		window.location.href = "../login.html";
        	}
        })
    });
})

