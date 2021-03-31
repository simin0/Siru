function modifyStory() {
	var story_id = $("#story_id").val();

	location.href = "/user/board/form/modify/story?story_id=" + story_id;
}

function deleteStory() {
	if (confirm("글을 지우시겠습니까?")) {
		var story_id = $("#story_id").val();

		location.href = "/user/board/story/delete?story_id=" + story_id;
	}
}


function registComment() {
	var member_id = $("#member_id");
	var story_id = $("#story_id");
	var comment = $("#comment");
	
	if (comment.val() != "") {
		$.ajax({
			url : "/rest/comment/regist",
			data : {
				member_id : member_id.val(),
				story_id : story_id.val(),
				content : comment.val()
			},
			method : "post",
			success : function() {
				comment.val("");
				getCommentList();
			}
		});
	} else {
		comment.focus();
	}
}

function getCommentList() {
	var comment_list = $("#comment_list");
	var story_id = $("#story_id");
	var member_id = $("#member_id");
	
	$.ajax({
		url : "/rest/comment/list",
		data : {
			story_id : story_id.val()
		},
		method : "get",
		success : function(responseData) {
			var responseJson = JSON.parse(responseData);
			var tag = "";

			for (var i = 0; i < responseJson.length; i++) {
				tag += "<tr>";
				tag += "<td>";
				tag += responseJson[i].member.nickname;
				tag += "</td>";
				tag += "<td>";
				tag += "<pre>" + responseJson[i].content + "</pre>";
				tag += "</td>";
				tag += "<td>";
				tag += "<span class=\"comment_date\">" + responseJson[i].date.substring(5, 16) + "</span>";
				if (responseJson[i].member.member_id == member_id.val()) {
					tag += "<button type=\"button\" value=\"" + responseJson[i].comment_id + "\" onclick=\"deleteComment(this)\" class=\"comment_delete_button\">×</button>";
				}
				tag += "</td>";
				tag += "</tr>";
			}
			
			comment_list.html(tag);
		}
	});
}

function deleteComment(obj) {
	if (confirm("댓글을 지우시겠습니까?")) {
		var comment_id = obj.value;
		
		$.ajax({
			url : "/rest/comment/delete?comment_id=" + comment_id,
			method : "get",
			success : function() {
				getCommentList();
			}
		});
	}
}

$(function() {
	getCommentList();
	
	$("#modify_button").on("click", function() {
		modifyStory();
	});

	$("#delete_button").on("click", function() {
		deleteStory();
	});
	
	$("#comment_regist_button").on("click", function() {
		registComment();
	});
});


