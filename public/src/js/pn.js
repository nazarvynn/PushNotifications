const PN = {
    TIMEOUT: 10, //in seconds
    URL: '/notifications',
    LOCAL_DATA: [{
      "title": "Title 1",
      "icon": "/img/img1.png",
      "image": "https://via.placeholder.com/600/92c952",
      "body": "text 1",
      "url": "https://via.placeholder.com/600/92c952"
    },
    {
      "title": "Title 2",
      "icon": "/img/img2.png",
      "image": "https://via.placeholder.com/600/771796",
      "body": "text 2",
      "url": "https://via.placeholder.com/600/771796"
    },
    {
      "title": "Title 3",
      "icon": "/img/img3.png",
      "image": "https://via.placeholder.com/600/24f355",
      "body": "text 3",
      "url": "https://via.placeholder.com/600/24f355"
    },
    {
      "title": "Title 4",
      "icon": "/img/img4.png",
      "image": "https://via.placeholder.com/600/d32776",
      "body": "text 4",
      "url": "https://via.placeholder.com/600/d32776"
    },
    {
      "title": "Title 5",
      "icon": "/img/img5.png",
      "image": "https://via.placeholder.com/600/f66b97",
      "body": "text 5",
      "url": "https://via.placeholder.com/600/f66b97"
    }]
};



// ---------------------------
PN.app = (function () {

    function init() {
        requestPermissions();
    }

    function requestPermissions() {
        if (isDefaultPermission()) {
            // Notification.requestPermission(result => result)
            //     .then(status => {
            //         ('granted' === status) && onGranted();
            //     });

            Notification.requestPermission(status => {
                ('granted' === status) && onGranted();
            });
        } else if (isGrantedPermission()) {
            onGranted();
        }
    }

    function onGranted() {
        if (PN && PN.LOCAL_DATA && PN.LOCAL_DATA.length) {
            startTimer(PN.LOCAL_DATA);
        } else {
            loadNotifications();
        }
    }

    function loadNotifications() {
        if (!PN.URL) return;
        $.get(PN.URL).done(({notifications}) => {
            if (notifications && notifications.length) {
                startTimer(notifications);
            }
        });
    }

    function startTimer(notifications) {
        let index = 0;
        const count = notifications.length;

        function run() {
            setTimeout(() => {
                const notification = notifications[index++];
                showNotification(notification);

                if (count === index) {
                    index = 0;
                }
                run();
            }, PN.TIMEOUT * 1000);
        }
        run();
    }

    function showNotification(data) {
        if (!isGrantedPermission() || !data) {
            return;
        }
        
        const {title, icon, image, body, url} = data;
        const options = {icon, image, body, requireInteraction: true};
        const notification = new Notification(title, options);
        notification.onclick = function() {
            this.close();
            const win = window.open(url, '_blank');
            win.focus();
        };
        
    }

    function isDefaultPermission() {
        return 'default' === Notification.permission;
    }

    function isGrantedPermission() {
        return 'granted' === Notification.permission;
    }

    return {init};
})();
document.addEventListener('DOMContentLoaded', function() {
    Notification && PN.app.init();
});
