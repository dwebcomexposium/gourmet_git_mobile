/**!
	Lang Switcher
	Language selector usually included inside the site header
	@contributors: Geoffrey Crofte (Alsacréations), Hassan Akaou (Comexposium), Yann Roseau (Kaliop)
	@date-created: 2015-04-01
	@last-update: 2020-07-23
 */

;(function ($) {
  function updateLangSwitcher(switcher) {
    $('link[rel="alternate"][hreflang]').each(function () {
      const lang = $(this).attr("hreflang");
      const url = $(this).attr("href");
      const link = switcher.find(`li.ls-lang-${lang} > a`).attr("href", url);
    });
  }

  $(".js-lang-switcher")
    .each(function () {
      var $_this = $(this);

      // button creation
      $_this
        .find("ul")
        .before(
          '<button class="ls-trigger js-toggle-trigger" type="button" title="' +
            $_this.data("title") +
            '">' +
            $_this.find(".is-active").text() +
            "</button>"
        );

      // accessibility (tab nav)
      $_this.find("a:last").on("blur", function () {
        $_this.find(".js-toggle-trigger").trigger("click");
      });

      // update lang switcher url when title change for comexposium connect 2
      let target = document.querySelector("title");
      let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          setTimeout(function () {
            updateLangSwitcher($_this);
          }, 500);
        });
      });

      let config = {
        childList: true,
      };

      observer.observe(target, config);
      setTimeout(function () {
        updateLangSwitcher($_this);
      }, 500);
    })
    .toggleSlide();
})(jQuery);
