let PN = (function () {
    const TIMEOUT = 5; //in seconds
    const URL = '/notifications';

    function init() {
        requestPermissions();
    }

    function requestPermissions() {
        if (!Push.Permission.has()) {
            Push.Permission.request(onGranted);
        } else if (Push.Permission.GRANTED) {
            onGranted()
        }
    }

    function onGranted() {
        loadNotifications();
    }

    function loadNotifications() {
        $.get(URL).done(({notifications}) => {
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
                console.log('timer', index, count);
                const notification = notifications[index++];
                showNotification(notification);

                if (count === index) {
                    index = 0;
                }
                run();
            }, TIMEOUT * 1000);
        }
        run();
    }

    function showNotification(notification) {
        if (!Push.Permission.has() || !notification) {
            return
        }
        const {title, image, msg, url} = notification;
        Push.create(title, {
            body: msg,
            icon: `/img/${image}`,
            onClick: ((url) => (function () {
                this.close();
                const win = window.open(url, '_blank');
                win.focus();
            }))(url)
        });
    }

    return {init: init}
})();