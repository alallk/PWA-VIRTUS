if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw-pwa-news.js')
            .then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
    });
} else {
    console.warn('service worker não suportado');
}


if('PushManager' in window ){
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }  else {
        Notification.requestPermission();
    }
}else {
    console.warn('Push não suportado');
}

if(navigator.connection){
    function getConnection() {
        return navigator.connection || navigator.mozConnection ||
            navigator.webkitConnection || navigator.msConnection;
    }

    function updateNetworkInfo(info) {
        console.log("Data of connection: " + info);
        document.getElementById('effectiveNetworkType').innerHTML = info.effectiveType;
        document.getElementById('downlinkMax').innerHTML = info.downlink + " Kb";
    }

    var info = getConnection();
    if (info) {
        info.addEventListener('change', updateNetworkInfo);
        updateNetworkInfo(info);
    }
}else {
    console.warn('Connection não suportado');
}

if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
    var target = document.getElementById('target');

    function handleChange(change) {
        var timeBadge = new Date().toTimeString().split(' ')[0];
        var newState = document.createElement('p');
        newState.innerHTML = '<span class="badge">' + timeBadge + '</span> ' + change + '.';
        $("#target > *").remove();
        target.appendChild(newState);
    }

    function onChargingChange() {
        handleChange('Battery charging changed to <b>' + (this.charging ? 'charging' : 'discharging') + '</b>')
    }
    function onChargingTimeChange() {
        handleChange('Battery charging time changed to <b>' + this.chargingTime + ' s</b>');
    }
    function onDischargingTimeChange() {
        handleChange('Battery discharging time changed to <b>' + this.dischargingTime + ' s</b>');
    }
    function onLevelChange() {
        handleChange('Battery level changed to <b>' + this.level + '</b>');
    }

    var batteryPromise;

    if ('getBattery' in navigator) {
        batteryPromise = navigator.getBattery();
    } else {
        batteryPromise = Promise.resolve(navigator.battery);
    }

    batteryPromise.then(function (battery) {
        document.getElementById('charging').innerHTML = battery.charging ? 'charging' : 'discharging';
        document.getElementById('chargingTime').innerHTML = battery.chargingTime + ' s';
        document.getElementById('dischargingTime').innerHTML = battery.dischargingTime + ' s';
        document.getElementById('level').innerHTML = battery.level;

        battery.addEventListener('chargingchange', onChargingChange);
        battery.addEventListener('chargingtimechange', onChargingTimeChange);
        battery.addEventListener('dischargingtimechange', onDischargingTimeChange);
        battery.addEventListener('levelchange', onLevelChange);
    });
}else{
    console.warn('Info da bateria não é suportado');
}

// window.addEventListener('beforeinstallprompt', function (e) {
//     console.log('beforeinstallprompt Event fired');
//     e.preventDefault();
//
//     // Stash the event so it can be triggered later.
//     deferredPrompt = e;
//
//     installBotton.style.display = "inline-block";
//
//     return false;
// });