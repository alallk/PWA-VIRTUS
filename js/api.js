(function () {
    'use strict';
    var readArticle_btn = 'Noticia Completa';
    var imgStatic = window.location.protocol + "//" + window.location.host + '/images/item_sem_imagem.svg';
    var imgLoadingStatic = window.location.protocol + "//" + window.location.host + '/images/tenor.gif';

    var category = null;
    var search = null;

    var API = 'https://newsapi.org/v2/';
    var ENDPOINT_HEADLINES = 'top-headlines?';
    var ENDPOINT_EVERYTHING = 'everything?';
    var API_KEY = 'apiKey=c5a59e6e745f45849e2e56af4efad07d';

    function getNews() {
        var url = API + ENDPOINT_HEADLINES + 'country=br&' + API_KEY + getCategory();
        $.get(url, success);
    }

    function getNewsWithSearch() {
        var url = API + ENDPOINT_EVERYTHING + API_KEY + getSearch();
        $.get(url, success);
    }

    function success(data) {
        var divNews = $('#news');
        divNews.empty();
        setTopNews( data.articles[0]);
        for (var i = 1; i < data.articles.length; ++i) {
            divNews.append(getNewsHtml(data.articles[i]));
        }
    }

    function setTopNews(article) {
        if(article) {
            $('#top-news-title').text(article.title);
            $('#top-news-description').text(article.description);
            $('#top-news-image').attr('src', article.urlToImage).attr('alt', article.title);
            $('#top-news-link').attr('href', article.url);
        }
    }

    function activeMenu(menu) {
        search = null;
        $("#search").val('');
        $('li.active').removeClass('active');
        menu.addClass('active');
        getNews();
    }

    function getCategory() {
        if (category) {
            return '&category=' + category
        }
        return '';
    }

    function getSearch() {
        if (search) {
            return '&q=' + search
        }
        return '';
    }

    function colapseMenu() {
        $('.navbar-toggler').click()
    }

    function getNewsHtml(article) {

        var card = $('<div>').addClass('card col-12 col-sm-6 col-md-4 col-xl-3');

        card = addImage(card);
        card = addBodyTitle(card);
        card = addBodyActions(card);

        return card;

        function addImage(card) {
            function loadImg(url, alt, img) {
                function setDefaultImg(img){
                    img.src = imgStatic;
                }

                function isImageOk(imgElement) {
                    return imgElement.complete && imgElement.naturalHeight !== 0;
                }

                $(img).on('load',function (event){
                    if(!isImageOk(img)){
                        console.log("Deu erro no carregamento");
                        setDefaultImg(img);
                    }
                });

                img.src = url;
                img.alt = alt;
            }

            var imgLocal = new Image();
            imgLocal.src = imgLoadingStatic;
            imgLocal.classList.add("card-body-img");

            if(article.urlToImage){
                loadImg(article.urlToImage, article.title, imgLocal)
            }else{
                imgLocal.src = imgLocal;
                imgLocal.alt = article.title;
            }
            card.append(imgLocal);
            return card;
        }

        function addBodyTitle(card) {
            return card.append(
                $('<div>')
                    .addClass('card-body')
                    .append($('<h5>').addClass('card-title').append(article.title))
                    .append($('<h6>').addClass('card-subtitle mb-2 text-muted')
                    .append(moment(article.publishedAt).fromNow()))
                    .append($('<p>').addClass('card-text').append(article.description))
            );
        }

        function addBodyActions(card) {
            return card.append(
                $('<div>')
                    .addClass('card-body')
                    .append($('<button>').append(readArticle_btn).addClass('btn btn-link').attr('type', 'button'))
                    .click(function () {
                        window.open(article.url, '_blank');
                    })
            );
        }
    }

    function bind() {
        $("#headline").click(function () {
            category = null;
            activeMenu($(this));
        });
        $("#health").click(function () {
            category = 'health';
            activeMenu($(this));
        });
        $("#sports").click(function () {
            category = 'sports';
            activeMenu($(this));
        });
        $("#entertainment").click(function () {
            category = 'entertainment';
            activeMenu($(this));
        });
        $("#technology").click(function () {
            category = 'technology';
            activeMenu($(this));
        });
        $("#search").keypress(function (ev) {
            if (ev.which == 13) {
                search = $(this).val();
                if (search) {
                    getNewsWithSearch();
                } else {
                    getNews();
                }
            }
        });
    }
    
    function init() {
        bind();
        getNews();
    }

    init();
})();