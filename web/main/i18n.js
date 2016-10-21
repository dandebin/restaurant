app.config(['$translateProvider', function ($translateProvider) {
    var lang = window.localStorage.lang || 'en';
    $translateProvider.preferredLanguage(lang);
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    $translateProvider.useSanitizeValueStrategy(null);
}]);