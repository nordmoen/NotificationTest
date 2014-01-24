var Notification = new function () {
	//Notifications in the notification area
	var notifications = [];
	//Notifications in queue to be shown
	var showQueue = [];
	//Is show queue being processed 
	var processing = false;
	//Global index
	var globalIndex = 0;

	//Create an alert div
	var createAlert = function (clazz, title, content){
		var cont = "<em>" + title + "</em> " + content;
		//Truncate shown content if to large
		if(cont.length > 200){
			cont = cont.slice(0, 197) + "...";
		}
		return $("<div/>", {
			"class": clazz,
		       	"html": cont,
		       	"style": "hidden",
		       	//Custom data which can be used to identify or retrieve data
		       	"data-notification-title": title,
		       	"data-notification-content": content,
			"data-notification-type": clazz
		});
	};

	//Create list item which can be inserted in notification list
	var createListNotification = function (div) {
		return $("<li/>", {
			"class": div.data("notification-type"),
			"text": div.data("notification-title"),
			on: {
				click: function () {
					//Remove notification from notification
					//area
					var elements = notifications.filter(function (ele){
						if(ele.data("notification-index") ===
							div.data("notification-index")){
								return true;
							}

					});

					elements.forEach(function(ele) {
						var index = notifications.indexOf(ele);
						removeListNotification(index);
					});
					
					//Show modal dialog here and remove
					//notification
					var dialog = $("#notification-dialog");
					$("#notification-dialog-title").html(
						div.data("notification-title"));
					$("#notification-dialog-content").html(
						div.data("notification-content"));
					$("#notification-dialog-content").removeClass();
					$("#notification-dialog-content").addClass(
						div.data("notification-type"));
					dialog.modal("show");
				}
			}
		});

	};

	//Remove the notification at the given index
	var removeListNotification = function (index) {
		if(index >= 0 && index < notifications.length){
			notifications.splice(index, 1);
			updateDropdownNotifications();
		}
	};

	//This functions updates the dropdown menu with all notifications
	var updateDropdownNotifications = function () {
		var len = notifications.length;
		var numNotifications = $("#notification-badge");
		var notificationList = $("#notification-list");
		len > 0 ? numNotifications.html(len) : numNotifications.html("None");
		//Remove all children which has class '.alert'
		notificationList.children(".alert").remove();
		for(i in notifications){
			var element = createListNotification(notifications[i]);
			notificationList.append(element);
		}
	};

	//Add notification to the dropdown menu
	var addNotification = function(div){
		notifications.push(div);
		updateDropdownNotifications();
	};

	//Clear all notifications
	this.clearNotifications = function (){
		notifications = [];
		updateDropdownNotifications();
	};

	var showAlertNow = function(div){
		//Bookkeeping step to ensure that there is a unique index
		//to operate on when it comes to notifications
		div.data("notification-index", globalIndex);
		globalIndex += 1;
		
		var alertArea = $("#notification-area");
		var show = function () {
			//Notification area is visible, show alert
			div.appendTo(alertArea);
			div.fadeIn(1200, function () {
				//Notification is visible for user
				setTimeout(function(){
					//Show notification for 1s
					div.fadeOut(800, function () {
						//Add div to notifications
						addNotification(div);
						if(processing === true){
							if(showQueue.length === 0){
								processing = false;
								alertArea.fadeOut();
							}else{
								showAlertNow(
								showQueue.shift());
							}
						}
					});
				}, 2000);
			});
		};
		if(alertArea.prop("visible")){
			show();
		}else{
			alertArea.fadeIn(show);
		}
	};

	//Show alert helper method
	var showAlert = function(clazz, title, content) {
		var aler = createAlert(clazz, title, content);
		if(processing === true){
			showQueue.push(aler);
			return;
		}else{
			processing = true;
			showAlertNow(aler);
		}
	};

	this.showSuccess = function(title, content) {
		showAlert("alert alert-success", title, content);
	};
	this.showInfo = function(title, content) {
		showAlert("alert alert-info", title, content);
	};
	this.showWarning = function(title, content) {
		showAlert("alert alert-warning", title, content);
	};
	this.showDanger = function(title, content) {
		showAlert("alert alert-danger", title, content);
	};
};
