const PN = {
    TIMEOUT: 10, //in seconds
    URL: '',
    LOCAL_DATA: [{
      "image": "/img/img1.png",
      "title": "Title 1",
      "msg": "text 1",
      "url": "https://via.placeholder.com/600/92c952"
    },
    {
      "image": "/img/img2.png",
      "title": "Title 2",
      "msg": "text 2",
      "url": "https://via.placeholder.com/600/771796"
    },
    {
      "image": "/img/img3.png",
      "title": "Title 3",
      "msg": "text 3",
      "url": "https://via.placeholder.com/600/24f355"
    },
    {
      "image": "/img/img4.png",
      "title": "Title 4",
      "msg": "text 4",
      "url": "https://via.placeholder.com/600/d32776"
    },
    {
      "image": "/img/img5.png",
      "title": "Title 5",
      "msg": "text 5",
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
            Notification.requestPermission(status => {
                ('granted' === status) && registerServiceWorker().then(onGranted);
            });
        } else if (isGrantedPermission()) {
            registerServiceWorker().then(onGranted);
        }
    }

    function registerServiceWorker() {
        return navigator.serviceWorker.register('src/js/sw.js');
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

    function showNotification(notification) {
        if (!isGrantedPermission() || !notification) {
            return;
        }
        const {title, image, msg, url} = notification;
        navigator.serviceWorker.ready.then(function(serviceWorker) {
            serviceWorker.showNotification(title, {
                body: msg,
                icon: image,
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'vibration-sample',
                image: url,
                badge: url,
                actions: [{ action: "Detail 1", title: "View 1", icon: image }]
            });
        });

        // var notification = new Notification(title, {
        //     icon: image,
        //     body: msg,
        //     actions: [{
        //         action: 'explore', 
        //         title: 'Explore this new world',
        //         icon: url
        //     }, {
        //         action: 'close', 
        //         title: 'Close notification',
        //         icon: image
        //     }],
        //     vibrate: [200, 100, 200, 100, 200, 100, 200]
        // });
        // notification.onclick = function() {
        //     this.close();
        //     const win = window.open(url, '_blank');
        //     win.focus();
        // };
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
