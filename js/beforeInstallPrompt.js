var deferredPrompt;
var container = document.querySelector('.fixed-container');

window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    container.classList.remove("d-none");

    container.addEventListener('click', function (e) {
        function btnRemove() {
            deferredPrompt = null;
            container.classList.add("d-none");
        }

        if (deferredPrompt) {
            deferredPrompt.prompt();

            deferredPrompt.userChoice.then(function (choiceResult) {

                console.log(choiceResult.outcome);

                if (choiceResult.outcome == 'dismissed') {
                    console.log('User cancelled home screen install');
                }
                else {
                    console.log('User added to home screen');
                }
                btnRemove();
            }, function (reason) {
                btnRemove();
            });
        }else{
            btnRemove();
        }
    });


    return false;
});