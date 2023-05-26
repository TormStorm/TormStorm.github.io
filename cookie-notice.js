/**
 * Cookie Notice JS
 * @author Alessandro Benoit (modified by WRI web team)
 */

/* set the variables */

window.gdpr_message = 'This website does not use cookies to provide you with an improved user experience. By continuing you consent to cookies not being used. For more information please visit my';
window.gdpr_link = 'https://github.com/OhMyGuus/I-Still-Dont-Care-About-Cookies';
window.gdpr_link_text = 'privacy policy';
window.gdpr_button_text = 'OK';
window.gdpr_isactive = true;


// Main functionality wrapped in timeout to let the Drupal behavior complete

function timeFunction() {

setTimeout(function () {

  (function () {

    "use strict";

    /**	    
     * Store current instance
     */
    var instance,
        originPaddingTop;

    /**
     * Defaults values
     * @type object
     */

    //var testvar4 = testvar3;

    var defaults = {
        messageLocales: {
            en: gdpr_message + ' <a href="' + gdpr_link + '"target="_blank">' + gdpr_link_text + '</a>.'
	},

        cookieNoticePosition: 'bottom',

        learnMoreLinkEnabled: false,

        learnMoreLinkHref: '/cookie-banner-information.html',

        learnMoreLinkText: {
            en: 'Learn more'
        },

        buttonLocales: {
            en: gdpr_button_text
        },

        expiresIn: 30,
        buttonBgColor: '#6c757d',
        buttonTextColor: '#fff',
        noticeBgColor: '#292929',
        noticeTextColor: '#fff',
        linkColor: '#009fdd',
        linkBgColor: '#000',
        linkTarget: '_blank',
        debug: false
    };

    /**
     * Constructor
     * @constructor
     */

    window.cookieNoticeJS = function () {

        // Set current instance
        instance = this;

        // If cookies are not supported or notice cookie is already set
        if (getNoticeCookie()) {
            return;
        }

        // 'data-' attribute - data-cookie-notice='{ "key": "value", ... }'
        var elemCfg = document.querySelector('script[ data-cookie-notice ]');
        var config;

        try {
            config = elemCfg ? JSON.parse(elemCfg.getAttribute('data-cookie-notice')) : {};
            // TODO apply settings coming from data attribute and keep defaults if not overwritten -> 1.2.x
        } catch (ex) {
            console.error('data-cookie-notice JSON error:', elemCfg, ex);
            config = {};
        }

        // Extend default params
        var params = extendDefaults(defaults, arguments[0] || config || {});

        if (params.debug) {
            console.warn('cookie-notice:', params);
        }

        // Get current locale for notice text
        var noticeText = getStringForCurrentLocale(params.messageLocales);

        // Create notice
        var notice = createNotice(noticeText, params.noticeBgColor, params.noticeTextColor, params.cookieNoticePosition);

        var learnMoreLink;

        if (params.learnMoreLinkEnabled) {
            var learnMoreLinkText = getStringForCurrentLocale(params.learnMoreLinkText);

            learnMoreLink = createLearnMoreLink(learnMoreLinkText, params.learnMoreLinkHref, params.linkTarget, params.linkColor, params.linkBgColor);
        }

        // Get current locale for button text
        var buttonText = getStringForCurrentLocale(params.buttonLocales);

        // Create dismiss button
        var dismissButton = createDismissButton(buttonText, params.buttonBgColor, params.buttonTextColor, params.buttonBorderRadius);

        // Dismiss button click event
        dismissButton.addEventListener('click', function (e) {
            e.preventDefault();
            setDismissNoticeCookie(parseInt(params.expiresIn + "", 10) * 60 * 1000 * 60 * 24);
            fadeElementOut(notice);
        });

        // Append notice to the DOM
        var noticeDomElement = document.body.appendChild(notice);

        if (!!learnMoreLink) {
            noticeDomElement.appendChild(learnMoreLink);
        }

        noticeDomElement.appendChild(dismissButton);

    };

    /**
     * Get the string for the current locale
     * and fallback to "en" if none provided
     * @param locales
     * @returns {*}
     */
    function getStringForCurrentLocale(locales) {
        var locale = (navigator.userLanguage || navigator.language).substr(0, 2);
        return (locales[locale]) ? locales[locale] : locales['en'];
    }

    /**
     * Test if notice cookie is there
     * @returns {boolean}
     */
    function getNoticeCookie() {
        return document.cookie.indexOf('cookie_notice') != -1;
    }

    /**
     * Create notice
     * @param message
     * @param bgColor
     * @param textColor
     * @param position
     * @returns {HTMLElement}
     */
    function createNotice(message, bgColor, textColor, position) {

        var notice = document.createElement('div'),
            noticeStyle = notice.style,
            lineHeight = 1.8,
            paddingBottomTop = 20,
            fontSize = 1,
            noticeHeight = lineHeight + paddingBottomTop * 2,
	    noticeFont = '"myriad-pro-condensed", "Helvetica Neue", Helvetica, Arial, sans-serif';

        notice.innerHTML = message + '&nbsp;';
        notice.setAttribute('id', 'cookieNotice');
        notice.setAttribute('data-test-section', 'cookie-notice');
        notice.setAttribute('data-test-transitioning', 'false');

        noticeStyle.position = 'fixed';

        if (position === 'top') {
            var bodyDOMElement = document.querySelector('body');

            originPaddingTop = bodyDOMElement.style.paddingTop;

            noticeStyle.top = '0';
            bodyDOMElement.style.paddingTop = noticeHeight + 'px';
        } else {
            noticeStyle.bottom = '0';
        }

        noticeStyle.left = '0';
        noticeStyle.right = '0';
        noticeStyle.background = bgColor;
        noticeStyle.color = textColor;
        noticeStyle["z-index"] = '3000';
        noticeStyle.padding = paddingBottomTop + 'px 5px';
        noticeStyle["text-align"] = 'center';
        noticeStyle["font-size"] = fontSize + 'em';
        noticeStyle["line-height"] = lineHeight + 'em';
        noticeStyle["font-family"] = noticeFont;

        return notice;
    }

    /**
     * Create dismiss button
     * @param message
     * @param buttonColor
     * @param buttonTextColor
     * @returns {HTMLElement}
     */
    function createDismissButton(message, buttonColor, buttonTextColor) {

        var dismissButton = document.createElement('span'),
            dismissButtonStyle = dismissButton.style;

        // Dismiss button
        dismissButton.href = '#';
        dismissButton.innerHTML = message;

        dismissButton.setAttribute('role', 'button');
        dismissButton.className = 'confirm';

        dismissButton.setAttribute('data-test-action', 'dismiss-cookie-notice');

        // Dismiss button style
        dismissButtonStyle.background = buttonColor;
        dismissButtonStyle.color = buttonTextColor;
        dismissButtonStyle['text-decoration'] = 'none';
        dismissButtonStyle['cursor'] = 'pointer';
        dismissButtonStyle.display = 'inline-block';
        dismissButtonStyle.padding = '0 15px 2px';
        dismissButtonStyle.margin = '0 0 0 10px';
	dismissButtonStyle['border-radius'] = '5px';

        return dismissButton;

    }

    /**
     * Create the learn more link
     *
     * @param learnMoreLinkText
     * @param learnMoreLinkHref
     * @param linkColor
     * @returns {HTMLElement}
     */
    function createLearnMoreLink(learnMoreLinkText, learnMoreLinkHref, linkTarget, linkColor, linkBgColor) {

        var learnMoreLink = document.createElement('a'),
            learnMoreLinkStyle = learnMoreLink.style;

        learnMoreLink.href = learnMoreLinkHref;
        learnMoreLink.textContent = learnMoreLinkText;
        learnMoreLink.title = learnMoreLinkText;
        learnMoreLink.target = linkTarget;
        learnMoreLink.className = 'learn-more';
        learnMoreLink.setAttribute('data-test-action', 'learn-more-link');

        learnMoreLinkStyle.color = linkColor;
        learnMoreLinkStyle.backgroundColor = 'transparent';
        learnMoreLinkStyle['text-decoration'] = 'underline';
        learnMoreLinkStyle.display = 'inline';

        return learnMoreLink;

    }

    /**
     * Set dismiss notice cookie
     * @param expireIn
     */
    function setDismissNoticeCookie(expireIn) {
        var now = new Date(),
            cookieExpire = new Date();

        cookieExpire.setTime(now.getTime() + expireIn);
        document.cookie = "cookie_notice=1; expires=" + cookieExpire.toUTCString() + "; path=/;";
    }

    /**
     * Fade a given element out
     * @param element
     */
    function fadeElementOut(element) {
        element.style.opacity = 1;

        element.setAttribute('data-test-transitioning', 'true');

        (function fade() {
            if ((element.style.opacity -= .1) < 0.01) {

                if (originPaddingTop !== undefined) {
                    var bodyDOMElement = document.querySelector('body');
                    bodyDOMElement.style.paddingTop = originPaddingTop;
                }

                document.body.removeChild(element);
            } else {
                setTimeout(fade, 40);
            }
        })();
    }

    /**
     * Utility method to extend defaults with user options
     * @param source
     * @param properties
     * @returns {*}
     */
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                if (typeof source[property] === 'object') {
                    source[property] = extendDefaults(source[property], properties[property]);
                } else {
                    source[property] = properties[property];
                }
            }
        }
        return source;
    }

    /* test-code */
    cookieNoticeJS.extendDefaults = extendDefaults;
    cookieNoticeJS.clearInstance = function () {
        instance = undefined;
    };
    /* end-test-code */

   if (gdpr_isactive) { 	  
     new cookieNoticeJS();
   }

}());

}, 300);

}

timeFunction();
