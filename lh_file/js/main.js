//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
//! moment.js locale configuration
//! locale : chinese (zh-cn)
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng

(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('../moment')) :
   typeof define === 'function' && define.amd ? define(['moment'], factory) :
   factory(global.moment)
}(this, function (moment) { 'use strict';


    var zh_cn = moment.defineLocale('zh-cn', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'Ah点mm分',
            LTS : 'Ah点m分s秒',
            L : 'YYYY-MM-DD',
            LL : 'YYYY年MMMD日',
            LLL : 'YYYY年MMMD日Ah点mm分',
            LLLL : 'YYYY年MMMD日ddddAh点mm分',
            l : 'YYYY-MM-DD',
            ll : 'YYYY年MMMD日',
            lll : 'YYYY年MMMD日Ah点mm分',
            llll : 'YYYY年MMMD日ddddAh点mm分'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' ||
                    meridiem === '上午') {
                return hour;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            } else {
                // '中午'
                return hour >= 11 ? hour : hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar : {
            sameDay : function () {
                return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
            },
            nextDay : function () {
                return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
            },
            lastDay : function () {
                return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
            },
            nextWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            lastWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() < startOfWeek.unix()  ? '[上]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            sameElse : 'LL'
        },
        ordinalParse: /\d{1,2}(日|月|周)/,
        ordinal : function (number, period) {
            switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            case 'M':
                return number + '月';
            case 'w':
            case 'W':
                return number + '周';
            default:
                return number;
            }
        },
        relativeTime : {
            future : '%s内',
            past : '%s前',
            s : '几秒',
            m : '1 分钟',
            mm : '%d 分钟',
            h : '1 小时',
            hh : '%d 小时',
            d : '1 天',
            dd : '%d 天',
            M : '1 个月',
            MM : '%d 个月',
            y : '1 年',
            yy : '%d 年'
        },
        week : {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    return zh_cn;

}));
!function(){function n(){}function t(n){return n}function e(n){return!!n}function r(n){return!n}function u(n){return function(){if(null===n)throw new Error("Callback was already called.");n.apply(this,arguments),n=null}}function i(n){return function(){null!==n&&(n.apply(this,arguments),n=null)}}function o(n){return M(n)||"number"==typeof n.length&&n.length>=0&&n.length%1===0}function c(n,t){for(var e=-1,r=n.length;++e<r;)t(n[e],e,n)}function a(n,t){for(var e=-1,r=n.length,u=Array(r);++e<r;)u[e]=t(n[e],e,n);return u}function f(n){return a(Array(n),function(n,t){return t})}function l(n,t,e){return c(n,function(n,r,u){e=t(e,n,r,u)}),e}function s(n,t){c(W(n),function(e){t(n[e],e)})}function p(n,t){for(var e=0;e<n.length;e++)if(n[e]===t)return e;return-1}function h(n){var t,e,r=-1;return o(n)?(t=n.length,function(){return r++,t>r?r:null}):(e=W(n),t=e.length,function(){return r++,t>r?e[r]:null})}function m(n,t){return t=null==t?n.length-1:+t,function(){for(var e=Math.max(arguments.length-t,0),r=Array(e),u=0;e>u;u++)r[u]=arguments[u+t];switch(t){case 0:return n.call(this,r);case 1:return n.call(this,arguments[0],r)}}}function y(n){return function(t,e,r){return n(t,r)}}function v(t){return function(e,r,o){o=i(o||n),e=e||[];var c=h(e);if(0>=t)return o(null);var a=!1,f=0,l=!1;!function s(){if(a&&0>=f)return o(null);for(;t>f&&!l;){var n=c();if(null===n)return a=!0,void(0>=f&&o(null));f+=1,r(e[n],n,u(function(n){f-=1,n?(o(n),l=!0):s()}))}}()}}function d(n){return function(t,e,r){return n(P.eachOf,t,e,r)}}function g(n){return function(t,e,r,u){return n(v(e),t,r,u)}}function k(n){return function(t,e,r){return n(P.eachOfSeries,t,e,r)}}function b(t,e,r,u){u=i(u||n),e=e||[];var c=o(e)?[]:{};t(e,function(n,t,e){r(n,function(n,r){c[t]=r,e(n)})},function(n){u(n,c)})}function w(n,t,e,r){var u=[];n(t,function(n,t,r){e(n,function(e){e&&u.push({index:t,value:n}),r()})},function(){r(a(u.sort(function(n,t){return n.index-t.index}),function(n){return n.value}))})}function O(n,t,e,r){w(n,t,function(n,t){e(n,function(n){t(!n)})},r)}function S(n,t,e){return function(r,u,i,o){function c(){o&&o(e(!1,void 0))}function a(n,r,u){return o?void i(n,function(r){o&&t(r)&&(o(e(!0,n)),o=i=!1),u()}):u()}arguments.length>3?n(r,u,a,c):(o=i,i=u,n(r,a,c))}}function E(n,t){return t}function L(t,e,r){r=r||n;var u=o(e)?[]:{};t(e,function(n,t,e){n(m(function(n,r){r.length<=1&&(r=r[0]),u[t]=r,e(n)}))},function(n){r(n,u)})}function j(n,t,e,r){var u=[];n(t,function(n,t,r){e(n,function(n,t){u=u.concat(t||[]),r(n)})},function(n){r(n,u)})}function I(t,e,r){function i(t,e,r,u){if(null!=u&&"function"!=typeof u)throw new Error("task callback must be a function");return t.started=!0,M(e)||(e=[e]),0===e.length&&t.idle()?P.setImmediate(function(){t.drain()}):(c(e,function(e){var i={data:e,callback:u||n};r?t.tasks.unshift(i):t.tasks.push(i),t.tasks.length===t.concurrency&&t.saturated()}),void P.setImmediate(t.process))}function o(n,t){return function(){f-=1;var e=!1,r=arguments;c(t,function(n){c(l,function(t,r){t!==n||e||(l.splice(r,1),e=!0)}),n.callback.apply(n,r)}),n.tasks.length+f===0&&n.drain(),n.process()}}if(null==e)e=1;else if(0===e)throw new Error("Concurrency must not be zero");var f=0,l=[],s={tasks:[],concurrency:e,payload:r,saturated:n,empty:n,drain:n,started:!1,paused:!1,push:function(n,t){i(s,n,!1,t)},kill:function(){s.drain=n,s.tasks=[]},unshift:function(n,t){i(s,n,!0,t)},process:function(){for(;!s.paused&&f<s.concurrency&&s.tasks.length;){var n=s.payload?s.tasks.splice(0,s.payload):s.tasks.splice(0,s.tasks.length),e=a(n,function(n){return n.data});0===s.tasks.length&&s.empty(),f+=1,l.push(n[0]);var r=u(o(s,n));t(e,r)}},length:function(){return s.tasks.length},running:function(){return f},workersList:function(){return l},idle:function(){return s.tasks.length+f===0},pause:function(){s.paused=!0},resume:function(){if(s.paused!==!1){s.paused=!1;for(var n=Math.min(s.concurrency,s.tasks.length),t=1;n>=t;t++)P.setImmediate(s.process)}}};return s}function x(n){return m(function(t,e){t.apply(null,e.concat([m(function(t,e){"object"==typeof console&&(t?console.error&&console.error(t):console[n]&&c(e,function(t){console[n](t)}))})]))})}function A(n){return function(t,e,r){n(f(t),e,r)}}function T(n){return m(function(t,e){var r=m(function(e){var r=this,u=e.pop();return n(t,function(n,t,u){n.apply(r,e.concat([u]))},u)});return e.length?r.apply(this,e):r})}function z(n){return m(function(t){var e=t.pop();t.push(function(){var n=arguments;r?P.setImmediate(function(){e.apply(null,n)}):e.apply(null,n)});var r=!0;n.apply(this,t),r=!1})}var q,P={},C="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||this;null!=C&&(q=C.async),P.noConflict=function(){return C.async=q,P};var H=Object.prototype.toString,M=Array.isArray||function(n){return"[object Array]"===H.call(n)},U=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},W=Object.keys||function(n){var t=[];for(var e in n)n.hasOwnProperty(e)&&t.push(e);return t},B="function"==typeof setImmediate&&setImmediate,D=B?function(n){B(n)}:function(n){setTimeout(n,0)};"object"==typeof process&&"function"==typeof process.nextTick?P.nextTick=process.nextTick:P.nextTick=D,P.setImmediate=B?D:P.nextTick,P.forEach=P.each=function(n,t,e){return P.eachOf(n,y(t),e)},P.forEachSeries=P.eachSeries=function(n,t,e){return P.eachOfSeries(n,y(t),e)},P.forEachLimit=P.eachLimit=function(n,t,e,r){return v(t)(n,y(e),r)},P.forEachOf=P.eachOf=function(t,e,r){function o(n){f--,n?r(n):null===c&&0>=f&&r(null)}r=i(r||n),t=t||[];for(var c,a=h(t),f=0;null!=(c=a());)f+=1,e(t[c],c,u(o));0===f&&r(null)},P.forEachOfSeries=P.eachOfSeries=function(t,e,r){function o(){var n=!0;return null===a?r(null):(e(t[a],a,u(function(t){if(t)r(t);else{if(a=c(),null===a)return r(null);n?P.setImmediate(o):o()}})),void(n=!1))}r=i(r||n),t=t||[];var c=h(t),a=c();o()},P.forEachOfLimit=P.eachOfLimit=function(n,t,e,r){v(t)(n,e,r)},P.map=d(b),P.mapSeries=k(b),P.mapLimit=g(b),P.inject=P.foldl=P.reduce=function(n,t,e,r){P.eachOfSeries(n,function(n,r,u){e(t,n,function(n,e){t=e,u(n)})},function(n){r(n,t)})},P.foldr=P.reduceRight=function(n,e,r,u){var i=a(n,t).reverse();P.reduce(i,e,r,u)},P.transform=function(n,t,e,r){3===arguments.length&&(r=e,e=t,t=M(n)?[]:{}),P.eachOf(n,function(n,r,u){e(t,n,r,u)},function(n){r(n,t)})},P.select=P.filter=d(w),P.selectLimit=P.filterLimit=g(w),P.selectSeries=P.filterSeries=k(w),P.reject=d(O),P.rejectLimit=g(O),P.rejectSeries=k(O),P.any=P.some=S(P.eachOf,e,t),P.someLimit=S(P.eachOfLimit,e,t),P.all=P.every=S(P.eachOf,r,r),P.everyLimit=S(P.eachOfLimit,r,r),P.detect=S(P.eachOf,t,E),P.detectSeries=S(P.eachOfSeries,t,E),P.detectLimit=S(P.eachOfLimit,t,E),P.sortBy=function(n,t,e){function r(n,t){var e=n.criteria,r=t.criteria;return r>e?-1:e>r?1:0}P.map(n,function(n,e){t(n,function(t,r){t?e(t):e(null,{value:n,criteria:r})})},function(n,t){return n?e(n):void e(null,a(t.sort(r),function(n){return n.value}))})},P.auto=function(t,e,r){function u(n){g.unshift(n)}function o(n){var t=p(g,n);t>=0&&g.splice(t,1)}function a(){h--,c(g.slice(0),function(n){n()})}"function"==typeof arguments[1]&&(r=e,e=null),r=i(r||n);var f=W(t),h=f.length;if(!h)return r(null);e||(e=h);var y={},v=0,d=!1,g=[];u(function(){h||r(null,y)}),c(f,function(n){function i(){return e>v&&l(k,function(n,t){return n&&y.hasOwnProperty(t)},!0)&&!y.hasOwnProperty(n)}function c(){i()&&(v++,o(c),h[h.length-1](g,y))}if(!d){for(var f,h=M(t[n])?t[n]:[t[n]],g=m(function(t,e){if(v--,e.length<=1&&(e=e[0]),t){var u={};s(y,function(n,t){u[t]=n}),u[n]=e,d=!0,r(t,u)}else y[n]=e,P.setImmediate(a)}),k=h.slice(0,h.length-1),b=k.length;b--;){if(!(f=t[k[b]]))throw new Error("Has nonexistent dependency in "+k.join(", "));if(M(f)&&p(f,n)>=0)throw new Error("Has cyclic dependencies")}i()?(v++,h[h.length-1](g,y)):u(c)}})},P.retry=function(n,t,e){function r(n,t){if("number"==typeof t)n.times=parseInt(t,10)||i;else{if("object"!=typeof t)throw new Error("Unsupported argument type for 'times': "+typeof t);n.times=parseInt(t.times,10)||i,n.interval=parseInt(t.interval,10)||o}}function u(n,t){function e(n,e){return function(r){n(function(n,t){r(!n||e,{err:n,result:t})},t)}}function r(n){return function(t){setTimeout(function(){t(null)},n)}}for(;a.times;){var u=!(a.times-=1);c.push(e(a.task,u)),!u&&a.interval>0&&c.push(r(a.interval))}P.series(c,function(t,e){e=e[e.length-1],(n||a.callback)(e.err,e.result)})}var i=5,o=0,c=[],a={times:i,interval:o},f=arguments.length;if(1>f||f>3)throw new Error("Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)");return 2>=f&&"function"==typeof n&&(e=t,t=n),"function"!=typeof n&&r(a,n),a.callback=e,a.task=t,a.callback?u():u},P.waterfall=function(t,e){function r(n){return m(function(t,u){if(t)e.apply(null,[t].concat(u));else{var i=n.next();i?u.push(r(i)):u.push(e),z(n).apply(null,u)}})}if(e=i(e||n),!M(t)){var u=new Error("First argument to waterfall must be an array of functions");return e(u)}return t.length?void r(P.iterator(t))():e()},P.parallel=function(n,t){L(P.eachOf,n,t)},P.parallelLimit=function(n,t,e){L(v(t),n,e)},P.series=function(n,t){L(P.eachOfSeries,n,t)},P.iterator=function(n){function t(e){function r(){return n.length&&n[e].apply(null,arguments),r.next()}return r.next=function(){return e<n.length-1?t(e+1):null},r}return t(0)},P.apply=m(function(n,t){return m(function(e){return n.apply(null,t.concat(e))})}),P.concat=d(j),P.concatSeries=k(j),P.whilst=function(t,e,r){if(r=r||n,t()){var u=m(function(n,i){n?r(n):t.apply(this,i)?e(u):r.apply(null,[null].concat(i))});e(u)}else r(null)},P.doWhilst=function(n,t,e){var r=0;return P.whilst(function(){return++r<=1||t.apply(this,arguments)},n,e)},P.until=function(n,t,e){return P.whilst(function(){return!n.apply(this,arguments)},t,e)},P.doUntil=function(n,t,e){return P.doWhilst(n,function(){return!t.apply(this,arguments)},e)},P.during=function(t,e,r){r=r||n;var u=m(function(n,e){n?r(n):(e.push(i),t.apply(this,e))}),i=function(n,t){n?r(n):t?e(u):r(null)};t(i)},P.doDuring=function(n,t,e){var r=0;P.during(function(n){r++<1?n(null,!0):t.apply(this,arguments)},n,e)},P.queue=function(n,t){var e=I(function(t,e){n(t[0],e)},t,1);return e},P.priorityQueue=function(t,e){function r(n,t){return n.priority-t.priority}function u(n,t,e){for(var r=-1,u=n.length-1;u>r;){var i=r+(u-r+1>>>1);e(t,n[i])>=0?r=i:u=i-1}return r}function i(t,e,i,o){if(null!=o&&"function"!=typeof o)throw new Error("task callback must be a function");return t.started=!0,M(e)||(e=[e]),0===e.length?P.setImmediate(function(){t.drain()}):void c(e,function(e){var c={data:e,priority:i,callback:"function"==typeof o?o:n};t.tasks.splice(u(t.tasks,c,r)+1,0,c),t.tasks.length===t.concurrency&&t.saturated(),P.setImmediate(t.process)})}var o=P.queue(t,e);return o.push=function(n,t,e){i(o,n,t,e)},delete o.unshift,o},P.cargo=function(n,t){return I(n,1,t)},P.log=x("log"),P.dir=x("dir"),P.memoize=function(n,e){var r={},u={},i=Object.prototype.hasOwnProperty;e=e||t;var o=m(function(t){var o=t.pop(),c=e.apply(null,t);i.call(r,c)?P.setImmediate(function(){o.apply(null,r[c])}):i.call(u,c)?u[c].push(o):(u[c]=[o],n.apply(null,t.concat([m(function(n){r[c]=n;var t=u[c];delete u[c];for(var e=0,i=t.length;i>e;e++)t[e].apply(null,n)})])))});return o.memo=r,o.unmemoized=n,o},P.unmemoize=function(n){return function(){return(n.unmemoized||n).apply(null,arguments)}},P.times=A(P.map),P.timesSeries=A(P.mapSeries),P.timesLimit=function(n,t,e,r){return P.mapLimit(f(n),t,e,r)},P.seq=function(){var t=arguments;return m(function(e){var r=this,u=e[e.length-1];"function"==typeof u?e.pop():u=n,P.reduce(t,e,function(n,t,e){t.apply(r,n.concat([m(function(n,t){e(n,t)})]))},function(n,t){u.apply(r,[n].concat(t))})})},P.compose=function(){return P.seq.apply(null,Array.prototype.reverse.call(arguments))},P.applyEach=T(P.eachOf),P.applyEachSeries=T(P.eachOfSeries),P.forever=function(t,e){function r(n){return n?i(n):void o(r)}var i=u(e||n),o=z(t);r()},P.ensureAsync=z,P.constant=m(function(n){var t=[null].concat(n);return function(n){return n.apply(this,t)}}),P.wrapSync=P.asyncify=function(n){return m(function(t){var e,r=t.pop();try{e=n.apply(this,t)}catch(u){return r(u)}U(e)&&"function"==typeof e.then?e.then(function(n){r(null,n)})["catch"](function(n){r(n.message?n:new Error(n))}):r(null,e)})},"object"==typeof module&&module.exports?module.exports=P:"function"==typeof define&&define.amd?define([],function(){return P}):C.async=P}();
//# sourceMappingURL=dist/async.min.map
/*!

 @Name：layer v2.2 弹层组件
 @Author：贤心
 @Site：http://layer.layui.com
 @License：LGPL
    
 */

;!function(window, undefined){
"use strict";

var $, win, ready = {
  getPath: function(){
    var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
    if(script.getAttribute('merge')) return;
    return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
  }(),
  
  //屏蔽Enter触发弹层
  enter: function(e){
    if(e.keyCode === 13) e.preventDefault();
  },
  config: {}, end: {},
  btn: ['&#x786E;&#x5B9A;','&#x53D6;&#x6D88;'],
  
  //五种原始层模式
  type: ['dialog', 'page', 'iframe', 'loading', 'tips']
};

//默认内置方法。
var layer = {
  v: '2.2',
  ie6: !!window.ActiveXObject&&!window.XMLHttpRequest,
  index: 0,
  path: ready.getPath,
  config: function(options, fn){
    var item = 0;
    options = options || {};
    layer.cache = ready.config = $.extend(ready.config, options);
    layer.path = ready.config.path || layer.path;
    typeof options.extend === 'string' && (options.extend = [options.extend]);
    layer.use('skin/layer.css', (options.extend && options.extend.length > 0) ? (function loop(){
      var ext = options.extend;
      layer.use(ext[ext[item] ? item : item-1], item < ext.length ? function(){
        ++item; 
        return loop;
      }() : fn);
    }()) : fn);
    return this;
  },
  
  //载入配件
  use: function(module, fn, readyMethod){
    var i = 0, head = $('head')[0];
    var module = module.replace(/\s/g, '');
    var iscss = /\.css$/.test(module);
    var node = document.createElement(iscss ? 'link' : 'script');
    var id = 'layui_layer_' + module.replace(/\.|\//g, '');
    if(!layer.path) return;
    if(iscss){
      node.rel = 'stylesheet';
    }
    node[iscss ? 'href' : 'src'] = /^http:\/\//.test(module) ? module : layer.path + module;
    node.id = id;
    if(!$('#'+ id)[0]){
      head.appendChild(node);
    }
    //轮询加载就绪
    ;(function poll() {
      ;(iscss ? parseInt($('#'+id).css('width')) === 1989 : layer[readyMethod||id]) ? function(){
        fn && fn();
        try { iscss || head.removeChild(node); } catch(e){};
      }() : setTimeout(poll, 100);
    }());
    return this;
  },
  
  ready: function(path, fn){
    var type = typeof path === 'function';
    if(type) fn = path;
    layer.config($.extend(ready.config, function(){
       return type ? {} : {path: path};
    }()), fn);
    return this;
  },
  
  //各种快捷引用
  alert: function(content, options, yes){
    var type = typeof options === 'function';
    if(type) yes = options;
    return layer.open($.extend({
      content: content,
      yes: yes
    }, type ? {} : options));
  }, 
  
  confirm: function(content, options, yes, cancel){ 
    var type = typeof options === 'function';
    if(type){
      cancel = yes;
      yes = options;
    }
    return layer.open($.extend({
      content: content,
      btn: ready.btn,
      yes: yes,
      cancel: cancel
    }, type ? {} : options));
  },
  
  msg: function(content, options, end){ //最常用提示层
    var type = typeof options === 'function', rskin = ready.config.skin;
    var skin = (rskin ? rskin + ' ' + rskin + '-msg' : '')||'layui-layer-msg';
    var shift = doms.anim.length - 1;
    if(type) end = options;
    return layer.open($.extend({
      content: content,
      time: 3000,
      shade: false,
      skin: skin,
      title: false,
      closeBtn: false,
      btn: false,
      end: end
    }, (type && !ready.config.skin) ? {
      skin: skin + ' layui-layer-hui',
      shift: shift
    } : function(){
       options = options || {};
       if(options.icon === -1 || options.icon === undefined && !ready.config.skin){
         options.skin = skin + ' ' + (options.skin||'layui-layer-hui');
       }
       return options;
    }()));  
  },
  
  load: function(icon, options){
    return layer.open($.extend({
      type: 3,
      icon: icon || 0,
      shade: 0.01
    }, options));
  }, 
  
  tips: function(content, follow, options){
    return layer.open($.extend({
      type: 4,
      content: [content, follow],
      closeBtn: false,
      time: 3000,
      shade: false,
      maxWidth: 210
    }, options));
  }
};

var Class = function(setings){  
  var that = this;
  that.index = ++layer.index;
  that.config = $.extend({}, that.config, ready.config, setings);
  that.creat();
};

Class.pt = Class.prototype;

//缓存常用字符
var doms = ['layui-layer', '.layui-layer-title', '.layui-layer-main', '.layui-layer-dialog', 'layui-layer-iframe', 'layui-layer-content', 'layui-layer-btn', 'layui-layer-close'];
doms.anim = ['layui-anim', 'layui-anim-01', 'layui-anim-02', 'layui-anim-03', 'layui-anim-04', 'layui-anim-05', 'layui-anim-06'];

//默认配置
Class.pt.config = {
  type: 0,
  shade: 0.3,
  fix: true,
  move: doms[1],
  title: '&#x4FE1;&#x606F;',
  offset: 'auto',
  area: 'auto',
  closeBtn: 1,
  time: 0, //0表示不自动关闭
  zIndex: 19891014, 
  maxWidth: 360,
  shift: 0,
  icon: -1,
  scrollbar: true, //是否允许浏览器滚动条
  tips: 2
};

//容器
Class.pt.vessel = function(conType, callback){
  var that = this, times = that.index, config = that.config;
  var zIndex = config.zIndex + times, titype = typeof config.title === 'object';
  var ismax = config.maxmin && (config.type === 1 || config.type === 2);
  var titleHTML = (config.title ? '<div class="layui-layer-title" style="'+ (titype ? config.title[1] : '') +'">' 
    + (titype ? config.title[0] : config.title) 
  + '</div>' : '');
  
  config.zIndex = zIndex;
  callback([
    //遮罩
    config.shade ? ('<div class="layui-layer-shade" id="layui-layer-shade'+ times +'" times="'+ times +'" style="'+ ('z-index:'+ (zIndex-1) +'; background-color:'+ (config.shade[1]||'#000') +'; opacity:'+ (config.shade[0]||config.shade) +'; filter:alpha(opacity='+ (config.shade[0]*100||config.shade*100) +');') +'"></div>') : '',
    
    //主体
    '<div class="'+ doms[0] +' '+ (doms.anim[config.shift]||'') + (' layui-layer-'+ready.type[config.type]) + (((config.type == 0 || config.type == 2) && !config.shade) ? ' layui-layer-border' : '') + ' ' + (config.skin||'') +'" id="'+ doms[0] + times +'" type="'+ ready.type[config.type] +'" times="'+ times +'" showtime="'+ config.time +'" conType="'+ (conType ? 'object' : 'string') +'" style="z-index: '+ zIndex +'; width:'+ config.area[0] + ';height:' + config.area[1] + (config.fix ? '' : ';position:absolute;') +'">'
      + (conType && config.type != 2 ? '' : titleHTML)
      +'<div id="'+ (config.id||'') +'" class="layui-layer-content'+ ((config.type == 0 && config.icon !== -1) ? ' layui-layer-padding' :'') + (config.type == 3 ? ' layui-layer-loading'+config.icon : '') +'">'
        + (config.type == 0 && config.icon !== -1 ? '<i class="layui-layer-ico layui-layer-ico'+ config.icon +'"></i>' : '')
        + (config.type == 1 && conType ? '' : (config.content||''))
      +'</div>'
      + '<span class="layui-layer-setwin">'+ function(){
        var closebtn = ismax ? '<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : '';
        config.closeBtn && (closebtn += '<a class="layui-layer-ico '+ doms[7] +' '+ doms[7] + (config.title ? config.closeBtn : (config.type == 4 ? '1' : '2')) +'" href="javascript:;"></a>');
        return closebtn;
      }() + '</span>'
      + (config.btn ? function(){
        var button = '';
        typeof config.btn === 'string' && (config.btn = [config.btn]);
        for(var i = 0, len = config.btn.length; i < len; i++){
          button += '<a class="'+ doms[6] +''+ i +'">'+ config.btn[i] +'</a>'
        }
        return '<div class="'+ doms[6] +'">'+ button +'</div>'
      }() : '')
    +'</div>'
  ], titleHTML);
  return that;
};

//创建骨架
Class.pt.creat = function(){
  var that = this, config = that.config, times = that.index, nodeIndex;
  var content = config.content, conType = typeof content === 'object';
  
  if($('#'+config.id)[0])  return;
  
  if(typeof config.area === 'string'){
    config.area = config.area === 'auto' ? ['', ''] : [config.area, ''];
  }
  
  switch(config.type){
    case 0:
      config.btn = ('btn' in config) ? config.btn : ready.btn[0];
      layer.closeAll('dialog');
    break;
    case 2:
      var content = config.content = conType ? config.content : [config.content||'http://layer.layui.com', 'auto'];
      config.content = '<iframe scrolling="'+ (config.content[1]||'auto') +'" allowtransparency="true" id="'+ doms[4] +''+ times +'" name="'+ doms[4] +''+ times +'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="' + config.content[0] + '"></iframe>';
    break;
    case 3:
      config.title = false;
      config.closeBtn = false;
      config.icon === -1 && (config.icon === 0);
      layer.closeAll('loading');
    break;
    case 4:
      conType || (config.content = [config.content, 'body']);
      config.follow = config.content[1];
      config.content = config.content[0] + '<i class="layui-layer-TipsG"></i>';
      config.title = false;
      config.fix = false;
      config.tips = typeof config.tips === 'object' ? config.tips : [config.tips, true];
      config.tipsMore || layer.closeAll('tips');
    break;
  }
  
  //建立容器
  that.vessel(conType, function(html, titleHTML){
    $('body').append(html[0]);
    conType ? function(){
      (config.type == 2 || config.type == 4) ? function(){
        $('body').append(html[1]);
      }() : function(){
        if(!content.parents('.'+doms[0])[0]){
          content.show().addClass('layui-layer-wrap').wrap(html[1]);
          $('#'+ doms[0] + times).find('.'+doms[5]).before(titleHTML);
        }
      }();
    }() : $('body').append(html[1]);
    that.layero = $('#'+ doms[0] + times);
    config.scrollbar || doms.html.css('overflow', 'hidden').attr('layer-full', times);
  }).auto(times);

  config.type == 2 && layer.ie6 && that.layero.find('iframe').attr('src', content[0]);
  $(document).off('keydown', ready.enter).on('keydown', ready.enter);
  that.layero.on('keydown', function(e){
    $(document).off('keydown', ready.enter);
  });

  //坐标自适应浏览器窗口尺寸
  config.type == 4 ? that.tips() : that.offset();
  if(config.fix){
    win.on('resize', function(){
      that.offset();
      (/^\d+%$/.test(config.area[0]) || /^\d+%$/.test(config.area[1])) && that.auto(times);
      config.type == 4 && that.tips();
    });
  }
  
  config.time <= 0 || setTimeout(function(){
    layer.close(that.index)
  }, config.time);
  that.move().callback();
};

//自适应
Class.pt.auto = function(index){
  var that = this, config = that.config, layero = $('#'+ doms[0] + index);
  if(config.area[0] === '' && config.maxWidth > 0){
    //为了修复IE7下一个让人难以理解的bug
    if(/MSIE 7/.test(navigator.userAgent) && config.btn){
      layero.width(layero.innerWidth());
    }
    layero.outerWidth() > config.maxWidth && layero.width(config.maxWidth);
  }
  var area = [layero.innerWidth(), layero.innerHeight()];
  var titHeight = layero.find(doms[1]).outerHeight() || 0;
  var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
  function setHeight(elem){
    elem = layero.find(elem);
    elem.height(area[1] - titHeight - btnHeight - 2*(parseFloat(elem.css('padding'))|0));
  }
  switch(config.type){
    case 2: 
      setHeight('iframe');
    break;
    default:
      if(config.area[1] === ''){
        if(config.fix && area[1] >= win.height()){
          area[1] = win.height();
          setHeight('.'+doms[5]);
        }
      } else {
        setHeight('.'+doms[5]);
      }
    break;
  }
  return that;
};

//计算坐标
Class.pt.offset = function(){
  var that = this, config = that.config, layero = that.layero;
  var area = [layero.outerWidth(), layero.outerHeight()];
  var type = typeof config.offset === 'object';
  that.offsetTop = (win.height() - area[1])/2;
  that.offsetLeft = (win.width() - area[0])/2;
  if(type){
    that.offsetTop = config.offset[0];
    that.offsetLeft = config.offset[1]||that.offsetLeft;
  } else if(config.offset !== 'auto'){
    that.offsetTop = config.offset;
    if(config.offset === 'rb'){ //右下角
      that.offsetTop = win.height() - area[1];
      that.offsetLeft = win.width() - area[0];
    }
  }
  if(!config.fix){
    that.offsetTop = /%$/.test(that.offsetTop) ? 
      win.height()*parseFloat(that.offsetTop)/100
    : parseFloat(that.offsetTop);
    that.offsetLeft = /%$/.test(that.offsetLeft) ? 
      win.width()*parseFloat(that.offsetLeft)/100
    : parseFloat(that.offsetLeft);
    that.offsetTop += win.scrollTop();
    that.offsetLeft += win.scrollLeft();
  }
  layero.css({top: that.offsetTop, left: that.offsetLeft});
};

//Tips
Class.pt.tips = function(){
  var that = this, config = that.config, layero = that.layero;
  var layArea = [layero.outerWidth(), layero.outerHeight()], follow = $(config.follow);
  if(!follow[0]) follow = $('body');
  var goal = {
    width: follow.outerWidth(),
    height: follow.outerHeight(),
    top: follow.offset().top,
    left: follow.offset().left
  }, tipsG = layero.find('.layui-layer-TipsG');
  
  var guide = config.tips[0];
  config.tips[1] || tipsG.remove();
  
  goal.autoLeft = function(){
    if(goal.left + layArea[0] - win.width() > 0){
      goal.tipLeft = goal.left + goal.width - layArea[0];
      tipsG.css({right: 12, left: 'auto'});
    } else {
      goal.tipLeft = goal.left;
    };
  };
  
  //辨别tips的方位
  goal.where = [function(){ //上        
    goal.autoLeft();
    goal.tipTop = goal.top - layArea[1] - 10;
    tipsG.removeClass('layui-layer-TipsB').addClass('layui-layer-TipsT').css('border-right-color', config.tips[1]);
  }, function(){ //右
    goal.tipLeft = goal.left + goal.width + 10;
    goal.tipTop = goal.top;
    tipsG.removeClass('layui-layer-TipsL').addClass('layui-layer-TipsR').css('border-bottom-color', config.tips[1]); 
  }, function(){ //下
    goal.autoLeft();
    goal.tipTop = goal.top + goal.height + 10;
    tipsG.removeClass('layui-layer-TipsT').addClass('layui-layer-TipsB').css('border-right-color', config.tips[1]);
  }, function(){ //左
    goal.tipLeft = goal.left - layArea[0] - 10;
    goal.tipTop = goal.top;
    tipsG.removeClass('layui-layer-TipsR').addClass('layui-layer-TipsL').css('border-bottom-color', config.tips[1]);
  }];
  goal.where[guide-1]();
  
  /* 8*2为小三角形占据的空间 */
  if(guide === 1){
    goal.top - (win.scrollTop() + layArea[1] + 8*2) < 0 && goal.where[2]();
  } else if(guide === 2){
    win.width() - (goal.left + goal.width + layArea[0] + 8*2) > 0 || goal.where[3]()
  } else if(guide === 3){
    (goal.top - win.scrollTop() + goal.height + layArea[1] + 8*2) - win.height() > 0 && goal.where[0]();
  } else if(guide === 4){
     layArea[0] + 8*2 - goal.left > 0 && goal.where[1]()
  }

  layero.find('.'+doms[5]).css({
    'background-color': config.tips[1], 
    'padding-right': (config.closeBtn ? '30px' : '')
  });
  layero.css({left: goal.tipLeft, top: goal.tipTop});
}

//拖拽层
Class.pt.move = function(){
  var that = this, config = that.config, conf = {
    setY: 0,
    moveLayer: function(){
      var layero = conf.layero, mgleft = parseInt(layero.css('margin-left'));
      var lefts = parseInt(conf.move.css('left'));
      mgleft === 0 || (lefts = lefts - mgleft);
      if(layero.css('position') !== 'fixed'){
        lefts = lefts - layero.parent().offset().left;
        conf.setY = 0;
      }
      layero.css({left: lefts, top: parseInt(conf.move.css('top')) - conf.setY});
    }
  };
  
  var movedom = that.layero.find(config.move);
  config.move && movedom.attr('move', 'ok');
  movedom.css({cursor: config.move ? 'move' : 'auto'});
  
  $(config.move).on('mousedown', function(M){  
    M.preventDefault();
    if($(this).attr('move') === 'ok'){
      conf.ismove = true;
      conf.layero = $(this).parents('.'+ doms[0]);
      var xx = conf.layero.offset().left, yy = conf.layero.offset().top, ww = conf.layero.outerWidth() - 6, hh = conf.layero.outerHeight() - 6;
      if(!$('#layui-layer-moves')[0]){
        $('body').append('<div id="layui-layer-moves" class="layui-layer-moves" style="left:'+ xx +'px; top:'+ yy +'px; width:'+ ww +'px; height:'+ hh +'px; z-index:2147483584"></div>');
      }
      conf.move = $('#layui-layer-moves');
      config.moveType && conf.move.css({visibility: 'hidden'});
       
      conf.moveX = M.pageX - conf.move.position().left;
      conf.moveY = M.pageY - conf.move.position().top;
      conf.layero.css('position') !== 'fixed' || (conf.setY = win.scrollTop());
    }
  });
  
  $(document).mousemove(function(M){
    if(conf.ismove){
      var offsetX = M.pageX - conf.moveX, offsetY = M.pageY - conf.moveY;
      M.preventDefault();

      //控制元素不被拖出窗口外
      if(!config.moveOut){
        conf.setY = win.scrollTop();
        var setRig = win.width() - conf.move.outerWidth(), setTop = conf.setY;         
        offsetX < 0 && (offsetX = 0);
        offsetX > setRig && (offsetX = setRig); 
        offsetY < setTop && (offsetY = setTop);
        offsetY > win.height() - conf.move.outerHeight() + conf.setY && (offsetY = win.height() - conf.move.outerHeight() + conf.setY);
      }
      
      conf.move.css({left: offsetX, top: offsetY});  
      config.moveType && conf.moveLayer();
      
      offsetX = offsetY = setRig = setTop = null;
    }                         
  }).mouseup(function(){
    try{
      if(conf.ismove){
        conf.moveLayer();
        conf.move.remove();
        config.moveEnd && config.moveEnd();
      }
      conf.ismove = false;
    }catch(e){
      conf.ismove = false;
    }
  });
  return that;
};

Class.pt.callback = function(){
  var that = this, layero = that.layero, config = that.config;
  that.openLayer();
  if(config.success){
    if(config.type == 2){
      layero.find('iframe').on('load', function(){
        config.success(layero, that.index);
      });
    } else {
      config.success(layero, that.index);
    }
  }
  layer.ie6 && that.IE6(layero);
  
  //按钮
  layero.find('.'+ doms[6]).children('a').on('click', function(){
    var index = $(this).index();
    config['btn'+(index+1)] && config['btn'+(index+1)](that.index, layero);
    if(index === 0){
      config.yes ? config.yes(that.index, layero) : layer.close(that.index);
    } else if(index === 1){
      cancel();
    } else {
      config['btn'+(index+1)] || layer.close(that.index);
    }
  });
  
  //取消
  function cancel(){
    var close = config.cancel && config.cancel(that.index);
    close === false || layer.close(that.index);
  }
  
  //右上角关闭回调
  layero.find('.'+ doms[7]).on('click', cancel);
  
  //点遮罩关闭
  if(config.shadeClose){
    $('#layui-layer-shade'+ that.index).on('click', function(){
      layer.close(that.index);
    });
  } 
  
  //最小化
  layero.find('.layui-layer-min').on('click', function(){
    layer.min(that.index, config);
    config.min && config.min(layero);
  });
  
  //全屏/还原
  layero.find('.layui-layer-max').on('click', function(){
    if($(this).hasClass('layui-layer-maxmin')){
      layer.restore(that.index);
      config.restore && config.restore(layero);
    } else {
      layer.full(that.index, config);
      config.full && config.full(layero);
    }
  });

  config.end && (ready.end[that.index] = config.end);
};

//for ie6 恢复select
ready.reselect = function(){
  $.each($('select'), function(index , value){
    var sthis = $(this);
    if(!sthis.parents('.'+doms[0])[0]){
      (sthis.attr('layer') == 1 && $('.'+doms[0]).length < 1) && sthis.removeAttr('layer').show(); 
    }
    sthis = null;
  });
}; 

Class.pt.IE6 = function(layero){
  var that = this, _ieTop = layero.offset().top;
  
  //ie6的固定与相对定位
  function ie6Fix(){
    layero.css({top : _ieTop + (that.config.fix ? win.scrollTop() : 0)});
  };
  ie6Fix();
  win.scroll(ie6Fix);

  //隐藏select
  $('select').each(function(index , value){
    var sthis = $(this);
    if(!sthis.parents('.'+doms[0])[0]){
      sthis.css('display') === 'none' || sthis.attr({'layer' : '1'}).hide();
    }
    sthis = null;
  });
};

//需依赖原型的对外方法
Class.pt.openLayer = function(){
  var that = this;
  
  //置顶当前窗口
  layer.zIndex = that.config.zIndex;
  layer.setTop = function(layero){
    var setZindex = function(){
      layer.zIndex++;
      layero.css('z-index', layer.zIndex + 1);
    };
    layer.zIndex = parseInt(layero[0].style.zIndex);
    layero.on('mousedown', setZindex);
    return layer.zIndex;
  };
};

ready.record = function(layero){
  var area = [
    layero.outerWidth(),
    layero.outerHeight(),
    layero.position().top, 
    layero.position().left + parseFloat(layero.css('margin-left'))
  ];
  layero.find('.layui-layer-max').addClass('layui-layer-maxmin');
  layero.attr({area: area});
};

ready.rescollbar = function(index){
  if(doms.html.attr('layer-full') == index){
    if(doms.html[0].style.removeProperty){
      doms.html[0].style.removeProperty('overflow');
    } else {
      doms.html[0].style.removeAttribute('overflow');
    }
    doms.html.removeAttr('layer-full');
  }
};

/** 内置成员 */

window.layer = layer;

//获取子iframe的DOM
layer.getChildFrame = function(selector, index){
  index = index || $('.'+doms[4]).attr('times');
  return $('#'+ doms[0] + index).find('iframe').contents().find(selector);  
};

//得到当前iframe层的索引，子iframe时使用
layer.getFrameIndex = function(name){
  return $('#'+ name).parents('.'+doms[4]).attr('times');
};

//iframe层自适应宽高
layer.iframeAuto = function(index){
  if(!index) return;
  var heg = layer.getChildFrame('html', index).outerHeight();
  var layero = $('#'+ doms[0] + index);
  var titHeight = layero.find(doms[1]).outerHeight() || 0;
  var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
  layero.css({height: heg + titHeight + btnHeight});
  layero.find('iframe').css({height: heg});
};

//重置iframe url
layer.iframeSrc = function(index, url){
  $('#'+ doms[0] + index).find('iframe').attr('src', url);
};

//设定层的样式
layer.style = function(index, options){
  var layero = $('#'+ doms[0] + index), type = layero.attr('type');
  var titHeight = layero.find(doms[1]).outerHeight() || 0;
  var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
  if(type === ready.type[1] || type === ready.type[2]){
    layero.css(options);
    if(type === ready.type[2]){
      layero.find('iframe').css({
        height: parseFloat(options.height) - titHeight - btnHeight
      });
    }
  }
};

//最小化
layer.min = function(index, options){
  var layero = $('#'+ doms[0] + index);
  var titHeight = layero.find(doms[1]).outerHeight() || 0;
  ready.record(layero);
  layer.style(index, {width: 180, height: titHeight, overflow: 'hidden'});
  layero.find('.layui-layer-min').hide();
  layero.attr('type') === 'page' && layero.find(doms[4]).hide();
  ready.rescollbar(index);
};

//还原
layer.restore = function(index){
  var layero = $('#'+ doms[0] + index), area = layero.attr('area').split(',');
  var type = layero.attr('type');
  layer.style(index, {
    width: parseFloat(area[0]), 
    height: parseFloat(area[1]), 
    top: parseFloat(area[2]), 
    left: parseFloat(area[3]),
    overflow: 'visible'
  });
  layero.find('.layui-layer-max').removeClass('layui-layer-maxmin');
  layero.find('.layui-layer-min').show();
  layero.attr('type') === 'page' && layero.find(doms[4]).show();
  ready.rescollbar(index);
};

//全屏
layer.full = function(index){
  var layero = $('#'+ doms[0] + index), timer;
  ready.record(layero);
  if(!doms.html.attr('layer-full')){
    doms.html.css('overflow','hidden').attr('layer-full', index);
  }
  clearTimeout(timer);
  timer = setTimeout(function(){
    var isfix = layero.css('position') === 'fixed';
    layer.style(index, {
       top: isfix ? 0 : win.scrollTop(),
       left: isfix ? 0 : win.scrollLeft(),
       width: win.width(),
       height: win.height()
    });
    layero.find('.layui-layer-min').hide();
  }, 100);
};

//改变title
layer.title = function(name, index){
  var title = $('#'+ doms[0] + (index||layer.index)).find(doms[1]);
  title.html(name);
};

//关闭layer总方法
layer.close = function(index){
  var layero = $('#'+ doms[0] + index), type = layero.attr('type');
  if(!layero[0]) return;
  if(type === ready.type[1] && layero.attr('conType') === 'object'){
    layero.children(':not(.'+ doms[5] +')').remove();
    for(var i = 0; i < 2; i++){
      layero.find('.layui-layer-wrap').unwrap().hide();
    }
  } else {
    //低版本IE 回收 iframe
    if(type === ready.type[2]){
      try {
        var iframe = $('#'+doms[4]+index)[0];
        iframe.contentWindow.document.write('');
        iframe.contentWindow.close();
        layero.find('.'+doms[5])[0].removeChild(iframe);
      } catch(e){}
    }
    layero[0].innerHTML = '';
    layero.remove();
  }
  $('#layui-layer-moves, #layui-layer-shade' + index).remove();
  layer.ie6 && ready.reselect();
  ready.rescollbar(index);
  $(document).off('keydown', ready.enter);
  typeof ready.end[index] === 'function' && ready.end[index]();
  delete ready.end[index]; 
};

//关闭所有层
layer.closeAll = function(type){
  $.each($('.'+doms[0]), function(){
    var othis = $(this);
    var is = type ? (othis.attr('type') === type) : 1;
    is && layer.close(othis.attr('times'));
    is = null;
  });
};

//主入口
ready.run = function(){
  $ = jQuery; 
  win = $(window);
  doms.html = $('html');
  layer.open = function(deliver){
    var o = new Class(deliver);
    return o.index;
  };
};

'function' === typeof define ? define(function(){
  ready.run();
  return layer;
}) : function(){
   ready.run();
   layer.use('skin/layer.css');
}();

}(window);
!function(){"use strict";var a=angular.module("ngNotify",[]),b=!1;try{angular.module("ngSanitize")&&(angular.module("ngNotify").requires.push("ngSanitize"),b=!0)}catch(c){}var d='<div class="ngn" ng-class="ngNotify.notifyClass" ng-style="ngNotify.notifyStyle"><span ng-show="ngNotify.notifyButton" class="ngn-dismiss" ng-click="dismiss()">&times;</span><span ng-if="ngNotify.notifyHtml" ng-bind-html="ngNotify.notifyMessage"></span><span ng-if="!ngNotify.notifyHtml" ng-bind="ngNotify.notifyMessage"></span></div>';a.run(["$templateCache",function(a){a.put("templates/ng-notify/ng-notify.html",d)}]),a.provider("ngNotify",function(){this.$get=["$document","$compile","$log","$rootScope","$timeout","$interval","$templateCache",function(a,c,d,e,f,g,h){var i,j,k="",l=" ",m=3e3,n="ngn-sticky",o=1,p=-1,q=200,r=500,s=25,t=0,u=1,v={theme:"pure",position:"bottom",duration:m,type:"info",sticky:!1,button:!0,html:!1},w={notifyClass:"",notifyMessage:"",notifyStyle:{display:"none",opacity:t}},x={pure:k,prime:"ngn-prime",pastel:"ngn-pastel",pitchy:"ngn-pitchy"},y={info:"ngn-info",error:"ngn-error",success:"ngn-success",warn:"ngn-warn",grimace:"ngn-grimace"},z={bottom:"ngn-bottom",top:"ngn-top"},A=e.$new(),B=c(h.get("templates/ng-notify/ng-notify.html"))(A);A.ngNotify=angular.extend({},w),f(function(){a.find("body").append(B)});var C=function(a){var b=a.type||v.type;return(y[b]||y.info)+l},D=function(a){var b=a.theme||v.theme;return(x[b]||x.pure)+l},E=function(a){var b=a.position||v.position;return(z[b]||z.bottom)+l},F=function(a){var b=a.duration||v.duration;return angular.isNumber(b)?b:m},G=function(a){var b=void 0!==a.sticky?a.sticky:v.sticky;return b?!0:!1},H=function(a,b){var c=void 0!==a.button?a.button:v.button;return c&&b},I=function(a){if((a.html||v.html)&&!b)return d.debug("ngNotify warning: \ngSanitize couldn't be located.  In order to use the 'html' option, be sure the ngSanitize source is included in your project."),!1;var c=void 0!==a.html?a.html:v.html;return c?!0:!1},J=function(a,b){var c=C(a)+D(a)+E(a);return c+=b?n:k},K=function(){A.ngNotify=angular.extend({},w)},L=function(a,b,c,d){var e=s/c;A.ngNotify.notifyStyle={display:"block",opacity:b};var f=function(){b+=a*e,A.ngNotify.notifyStyle.opacity=b,(t>=b||b>=u)&&(g.cancel(j),j=!1,d())};j||(j=g(f,s))},M=function(a,b){L(p,u,a,b)},N=function(a,b){L(o,t,a,b)};return A.dismiss=function(){M(r,function(){K()})},{config:function(a){a=a||{},angular.extend(v,a)},set:function(a,b){if(a){g.cancel(j),j=!1,f.cancel(i);var c={};"object"==typeof b?c=b:c.type=b;var d=G(c),e=F(c);angular.extend(A.ngNotify,{notifyHtml:I(c),notifyClass:J(c,d),notifyButton:H(c,d),notifyMessage:a}),N(q,function(){d||(i=f(function(){A.dismiss()},e))})}},dismiss:function(){A.dismiss()},addTheme:function(a,b){a&&b&&(x[a]=b)},addType:function(a,b){a&&b&&(y[a]=b)}}}]})}();
//# sourceMappingURL=ng-notify.min.js.map
/*! 
 * angular-loading-bar v0.8.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2015 Wes Cruver
 * License: MIT
 */
!function(){"use strict";angular.module("angular-loading-bar",["cfp.loadingBarInterceptor"]),angular.module("chieffancypants.loadingBar",["cfp.loadingBarInterceptor"]),angular.module("cfp.loadingBarInterceptor",["cfp.loadingBar"]).config(["$httpProvider",function(a){var b=["$q","$cacheFactory","$timeout","$rootScope","$log","cfpLoadingBar",function(b,c,d,e,f,g){function h(){d.cancel(j),g.complete(),l=0,k=0}function i(b){var d,e=c.get("$http"),f=a.defaults;!b.cache&&!f.cache||b.cache===!1||"GET"!==b.method&&"JSONP"!==b.method||(d=angular.isObject(b.cache)?b.cache:angular.isObject(f.cache)?f.cache:e);var g=void 0!==d?void 0!==d.get(b.url):!1;return void 0!==b.cached&&g!==b.cached?b.cached:(b.cached=g,g)}var j,k=0,l=0,m=g.latencyThreshold;return{request:function(a){return a.ignoreLoadingBar||i(a)||(e.$broadcast("cfpLoadingBar:loading",{url:a.url}),0===k&&(j=d(function(){g.start()},m)),k++,g.set(l/k)),a},response:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),a):(f.error("Broken interceptor detected: Config object not supplied in response:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),a)},responseError:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),b.reject(a)):(f.error("Broken interceptor detected: Config object not supplied in rejection:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),b.reject(a))}}}];a.interceptors.push(b)}]),angular.module("cfp.loadingBar",[]).provider("cfpLoadingBar",function(){this.autoIncrement=!0,this.includeSpinner=!0,this.includeBar=!0,this.latencyThreshold=100,this.startSize=.02,this.parentSelector="body",this.spinnerTemplate='<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',this.loadingBarTemplate='<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>',this.$get=["$injector","$document","$timeout","$rootScope",function(a,b,c,d){function e(){k||(k=a.get("$animate"));var e=b.find(n).eq(0);c.cancel(m),r||(d.$broadcast("cfpLoadingBar:started"),r=!0,v&&k.enter(o,e,angular.element(e[0].lastChild)),u&&k.enter(q,e,angular.element(e[0].lastChild)),f(w))}function f(a){if(r){var b=100*a+"%";p.css("width",b),s=a,t&&(c.cancel(l),l=c(function(){g()},250))}}function g(){if(!(h()>=1)){var a=0,b=h();a=b>=0&&.25>b?(3*Math.random()+3)/100:b>=.25&&.65>b?3*Math.random()/100:b>=.65&&.9>b?2*Math.random()/100:b>=.9&&.99>b?.005:0;var c=h()+a;f(c)}}function h(){return s}function i(){s=0,r=!1}function j(){k||(k=a.get("$animate")),d.$broadcast("cfpLoadingBar:completed"),f(1),c.cancel(m),m=c(function(){var a=k.leave(o,i);a&&a.then&&a.then(i),k.leave(q)},500)}var k,l,m,n=this.parentSelector,o=angular.element(this.loadingBarTemplate),p=o.find("div").eq(0),q=angular.element(this.spinnerTemplate),r=!1,s=0,t=this.autoIncrement,u=this.includeSpinner,v=this.includeBar,w=this.startSize;return{start:e,set:f,status:h,inc:g,complete:j,autoIncrement:this.autoIncrement,includeSpinner:this.includeSpinner,latencyThreshold:this.latencyThreshold,parentSelector:this.parentSelector,startSize:this.startSize}}]})}();
/*
 AngularJS v1.5.2
 (c) 2010-2016 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(A,e,B){'use strict';function C(a){var c=[];v(c,e.noop).chars(a);return c.join("")}function h(a,c){var b={},d=a.split(","),l;for(l=0;l<d.length;l++)b[c?e.lowercase(d[l]):d[l]]=!0;return b}function D(a,c){null===a||a===B?a="":"string"!==typeof a&&(a=""+a);g.innerHTML=a;var b=5;do{if(0===b)throw w("uinput");b--;11>=document.documentMode&&n(g);a=g.innerHTML;g.innerHTML=a}while(a!==g.innerHTML);for(b=g.firstChild;b;){switch(b.nodeType){case 1:c.start(b.nodeName.toLowerCase(),E(b.attributes));
break;case 3:c.chars(b.textContent)}var d;if(!(d=b.firstChild)&&(1==b.nodeType&&c.end(b.nodeName.toLowerCase()),d=b.nextSibling,!d))for(;null==d;){b=b.parentNode;if(b===g)break;d=b.nextSibling;1==b.nodeType&&c.end(b.nodeName.toLowerCase())}b=d}for(;b=g.firstChild;)g.removeChild(b)}function E(a){for(var c={},b=0,d=a.length;b<d;b++){var l=a[b];c[l.name]=l.value}return c}function x(a){return a.replace(/&/g,"&amp;").replace(F,function(a){var b=a.charCodeAt(0);a=a.charCodeAt(1);return"&#"+(1024*(b-55296)+
(a-56320)+65536)+";"}).replace(G,function(a){return"&#"+a.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function v(a,c){var b=!1,d=e.bind(a,a.push);return{start:function(a,f){a=e.lowercase(a);!b&&H[a]&&(b=a);b||!0!==t[a]||(d("<"),d(a),e.forEach(f,function(b,f){var g=e.lowercase(f),h="img"===a&&"src"===g||"background"===g;!0!==I[g]||!0===y[g]&&!c(b,h)||(d(" "),d(f),d('="'),d(x(b)),d('"'))}),d(">"))},end:function(a){a=e.lowercase(a);b||!0!==t[a]||!0===z[a]||(d("</"),d(a),d(">"));a==
b&&(b=!1)},chars:function(a){b||d(x(a))}}}function n(a){if(a.nodeType===Node.ELEMENT_NODE)for(var c=a.attributes,b=0,d=c.length;b<d;b++){var e=c[b],f=e.name.toLowerCase();if("xmlns:ns1"===f||0===f.indexOf("ns1:"))a.removeAttributeNode(e),b--,d--}(c=a.firstChild)&&n(c);(c=a.nextSibling)&&n(c)}var w=e.$$minErr("$sanitize"),F=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,G=/([^\#-~ |!])/g,z=h("area,br,col,hr,img,wbr"),q=h("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),k=h("rp,rt"),u=e.extend({},k,q),q=e.extend({},
q,h("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul")),k=e.extend({},k,h("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),J=h("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,stop,svg,switch,text,title,tspan"),
H=h("script,style"),t=e.extend({},z,q,k,u),y=h("background,cite,href,longdesc,src,xlink:href"),u=h("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,valign,value,vspace,width"),k=h("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan",
!0),I=e.extend({},y,k,u),g;(function(a){if(a.document&&a.document.implementation)a=a.document.implementation.createHTMLDocument("inert");else throw w("noinert");var c=(a.documentElement||a.getDocumentElement()).getElementsByTagName("body");1===c.length?g=c[0]:(c=a.createElement("html"),g=a.createElement("body"),c.appendChild(g),a.appendChild(c))})(A);e.module("ngSanitize",[]).provider("$sanitize",function(){var a=!1;this.$get=["$$sanitizeUri",function(c){a&&e.extend(t,J);return function(a){var d=
[];D(a,v(d,function(a,b){return!/^unsafe:/.test(c(a,b))}));return d.join("")}}];this.enableSvg=function(c){return e.isDefined(c)?(a=c,this):a}});e.module("ngSanitize").filter("linky",["$sanitize",function(a){var c=/((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,b=/^mailto:/i,d=e.$$minErr("linky"),g=e.isString;return function(f,h,m){function k(a){a&&p.push(C(a))}function q(a,b){var c;p.push("<a ");e.isFunction(m)&&(m=m(a));if(e.isObject(m))for(c in m)p.push(c+
'="'+m[c]+'" ');else m={};!e.isDefined(h)||"target"in m||p.push('target="',h,'" ');p.push('href="',a.replace(/"/g,"&quot;"),'">');k(b);p.push("</a>")}if(null==f||""===f)return f;if(!g(f))throw d("notstring",f);for(var r=f,p=[],s,n;f=r.match(c);)s=f[0],f[2]||f[4]||(s=(f[3]?"http://":"mailto:")+s),n=f.index,k(r.substr(0,n)),q(s,f[0].replace(b,"")),r=r.substring(n+f[0].length);k(r);return a(p.join(""))}}])})(window,window.angular);
//# sourceMappingURL=angular-sanitize.min.js.map

/*!
 * ui-select
 * http://github.com/angular-ui/ui-select
 * Version: 0.14.8 - 2016-02-18T22:01:43.792Z
 * License: MIT
 */


(function () { 
"use strict";
var KEY = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    BACKSPACE: 8,
    DELETE: 46,
    COMMAND: 91,

    MAP: { 91 : "COMMAND", 8 : "BACKSPACE" , 9 : "TAB" , 13 : "ENTER" , 16 : "SHIFT" , 17 : "CTRL" , 18 : "ALT" , 19 : "PAUSEBREAK" , 20 : "CAPSLOCK" , 27 : "ESC" , 32 : "SPACE" , 33 : "PAGE_UP", 34 : "PAGE_DOWN" , 35 : "END" , 36 : "HOME" , 37 : "LEFT" , 38 : "UP" , 39 : "RIGHT" , 40 : "DOWN" , 43 : "+" , 44 : "PRINTSCREEN" , 45 : "INSERT" , 46 : "DELETE", 48 : "0" , 49 : "1" , 50 : "2" , 51 : "3" , 52 : "4" , 53 : "5" , 54 : "6" , 55 : "7" , 56 : "8" , 57 : "9" , 59 : ";", 61 : "=" , 65 : "A" , 66 : "B" , 67 : "C" , 68 : "D" , 69 : "E" , 70 : "F" , 71 : "G" , 72 : "H" , 73 : "I" , 74 : "J" , 75 : "K" , 76 : "L", 77 : "M" , 78 : "N" , 79 : "O" , 80 : "P" , 81 : "Q" , 82 : "R" , 83 : "S" , 84 : "T" , 85 : "U" , 86 : "V" , 87 : "W" , 88 : "X" , 89 : "Y" , 90 : "Z", 96 : "0" , 97 : "1" , 98 : "2" , 99 : "3" , 100 : "4" , 101 : "5" , 102 : "6" , 103 : "7" , 104 : "8" , 105 : "9", 106 : "*" , 107 : "+" , 109 : "-" , 110 : "." , 111 : "/", 112 : "F1" , 113 : "F2" , 114 : "F3" , 115 : "F4" , 116 : "F5" , 117 : "F6" , 118 : "F7" , 119 : "F8" , 120 : "F9" , 121 : "F10" , 122 : "F11" , 123 : "F12", 144 : "NUMLOCK" , 145 : "SCROLLLOCK" , 186 : ";" , 187 : "=" , 188 : "," , 189 : "-" , 190 : "." , 191 : "/" , 192 : "`" , 219 : "[" , 220 : "\\" , 221 : "]" , 222 : "'"
    },

    isControl: function (e) {
        var k = e.which;
        switch (k) {
        case KEY.COMMAND:
        case KEY.SHIFT:
        case KEY.CTRL:
        case KEY.ALT:
            return true;
        }

        if (e.metaKey) return true;

        return false;
    },
    isFunctionKey: function (k) {
        k = k.which ? k.which : k;
        return k >= 112 && k <= 123;
    },
    isVerticalMovement: function (k){
      return ~[KEY.UP, KEY.DOWN].indexOf(k);
    },
    isHorizontalMovement: function (k){
      return ~[KEY.LEFT,KEY.RIGHT,KEY.BACKSPACE,KEY.DELETE].indexOf(k);
    },
    toSeparator: function (k) {
      var sep = {ENTER:"\n",TAB:"\t",SPACE:" "}[k];
      if (sep) return sep;
      // return undefined for special keys other than enter, tab or space.
      // no way to use them to cut strings.
      return KEY[k] ? undefined : k;
    }
  };

/**
 * Add querySelectorAll() to jqLite.
 *
 * jqLite find() is limited to lookups by tag name.
 * TODO This will change with future versions of AngularJS, to be removed when this happens
 *
 * See jqLite.find - why not use querySelectorAll? https://github.com/angular/angular.js/issues/3586
 * See feat(jqLite): use querySelectorAll instead of getElementsByTagName in jqLite.find https://github.com/angular/angular.js/pull/3598
 */
if (angular.element.prototype.querySelectorAll === undefined) {
  angular.element.prototype.querySelectorAll = function(selector) {
    return angular.element(this[0].querySelectorAll(selector));
  };
}

/**
 * Add closest() to jqLite.
 */
if (angular.element.prototype.closest === undefined) {
  angular.element.prototype.closest = function( selector) {
    var elem = this[0];
    var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;

    while (elem) {
      if (matchesSelector.bind(elem)(selector)) {
        return elem;
      } else {
        elem = elem.parentElement;
      }
    }
    return false;
  };
}

var latestId = 0;

var uis = angular.module('ui.select', [])

.constant('uiSelectConfig', {
  theme: 'bootstrap',
  searchEnabled: true,
  sortable: false,
  placeholder: '', // Empty by default, like HTML tag <select>
  refreshDelay: 1000, // In milliseconds
  closeOnSelect: true,
  dropdownPosition: 'auto',
  generateId: function() {
    return latestId++;
  },
  appendToBody: false
})

// See Rename minErr and make it accessible from outside https://github.com/angular/angular.js/issues/6913
.service('uiSelectMinErr', function() {
  var minErr = angular.$$minErr('ui.select');
  return function() {
    var error = minErr.apply(this, arguments);
    var message = error.message.replace(new RegExp('\nhttp://errors.angularjs.org/.*'), '');
    return new Error(message);
  };
})

// Recreates old behavior of ng-transclude. Used internally.
.directive('uisTranscludeAppend', function () {
  return {
    link: function (scope, element, attrs, ctrl, transclude) {
        transclude(scope, function (clone) {
          element.append(clone);
        });
      }
    };
})

/**
 * Highlights text that matches $select.search.
 *
 * Taken from AngularUI Bootstrap Typeahead
 * See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L340
 */
.filter('highlight', function() {
  function escapeRegexp(queryToEscape) {
    return ('' + queryToEscape).replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }

  return function(matchItem, query) {
    return query && matchItem ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
  };
})

/**
 * A read-only equivalent of jQuery's offset function: http://api.jquery.com/offset/
 *
 * Taken from AngularUI Bootstrap Position:
 * See https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js#L70
 */
.factory('uisOffset',
  ['$document', '$window',
  function ($document, $window) {

  return function(element) {
    var boundingClientRect = element[0].getBoundingClientRect();
    return {
      width: boundingClientRect.width || element.prop('offsetWidth'),
      height: boundingClientRect.height || element.prop('offsetHeight'),
      top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
      left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
    };
  };
}]);

uis.directive('uiSelectChoices',
  ['uiSelectConfig', 'uisRepeatParser', 'uiSelectMinErr', '$compile', '$window',
  function(uiSelectConfig, RepeatParser, uiSelectMinErr, $compile, $window) {

  return {
    restrict: 'EA',
    require: '^uiSelect',
    replace: true,
    transclude: true,
    templateUrl: function(tElement) {
      // Needed so the uiSelect can detect the transcluded content
      tElement.addClass('ui-select-choices');

      // Gets theme attribute from parent (ui-select)
      var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
      return theme + '/choices.tpl.html';
    },

    compile: function(tElement, tAttrs) {

      if (!tAttrs.repeat) throw uiSelectMinErr('repeat', "Expected 'repeat' expression.");

      return function link(scope, element, attrs, $select, transcludeFn) {

        // var repeat = RepeatParser.parse(attrs.repeat);
        var groupByExp = attrs.groupBy;
        var groupFilterExp = attrs.groupFilter;

        $select.parseRepeatAttr(attrs.repeat, groupByExp, groupFilterExp); //Result ready at $select.parserResult

        $select.disableChoiceExpression = attrs.uiDisableChoice;
        $select.onHighlightCallback = attrs.onHighlight;

        $select.dropdownPosition = attrs.position ? attrs.position.toLowerCase() : uiSelectConfig.dropdownPosition;

        if(groupByExp) {
          var groups = element.querySelectorAll('.ui-select-choices-group');
          if (groups.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-group but got '{0}'.", groups.length);
          groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
        }

        var choices = element.querySelectorAll('.ui-select-choices-row');
        if (choices.length !== 1) {
          throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row but got '{0}'.", choices.length);
        }

        choices.attr('ng-repeat', $select.parserResult.repeatExpression(groupByExp))
            .attr('ng-if', '$select.open'); //Prevent unnecessary watches when dropdown is closed
        if ($window.document.addEventListener) {  //crude way to exclude IE8, specifically, which also cannot capture events
          choices.attr('ng-mouseenter', '$select.setActiveItem('+$select.parserResult.itemName +')')
              .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');
        }

        var rowsInner = element.querySelectorAll('.ui-select-choices-row-inner');
        if (rowsInner.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row-inner but got '{0}'.", rowsInner.length);
        rowsInner.attr('uis-transclude-append', ''); //Adding uisTranscludeAppend directive to row element after choices element has ngRepeat
        if (!$window.document.addEventListener) {  //crude way to target IE8, specifically, which also cannot capture events - so event bindings must be here
          rowsInner.attr('ng-mouseenter', '$select.setActiveItem('+$select.parserResult.itemName +')')
              .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');
        }

        $compile(element, transcludeFn)(scope); //Passing current transcludeFn to be able to append elements correctly from uisTranscludeAppend

        scope.$watch('$select.search', function(newValue) {
          if(newValue && !$select.open && $select.multiple) $select.activate(false, true);
          $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
          if (!attrs.minimumInputLength || $select.search.length >= attrs.minimumInputLength) {
            $select.refresh(attrs.refresh);
          } else {
            $select.items = [];
          }
        });

        attrs.$observe('refreshDelay', function() {
          // $eval() is needed otherwise we get a string instead of a number
          var refreshDelay = scope.$eval(attrs.refreshDelay);
          $select.refreshDelay = refreshDelay !== undefined ? refreshDelay : uiSelectConfig.refreshDelay;
        });
      };
    }
  };
}]);

/**
 * Contains ui-select "intelligence".
 *
 * The goal is to limit dependency on the DOM whenever possible and
 * put as much logic in the controller (instead of the link functions) as possible so it can be easily tested.
 */
uis.controller('uiSelectCtrl',
  ['$scope', '$element', '$timeout', '$filter', 'uisRepeatParser', 'uiSelectMinErr', 'uiSelectConfig', '$parse', '$injector',
  function($scope, $element, $timeout, $filter, RepeatParser, uiSelectMinErr, uiSelectConfig, $parse, $injector) {

  var ctrl = this;

  var EMPTY_SEARCH = '';

  ctrl.placeholder = uiSelectConfig.placeholder;
  ctrl.searchEnabled = uiSelectConfig.searchEnabled;
  ctrl.sortable = uiSelectConfig.sortable;
  ctrl.refreshDelay = uiSelectConfig.refreshDelay;
  ctrl.paste = uiSelectConfig.paste;

  ctrl.removeSelected = false; //If selected item(s) should be removed from dropdown list
  ctrl.closeOnSelect = true; //Initialized inside uiSelect directive link function
  ctrl.search = EMPTY_SEARCH;

  ctrl.activeIndex = 0; //Dropdown of choices
  ctrl.items = []; //All available choices

  ctrl.open = false;
  ctrl.focus = false;
  ctrl.disabled = false;
  ctrl.selected = undefined;

  ctrl.dropdownPosition = 'auto';

  ctrl.focusser = undefined; //Reference to input element used to handle focus events
  ctrl.resetSearchInput = true;
  ctrl.multiple = undefined; // Initialized inside uiSelect directive link function
  ctrl.disableChoiceExpression = undefined; // Initialized inside uiSelectChoices directive link function
  ctrl.tagging = {isActivated: false, fct: undefined};
  ctrl.taggingTokens = {isActivated: false, tokens: undefined};
  ctrl.lockChoiceExpression = undefined; // Initialized inside uiSelectMatch directive link function
  ctrl.clickTriggeredSelect = false;
  ctrl.$filter = $filter;

  // Use $injector to check for $animate and store a reference to it
  ctrl.$animate = (function () {
    try {
      return $injector.get('$animate');
    } catch (err) {
      // $animate does not exist
      return null;
    }
  })();

  ctrl.searchInput = $element.querySelectorAll('input.ui-select-search');
  if (ctrl.searchInput.length !== 1) {
    throw uiSelectMinErr('searchInput', "Expected 1 input.ui-select-search but got '{0}'.", ctrl.searchInput.length);
  }

  ctrl.isEmpty = function() {
    return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '' || (ctrl.multiple && ctrl.selected.length === 0);
  };

  function _findIndex(collection, predicate, thisArg){
    if (collection.findIndex){
      return collection.findIndex(predicate, thisArg);
    } else {
      var list = Object(collection);
      var length = list.length >>> 0;
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return i;
        }
      }
      return -1;
    }
  }

  // Most of the time the user does not want to empty the search input when in typeahead mode
  function _resetSearchInput() {
    if (ctrl.resetSearchInput || (ctrl.resetSearchInput === undefined && uiSelectConfig.resetSearchInput)) {
      ctrl.search = EMPTY_SEARCH;
      //reset activeIndex
      if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
        ctrl.activeIndex = _findIndex(ctrl.items, function(item){
          return angular.equals(this, item);
        }, ctrl.selected);
      }
    }
  }

    function _groupsFilter(groups, groupNames) {
      var i, j, result = [];
      for(i = 0; i < groupNames.length ;i++){
        for(j = 0; j < groups.length ;j++){
          if(groups[j].name == [groupNames[i]]){
            result.push(groups[j]);
          }
        }
      }
      return result;
    }

  // When the user clicks on ui-select, displays the dropdown list
  ctrl.activate = function(initSearchValue, avoidReset) {
    if (!ctrl.disabled  && !ctrl.open) {
      if(!avoidReset) _resetSearchInput();

      $scope.$broadcast('uis:activate');

      ctrl.open = true;

      ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;

      // ensure that the index is set to zero for tagging variants
      // that where first option is auto-selected
      if ( ctrl.activeIndex === -1 && ctrl.taggingLabel !== false ) {
        ctrl.activeIndex = 0;
      }

      var container = $element.querySelectorAll('.ui-select-choices-content');
      if (ctrl.$animate && ctrl.$animate.enabled(container[0])) {
        ctrl.$animate.on('enter', container[0], function (elem, phase) {
          if (phase === 'close') {
            // Only focus input after the animation has finished
            $timeout(function () {
              ctrl.focusSearchInput(initSearchValue);
            });
          }
        });
      } else {
        $timeout(function () {
          ctrl.focusSearchInput(initSearchValue);
        });
      }
    }
  };

  ctrl.focusSearchInput = function (initSearchValue) {
    ctrl.search = initSearchValue || ctrl.search;
    ctrl.searchInput[0].focus();
    if(!ctrl.tagging.isActivated && ctrl.items.length > 1) {
     _ensureHighlightVisible();
    }
  };

  ctrl.findGroupByName = function(name) {
    return ctrl.groups && ctrl.groups.filter(function(group) {
      return group.name === name;
    })[0];
  };

  ctrl.parseRepeatAttr = function(repeatAttr, groupByExp, groupFilterExp) {
    function updateGroups(items) {
      var groupFn = $scope.$eval(groupByExp);
      ctrl.groups = [];
      angular.forEach(items, function(item) {
        var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
        var group = ctrl.findGroupByName(groupName);
        if(group) {
          group.items.push(item);
        }
        else {
          ctrl.groups.push({name: groupName, items: [item]});
        }
      });
      if(groupFilterExp){
        var groupFilterFn = $scope.$eval(groupFilterExp);
        if( angular.isFunction(groupFilterFn)){
          ctrl.groups = groupFilterFn(ctrl.groups);
        } else if(angular.isArray(groupFilterFn)){
          ctrl.groups = _groupsFilter(ctrl.groups, groupFilterFn);
        }
      }
      ctrl.items = [];
      ctrl.groups.forEach(function(group) {
        ctrl.items = ctrl.items.concat(group.items);
      });
    }

    function setPlainItems(items) {
      ctrl.items = items;
    }

    ctrl.setItemsFn = groupByExp ? updateGroups : setPlainItems;

    ctrl.parserResult = RepeatParser.parse(repeatAttr);

    ctrl.isGrouped = !!groupByExp;
    ctrl.itemProperty = ctrl.parserResult.itemName;

    //If collection is an Object, convert it to Array

    var originalSource = ctrl.parserResult.source;

    //When an object is used as source, we better create an array and use it as 'source'
    var createArrayFromObject = function(){
      var origSrc = originalSource($scope);
      $scope.$uisSource = Object.keys(origSrc).map(function(v){
        var result = {};
        result[ctrl.parserResult.keyName] = v;
        result.value = origSrc[v];
        return result;
      });
    };

    if (ctrl.parserResult.keyName){ // Check for (key,value) syntax
      createArrayFromObject();
      ctrl.parserResult.source = $parse('$uisSource' + ctrl.parserResult.filters);
      $scope.$watch(originalSource, function(newVal, oldVal){
        if (newVal !== oldVal) createArrayFromObject();
      }, true);
    }

    ctrl.refreshItems = function (data){
      data = data || ctrl.parserResult.source($scope);
      var selectedItems = ctrl.selected;
      //TODO should implement for single mode removeSelected
      if (ctrl.isEmpty() || (angular.isArray(selectedItems) && !selectedItems.length) || !ctrl.removeSelected) {
        ctrl.setItemsFn(data);
      }else{
        if ( data !== undefined ) {
          var filteredItems = data.filter(function(i) {return selectedItems && selectedItems.indexOf(i) < 0;});
          ctrl.setItemsFn(filteredItems);
        }
      }
      if (ctrl.dropdownPosition === 'auto' || ctrl.dropdownPosition === 'up'){
        $scope.calculateDropdownPos();
      }
    };

    // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
    $scope.$watchCollection(ctrl.parserResult.source, function(items) {
      if (items === undefined || items === null) {
        // If the user specifies undefined or null => reset the collection
        // Special case: items can be undefined if the user did not initialized the collection on the scope
        // i.e $scope.addresses = [] is missing
        ctrl.items = [];
      } else {
        if (!angular.isArray(items)) {
          throw uiSelectMinErr('items', "Expected an array but got '{0}'.", items);
        } else {
          //Remove already selected items (ex: while searching)
          //TODO Should add a test
          ctrl.refreshItems(items);
          ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
        }
      }
    });

  };

  var _refreshDelayPromise;

  /**
   * Typeahead mode: lets the user refresh the collection using his own function.
   *
   * See Expose $select.search for external / remote filtering https://github.com/angular-ui/ui-select/pull/31
   */
  ctrl.refresh = function(refreshAttr) {
    if (refreshAttr !== undefined) {

      // Debounce
      // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
      // FYI AngularStrap typeahead does not have debouncing: https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
      if (_refreshDelayPromise) {
        $timeout.cancel(_refreshDelayPromise);
      }
      _refreshDelayPromise = $timeout(function() {
        $scope.$eval(refreshAttr);
      }, ctrl.refreshDelay);
    }
  };

  ctrl.isActive = function(itemScope) {
    if ( !ctrl.open ) {
      return false;
    }
    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isActive =  itemIndex == ctrl.activeIndex;

    if ( !isActive || ( itemIndex < 0 && ctrl.taggingLabel !== false ) ||( itemIndex < 0 && ctrl.taggingLabel === false) ) {
      return false;
    }

    if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
      itemScope.$eval(ctrl.onHighlightCallback);
    }

    return isActive;
  };

  ctrl.isDisabled = function(itemScope) {

    if (!ctrl.open) return;

    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isDisabled = false;
    var item;

    if (itemIndex >= 0 && !angular.isUndefined(ctrl.disableChoiceExpression)) {
      item = ctrl.items[itemIndex];
      isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression)); // force the boolean value
      item._uiSelectChoiceDisabled = isDisabled; // store this for later reference
    }

    return isDisabled;
  };


  // When the user selects an item with ENTER or clicks the dropdown
  ctrl.select = function(item, skipFocusser, $event) {
    if (item === undefined || !item._uiSelectChoiceDisabled) {

      if ( ! ctrl.items && ! ctrl.search && ! ctrl.tagging.isActivated) return;

      if (!item || !item._uiSelectChoiceDisabled) {
        if(ctrl.tagging.isActivated) {
          // if taggingLabel is disabled, we pull from ctrl.search val
          if ( ctrl.taggingLabel === false ) {
            if ( ctrl.activeIndex < 0 ) {
              item = ctrl.tagging.fct !== undefined ? ctrl.tagging.fct(ctrl.search) : ctrl.search;
              if (!item || angular.equals( ctrl.items[0], item ) ) {
                return;
              }
            } else {
              // keyboard nav happened first, user selected from dropdown
              item = ctrl.items[ctrl.activeIndex];
            }
          } else {
            // tagging always operates at index zero, taggingLabel === false pushes
            // the ctrl.search value without having it injected
            if ( ctrl.activeIndex === 0 ) {
              // ctrl.tagging pushes items to ctrl.items, so we only have empty val
              // for `item` if it is a detected duplicate
              if ( item === undefined ) return;

              // create new item on the fly if we don't already have one;
              // use tagging function if we have one
              if ( ctrl.tagging.fct !== undefined && typeof item === 'string' ) {
                item = ctrl.tagging.fct(item);
                if (!item) return;
              // if item type is 'string', apply the tagging label
              } else if ( typeof item === 'string' ) {
                // trim the trailing space
                item = item.replace(ctrl.taggingLabel,'').trim();
              }
            }
          }
          // search ctrl.selected for dupes potentially caused by tagging and return early if found
          if ( ctrl.selected && angular.isArray(ctrl.selected) && ctrl.selected.filter( function (selection) { return angular.equals(selection, item); }).length > 0 ) {
            ctrl.close(skipFocusser);
            return;
          }
        }

        $scope.$broadcast('uis:select', item);

        var locals = {};
        locals[ctrl.parserResult.itemName] = item;

        $timeout(function(){
          ctrl.onSelectCallback($scope, {
            $item: item,
            $model: ctrl.parserResult.modelMapper($scope, locals)
          });
        });

        if (ctrl.closeOnSelect) {
          ctrl.close(skipFocusser);
        }
        if ($event && $event.type === 'click') {
          ctrl.clickTriggeredSelect = true;
        }
      }
    }
  };

  // Closes the dropdown
  ctrl.close = function(skipFocusser) {
    if (!ctrl.open) return;
    if (ctrl.ngModel && ctrl.ngModel.$setTouched) ctrl.ngModel.$setTouched();
    _resetSearchInput();
    ctrl.open = false;

    $scope.$broadcast('uis:close', skipFocusser);

  };

  ctrl.setFocus = function(){
    if (!ctrl.focus) ctrl.focusInput[0].focus();
  };

  ctrl.clear = function($event) {
    ctrl.select(undefined);
    $event.stopPropagation();
    $timeout(function() {
      ctrl.focusser[0].focus();
    }, 0, false);
  };

  // Toggle dropdown
  ctrl.toggle = function(e) {
    if (ctrl.open) {
      ctrl.close();
      e.preventDefault();
      e.stopPropagation();
    } else {
      ctrl.activate();
    }
  };

  ctrl.isLocked = function(itemScope, itemIndex) {
      var isLocked, item = ctrl.selected[itemIndex];

      if (item && !angular.isUndefined(ctrl.lockChoiceExpression)) {
          isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression)); // force the boolean value
          item._uiSelectChoiceLocked = isLocked; // store this for later reference
      }

      return isLocked;
  };

  var sizeWatch = null;
  ctrl.sizeSearchInput = function() {

    var input = ctrl.searchInput[0],
        container = ctrl.searchInput.parent().parent()[0],
        calculateContainerWidth = function() {
          // Return the container width only if the search input is visible
          return container.clientWidth * !!input.offsetParent;
        },
        updateIfVisible = function(containerWidth) {
          if (containerWidth === 0) {
            return false;
          }
          var inputWidth = containerWidth - input.offsetLeft - 10;
          if (inputWidth < 50) inputWidth = containerWidth;
          ctrl.searchInput.css('width', inputWidth+'px');
          return true;
        };

    ctrl.searchInput.css('width', '10px');
    $timeout(function() { //Give tags time to render correctly
      if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
        sizeWatch = $scope.$watch(calculateContainerWidth, function(containerWidth) {
          if (updateIfVisible(containerWidth)) {
            sizeWatch();
            sizeWatch = null;
          }
        });
      }
    });
  };

  function _handleDropDownSelection(key) {
    var processed = true;
    switch (key) {
      case KEY.DOWN:
        if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        else if (ctrl.activeIndex < ctrl.items.length - 1) { ctrl.activeIndex++; }
        break;
      case KEY.UP:
        if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0 && ctrl.tagging.isActivated && ctrl.activeIndex > -1)) { ctrl.activeIndex--; }
        break;
      case KEY.TAB:
        if (!ctrl.multiple || ctrl.open) ctrl.select(ctrl.items[ctrl.activeIndex], true);
        break;
      case KEY.ENTER:
        if(ctrl.open && (ctrl.tagging.isActivated || ctrl.activeIndex >= 0)){
          ctrl.select(ctrl.items[ctrl.activeIndex]); // Make sure at least one dropdown item is highlighted before adding if not in tagging mode
        } else {
          ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        }
        break;
      case KEY.ESC:
        ctrl.close();
        break;
      default:
        processed = false;
    }
    return processed;
  }

  // Bind to keyboard shortcuts
  ctrl.searchInput.on('keydown', function(e) {

    var key = e.which;

    if (~[KEY.ENTER,KEY.ESC].indexOf(key)){
      e.preventDefault();
      e.stopPropagation();
    }

    // if(~[KEY.ESC,KEY.TAB].indexOf(key)){
    //   //TODO: SEGURO?
    //   ctrl.close();
    // }

    $scope.$apply(function() {

      var tagged = false;

      if (ctrl.items.length > 0 || ctrl.tagging.isActivated) {
        _handleDropDownSelection(key);
        if ( ctrl.taggingTokens.isActivated ) {
          for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
            if ( ctrl.taggingTokens.tokens[i] === KEY.MAP[e.keyCode] ) {
              // make sure there is a new value to push via tagging
              if ( ctrl.search.length > 0 ) {
                tagged = true;
              }
            }
          }
          if ( tagged ) {
            $timeout(function() {
              ctrl.searchInput.triggerHandler('tagged');
              var newItem = ctrl.search.replace(KEY.MAP[e.keyCode],'').trim();
              if ( ctrl.tagging.fct ) {
                newItem = ctrl.tagging.fct( newItem );
              }
              if (newItem) ctrl.select(newItem, true);
            });
          }
        }
      }

    });

    if(KEY.isVerticalMovement(key) && ctrl.items.length > 0){
      _ensureHighlightVisible();
    }

    if (key === KEY.ENTER || key === KEY.ESC) {
      e.preventDefault();
      e.stopPropagation();
    }

  });

  ctrl.searchInput.on('paste', function (e) {
    var data;

    if (window.clipboardData && window.clipboardData.getData) { // IE
      data = window.clipboardData.getData('Text');
    } else {
      data = (e.originalEvent || e).clipboardData.getData('text/plain');
    }

    // Prepend the current input field text to the paste buffer.
    data = ctrl.search + data;

    if (data && data.length > 0) {
      // If tagging try to split by tokens and add items
      if (ctrl.taggingTokens.isActivated) {
        var separator = KEY.toSeparator(ctrl.taggingTokens.tokens[0]);
        var items = data.split(separator || ctrl.taggingTokens.tokens[0]); // split by first token only
        if (items && items.length > 0) {
        var oldsearch = ctrl.search;
          angular.forEach(items, function (item) {
            var newItem = ctrl.tagging.fct ? ctrl.tagging.fct(item) : item;
            if (newItem) {
              ctrl.select(newItem, true);
            }
          });
          ctrl.search = oldsearch || EMPTY_SEARCH;
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (ctrl.paste) {
        ctrl.paste(data);
        ctrl.search = EMPTY_SEARCH;
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });

  ctrl.searchInput.on('tagged', function() {
    $timeout(function() {
      _resetSearchInput();
    });
  });

  // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
  function _ensureHighlightVisible() {
    var container = $element.querySelectorAll('.ui-select-choices-content');
    var choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      throw uiSelectMinErr('choices', "Expected multiple .ui-select-choices-row but got '{0}'.", choices.length);
    }

    if (ctrl.activeIndex < 0) {
      return;
    }

    var highlighted = choices[ctrl.activeIndex];
    var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
    var height = container[0].offsetHeight;

    if (posY > height) {
      container[0].scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      if (ctrl.isGrouped && ctrl.activeIndex === 0)
        container[0].scrollTop = 0; //To make group header visible when going all the way up
      else
        container[0].scrollTop -= highlighted.clientHeight - posY;
    }
  }

  $scope.$on('$destroy', function() {
    ctrl.searchInput.off('keyup keydown tagged blur paste');
  });

}]);

uis.directive('uiSelect',
  ['$document', 'uiSelectConfig', 'uiSelectMinErr', 'uisOffset', '$compile', '$parse', '$timeout',
  function($document, uiSelectConfig, uiSelectMinErr, uisOffset, $compile, $parse, $timeout) {

  return {
    restrict: 'EA',
    templateUrl: function(tElement, tAttrs) {
      var theme = tAttrs.theme || uiSelectConfig.theme;
      return theme + (angular.isDefined(tAttrs.multiple) ? '/select-multiple.tpl.html' : '/select.tpl.html');
    },
    replace: true,
    transclude: true,
    require: ['uiSelect', '^ngModel'],
    scope: true,

    controller: 'uiSelectCtrl',
    controllerAs: '$select',
    compile: function(tElement, tAttrs) {

      // Allow setting ngClass on uiSelect
      var match = /{(.*)}\s*{(.*)}/.exec(tAttrs.ngClass);
      if(match) {
        var combined = '{'+ match[1] +', '+ match[2] +'}';
        tAttrs.ngClass = combined;
        tElement.attr('ng-class', combined);
      }

      //Multiple or Single depending if multiple attribute presence
      if (angular.isDefined(tAttrs.multiple))
        tElement.append('<ui-select-multiple/>').removeAttr('multiple');
      else
        tElement.append('<ui-select-single/>');

      if (tAttrs.inputId)
        tElement.querySelectorAll('input.ui-select-search')[0].id = tAttrs.inputId;

      return function(scope, element, attrs, ctrls, transcludeFn) {

        var $select = ctrls[0];
        var ngModel = ctrls[1];

        $select.generatedId = uiSelectConfig.generateId();
        $select.baseTitle = attrs.title || 'Select box';
        $select.focusserTitle = $select.baseTitle + ' focus';
        $select.focusserId = 'focusser-' + $select.generatedId;

        $select.closeOnSelect = function() {
          if (angular.isDefined(attrs.closeOnSelect)) {
            return $parse(attrs.closeOnSelect)();
          } else {
            return uiSelectConfig.closeOnSelect;
          }
        }();

        $select.onSelectCallback = $parse(attrs.onSelect);
        $select.onRemoveCallback = $parse(attrs.onRemove);

        //Limit the number of selections allowed
        $select.limit = (angular.isDefined(attrs.limit)) ? parseInt(attrs.limit, 10) : undefined;

        //Set reference to ngModel from uiSelectCtrl
        $select.ngModel = ngModel;

        $select.choiceGrouped = function(group){
          return $select.isGrouped && group && group.name;
        };

        if(attrs.tabindex){
          attrs.$observe('tabindex', function(value) {
            $select.focusInput.attr('tabindex', value);
            element.removeAttr('tabindex');
          });
        }

        scope.$watch('searchEnabled', function() {
            var searchEnabled = scope.$eval(attrs.searchEnabled);
            $select.searchEnabled = searchEnabled !== undefined ? searchEnabled : uiSelectConfig.searchEnabled;
        });

        scope.$watch('sortable', function() {
            var sortable = scope.$eval(attrs.sortable);
            $select.sortable = sortable !== undefined ? sortable : uiSelectConfig.sortable;
        });

        attrs.$observe('disabled', function() {
          // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
          $select.disabled = attrs.disabled !== undefined ? attrs.disabled : false;
        });

        attrs.$observe('resetSearchInput', function() {
          // $eval() is needed otherwise we get a string instead of a boolean
          var resetSearchInput = scope.$eval(attrs.resetSearchInput);
          $select.resetSearchInput = resetSearchInput !== undefined ? resetSearchInput : true;
        });

        attrs.$observe('paste', function() {
          $select.paste = scope.$eval(attrs.paste);
        });

        attrs.$observe('tagging', function() {
          if(attrs.tagging !== undefined)
          {
            // $eval() is needed otherwise we get a string instead of a boolean
            var taggingEval = scope.$eval(attrs.tagging);
            $select.tagging = {isActivated: true, fct: taggingEval !== true ? taggingEval : undefined};
          }
          else
          {
            $select.tagging = {isActivated: false, fct: undefined};
          }
        });

        attrs.$observe('taggingLabel', function() {
          if(attrs.tagging !== undefined )
          {
            // check eval for FALSE, in this case, we disable the labels
            // associated with tagging
            if ( attrs.taggingLabel === 'false' ) {
              $select.taggingLabel = false;
            }
            else
            {
              $select.taggingLabel = attrs.taggingLabel !== undefined ? attrs.taggingLabel : '(new)';
            }
          }
        });

        attrs.$observe('taggingTokens', function() {
          if (attrs.tagging !== undefined) {
            var tokens = attrs.taggingTokens !== undefined ? attrs.taggingTokens.split('|') : [',','ENTER'];
            $select.taggingTokens = {isActivated: true, tokens: tokens };
          }
        });

        //Automatically gets focus when loaded
        if (angular.isDefined(attrs.autofocus)){
          $timeout(function(){
            $select.setFocus();
          });
        }

        //Gets focus based on scope event name (e.g. focus-on='SomeEventName')
        if (angular.isDefined(attrs.focusOn)){
          scope.$on(attrs.focusOn, function() {
              $timeout(function(){
                $select.setFocus();
              });
          });
        }

        function onDocumentClick(e) {
          if (!$select.open) return; //Skip it if dropdown is close

          var contains = false;

          if (window.jQuery) {
            // Firefox 3.6 does not support element.contains()
            // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
            contains = window.jQuery.contains(element[0], e.target);
          } else {
            contains = element[0].contains(e.target);
          }

          if (!contains && !$select.clickTriggeredSelect) {
            //Will lose focus only with certain targets
            var focusableControls = ['input','button','textarea','select'];
            var targetController = angular.element(e.target).controller('uiSelect'); //To check if target is other ui-select
            var skipFocusser = targetController && targetController !== $select; //To check if target is other ui-select
            if (!skipFocusser) skipFocusser =  ~focusableControls.indexOf(e.target.tagName.toLowerCase()); //Check if target is input, button or textarea
            $select.close(skipFocusser);
            scope.$digest();
          }
          $select.clickTriggeredSelect = false;
        }

        // See Click everywhere but here event http://stackoverflow.com/questions/12931369
        $document.on('click', onDocumentClick);

        scope.$on('$destroy', function() {
          $document.off('click', onDocumentClick);
        });

        // Move transcluded elements to their correct position in main template
        transcludeFn(scope, function(clone) {
          // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

          // One day jqLite will be replaced by jQuery and we will be able to write:
          // var transcludedElement = clone.filter('.my-class')
          // instead of creating a hackish DOM element:
          var transcluded = angular.element('<div>').append(clone);

          var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
          transcludedMatch.removeAttr('ui-select-match'); //To avoid loop in case directive as attr
          transcludedMatch.removeAttr('data-ui-select-match'); // Properly handle HTML5 data-attributes
          if (transcludedMatch.length !== 1) {
            throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-match but got '{0}'.", transcludedMatch.length);
          }
          element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);

          var transcludedChoices = transcluded.querySelectorAll('.ui-select-choices');
          transcludedChoices.removeAttr('ui-select-choices'); //To avoid loop in case directive as attr
          transcludedChoices.removeAttr('data-ui-select-choices'); // Properly handle HTML5 data-attributes
          if (transcludedChoices.length !== 1) {
            throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-choices but got '{0}'.", transcludedChoices.length);
          }
          element.querySelectorAll('.ui-select-choices').replaceWith(transcludedChoices);
        });

        // Support for appending the select field to the body when its open
        var appendToBody = scope.$eval(attrs.appendToBody);
        if (appendToBody !== undefined ? appendToBody : uiSelectConfig.appendToBody) {
          scope.$watch('$select.open', function(isOpen) {
            if (isOpen) {
              positionDropdown();
            } else {
              resetDropdown();
            }
          });

          // Move the dropdown back to its original location when the scope is destroyed. Otherwise
          // it might stick around when the user routes away or the select field is otherwise removed
          scope.$on('$destroy', function() {
            resetDropdown();
          });
        }

        // Hold on to a reference to the .ui-select-container element for appendToBody support
        var placeholder = null,
            originalWidth = '';

        function positionDropdown() {
          // Remember the absolute position of the element
          var offset = uisOffset(element);

          // Clone the element into a placeholder element to take its original place in the DOM
          placeholder = angular.element('<div class="ui-select-placeholder"></div>');
          placeholder[0].style.width = offset.width + 'px';
          placeholder[0].style.height = offset.height + 'px';
          element.after(placeholder);

          // Remember the original value of the element width inline style, so it can be restored
          // when the dropdown is closed
          originalWidth = element[0].style.width;

          // Now move the actual dropdown element to the end of the body
          $document.find('body').append(element);

          element[0].style.position = 'absolute';
          element[0].style.left = offset.left + 'px';
          element[0].style.top = offset.top + 'px';
          element[0].style.width = offset.width + 'px';
        }

        function resetDropdown() {
          if (placeholder === null) {
            // The dropdown has not actually been display yet, so there's nothing to reset
            return;
          }

          // Move the dropdown element back to its original location in the DOM
          placeholder.replaceWith(element);
          placeholder = null;

          element[0].style.position = '';
          element[0].style.left = '';
          element[0].style.top = '';
          element[0].style.width = originalWidth;

          // Set focus back on to the moved element
          $select.setFocus();
        }

        // Hold on to a reference to the .ui-select-dropdown element for direction support.
        var dropdown = null,
            directionUpClassName = 'direction-up';

        // Support changing the direction of the dropdown if there isn't enough space to render it.
        scope.$watch('$select.open', function() {

          if ($select.dropdownPosition === 'auto' || $select.dropdownPosition === 'up'){
            scope.calculateDropdownPos();
          }

        });

        var setDropdownPosUp = function(offset, offsetDropdown){

          offset = offset || uisOffset(element);
          offsetDropdown = offsetDropdown || uisOffset(dropdown);

          dropdown[0].style.position = 'absolute';
          dropdown[0].style.top = (offsetDropdown.height * -1) + 'px';
          element.addClass(directionUpClassName);

        };

        var setDropdownPosDown = function(offset, offsetDropdown){

          element.removeClass(directionUpClassName);

          offset = offset || uisOffset(element);
          offsetDropdown = offsetDropdown || uisOffset(dropdown);

          dropdown[0].style.position = '';
          dropdown[0].style.top = '';

        };

        scope.calculateDropdownPos = function(){

          if ($select.open) {
            dropdown = angular.element(element).querySelectorAll('.ui-select-dropdown');
            if (dropdown.length === 0) {
              return;
            }

            // Hide the dropdown so there is no flicker until $timeout is done executing.
            dropdown[0].style.opacity = 0;

            // Delay positioning the dropdown until all choices have been added so its height is correct.
            $timeout(function(){

              if ($select.dropdownPosition === 'up'){
                  //Go UP
                  setDropdownPosUp();

              }else{ //AUTO

                element.removeClass(directionUpClassName);

                var offset = uisOffset(element);
                var offsetDropdown = uisOffset(dropdown);

                //https://code.google.com/p/chromium/issues/detail?id=342307#c4
                var scrollTop = $document[0].documentElement.scrollTop || $document[0].body.scrollTop; //To make it cross browser (blink, webkit, IE, Firefox).

                // Determine if the direction of the dropdown needs to be changed.
                if (offset.top + offset.height + offsetDropdown.height > scrollTop + $document[0].documentElement.clientHeight) {
                  //Go UP
                  setDropdownPosUp(offset, offsetDropdown);
                }else{
                  //Go DOWN
                  setDropdownPosDown(offset, offsetDropdown);
                }

              }

              // Display the dropdown once it has been positioned.
              dropdown[0].style.opacity = 1;
            });
          } else {
              if (dropdown === null || dropdown.length === 0) {
                return;
              }

              // Reset the position of the dropdown.
              dropdown[0].style.position = '';
              dropdown[0].style.top = '';
              element.removeClass(directionUpClassName);
          }
        };
      };
    }
  };
}]);

uis.directive('uiSelectMatch', ['uiSelectConfig', function(uiSelectConfig) {
  return {
    restrict: 'EA',
    require: '^uiSelect',
    replace: true,
    transclude: true,
    templateUrl: function(tElement) {
      // Needed so the uiSelect can detect the transcluded content
      tElement.addClass('ui-select-match');

      // Gets theme attribute from parent (ui-select)
      var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
      var multi = tElement.parent().attr('multiple');
      return theme + (multi ? '/match-multiple.tpl.html' : '/match.tpl.html');
    },
    link: function(scope, element, attrs, $select) {
      $select.lockChoiceExpression = attrs.uiLockChoice;
      attrs.$observe('placeholder', function(placeholder) {
        $select.placeholder = placeholder !== undefined ? placeholder : uiSelectConfig.placeholder;
      });

      function setAllowClear(allow) {
        $select.allowClear = (angular.isDefined(allow)) ? (allow === '') ? true : (allow.toLowerCase() === 'true') : false;
      }

      attrs.$observe('allowClear', setAllowClear);
      setAllowClear(attrs.allowClear);

      if($select.multiple){
        $select.sizeSearchInput();
      }

    }
  };
}]);

uis.directive('uiSelectMultiple', ['uiSelectMinErr','$timeout', function(uiSelectMinErr, $timeout) {
  return {
    restrict: 'EA',
    require: ['^uiSelect', '^ngModel'],

    controller: ['$scope','$timeout', function($scope, $timeout){

      var ctrl = this,
          $select = $scope.$select,
          ngModel;

      if (angular.isUndefined($select.selected))
        $select.selected = [];

      //Wait for link fn to inject it
      $scope.$evalAsync(function(){ ngModel = $scope.ngModel; });

      ctrl.activeMatchIndex = -1;

      ctrl.updateModel = function(){
        ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes
        ctrl.refreshComponent();
      };

      ctrl.refreshComponent = function(){
        //Remove already selected items
        //e.g. When user clicks on a selection, the selected array changes and
        //the dropdown should remove that item
        $select.refreshItems();
        $select.sizeSearchInput();
      };

      // Remove item from multiple select
      ctrl.removeChoice = function(index){

        var removedChoice = $select.selected[index];

        // if the choice is locked, can't remove it
        if(removedChoice._uiSelectChoiceLocked) return;

        var locals = {};
        locals[$select.parserResult.itemName] = removedChoice;

        $select.selected.splice(index, 1);
        ctrl.activeMatchIndex = -1;
        $select.sizeSearchInput();

        // Give some time for scope propagation.
        $timeout(function(){
          $select.onRemoveCallback($scope, {
            $item: removedChoice,
            $model: $select.parserResult.modelMapper($scope, locals)
          });
        });

        ctrl.updateModel();

      };

      ctrl.getPlaceholder = function(){
        //Refactor single?
        if($select.selected && $select.selected.length) return;
        return $select.placeholder;
      };


    }],
    controllerAs: '$selectMultiple',

    link: function(scope, element, attrs, ctrls) {

      var $select = ctrls[0];
      var ngModel = scope.ngModel = ctrls[1];
      var $selectMultiple = scope.$selectMultiple;

      //$select.selected = raw selected objects (ignoring any property binding)

      $select.multiple = true;
      $select.removeSelected = true;

      //Input that will handle focus
      $select.focusInput = $select.searchInput;

      //From view --> model
      ngModel.$parsers.unshift(function () {
        var locals = {},
            result,
            resultMultiple = [];
        for (var j = $select.selected.length - 1; j >= 0; j--) {
          locals = {};
          locals[$select.parserResult.itemName] = $select.selected[j];
          result = $select.parserResult.modelMapper(scope, locals);
          resultMultiple.unshift(result);
        }
        return resultMultiple;
      });

      // From model --> view
      ngModel.$formatters.unshift(function (inputValue) {
        var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
            locals = {},
            result;
        if (!data) return inputValue;
        var resultMultiple = [];
        var checkFnMultiple = function(list, value){
          if (!list || !list.length) return;
          for (var p = list.length - 1; p >= 0; p--) {
            locals[$select.parserResult.itemName] = list[p];
            result = $select.parserResult.modelMapper(scope, locals);
            if($select.parserResult.trackByExp){
                var propsItemNameMatches = /(\w*)\./.exec($select.parserResult.trackByExp);
                var matches = /\.([^\s]+)/.exec($select.parserResult.trackByExp);
                if(propsItemNameMatches && propsItemNameMatches.length > 0 && propsItemNameMatches[1] == $select.parserResult.itemName){
                  if(matches && matches.length>0 && result[matches[1]] == value[matches[1]]){
                      resultMultiple.unshift(list[p]);
                      return true;
                  }
                }
            }
            if (angular.equals(result,value)){
              resultMultiple.unshift(list[p]);
              return true;
            }
          }
          return false;
        };
        if (!inputValue) return resultMultiple; //If ngModel was undefined
        for (var k = inputValue.length - 1; k >= 0; k--) {
          //Check model array of currently selected items
          if (!checkFnMultiple($select.selected, inputValue[k])){
            //Check model array of all items available
            if (!checkFnMultiple(data, inputValue[k])){
              //If not found on previous lists, just add it directly to resultMultiple
              resultMultiple.unshift(inputValue[k]);
            }
          }
        }
        return resultMultiple;
      });

      //Watch for external model changes
      scope.$watchCollection(function(){ return ngModel.$modelValue; }, function(newValue, oldValue) {
        if (oldValue != newValue){
          ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
          $selectMultiple.refreshComponent();
        }
      });

      ngModel.$render = function() {
        // Make sure that model value is array
        if(!angular.isArray(ngModel.$viewValue)){
          // Have tolerance for null or undefined values
          if(angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null){
            $select.selected = [];
          } else {
            throw uiSelectMinErr('multiarr', "Expected model value to be array but got '{0}'", ngModel.$viewValue);
          }
        }
        $select.selected = ngModel.$viewValue;
        scope.$evalAsync(); //To force $digest
      };

      scope.$on('uis:select', function (event, item) {
        if($select.selected.length >= $select.limit) {
          return;
        }
        $select.selected.push(item);
        $selectMultiple.updateModel();
      });

      scope.$on('uis:activate', function () {
        $selectMultiple.activeMatchIndex = -1;
      });

      scope.$watch('$select.disabled', function(newValue, oldValue) {
        // As the search input field may now become visible, it may be necessary to recompute its size
        if (oldValue && !newValue) $select.sizeSearchInput();
      });

      $select.searchInput.on('keydown', function(e) {
        var key = e.which;
        scope.$apply(function() {
          var processed = false;
          // var tagged = false; //Checkme
          if(KEY.isHorizontalMovement(key)){
            processed = _handleMatchSelection(key);
          }
          if (processed  && key != KEY.TAB) {
            //TODO Check si el tab selecciona aun correctamente
            //Crear test
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });
      function _getCaretPosition(el) {
        if(angular.isNumber(el.selectionStart)) return el.selectionStart;
        // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
        else return el.value.length;
      }
      // Handles selected options in "multiple" mode
      function _handleMatchSelection(key){
        var caretPosition = _getCaretPosition($select.searchInput[0]),
            length = $select.selected.length,
            // none  = -1,
            first = 0,
            last  = length-1,
            curr  = $selectMultiple.activeMatchIndex,
            next  = $selectMultiple.activeMatchIndex+1,
            prev  = $selectMultiple.activeMatchIndex-1,
            newIndex = curr;

        if(caretPosition > 0 || ($select.search.length && key == KEY.RIGHT)) return false;

        $select.close();

        function getNewActiveMatchIndex(){
          switch(key){
            case KEY.LEFT:
              // Select previous/first item
              if(~$selectMultiple.activeMatchIndex) return prev;
              // Select last item
              else return last;
              break;
            case KEY.RIGHT:
              // Open drop-down
              if(!~$selectMultiple.activeMatchIndex || curr === last){
                $select.activate();
                return false;
              }
              // Select next/last item
              else return next;
              break;
            case KEY.BACKSPACE:
              // Remove selected item and select previous/first
              if(~$selectMultiple.activeMatchIndex){
                $selectMultiple.removeChoice(curr);
                return prev;
              }
              // Select last item
              else return last;
              break;
            case KEY.DELETE:
              // Remove selected item and select next item
              if(~$selectMultiple.activeMatchIndex){
                $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                return curr;
              }
              else return false;
          }
        }

        newIndex = getNewActiveMatchIndex();

        if(!$select.selected.length || newIndex === false) $selectMultiple.activeMatchIndex = -1;
        else $selectMultiple.activeMatchIndex = Math.min(last,Math.max(first,newIndex));

        return true;
      }

      $select.searchInput.on('keyup', function(e) {

        if ( ! KEY.isVerticalMovement(e.which) ) {
          scope.$evalAsync( function () {
            $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
          });
        }
        // Push a "create new" item into array if there is a search string
        if ( $select.tagging.isActivated && $select.search.length > 0 ) {

          // return early with these keys
          if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || KEY.isVerticalMovement(e.which) ) {
            return;
          }
          // always reset the activeIndex to the first item when tagging
          $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
          // taggingLabel === false bypasses all of this
          if ($select.taggingLabel === false) return;

          var items = angular.copy( $select.items );
          var stashArr = angular.copy( $select.items );
          var newItem;
          var item;
          var hasTag = false;
          var dupeIndex = -1;
          var tagItems;
          var tagItem;

          // case for object tagging via transform `$select.tagging.fct` function
          if ( $select.tagging.fct !== undefined) {
            tagItems = $select.$filter('filter')(items,{'isTag': true});
            if ( tagItems.length > 0 ) {
              tagItem = tagItems[0];
            }
            // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous
            if ( items.length > 0 && tagItem ) {
              hasTag = true;
              items = items.slice(1,items.length);
              stashArr = stashArr.slice(1,stashArr.length);
            }
            newItem = $select.tagging.fct($select.search);
            newItem.isTag = true;
            // verify the the tag doesn't match the value of an existing item
            if ( stashArr.filter( function (origItem) { return angular.equals( origItem, $select.tagging.fct($select.search) ); } ).length > 0 ) {
              return;
            }
            newItem.isTag = true;
          // handle newItem string and stripping dupes in tagging string context
          } else {
            // find any tagging items already in the $select.items array and store them
            tagItems = $select.$filter('filter')(items,function (item) {
              return item.match($select.taggingLabel);
            });
            if ( tagItems.length > 0 ) {
              tagItem = tagItems[0];
            }
            item = items[0];
            // remove existing tag item if found (should only ever be one tag item)
            if ( item !== undefined && items.length > 0 && tagItem ) {
              hasTag = true;
              items = items.slice(1,items.length);
              stashArr = stashArr.slice(1,stashArr.length);
            }
            newItem = $select.search+' '+$select.taggingLabel;
            if ( _findApproxDupe($select.selected, $select.search) > -1 ) {
              return;
            }
            // verify the the tag doesn't match the value of an existing item from
            // the searched data set or the items already selected
            if ( _findCaseInsensitiveDupe(stashArr.concat($select.selected)) ) {
              // if there is a tag from prev iteration, strip it / queue the change
              // and return early
              if ( hasTag ) {
                items = stashArr;
                scope.$evalAsync( function () {
                  $select.activeIndex = 0;
                  $select.items = items;
                });
              }
              return;
            }
            if ( _findCaseInsensitiveDupe(stashArr) ) {
              // if there is a tag from prev iteration, strip it
              if ( hasTag ) {
                $select.items = stashArr.slice(1,stashArr.length);
              }
              return;
            }
          }
          if ( hasTag ) dupeIndex = _findApproxDupe($select.selected, newItem);
          // dupe found, shave the first item
          if ( dupeIndex > -1 ) {
            items = items.slice(dupeIndex+1,items.length-1);
          } else {
            items = [];
            items.push(newItem);
            items = items.concat(stashArr);
          }
          scope.$evalAsync( function () {
            $select.activeIndex = 0;
            $select.items = items;
          });
        }
      });
      function _findCaseInsensitiveDupe(arr) {
        if ( arr === undefined || $select.search === undefined ) {
          return false;
        }
        var hasDupe = arr.filter( function (origItem) {
          if ( $select.search.toUpperCase() === undefined || origItem === undefined ) {
            return false;
          }
          return origItem.toUpperCase() === $select.search.toUpperCase();
        }).length > 0;

        return hasDupe;
      }
      function _findApproxDupe(haystack, needle) {
        var dupeIndex = -1;
        if(angular.isArray(haystack)) {
          var tempArr = angular.copy(haystack);
          for (var i = 0; i <tempArr.length; i++) {
            // handle the simple string version of tagging
            if ( $select.tagging.fct === undefined ) {
              // search the array for the match
              if ( tempArr[i]+' '+$select.taggingLabel === needle ) {
              dupeIndex = i;
              }
            // handle the object tagging implementation
            } else {
              var mockObj = tempArr[i];
              if (angular.isObject(mockObj)) {
                mockObj.isTag = true;
              }
              if ( angular.equals(mockObj, needle) ) {
                dupeIndex = i;
              }
            }
          }
        }
        return dupeIndex;
      }

      $select.searchInput.on('blur', function() {
        $timeout(function() {
          $selectMultiple.activeMatchIndex = -1;
        });
      });

    }
  };
}]);

uis.directive('uiSelectSingle', ['$timeout','$compile', function($timeout, $compile) {
  return {
    restrict: 'EA',
    require: ['^uiSelect', '^ngModel'],
    link: function(scope, element, attrs, ctrls) {

      var $select = ctrls[0];
      var ngModel = ctrls[1];

      //From view --> model
      ngModel.$parsers.unshift(function (inputValue) {
        var locals = {},
            result;
        locals[$select.parserResult.itemName] = inputValue;
        result = $select.parserResult.modelMapper(scope, locals);
        return result;
      });

      //From model --> view
      ngModel.$formatters.unshift(function (inputValue) {
        var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
            locals = {},
            result;
        if (data){
          var checkFnSingle = function(d){
            locals[$select.parserResult.itemName] = d;
            result = $select.parserResult.modelMapper(scope, locals);
            return result == inputValue;
          };
          //If possible pass same object stored in $select.selected
          if ($select.selected && checkFnSingle($select.selected)) {
            return $select.selected;
          }
          for (var i = data.length - 1; i >= 0; i--) {
            if (checkFnSingle(data[i])) return data[i];
          }
        }
        return inputValue;
      });

      //Update viewValue if model change
      scope.$watch('$select.selected', function(newValue) {
        if (ngModel.$viewValue !== newValue) {
          ngModel.$setViewValue(newValue);
        }
      });

      ngModel.$render = function() {
        $select.selected = ngModel.$viewValue;
      };

      scope.$on('uis:select', function (event, item) {
        $select.selected = item;
      });

      scope.$on('uis:close', function (event, skipFocusser) {
        $timeout(function(){
          $select.focusser.prop('disabled', false);
          if (!skipFocusser) $select.focusser[0].focus();
        },0,false);
      });

      scope.$on('uis:activate', function () {
        focusser.prop('disabled', true); //Will reactivate it on .close()
      });

      //Idea from: https://github.com/ivaynberg/select2/blob/79b5bf6db918d7560bdd959109b7bcfb47edaf43/select2.js#L1954
      var focusser = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' id='{{ $select.focusserId }}' aria-label='{{ $select.focusserTitle }}' aria-haspopup='true' role='button' />");
      $compile(focusser)(scope);
      $select.focusser = focusser;

      //Input that will handle focus
      $select.focusInput = focusser;

      element.parent().append(focusser);
      focusser.bind("focus", function(){
        scope.$evalAsync(function(){
          $select.focus = true;
        });
      });
      focusser.bind("blur", function(){
        scope.$evalAsync(function(){
          $select.focus = false;
        });
      });
      focusser.bind("keydown", function(e){

        if (e.which === KEY.BACKSPACE) {
          e.preventDefault();
          e.stopPropagation();
          $select.select(undefined);
          scope.$apply();
          return;
        }

        if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
          return;
        }

        if (e.which == KEY.DOWN  || e.which == KEY.UP || e.which == KEY.ENTER || e.which == KEY.SPACE){
          e.preventDefault();
          e.stopPropagation();
          $select.activate();
        }

        scope.$digest();
      });

      focusser.bind("keyup input", function(e){

        if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which == KEY.ENTER || e.which === KEY.BACKSPACE) {
          return;
        }

        $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input
        focusser.val('');
        scope.$digest();

      });


    }
  };
}]);
// Make multiple matches sortable
uis.directive('uiSelectSort', ['$timeout', 'uiSelectConfig', 'uiSelectMinErr', function($timeout, uiSelectConfig, uiSelectMinErr) {
  return {
    require: '^^uiSelect',
    link: function(scope, element, attrs, $select) {
      if (scope[attrs.uiSelectSort] === null) {
        throw uiSelectMinErr('sort', 'Expected a list to sort');
      }

      var options = angular.extend({
          axis: 'horizontal'
        },
        scope.$eval(attrs.uiSelectSortOptions));

      var axis = options.axis;
      var draggingClassName = 'dragging';
      var droppingClassName = 'dropping';
      var droppingBeforeClassName = 'dropping-before';
      var droppingAfterClassName = 'dropping-after';

      scope.$watch(function(){
        return $select.sortable;
      }, function(newValue){
        if (newValue) {
          element.attr('draggable', true);
        } else {
          element.removeAttr('draggable');
        }
      });

      element.on('dragstart', function(event) {
        element.addClass(draggingClassName);

        (event.dataTransfer || event.originalEvent.dataTransfer).setData('text/plain', scope.$index);
      });

      element.on('dragend', function() {
        element.removeClass(draggingClassName);
      });

      var move = function(from, to) {
        /*jshint validthis: true */
        this.splice(to, 0, this.splice(from, 1)[0]);
      };

      var dragOverHandler = function(event) {
        event.preventDefault();

        var offset = axis === 'vertical' ? event.offsetY || event.layerY || (event.originalEvent ? event.originalEvent.offsetY : 0) : event.offsetX || event.layerX || (event.originalEvent ? event.originalEvent.offsetX : 0);

        if (offset < (this[axis === 'vertical' ? 'offsetHeight' : 'offsetWidth'] / 2)) {
          element.removeClass(droppingAfterClassName);
          element.addClass(droppingBeforeClassName);

        } else {
          element.removeClass(droppingBeforeClassName);
          element.addClass(droppingAfterClassName);
        }
      };

      var dropTimeout;

      var dropHandler = function(event) {
        event.preventDefault();

        var droppedItemIndex = parseInt((event.dataTransfer || event.originalEvent.dataTransfer).getData('text/plain'), 10);

        // prevent event firing multiple times in firefox
        $timeout.cancel(dropTimeout);
        dropTimeout = $timeout(function() {
          _dropHandler(droppedItemIndex);
        }, 20);
      };

      var _dropHandler = function(droppedItemIndex) {
        var theList = scope.$eval(attrs.uiSelectSort);
        var itemToMove = theList[droppedItemIndex];
        var newIndex = null;

        if (element.hasClass(droppingBeforeClassName)) {
          if (droppedItemIndex < scope.$index) {
            newIndex = scope.$index - 1;
          } else {
            newIndex = scope.$index;
          }
        } else {
          if (droppedItemIndex < scope.$index) {
            newIndex = scope.$index;
          } else {
            newIndex = scope.$index + 1;
          }
        }

        move.apply(theList, [droppedItemIndex, newIndex]);

        scope.$apply(function() {
          scope.$emit('uiSelectSort:change', {
            array: theList,
            item: itemToMove,
            from: droppedItemIndex,
            to: newIndex
          });
        });

        element.removeClass(droppingClassName);
        element.removeClass(droppingBeforeClassName);
        element.removeClass(droppingAfterClassName);

        element.off('drop', dropHandler);
      };

      element.on('dragenter', function() {
        if (element.hasClass(draggingClassName)) {
          return;
        }

        element.addClass(droppingClassName);

        element.on('dragover', dragOverHandler);
        element.on('drop', dropHandler);
      });

      element.on('dragleave', function(event) {
        if (event.target != element) {
          return;
        }
        element.removeClass(droppingClassName);
        element.removeClass(droppingBeforeClassName);
        element.removeClass(droppingAfterClassName);

        element.off('dragover', dragOverHandler);
        element.off('drop', dropHandler);
      });
    }
  };
}]);

/**
 * Parses "repeat" attribute.
 *
 * Taken from AngularJS ngRepeat source code
 * See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L211
 *
 * Original discussion about parsing "repeat" attribute instead of fully relying on ng-repeat:
 * https://github.com/angular-ui/ui-select/commit/5dd63ad#commitcomment-5504697
 */

uis.service('uisRepeatParser', ['uiSelectMinErr','$parse', function(uiSelectMinErr, $parse) {
  var self = this;

  /**
   * Example:
   * expression = "address in addresses | filter: {street: $select.search} track by $index"
   * itemName = "address",
   * source = "addresses | filter: {street: $select.search}",
   * trackByExp = "$index",
   */
  self.parse = function(expression) {


    var match;
    var isObjectCollection = /\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)/.test(expression);
    // If an array is used as collection

    // if (isObjectCollection){
      //00000000000000000000000000000111111111000000000000000222222222222220033333333333333333333330000444444444444444444000000000000000556666660000077777777777755000000000000000000000088888880000000
    match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(([\w\.]+)?\s*(|\s*[\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);      

    // 1 Alias
    // 2 Item
    // 3 Key on (key,value)
    // 4 Value on (key,value)
    // 5 Collection expresion (only used when using an array collection)
    // 6 Object that will be converted to Array when using (key,value) syntax
    // 7 Filters that will be applied to #6 when using (key,value) syntax
    // 8 Track by

    if (!match) {
      throw uiSelectMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
              expression);
    }
    if (!match[6] && isObjectCollection) {
      throw uiSelectMinErr('iexp', "Expected expression in form of '_item_ as (_key_, _item_) in _ObjCollection_ [ track by _id_]' but got '{0}'.",
              expression);
    }

    return {
      itemName: match[4] || match[2], // (lhs) Left-hand side,
      keyName: match[3], //for (key, value) syntax
      source: $parse(!match[3] ? match[5] : match[6]),
      sourceName: match[6],
      filters: match[7],
      trackByExp: match[8],
      modelMapper: $parse(match[1] || match[4] || match[2]),
      repeatExpression: function (grouped) {
        var expression = this.itemName + ' in ' + (grouped ? '$group.items' : '$select.items');
        if (this.trackByExp) {
          expression += ' track by ' + this.trackByExp;
        }
        return expression;
      } 
    };

  };

  self.getGroupNgRepeatExpression = function() {
    return '$group in $select.groups';
  };

}]);

}());
angular.module("ui.select").run(["$templateCache", function($templateCache) {$templateCache.put("bootstrap/choices.tpl.html","<ul class=\"ui-select-choices ui-select-choices-content ui-select-dropdown dropdown-menu\" role=\"listbox\" ng-show=\"$select.items.length > 0\"><li class=\"ui-select-choices-group\" id=\"ui-select-choices-{{ $select.generatedId }}\"><div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div><div id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\" role=\"option\"><a href=\"\" class=\"ui-select-choices-row-inner\"></a></div></li></ul>");
$templateCache.put("bootstrap/match-multiple.tpl.html","<span class=\"ui-select-match\"><span ng-repeat=\"$item in $select.selected\"><span class=\"ui-select-match-item btn btn-default btn-xs\" tabindex=\"-1\" type=\"button\" ng-disabled=\"$select.disabled\" ng-click=\"$selectMultiple.activeMatchIndex = $index;\" ng-class=\"{\'btn-primary\':$selectMultiple.activeMatchIndex === $index, \'select-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span class=\"close ui-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&nbsp;&times;</span> <span uis-transclude-append=\"\"></span></span></span></span>");
$templateCache.put("bootstrap/match.tpl.html","<div class=\"ui-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\"><span tabindex=\"-1\" class=\"btn btn-default form-control ui-select-toggle\" aria-label=\"{{ $select.baseTitle }} activate\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activate()\" style=\"outline: 0;\"><span ng-show=\"$select.isEmpty()\" class=\"ui-select-placeholder text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"ui-select-match-text pull-left\" ng-class=\"{\'ui-select-allow-clear\': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span> <i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i> <a ng-show=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\" style=\"margin-right: 10px\" ng-click=\"$select.clear($event)\" class=\"btn btn-xs btn-link pull-right\"><i class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></i></a></span></div>");
$templateCache.put("bootstrap/select-multiple.tpl.html","<div class=\"ui-select-container ui-select-multiple ui-select-bootstrap dropdown form-control\" ng-class=\"{open: $select.open}\"><div><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search input-xs\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-click=\"$select.activate()\" ng-model=\"$select.search\" role=\"combobox\" aria-label=\"{{ $select.baseTitle }}\" ondrop=\"return false;\"></div><div class=\"ui-select-choices\"></div></div>");
$templateCache.put("bootstrap/select.tpl.html","<div class=\"ui-select-container ui-select-bootstrap dropdown\" ng-class=\"{open: $select.open}\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"false\" tabindex=\"-1\" aria-expanded=\"true\" aria-label=\"{{ $select.baseTitle }}\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"form-control ui-select-search\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-show=\"$select.searchEnabled && $select.open\"><div class=\"ui-select-choices\"></div></div>");
$templateCache.put("select2/choices.tpl.html","<ul class=\"ui-select-choices ui-select-choices-content select2-results\"><li class=\"ui-select-choices-group\" ng-class=\"{\'select2-result-with-children\': $select.choiceGrouped($group) }\"><div ng-show=\"$select.choiceGrouped($group)\" class=\"ui-select-choices-group-label select2-result-label\" ng-bind=\"$group.name\"></div><ul role=\"listbox\" id=\"ui-select-choices-{{ $select.generatedId }}\" ng-class=\"{\'select2-result-sub\': $select.choiceGrouped($group), \'select2-result-single\': !$select.choiceGrouped($group) }\"><li role=\"option\" id=\"ui-select-choices-row-{{ $select.generatedId }}-{{$index}}\" class=\"ui-select-choices-row\" ng-class=\"{\'select2-highlighted\': $select.isActive(this), \'select2-disabled\': $select.isDisabled(this)}\"><div class=\"select2-result-label ui-select-choices-row-inner\"></div></li></ul></li></ul>");
$templateCache.put("select2/match-multiple.tpl.html","<span class=\"ui-select-match\"><li class=\"ui-select-match-item select2-search-choice\" ng-repeat=\"$item in $select.selected\" ng-class=\"{\'select2-search-choice-focus\':$selectMultiple.activeMatchIndex === $index, \'select2-locked\':$select.isLocked(this, $index)}\" ui-select-sort=\"$select.selected\"><span uis-transclude-append=\"\"></span> <a href=\"javascript:;\" class=\"ui-select-match-close select2-search-choice-close\" ng-click=\"$selectMultiple.removeChoice($index)\" tabindex=\"-1\"></a></li></span>");
$templateCache.put("select2/match.tpl.html","<a class=\"select2-choice ui-select-match\" ng-class=\"{\'select2-default\': $select.isEmpty()}\" ng-click=\"$select.toggle($event)\" aria-label=\"{{ $select.baseTitle }} select\"><span ng-show=\"$select.isEmpty()\" class=\"select2-chosen\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"select2-chosen\" ng-transclude=\"\"></span> <abbr ng-if=\"$select.allowClear && !$select.isEmpty()\" class=\"select2-search-choice-close\" ng-click=\"$select.clear($event)\"></abbr> <span class=\"select2-arrow ui-select-toggle\"><b></b></span></a>");
$templateCache.put("select2/select-multiple.tpl.html","<div class=\"ui-select-container ui-select-multiple select2 select2-container select2-container-multi\" ng-class=\"{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled}\"><ul class=\"select2-choices\"><span class=\"ui-select-match\"></span><li class=\"select2-search-field\"><input type=\"text\" autocomplete=\"false\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" role=\"combobox\" aria-expanded=\"true\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-label=\"{{ $select.baseTitle }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"select2-input ui-select-search\" placeholder=\"{{$selectMultiple.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-model=\"$select.search\" ng-click=\"$select.activate()\" style=\"width: 34px;\" ondrop=\"return false;\"></li></ul><div class=\"ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"ui-select-choices\"></div></div></div>");
$templateCache.put("select2/select.tpl.html","<div class=\"ui-select-container select2 select2-container\" ng-class=\"{\'select2-container-active select2-dropdown-open open\': $select.open, \'select2-container-disabled\': $select.disabled, \'select2-container-active\': $select.focus, \'select2-allowclear\': $select.allowClear && !$select.isEmpty()}\"><div class=\"ui-select-match\"></div><div class=\"ui-select-dropdown select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"select2-search\" ng-show=\"$select.searchEnabled\"><input type=\"text\" autocomplete=\"false\" autocorrect=\"false\" autocapitalize=\"off\" spellcheck=\"false\" role=\"combobox\" aria-expanded=\"true\" aria-owns=\"ui-select-choices-{{ $select.generatedId }}\" aria-label=\"{{ $select.baseTitle }}\" aria-activedescendant=\"ui-select-choices-row-{{ $select.generatedId }}-{{ $select.activeIndex }}\" class=\"ui-select-search select2-input\" ng-model=\"$select.search\"></div><div class=\"ui-select-choices\"></div></div></div>");
$templateCache.put("selectize/choices.tpl.html","<div ng-show=\"$select.open\" class=\"ui-select-choices ui-select-dropdown selectize-dropdown single\"><div class=\"ui-select-choices-content selectize-dropdown-content\"><div class=\"ui-select-choices-group optgroup\" role=\"listbox\"><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label optgroup-header\" ng-bind=\"$group.name\"></div><div role=\"option\" class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\"><div class=\"option ui-select-choices-row-inner\" data-selectable=\"\"></div></div></div></div></div>");
$templateCache.put("selectize/match.tpl.html","<div ng-hide=\"($select.open || $select.isEmpty())\" class=\"ui-select-match\" ng-transclude=\"\"></div>");
$templateCache.put("selectize/select.tpl.html","<div class=\"ui-select-container selectize-control single\" ng-class=\"{\'open\': $select.open}\"><div class=\"selectize-input\" ng-class=\"{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}\" ng-click=\"$select.open && !$select.searchEnabled ? $select.toggle($event) : $select.activate()\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"false\" tabindex=\"-1\" class=\"ui-select-search ui-select-toggle\" ng-click=\"$select.toggle($event)\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-hide=\"!$select.searchEnabled || ($select.selected && !$select.open)\" ng-disabled=\"$select.disabled\" aria-label=\"{{ $select.baseTitle }}\"></div><div class=\"ui-select-choices\"></div></div>");}]);
/*! w5cValidator v2.4.10 2016-02-25 */
angular.module("w5c.validator",["ng"]).provider("w5cValidator",[function(){var a={required:"该选项不能为空",maxlength:"该选项输入值长度不能大于{maxlength}",minlength:"该选项输入值长度不能小于{minlength}",email:"输入邮件的格式不正确",repeat:"两次输入不一致",pattern:"该选项输入格式不正确",number:"必须输入数字",w5cuniquecheck:"该输入值已经存在，请重新输入",url:"输入URL格式不正确",max:"该选项输入值不能大于{max}",min:"该选项输入值不能小于{min}",customizer:"自定义验证不通过"},b=["text","password","email","number","url","tel","hidden",["textarea"],["select"],["select-multiple"],["select-one"],"radio","checkbox"],c=function(a){return"FORM"===a[0].tagName||11==a[0].nodeType?null:a&&a.hasClass("form-group")?a:c(a.parent())},d=function(){this.elemTypes=b,this.rules={},this.isEmpty=function(a){return a?a instanceof Array&&0===a.length?!0:!1:!0},this.defaultShowError=function(a,b){var d=angular.element(a),e=c(d);this.isEmpty(e)||e.hasClass("has-error")||e.addClass("has-error");var f=d.next();f&&f.hasClass("w5c-error")||d.after('<span class="w5c-error">'+b[0]+"</span>")},this.defaultRemoveError=function(a){var b=angular.element(a),d=c(b);!this.isEmpty(d)&&d.hasClass("has-error")&&d.removeClass("has-error");var e=b.next();e.hasClass&&e.hasClass("w5c-error")&&e.remove()},this.options={blurTrig:!1,showError:!0,removeError:!0}};d.prototype={constructor:d,config:function(a){this.options=angular.extend(this.options,a)},setRules:function(a){this.rules=angular.extend(this.rules,a)},getErrorMessage:function(b,c){var d=null;switch(this.isEmpty(this.rules[c.name])||this.isEmpty(this.rules[c.name][b])||(d=this.rules[c.name][b]),b){case"maxlength":return null!==d?d.replace("{maxlength}",c.getAttribute("ng-maxlength")):a.maxlength.replace("{maxlength}",c.getAttribute("ng-maxlength"));case"minlength":return null!==d?d.replace("{minlength}",c.getAttribute("ng-minlength")):a.minlength.replace("{minlength}",c.getAttribute("ng-minlength"));case"max":return null!==d?d.replace("{max}",c.getAttribute("max")):a.max.replace("{max}",c.getAttribute("max"));case"min":return null!==d?d.replace("{min}",c.getAttribute("min")):a.min.replace("{min}",c.getAttribute("min"));default:if(null!==d)return d;if(null===a[b])throw new Error("该验证规则("+b+")默认错误信息没有设置！");return a[b]}},getErrorMessages:function(a,b){var c=[];for(var d in b)if(b[d]){var e=this.getErrorMessage(d,a);c.push(e)}return c},showError:function(a,b,c){var d=angular.extend({},this.options,c);return angular.element(a).removeClass("valid").addClass("error"),d.showError!==!1?angular.isFunction(d.showError)?d.showError(a,b):d.showError===!0?this.defaultShowError(a,b):void 0:void 0},removeError:function(a,b){var c=angular.extend({},this.options,b);return angular.element(a).removeClass("error").addClass("valid"),c.removeError!==!1?angular.isFunction(c.removeError)?c.removeError(a):c.removeError===!0?this.defaultRemoveError(a):void 0:void 0}};var e=new d;this.config=function(a){e.config(a)},this.setRules=function(a){e.setRules(a)},this.setDefaultRules=function(b){a=angular.extend(a,b)},this.$get=function(){return e}}]),function(){angular.module("w5c.validator").directive("w5cFormValidate",["$parse","w5cValidator","$timeout",function(a,b,c){return{require:["w5cFormValidate","^?form"],controller:["$scope",function(a){this.needBindKeydown=!1,this.form=null,this.formElement=null,this.submitSuccessFn=null,this.validElements=[],this.init=function(a,b){this.form=a,this.formElement=b,this.formName=b.attr("name")},this.doValidate=function(b,c){angular.isFunction(this.form.doValidate)&&this.form.doValidate(),this.form.$valid&&angular.isFunction(b)&&a.$apply(function(){b(a,{$event:c})})},this.removeElementValidation=function(a){var c=this.validElements.indexOf(a);c>=0&&(this.validElements.splice(c,1),b.isEmpty(this.form.$errors)||this.doValidate(angular.noop))},this.removeError=function(a){this.form.$errors=[],b.removeError(a,this.options)},this.initElement=function(d){var e=angular.element(d),f=this;if(b.elemTypes.toString().indexOf(d.type)>-1&&!b.isEmpty(d.name)&&!/^\d/.test(d.name)){var g=e.attr("disabled");if(g&&("true"===g||"disabled"===g))return;if(!(this.validElements.indexOf(d.name)<0))return;this.validElements.push(d.name);var h=this.formName+"."+d.name+".$viewValue";a.$watch(h,function(){f.removeError(e)},!0),f.options.blurTrig&&e.bind("blur",function(){if(f.options.blurTrig){var a=this,d=angular.element(this);c(function(){if(f.form[a.name].$valid)b.removeError(d,f.options);else{var c=b.getErrorMessages(a,f.form[a.name].$error);b.showError(d,c,f.options)}},50)}})}}}],link:function(d,e,f,g){var h=g[0],i=g[1],j=e[0],k=a(f.w5cSubmit),l=d.$eval(f.w5cFormValidate);if(!f.name)throw Error("form must has name when use w5cFormValidate");h.init(i,e,f),f.w5cFormValidate&&d.$watch(f.w5cFormValidate,function(a){a&&(h.options=l=angular.extend({},b.options,a))},!0),h.options=l=angular.extend({},b.options,l);for(var m=0;m<j.length;m++){var n=j[m];h.initElement(n)}var o=function(){for(var a=[],c=0;c<j.length;c++){var e=j[c].name;if(e&&h.validElements.indexOf(e)>=0){var f=j[e];if(i[e]&&f&&b.elemTypes.toString().indexOf(f.type)>-1&&!b.isEmpty(f.name)){if(i[e].$valid){angular.element(f).removeClass("error").addClass("valid");continue}var g=b.getErrorMessages(f,i[f.name].$error);a.push(g[0]),b.removeError(f,l),b.showError(f,g,l)}}}i.$errors=!b.isEmpty(a)&&a.length>0?a:[],d.$$phase||d.$apply(i.$errors)};i&&(i.doValidate=o,i.reset=function(){c(function(){i.$setPristine();for(var a=0;a<j.length;a++){var c=j[a],d=angular.element(c);b.removeError(d,l)}})}),f.w5cSubmit&&angular.isFunction(k)&&(e.bind("submit",function(a){o(),i.$valid&&angular.isFunction(k)&&d.$apply(function(){k(d,{$event:a})})}),h.needBindKeydown=!0),h.needBindKeydown&&e.bind("keydown keypress",function(a){if(13===a.which){var b=document.activeElement;if(b.type&&"textarea"!==b.type){var c=e.find("button");c&&c[0]&&c[0].focus(),b.focus(),o(),a.preventDefault(),i.$valid&&angular.isFunction(h.submitSuccessFn)&&d.$apply(function(){h.submitSuccessFn(d,{$event:a})})}}})}}}]).directive("w5cFormSubmit",["$parse",function(a){return{require:"^w5cFormValidate",link:function(b,c,d,e){var f=a(d.w5cFormSubmit);c.bind("click",function(a){e.doValidate(f,a)}),e.needBindKeydown=!0,e.submitSuccessFn=f}}}]).directive("w5cRepeat",[function(){"use strict";return{require:["ngModel","^w5cFormValidate"],link:function(a,b,c,d){var e=b.inheritedData("$formController")[c.w5cRepeat],f=d[0],g=d[1];f.$parsers.push(function(a){return a===e.$viewValue?f.$setValidity("repeat",!0):f.$setValidity("repeat",!1),a}),e.$parsers.push(function(a){return f.$setValidity("repeat",a===f.$viewValue),a===f.$viewValue&&g.removeError(b),a})}}}]).directive("w5cCustomizer",["$timeout",function(){"use strict";return{require:["^form","ngModel"],link:function(a,b,c,d){var e=d[1],f=function(){var b=a.$eval(c.w5cCustomizer);b===!0?e.$setValidity("customizer",!0):e.$setValidity("customizer",!1)},g=d[0][c.associate];g&&g.$viewChangeListeners.push(f),e.$viewChangeListeners.push(f)}}}]).directive("w5cUniqueCheck",["$timeout","$http","w5cValidator",function(a,b,c){return{require:["ngModel","?^w5cFormValidate","?^form"],link:function(a,d,e,f){var g=f[0],h=f[1],i=f[2],j=function(){var f=a.$eval(e.w5cUniqueCheck),j=f.url,k=f.isExists;b.get(j).success(function(a){var b=k===!1?"true"==a||1==a:!("true"==a||1==a);if(g.$setValidity("w5cuniquecheck",b),!b){var e=c.getErrorMessage("w5cuniquecheck",d[0]);c.showError(d[0],[e],h.options),i.$errors?i.$errors.unshift(e):i.$errors=[e]}})};g.$viewChangeListeners.push(function(){i.$errors=[],g.$setValidity("w5cuniquecheck",!0),(!g.$invalid||g.$error.w5cuniquecheck)&&g.$dirty&&j()});var k=a.$eval(e.ngModel);if(k){if(g.$invalid&&!g.$error.w5cuniquecheck)return;j()}}}}]).directive("w5cDynamicName",[function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){d.$name=a.$eval(c.w5cDynamicName),b.attr("name",a.$eval(c.w5cDynamicName));var e=b.controller("form")||{$addControl:angular.noop};e.$addControl(d)}}}]).directive("w5cDynamicElement",["$timeout",function(a){return{restrict:"A",require:["ngModel","?^w5cFormValidate","?^form"],link:function(b,c,d,e){var f=c[0].name,g=e[2];if(f){c.on("$destroy",function(){e[1].removeElementValidation(f)}),g[f]||g.$addControl(e[0]);var h=!1;e[2].$errors&&e[2].$errors.length>0&&(h=!0),e[1].initElement(c[0]),h&&a(function(){e[1].doValidate(angular.noop)})}}}}])}();
/*! 12.0.4 */
!function(){function a(a,b){window.XMLHttpRequest.prototype[a]=b(window.XMLHttpRequest.prototype[a])}function b(a,b,c){try{Object.defineProperty(a,b,{get:c})}catch(d){}}if(window.FileAPI||(window.FileAPI={}),!window.XMLHttpRequest)throw"AJAX is not supported. XMLHttpRequest is not defined.";if(FileAPI.shouldLoad=!window.FormData||FileAPI.forceLoad,FileAPI.shouldLoad){var c=function(a){if(!a.__listeners){a.upload||(a.upload={}),a.__listeners=[];var b=a.upload.addEventListener;a.upload.addEventListener=function(c,d){a.__listeners[c]=d,b&&b.apply(this,arguments)}}};a("open",function(a){return function(b,d,e){c(this),this.__url=d;try{a.apply(this,[b,d,e])}catch(f){f.message.indexOf("Access is denied")>-1&&(this.__origError=f,a.apply(this,[b,"_fix_for_ie_crossdomain__",e]))}}}),a("getResponseHeader",function(a){return function(b){return this.__fileApiXHR&&this.__fileApiXHR.getResponseHeader?this.__fileApiXHR.getResponseHeader(b):null==a?null:a.apply(this,[b])}}),a("getAllResponseHeaders",function(a){return function(){return this.__fileApiXHR&&this.__fileApiXHR.getAllResponseHeaders?this.__fileApiXHR.getAllResponseHeaders():null==a?null:a.apply(this)}}),a("abort",function(a){return function(){return this.__fileApiXHR&&this.__fileApiXHR.abort?this.__fileApiXHR.abort():null==a?null:a.apply(this)}}),a("setRequestHeader",function(a){return function(b,d){if("__setXHR_"===b){c(this);var e=d(this);e instanceof Function&&e(this)}else this.__requestHeaders=this.__requestHeaders||{},this.__requestHeaders[b]=d,a.apply(this,arguments)}}),a("send",function(a){return function(){var c=this;if(arguments[0]&&arguments[0].__isFileAPIShim){var d=arguments[0],e={url:c.__url,jsonp:!1,cache:!0,complete:function(a,d){a&&angular.isString(a)&&-1!==a.indexOf("#2174")&&(a=null),c.__completed=!0,!a&&c.__listeners.load&&c.__listeners.load({type:"load",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),!a&&c.__listeners.loadend&&c.__listeners.loadend({type:"loadend",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),"abort"===a&&c.__listeners.abort&&c.__listeners.abort({type:"abort",loaded:c.__loaded,total:c.__total,target:c,lengthComputable:!0}),void 0!==d.status&&b(c,"status",function(){return 0===d.status&&a&&"abort"!==a?500:d.status}),void 0!==d.statusText&&b(c,"statusText",function(){return d.statusText}),b(c,"readyState",function(){return 4}),void 0!==d.response&&b(c,"response",function(){return d.response});var e=d.responseText||(a&&0===d.status&&"abort"!==a?a:void 0);b(c,"responseText",function(){return e}),b(c,"response",function(){return e}),a&&b(c,"err",function(){return a}),c.__fileApiXHR=d,c.onreadystatechange&&c.onreadystatechange(),c.onload&&c.onload()},progress:function(a){if(a.target=c,c.__listeners.progress&&c.__listeners.progress(a),c.__total=a.total,c.__loaded=a.loaded,a.total===a.loaded){var b=this;setTimeout(function(){c.__completed||(c.getAllResponseHeaders=function(){},b.complete(null,{status:204,statusText:"No Content"}))},FileAPI.noContentTimeout||1e4)}},headers:c.__requestHeaders};e.data={},e.files={};for(var f=0;f<d.data.length;f++){var g=d.data[f];null!=g.val&&null!=g.val.name&&null!=g.val.size&&null!=g.val.type?e.files[g.key]=g.val:e.data[g.key]=g.val}setTimeout(function(){if(!FileAPI.hasFlash)throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';c.__fileApiXHR=FileAPI.upload(e)},1)}else{if(this.__origError)throw this.__origError;a.apply(c,arguments)}}}),window.XMLHttpRequest.__isFileAPIShim=!0,window.FormData=FormData=function(){return{append:function(a,b,c){b.__isFileAPIBlobShim&&(b=b.data[0]),this.data.push({key:a,val:b,name:c})},data:[],__isFileAPIShim:!0}},window.Blob=Blob=function(a){return{data:a,__isFileAPIBlobShim:!0}}}}(),function(){function a(a){return"input"===a[0].tagName.toLowerCase()&&a.attr("type")&&"file"===a.attr("type").toLowerCase()}function b(){try{var a=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(a)return!0}catch(b){if(void 0!==navigator.mimeTypes["application/x-shockwave-flash"])return!0}return!1}function c(a){var b=0,c=0;if(window.jQuery)return jQuery(a).offset();if(a.offsetParent)do b+=a.offsetLeft-a.scrollLeft,c+=a.offsetTop-a.scrollTop,a=a.offsetParent;while(a);return{left:b,top:c}}if(FileAPI.shouldLoad){if(FileAPI.hasFlash=b(),FileAPI.forceLoad&&(FileAPI.html5=!1),!FileAPI.upload){var d,e,f,g,h,i=document.createElement("script"),j=document.getElementsByTagName("script");if(window.FileAPI.jsUrl)d=window.FileAPI.jsUrl;else if(window.FileAPI.jsPath)e=window.FileAPI.jsPath;else for(f=0;f<j.length;f++)if(h=j[f].src,g=h.search(/\/ng\-file\-upload[\-a-zA-z0-9\.]*\.js/),g>-1){e=h.substring(0,g+1);break}null==FileAPI.staticPath&&(FileAPI.staticPath=e),i.setAttribute("src",d||e+"FileAPI.min.js"),document.getElementsByTagName("head")[0].appendChild(i)}FileAPI.ngfFixIE=function(d,e,f){if(!b())throw'Adode Flash Player need to be installed. To check ahead use "FileAPI.hasFlash"';var g=function(){var b=e.parent();d.attr("disabled")?b&&b.removeClass("js-fileapi-wrapper"):(e.attr("__ngf_flash_")||(e.unbind("change"),e.unbind("click"),e.bind("change",function(a){h.apply(this,[a]),f.apply(this,[a])}),e.attr("__ngf_flash_","true")),b.addClass("js-fileapi-wrapper"),a(d)||(b.css("position","absolute").css("top",c(d[0]).top+"px").css("left",c(d[0]).left+"px").css("width",d[0].offsetWidth+"px").css("height",d[0].offsetHeight+"px").css("filter","alpha(opacity=0)").css("display",d.css("display")).css("overflow","hidden").css("z-index","900000").css("visibility","visible"),e.css("width",d[0].offsetWidth+"px").css("height",d[0].offsetHeight+"px").css("position","absolute").css("top","0px").css("left","0px")))};d.bind("mouseenter",g);var h=function(a){for(var b=FileAPI.getFiles(a),c=0;c<b.length;c++)void 0===b[c].size&&(b[c].size=0),void 0===b[c].name&&(b[c].name="file"),void 0===b[c].type&&(b[c].type="undefined");a.target||(a.target={}),a.target.files=b,a.target.files!==b&&(a.__files_=b),(a.__files_||a.target.files).item=function(b){return(a.__files_||a.target.files)[b]||null}}},FileAPI.disableFileInput=function(a,b){b?a.removeClass("js-fileapi-wrapper"):a.addClass("js-fileapi-wrapper")}}}(),window.FileReader||(window.FileReader=function(){var a=this,b=!1;this.listeners={},this.addEventListener=function(b,c){a.listeners[b]=a.listeners[b]||[],a.listeners[b].push(c)},this.removeEventListener=function(b,c){a.listeners[b]&&a.listeners[b].splice(a.listeners[b].indexOf(c),1)},this.dispatchEvent=function(b){var c=a.listeners[b.type];if(c)for(var d=0;d<c.length;d++)c[d].call(a,b)},this.onabort=this.onerror=this.onload=this.onloadstart=this.onloadend=this.onprogress=null;var c=function(b,c){var d={type:b,target:a,loaded:c.loaded,total:c.total,error:c.error};return null!=c.result&&(d.target.result=c.result),d},d=function(d){b||(b=!0,a.onloadstart&&a.onloadstart(c("loadstart",d)));var e;"load"===d.type?(a.onloadend&&a.onloadend(c("loadend",d)),e=c("load",d),a.onload&&a.onload(e),a.dispatchEvent(e)):"progress"===d.type?(e=c("progress",d),a.onprogress&&a.onprogress(e),a.dispatchEvent(e)):(e=c("error",d),a.onerror&&a.onerror(e),a.dispatchEvent(e))};this.readAsDataURL=function(a){FileAPI.readAsDataURL(a,d)},this.readAsText=function(a){FileAPI.readAsText(a,d)}});
/*! 12.0.4 */
!window.XMLHttpRequest||window.FileAPI&&FileAPI.shouldLoad||(window.XMLHttpRequest.prototype.setRequestHeader=function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}}(window.XMLHttpRequest.prototype.setRequestHeader));var ngFileUpload=angular.module("ngFileUpload",[]);ngFileUpload.version="12.0.4",ngFileUpload.service("UploadBase",["$http","$q","$timeout",function(a,b,c){function d(d){function e(a){j.notify&&j.notify(a),k.progressFunc&&c(function(){k.progressFunc(a)})}function h(a){return null!=d._start&&g?{loaded:a.loaded+d._start,total:d._file&&d._file.size||a.total,type:a.type,config:d,lengthComputable:!0,target:a.target}:a}function i(){a(d).then(function(a){g&&d._chunkSize&&!d._finished&&d._file?(e({loaded:d._end,total:d._file&&d._file.size,config:d,type:"progress"}),f.upload(d,!0)):(d._finished&&delete d._finished,j.resolve(a))},function(a){j.reject(a)},function(a){j.notify(a)})}d.method=d.method||"POST",d.headers=d.headers||{};var j=d._deferred=d._deferred||b.defer(),k=j.promise;return d.disableProgress||(d.headers.__setXHR_=function(){return function(a){a&&a.upload&&a.upload.addEventListener&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){a.config=d,e(h(a))},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&(a.config=d,e(h(a)))},!1))}}),g?d._chunkSize&&d._end&&!d._finished?(d._start=d._end,d._end+=d._chunkSize,i()):d.resumeSizeUrl?a.get(d.resumeSizeUrl).then(function(a){d._start=d.resumeSizeResponseReader?d.resumeSizeResponseReader(a.data):parseInt((null==a.data.size?a.data:a.data.size).toString()),d._chunkSize&&(d._end=d._start+d._chunkSize),i()},function(a){throw a}):d.resumeSize?d.resumeSize().then(function(a){d._start=a,i()},function(a){throw a}):(d._chunkSize&&(d._start=0,d._end=d._start+d._chunkSize),i()):i(),k.success=function(a){return k.then(function(b){a(b.data,b.status,b.headers,d)}),k},k.error=function(a){return k.then(null,function(b){a(b.data,b.status,b.headers,d)}),k},k.progress=function(a){return k.progressFunc=a,k.then(null,null,function(b){a(b)}),k},k.abort=k.pause=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),k},k.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(k,arguments),a.apply(k,arguments)}}(d.xhrFn),k},f.promisesCount++,k["finally"](function(){f.promisesCount--}),k}function e(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}var f=this;f.promisesCount=0,this.isResumeSupported=function(){return window.Blob&&window.Blob.prototype.slice};var g=this.isResumeSupported();this.isUploadInProgress=function(){return f.promisesCount>0},this.rename=function(a,b){return a.ngfName=b,a},this.jsonBlob=function(a){null==a||angular.isString(a)||(a=JSON.stringify(a));var b=new window.Blob([a],{type:"application/json"});return b._ngfBlob=!0,b},this.json=function(a){return angular.toJson(a)},this.isFile=function(a){return null!=a&&(a instanceof window.Blob||a.flashId&&a.name&&a.size)},this.upload=function(a,b){function c(b,c){if(b._ngfBlob)return b;if(a._file=a._file||b,null!=a._start&&g){a._end&&a._end>=b.size&&(a._finished=!0,a._end=b.size);var d=b.slice(a._start,a._end||b.size);return d.name=b.name,d.ngfName=b.ngfName,a._chunkSize&&(c.append("_chunkSize",a._chunkSize),c.append("_currentChunkSize",a._end-a._start),c.append("_chunkNumber",Math.floor(a._start/a._chunkSize)),c.append("_totalSize",a._file.size)),d}return b}function h(b,d,e){if(void 0!==d)if(angular.isDate(d)&&(d=d.toISOString()),angular.isString(d))b.append(e,d);else if(f.isFile(d)){var g=c(d,b),i=e.split(",");i[1]&&(g.ngfName=i[1].replace(/^\s+|\s+$/g,""),e=i[0]),a._fileKey=a._fileKey||e,b.append(e,g,g.ngfName||g.name)}else if(angular.isObject(d)){if(d.$$ngfCircularDetection)throw"ngFileUpload: Circular reference in config.data. Make sure specified data for Upload.upload() has no circular reference: "+e;d.$$ngfCircularDetection=!0;try{for(var j in d)if(d.hasOwnProperty(j)&&"$$ngfCircularDetection"!==j){var k=null==a.objectKey?"[i]":a.objectKey;d.length&&parseInt(j)>-1&&(k=null==a.arrayKey?k:a.arrayKey),h(b,d[j],e+k.replace(/[ik]/g,j))}}finally{delete d.$$ngfCircularDetection}}else b.append(e,d)}function i(){a._chunkSize=f.translateScalars(a.resumeChunkSize),a._chunkSize=a._chunkSize?parseInt(a._chunkSize.toString()):null,a.headers=a.headers||{},a.headers["Content-Type"]=void 0,a.transformRequest=a.transformRequest?angular.isArray(a.transformRequest)?a.transformRequest:[a.transformRequest]:[],a.transformRequest.push(function(b){var c,d=new window.FormData;b=b||a.fields||{},a.file&&(b.file=a.file);for(c in b)if(b.hasOwnProperty(c)){var e=b[c];a.formDataAppender?a.formDataAppender(d,c,e):h(d,e,c)}return d})}return b||(a=e(a)),a._isDigested||(a._isDigested=!0,i()),d(a)},this.http=function(b){return b=e(b),b.transformRequest=b.transformRequest||function(b){return window.ArrayBuffer&&b instanceof window.ArrayBuffer||b instanceof window.Blob?b:a.defaults.transformRequest[0].apply(this,arguments)},b._chunkSize=f.translateScalars(b.resumeChunkSize),b._chunkSize=b._chunkSize?parseInt(b._chunkSize.toString()):null,d(b)},this.translateScalars=function(a){if(angular.isString(a)){if(a.search(/kb/i)===a.length-2)return parseFloat(1024*a.substring(0,a.length-2));if(a.search(/mb/i)===a.length-2)return parseFloat(1048576*a.substring(0,a.length-2));if(a.search(/gb/i)===a.length-2)return parseFloat(1073741824*a.substring(0,a.length-2));if(a.search(/b/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/s/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/m/i)===a.length-1)return parseFloat(60*a.substring(0,a.length-1));if(a.search(/h/i)===a.length-1)return parseFloat(3600*a.substring(0,a.length-1))}return a},this.urlToBlob=function(c){var d=b.defer();return a({url:c,method:"get",responseType:"arraybuffer"}).then(function(a){var b=new Uint8Array(a.data),c=a.headers("content-type")||"image/WebP",e=new window.Blob([b],{type:c});d.resolve(e)},function(a){d.reject(a)}),d.promise},this.setDefaults=function(a){this.defaults=a||{}},this.defaults={},this.version=ngFileUpload.version}]),ngFileUpload.service("Upload",["$parse","$timeout","$compile","$q","UploadExif",function(a,b,c,d,e){function f(a,b,c){var e=[i.emptyPromise()];return angular.forEach(a,function(d,f){0===d.type.indexOf("image/jpeg")&&i.attrGetter("ngfFixOrientation",b,c,{$file:d})&&e.push(i.happyPromise(i.applyExifRotation(d),d).then(function(b){a.splice(f,1,b)}))}),d.all(e)}function g(a,b,c){var e=i.attrGetter("ngfResize",b,c);if(!e||!i.isResizeSupported()||!a.length)return i.emptyPromise();if(!(e instanceof Function))return h(e,a,b,c);var f=d.defer();e(a).then(function(d){h(d,a,b,c).then(function(a){f.resolve(a)},function(a){f.reject(a)})},function(a){f.reject(a)})}function h(a,b,c,e){function f(d,f){if(0===d.type.indexOf("image")){if(a.pattern&&!i.validatePattern(d,a.pattern))return;var h=i.resize(d,a.width,a.height,a.quality,a.type,a.ratio,a.centerCrop,function(a,b){return i.attrGetter("ngfResizeIf",c,e,{$width:a,$height:b,$file:d})},a.restoreExif!==!1);g.push(h),h.then(function(a){b.splice(f,1,a)},function(a){d.$error="resize",d.$errorParam=(a?(a.message?a.message:a)+": ":"")+(d&&d.name)})}}for(var g=[i.emptyPromise()],h=0;h<b.length;h++)f(b[h],h);return d.all(g)}var i=e;return i.getAttrWithDefaults=function(a,b){if(null!=a[b])return a[b];var c=i.defaults[b];return null==c?c:angular.isString(c)?c:JSON.stringify(c)},i.attrGetter=function(b,c,d,e){var f=this.getAttrWithDefaults(c,b);if(!d)return f;try{return e?a(f)(d,e):a(f)(d)}catch(g){if(b.search(/min|max|pattern/i))return f;throw g}},i.shouldUpdateOn=function(a,b,c){var d=i.attrGetter("ngModelOptions",b,c);return d&&d.updateOn?d.updateOn.split(" ").indexOf(a)>-1:!0},i.emptyPromise=function(){var a=d.defer(),c=arguments;return b(function(){a.resolve.apply(a,c)}),a.promise},i.rejectPromise=function(){var a=d.defer(),c=arguments;return b(function(){a.reject.apply(a,c)}),a.promise},i.happyPromise=function(a,c){var e=d.defer();return a.then(function(a){e.resolve(a)},function(a){b(function(){throw a}),e.resolve(c)}),e.promise},i.updateModel=function(c,d,e,h,j,k,l){function m(f,g,j,l,m){d.$$ngfPrevValidFiles=f,d.$$ngfPrevInvalidFiles=g;var n=f&&f.length?f[0]:null,o=g&&g.length?g[0]:null;c&&(i.applyModelValidation(c,f),c.$setViewValue(m?n:f)),h&&a(h)(e,{$files:f,$file:n,$newFiles:j,$duplicateFiles:l,$invalidFiles:g,$invalidFile:o,$event:k});var p=i.attrGetter("ngfModelInvalid",d);p&&b(function(){a(p).assign(e,m?o:g)}),b(function(){})}function n(){function a(a,b){return a.name===b.name&&(a.$ngfOrigSize||a.size)===(b.$ngfOrigSize||b.size)&&a.type===b.type}function b(b){var c;for(c=0;c<s.length;c++)if(a(b,s[c]))return!0;for(c=0;c<t.length;c++)if(a(b,t[c]))return!0;return!1}if(j){r=[],u=[];for(var c=0;c<j.length;c++)b(j[c])?u.push(j[c]):r.push(j[c])}}function o(a){return angular.isArray(a)?a:[a]}function p(){w=[],v=[],angular.forEach(r,function(a){a.$error?v.push(a):w.push(a)})}function q(){function a(){b(function(){m(x?s.concat(w):w,x?t.concat(v):v,j,u,y)},A&&A.debounce?A.debounce.change||A.debounce:0)}g(z?r:w,d,e).then(function(){z?i.validate(r,s.length,c,d,e).then(function(){p(),a()}):a()},function(a){throw"Could not resize files "+a})}var r,s,t,u=[],v=[],w=[];s=d.$$ngfPrevValidFiles||[],t=d.$$ngfPrevInvalidFiles||[],c&&c.$modelValue&&(s=o(c.$modelValue));var x=i.attrGetter("ngfKeep",d,e);r=(j||[]).slice(0),("distinct"===x||i.attrGetter("ngfKeepDistinct",d,e)===!0)&&n(d,e);var y=!x&&!i.attrGetter("ngfMultiple",d,e)&&!i.attrGetter("multiple",d);if(!x||r.length){i.attrGetter("ngfBeforeModelChange",d,e,{$files:j,$file:j&&j.length?j[0]:null,$newFiles:r,$duplicateFiles:u,$event:k});var z=i.attrGetter("ngfValidateAfterResize",d,e),A=i.attrGetter("ngModelOptions",d,e);i.validate(r,s.length,c,d,e).then(function(){l?m(r,[],j,u,y):(A&&A.allowInvalid||z?w=r:p(),i.attrGetter("ngfFixOrientation",d,e)&&i.isExifSupported()?f(w,d,e).then(function(){q()}):q())})}},i}]),ngFileUpload.directive("ngfSelect",["$parse","$timeout","$compile","Upload",function(a,b,c,d){function e(a){var b=a.match(/Android[^\d]*(\d+)\.(\d+)/);if(b&&b.length>2){var c=d.defaults.androidFixMinorVersion||4;return parseInt(b[1])<4||parseInt(b[1])===c&&parseInt(b[2])<c}return-1===a.indexOf("Chrome")&&/.*Windows.*Safari.*/.test(a)}function f(a,b,c,d,f,h,i,j){function k(){return"input"===b[0].tagName.toLowerCase()&&c.type&&"file"===c.type.toLowerCase()}function l(){return t("ngfChange")||t("ngfSelect")}function m(b){if(j.shouldUpdateOn("change",c,a)){for(var e=b.__files_||b.target&&b.target.files,f=[],g=0;g<e.length;g++)f.push(e[g]);j.updateModel(d,c,a,l(),f.length?f:null,b)}}function n(a){if(b!==a)for(var c=0;c<b[0].attributes.length;c++){var d=b[0].attributes[c];"type"!==d.name&&"class"!==d.name&&"style"!==d.name&&((null==d.value||""===d.value)&&("required"===d.name&&(d.value="required"),"multiple"===d.name&&(d.value="multiple")),a.attr(d.name,"id"===d.name?"ngf-"+d.value:d.value))}}function o(){if(k())return b;var a=angular.element('<input type="file">');n(a);var c=angular.element("<label>upload</label>");return c.css("visibility","hidden").css("position","absolute").css("overflow","hidden").css("width","0px").css("height","0px").css("border","none").css("margin","0px").css("padding","0px").attr("tabindex","-1"),g.push({el:b,ref:c}),document.body.appendChild(c.append(a)[0]),a}function p(c){if(b.attr("disabled"))return!1;if(!t("ngfSelectDisabled",a)){var d=q(c);if(null!=d)return d;r(c);try{k()||document.body.contains(w[0])||(g.push({el:b,ref:w.parent()}),document.body.appendChild(w.parent()[0]),w.bind("change",m))}catch(f){}return e(navigator.userAgent)?setTimeout(function(){w[0].click()},0):w[0].click(),!1}}function q(a){var b=a.changedTouches||a.originalEvent&&a.originalEvent.changedTouches;if("touchstart"===a.type)return v=b?b[0].clientY:0,!0;if(a.stopPropagation(),a.preventDefault(),"touchend"===a.type){var c=b?b[0].clientY:0;if(Math.abs(c-v)>20)return!1}}function r(b){j.shouldUpdateOn("click",c,a)&&w.val()&&(w.val(null),j.updateModel(d,c,a,l(),null,b,!0))}function s(a){if(w&&!w.attr("__ngf_ie10_Fix_")){if(!w[0].parentNode)return void(w=null);a.preventDefault(),a.stopPropagation(),w.unbind("click");var b=w.clone();return w.replaceWith(b),w=b,w.attr("__ngf_ie10_Fix_","true"),w.bind("change",m),w.bind("click",s),w[0].click(),!1}w.removeAttr("__ngf_ie10_Fix_")}var t=function(a,b){return j.attrGetter(a,c,b)};j.registerModelChangeValidator(d,c,a);var u=[];u.push(a.$watch(t("ngfMultiple"),function(){w.attr("multiple",t("ngfMultiple",a))})),u.push(a.$watch(t("ngfCapture"),function(){w.attr("capture",t("ngfCapture",a))})),u.push(a.$watch(t("ngfAccept"),function(){w.attr("accept",t("ngfAccept",a))})),c.$observe("accept",function(){w.attr("accept",t("accept"))}),u.push(function(){c.$$observers&&delete c.$$observers.accept});var v=0,w=b;k()||(w=o()),w.bind("change",m),k()?b.bind("click",r):b.bind("click touchstart touchend",p),-1!==navigator.appVersion.indexOf("MSIE 10")&&w.bind("click",s),d&&d.$formatters.push(function(a){return(null==a||0===a.length)&&w.val()&&w.val(null),a}),a.$on("$destroy",function(){k()||w.parent().remove(),angular.forEach(u,function(a){a()})}),h(function(){for(var a=0;a<g.length;a++){var b=g[a];document.body.contains(b.el[0])||(g.splice(a,1),b.ref.remove())}}),window.FileAPI&&window.FileAPI.ngfFixIE&&window.FileAPI.ngfFixIE(b,w,m)}var g=[];return{restrict:"AEC",require:"?ngModel",link:function(e,g,h,i){f(e,g,h,i,a,b,c,d)}}}]),function(){function a(a){return"img"===a.tagName.toLowerCase()?"image":"audio"===a.tagName.toLowerCase()?"audio":"video"===a.tagName.toLowerCase()?"video":/./}function b(b,c,d,e,f,g,h,i){function j(a){var g=b.attrGetter("ngfNoObjectUrl",f,d);b.dataUrl(a,g)["finally"](function(){c(function(){var b=(g?a.$ngfDataUrl:a.$ngfBlobUrl)||a.$ngfDataUrl;i?e.css("background-image","url('"+(b||"")+"')"):e.attr("src",b),b?e.removeClass("ng-hide"):e.addClass("ng-hide")})})}c(function(){var c=d.$watch(f[g],function(c){var d=h;if("ngfThumbnail"===g&&(d||(d={width:e[0].clientWidth,height:e[0].clientHeight}),0===d.width&&window.getComputedStyle)){var f=getComputedStyle(e[0]);d={width:parseInt(f.width.slice(0,-2)),height:parseInt(f.height.slice(0,-2))}}return angular.isString(c)?(e.removeClass("ng-hide"),i?e.css("background-image","url('"+c+"')"):e.attr("src",c)):void(!c||!c.type||0!==c.type.search(a(e[0]))||i&&0!==c.type.indexOf("image")?e.addClass("ng-hide"):d&&b.isResizeSupported()?b.resize(c,d.width,d.height,d.quality).then(function(a){j(a)},function(a){throw a}):j(c))});d.$on("$destroy",function(){c()})})}ngFileUpload.service("UploadDataUrl",["UploadBase","$timeout","$q",function(a,b,c){var d=a;return d.base64DataUrl=function(a){if(angular.isArray(a)){var b=c.defer(),e=0;return angular.forEach(a,function(c){d.dataUrl(c,!0)["finally"](function(){if(e++,e===a.length){var c=[];angular.forEach(a,function(a){c.push(a.$ngfDataUrl)}),b.resolve(c,a)}})}),b.promise}return d.dataUrl(a,!0)},d.dataUrl=function(a,e){if(!a)return d.emptyPromise(a,a);if(e&&null!=a.$ngfDataUrl||!e&&null!=a.$ngfBlobUrl)return d.emptyPromise(e?a.$ngfDataUrl:a.$ngfBlobUrl,a);var f=e?a.$$ngfDataUrlPromise:a.$$ngfBlobUrlPromise;if(f)return f;var g=c.defer();return b(function(){if(window.FileReader&&a&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 8")||a.size<2e4)&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 9")||a.size<4e6)){var c=window.URL||window.webkitURL;if(c&&c.createObjectURL&&!e){var f;try{f=c.createObjectURL(a)}catch(h){return void b(function(){a.$ngfBlobUrl="",g.reject()})}b(function(){if(a.$ngfBlobUrl=f,f){g.resolve(f,a),d.blobUrls=d.blobUrls||[],d.blobUrlsTotalSize=d.blobUrlsTotalSize||0,d.blobUrls.push({url:f,size:a.size}),d.blobUrlsTotalSize+=a.size||0;for(var b=d.defaults.blobUrlsMaxMemory||268435456,e=d.defaults.blobUrlsMaxQueueSize||200;(d.blobUrlsTotalSize>b||d.blobUrls.length>e)&&d.blobUrls.length>1;){var h=d.blobUrls.splice(0,1)[0];c.revokeObjectURL(h.url),d.blobUrlsTotalSize-=h.size}}})}else{var i=new FileReader;i.onload=function(c){b(function(){a.$ngfDataUrl=c.target.result,g.resolve(c.target.result,a),b(function(){delete a.$ngfDataUrl},1e3)})},i.onerror=function(){b(function(){a.$ngfDataUrl="",g.reject()})},i.readAsDataURL(a)}}else b(function(){a[e?"$ngfDataUrl":"$ngfBlobUrl"]="",g.reject()})}),f=e?a.$$ngfDataUrlPromise=g.promise:a.$$ngfBlobUrlPromise=g.promise,f["finally"](function(){delete a[e?"$$ngfDataUrlPromise":"$$ngfBlobUrlPromise"]}),f},d}]),ngFileUpload.directive("ngfSrc",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfSrc",a.attrGetter("ngfResize",f,d),!1)}}}]),ngFileUpload.directive("ngfBackground",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfBackground",a.attrGetter("ngfResize",f,d),!0)}}}]),ngFileUpload.directive("ngfThumbnail",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){var g=a.attrGetter("ngfSize",f,d);b(a,c,d,e,f,"ngfThumbnail",g,a.attrGetter("ngfAsBackground",f,d))}}}]),ngFileUpload.config(["$compileProvider",function(a){a.imgSrcSanitizationWhitelist&&a.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|local|file|data|blob):/),a.aHrefSanitizationWhitelist&&a.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|local|file|data|blob):/)}]),ngFileUpload.filter("ngfDataUrl",["UploadDataUrl","$sce",function(a,b){return function(c,d,e){if(angular.isString(c))return b.trustAsResourceUrl(c);var f=c&&((d?c.$ngfDataUrl:c.$ngfBlobUrl)||c.$ngfDataUrl);return c&&!f?(!c.$ngfDataUrlFilterInProgress&&angular.isObject(c)&&(c.$ngfDataUrlFilterInProgress=!0,a.dataUrl(c,d)),""):(c&&delete c.$ngfDataUrlFilterInProgress,(c&&f?e?b.trustAsResourceUrl(f):f:c)||"")}}])}(),ngFileUpload.service("UploadValidate",["UploadDataUrl","$q","$timeout",function(a,b,c){function d(a){var b="",c=[];if(a.length>2&&"/"===a[0]&&"/"===a[a.length-1])b=a.substring(1,a.length-1);else{var e=a.split(",");if(e.length>1)for(var f=0;f<e.length;f++){var g=d(e[f]);g.regexp?(b+="("+g.regexp+")",f<e.length-1&&(b+="|")):c=c.concat(g.excludes)}else 0===a.indexOf("!")?c.push("^((?!"+d(a.substring(1)).regexp+").)*$"):(0===a.indexOf(".")&&(a="*"+a),b="^"+a.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]","g"),"\\$&")+"$",b=b.replace(/\\\*/g,".*").replace(/\\\?/g,"."))}return{regexp:b,excludes:c}}function e(a,b){null==b||a.$dirty||(a.$setDirty?a.$setDirty():a.$dirty=!0)}var f=a;return f.validatePattern=function(a,b){if(!b)return!0;var c=d(b),e=!0;if(c.regexp&&c.regexp.length){var f=new RegExp(c.regexp,"i");e=null!=a.type&&f.test(a.type)||null!=a.name&&f.test(a.name)}for(var g=c.excludes.length;g--;){var h=new RegExp(c.excludes[g],"i");e=e&&(null==a.type||h.test(a.type))&&(null==a.name||h.test(a.name))}return e},f.ratioToFloat=function(a){var b=a.toString(),c=b.search(/[x:]/i);return b=c>-1?parseFloat(b.substring(0,c))/parseFloat(b.substring(c+1)):parseFloat(b)},f.registerModelChangeValidator=function(a,b,c){a&&a.$formatters.push(function(d){a.$dirty&&(d&&!angular.isArray(d)&&(d=[d]),f.validate(d,0,a,b,c).then(function(){f.applyModelValidation(a,d)}))})},f.applyModelValidation=function(a,b){e(a,b),angular.forEach(a.$ngfValidations,function(b){a.$setValidity(b.name,b.valid)})},f.getValidationAttr=function(a,b,c,d,e){var g="ngf"+c[0].toUpperCase()+c.substr(1),h=f.attrGetter(g,a,b,{$file:e});if(null==h&&(h=f.attrGetter("ngfValidate",a,b,{$file:e}))){var i=(d||c).split(".");h=h[i[0]],i.length>1&&(h=h&&h[i[1]])}return h},f.validate=function(a,c,d,e,g){function h(b,c,h){if(a){for(var i=a.length,j=null;i--;){var k=a[i];if(k){var l=f.getValidationAttr(e,g,b,c,k);null!=l&&(h(k,l,i)||(k.$error=b,(k.$errorMessages=k.$errorMessages||{})[b]=!0,k.$errorParam=l,a.splice(i,1),j=!1))}}null!==j&&d.$ngfValidations.push({name:b,valid:j})}}function i(c,h,i,k,l){function m(a,b,d){null!=d?k(b,d).then(function(e){l(e,d)?a.resolve():(b.$error=c,(b.$errorMessages=b.$errorMessages||{})[c]=!0,b.$errorParam=d,a.reject())},function(){j("ngfValidateForce",{$file:b})?(b.$error=c,(b.$errorMessages=b.$errorMessages||{})[c]=!0,b.$errorParam=d,a.reject()):a.resolve()}):a.resolve()}var n=[f.emptyPromise()];return a?(a=void 0===a.length?[a]:a,angular.forEach(a,function(a){var d=b.defer();return n.push(d.promise),!i||null!=a.type&&0===a.type.search(i)?void("dimensions"===c&&null!=f.attrGetter("ngfDimensions",e)?f.imageDimensions(a).then(function(b){m(d,a,j("ngfDimensions",{$file:a,$width:b.width,$height:b.height}))},function(){d.reject()}):"duration"===c&&null!=f.attrGetter("ngfDuration",e)?f.mediaDuration(a).then(function(b){m(d,a,j("ngfDuration",{$file:a,$duration:b}))},function(){d.reject()}):m(d,a,f.getValidationAttr(e,g,c,h,a))):void d.resolve()}),b.all(n).then(function(){d.$ngfValidations.push({name:c,valid:!0})},function(){d.$ngfValidations.push({name:c,valid:!1})})):void 0}d=d||{},d.$ngfValidations=d.$ngfValidations||[],angular.forEach(d.$ngfValidations,function(a){a.valid=!0});var j=function(a,b){return f.attrGetter(a,e,g,b)};if(null==a||0===a.length)return f.emptyPromise(d);a=void 0===a.length?[a]:a.slice(0),h("maxFiles",null,function(a,b,d){return b>c+d}),h("pattern",null,f.validatePattern),h("minSize","size.min",function(a,b){return a.size+.1>=f.translateScalars(b)}),h("maxSize","size.max",function(a,b){return a.size-.1<=f.translateScalars(b)});var k=0;if(h("maxTotalSize",null,function(b,c){return k+=b.size,k>f.translateScalars(c)?(a.splice(0,a.length),!1):!0}),h("validateFn",null,function(a,b){return b===!0||null===b||""===b}),!a.length)return f.emptyPromise(d,d.$ngfValidations);var l=b.defer(),m=[];return m.push(f.happyPromise(i("maxHeight","height.max",/image/,this.imageDimensions,function(a,b){return a.height<=b}))),m.push(f.happyPromise(i("minHeight","height.min",/image/,this.imageDimensions,function(a,b){return a.height>=b}))),m.push(f.happyPromise(i("maxWidth","width.max",/image/,this.imageDimensions,function(a,b){return a.width<=b}))),m.push(f.happyPromise(i("minWidth","width.min",/image/,this.imageDimensions,function(a,b){return a.width>=b}))),m.push(f.happyPromise(i("dimensions",null,/image/,function(a,b){return f.emptyPromise(b)},function(a){return a}))),m.push(f.happyPromise(i("ratio",null,/image/,this.imageDimensions,function(a,b){for(var c=b.toString().split(","),d=!1,e=0;e<c.length;e++)Math.abs(a.width/a.height-f.ratioToFloat(c[e]))<1e-4&&(d=!0);return d}))),m.push(f.happyPromise(i("maxRatio","ratio.max",/image/,this.imageDimensions,function(a,b){return a.width/a.height-f.ratioToFloat(b)<1e-4}))),m.push(f.happyPromise(i("minRatio","ratio.min",/image/,this.imageDimensions,function(a,b){return a.width/a.height-f.ratioToFloat(b)>-1e-4}))),m.push(f.happyPromise(i("maxDuration","duration.max",/audio|video/,this.mediaDuration,function(a,b){return a<=f.translateScalars(b)}))),m.push(f.happyPromise(i("minDuration","duration.min",/audio|video/,this.mediaDuration,function(a,b){return a>=f.translateScalars(b)}))),m.push(f.happyPromise(i("duration",null,/audio|video/,function(a,b){return f.emptyPromise(b)},function(a){return a}))),m.push(f.happyPromise(i("validateAsyncFn",null,null,function(a,b){return b},function(a){return a===!0||null===a||""===a}))),b.all(m).then(function(){l.resolve(d,d.$ngfValidations)})},f.imageDimensions=function(a){if(a.$ngfWidth&&a.$ngfHeight){var d=b.defer();return c(function(){d.resolve({width:a.$ngfWidth,height:a.$ngfHeight})}),d.promise}if(a.$ngfDimensionPromise)return a.$ngfDimensionPromise;var e=b.defer();return c(function(){return 0!==a.type.indexOf("image")?void e.reject("not image"):void f.dataUrl(a).then(function(b){function d(){var b=h[0].clientWidth,c=h[0].clientHeight;h.remove(),a.$ngfWidth=b,a.$ngfHeight=c,e.resolve({width:b,height:c})}function f(){h.remove(),e.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].clientWidth?d():i>10?f():g())},1e3)}var h=angular.element("<img>").attr("src",b).css("visibility","hidden").css("position","fixed").css("max-width","none !important").css("max-height","none !important");h.on("load",d),h.on("error",f);var i=0;g(),angular.element(document.getElementsByTagName("body")[0]).append(h)},function(){e.reject("load error")})}),a.$ngfDimensionPromise=e.promise,a.$ngfDimensionPromise["finally"](function(){delete a.$ngfDimensionPromise}),a.$ngfDimensionPromise},f.mediaDuration=function(a){if(a.$ngfDuration){var d=b.defer();return c(function(){d.resolve(a.$ngfDuration)}),d.promise}if(a.$ngfDurationPromise)return a.$ngfDurationPromise;var e=b.defer();return c(function(){return 0!==a.type.indexOf("audio")&&0!==a.type.indexOf("video")?void e.reject("not media"):void f.dataUrl(a).then(function(b){function d(){var b=h[0].duration;a.$ngfDuration=b,h.remove(),e.resolve(b)}function f(){h.remove(),e.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].duration?d():i>10?f():g())},1e3)}var h=angular.element(0===a.type.indexOf("audio")?"<audio>":"<video>").attr("src",b).css("visibility","none").css("position","fixed");h.on("loadedmetadata",d),h.on("error",f);var i=0;g(),angular.element(document.body).append(h)},function(){e.reject("load error")})}),a.$ngfDurationPromise=e.promise,a.$ngfDurationPromise["finally"](function(){delete a.$ngfDurationPromise}),a.$ngfDurationPromise},f}]),ngFileUpload.service("UploadResize",["UploadValidate","$q",function(a,b){var c=a,d=function(a,b,c,d,e){var f=e?Math.max(c/a,d/b):Math.min(c/a,d/b);return{width:a*f,height:b*f,marginX:a*f-c,marginY:b*f-d}},e=function(a,e,f,g,h,i,j,k){var l=b.defer(),m=document.createElement("canvas"),n=document.createElement("img");return n.onload=function(){if(null!=k&&k(n.width,n.height)===!1)return void l.reject("resizeIf");try{if(i){var a=c.ratioToFloat(i),b=n.width/n.height;a>b?(e=n.width,f=e/a):(f=n.height,e=f*a)}e||(e=n.width),f||(f=n.height);var o=d(n.width,n.height,e,f,j);m.width=Math.min(o.width,e),m.height=Math.min(o.height,f);var p=m.getContext("2d");p.drawImage(n,Math.min(0,-o.marginX/2),Math.min(0,-o.marginY/2),o.width,o.height),l.resolve(m.toDataURL(h||"image/WebP",g||.934))}catch(q){l.reject(q)}},n.onerror=function(){l.reject()},n.src=a,l.promise};return c.dataUrltoBlob=function(a,b,c){for(var d=a.split(","),e=d[0].match(/:(.*?);/)[1],f=atob(d[1]),g=f.length,h=new Uint8Array(g);g--;)h[g]=f.charCodeAt(g);var i=new window.Blob([h],{type:e});return i.name=b,i.$ngfOrigSize=c,i},c.isResizeSupported=function(){var a=document.createElement("canvas");return window.atob&&a.getContext&&a.getContext("2d")&&window.Blob},c.isResizeSupported()&&Object.defineProperty(window.Blob.prototype,"name",{get:function(){return this.$ngfName},set:function(a){this.$ngfName=a},configurable:!0}),c.resize=function(a,d,f,g,h,i,j,k,l){if(0!==a.type.indexOf("image"))return c.emptyPromise(a);var m=b.defer();return c.dataUrl(a,!0).then(function(b){e(b,d,f,g,h||a.type,i,j,k).then(function(d){if("image/jpeg"===a.type&&l)try{d=c.restoreExif(b,d)}catch(e){setTimeout(function(){throw e},1)}try{var f=c.dataUrltoBlob(d,a.name,a.size);m.resolve(f)}catch(e){m.reject(e)}},function(b){"resizeIf"===b&&m.resolve(a),m.reject(b)})},function(a){m.reject(a)}),m.promise},c}]),function(){function a(a,c,d,e,f,g,h,i,j,k){function l(){return c.attr("disabled")||r("ngfDropDisabled",a)}function m(b,c){i.updateModel(e,d,a,r("ngfChange")||r("ngfDrop"),b,c)}function n(b,c){if(!i.shouldUpdateOn(b,d,a)||!c)return i.rejectPromise([]);var e=[];c.replace(/<(img src|img [^>]* src) *=\"([^\"]*)\"/gi,function(a,b,c){e.push(c)});var f=[],g=[];if(e.length){angular.forEach(e,function(a){f.push(i.urlToBlob(a).then(function(a){g.push(a)}))});var h=k.defer();return k.all(f).then(function(){h.resolve(g)},function(a){h.reject(a)}),h.promise}return i.emptyPromise()}function o(a,b,c,d){var e=r("ngfDragOverClass",a,{$event:c}),f="dragover";if(angular.isString(e))f=e;else if(e&&(e.delay&&(v=e.delay),e.accept||e.reject)){var g=c.dataTransfer.items;if(null!=g&&g.length)for(var h=e.pattern||r("ngfPattern",a,{$event:c}),j=g.length;j--;){if(!i.validatePattern(g[j],h)){f=e.reject;break}f=e.accept}else f=e.accept}d(f)}function p(b,c,e,f){function g(a,b){var c=k.defer();if(null!=a)if(a.isDirectory){var d=[i.emptyPromise()];if(m){var e={type:"directory"};e.name=e.path=(b||"")+a.name+a.name,n.push(e)}var f=a.createReader(),h=[],p=function(){f.readEntries(function(e){try{e.length?(h=h.concat(Array.prototype.slice.call(e||[],0)),p()):(angular.forEach(h.slice(0),function(c){n.length<=j&&l>=o&&d.push(g(c,(b?b:"")+a.name+"/"))}),k.all(d).then(function(){c.resolve()},function(a){c.reject(a)}))}catch(f){c.reject(f)}},function(a){c.reject(a)})};p()}else a.file(function(a){try{a.path=(b?b:"")+a.name,m&&(a=i.rename(a,a.path)),n.push(a),o+=a.size,c.resolve()}catch(d){c.reject(d)}},function(a){c.reject(a)});return c.promise}var j=i.getValidationAttr(d,a,"maxFiles")||Number.MAX_VALUE,l=i.getValidationAttr(d,a,"maxTotalSize")||Number.MAX_VALUE,m=r("ngfIncludeDir",a),n=[],o=0,p=[i.emptyPromise()];if(b&&b.length>0&&"file"!==h.protocol())for(var q=0;q<b.length;q++){if(b[q].webkitGetAsEntry&&b[q].webkitGetAsEntry()&&b[q].webkitGetAsEntry().isDirectory){var s=b[q].webkitGetAsEntry();if(s.isDirectory&&!e)continue;null!=s&&p.push(g(s))}else{var t=b[q].getAsFile();null!=t&&(n.push(t),o+=t.size)}if(n.length>j||o>l||!f&&n.length>0)break}else if(null!=c)for(var u=0;u<c.length;u++){var v=c.item(u);if((v.type||v.size>0)&&(n.push(v),o+=v.size),n.length>j||o>l||!f&&n.length>0)break}var w=k.defer();return k.all(p).then(function(){if(f||m||!n.length)w.resolve(n);else{for(var a=0;n[a]&&"directory"===n[a].type;)a++;w.resolve([n[a]])}},function(a){w.reject(a)}),w.promise}var q=b(),r=function(a,b,c){return i.attrGetter(a,d,b,c)};if(r("dropAvailable")&&g(function(){a[r("dropAvailable")]?a[r("dropAvailable")].value=q:a[r("dropAvailable")]=q}),!q)return void(r("ngfHideOnDropNotAvailable",a)===!0&&c.css("display","none"));null==r("ngfSelect")&&i.registerModelChangeValidator(e,d,a);var s,t=null,u=f(r("ngfStopPropagation")),v=1;c[0].addEventListener("dragover",function(b){if(!l()&&i.shouldUpdateOn("drop",d,a)){if(b.preventDefault(),u(a)&&b.stopPropagation(),navigator.userAgent.indexOf("Chrome")>-1){var e=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"===e||"linkMove"===e?"move":"copy"}g.cancel(t),s||(s="C",o(a,d,b,function(d){s=d,c.addClass(s),r("ngfDrag",a,{$isDragging:!0,$class:s,$event:b})}))}},!1),c[0].addEventListener("dragenter",function(b){!l()&&i.shouldUpdateOn("drop",d,a)&&(b.preventDefault(),u(a)&&b.stopPropagation())},!1),c[0].addEventListener("dragleave",function(b){!l()&&i.shouldUpdateOn("drop",d,a)&&(b.preventDefault(),u(a)&&b.stopPropagation(),t=g(function(){s&&c.removeClass(s),s=null,r("ngfDrag",a,{$isDragging:!1,$event:b})},v||100))},!1),c[0].addEventListener("drop",function(b){if(!l()&&i.shouldUpdateOn("drop",d,a)){b.preventDefault(),u(a)&&b.stopPropagation(),s&&c.removeClass(s),s=null;var e,f=b.dataTransfer.items;try{e=b.dataTransfer&&b.dataTransfer.getData&&b.dataTransfer.getData("text/html")}catch(g){}p(f,b.dataTransfer.files,r("ngfAllowDir",a)!==!1,r("multiple")||r("ngfMultiple",a)).then(function(a){a.length?m(a,b):n("dropUrl",e).then(function(a){m(a,b)})})}},!1),c[0].addEventListener("paste",function(b){if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&r("ngfEnableFirefoxPaste",a)&&b.preventDefault(),!l()&&i.shouldUpdateOn("paste",d,a)){var c=[],e=b.clipboardData||b.originalEvent.clipboardData;if(e&&e.items)for(var f=0;f<e.items.length;f++)-1!==e.items[f].type.indexOf("image")&&c.push(e.items[f].getAsFile());c.length?m(c,b):n("pasteUrl",e).then(function(a){m(a,b)})}},!1),navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&r("ngfEnableFirefoxPaste",a)&&(c.attr("contenteditable",!0),c.on("keypress",function(a){a.metaKey||a.ctrlKey||a.preventDefault()}))}function b(){var a=document.createElement("div");return"draggable"in a&&"ondrop"in a&&!/Edge\/12./i.test(navigator.userAgent)}ngFileUpload.directive("ngfDrop",["$parse","$timeout","$location","Upload","$http","$q",function(b,c,d,e,f,g){
return{restrict:"AEC",require:"?ngModel",link:function(h,i,j,k){a(h,i,j,k,b,c,d,e,f,g)}}}]),ngFileUpload.directive("ngfNoFileDrop",function(){return function(a,c){b()&&c.css("display","none")}}),ngFileUpload.directive("ngfDropAvailable",["$parse","$timeout","Upload",function(a,c,d){return function(e,f,g){if(b()){var h=a(d.attrGetter("ngfDropAvailable",g));c(function(){h(e),h.assign&&h.assign(e,!0)})}}}])}(),ngFileUpload.service("UploadExif",["UploadResize","$q",function(a,b){function c(a,b,c,d){switch(b){case 2:return a.transform(-1,0,0,1,c,0);case 3:return a.transform(-1,0,0,-1,c,d);case 4:return a.transform(1,0,0,-1,0,d);case 5:return a.transform(0,1,1,0,0,0);case 6:return a.transform(0,1,-1,0,d,0);case 7:return a.transform(0,-1,-1,0,d,c);case 8:return a.transform(0,-1,1,0,0,c)}}function d(a){for(var b="",c=new Uint8Array(a),d=c.byteLength,e=0;d>e;e++)b+=String.fromCharCode(c[e]);return window.btoa(b)}var e=a;return e.isExifSupported=function(){return window.FileReader&&(new FileReader).readAsArrayBuffer&&e.isResizeSupported()},e.readOrientation=function(a){var c=b.defer(),d=new FileReader,e=a.slice?a.slice(0,65536):a;return d.readAsArrayBuffer(e),d.onerror=function(a){return c.reject(a)},d.onload=function(a){var b={orientation:1},d=new DataView(this.result);if(65496!==d.getUint16(0,!1))return c.resolve(b);for(var e=d.byteLength,f=2;e>f;){var g=d.getUint16(f,!1);if(f+=2,65505===g){if(1165519206!==d.getUint32(f+=2,!1))return c.resolve(b);var h=18761===d.getUint16(f+=6,!1);f+=d.getUint32(f+4,h);var i=d.getUint16(f,h);f+=2;for(var j=0;i>j;j++)if(274===d.getUint16(f+12*j,h)){var k=d.getUint16(f+12*j+8,h);return k>=2&&8>=k&&(d.setUint16(f+12*j+8,1,h),b.fixedArrayBuffer=a.target.result),b.orientation=k,c.resolve(b)}}else{if(65280!==(65280&g))break;f+=d.getUint16(f,!1)}}return c.resolve(b)},c.promise},e.applyExifRotation=function(a){if(0!==a.type.indexOf("image/jpeg"))return e.emptyPromise(a);var f=b.defer();return e.readOrientation(a).then(function(b){return b.orientation<2||b.orientation>8?f.resolve(a):void e.dataUrl(a,!0).then(function(g){var h=document.createElement("canvas"),i=document.createElement("img");i.onload=function(){try{h.width=b.orientation>4?i.height:i.width,h.height=b.orientation>4?i.width:i.height;var g=h.getContext("2d");c(g,b.orientation,i.width,i.height),g.drawImage(i,0,0);var j=h.toDataURL(a.type||"image/WebP",.934);j=e.restoreExif(d(b.fixedArrayBuffer),j);var k=e.dataUrltoBlob(j,a.name);f.resolve(k)}catch(l){return f.reject(l)}},i.onerror=function(){f.reject()},i.src=g},function(a){f.reject(a)})},function(a){f.reject(a)}),f.promise},e.restoreExif=function(a,b){var c={};return c.KEY_STR="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c.encode64=function(a){var b,c,d,e,f,g="",h="",i="",j=0;do b=a[j++],c=a[j++],h=a[j++],d=b>>2,e=(3&b)<<4|c>>4,f=(15&c)<<2|h>>6,i=63&h,isNaN(c)?f=i=64:isNaN(h)&&(i=64),g=g+this.KEY_STR.charAt(d)+this.KEY_STR.charAt(e)+this.KEY_STR.charAt(f)+this.KEY_STR.charAt(i),b=c=h="",d=e=f=i="";while(j<a.length);return g},c.restore=function(a,b){a.match("data:image/jpeg;base64,")&&(a=a.replace("data:image/jpeg;base64,",""));var c=this.decode64(a),d=this.slice2Segments(c),e=this.exifManipulation(b,d);return"data:image/jpeg;base64,"+this.encode64(e)},c.exifManipulation=function(a,b){var c=this.getExifArray(b),d=this.insertExif(a,c);return new Uint8Array(d)},c.getExifArray=function(a){for(var b,c=0;c<a.length;c++)if(b=a[c],255===b[0]&225===b[1])return b;return[]},c.insertExif=function(a,b){var c=a.replace("data:image/jpeg;base64,",""),d=this.decode64(c),e=d.indexOf(255,3),f=d.slice(0,e),g=d.slice(e),h=f;return h=h.concat(b),h=h.concat(g)},c.slice2Segments=function(a){for(var b=0,c=[];;){if(255===a[b]&218===a[b+1])break;if(255===a[b]&216===a[b+1])b+=2;else{var d=256*a[b+2]+a[b+3],e=b+d+2,f=a.slice(b,e);c.push(f),b=e}if(b>a.length)break}return c},c.decode64=function(a){var b,c,d,e,f,g="",h="",i=0,j=[],k=/[^A-Za-z0-9\+\/\=]/g;k.exec(a)&&console.log("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, NaNExpect errors in decoding."),a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");do d=this.KEY_STR.indexOf(a.charAt(i++)),e=this.KEY_STR.indexOf(a.charAt(i++)),f=this.KEY_STR.indexOf(a.charAt(i++)),h=this.KEY_STR.indexOf(a.charAt(i++)),b=d<<2|e>>4,c=(15&e)<<4|f>>2,g=(3&f)<<6|h,j.push(b),64!==f&&j.push(c),64!==h&&j.push(g),b=c=g="",d=e=f=h="";while(i<a.length);return j},c.restore(a,b)},e}]);
/**
 * object-table - angular smart table directive
 * @version v
 * @author Yauheni Kokatau
 * @license MIT
 */
"use strict";angular.module("objectTable",[]).directive("contenteditable",function(){return{restrict:"A",require:["ngModel","^objectTable"],link:function(e,t,r,n){var a=n[0],o=n[1];a.$render=function(){t.html(a.$viewValue||"")},t.bind("change blur",function(){var r=a.$viewValue.toString(),n=t.text();r!==n&&(e.$apply(function(){a.$setViewValue(n)}),o.onEdit&&"function"==typeof o.onEdit&&o.onEdit({$oldValue:r,$newValue:n}))})}}}),angular.module("objectTable").directive("objectTable",["$compile","$interpolate",function(e,t){return{restrict:"A",replace:!0,templateUrl:"/src/templates/common.html",controller:"objectTableCtrl",controllerAs:"ctrl",transclude:!0,scope:{data:"=",display:"=?",resize:"=?",paging:"=?",fromUrl:"@",sortingType:"@?sorting",editable:"&?",onEdit:"&?",select:"@?",selectedModel:"=?",dragColumns:"=?",addBtn:"="},compile:function(e,t){var r="",n="";return t.addFilter&&(r+=t.addFilter),"false"!==t.sorting&&(r+="| orderBy:sortingArray"),t.dragColumns&&e.find("th").attr("allow-drag",""),"separate"===t.search?t.fields.split(",").forEach(function(e,t){r+="| filter:{'"+e.trim()+"':columnSearch['"+e+"']}"}):"undefined"!=typeof t.search&&"true"!==t.search||(r+="| filter:globalSearch"),n+=" | offset: currentPage:display |limitTo: display",e[0].querySelector("#rowTr").setAttribute("ng-repeat","item in $parent.$filtered = (data"+r+")"+n),e.find("paging").attr("count","$filtered.length"),function(e,t,a,o,i){e.addBtn?(e.addBtnShow=!0,e.addClick=function(){e.addBtn()}):e.addBtnShow=!1,o._init(),i(e,function(t,a){e.$owner=a.$parent;for(var i in t)if(t.hasOwnProperty(i))switch(t[i].tagName){case"THEAD":o._addHeaderPattern(t[i]);break;case"TBODY":e.findBody=!0,o._addRowPattern(t[i],r,n);break;case"TFOOT":o._addFooterPattern(t[i])}})}}}}]),angular.module("objectTable").directive("allowDrag",function(){return{restrict:"A",controller:function(){},compile:function(e,t){function r(e,t){var r=e[0].parentNode.querySelector("."+t);r&&r.classList.remove(t)}return function(e,t,n,a){t.attr("draggable",!0),t.bind("dragstart",function(e){a.target=this,this.classList.add("dragged");var t=e.originalEvent||e;t.dataTransfer.setData("text",a.target.cellIndex)}),t.bind("dragover",function(e){e.preventDefault()}),t.bind("dragenter",function(e){a.toTarget=this,this.classList.contains("draggedOver")||this.classList.contains("dragged")||this.classList.add("draggedOver"),e.preventDefault(),e.stopPropagation()}),t.bind("dragend",function(e){this.classList.contains("dragged")&&this.classList.remove("dragged"),e.preventDefault()}),t.bind("dragleave",function(e){this.classList.remove("draggedOver")}),t.bind("drop",function(e){var n=a.toTarget.cellIndex,o=e.originalEvent||e,i=parseInt(o.dataTransfer.getData("text"),10);r(t,"dragged"),r(t,"draggedOver"),t.parent().controller("objectTable").changeColumnsOrder(n,i),e.preventDefault()})}}}}),angular.module("objectTable").controller("objectTableCtrl",["$scope","$timeout","$element","$attrs","$http","$compile","$controller","objectTableUtilService",function(e,t,r,n,a,o,i,l){i("objectTableSortingCtrl",{$scope:e});var s=this;this._init=function(){e.headers=[],e.fields=[],e.display=e.display||5,e.paging=angular.isDefined(e.paging)?e.paging:!0,e.sortingType=e.sortingType||"simple",e.currentPage=0,e.customHeader=!1,"separate"==n.search?(e.search="separate",e.columnSearch=[]):e.search="undefined"==typeof n.search||"true"===n.search,e.headers=l.getArrayFromParams(n.headers,"headers"),e.fields=l.getArrayFromParams(n.fields,"fields"),n.fromUrl&&this._loadExternalData(n.fromUrl),e.onEdit&&(this.onEdit=e.onEdit),e.selectedModel="multiply"===e.select?[]:{}},this.onEdit=e.onEdit,this._loadExternalData=function(t){e.dataIsLoading=!0,a.get(t).then(function(t){e.data=t.data,e.dataIsLoading=!1})},this._addHeaderPattern=function(t){e.customHeader=!0,Array.prototype.forEach.call(t.querySelectorAll("[allow-drag]"),function(e,t){e.setAttribute("index",t)}),t.removeAttribute("ng-non-bindable"),r.find("table").prepend(t)},this._addFooterPattern=function(e){r.find("table").prepend(e)},this._addRowPattern=function(t,n,a){this._checkEditableContent(t),this._addRepeatToRow(t,n,a),t.removeAttribute("ng-non-bindable"),r.find("table").append(t.outerHTML),this.bodyTemplate=t.innerHTML,o(r.find("tbody"))(e)},this._addRepeatToRow=function(e,t,r){var n=angular.element(e).find("tr");n.attr("ng-repeat","item in $filtered = (data"+t+")"+r),n.attr("ng-click")||n.attr("ng-click","setSelected(item)"),n.attr("ng-class","{'selected-row':ifSelected(item)}")},this._checkEditableContent=function(e){var t,r=/\{\{:*:*(.*?)\}\}/g;Array.prototype.forEach.call(e.querySelectorAll("[editable]"),function(e){t=e.innerHTML.replace(r,"$1"),e.innerHTML="<div contentEditable ng-model='"+t+"'>{{"+t+"}}</div>"})},this.setCurrentPage=function(t){e.currentPage=t},e.setSelected=function(t){"multiply"===e.select?s._containsInSelectArray(t)?e.selectedModel.splice(e.selectedModel.indexOf(t),1):e.selectedModel.push(t):e.selectedModel=t},this._containsInSelectArray=function(t){return e.selectedModel.length?e.selectedModel.filter(function(e){return angular.equals(e,t)}).length>0:void 0},e.ifSelected=function(t){return e.selectedModel&&"multiply"===e.select?s._containsInSelectArray(t):t.$$hashKey==e.selectedModel.$$hashKey},this.changeColumnsOrder=function(t,n){e.$apply(function(){if(e.fields.swap(t,n),e.headers.swap(t,n),e.columnSearch&&e.columnSearch.swap(t,n),s.bodyTemplate){var a=angular.element(s.bodyTemplate).children(),i=document.createElement("tr"),l=document.createElement("tbody"),d=r.find("tbody").find("tr")[0].attributes;Array.prototype.swap.apply(a,[t,n]),[].forEach.call(d,function(e,t){i.setAttribute(e.name,e.value)});for(var c=0,u=a.length;u>c;c++)i.appendChild(a[c]);l.appendChild(i),r.find("tbody").replaceWith(l),s.bodyTemplate=l.innerHTML,o(r.find("tbody"))(e)}if(e.customHeader){var g=r.find("th"),i=document.createElement("tr"),p=document.createElement("thead");Array.prototype.swap.apply(g,[t,n]);for(var c=0,u=g.length;u>c;c++)i.appendChild(g[c]);p.appendChild(i),r.find("thead").replaceWith(p)}s.pageCtrl&&s.pageCtrl.setPage(0)})},e.setCurrentPageForPageCtrl=function(e){s.pageCtrl&&s.pageCtrl.setPage(e)}}]),angular.module("objectTable").filter("offset",function(){return function(e,t,r){if(e){t=parseInt(t,10),r=parseInt(r,10);var n=t*r;return e.slice(n,n+r)}}}),angular.module("objectTable").controller("pagingTableCtrl",["$scope","$element","$attrs",function(e,t,r){e.currentPage=0,e.prevPage=function(){e.currentPage>0&&e.currentPage--,e.setCurrentPageToTable()},e.nextPage=function(){e.currentPage<e.pageCount()&&e.currentPage++,e.setCurrentPageToTable()},e.setCurrentPageToTable=function(){e.objectTableCtrl.setCurrentPage(e.currentPage)},e.prevPageDisabled=function(){return 0===e.currentPage?"disabled":""},e.pageCount=function(){return e.count>0?Math.ceil(e.count/e.display)-1:0},e.nextPageDisabled=function(){return e.currentPage===e.pageCount()?"disabled":""},e.setPage=function(t){e.currentPage=t,e.setCurrentPageToTable()},e.range=function(){var t=e.pageCount()+1<5?e.pageCount()+1:5,r=[],n=e.currentPage;n>e.pageCount()-t&&(n=e.pageCount()-t+1);for(var a=n;n+t>a;a++)r.push(a);return r}}]),angular.module("objectTable").controller("objectTableSortingCtrl",["$scope",function(e){function t(e){o&&(r.width=a+(e.pageX-n))}e.sort={fields:[],reverse:[]},e.sortingArray=[],e.sortBy=function(t){if(i)return void(i=!1);if(e.data.length){var r=e.headers[e.fields.indexOf(t)];"compound"==e.sortingType?-1==e.sort.fields.indexOf(r)?(e.sort.fields.push(r),e.sortingArray.push(t),e.sort.reverse.push(!1)):e.changeReversing(t,e.sort.fields.indexOf(r)):"simple"==e.sortingType&&(e.sort.fields=[r],e.changeReversing(t))}},e.changeReversing=function(t,r){"compound"==e.sortingType?(e.sort.reverse[r]=!e.sort.reverse[r],e.sortingArray[r]=e.sort.reverse[r]?"-"+t:t):"simple"==e.sortingType&&(e.sort.reverse[0]=!e.sort.reverse[0],e.sortingArray=e.sort.reverse[0]?[t]:["-"+t])},e.headerIsSortedClass=function(t){if(e.sortingArray.length)if("simple"==e.sortingType){if(t==e.sort.fields[0]||"-"+t==e.sort.fields[0])return e.sort.reverse[0]?"table-sort-down":"table-sort-up"}else if("compound"==e.sortingType){var r=e.sort.fields.indexOf(t);if(-1!=r)return e.sort.reverse[r]?"table-sort-down":"table-sort-up"}},e.removeSorting=function(){var t=e.sort.fields.indexOf(this.sortField);t>-1&&(e.sort.fields.splice(t,1),e.sort.reverse.splice(t,1),e.sortingArray.splice(t,1)),t=null};var r,n,a,o=!1,i=!1;e.resizeStart=function(e){var i=e.target?e.target:e.srcElement;i.classList.contains("resize")&&(r=i.parentNode,o=!0,n=e.pageX,a=i.parentNode.offsetWidth,document.addEventListener("mousemove",t),e.stopPropagation(),e.preventDefault())},e.resizeEnd=function(e){o&&(document.removeEventListener("mousemove",t),e.stopPropagation(),e.preventDefault(),o=!1,i=!0)}}]),angular.module("objectTable").service("objectTableUtilService",[function(){return Array.prototype.swap=function(e,t){if(e>=this.length)for(var r=e-this.length;r--+1;)this.push(void 0);return this.splice(e,0,this.splice(t,1)[0]),this},{getArrayFromParams:function(e,t){if(!e)throw"Required '"+t+"' attribute is not found!";for(var r=[],n=e.split(","),a=0,o=n.length;o>a;a++)r.push(n[a].trim());return r}}}]),angular.module("objectTable").directive("paging",["$compile","$interpolate",function(e,t){return{restrict:"E",replace:!0,templateUrl:"/src/templates/paging.html",controller:"pagingTableCtrl",require:"^objectTable",scope:{count:"=",display:"="},link:function(e,t,r,n){e.objectTableCtrl=n,e.objectTableCtrl.pageCtrl=e}}}]);
angular.module("objectTable").run(["$templateCache", function($templateCache) {$templateCache.put("/src/templates/common.html","<div class=\"object-table-module\"><!--搜索框--><div class=\"form-group col-xs-12 col-sm-6 col-md-4\" ng-if=\"search && \'separate\'!=search\"><input type=\"text\" placeholder=\"搜索内容\" ng-model=\"$parent.globalSearch\" class=\"row form-control search\" ng-model-options=\"{ updateOn: \'default blur\', debounce: { \'default\': 500, \'blur\': 0 } }\" ng-change=\"setCurrentPageForPageCtrl(0)\"></div><div class=\"col-xs-12 col-sm-6 col-md-8\" ng-if=\"addBtnShow\"><button ng-click=\"addClick()\" class=\"row btn btn-primary pull-right\"><i class=\"glyphicon glyphicon-plus\"></i>&nbsp;新建</button></div><div class=\"col-xs-12 col-sm-6 col-md-8 sorting-container\"><div ng-if=\"sortingType && sort.fields.length\">Sorting:<div ng-repeat=\"sortField in sort.fields\" class=\"sorting-badge\"><span class=\"glyphicon\" ng-class=\"{\'glyphicon-chevron-down\':sort.reverse[$index], \'glyphicon-chevron-up\':!sort.reverse[$index]}\"></span> {{::sortField}} <span class=\"glyphicon glyphicon-remove close\" ng-click=\"removeSorting()\"></span></div></div></div><div class=\"back-cover\"><table class=\"table table-responsive table-bordered object-table\" ng-mousedown=\"resizeStart($event)\" ng-mouseup=\"resizeEnd($event)\"><thead ng-if=\"!customHeader\"><tr><th ng-repeat=\"head in headers track by $index\" ng-click=\"sortBy(fields[$index])\" ng-class=\"headerIsSortedClass(head)\" class=\"sortable\">{{head}}<div ng-if=\"resize\" class=\"resize\"></div></th></tr></thead><thead ng-if=\"!customHeader&& \'separate\'===search\"><tr><th ng-repeat=\"head in headers track by $index\" class=\"separate\"><i class=\"glyphicon glyphicon-search search_icon separate\"></i> <input type=\"text\" ng-model=\"columnSearch[fields[$index]]\" placeholder=\"{{head}}...\" class=\"form-control search separate\" ng-model-options=\"{ updateOn: \'default blur\', debounce: { \'default\': 500, \'blur\': 0 } }\" ng-change=\"setCurrentPageForPageCtrl(0)\"></th></tr></thead><tbody ng-if=\"!findBody\"><tr id=\"rowTr\" ng-click=\"setSelected(item)\" ng-class=\"{\'selected-row\':ifSelected(item)}\"><!-- <= will inject ng-repeat --><!-- params: headers and fields --><td ng-if=\"!editable\" ng-repeat=\"field in fields\">{{item[field]}}</td><td ng-if=\"editable\" editable ng-repeat=\"field in fields\"><div contenteditable ng-model=\"item[field]\">{{item[field]}}</div></td></tr></tbody></table></div><div class=\"loading\" ng-show=\"dataIsLoading\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span> Loading Data...</div><paging ng-if=\"paging\" data-display=\"display\" count=\"$filtered.length\" class=\"row\" ng-hide=\"dataIsLoading\"></paging><div class=\"clearfix\"></div></div>");
$templateCache.put("/src/templates/paging.html","<div><div class=\"col-xs-12 text-center\"><nav ng-hide=\"pageCount()==0\"><ul class=\"pagination\"><li ng-class=\"prevPageDisabled()\"><a href ng-click=\"prevPage()\">上一页</a></li><li ng-repeat=\"n in range()\" ng-class=\"{active: n == currentPage}\" ng-click=\"setPage(n)\"><a href=\"javascript:void(0)\">{{::n+1}}</a></li><li ng-class=\"nextPageDisabled()\"><a href ng-click=\"nextPage()\">下一页</a></li></ul></nav></div><!--<div class=\"col-xs-3\">--><!--<span class=\"label count\">{{count}} <span>条</span></span>--><!--</div>--></div>");}]);
(function () {
    angular
        .module('template/treeGrid/treeGrid.html', [])
        .run([
            '$templateCache',
            function ($templateCache) {
                $templateCache.put('template/treeGrid/treeGrid.html',
                    "<div class=\"table-responsive\">\n" +
                    " <table class=\"table tree-grid\">\n" +
                    "   <thead>\n" +
                    "     <tr>\n" +
                    "       <th><a abc='dddd' ng-if=\"expandingProperty.sortable\" ng-click=\"sortBy(expandingProperty)\">{{expandingProperty.displayName || expandingProperty.field || expandingProperty}}</a><span ng-if=\"!expandingProperty.sortable\">{{expandingProperty.displayName || expandingProperty.field || expandingProperty}}</span><i ng-if=\"expandingProperty.sorted\" class=\"{{expandingProperty.sortingIcon}} pull-right\"></i></th>\n" +
                    "       <th ng-repeat=\"col in colDefinitions\"><a ng-if=\"col.sortable\" ng-click=\"sortBy(col)\">{{col.displayName || col.field}}</a><span ng-if=\"!col.sortable\">{{col.displayName || col.field}}</span><i ng-if=\"col.sorted\" class=\"{{col.sortingIcon}} pull-right\"></i></th>\n" +
                    "     </tr>\n" +
                    "   </thead>\n" +
                    "   <tbody>\n" +
                    "     <tr ng-repeat=\"row in tree_rows | searchFor:$parent.filterString:expandingProperty:colDefinitions track by row.branch.uid\"\n" +
                    "       ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'')\" class=\"tree-grid-row\">\n" +
                    "       <td><a ng-click=\"user_clicks_branch(row.branch)\">" +

                    "           <i ng-class=\"row.tree_icon\"\n" +
                    "              ng-click=\"row.branch.expanded = !row.branch.expanded\"\n" +
                    "              class=\"indented tree-icon\"></i>"+

                    "           </a><span class=\"indented tree-label\" ng-click=\"on_user_click(row.branch)\">\n" +
                    "             {{row.branch[expandingProperty.field] || row.branch[expandingProperty]}}</span>\n" +
                    "       </td>\n" +
                    "       <td ng-repeat=\"col in colDefinitions\">\n" +
                    "         <div ng-if=\"col.cellTemplate\" compile=\"col.cellTemplate\" cell-template-scope=\"col.cellTemplateScope\"></div>\n" +
                    "         <div ng-if=\"!col.cellTemplate\">{{row.branch[col.field]}}</div>\n" +
                    "       </td>\n" +
                    "     </tr>\n" +
                    "   </tbody>\n" +
                    " </table>\n" +
                    "</div>\n" +
                    "");
            }]);



    angular
        .module('treeGrid', [
            'template/treeGrid/treeGrid.html'
        ])

        .directive('compile', [
            '$compile',
            function ($compile) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        scope.cellTemplateScope = scope.$eval(attrs.cellTemplateScope);

                        // Watch for changes to expression.
                        scope.$watch(attrs.compile, function (new_val) {
                            /*
                             * Compile creates a linking function
                             * that can be used with any scope.
                             */
                            var link = $compile(new_val);

                            /*
                             * Executing the linking function
                             * creates a new element.
                             */
                            var new_elem = link(scope);

                            // Which we can then append to our DOM element.
                            element.append(new_elem);
                        });
                    }
                };
            }])

        .directive('treeGrid', [
            '$timeout',
            'treegridTemplate',
            function ($timeout,
                      treegridTemplate) {

                return {
                    restrict: 'E',
                    templateUrl: function (tElement, tAttrs) {
                        return tAttrs.templateUrl || treegridTemplate.getPath();
                    },
                    replace: true,
                    scope: {
                        treeData: '=',
                        colDefs: '=',
                        expandOn: '=',
                        onSelect: '&',
                        onClick: '&',
                        initialSelection: '@',
                        treeControl: '='
                    },
                    link: function (scope, element, attrs) {
                        var error, expandingProperty, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;

                        error = function (s) {
                            console.log('ERROR:' + s);
                            debugger;
                            return void 0;
                        };

                        attrs.iconExpand = attrs.iconExpand ? attrs.iconExpand : 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
                        attrs.iconCollapse = attrs.iconCollapse ? attrs.iconCollapse : 'icon-minus glyphicon glyphicon-minus fa fa-minus';
                        attrs.iconLeaf = attrs.iconLeaf ? attrs.iconLeaf : 'icon-file  glyphicon glyphicon-file  fa fa-file';
                        attrs.sortedAsc = attrs.sortedAsc ? attrs.sortedAsc : 'icon-file  glyphicon glyphicon-chevron-up  fa angle-up';
                        attrs.sortedDesc = attrs.sortedDesc ? attrs.sortedDesc : 'icon-file  glyphicon glyphicon-chevron-down  fa angle-down';
                        attrs.expandLevel = attrs.expandLevel ? attrs.expandLevel : '3';
                        expand_level = parseInt(attrs.expandLevel, 10);


                        if (!scope.treeData) {
                            alert('No data was defined for the tree, please define treeData!');
                            return;
                        }

                        var getExpandingProperty = function getExpandingProperty() {
                            if (attrs.expandOn) {
                                expandingProperty = scope.expandOn;
                                scope.expandingProperty = scope.expandOn;
                            } else {
                                if (scope.treeData.length) {
                                    var _firstRow = scope.treeData[0],
                                        _keys = Object.keys(_firstRow);
                                    for (var i = 0, len = _keys.length; i < len; i++) {
                                        if (typeof (_firstRow[_keys[i]]) === 'string') {
                                            expandingProperty = _keys[i];
                                            break;
                                        }
                                    }
                                    if (!expandingProperty) expandingProperty = _keys[0];
                                    scope.expandingProperty = expandingProperty;
                                }
                            }
                        };

                        getExpandingProperty();

                        if (!attrs.colDefs) {
                            if (scope.treeData.length) {
                                var _col_defs = [],
                                    _firstRow = scope.treeData[0],
                                    _unwantedColumn = ['children', 'level', 'expanded', expandingProperty];

                                for (var idx in _firstRow) {
                                    if (_unwantedColumn.indexOf(idx) === -1) {
                                        _col_defs.push({
                                            field: idx
                                        });
                                    }
                                }
                                scope.colDefinitions = _col_defs;
                            }
                        } else {
                            scope.colDefinitions = scope.colDefs;
                        }

                        for_each_branch = function (f) {
                            var do_f, root_branch, _i, _len, _ref, _results;
                            do_f = function (branch, level) {
                                var child, _i, _len, _ref, _results;
                                f(branch, level);
                                if (branch.children != null) {
                                    _ref = branch.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(do_f(child, level + 1));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(do_f(root_branch, 1));
                            }
                            return _results;
                        };
                        selected_branch = null;
                        select_branch = function (branch) {

                            if (!branch) {
                                if (selected_branch != null) {
                                    selected_branch.selected = false;
                                }
                                selected_branch = null;
                                return;
                            }
                            if (branch !== selected_branch) {
                                if (selected_branch != null) {
                                    selected_branch.selected = false;
                                }
                                branch.selected = true;
                                selected_branch = branch;
                                expand_all_parents(branch);
                                if (branch.onSelect != null) {
                                    return $timeout(function () {
                                        return branch.onSelect(branch);
                                    });
                                } else {
                                    if (scope.onSelect != null) {
                                        return $timeout(function () {
                                            return scope.onSelect({
                                                branch: branch
                                            });
                                        });
                                    }
                                }
                            }
                        };
                        scope.on_user_click = function (branch) {
                            if (scope.onClick) {
                                scope.onClick({
                                    branch: branch
                                });
                            }
                        };
                        scope.user_clicks_branch = function (branch) {
                            if (branch !== selected_branch) {
                                return select_branch(branch);
                            }
                        };

                        /* sorting methods */
                        scope.sortBy = function (col) {
                            if (col.sortDirection === "asc") {
                                sort_recursive(scope.treeData, col, true);
                                col.sortDirection = "desc";
                                col.sortingIcon = attrs.sortedDesc;
                            } else {
                                sort_recursive(scope.treeData, col, false);
                                col.sortDirection = "asc";
                                col.sortingIcon = attrs.sortedAsc;
                            }
                            col.sorted = true;
                            resetSorting(col);
                        };

                        var sort_recursive = function (elements, col, descending) {
                            elements.sort(sort_by(col, descending));
                            for (var i = 0; i < elements.length; i++) {
                                sort_recursive(elements[i].children, col, descending);
                            }
                        };

                        var sort_by = function (col, descending) {

                            var direction = !descending ? 1 : -1;

                            if (col.sortingType === "custom" && typeof col.sortingFunc === "function") {
                                return function (a, b) {
                                    return col.sortingFunc(a, b) * direction;
                                };
                            }

                            var key = function (x) {
                                return (x[col.field] === null ? "" : x[col.field].toLowerCase());
                            };

                            switch (col.sortingType) {
                                case "number":
                                    key = function (x) {
                                        return parseFloat(x[col.field]);
                                    };
                                    break;
                                case "date":
                                    key = function (x) {
                                        return new Date(x[col.field]);
                                    };
                                    break;
                            }

                            return function (a, b) {
                                return a = key(a), b = key(b), direction * ((a > b) - (b > a));
                            };
                        }

                        var resetSorting = function (sortedCol) {
                            var arraySize = scope.colDefinitions.length;
                            for (var i = 0; i < arraySize; i++) {
                                var col = scope.colDefinitions[i];
                                if (col.field != sortedCol.field) {
                                    col.sorted = false;
                                    col.sortDirection = "none";
                                }
                            }
                        }

                        /* end of sorting methods */

                        get_parent = function (child) {
                            var parent;
                            parent = void 0;
                            if (child.parent_uid) {
                                for_each_branch(function (b) {
                                    if (b.uid === child.parent_uid) {
                                        return parent = b;
                                    }
                                });
                            }
                            return parent;
                        };
                        for_all_ancestors = function (child, fn) {
                            var parent;
                            parent = get_parent(child);
                            if (parent != null) {
                                fn(parent);
                                return for_all_ancestors(parent, fn);
                            }
                        };
                        expand_all_parents = function (child) {
                            return for_all_ancestors(child, function (b) {
                                return b.expanded = true;
                            });
                        };

                        scope.tree_rows = [];

                        on_treeData_change = function () {
                            getExpandingProperty();

                            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                            for_each_branch(function (b, level) {
                                if (!b.uid) {
                                    return b.uid = "" + Math.random();
                                }
                            });
                            for_each_branch(function (b) {
                                var child, _i, _len, _ref, _results;
                                if (angular.isArray(b.children)) {
                                    _ref = b.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(child.parent_uid = b.uid);
                                    }
                                    return _results;
                                }
                            });
                            scope.tree_rows = [];
                            for_each_branch(function (branch) {
                                var child, f;
                                if (branch.children) {
                                    if (branch.children.length > 0) {
                                        f = function (e) {
                                            if (typeof e === 'string') {
                                                return {
                                                    label: e,
                                                    children: []
                                                };
                                            } else {
                                                return e;
                                            }
                                        };
                                        return branch.children = (function () {
                                            var _i, _len, _ref, _results;
                                            _ref = branch.children;
                                            _results = [];
                                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                                child = _ref[_i];
                                                _results.push(f(child));
                                            }
                                            return _results;
                                        })();
                                    }
                                } else {
                                    return branch.children = [];
                                }
                            });
                            add_branch_to_list = function (level, branch, visible) {
                                var child, child_visible, tree_icon, _i, _len, _ref, _results;


                                //if(branch.type=="bumen"){
                                //    tree_icon ="glyphicon glyphicon-tasks"
                                //    console.log("bumen")
                                //}
                                //


                             

                                if (branch.expanded == null) {
                                    branch.expanded = false;
                                }


                                //获取数据类型
                                var type=branch.type


                                //如果是人显示头像
                                if(type=='person'){

                                    if (!branch.children || branch.children.length===0) {
                                        tree_icon="glyphicon glyphicon-user"
                                        //tree_icon = '';
                                        //console.log("person chidren 不存在")
                                    }
                                    
                                }else{

                                    //如果type不存在的话, 就显示这个
                                    if (!branch.children || branch.children.length===0) {
                                        tree_icon = attrs.iconLeaf;
                                        //console.log("department chidren 不存在")
                                    }else{
                                        if (branch.expanded) {
                                            tree_icon = attrs.iconCollapse;
                                        } else {
                                            tree_icon = attrs.iconExpand;

                                        }
                                    }
                                }




                                //if (!branch.children || branch.children.length===0) {
                                //    tree_icon = attrs.iconLeaf;
                                //
                                //}else{
                                //    if (branch.expanded) {
                                //        tree_icon = attrs.iconCollapse;
                                //    } else {
                                //        tree_icon = attrs.iconExpand;
                                //
                                //    }
                                //}



                                branch.level = level;
                                scope.tree_rows.push({
                                    level: level,
                                    branch: branch,
                                    label: branch[expandingProperty],
                                    tree_icon: tree_icon,
                                    visible: visible
                                });
                                if (branch.children != null) {
                                    _ref = branch.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        child_visible = visible && branch.expanded;
                                        _results.push(add_branch_to_list(level + 1, child, child_visible));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(add_branch_to_list(1, root_branch, true));
                            }
                            return _results;
                        };

                        scope.$watch('treeData', on_treeData_change, true);

                        if (attrs.initialSelection != null) {
                            for_each_branch(function (b) {
                                if (b.label === attrs.initialSelection) {
                                    return $timeout(function () {
                                        return select_branch(b);
                                    });
                                }
                            });
                        }
                        n = scope.treeData.length;
                        for_each_branch(function (b, level) {
                            b.level = level;
                            return b.expanded = b.level < expand_level;
                        });
                        if (scope.treeControl != null) {
                            if (angular.isObject(scope.treeControl)) {
                                tree = scope.treeControl;
                                tree.expand_all = function () {
                                    return for_each_branch(function (b, level) {
                                        return b.expanded = true;
                                    });
                                };
                                tree.collapse_all = function () {
                                    return for_each_branch(function (b, level) {
                                        return b.expanded = false;
                                    });
                                };
                                tree.get_first_branch = function () {
                                    n = scope.treeData.length;
                                    if (n > 0) {
                                        return scope.treeData[0];
                                    }
                                };
                                tree.select_first_branch = function () {
                                    var b;
                                    b = tree.get_first_branch();
                                    return tree.select_branch(b);
                                };
                                tree.get_selected_branch = function () {
                                    return selected_branch;
                                };
                                tree.get_parent_branch = function (b) {
                                    return get_parent(b);
                                };
                                tree.select_branch = function (b) {
                                    select_branch(b);
                                    return b;
                                };
                                tree.get_children = function (b) {
                                    return b.children;
                                };
                                tree.select_parent_branch = function (b) {
                                    var p;
                                    if (b == null) {
                                        b = tree.get_selected_branch();
                                    }
                                    if (b != null) {
                                        p = tree.get_parent_branch(b);
                                        if (p != null) {
                                            tree.select_branch(p);
                                            return p;
                                        }
                                    }
                                };
                                tree.add_branch = function (parent, new_branch) {
                                    if (parent != null) {
                                        parent.children.push(new_branch);
                                        parent.expanded = true;
                                    } else {
                                        scope.treeData.push(new_branch);
                                    }
                                    return new_branch;
                                };
                                tree.add_root_branch = function (new_branch) {
                                    tree.add_branch(null, new_branch);
                                    return new_branch;
                                };
                                tree.expand_branch = function (b) {
                                    if (b == null) {
                                        b = tree.get_selected_branch();
                                    }
                                    if (b != null) {
                                        b.expanded = true;
                                        return b;
                                    }
                                };
                                tree.collapse_branch = function (b) {
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        b.expanded = false;
                                        return b;
                                    }
                                };
                                tree.get_siblings = function (b) {
                                    var p, siblings;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        p = tree.get_parent_branch(b);
                                        if (p) {
                                            siblings = p.children;
                                        } else {
                                            siblings = scope.treeData;
                                        }
                                        return siblings;
                                    }
                                };
                                tree.get_next_sibling = function (b) {
                                    var i, siblings;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        siblings = tree.get_siblings(b);
                                        n = siblings.length;
                                        i = siblings.indexOf(b);
                                        if (i < n) {
                                            return siblings[i + 1];
                                        }
                                    }
                                };
                                tree.get_prev_sibling = function (b) {
                                    var i, siblings;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    siblings = tree.get_siblings(b);
                                    n = siblings.length;
                                    i = siblings.indexOf(b);
                                    if (i > 0) {
                                        return siblings[i - 1];
                                    }
                                };
                                tree.select_next_sibling = function (b) {
                                    var next;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        next = tree.get_next_sibling(b);
                                        if (next != null) {
                                            return tree.select_branch(next);
                                        }
                                    }
                                };
                                tree.select_prev_sibling = function (b) {
                                    var prev;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        prev = tree.get_prev_sibling(b);
                                        if (prev != null) {
                                            return tree.select_branch(prev);
                                        }
                                    }
                                };
                                tree.get_first_child = function (b) {
                                    var _ref;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                                            return b.children[0];
                                        }
                                    }
                                };
                                tree.get_closest_ancestor_next_sibling = function (b) {
                                    var next, parent;
                                    next = tree.get_next_sibling(b);
                                    if (next != null) {
                                        return next;
                                    } else {
                                        parent = tree.get_parent_branch(b);
                                        return tree.get_closest_ancestor_next_sibling(parent);
                                    }
                                };
                                tree.get_next_branch = function (b) {
                                    var next;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        next = tree.get_first_child(b);
                                        if (next != null) {
                                            return next;
                                        } else {
                                            next = tree.get_closest_ancestor_next_sibling(b);
                                            return next;
                                        }
                                    }
                                };
                                tree.select_next_branch = function (b) {
                                    var next;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        next = tree.get_next_branch(b);
                                        if (next != null) {
                                            tree.select_branch(next);
                                            return next;
                                        }
                                    }
                                };
                                tree.last_descendant = function (b) {
                                    var last_child;
                                    if (b == null) {
                                        debugger;
                                    }
                                    n = b.children.length;
                                    if (n === 0) {
                                        return b;
                                    } else {
                                        last_child = b.children[n - 1];
                                        return tree.last_descendant(last_child);
                                    }
                                };
                                tree.get_prev_branch = function (b) {
                                    var parent, prev_sibling;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        prev_sibling = tree.get_prev_sibling(b);
                                        if (prev_sibling != null) {
                                            return tree.last_descendant(prev_sibling);
                                        } else {
                                            parent = tree.get_parent_branch(b);
                                            return parent;
                                        }
                                    }
                                };
                                return tree.select_prev_branch = function (b) {
                                    var prev;
                                    if (b == null) {
                                        b = selected_branch;
                                    }
                                    if (b != null) {
                                        prev = tree.get_prev_branch(b);
                                        if (prev != null) {
                                            tree.select_branch(prev);
                                            return prev;
                                        }
                                    }
                                };
                            }
                        }
                    }
                };
            }
        ])

        .provider('treegridTemplate', function () {
            var templatePath = 'template/treeGrid/treeGrid.html';

            this.setPath = function (path) {
                templatePath = path;
            };

            this.$get = function () {
                return {
                    getPath: function () {
                        return templatePath;
                    }
                };
            };
        })

        .filter('searchFor', function () {
            return function (arr, filterString, expandingProperty, colDefinitions) {
                var filtered = [];
                //only apply filter for strings 3 characters long or more
                if (!filterString || filterString.length < 3) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.visible) {
                            filtered.push(item);
                        }
                    }
                } else {
                    var ancestorStack = [];
                    var currentLevel = 0;
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        while (currentLevel >= item.level) {
                            throwAway = ancestorStack.pop();
                            currentLevel--;
                        }
                        ancestorStack.push(item);
                        currentLevel = item.level;
                        if (include(item, filterString, expandingProperty, colDefinitions)) {
                            for (var ancestorIndex = 0; ancestorIndex < ancestorStack.length; ancestorIndex++) {
                                ancestor = ancestorStack[ancestorIndex];
                                if (ancestor.visible) {
                                    filtered.push(ancestor);
                                }
                            }
                            ancestorStack = [];
                        }
                    }
                }
                return filtered;
            };

            function include(item, filterString, expandingProperty, colDefinitions) {
                var includeItem = false;
                var filterApplied = false;
                //first check the expandingProperty
                if (expandingProperty.filterable) {
                    filterApplied = true;
                    if (checkItem(item, filterString, expandingProperty)) {
                        includeItem = true;
                    }
                }
                //then check each of the other columns
                var arraySize = colDefinitions.length;
                for (var i = 0; i < arraySize; i++) {
                    var col = colDefinitions[i];
                    if (col.filterable) {
                        filterApplied = true;
                        if (checkItem(item, filterString, col)) {
                            includeItem = true;
                        }
                    }
                }
                if (filterApplied) {
                    return includeItem;
                } else {
                    return true;
                }
            }

            function checkItem(item, filterString, col) {
                if (col.sortingType === "number") {
                    if (item.branch[col.field] != null
                        && parseFloat(item.branch[col.field]) === parseFloat(filterString)) {
                        return true;
                    }
                } else {
                    if (item.branch[col.field] != null
                        && item.branch[col.field].toLowerCase().indexOf(filterString.toLowerCase()) !== -1) {
                        return true;
                    }
                }
            }
        });
}).call(window);

angular.module("uiSwitch",[]).directive("switch",function(){return{restrict:"AE",replace:!0,transclude:!0,template:function(n,e){var s="";return s+="<span",s+=' class="switch'+(e.class?" "+e.class:"")+'"',s+=e.ngModel?' ng-click="'+e.disabled+" ? "+e.ngModel+" : "+e.ngModel+"=!"+e.ngModel+(e.ngChange?"; "+e.ngChange+'()"':'"'):"",s+=' ng-class="{ checked:'+e.ngModel+", disabled:"+e.disabled+' }"',s+=">",s+="<small></small>",s+='<input type="checkbox"',s+=e.id?' id="'+e.id+'"':"",s+=e.name?' name="'+e.name+'"':"",s+=e.ngModel?' ng-model="'+e.ngModel+'"':"",s+=' style="display:none" />',s+='<span class="switch-text">',s+=e.on?'<span class="on">'+e.on+"</span>":"",s+=e.off?'<span class="off">'+e.off+"</span>":" ",s+="</span>"}}});
'use strict';

angular.module('jp.ng-bs-animated-button', []).
  directive('jpNgBsAnimatedButton', [ '$timeout', function($timeout) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        isSubmitting: '=',
        result: '=',
        options: '=?'
      },
      controller: [ '$scope', function($scope) {
        $scope.options = $scope.options || {};
        $scope.options = {
          buttonDefaultClass: $scope.options.buttonDefaultClass || 'btn-primary',
          buttonSubmittingClass: $scope.options.buttonSubmittingClass || 'btn-primary',
          buttonSuccessClass: $scope.options.buttonSuccessClass || 'btn-primary',
          buttonErrorClass: $scope.options.buttonErrorClass || 'btn-danger',
          buttonSizeClass: $scope.options.buttonSizeClass || null,
          buttonDefaultText: $scope.options.buttonDefaultText || 'Submit',
          buttonSubmittingText: $scope.options.buttonSubmittingText || 'Submitting...',
          buttonSuccessText: $scope.options.buttonSuccessText || 'Completed',
          buttonErrorText: $scope.options.buttonErrorText || 'There was an error',
          buttonInitialIcon: $scope.options.buttonInitialIcon || 'glyphicon glyphicon-plus',
          buttonSubmittingIcon: $scope.options.buttonSubmittingIcon || 'glyphicon glyphicon-refresh',
          buttonSuccessIcon: $scope.options.buttonSuccessIcon || 'glyphicon glyphicon-ok',
          buttonErrorIcon: $scope.options.buttonErrorIcon || 'glyphicon glyphicon-remove',
          formIsInvalid: $scope.options.formIsInvalid || '',
          animationCompleteTime: $scope.options.animationCompleteTime || '2000',
          iconsPosition: $scope.options.iconsPosition || 'left',
          onlyIcons: $scope.options.onlyIcons || false
        };
      }],
      template:
        '<button type="submit" class="btn {{buttonClass}} {{buttonSize}} {{onlyIcons}} btn-ng-bs-animated clearfix" ng-disabled="{{formIsInvalid}}">' +
          '<div class="icons pull-{{iconsPosition}}">' +
            '<span class="{{buttonInitialIcon}} icon-initial"></span>' +
            '<span class="{{buttonSubmittingIcon}} icon-spinner icon-submit hidden"></span>' +
            '<span class="{{buttonSuccessIcon}} icon-result icon-success hidden"></span>' +
            '<span class="{{buttonErrorIcon}} icon-result icon-error hidden"></span>' +
          '</div>' +
          '<div class="text {{buttonTextFloatClass}}">{{buttonText}}</div>' +
        '</button>',
      link: function(scope, element) {
        var el = element;

        var icons = {
          initial: angular.element(el[0].querySelector('.icon-initial')),
          submitting: angular.element(el[0].querySelector('.icon-submit')),
          result: angular.element(el[0].querySelectorAll('.icon-result')),
          success: angular.element(el[0].querySelector('.icon-success')),
          error: angular.element(el[0].querySelector('.icon-error'))
        };

        var endAnimation = function() {
          scope.result = null;
          scope.buttonClass = scope.options.buttonDefaultClass;
          scope.buttonText = scope.options.buttonDefaultText;
          el.removeClass('is-active').attr('disabled', false);
          icons.result.addClass('hidden');
        };

        var setButtonTextFloatClass = function() {
          if (scope.iconsPosition === 'left') {
            return 'pull-right';
          } else {
            return 'pull-left';
          }
        };

        scope.buttonClass = scope.options.buttonDefaultClass;
        scope.buttonSize = scope.options.buttonSizeClass;
        scope.formIsInvalid = scope.options.formIsInvalid;
        scope.iconsPosition = scope.options.iconsPosition;
        scope.buttonInitialIcon = scope.options.buttonInitialIcon;
        scope.buttonSubmittingIcon = scope.options.buttonSubmittingIcon;
        scope.buttonSuccessIcon = scope.options.buttonSuccessIcon;
        scope.buttonErrorIcon = scope.options.buttonErrorIcon;
        scope.iconsPosition = scope.options.iconsPosition;
        scope.buttonText = scope.options.buttonDefaultText;
        scope.buttonTextFloatClass = setButtonTextFloatClass();

        if(scope.options.onlyIcons){
          scope.onlyIcons = 'icons-only';
        };

        scope.$watch('isSubmitting', function(newValue) {
            if (newValue) {
              scope.buttonClass = scope.options.buttonSubmittingClass;
              scope.buttonText = scope.options.buttonSubmittingText;
              el.attr('disabled', true).addClass('is-active');
              icons.submitting.removeClass('hidden');
            }
          }, true).bind(this);

        scope.$watch('result', function(newValue) {
            scope.isSubmitting = null;
            if (newValue === 'success') {
              scope.buttonClass = scope.options.buttonSuccessClass;
              scope.buttonText = scope.options.buttonSuccessText;
              icons.submitting.addClass('hidden');
              icons.success.removeClass('hidden');
              $timeout(endAnimation, scope.options.animationCompleteTime);
            }
            if (newValue === 'error') {
              scope.buttonClass = scope.options.buttonErrorClass;
              scope.buttonText = scope.options.buttonErrorText;
              icons.submitting.addClass('hidden');
              icons.error.removeClass('hidden');
              $timeout(endAnimation, scope.options.animationCompleteTime);
            }
          }, true).bind(this);
      }
    };
  }]
);

/* angular-moment.js / v0.10.3 / (c) 2013, 2014, 2015 Uri Shaked / MIT Licence */

'format amd';
/* global define */

(function () {
	'use strict';

	function angularMoment(angular, moment) {

		/**
		 * @ngdoc overview
		 * @name angularMoment
		 *
		 * @description
		 * angularMoment module provides moment.js functionality for angular.js apps.
		 */
		return angular.module('angularMoment', [])

		/**
		 * @ngdoc object
		 * @name angularMoment.config:angularMomentConfig
		 *
		 * @description
		 * Common configuration of the angularMoment module
		 */
			.constant('angularMomentConfig', {
				/**
				 * @ngdoc property
				 * @name angularMoment.config.angularMomentConfig#preprocess
				 * @propertyOf angularMoment.config:angularMomentConfig
				 * @returns {string} The default preprocessor to apply
				 *
				 * @description
				 * Defines a default preprocessor to apply (e.g. 'unix', 'etc', ...). The default value is null,
				 * i.e. no preprocessor will be applied.
				 */
				preprocess: null, // e.g. 'unix', 'utc', ...

				/**
				 * @ngdoc property
				 * @name angularMoment.config.angularMomentConfig#timezone
				 * @propertyOf angularMoment.config:angularMomentConfig
				 * @returns {string} The default timezone
				 *
				 * @description
				 * The default timezone (e.g. 'Europe/London'). Empty string by default (does not apply
				 * any timezone shift).
				 */
				timezone: '',

				/**
				 * @ngdoc property
				 * @name angularMoment.config.angularMomentConfig#format
				 * @propertyOf angularMoment.config:angularMomentConfig
				 * @returns {string} The pre-conversion format of the date
				 *
				 * @description
				 * Specify the format of the input date. Essentially it's a
				 * default and saves you from specifying a format in every
				 * element. Overridden by element attr. Null by default.
				 */
				format: null,

				/**
				 * @ngdoc property
				 * @name angularMoment.config.angularMomentConfig#statefulFilters
				 * @propertyOf angularMoment.config:angularMomentConfig
				 * @returns {boolean} Whether angular-moment filters should be stateless (or not)
				 *
				 * @description
				 * Specifies whether the filters included with angular-moment are stateful.
				 * Stateful filters will automatically re-evaluate whenever you change the timezone
				 * or language settings, but may negatively impact performance. true by default.
				 */
				statefulFilters: true
			})

		/**
		 * @ngdoc object
		 * @name angularMoment.object:moment
		 *
		 * @description
		 * moment global (as provided by the moment.js library)
		 */
			.constant('moment', moment)

		/**
		 * @ngdoc object
		 * @name angularMoment.config:amTimeAgoConfig
		 * @module angularMoment
		 *
		 * @description
		 * configuration specific to the amTimeAgo directive
		 */
			.constant('amTimeAgoConfig', {
				/**
				 * @ngdoc property
				 * @name angularMoment.config.amTimeAgoConfig#withoutSuffix
				 * @propertyOf angularMoment.config:amTimeAgoConfig
				 * @returns {boolean} Whether to include a suffix in am-time-ago directive
				 *
				 * @description
				 * Defaults to false.
				 */
				withoutSuffix: false,

				/**
				 * @ngdoc property
				 * @name angularMoment.config.amTimeAgoConfig#serverTime
				 * @propertyOf angularMoment.config:amTimeAgoConfig
				 * @returns {number} Server time in milliseconds since the epoch
				 *
				 * @description
				 * If set, time ago will be calculated relative to the given value.
				 * If null, local time will be used. Defaults to null.
				 */
				serverTime: null,

				/**
				 * @ngdoc property
				 * @name angularMoment.config.amTimeAgoConfig#titleFormat
				 * @propertyOf angularMoment.config:amTimeAgoConfig
				 * @returns {string} The format of the date to be displayed in the title of the element. If null,
				 *        the directive set the title of the element.
				 *
				 * @description
				 * The format of the date used for the title of the element. null by default.
				 */
				titleFormat: null,

				/**
				 * @ngdoc property
				 * @name angularMoment.config.amTimeAgoConfig#fullDateThreshold
				 * @propertyOf angularMoment.config:amTimeAgoConfig
				 * @returns {number} The minimum number of days for showing a full date instead of relative time
				 *
				 * @description
				 * The threshold for displaying a full date. The default is null, which means the date will always
				 * be relative, and full date will never be displayed.
				 */
				fullDateThreshold: null,

				/**
				 * @ngdoc property
				 * @name angularMoment.config.amTimeAgoConfig#fullDateFormat
				 * @propertyOf angularMoment.config:amTimeAgoConfig
				 * @returns {string} The format to use when displaying a full date.
				 *
				 * @description
				 * Specify the format of the date when displayed as full date. null by default.
				 */
				fullDateFormat: null
			})

		/**
		 * @ngdoc directive
		 * @name angularMoment.directive:amTimeAgo
		 * @module angularMoment
		 *
		 * @restrict A
		 */
			.directive('amTimeAgo', ['$window', 'moment', 'amMoment', 'amTimeAgoConfig', 'angularMomentConfig', function ($window, moment, amMoment, amTimeAgoConfig, angularMomentConfig) {

				return function (scope, element, attr) {
					var activeTimeout = null;
					var currentValue;
					var currentFormat = angularMomentConfig.format;
					var withoutSuffix = amTimeAgoConfig.withoutSuffix;
					var titleFormat = amTimeAgoConfig.titleFormat;
					var fullDateThreshold = amTimeAgoConfig.fullDateThreshold;
					var fullDateFormat = amTimeAgoConfig.fullDateFormat;
					var localDate = new Date().getTime();
					var preprocess = angularMomentConfig.preprocess;
					var modelName = attr.amTimeAgo;
					var currentFrom;
					var isTimeElement = ('TIME' === element[0].nodeName.toUpperCase());

					function getNow() {
						var now;
						if (currentFrom) {
							now = currentFrom;
						} else if (amTimeAgoConfig.serverTime) {
							var localNow = new Date().getTime();
							var nowMillis = localNow - localDate + amTimeAgoConfig.serverTime;
							now = moment(nowMillis);
						}
						else {
							now = moment();
						}
						return now;
					}

					function cancelTimer() {
						if (activeTimeout) {
							$window.clearTimeout(activeTimeout);
							activeTimeout = null;
						}
					}

					function updateTime(momentInstance) {
						var daysAgo = getNow().diff(momentInstance, 'day');
						var showFullDate = fullDateThreshold && daysAgo >= fullDateThreshold;

						if (showFullDate) {
							element.text(momentInstance.format(fullDateFormat));
						} else {
							element.text(momentInstance.from(getNow(), withoutSuffix));
						}

						if (titleFormat && !element.attr('title')) {
							element.attr('title', momentInstance.local().format(titleFormat));
						}

						if (!showFullDate) {
							var howOld = Math.abs(getNow().diff(momentInstance, 'minute'));
							var secondsUntilUpdate = 3600;
							if (howOld < 1) {
								secondsUntilUpdate = 1;
							} else if (howOld < 60) {
								secondsUntilUpdate = 30;
							} else if (howOld < 180) {
								secondsUntilUpdate = 300;
							}

							activeTimeout = $window.setTimeout(function () {
								updateTime(momentInstance);
							}, secondsUntilUpdate * 1000);
						}
					}

					function updateDateTimeAttr(value) {
						if (isTimeElement) {
							element.attr('datetime', value);
						}
					}

					function updateMoment() {
						cancelTimer();
						if (currentValue) {
							var momentValue = amMoment.preprocessDate(currentValue, preprocess, currentFormat);
							updateTime(momentValue);
							updateDateTimeAttr(momentValue.toISOString());
						}
					}

					scope.$watch(modelName, function (value) {
						if ((typeof value === 'undefined') || (value === null) || (value === '')) {
							cancelTimer();
							if (currentValue) {
								element.text('');
								updateDateTimeAttr('');
								currentValue = null;
							}
							return;
						}

						currentValue = value;
						updateMoment();
					});

					if (angular.isDefined(attr.amFrom)) {
						scope.$watch(attr.amFrom, function (value) {
							if ((typeof value === 'undefined') || (value === null) || (value === '')) {
								currentFrom = null;
							} else {
								currentFrom = moment(value);
							}
							updateMoment();
						});
					}

					if (angular.isDefined(attr.amWithoutSuffix)) {
						scope.$watch(attr.amWithoutSuffix, function (value) {
							if (typeof value === 'boolean') {
								withoutSuffix = value;
								updateMoment();
							} else {
								withoutSuffix = amTimeAgoConfig.withoutSuffix;
							}
						});
					}

					attr.$observe('amFormat', function (format) {
						if (typeof format !== 'undefined') {
							currentFormat = format;
							updateMoment();
						}
					});

					attr.$observe('amPreprocess', function (newValue) {
						preprocess = newValue;
						updateMoment();
					});

					attr.$observe('amFullDateThreshold', function (newValue) {
						fullDateThreshold = newValue;
						updateMoment();
					});

					attr.$observe('amFullDateFormat', function (newValue) {
						fullDateFormat = newValue;
						updateMoment();
					});

					scope.$on('$destroy', function () {
						cancelTimer();
					});

					scope.$on('amMoment:localeChanged', function () {
						updateMoment();
					});
				};
			}])

		/**
		 * @ngdoc service
		 * @name angularMoment.service.amMoment
		 * @module angularMoment
		 */
			.service('amMoment', ['moment', '$rootScope', '$log', 'angularMomentConfig', function (moment, $rootScope, $log, angularMomentConfig) {
				/**
				 * @ngdoc property
				 * @name angularMoment:amMoment#preprocessors
				 * @module angularMoment
				 *
				 * @description
				 * Defines the preprocessors for the preprocessDate method. By default, the following preprocessors
				 * are defined: utc, unix.
				 */
				this.preprocessors = {
					utc: moment.utc,
					unix: moment.unix
				};

				/**
				 * @ngdoc function
				 * @name angularMoment.service.amMoment#changeLocale
				 * @methodOf angularMoment.service.amMoment
				 *
				 * @description
				 * Changes the locale for moment.js and updates all the am-time-ago directive instances
				 * with the new locale. Also broadcasts an `amMoment:localeChanged` event on $rootScope.
				 *
				 * @param {string} locale Locale code (e.g. en, es, ru, pt-br, etc.)
				 * @param {object} customization object of locale strings to override
				 */
				this.changeLocale = function (locale, customization) {
					var result = moment.locale(locale, customization);
					if (angular.isDefined(locale)) {
						$rootScope.$broadcast('amMoment:localeChanged');

					}
					return result;
				};

				/**
				 * @ngdoc function
				 * @name angularMoment.service.amMoment#changeTimezone
				 * @methodOf angularMoment.service.amMoment
				 *
				 * @description
				 * Changes the default timezone for amCalendar, amDateFormat and amTimeAgo. Also broadcasts an
				 * `amMoment:timezoneChanged` event on $rootScope.
				 *
				 * @param {string} timezone Timezone name (e.g. UTC)
				 */
				this.changeTimezone = function (timezone) {
					angularMomentConfig.timezone = timezone;
					$rootScope.$broadcast('amMoment:timezoneChanged');
				};

				/**
				 * @ngdoc function
				 * @name angularMoment.service.amMoment#preprocessDate
				 * @methodOf angularMoment.service.amMoment
				 *
				 * @description
				 * Preprocess a given value and convert it into a Moment instance appropriate for use in the
				 * am-time-ago directive and the filters.
				 *
				 * @param {*} value The value to be preprocessed
				 * @param {string} preprocess The name of the preprocessor the apply (e.g. utc, unix)
				 * @param {string=} format Specifies how to parse the value (see {@link http://momentjs.com/docs/#/parsing/string-format/})
				 * @return {Moment} A value that can be parsed by the moment library
				 */
				this.preprocessDate = function (value, preprocess, format) {
					if (angular.isUndefined(preprocess)) {
						preprocess = angularMomentConfig.preprocess;
					}
					if (this.preprocessors[preprocess]) {
						return this.preprocessors[preprocess](value, format);
					}
					if (preprocess) {
						$log.warn('angular-moment: Ignoring unsupported value for preprocess: ' + preprocess);
					}
					if (!isNaN(parseFloat(value)) && isFinite(value)) {
						// Milliseconds since the epoch
						return moment(parseInt(value, 10));
					}
					// else just returns the value as-is.
					return moment(value, format);
				};

				/**
				 * @ngdoc function
				 * @name angularMoment.service.amMoment#applyTimezone
				 * @methodOf angularMoment.service.amMoment
				 *
				 * @description
				 * Apply a timezone onto a given moment object. It can be a named timezone (e.g. 'America/Phoenix') or an offset from UTC (e.g. '+0300')
				 * moment-timezone.js is needed when a named timezone is used, otherwise, it'll not apply any timezone shift.
				 *
				 * @param {Moment} aMoment a moment() instance to apply the timezone shift to
				 * @param {string=} timezone The timezone to apply. If none given, will apply the timezone
				 *        configured in angularMomentConfig.timezone. It can be a named timezone (e.g. 'America/Phoenix') or an offset from UTC (e.g. '+0300')
				 *
				 * @returns {Moment} The given moment with the timezone shift applied
				 */
				this.applyTimezone = function (aMoment, timezone) {
					timezone = timezone || angularMomentConfig.timezone;
					if (!timezone) {
						return aMoment;
					}

					if (timezone.match(/^Z|[+-]\d\d:?\d\d$/i)) {
						aMoment = aMoment.utcOffset(timezone);
					} else if (aMoment.tz) {
						aMoment = aMoment.tz(timezone);
					} else {
						$log.warn('angular-moment: named timezone specified but moment.tz() is undefined. Did you forget to include moment-timezone.js?');
					}

					return aMoment;
				};
			}])

		/**
		 * @ngdoc filter
		 * @name angularMoment.filter:amCalendar
		 * @module angularMoment
		 */
			.filter('amCalendar', ['moment', 'amMoment', 'angularMomentConfig', function (moment, amMoment, angularMomentConfig) {
				function amCalendarFilter(value, preprocess, timezone) {
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					value = amMoment.preprocessDate(value, preprocess);
					var date = moment(value);
					if (!date.isValid()) {
						return '';
					}

					return amMoment.applyTimezone(date, timezone).calendar();
				}

				// Since AngularJS 1.3, filters have to explicitly define being stateful
				// (this is no longer the default).
				amCalendarFilter.$stateful = angularMomentConfig.statefulFilters;

				return amCalendarFilter;
			}])

		/**
		 * @ngdoc filter
		 * @name angularMoment.filter:amDifference
		 * @module angularMoment
		 */
			.filter('amDifference', ['moment', 'amMoment', 'angularMomentConfig', function (moment, amMoment, angularMomentConfig) {
				function amDifferenceFilter(value, otherValue, unit, usePrecision, preprocessValue, preprocessOtherValue) {
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					value = amMoment.preprocessDate(value, preprocessValue);
					var date = moment(value);
					if (!date.isValid()) {
						return '';
					}

					var date2;
					if (typeof otherValue === 'undefined' || otherValue === null) {
						date2 = moment();
					} else {
						otherValue = amMoment.preprocessDate(otherValue, preprocessOtherValue);
						date2 = moment(otherValue);
						if (!date2.isValid()) {
							return '';
						}
					}

					return amMoment.applyTimezone(date).diff(amMoment.applyTimezone(date2), unit, usePrecision);
				}

				amDifferenceFilter.$stateful = angularMomentConfig.statefulFilters;

				return amDifferenceFilter;
			}])

		/**
		 * @ngdoc filter
		 * @name angularMoment.filter:amDateFormat
		 * @module angularMoment
		 * @function
		 */
			.filter('amDateFormat', ['moment', 'amMoment', 'angularMomentConfig', function (moment, amMoment, angularMomentConfig) {
				function amDateFormatFilter(value, format, preprocess, timezone, inputFormat) {
					var currentFormat = inputFormat || angularMomentConfig.format;
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					value = amMoment.preprocessDate(value, preprocess, currentFormat);
					var date = moment(value);
					if (!date.isValid()) {
						return '';
					}

					return amMoment.applyTimezone(date, timezone).format(format);
				}

				amDateFormatFilter.$stateful = angularMomentConfig.statefulFilters;

				return amDateFormatFilter;
			}])

		/**
		 * @ngdoc filter
		 * @name angularMoment.filter:amDurationFormat
		 * @module angularMoment
		 * @function
		 */
			.filter('amDurationFormat', ['moment', 'angularMomentConfig', function (moment, angularMomentConfig) {
				function amDurationFormatFilter(value, format, suffix) {
					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					return moment.duration(value, format).humanize(suffix);
				}

				amDurationFormatFilter.$stateful = angularMomentConfig.statefulFilters;

				return amDurationFormatFilter;
			}])

		/**
		 * @ngdoc filter
		 * @name angularMoment.filter:amTimeAgo
		 * @module angularMoment
		 * @function
		 */
			.filter('amTimeAgo', ['moment', 'amMoment', 'angularMomentConfig', function (moment, amMoment, angularMomentConfig) {
				function amTimeAgoFilter(value, preprocess, suffix, from) {
					var date, dateFrom;

					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					value = amMoment.preprocessDate(value, preprocess);
					date = moment(value);
					if (!date.isValid()) {
						return '';
					}

					dateFrom = moment(from);
					if (typeof from !== 'undefined' && dateFrom.isValid()) {
						return amMoment.applyTimezone(date).from(dateFrom, suffix);
					}

					return amMoment.applyTimezone(date).fromNow(suffix);
				}

				amTimeAgoFilter.$stateful = angularMomentConfig.statefulFilters;

				return amTimeAgoFilter;
			}])

		/**
		 * @ngdoc filter
		 * @name angularMoment.filter:amSubtract
		 * @module angularMoment
		 * @function
		 */
			.filter('amSubtract', ['moment', 'angularMomentConfig', function (moment, angularMomentConfig) {
				function amSubtractFilter(value, amount, type) {

					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					return moment(value).subtract(parseInt(amount, 10), type);
				}

				amSubtractFilter.$stateful = angularMomentConfig.statefulFilters;

				return amSubtractFilter;
			}])

		/**
		 * @ngdoc filter
		 * @name angularMoment.filter:amAdd
		 * @module angularMoment
		 * @function
		 */
			.filter('amAdd', ['moment', 'angularMomentConfig', function (moment, angularMomentConfig) {
				function amAddFilter(value, amount, type) {

					if (typeof value === 'undefined' || value === null) {
						return '';
					}

					return moment(value).add(parseInt(amount, 10), type);
				}

				amAddFilter.$stateful = angularMomentConfig.statefulFilters;

				return amAddFilter;
			}]);
	}

	if (typeof define === 'function' && define.amd) {
		define(['angular', 'moment'], angularMoment);
	} else if (typeof module !== 'undefined' && module && module.exports) {
		angularMoment(angular, require('moment'));
		module.exports = 'angularMoment';
	} else {
		angularMoment(angular, (typeof global !== 'undefined' ? global : window).moment);
	}
})();

/*
Project: angular-gantt v1.2.13 - Gantt chart component for AngularJS
Authors: Marco Schweighauser, Rémi Alvergnat
License: MIT
Homepage: https://www.angular-gantt.com
Github: https://github.com/angular-gantt/angular-gantt.git
*/
(function(){
    'use strict';
    angular.module('gantt', ['gantt.templates', 'angularMoment'])
        .directive('gantt', ['Gantt', 'ganttEnableNgAnimate', '$timeout', '$templateCache', function(Gantt, enableNgAnimate, $timeout, $templateCache) {
        return {
            restrict: 'A',
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
                if (tAttrs.templateUrl === undefined) {
                    templateUrl = 'template/gantt.tmpl.html';
                } else {
                    templateUrl = tAttrs.templateUrl;
                }
                if (tAttrs.template !== undefined) {
                    $templateCache.put(templateUrl, tAttrs.template);
                }
                return templateUrl;
            },
            scope: {
                sortMode: '=?',
                filterTask: '=?',
                filterTaskComparator: '=?',
                filterRow: '=?',
                filterRowComparator: '=?',
                viewScale: '=?',
                columnWidth: '=?',
                expandToFit: '=?',
                shrinkToFit: '=?',
                showSide: '=?',
                allowSideResizing: '=?',
                fromDate: '=?',
                toDate: '=?',
                currentDateValue: '=?',
                currentDate: '=?',
                daily: '=?',
                autoExpand: '=?',
                taskOutOfRange: '=?',
                taskContent: '=?',
                rowContent: '=?',
                maxHeight: '=?',
                sideWidth: '=?',
                headers: '=?',
                headersFormats: '=?',
                timeFrames: '=?',
                dateFrames: '=?',
                timeFramesWorkingMode: '=?',
                timeFramesNonWorkingMode: '=?',
                timespans: '=?',
                columnMagnet: '=?',
                shiftColumnMagnet: '=?',
                timeFramesMagnet: '=?',
                data: '=?',
                api: '=?',
                options: '=?'
            },
            controller: ['$scope', '$element', function($scope, $element) {
                for (var option in $scope.options) {
                    $scope[option] = $scope.options[option];
                }

                // Disable animation if ngAnimate is present, as it drops down performance.
                enableNgAnimate($element, false);

                $scope.gantt = new Gantt($scope, $element);
                this.gantt = $scope.gantt;
            }],
            link: function(scope, element) {
                scope.gantt.api.directives.raise.new('gantt', scope, element);
                scope.$on('$destroy', function() {
                    scope.gantt.api.directives.raise.destroy('gantt', scope, element);
                });

                $timeout(function() {
                    scope.gantt.initialized();
                });
            }
        };
    }]);
}());


// This file is adapted from Angular UI ngGrid project
// MIT License
// https://github.com/angular-ui/ng-grid/blob/v3.0.0-rc.20/src/js/core/factories/GridApi.js
(function() {
    'use strict';

    angular.module('gantt')
        .factory('GanttApi', ['$q', '$rootScope', 'ganttUtils',
            function($q, $rootScope, utils) {
                /**
                 * @ngdoc function
                 * @name gantt.class:GanttApi
                 * @description GanttApi provides the ability to register public methods events inside the gantt and allow
                 * for other components to use the api via featureName.raise.methodName and featureName.on.eventName(function(args){}.
                 * @param {object} gantt gantt that owns api
                 */
                var GanttApi = function GanttApi(gantt) {
                    this.gantt = gantt;
                    this.listeners = [];
                    this.apiId = utils.newId();
                };

                function registerEventWithAngular(eventId, handler, gantt, _this) {
                    return $rootScope.$on(eventId, function() {
                        var args = Array.prototype.slice.call(arguments);
                        args.splice(0, 1); //remove evt argument
                        handler.apply(_this ? _this : gantt.api, args);
                    });
                }

                /**
                 * @ngdoc function
                 * @name gantt.class:suppressEvents
                 * @methodOf gantt.class:GanttApi
                 * @description Used to execute a function while disabling the specified event listeners.
                 * Disables the listenerFunctions, executes the callbackFn, and then enables
                 * the listenerFunctions again
                 * @param {object} listenerFuncs listenerFunc or array of listenerFuncs to suppress. These must be the same
                 * functions that were used in the .on.eventName method
                 * @param {object} callBackFn function to execute
                 * @example
                 * <pre>
                 *    var navigate = function (newRowCol, oldRowCol){
                 *       //do something on navigate
                 *    }
                 *
                 *    ganttApi.cellNav.on.navigate(scope,navigate);
                 *
                 *
                 *    //call the scrollTo event and suppress our navigate listener
                 *    //scrollTo will still raise the event for other listeners
                 *    ganttApi.suppressEvents(navigate, function(){
                 *       ganttApi.cellNav.scrollTo(aRow, aCol);
                 *    });
                 *
                 * </pre>
                 */
                GanttApi.prototype.suppressEvents = function(listenerFuncs, callBackFn) {
                    var self = this;
                    var listeners = angular.isArray(listenerFuncs) ? listenerFuncs : [listenerFuncs];

                    //find all registered listeners
                    var foundListeners = [];
                    listeners.forEach(function(l) {
                        foundListeners = self.listeners.filter(function(lstnr) {
                            return l === lstnr.handler;
                        });
                    });

                    //deregister all the listeners
                    foundListeners.forEach(function(l) {
                        l.dereg();
                    });

                    callBackFn();

                    //reregister all the listeners
                    foundListeners.forEach(function(l) {
                        l.dereg = registerEventWithAngular(l.eventId, l.handler, self.gantt, l._this);
                    });

                };

                /**
                 * @ngdoc function
                 * @name registerEvent
                 * @methodOf gantt.class:GanttApi
                 * @description Registers a new event for the given feature.  The event will get a
                 * .raise and .on prepended to it
                 * <br>
                 * .raise.eventName() - takes no arguments
                 * <br/>
                 * <br/>
                 * .on.eventName(scope, callBackFn, _this)
                 * <br/>
                 * scope - a scope reference to add a deregister call to the scopes .$on('destroy')
                 * <br/>
                 * callBackFn - The function to call
                 * <br/>
                 * _this - optional this context variable for callbackFn. If omitted, gantt.api will be used for the context
                 * <br/>
                 * .on.eventName returns a dereg funtion that will remove the listener.  It's not necessary to use it as the listener
                 * will be removed when the scope is destroyed.
                 * @param {string} featureName name of the feature that raises the event
                 * @param {string} eventName  name of the event
                 */
                GanttApi.prototype.registerEvent = function(featureName, eventName) {
                    var self = this;
                    if (!self[featureName]) {
                        self[featureName] = {};
                    }

                    var feature = self[featureName];
                    if (!feature.on) {
                        feature.on = {};
                        feature.raise = {};
                    }

                    var eventId = 'event:gantt:' + this.apiId + ':' + featureName + ':' + eventName;

                    // Creating raise event method featureName.raise.eventName
                    feature.raise[eventName] = function() {
                        $rootScope.$emit.apply($rootScope, [eventId].concat(Array.prototype.slice.call(arguments)));
                    };

                    // Creating on event method featureName.oneventName
                    feature.on[eventName] = function(scope, handler, _this) {
                        var deregAngularOn = registerEventWithAngular(eventId, handler, self.gantt, _this);

                        //track our listener so we can turn off and on
                        var listener = {
                            handler: handler,
                            dereg: deregAngularOn,
                            eventId: eventId,
                            scope: scope,
                            _this: _this
                        };
                        self.listeners.push(listener);

                        var removeListener = function() {
                            listener.dereg();
                            var index = self.listeners.indexOf(listener);
                            self.listeners.splice(index, 1);
                        };

                        //destroy tracking when scope is destroyed
                        scope.$on('$destroy', function() {
                            removeListener();
                        });

                        return removeListener;
                    };
                };

                /**
                 * @ngdoc function
                 * @name registerEventsFromObject
                 * @methodOf gantt.class:GanttApi
                 * @description Registers features and events from a simple objectMap.
                 * eventObjectMap must be in this format (multiple features allowed)
                 * <pre>
                 * {featureName:
                 *        {
                 *          eventNameOne:function(args){},
                 *          eventNameTwo:function(args){}
                 *        }
                 *  }
                 * </pre>
                 * @param {object} eventObjectMap map of feature/event names
                 */
                GanttApi.prototype.registerEventsFromObject = function(eventObjectMap) {
                    var self = this;
                    var features = [];
                    angular.forEach(eventObjectMap, function(featProp, featPropName) {
                        var feature = {name: featPropName, events: []};
                        angular.forEach(featProp, function(prop, propName) {
                            feature.events.push(propName);
                        });
                        features.push(feature);
                    });

                    features.forEach(function(feature) {
                        feature.events.forEach(function(event) {
                            self.registerEvent(feature.name, event);
                        });
                    });

                };

                /**
                 * @ngdoc function
                 * @name registerMethod
                 * @methodOf gantt.class:GanttApi
                 * @description Registers a new event for the given feature
                 * @param {string} featureName name of the feature
                 * @param {string} methodName  name of the method
                 * @param {object} callBackFn function to execute
                 * @param {object} _this binds callBackFn 'this' to _this.  Defaults to ganttApi.gantt
                 */
                GanttApi.prototype.registerMethod = function(featureName, methodName, callBackFn, _this) {
                    if (!this[featureName]) {
                        this[featureName] = {};
                    }

                    var feature = this[featureName];

                    feature[methodName] = utils.createBoundedWrapper(_this || this.gantt, callBackFn);
                };

                /**
                 * @ngdoc function
                 * @name registerMethodsFromObject
                 * @methodOf gantt.class:GanttApi
                 * @description Registers features and methods from a simple objectMap.
                 * eventObjectMap must be in this format (multiple features allowed)
                 * <br>
                 * {featureName:
                 *        {
                 *          methodNameOne:function(args){},
                 *          methodNameTwo:function(args){}
                 *        }
                 * @param {object} eventObjectMap map of feature/event names
                 * @param {object} _this binds this to _this for all functions.  Defaults to ganttApi.gantt
                 */
                GanttApi.prototype.registerMethodsFromObject = function(methodMap, _this) {
                    var self = this;
                    var features = [];
                    angular.forEach(methodMap, function(featProp, featPropName) {
                        var feature = {name: featPropName, methods: []};
                        angular.forEach(featProp, function(prop, propName) {
                            feature.methods.push({name: propName, fn: prop});
                        });
                        features.push(feature);
                    });

                    features.forEach(function(feature) {
                        feature.methods.forEach(function(method) {
                            self.registerMethod(feature.name, method.name, method.fn, _this);
                        });
                    });

                };

                return GanttApi;

            }]);

})();

(function() {
    'use strict';
    angular.module('gantt').factory('GanttOptions', [function() {
        var GanttOptions = function(values, defaultValues) {
            this.defaultValues = defaultValues;
            this.values = values;

            this.defaultValue = function(optionName) {
                var defaultValue = this.defaultValues[optionName];
                if (angular.isFunction(defaultValue)) {
                    defaultValue = defaultValue();
                }

                return defaultValue;
            };

            this.sanitize = function(optionName, optionValue) {
                if (!optionValue) {
                    var defaultValue = this.defaultValue(optionName);
                    if (defaultValue !== undefined) {
                        if (optionValue !== undefined && typeof defaultValue === 'boolean') {
                            return optionValue;
                        }

                        return defaultValue;
                    }
                }

                return optionValue;
            };

            this.value = function(optionName) {
                return this.sanitize(optionName, this.values[optionName]);
            };

            this.set = function(optionName, optionValue) {
                this.values[optionName] = optionValue;
            };

            this.initialize = function() {
                for (var optionName in this.values) {
                    var optionValue = this.values[optionName];
                    if (this.values.hasOwnProperty(optionName)) {
                        this.values[optionName] = this.value(optionName, optionValue);
                    }
                }
                return this.values;
            };
        };

        return GanttOptions;
    }]);
}());

(function(){
    'use strict';
    /**
     * Calendar factory is used to define working periods, non working periods, and other specific period of time,
     * and retrieve effective timeFrames for each day of the gantt.
     */
    angular.module('gantt').factory('GanttCalendar', ['$filter', 'moment', function($filter, moment) {
        /**
         * TimeFrame represents time frame in any day. parameters are given using options object.
         *
         * @param {moment|string} start start of timeFrame. If a string is given, it will be parsed as a moment.
         * @param {moment|string} end end of timeFrame. If a string is given, it will be parsed as a moment.
         * @param {boolean} working is this timeFrame flagged as working.
         * @param {boolean} magnet is this timeFrame will magnet.
         * @param {boolean} default is this timeFrame will be used as default.
         * @param {color} css color attached to this timeFrame.
         * @param {string} classes css classes attached to this timeFrame.
         *
         * @constructor
         */
        var TimeFrame = function(options) {
            if (options === undefined) {
                options = {};
            }

            this.start = options.start;
            this.end = options.end;
            this.working = options.working;
            this.magnet = options.magnet !== undefined ? options.magnet : true;
            this.default = options.default;
            this.color = options.color;
            this.classes = options.classes;
            this.internal = options.internal;
        };

        TimeFrame.prototype.updateView = function() {
            if (this.$element) {
                var cssStyles = {};

                if (this.left !== undefined) {
                    cssStyles.left = this.left + 'px';
                } else {
                    cssStyles.left = '';
                }
                if (this.width !== undefined) {
                    cssStyles.width = this.width + 'px';
                } else {
                    cssStyles.width = '';
                }

                if (this.color !== undefined) {
                    cssStyles['background-color'] = this.color;
                } else {
                    cssStyles['background-color'] = '';
                }

                this.$element.css(cssStyles);

                var classes = ['gantt-timeframe' + (this.working ? '' : '-non') + '-working'];
                if (this.classes) {
                    classes = classes.concat(this.classes);
                }
                for (var i = 0, l = classes.length; i < l; i++) {
                    this.$element.toggleClass(classes[i], true);
                }
            }
        };

        TimeFrame.prototype.getDuration = function() {
            if (this.end !== undefined && this.start !== undefined) {
                return this.end.diff(this.start, 'milliseconds');
            }
        };

        TimeFrame.prototype.clone = function() {
            return new TimeFrame(this);
        };

        /**
         * TimeFrameMapping defines how timeFrames will be placed for each days. parameters are given using options object.
         *
         * @param {function} func a function with date parameter, that will be evaluated for each distinct day of the gantt.
         *                        this function must return an array of timeFrame names to apply.
         * @constructor
         */
        var TimeFrameMapping = function(func) {
            this.func = func;
        };

        TimeFrameMapping.prototype.getTimeFrames = function(date) {
            var ret = this.func(date);
            if (!(ret instanceof Array)) {
                ret = [ret];
            }
            return ret;
        };

        TimeFrameMapping.prototype.clone = function() {
            return new TimeFrameMapping(this.func);
        };

        /**
         * A DateFrame is date range that will use a specific TimeFrameMapping, configured using a function (evaluator),
         * a date (date) or a date range (start, end). parameters are given using options object.
         *
         * @param {function} evaluator a function with date parameter, that will be evaluated for each distinct day of the gantt.
         *                   this function must return a boolean representing matching of this dateFrame or not.
         * @param {moment} date date of dateFrame.
         * @param {moment} start start of date frame.
         * @param {moment} end end of date frame.
         * @param {array} targets array of TimeFrameMappings/TimeFrames names to use for this date frame.
         * @param {boolean} default is this dateFrame will be used as default.
         * @constructor
         */
        var DateFrame = function(options) {
            this.evaluator = options.evaluator;
            if (options.date) {
                this.start = moment(options.date).startOf('day');
                this.end = moment(options.date).endOf('day');
            } else {
                this.start = options.start;
                this.end = options.end;
            }
            if (options.targets instanceof Array) {
                this.targets = options.targets;
            } else {
                this.targets = [options.targets];
            }
            this.default = options.default;
        };

        DateFrame.prototype.dateMatch = function(date) {
            if (this.evaluator) {
                return this.evaluator(date);
            } else if (this.start && this.end) {
                return date >= this.start && date <= this.end;
            } else {
                return false;
            }
        };

        DateFrame.prototype.clone = function() {
            return new DateFrame(this);
        };



        /**
         * Register TimeFrame, TimeFrameMapping and DateMapping objects into Calendar object,
         * and use Calendar#getTimeFrames(date) function to retrieve effective timeFrames for a specific day.
         *
         * @constructor
         */
        var Calendar = function() {
            this.timeFrames = {};
            this.timeFrameMappings = {};
            this.dateFrames = {};
        };

        /**
         * Remove all objects.
         */
        Calendar.prototype.clear = function() {
            this.timeFrames = {};
            this.timeFrameMappings = {};
            this.dateFrames = {};
        };

        /**
         * Register TimeFrame objects.
         *
         * @param {object} timeFrames with names of timeFrames for keys and TimeFrame objects for values.
         */
        Calendar.prototype.registerTimeFrames = function(timeFrames) {
            angular.forEach(timeFrames, function(timeFrame, name) {
                this.timeFrames[name] = new TimeFrame(timeFrame);
            }, this);
        };

        /**
         * Removes TimeFrame objects.
         *
         * @param {array} timeFrames names of timeFrames to remove.
         */
        Calendar.prototype.removeTimeFrames = function(timeFrames) {
            angular.forEach(timeFrames, function(name) {
                delete this.timeFrames[name];
            }, this);
        };

        /**
         * Remove all TimeFrame objects.
         */
        Calendar.prototype.clearTimeFrames = function() {
            this.timeFrames = {};
        };

        /**
         * Register TimeFrameMapping objects.
         *
         * @param {object} mappings object with names of timeFrames mappings for keys and TimeFrameMapping objects for values.
         */
        Calendar.prototype.registerTimeFrameMappings = function(mappings) {
            angular.forEach(mappings, function(timeFrameMapping, name) {
                this.timeFrameMappings[name] = new TimeFrameMapping(timeFrameMapping);
            }, this);
        };

        /**
         * Removes TimeFrameMapping objects.
         *
         * @param {array} mappings names of timeFrame mappings to remove.
         */
        Calendar.prototype.removeTimeFrameMappings = function(mappings) {
            angular.forEach(mappings, function(name) {
                delete this.timeFrameMappings[name];
            }, this);
        };

        /**
         * Removes all TimeFrameMapping objects.
         */
        Calendar.prototype.clearTimeFrameMappings = function() {
            this.timeFrameMappings = {};
        };

        /**
         * Register DateFrame objects.
         *
         * @param {object} dateFrames object with names of dateFrames for keys and DateFrame objects for values.
         */
        Calendar.prototype.registerDateFrames = function(dateFrames) {
            angular.forEach(dateFrames, function(dateFrame, name) {
                this.dateFrames[name] = new DateFrame(dateFrame);
            }, this);
        };

        /**
         * Remove DateFrame objects.
         *
         * @param {array} mappings names of date frames to remove.
         */
        Calendar.prototype.removeDateFrames = function(dateFrames) {
            angular.forEach(dateFrames, function(name) {
                delete this.dateFrames[name];
            }, this);
        };

        /**
         * Removes all DateFrame objects.
         */
        Calendar.prototype.clearDateFrames = function() {
            this.dateFrames = {};
        };

        var filterDateFrames = function(inputDateFrames, date) {
            var dateFrames = [];
            angular.forEach(inputDateFrames, function(dateFrame) {
                if (dateFrame.dateMatch(date)) {
                    dateFrames.push(dateFrame);
                }
            });
            if (dateFrames.length === 0) {
                angular.forEach(inputDateFrames, function(dateFrame) {
                    if (dateFrame.default) {
                        dateFrames.push(dateFrame);
                    }
                });
            }
            return dateFrames;
        };

        /**
         * Retrieves TimeFrame objects for a given date, using whole configuration for this Calendar object.
         *
         * @param {moment} date
         *
         * @return {array} an array of TimeFrame objects.
         */
        Calendar.prototype.getTimeFrames = function(date) {
            var timeFrames = [];
            var dateFrames = filterDateFrames(this.dateFrames, date);

            for (var i=0; i < dateFrames.length; i++) {
                if (dateFrames[i] !== undefined) {
                    var targets = dateFrames[i].targets;

                    for (var j=0; j < targets.length; j++) {
                        var timeFrameMapping = this.timeFrameMappings[targets[j]];
                        if (timeFrameMapping !== undefined) {
                            // If a timeFrame mapping is found
                            timeFrames.push(timeFrameMapping.getTimeFrames());
                        } else {
                            // If no timeFrame mapping is found, try using direct timeFrame
                            var timeFrame = this.timeFrames[targets[j]];
                            if (timeFrame !== undefined) {
                                timeFrames.push(timeFrame);
                            }
                        }
                    }
                }
            }

            var dateYear = date.year();
            var dateMonth = date.month();
            var dateDate = date.date();

            var validatedTimeFrames = [];
            if (timeFrames.length === 0) {
                angular.forEach(this.timeFrames, function(timeFrame) {
                    if (timeFrame.default) {
                        timeFrames.push(timeFrame);
                    }
                });
            }

            for (i=0; i < timeFrames.length; i++) {
                var cTimeFrame = timeFrames[i].clone();

                if (cTimeFrame.start !== undefined) {
                    cTimeFrame.start.year(dateYear);
                    cTimeFrame.start.month(dateMonth);
                    cTimeFrame.start.date(dateDate);
                }

                if (cTimeFrame.end !== undefined) {
                    cTimeFrame.end.year(dateYear);
                    cTimeFrame.end.month(dateMonth);
                    cTimeFrame.end.date(dateDate);

                    if (moment(cTimeFrame.end).startOf('day') === cTimeFrame.end) {
                        cTimeFrame.end.add(1, 'day');
                    }
                }

                validatedTimeFrames.push(cTimeFrame);
            }

            return validatedTimeFrames;
        };

        /**
         * Solve timeFrames.
         *
         * Smaller timeFrames have priority over larger one.
         *
         * @param {array} timeFrames Array of timeFrames to solve
         * @param {moment} startDate
         * @param {moment} endDate
         */
        Calendar.prototype.solve = function(timeFrames, startDate, endDate) {
            var color;
            var classes;
            var minDate;
            var maxDate;

            for (var i=0; i<timeFrames.length; i++) {
                var timeFrame = timeFrames[i];
                if (minDate === undefined || minDate > timeFrame.start) {
                    minDate = timeFrame.start;
                }
                if (maxDate === undefined || maxDate < timeFrame.end) {
                    maxDate = timeFrame.end;
                }
                if (color === undefined && timeFrame.color) {
                    color = timeFrame.color;
                }
                if (timeFrame.classes !== undefined) {
                    if (classes === undefined) {
                        classes = [];
                    }
                    classes = classes.concat(timeFrame.classes);
                }
            }

            if (startDate === undefined) {
                startDate = minDate;
            }

            if (endDate === undefined) {
                endDate = maxDate;
            }

            var solvedTimeFrames = [new TimeFrame({start: startDate, end: endDate, internal: true})];

            timeFrames = $filter('filter')(timeFrames, function(timeFrame) {
                return (timeFrame.start === undefined || timeFrame.start < endDate) && (timeFrame.end === undefined || timeFrame.end > startDate);
            });

            for (i=0; i<timeFrames.length; i++) {
                var cTimeFrame = timeFrames[i];
                if (!cTimeFrame.start) {
                    cTimeFrame.start = startDate;
                }
                if (!cTimeFrame.end) {
                    cTimeFrame.end = endDate;
                }
            }

            var orderedTimeFrames = $filter('orderBy')(timeFrames, function(timeFrame) {
                return -timeFrame.getDuration();
            });

            var k;
            for (i=0; i<orderedTimeFrames.length; i++) {
                var oTimeFrame = orderedTimeFrames[i];

                var tmpSolvedTimeFrames = solvedTimeFrames.slice();

                k=0;
                var dispatched = false;
                var treated = false;

                for (var j=0; j<solvedTimeFrames.length; j++) {
                    var sTimeFrame = solvedTimeFrames[j];

                    if (!treated) {
                        if (!oTimeFrame.end && !oTimeFrame.start) {
                            // timeFrame is infinite.
                            tmpSolvedTimeFrames.splice(k, 0, oTimeFrame);
                            treated = true;
                            dispatched = false;
                        } else if (oTimeFrame.end > sTimeFrame.start && oTimeFrame.start < sTimeFrame.end) {
                            // timeFrame is included in this solvedTimeFrame.
                            // solvedTimeFrame:|ssssssssssssssssssssssssssssssssss|
                            //       timeFrame:          |tttttt|
                            //          result:|sssssssss|tttttt|sssssssssssssssss|

                            var newSolvedTimeFrame = sTimeFrame.clone();

                            sTimeFrame.end = moment(oTimeFrame.start);
                            newSolvedTimeFrame.start = moment(oTimeFrame.end);

                            tmpSolvedTimeFrames.splice(k + 1, 0, oTimeFrame.clone(), newSolvedTimeFrame);
                            treated = true;
                            dispatched = false;
                        } else if (!dispatched && oTimeFrame.start < sTimeFrame.end) {
                            // timeFrame is dispatched on two solvedTimeFrame.
                            // First part
                            // solvedTimeFrame:|sssssssssssssssssssssssssssssssssss|s+1;s+1;s+1;s+1;s+1;s+1|
                            //       timeFrame:                                |tttttt|
                            //          result:|sssssssssssssssssssssssssssssss|tttttt|;s+1;s+1;s+1;s+1;s+1|

                            sTimeFrame.end = moment(oTimeFrame.start);
                            tmpSolvedTimeFrames.splice(k + 1, 0, oTimeFrame.clone());

                            dispatched = true;
                        } else if (dispatched && oTimeFrame.end > sTimeFrame.start) {
                            // timeFrame is dispatched on two solvedTimeFrame.
                            // Second part

                            sTimeFrame.start = moment(oTimeFrame.end);
                            dispatched = false;
                            treated = true;
                        }
                        k++;
                    }
                }

                solvedTimeFrames = tmpSolvedTimeFrames;
            }

            solvedTimeFrames = $filter('filter')(solvedTimeFrames, function(timeFrame) {
                return !timeFrame.internal &&
                    (timeFrame.start === undefined || timeFrame.start < endDate) &&
                    (timeFrame.end === undefined || timeFrame.end > startDate);
            });

            return solvedTimeFrames;

        };

        return Calendar;
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').factory('GanttCurrentDateManager', ['moment', function(moment) {
        var GanttCurrentDateManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.date = undefined;
            this.position = undefined;
            this.currentDateColumn = undefined;

            this.gantt.$scope.simplifyMoment = function(d) {
                return moment.isMoment(d) ? d.unix() : d;
            };

            this.gantt.$scope.$watchGroup(['currentDate', 'simplifyMoment(currentDateValue)'], function(newValues, oldValues) {
                if (newValues !== oldValues) {
                    self.setCurrentDate(self.gantt.options.value('currentDateValue'));
                }
            });
        };

        GanttCurrentDateManager.prototype.setCurrentDate = function(currentDate) {
            this.date = currentDate;
            var oldColumn = this.currentDateColumn;
            var newColumn;

            if (this.date !== undefined && this.gantt.options.value('currentDate') === 'column') {
                newColumn = this.gantt.columnsManager.getColumnByDate(this.date, true);
            }
            this.currentDateColumn = newColumn;

            if (oldColumn !== newColumn) {
                if (oldColumn !== undefined) {
                    oldColumn.currentDate = false;
                    oldColumn.updateView();
                }
                if (newColumn !== undefined) {
                    newColumn.currentDate = true;
                    newColumn.updateView();
                }
            }

            this.position = this.gantt.getPositionByDate(this.date, true);
        };
        return GanttCurrentDateManager;
    }]);
}());

(function() {
    'use strict';
    angular.module('gantt').factory('GanttColumn', ['moment', function(moment) {
        // Used to display the Gantt grid and header.
        // The columns are generated by the column generator.
        var Column = function(date, endDate, left, width, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode) {
            this.date = date;
            this.endDate = endDate;
            this.left = left;
            this.width = width;
            this.calendar = calendar;
            this.duration = this.endDate.diff(this.date, 'milliseconds');
            this.timeFramesWorkingMode = timeFramesWorkingMode;
            this.timeFramesNonWorkingMode = timeFramesNonWorkingMode;
            this.timeFrames = [];
            this.currentDate = false;
            this.visibleTimeFrames = [];
            this.daysTimeFrames = {};
            this.cropped = false;
            this.originalSize = {left: this.left, width: this.width};
            this.updateTimeFrames();
        };

        var getDateKey = function(date) {
            return date.year() + '-' + date.month() + '-' + date.date();
        };

        Column.prototype.updateView = function() {
            if (this.$element) {
                if (this.currentDate) {
                    this.$element.addClass('gantt-foreground-col-current-date');
                } else {
                    this.$element.removeClass('gantt-foreground-col-current-date');
                }

                this.$element.css({'left': this.left + 'px', 'width': this.width + 'px'});

                for (var i = 0, l = this.timeFrames.length; i < l; i++) {
                    this.timeFrames[i].updateView();
                }
            }
        };

        Column.prototype.updateTimeFrames = function() {
            var self = this;

            if (self.calendar !== undefined && (self.timeFramesNonWorkingMode !== 'hidden' || self.timeFramesWorkingMode !== 'hidden')) {
                var cDate = self.date;
                var cDateStartOfDay = moment(cDate).startOf('day');
                var cDateNextDay = cDateStartOfDay.add(1, 'day');
                var i;
                while (cDate < self.endDate) {
                    var timeFrames = self.calendar.getTimeFrames(cDate);
                    var nextCDate = moment.min(cDateNextDay, self.endDate);
                    timeFrames = self.calendar.solve(timeFrames, cDate, nextCDate);
                    var cTimeFrames = [];
                    for (i=0; i < timeFrames.length; i++) {
                        var cTimeFrame = timeFrames[i];

                        var start = cTimeFrame.start;
                        if (start === undefined) {
                            start = cDate;
                        }

                        var end = cTimeFrame.end;
                        if (end === undefined) {
                            end = nextCDate;
                        }

                        if (start < self.date) {
                            start = self.date;
                        }

                        if (end > self.endDate) {
                            end = self.endDate;
                        }

                        cTimeFrame = cTimeFrame.clone();

                        cTimeFrame.start = moment(start);
                        cTimeFrame.end = moment(end);

                        cTimeFrames.push(cTimeFrame);
                    }
                    self.timeFrames = self.timeFrames.concat(cTimeFrames);

                    var cDateKey = getDateKey(cDate);
                    self.daysTimeFrames[cDateKey] = cTimeFrames;

                    cDate = nextCDate;
                    cDateStartOfDay = moment(cDate).startOf('day');
                    cDateNextDay = cDateStartOfDay.add(1, 'day');
                }

                for (i=0; i < self.timeFrames.length; i++) {
                    var timeFrame = self.timeFrames[i];

                    var positionDuration = timeFrame.start.diff(self.date, 'milliseconds');
                    var position = positionDuration / self.duration * self.width;

                    var timeFrameDuration = timeFrame.end.diff(timeFrame.start, 'milliseconds');
                    var timeFramePosition = timeFrameDuration / self.duration * self.width;

                    var hidden = false;
                    if (timeFrame.working && self.timeFramesWorkingMode !== 'visible') {
                        hidden = true;
                    } else if (!timeFrame.working && self.timeFramesNonWorkingMode !== 'visible') {
                        hidden = true;
                    }

                    if (!hidden) {
                        self.visibleTimeFrames.push(timeFrame);
                    }

                    timeFrame.hidden = hidden;
                    timeFrame.left = position;
                    timeFrame.width = timeFramePosition;
                    timeFrame.originalSize = {left: timeFrame.left, width: timeFrame.width};
                }

                if (self.timeFramesNonWorkingMode === 'cropped' || self.timeFramesWorkingMode === 'cropped') {
                    var timeFramesWidth = 0;
                    for (var j=0; j < self.timeFrames.length; j++) {
                        var aTimeFrame = self.timeFrames[j];
                        if (!aTimeFrame.working && self.timeFramesNonWorkingMode !== 'cropped' ||
                            aTimeFrame.working && self.timeFramesWorkingMode !== 'cropped') {
                            timeFramesWidth += aTimeFrame.width;
                        }
                    }

                    if (timeFramesWidth !== self.width) {
                        var croppedRatio = self.width / timeFramesWidth;
                        var croppedWidth = 0;
                        var originalCroppedWidth = 0;

                        var allCropped = true;

                        for (j=0; j < self.timeFrames.length; j++) {
                            var bTimeFrame = self.timeFrames[j];

                            if (!bTimeFrame.working && self.timeFramesNonWorkingMode !== 'cropped' ||
                                bTimeFrame.working && self.timeFramesWorkingMode !== 'cropped') {
                                bTimeFrame.left = (bTimeFrame.left - croppedWidth) * croppedRatio;
                                bTimeFrame.width = bTimeFrame.width * croppedRatio;
                                bTimeFrame.originalSize.left = (bTimeFrame.originalSize.left - originalCroppedWidth) * croppedRatio;
                                bTimeFrame.originalSize.width = bTimeFrame.originalSize.width * croppedRatio;
                                bTimeFrame.cropped = false;
                                allCropped = false;
                            } else {
                                croppedWidth += bTimeFrame.width;
                                originalCroppedWidth += bTimeFrame.originalSize.width;
                                bTimeFrame.left = undefined;
                                bTimeFrame.width = 0;
                                bTimeFrame.originalSize = {left: undefined, width: 0};
                                bTimeFrame.cropped = true;
                            }
                        }

                        self.cropped = allCropped;
                    } else {
                        self.cropped = false;
                    }
                }
            }
        };

        Column.prototype.clone = function() {
            return new Column(moment(this.date), moment(this.endDate), this.left, this.width, this.calendar);
        };

        Column.prototype.containsDate = function(date) {
            return date > this.date && date <= this.endDate;
        };

        Column.prototype.equals = function(other) {
            return this.date === other.date;
        };

        Column.prototype.roundTo = function(date, unit, offset, midpoint) {
            // Waiting merge of https://github.com/moment/moment/pull/1794
            if (unit === 'day') {
                // Inconsistency in units in momentJS.
                unit = 'date';
            }

            offset = offset || 1;
            var value = date.get(unit);

            switch (midpoint) {
                case 'up':
                    value = Math.ceil(value / offset);
                    break;
                case 'down':
                    value = Math.floor(value / offset);
                    break;
                default:
                    value = Math.round(value / offset);
                    break;
            }

            var units = ['millisecond', 'second', 'minute', 'hour', 'date', 'month', 'year'];
            date.set(unit, value * offset);

            var indexOf = units.indexOf(unit);
            for (var i = 0; i < indexOf; i++) {
                date.set(units[i], 0);
            }

            return date;
        };

        Column.prototype.getMagnetDate = function(date, magnetValue, magnetUnit, timeFramesMagnet) {
            if (magnetValue > 0 && magnetUnit !== undefined) {
                var initialDate = date;
                date = moment(date);

                if (magnetUnit === 'column') {
                    // Snap to column borders only.
                    var position = this.getPositionByDate(date);

                    if (position < this.width / 2) {
                        date = moment(this.date);
                    } else {
                        date = moment(this.endDate);
                    }
                } else {
                    // Round the value
                    date = this.roundTo(date, magnetUnit, magnetValue);

                    // Snap to column borders if date overflows.
                    if (date < this.date) {
                        date = moment(this.date);
                    } else if (date > this.endDate) {
                        date = moment(this.endDate);
                    }
                }

                if (timeFramesMagnet) {
                    var maxTimeFrameDiff = Math.abs(initialDate.diff(date, 'milliseconds'));
                    var currentTimeFrameDiff;

                    for (var i=0; i<this.timeFrames.length; i++) {
                        var timeFrame = this.timeFrames[i];
                        if (timeFrame.magnet) {
                            var previousTimeFrame = this.timeFrames[i-1];
                            var nextTimeFrame = this.timeFrames[i+1];
                            var timeFrameDiff;

                            if (previousTimeFrame === undefined || previousTimeFrame.working !== timeFrame.working) {
                                timeFrameDiff = Math.abs(initialDate.diff(timeFrame.start, 'milliseconds'));
                                if (timeFrameDiff < maxTimeFrameDiff && (currentTimeFrameDiff === undefined || timeFrameDiff < currentTimeFrameDiff)) {
                                    currentTimeFrameDiff = timeFrameDiff;
                                    date = timeFrame.start;
                                }
                            }

                            if (nextTimeFrame === undefined || nextTimeFrame.working !== timeFrame.working) {
                                timeFrameDiff = Math.abs(initialDate.diff(timeFrame.end, 'milliseconds'));
                                if (timeFrameDiff < maxTimeFrameDiff && (currentTimeFrameDiff === undefined || timeFrameDiff < currentTimeFrameDiff)) {
                                    currentTimeFrameDiff = timeFrameDiff;
                                    date = timeFrame.end;
                                }
                            }
                        }
                    }
                }
            }
            return date;
        };

        Column.prototype.getDateByPositionUsingTimeFrames = function(position) {
            for (var i = 0, l = this.timeFrames.length; i < l; i++) {
                // TODO: performance optimization could be done.
                var timeFrame = this.timeFrames[i];
                if (!timeFrame.cropped && position >= timeFrame.left && position <= timeFrame.left + timeFrame.width) {
                    var positionDuration = timeFrame.getDuration() / timeFrame.width * (position - timeFrame.left);
                    var date = moment(timeFrame.start).add(positionDuration, 'milliseconds');
                    return date;
                }
            }
        };

        Column.prototype.getDateByPosition = function(position, magnetValue, magnetUnit, timeFramesMagnet) {
            var positionDuration;
            var date;

            if (position < 0) {
                position = 0;
            }
            if (position > this.width) {
                position = this.width;
            }

            if (this.timeFramesNonWorkingMode === 'cropped' || this.timeFramesWorkingMode === 'cropped') {
                date = this.getDateByPositionUsingTimeFrames(position);
            }

            if (date === undefined) {
                positionDuration = this.duration / this.width * position;
                date = moment(this.date).add(positionDuration, 'milliseconds');
            }

            date = this.getMagnetDate(date, magnetValue, magnetUnit, timeFramesMagnet);

            return date;
        };

        Column.prototype.getDayTimeFrame = function(date) {
            var dtf = this.daysTimeFrames[getDateKey(date)];
            if (dtf === undefined) {
                return [];
            }
            return dtf;
        };

        Column.prototype.getPositionByDate = function(date) {
            var positionDuration;
            var position;

            if (this.timeFramesNonWorkingMode === 'cropped' || this.timeFramesWorkingMode === 'cropped') {
                var croppedDate = date;
                var timeFrames = this.getDayTimeFrame(croppedDate);
                for (var i = 0; i < timeFrames.length; i++) {
                    var timeFrame = timeFrames[i];
                    if (croppedDate >= timeFrame.start && croppedDate <= timeFrame.end) {
                        if (timeFrame.cropped) {
                            if (timeFrames.length > i + 1) {
                                croppedDate = timeFrames[i + 1].start;
                            } else {
                                croppedDate = timeFrame.end;
                            }
                        } else {
                            positionDuration = croppedDate.diff(timeFrame.start, 'milliseconds');
                            position = positionDuration / timeFrame.getDuration() * timeFrame.width;
                            return this.left + timeFrame.left + position;
                        }
                    }
                }
            }

            positionDuration = date.diff(this.date, 'milliseconds');
            position = positionDuration / this.duration * this.width;

            if (position < 0) {
                position = 0;
            }

            if (position > this.width) {
                position = this.width;
            }

            return this.left + position;
        };

        return Column;
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt').factory('GanttColumnBuilder', ['GanttColumn', function(Column) {
        // Builder for columns, based of data given by column generator and columnsManager.
        var ColumnBuilder = function(columnsManager) {
            this.columnsManager = columnsManager;
        };

        ColumnBuilder.prototype.newColumn = function(date, endDate, left, width) {
            var calendar = this.columnsManager.gantt.calendar;
            var timeFramesWorkingMode = this.columnsManager.gantt.options.value('timeFramesWorkingMode');
            var timeFramesNonWorkingMode = this.columnsManager.gantt.options.value('timeFramesNonWorkingMode');

            return new Column(date, endDate, left, width, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode);
        };

        return ColumnBuilder;
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt').service('GanttColumnGenerator', ['moment', function(moment) {

        // Columns are generated including or excluding the to date.
        // If the To date is the first day of month and the time is 00:00 then no new column is generated for this month.

        var isToDateToExclude = function(to, value, unit) {
            return moment(to).add(value, unit).startOf(unit) === to;
        };


        var getFirstValue = function(unit) {
            if (['hour', 'minute', 'second', 'millisecond'].indexOf(unit) >= 0) {
                return 0;
            }
        };

        var ensureNoUnitOverflow = function(unit, startDate, endDate) {
            var v1 = startDate.get(unit);
            var v2 = endDate.get(unit);
            var firstValue = getFirstValue(unit);
            if (firstValue !== undefined && v2 !== firstValue && v2 < v1) {
                endDate.set(unit, firstValue);
            }
        };

        // Generates one column for each time unit between the given from and to date.
        this.generate = function(builder, from, to, viewScale, columnWidth, maximumWidth, leftOffset, reverse) {
            if (!to && !maximumWidth) {
                throw 'to or maximumWidth must be defined';
            }

            viewScale = viewScale.trim();
            if (viewScale.charAt(viewScale.length - 1) === 's') {
                viewScale = viewScale.substring(0, viewScale.length - 1);
            }
            var viewScaleValue;
            var viewScaleUnit;
            var splittedViewScale;

            if (viewScale) {
                splittedViewScale = viewScale.split(' ');
            }
            if (splittedViewScale && splittedViewScale.length > 1) {
                viewScaleValue = parseFloat(splittedViewScale[0]);
                viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
            } else {
                viewScaleValue = 1;
                viewScaleUnit = viewScale;
            }

            var excludeTo = false;
            from = moment(from).startOf(viewScaleUnit);
            if (to) {
                excludeTo = isToDateToExclude(to);
                to = moment(to).startOf(viewScaleUnit);
            }

            var left = 0;
            var date = moment(from).startOf(viewScaleUnit);
            if (reverse) {
                date.add(-viewScaleValue, viewScaleUnit);
                left -= columnWidth;
            }
            var generatedCols = [];

            while (true) {
                if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                    break;
                }

                var startDate = moment(date);
                var endDate = moment(startDate).add(viewScaleValue, viewScaleUnit);
                ensureNoUnitOverflow(viewScaleUnit, startDate, endDate);

                var column = builder.newColumn(startDate, endDate, leftOffset ? left + leftOffset : left, columnWidth);

                if (!column.cropped) {
                    generatedCols.push(column);
                    if (reverse) {
                        left -= columnWidth;
                    } else {
                        left += columnWidth;
                    }
                }
                if (to) {
                    if (reverse) {
                        if (excludeTo && date < to || !excludeTo && date <= to) {
                            break;
                        }
                    } else {
                        if (excludeTo && date > to || !excludeTo && date >= to) {
                            break;
                        }
                    }
                }
                if (reverse) {
                    date.add(-viewScaleValue, viewScaleUnit);
                    ensureNoUnitOverflow(viewScaleUnit, date, startDate);
                } else {
                    date.add(viewScaleValue, viewScaleUnit);
                    ensureNoUnitOverflow(viewScaleUnit, startDate, date);
                }
            }

            if (reverse) {
                if (isToDateToExclude(from, viewScaleValue, viewScaleUnit)) {
                    generatedCols.shift();
                }
                generatedCols.reverse();
            }

            return generatedCols;
        };
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').factory('GanttColumnHeader', [ 'moment', 'GanttColumn', function(moment, Column) {
        // Used to display the Gantt grid and header.
        // The columns are generated by the column generator.

        var ColumnHeader = function(startDate, endDate, viewScaleUnit, left, width, labelFormat) {
            startDate = moment(startDate);
            endDate = moment(endDate);

            var column = new Column(startDate, endDate, left, width);
            column.unit = viewScaleUnit;
            column.label = angular.isFunction(labelFormat) ? labelFormat(column): startDate.format(labelFormat);

            return column;
        };
        return ColumnHeader;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttColumnsManager', ['GanttColumnGenerator', 'GanttColumnBuilder', 'GanttHeadersGenerator', '$filter', '$timeout', 'ganttLayout', 'ganttBinarySearch', 'moment', function(ColumnGenerator, ColumnBuilder, HeadersGenerator, $filter, $timeout, layout, bs, moment) {
        var ColumnsManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.from = undefined;
            this.to = undefined;

            this.columns = [];
            this.visibleColumns = [];
            this.previousColumns = [];
            this.nextColumns = [];

            this.headers = [];
            this.visibleHeaders = [];

            this.scrollAnchor = undefined;

            this.columnBuilder = new ColumnBuilder(this);

            // Add a watcher if a view related setting changed from outside of the Gantt. Update the gantt accordingly if so.
            // All those changes need a recalculation of the header columns
            this.gantt.$scope.$watchGroup(['viewScale', 'columnWidth', 'timeFramesWorkingMode', 'timeFramesNonWorkingMode', 'fromDate', 'toDate', 'autoExpand', 'taskOutOfRange'], function(newValues, oldValues) {
                if (newValues !== oldValues && self.gantt.rendered) {
                    self.generateColumns();
                }
            });

            this.gantt.$scope.$watchCollection('headers', function(newValues, oldValues) {
                if (newValues !== oldValues && self.gantt.rendered) {
                    self.generateColumns();
                }
            });

            this.gantt.$scope.$watchCollection('headersFormats', function(newValues, oldValues) {
                if (newValues !== oldValues && self.gantt.rendered) {
                    self.generateColumns();
                }
            });

            this.gantt.$scope.$watchGroup(['ganttElementWidth', 'showSide', 'sideWidth', 'maxHeight', 'daily'], function(newValues, oldValues) {
                if (newValues !== oldValues && self.gantt.rendered) {
                    self.updateColumnsMeta();
                }
            });

            this.gantt.api.data.on.load(this.gantt.$scope, function() {
                if ((self.from === undefined || self.to === undefined ||
                    self.from > self.gantt.rowsManager.getDefaultFrom() ||
                    self.to < self.gantt.rowsManager.getDefaultTo()) && self.gantt.rendered) {
                    self.generateColumns();
                }

                self.gantt.rowsManager.sortRows();
            });

            this.gantt.api.data.on.remove(this.gantt.$scope, function() {
                self.gantt.rowsManager.sortRows();
            });

            this.gantt.api.registerMethod('columns', 'clear', this.clearColumns, this);
            this.gantt.api.registerMethod('columns', 'generate', this.generateColumns, this);
            this.gantt.api.registerMethod('columns', 'refresh', this.updateColumnsMeta, this);
            this.gantt.api.registerMethod('columns', 'getColumnsWidth', this.getColumnsWidth, this);
            this.gantt.api.registerMethod('columns', 'getColumnsWidthToFit', this.getColumnsWidthToFit, this);
            this.gantt.api.registerMethod('columns', 'getDateRange', this.getDateRange, this);

            this.gantt.api.registerEvent('columns', 'clear');
            this.gantt.api.registerEvent('columns', 'generate');
            this.gantt.api.registerEvent('columns', 'refresh');
        };

        ColumnsManager.prototype.setScrollAnchor = function() {
            if (this.gantt.scroll.$element && this.columns.length > 0) {
                var el = this.gantt.scroll.$element[0];
                var center = el.scrollLeft + el.offsetWidth / 2;

                this.scrollAnchor = this.gantt.getDateByPosition(center);
            }
        };

        ColumnsManager.prototype.scrollToScrollAnchor = function() {
            var self = this;

            if (this.columns.length > 0 && this.scrollAnchor !== undefined) {
                // Ugly but prevents screen flickering (unlike $timeout)
                this.gantt.$scope.$$postDigest(function() {
                    self.gantt.api.scroll.toDate(self.scrollAnchor);
                });
            }
        };

        ColumnsManager.prototype.clearColumns = function() {
            this.setScrollAnchor();

            this.from = undefined;
            this.to = undefined;

            this.columns = [];
            this.visibleColumns = [];
            this.previousColumns = [];
            this.nextColumns = [];

            this.headers = [];
            this.visibleHeaders = [];

            this.gantt.api.columns.raise.clear();
        };

        ColumnsManager.prototype.generateColumns = function(from, to) {
            if (!from) {
                from = this.gantt.options.value('fromDate');
            }

            if (!to) {
                to = this.gantt.options.value('toDate');
            }

            if (!from || (moment.isMoment(from) && !from.isValid())) {
                from = this.gantt.rowsManager.getDefaultFrom();
                if (!from) {
                    return false;
                }
            }

            if (!to || (moment.isMoment(to) && !to.isValid())) {
                to = this.gantt.rowsManager.getDefaultTo();
                if (!to) {
                    return false;
                }
            }

            if (from !== undefined && !moment.isMoment(from)) {
                from = moment(from);
            }

            if (to !== undefined && !moment.isMoment(to)) {
                to = moment(to);
            }

            if (this.gantt.options.value('taskOutOfRange') === 'expand') {
                from = this.gantt.rowsManager.getExpandedFrom(from);
                to = this.gantt.rowsManager.getExpandedTo(to);
            }

            this.setScrollAnchor();

            this.from = from;
            this.to = to;

            this.columns = ColumnGenerator.generate(this.columnBuilder, from, to, this.gantt.options.value('viewScale'), this.getColumnsWidth());
            this.headers = HeadersGenerator.generate(this);
            this.previousColumns = [];
            this.nextColumns = [];

            this.updateColumnsMeta();
            this.scrollToScrollAnchor();

            this.gantt.api.columns.raise.generate(this.columns, this.headers);
        };

        ColumnsManager.prototype.updateColumnsMeta = function() {
            this.gantt.isRefreshingColumns = true;

            var lastColumn = this.getLastColumn();
            this.gantt.originalWidth = lastColumn !== undefined ? lastColumn.originalSize.left + lastColumn.originalSize.width : 0;

            var columnsWidthChanged = this.updateColumnsWidths(this.columns,  this.headers, this.previousColumns, this.nextColumns);

            this.gantt.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width : 0;

            var showSide = this.gantt.options.value('showSide');
            var sideShown = this.gantt.side.isShown();
            var sideVisibilityChanged = showSide !== sideShown;

            if (sideVisibilityChanged && !showSide) {
                // Prevent unnecessary v-scrollbar if side is hidden here
                this.gantt.side.show(false);
            }

            this.gantt.rowsManager.updateTasksPosAndSize();
            this.gantt.timespansManager.updateTimespansPosAndSize();

            this.updateVisibleColumns(columnsWidthChanged);

            this.gantt.rowsManager.updateVisibleObjects();

            var currentDateValue = this.gantt.options.value('currentDateValue');
            this.gantt.currentDateManager.setCurrentDate(currentDateValue);

            if (sideVisibilityChanged && showSide) {
                // Prevent unnecessary v-scrollbar if side is shown here
                this.gantt.side.show(true);
            }

            this.gantt.isRefreshingColumns = false;
            this.gantt.api.columns.raise.refresh(this.columns, this.headers);
        };

        // Returns the last Gantt column or undefined
        ColumnsManager.prototype.getLastColumn = function(extended) {
            var columns = this.columns;
            if (extended) {
                columns = this.nextColumns;
            }
            if (columns && columns.length > 0) {
                return columns[columns.length - 1];
            } else {
                return undefined;
            }
        };

        // Returns the first Gantt column or undefined
        ColumnsManager.prototype.getFirstColumn = function(extended) {
            var columns = this.columns;
            if (extended) {
                columns = this.previousColumns;
            }

            if (columns && columns.length > 0) {
                return columns[0];
            } else {
                return undefined;
            }
        };

        // Returns the column at the given or next possible date
        ColumnsManager.prototype.getColumnByDate = function(date, disableExpand) {
            if (!disableExpand) {
                this.expandExtendedColumnsForDate(date);
            }
            var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
            var columns = bs.get(extendedColumns, date, function(c) {
                return c.date;
            }, true);
            return columns[0] === undefined ? columns[1] : columns[0];
        };

        // Returns the column at the given position x (in em)
        ColumnsManager.prototype.getColumnByPosition = function(x, disableExpand) {
            if (!disableExpand) {
                this.expandExtendedColumnsForPosition(x);
            }
            var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
            var columns = bs.get(extendedColumns, x, function(c) {
                return c.left;
            }, true);
            return columns[0] === undefined ? columns[1]: columns[0];
        };

        ColumnsManager.prototype.updateColumnsWidths = function(columns,  headers, previousColumns, nextColumns) {
            var columnWidth = this.gantt.options.value('columnWidth');
            var expandToFit = this.gantt.options.value('expandToFit');
            var shrinkToFit = this.gantt.options.value('shrinkToFit');

            if (columnWidth === undefined || expandToFit || shrinkToFit) {
                var newWidth = this.gantt.getBodyAvailableWidth();

                var lastColumn = this.gantt.columnsManager.getLastColumn(false);
                if (lastColumn !== undefined) {
                    var currentWidth = lastColumn.originalSize.left + lastColumn.originalSize.width;

                    if (expandToFit && currentWidth < newWidth ||
                        shrinkToFit && currentWidth > newWidth ||
                        columnWidth === undefined
                    ) {
                        var widthFactor = newWidth / currentWidth;

                        layout.setColumnsWidthFactor(columns, widthFactor);
                        for (var i=0; i< headers.length; i++) {
                            layout.setColumnsWidthFactor(headers[i], widthFactor);
                        }
                        // previous and next columns will be generated again on need.
                        previousColumns.splice(0, this.previousColumns.length);
                        nextColumns.splice(0, this.nextColumns.length);
                        return true;
                    }
                }
            }
            return false;
        };

        ColumnsManager.prototype.getColumnsWidth = function() {
            var columnWidth = this.gantt.options.value('columnWidth');
            if (columnWidth === undefined) {
                if (!this.gantt.width || this.gantt.width <= 0) {
                    columnWidth = 20;
                } else {
                    columnWidth = this.gantt.width / this.columns.length;
                }
            }
            return columnWidth;
        };

        ColumnsManager.prototype.getColumnsWidthToFit = function() {
            return this.gantt.getBodyAvailableWidth() / this.columns.length;
        };

        ColumnsManager.prototype.expandExtendedColumnsForPosition = function(x) {
            var viewScale;
            if (x < 0) {
                var firstColumn = this.getFirstColumn();
                var from = firstColumn.date;
                var firstExtendedColumn = this.getFirstColumn(true);
                if (!firstExtendedColumn || firstExtendedColumn.left > x) {
                    viewScale = this.gantt.options.value('viewScale');
                    this.previousColumns = ColumnGenerator.generate(this.columnBuilder, from, undefined, viewScale, this.getColumnsWidth(), -x, 0, true);
                }
                return true;
            } else if (x > this.gantt.width) {
                var lastColumn = this.getLastColumn();
                var endDate = lastColumn.getDateByPosition(lastColumn.width);
                var lastExtendedColumn = this.getLastColumn(true);
                if (!lastExtendedColumn || lastExtendedColumn.left + lastExtendedColumn.width < x) {
                    viewScale = this.gantt.options.value('viewScale');
                    this.nextColumns = ColumnGenerator.generate(this.columnBuilder, endDate, undefined, viewScale, this.getColumnsWidth(), x - this.gantt.width, this.gantt.width, false);
                }
                return true;
            }
            return false;
        };

        ColumnsManager.prototype.expandExtendedColumnsForDate = function(date) {
            var firstColumn = this.getFirstColumn();
            var from;
            if (firstColumn) {
                from = firstColumn.date;
            }

            var lastColumn = this.getLastColumn();
            var endDate;
            if (lastColumn) {
                endDate = lastColumn.getDateByPosition(lastColumn.width);
            }

            var viewScale;
            if (from && date < from) {
                var firstExtendedColumn = this.getFirstColumn(true);
                if (!firstExtendedColumn || firstExtendedColumn.date > date) {
                    viewScale = this.gantt.options.value('viewScale');
                    this.previousColumns = ColumnGenerator.generate(this.columnBuilder, from, date, viewScale, this.getColumnsWidth(), undefined, 0, true);
                }
                return true;
            } else if (endDate && date >= endDate) {
                var lastExtendedColumn = this.getLastColumn(true);
                if (!lastExtendedColumn || lastExtendedColumn.date < endDate) {
                    viewScale = this.gantt.options.value('viewScale');
                    this.nextColumns = ColumnGenerator.generate(this.columnBuilder, endDate, date, viewScale, this.getColumnsWidth(), undefined, this.gantt.width, false);
                }
                return true;
            }
            return false;
        };

        // Returns the number of active headers
        ColumnsManager.prototype.getActiveHeadersCount = function() {
            return this.headers.length;
        };

        ColumnsManager.prototype.updateVisibleColumns = function(includeViews) {
            this.visibleColumns = $filter('ganttColumnLimit')(this.columns, this.gantt);

            this.visibleHeaders = [];
            for (var i=0; i< this.headers.length; i++) {
                this.visibleHeaders.push($filter('ganttColumnLimit')(this.headers[i], this.gantt));
            }

            if (includeViews) {
                for (i=0; i<this.visibleColumns.length; i++) {
                    this.visibleColumns[i].updateView();
                }
                for (i=0; i<this.visibleHeaders.length; i++) {
                    var headerRow = this.visibleHeaders[i];
                    for (var j=0; j<headerRow.length; j++) {
                        headerRow[j].updateView();
                    }
                }
            }

            var currentDateValue = this.gantt.options.value('currentDateValue');
            this.gantt.currentDateManager.setCurrentDate(currentDateValue);
        };

        var defaultHeadersFormats = {'year': 'YYYY', 'quarter': '[Q]Q YYYY', month: 'MMMM YYYY', week: 'w', day: 'D', hour: 'H', minute:'HH:mm'};
        var defaultDayHeadersFormats = {day: 'LL', hour: 'H', minute:'HH:mm'};
        var defaultYearHeadersFormats = {'year': 'YYYY', 'quarter': '[Q]Q', month: 'MMMM'};

        ColumnsManager.prototype.getHeaderFormat = function(unit) {
            var format;
            var headersFormats = this.gantt.options.value('headersFormats');
            if (headersFormats !== undefined) {
                format = headersFormats[unit];
            }
            if (format === undefined) {
                var viewScale = this.gantt.options.value('viewScale');
                viewScale = viewScale.trim();
                if (viewScale.charAt(viewScale.length - 1) === 's') {
                    viewScale = viewScale.substring(0, viewScale.length - 1);
                }

                var viewScaleUnit;
                var splittedViewScale;

                if (viewScale) {
                    splittedViewScale = viewScale.split(' ');
                }
                if (splittedViewScale && splittedViewScale.length > 1) {
                    viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
                } else {
                    viewScaleUnit = viewScale;
                }

                if (['millisecond', 'second', 'minute', 'hour'].indexOf(viewScaleUnit) > -1) {
                    format = defaultDayHeadersFormats[unit];
                } else if (['month', 'quarter', 'year'].indexOf(viewScaleUnit) > -1) {
                    format = defaultYearHeadersFormats[unit];
                }
                if (format === undefined) {
                    format = defaultHeadersFormats[unit];
                }
            }
            return format;
        };

        ColumnsManager.prototype.getDateRange = function(visibleOnly) {
            var firstColumn, lastColumn;

            if (visibleOnly) {
                if (this.visibleColumns && this.visibleColumns.length > 0) {
                    firstColumn = this.visibleColumns[0];
                    lastColumn = this.visibleColumns[this.visibleColumns.length - 1];
                }
            } else {
                firstColumn = this.getFirstColumn();
                lastColumn = this.getLastColumn();
            }

            return firstColumn && lastColumn ? [firstColumn.date, lastColumn.endDate]: undefined;
        };

        return ColumnsManager;
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').service('GanttHeadersGenerator', ['GanttColumnHeader', 'moment', function(ColumnHeader, moment) {
        var generateHeader = function(columnsManager, viewScale) {
            var generatedHeaders = [];
            var header;

            var viewScaleValue;
            var viewScaleUnit;
            var splittedViewScale;

            if (viewScale) {
                splittedViewScale = viewScale.split(' ');
            }
            if (splittedViewScale && splittedViewScale.length > 1) {
                viewScaleValue = parseFloat(splittedViewScale[0]);
                viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
            } else {
                viewScaleValue = 1;
                viewScaleUnit = viewScale;
            }

            var currentColumn = columnsManager.columns[0];
            var currentDate = moment(currentColumn.date).startOf(viewScaleUnit);

            var maximumDate = moment(columnsManager.columns[columnsManager.columns.length - 1].endDate);

            while (true) {
                var currentPosition = currentColumn.getPositionByDate(currentDate);

                var endDate = moment.min(moment(currentDate).add(viewScaleValue, viewScaleUnit), maximumDate);

                var column = columnsManager.getColumnByDate(endDate, true);

                var left = column.getPositionByDate(endDate);

                var width = left - currentPosition;

                if (width > 0) {
                    var labelFormat = columnsManager.getHeaderFormat(viewScaleUnit);

                    header = new ColumnHeader(currentDate, endDate, viewScaleUnit, currentPosition, width, labelFormat);
                    generatedHeaders.push(header);
                }

                if (endDate.isSame(maximumDate) || endDate.isAfter(maximumDate)) {
                    break;
                }

                currentColumn = column;
                currentDate = endDate;
            }

            return generatedHeaders;
        };

        this.generate = function(columnsManager) {
            var units = [];
            if (columnsManager.gantt.options.value('headers') === undefined) {
                var viewScale = columnsManager.gantt.options.value('viewScale');
                viewScale = viewScale.trim();
                if (viewScale.charAt(viewScale.length - 1) === 's') {
                    viewScale = viewScale.substring(0, viewScale.length - 1);
                }

                var viewScaleUnit;
                var splittedViewScale;

                if (viewScale) {
                    splittedViewScale = viewScale.split(' ');
                }
                if (splittedViewScale && splittedViewScale.length > 1) {
                    viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
                } else {
                    viewScaleUnit = viewScale;
                }

                if (['quarter','month'].indexOf(viewScaleUnit) > -1) {
                    units.push('year');
                }
                if (['day', 'week'].indexOf(viewScaleUnit) > -1) {
                    units.push('month');
                }
                if (['day'].indexOf(viewScaleUnit) > -1) {
                    units.push('week');
                }
                if (['hour'].indexOf(viewScaleUnit) > -1) {
                    units.push('day');
                }
                if (['minute', 'second'].indexOf(viewScaleUnit) > -1) {
                    units.push('hour');
                }
                if (['second'].indexOf(viewScaleUnit) > -1) {
                    units.push('minute');
                }
                units.push(viewScale);
            } else {
                units = columnsManager.gantt.options.value('headers');
            }

            var headers = [];
            for (var i=0; i<units.length; i++) {
                headers.push(generateHeader(columnsManager, units[i]));
            }

            return headers;
        };
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt').factory('Gantt', [
        'GanttApi', 'GanttOptions', 'GanttCalendar', 'GanttScroll', 'GanttBody', 'GanttRowHeader', 'GanttHeader', 'GanttSide', 'GanttObjectModel', 'GanttRowsManager', 'GanttColumnsManager', 'GanttTimespansManager', 'GanttCurrentDateManager', 'ganttArrays', 'moment', '$document', '$timeout',
        function(GanttApi, Options, Calendar, Scroll, Body, RowHeader, Header, Side, ObjectModel, RowsManager, ColumnsManager, TimespansManager, CurrentDateManager, arrays, moment, $document, $timeout) {
            // Gantt logic. Manages the columns, rows and sorting functionality.
            var Gantt = function($scope, $element) {
                var self = this;

                this.$scope = $scope;
                this.$element = $element;

                this.options = new Options($scope, {
                    'api': angular.noop,
                    'data': [],
                    'timespans': [],
                    'viewScale': 'day',
                    'columnMagnet': '15 minutes',
                    'timeFramesMagnet': true,
                    'showSide': true,
                    'allowSideResizing': true,
                    'currentDate': 'line',
                    'currentDateValue': moment,
                    'autoExpand': 'none',
                    'taskOutOfRange': 'truncate',
                    'taskContent': '{{task.model.name}}',
                    'rowContent': '{{row.model.name}}',
                    'maxHeight': 0,
                    'timeFrames': [],
                    'dateFrames': [],
                    'timeFramesWorkingMode': 'hidden',
                    'timeFramesNonWorkingMode': 'visible'
                });

                this.api = new GanttApi(this);

                this.api.registerEvent('core', 'ready');
                this.api.registerEvent('core', 'rendered');

                this.api.registerEvent('directives', 'controller');
                this.api.registerEvent('directives', 'preLink');
                this.api.registerEvent('directives', 'postLink');
                this.api.registerEvent('directives', 'new');
                this.api.registerEvent('directives', 'destroy');

                this.api.registerEvent('data', 'change');
                this.api.registerEvent('data', 'load');
                this.api.registerEvent('data', 'remove');
                this.api.registerEvent('data', 'clear');

                this.api.registerMethod('core', 'getDateByPosition', this.getDateByPosition, this);
                this.api.registerMethod('core', 'getPositionByDate', this.getPositionByDate, this);

                this.api.registerMethod('data', 'load', this.loadData, this);
                this.api.registerMethod('data', 'remove', this.removeData, this);
                this.api.registerMethod('data', 'clear', this.clearData, this);
                this.api.registerMethod('data', 'get', this.getData, this);

                this.calendar = new Calendar(this);
                this.calendar.registerTimeFrames(this.options.value('timeFrames'));
                this.calendar.registerDateFrames(this.options.value('dateFrames'));

                this.api.registerMethod('timeframes', 'registerTimeFrames', this.calendar.registerTimeFrames, this.calendar);
                this.api.registerMethod('timeframes', 'clearTimeframes', this.calendar.clearTimeFrames, this.calendar);
                this.api.registerMethod('timeframes', 'registerDateFrames', this.calendar.registerDateFrames, this.calendar);
                this.api.registerMethod('timeframes', 'clearDateFrames', this.calendar.clearDateFrames, this.calendar);
                this.api.registerMethod('timeframes', 'registerTimeFrameMappings', this.calendar.registerTimeFrameMappings, this.calendar);
                this.api.registerMethod('timeframes', 'clearTimeFrameMappings', this.calendar.clearTimeFrameMappings, this.calendar);

                $scope.$watchGroup(['timeFrames', 'dateFrames'], function(newValues, oldValues) {
                    if (newValues !== oldValues) {
                        var timeFrames = newValues[0];
                        var dateFrames = newValues[1];

                        var oldTimeFrames = oldValues[0];
                        var oldDateFrames = oldValues[1];

                        var framesChanged = false;

                        if (!angular.equals(timeFrames, oldTimeFrames)) {
                            self.calendar.clearTimeFrames();
                            self.calendar.registerTimeFrames(timeFrames);
                            framesChanged = true;
                        }

                        if (!angular.equals(dateFrames, oldDateFrames)) {
                            self.calendar.clearDateFrames();
                            self.calendar.registerDateFrames(dateFrames);
                            framesChanged = true;
                        }

                        if (framesChanged) {
                            self.columnsManager.generateColumns();
                        }
                    }
                });

                $scope.$watch('columnMagnet', function() {
                    var splittedColumnMagnet;
                    var columnMagnet = self.options.value('columnMagnet');
                    if (columnMagnet) {
                        splittedColumnMagnet = columnMagnet.trim().split(' ');
                    }
                    if (splittedColumnMagnet && splittedColumnMagnet.length > 1) {
                        self.columnMagnetValue = parseFloat(splittedColumnMagnet[0]);
                        self.columnMagnetUnit = moment.normalizeUnits(splittedColumnMagnet[splittedColumnMagnet.length - 1]);
                    } else {
                        self.columnMagnetValue = 1;
                        self.columnMagnetUnit = moment.normalizeUnits(columnMagnet);
                    }
                });

                $scope.$watchGroup(['shiftColumnMagnet', 'viewScale'], function() {
                    var splittedColumnMagnet;
                    var shiftColumnMagnet = self.options.value('shiftColumnMagnet');
                    if (shiftColumnMagnet) {
                        splittedColumnMagnet = shiftColumnMagnet.trim().split(' ');
                    }
                    if (splittedColumnMagnet !== undefined && splittedColumnMagnet.length > 1) {
                        self.shiftColumnMagnetValue = parseFloat(splittedColumnMagnet[0]);
                        self.shiftColumnMagnetUnit = moment.normalizeUnits(splittedColumnMagnet[splittedColumnMagnet.length - 1]);
                    } else {
                        self.shiftColumnMagnetValue = 1;
                        self.shiftColumnMagnetUnit = moment.normalizeUnits(shiftColumnMagnet);
                    }
                });

                var keyHandler = function(e) {
                    self.shiftKey = e.shiftKey;
                    return true;
                };

                $document.on('keyup keydown', keyHandler);

                $scope.$on('$destroy', function() {
                    $document.off('keyup keydown', keyHandler);
                });

                this.scroll = new Scroll(this);
                this.body = new Body(this);
                this.header = new Header(this);
                this.side = new Side(this);

                this.objectModel = new ObjectModel(this.api);

                this.rowsManager = new RowsManager(this);
                this.columnsManager = new ColumnsManager(this);
                this.timespansManager = new TimespansManager(this);
                this.currentDateManager = new CurrentDateManager(this);

                this.originalWidth = 0;
                this.width = 0;

                if (angular.isFunction(this.$scope.api)) {
                    this.$scope.api(this.api);
                }

                var hasRowModelOrderChanged = function(data1, data2) {
                    if (data2 === undefined || data1.length !== data2.length) {
                        return true;
                    }

                    for (var i = 0, l = data1.length; i < l; i++) {
                        if (data1[i].id !== data2[i].id) {
                            return true;
                        }
                    }

                    return false;
                };

                $scope.$watchCollection('data', function(newData, oldData) {
                    if (oldData !== undefined) {
                        var toRemoveIds = arrays.getRemovedIds(newData, oldData);
                        if (toRemoveIds.length === oldData.length) {
                            self.rowsManager.removeAll();

                            // DEPRECATED
                            self.api.data.raise.clear();
                        } else {
                            for (var i = 0, l = toRemoveIds.length; i < l; i++) {
                                var toRemoveId = toRemoveIds[i];
                                self.rowsManager.removeRow(toRemoveId);
                            }

                            // DEPRECATED
                            var removedRows = [];
                            for(i = 0, l = oldData.length; i < l; i++){
                                if (toRemoveIds.indexOf(oldData[i].id) > -1) {
                                    removedRows.push(oldData[i]);
                                }
                            }
                            self.api.data.raise.remove(removedRows);
                        }
                    }

                    if (newData !== undefined) {
                        var modelOrderChanged = hasRowModelOrderChanged(newData, oldData);

                        if (modelOrderChanged) {
                            self.rowsManager.resetNonModelLists();
                        }

                        for (var j = 0, k = newData.length; j < k; j++) {
                            var rowData = newData[j];
                            self.rowsManager.addRow(rowData, modelOrderChanged);
                        }

                        self.api.data.raise.change(newData, oldData);

                        // DEPRECATED
                        self.api.data.raise.load(newData);
                    }
                });
            };

            // Returns the exact column date at the given position x (in em)
            Gantt.prototype.getDateByPosition = function(x, magnet, disableExpand) {
                var column = this.columnsManager.getColumnByPosition(x, disableExpand);
                if (column !== undefined) {
                    var magnetValue;
                    var magnetUnit;
                    if (magnet) {
                        if (this.shiftKey) {
                            if (this.shiftColumnMagnetValue !== undefined && this.shiftColumnMagnetUnit !== undefined) {
                                magnetValue = this.shiftColumnMagnetValue;
                                magnetUnit = this.shiftColumnMagnetUnit;
                            } else {
                                var viewScale = this.options.value('viewScale');
                                viewScale = viewScale.trim();
                                var viewScaleValue;
                                var viewScaleUnit;
                                var splittedViewScale;

                                if (viewScale) {
                                    splittedViewScale = viewScale.split(' ');
                                }
                                if (splittedViewScale && splittedViewScale.length > 1) {
                                    viewScaleValue = parseFloat(splittedViewScale[0]);
                                    viewScaleUnit = moment.normalizeUnits(splittedViewScale[splittedViewScale.length - 1]);
                                } else {
                                    viewScaleValue = 1;
                                    viewScaleUnit = moment.normalizeUnits(viewScale);
                                }
                                magnetValue = viewScaleValue * 0.25;
                                magnetUnit = viewScaleUnit;
                            }
                        } else {
                            magnetValue = this.columnMagnetValue;
                            magnetUnit = this.columnMagnetUnit;
                        }
                    }

                    return column.getDateByPosition(x - column.left, magnetValue, magnetUnit, this.options.value('timeFramesMagnet'));
                } else {
                    return undefined;
                }
            };

            Gantt.prototype.getBodyAvailableWidth = function() {
                var scrollWidth = this.getWidth() - this.side.getWidth();
                var borderWidth = this.scroll.getBordersWidth();
                var availableWidth = scrollWidth - (borderWidth !== undefined ? this.scroll.getBordersWidth() : 0);
                // Remove 1 pixel because of rounding issue in some cases.
                availableWidth = availableWidth - 1;
                return availableWidth;
            };

            // Returns the position inside the Gantt calculated by the given date
            Gantt.prototype.getPositionByDate = function(date, disableExpand) {
                if (date === undefined) {
                    return undefined;
                }

                if (!moment.isMoment(moment)) {
                    date = moment(date);
                }

                var column = this.columnsManager.getColumnByDate(date, disableExpand);
                if (column !== undefined) {
                    return column.getPositionByDate(date);
                } else {
                    return undefined;
                }
            };

            // DEPRECATED - Use $data instead.
            Gantt.prototype.loadData = function(data) {
                if (!angular.isArray(data)) {
                    data = data !== undefined ? [data] : [];
                }

                if (this.$scope.data === undefined) {
                    this.$scope.data = data;
                } else {
                    for (var i = 0, l = data.length; i < l; i++) {
                        var row = data[i];

                        var j = arrays.indexOfId(this.$scope.data, row.id);
                        if (j > -1) {
                            this.$scope.data[j] = row;
                        } else {
                            this.$scope.data.push(row);
                        }
                    }
                }

                var w = this.side.getWidth();
                if (w > 0) {
                    this.options.set('sideWidth', w);
                }
            };

            Gantt.prototype.getData = function() {
                return this.$scope.data;
            };

            // DEPRECATED - Use $data instead.
            Gantt.prototype.removeData = function(data) {
                if (!angular.isArray(data)) {
                    data = data !== undefined ? [data] : [];
                }

                if (this.$scope.data !== undefined) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        var rowToRemove = data[i];

                        var j = arrays.indexOfId(this.$scope.data, rowToRemove.id);
                        if (j > -1) {
                            if (rowToRemove.tasks === undefined || rowToRemove.tasks.length === 0) {
                                // Remove complete row
                                this.$scope.data.splice(j, 1);
                            } else {
                                // Remove single tasks
                                var row = this.$scope.data[j];
                                for (var ti = 0, tl = rowToRemove.tasks.length; ti < tl; ti++) {
                                    var taskToRemove = rowToRemove.tasks[ti];

                                    var tj = arrays.indexOfId(row.tasks, taskToRemove.id);
                                    if (tj > -1) {
                                        row.tasks.splice(tj, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            };

            // DEPRECATED - Use $data instead.
            Gantt.prototype.clearData = function() {
                this.$scope.data = undefined;
            };

            Gantt.prototype.getWidth = function() {
                return this.$scope.ganttElementWidth;
            };

            Gantt.prototype.initialized = function() {
                // Gantt is initialized. Signal that the Gantt is ready.
                this.api.core.raise.ready(this.api);

                this.rendered = true;
                this.columnsManager.generateColumns();

                var gantt = this;
                var renderedFunction = function() {
                    var w = gantt.side.getWidth();
                    if (w > 0) {
                        gantt.options.set('sideWidth', w);
                    }
                    gantt.api.core.raise.rendered(gantt.api);
                };
                $timeout(renderedFunction);
            };

            return Gantt;
        }]);
}());

(function(){
    'use strict';
    angular.module('gantt').factory('GanttObjectModel', ['ganttUtils', 'moment', function(utils, moment) {
        var ObjectModel = function(api) {
            this.api = api;

            this.api.registerEvent('tasks', 'clean');
            this.api.registerEvent('rows', 'clean');
            this.api.registerEvent('timespans', 'clean');
        };

        ObjectModel.prototype.cleanTask = function(model) {
            if (model.id === undefined) {
                model.id = utils.randomUuid();
            }

            if (model.from !== undefined && !moment.isMoment(model.from)) {
                model.from = moment(model.from);
            }

            if (model.to !== undefined && !moment.isMoment(model.to)) {
                model.to = moment(model.to);
            }

            this.api.tasks.raise.clean(model);
        };

        ObjectModel.prototype.cleanRow = function(model) {
            if (model.id === undefined) {
                model.id = utils.randomUuid();
            }

            if (model.from !== undefined && !moment.isMoment(model.from)) {
                model.from = moment(model.from);
            }

            if (model.to !== undefined && !moment.isMoment(model.to)) {
                model.to = moment(model.to);
            }

            this.api.rows.raise.clean(model);
        };

        ObjectModel.prototype.cleanTimespan = function(model) {
            if (model.id === undefined) {
                model.id = utils.randomUuid();
            }

            if (model.from !== undefined && !moment.isMoment(model.from)) {
                model.from = moment(model.from);
            }

            if (model.to !== undefined && !moment.isMoment(model.to)) {
                model.to = moment(model.to);
            }

            this.api.timespans.raise.clean(model);
        };

        return ObjectModel;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttRow', ['GanttTask', 'moment', '$filter', function(Task, moment, $filter) {
        var Row = function(rowsManager, model) {
            this.rowsManager = rowsManager;
            this.model = model;

            this.from = undefined;
            this.to = undefined;

            this.tasksMap = {};
            this.tasks = [];
            this.filteredTasks = [];
            this.visibleTasks = [];
        };

        Row.prototype.addTaskImpl = function(task, viewOnly) {
            this.tasksMap[task.model.id] = task;
            this.tasks.push(task);

            if (!viewOnly) {
                if (this.model.tasks === undefined) {
                    this.model.tasks = [];
                }
                if (this.model.tasks.indexOf(task.model) === -1) {
                    this.model.tasks.push(task.model);
                }
            }

        };

        // Adds a task to a specific row. Merges the task if there is already one with the same id
        Row.prototype.addTask = function(taskModel, viewOnly) {
            // Copy to new task (add) or merge with existing (update)
            var task, isUpdate = false;

            this.rowsManager.gantt.objectModel.cleanTask(taskModel);
            if (taskModel.id in this.tasksMap) {
                task = this.tasksMap[taskModel.id];
                if (task.model === taskModel) {
                    return task;
                }
                task.model = taskModel;
                isUpdate = true;
            } else {
                task = new Task(this, taskModel);
                this.addTaskImpl(task, viewOnly);
            }

            this.sortTasks();
            this.setFromToByTask(task);

            if (!viewOnly) {
                if (isUpdate) {
                    this.rowsManager.gantt.api.tasks.raise.change(task);
                } else {
                    this.rowsManager.gantt.api.tasks.raise.add(task);
                }
            }

            return task;
        };

        // Removes the task from the existing row and adds it to he current one
        Row.prototype.moveTaskToRow = function(task, viewOnly) {
            var oldRow = task.row;
            oldRow.removeTask(task.model.id, viewOnly, true);

            task.row = this;
            this.addTaskImpl(task, viewOnly);

            this.sortTasks();
            this.setFromToByTask(task);

            task.updatePosAndSize();
            this.updateVisibleTasks();

            oldRow.$scope.$digest();
            task.row.$scope.$digest();

            this.rowsManager.gantt.api.tasks.raise.viewRowChange(task, oldRow);
            if (!viewOnly) {
                this.rowsManager.gantt.api.tasks.raise.rowChange(task, oldRow);
            }
        };

        Row.prototype.updateVisibleTasks = function() {
            var filterTask = this.rowsManager.gantt.options.value('filterTask');
            if (filterTask) {
                if (typeof(filterTask) === 'object') {
                    filterTask = {model: filterTask};
                }

                var filterTaskComparator = this.rowsManager.gantt.options.value('filterTaskComparator');
                if (typeof(filterTaskComparator) === 'function') {
                    filterTaskComparator = function(actual, expected) {
                        return filterTaskComparator(actual.model, expected.model);
                    };
                }

                this.filteredTasks = $filter('filter')(this.tasks, filterTask, filterTaskComparator);
            } else {
                this.filteredTasks = this.tasks.slice(0);
            }
            this.visibleTasks = $filter('ganttTaskLimit')(this.filteredTasks, this.rowsManager.gantt);
        };

        Row.prototype.updateTasksPosAndSize = function() {
            for (var j = 0, k = this.tasks.length; j < k; j++) {
                this.tasks[j].updatePosAndSize();
            }
        };

        // Remove the specified task from the row
        Row.prototype.removeTask = function(taskId, viewOnly, silent) {
            if (taskId in this.tasksMap) {
                var removedTask = this.tasksMap[taskId];
                var task;
                var i;

                for (i = this.tasks.length - 1; i >= 0; i--) {
                    task = this.tasks[i];
                    if (task.model.id === taskId) {
                        this.tasks.splice(i, 1); // Remove from array

                        // Update earliest or latest date info as this may change
                        if (this.from - task.model.from === 0 || this.to - task.model.to === 0) {
                            this.setFromTo();
                        }

                        break;
                    }
                }

                for (i = this.filteredTasks.length - 1; i >= 0; i--) {
                    task = this.filteredTasks[i];
                    if (task.model.id === taskId) {
                        this.filteredTasks.splice(i, 1); // Remove from filtered array
                        break;
                    }
                }

                for (i = this.visibleTasks.length - 1; i >= 0; i--) {
                    task = this.visibleTasks[i];
                    if (task.model.id === taskId) {
                        this.visibleTasks.splice(i, 1); // Remove from visible array
                        break;
                    }
                }

                if (!viewOnly) {
                    delete this.tasksMap[taskId]; // Remove from map

                    if (this.model.tasks !== undefined) {
                        var taskIndex = this.model.tasks.indexOf(removedTask.model);
                        if (taskIndex > -1) {
                            this.model.tasks.splice(taskIndex, 1);
                        }
                    }

                    if (!silent) {
                        this.rowsManager.gantt.api.tasks.raise.remove(removedTask);
                    }
                }

                return removedTask;
            }
        };

        Row.prototype.removeAllTasks = function() {
            this.from = undefined;
            this.to = undefined;

            this.tasksMap = {};
            this.tasks = [];
            this.filteredTasks = [];
            this.visibleTasks = [];
        };

        // Calculate the earliest from and latest to date of all tasks in a row
        Row.prototype.setFromTo = function() {
            this.from = undefined;
            this.to = undefined;
            for (var j = 0, k = this.tasks.length; j < k; j++) {
                this.setFromToByTask(this.tasks[j]);
            }
        };

        Row.prototype.setFromToByTask = function(task) {
            this.setFromToByValues(task.model.from, task.model.to);
        };

        Row.prototype.setFromToByValues = function(from, to) {
            if (from !== undefined) {
                if (this.from === undefined) {
                    this.from = moment(from);
                } else if (from < this.from) {
                    this.from = moment(from);
                }
            }

            if (to !== undefined) {
                if (this.to === undefined) {
                    this.to = moment(to);
                } else if (to > this.to) {
                    this.to = moment(to);
                }
            }

        };

        Row.prototype.sortTasks = function() {
            this.tasks.sort(function(t1, t2) {
                return t1.left - t2.left;
            });
        };

        Row.prototype.clone = function() {
            var clone = new Row(this.rowsManager, angular.copy(this));
            for (var i = 0, l = this.tasks.length; i < l; i++) {
                clone.addTask(this.tasks[i].model);
            }
            return clone;
        };

        return Row;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttRowHeader', [function() {
        var RowHeader = function(gantt) {
            this.gantt = gantt;
        };
        return RowHeader;
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt').factory('GanttRowsManager', ['GanttRow', 'ganttArrays', '$filter', '$timeout', 'moment', function(Row, arrays, $filter, $timeout, moment) {
        var RowsManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.rowsMap = {};
            this.rows = [];
            this.sortedRows = [];
            this.filteredRows = [];
            this.customFilteredRows = [];
            this.visibleRows = [];
            this.rowsTaskWatchers = [];

            this._defaultFilterImpl = function(sortedRows, filterRow, filterRowComparator) {
                return $filter('filter')(sortedRows, filterRow, filterRowComparator);
            };
            this.filterImpl = this._defaultFilterImpl;

            this.customRowSorters = [];
            this.customRowFilters = [];

            this.gantt.$scope.$watchGroup(['filterTask', 'filterTaskComparator'], function(newValues, oldValues) {
                if (newValues !== oldValues) {
                    self.updateVisibleTasks();
                }
            });

            this.gantt.$scope.$watchGroup(['filterRow', 'filterRowComparator'], function(newValues, oldValues) {
                if (newValues !== oldValues) {
                    self.updateVisibleRows();
                }
            });

            this.gantt.$scope.$watch('sortMode', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.sortRows();
                }
            });

            // Listen to vertical scrollbar visibility changes to update columns width
            var _oldVScrollbarVisible = this.gantt.scroll.isVScrollbarVisible();
            this.gantt.$scope.$watchGroup(['maxHeight', 'gantt.rowsManager.visibleRows.length'], function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $timeout(function() {
                        var newVScrollbarVisible = self.gantt.scroll.isVScrollbarVisible();
                        if (newVScrollbarVisible !== _oldVScrollbarVisible) {
                            _oldVScrollbarVisible = newVScrollbarVisible;
                            self.gantt.columnsManager.updateColumnsMeta();
                        }
                    });
                }
            });

            this.gantt.api.registerMethod('rows', 'sort', RowsManager.prototype.sortRows, this);
            this.gantt.api.registerMethod('rows', 'applySort', RowsManager.prototype.applySort, this);
            this.gantt.api.registerMethod('rows', 'refresh', RowsManager.prototype.updateVisibleObjects, this);

            this.gantt.api.registerMethod('rows', 'removeRowSorter', RowsManager.prototype.removeCustomRowSorter, this);
            this.gantt.api.registerMethod('rows', 'addRowSorter', RowsManager.prototype.addCustomRowSorter, this);

            this.gantt.api.registerMethod('rows', 'removeRowFilter', RowsManager.prototype.removeCustomRowFilter, this);
            this.gantt.api.registerMethod('rows', 'addRowFilter', RowsManager.prototype.addCustomRowFilter, this);

            this.gantt.api.registerMethod('rows', 'setFilterImpl', RowsManager.prototype.setFilterImpl, this);

            this.gantt.api.registerEvent('tasks', 'add');
            this.gantt.api.registerEvent('tasks', 'change');
            this.gantt.api.registerEvent('tasks', 'viewChange');

            this.gantt.api.registerEvent('tasks', 'rowChange');
            this.gantt.api.registerEvent('tasks', 'viewRowChange');
            this.gantt.api.registerEvent('tasks', 'remove');
            this.gantt.api.registerEvent('tasks', 'filter');

            this.gantt.api.registerEvent('tasks', 'displayed');

            this.gantt.api.registerEvent('rows', 'add');
            this.gantt.api.registerEvent('rows', 'change');
            this.gantt.api.registerEvent('rows', 'remove');
            this.gantt.api.registerEvent('rows', 'move');

            this.gantt.api.registerEvent('rows', 'displayed');

            this.gantt.api.registerEvent('rows', 'filter');

            this.updateVisibleObjects();
        };

        RowsManager.prototype.resetNonModelLists = function() {
            this.rows = [];
            this.sortedRows = [];
            this.filteredRows = [];
            this.customFilteredRows = [];
            this.visibleRows = [];
        };

        RowsManager.prototype.addRow = function(rowModel, modelOrderChanged) {
            // Copy to new row (add) or merge with existing (update)
            var row, i, l, isUpdate = false;

            this.gantt.objectModel.cleanRow(rowModel);

            if (rowModel.id in this.rowsMap) {
                row = this.rowsMap[rowModel.id];

                if (modelOrderChanged) {
                    this.rows.push(row);
                    this.sortedRows.push(row);
                    this.filteredRows.push(row);
                    this.customFilteredRows.push(row);
                    this.visibleRows.push(row);
                }

                if (row.model === rowModel) {
                    return;
                }

                var toRemoveIds = arrays.getRemovedIds(rowModel.tasks, row.model.tasks);
                for (i = 0, l = toRemoveIds.length; i < l; i++) {
                    var toRemoveId = toRemoveIds[i];
                    row.removeTask(toRemoveId);
                }

                row.model = rowModel;
                isUpdate = true;
            } else {
                row = new Row(this, rowModel);
                this.rowsMap[rowModel.id] = row;
                this.rows.push(row);
                this.sortedRows.push(row);
                this.filteredRows.push(row);
                this.customFilteredRows.push(row);
                this.visibleRows.push(row);
            }

            if (rowModel.tasks !== undefined && rowModel.tasks.length > 0) {
                for (i = 0, l = rowModel.tasks.length; i < l; i++) {
                    var taskModel = rowModel.tasks[i];
                    row.addTask(taskModel);
                }

                row.updateVisibleTasks();
            }

            if (isUpdate) {
                this.gantt.api.rows.raise.change(row);
            } else {
                this.gantt.api.rows.raise.add(row);
            }

            if (!isUpdate) {
                var watcher = this.gantt.$scope.$watchCollection(function() {
                    return rowModel.tasks;
                }, function(newTasks, oldTasks) {
                    if (newTasks !== oldTasks) {
                        var i, l;

                        var toRemoveIds = arrays.getRemovedIds(newTasks, oldTasks);
                        for (i = 0, l = toRemoveIds.length; i < l; i++) {
                            var toRemove = toRemoveIds[i];
                            row.removeTask(toRemove);
                        }

                        if (newTasks !== undefined) {
                            for (i = 0, l = newTasks.length; i < l; i++) {
                                var toAdd = newTasks[i];
                                row.addTask(toAdd);
                            }

                            row.updateVisibleTasks();
                        }
                    }
                });

                this.rowsTaskWatchers.push(watcher);
            }

            return isUpdate;
        };

        RowsManager.prototype.removeRow = function(rowId) {
            if (rowId in this.rowsMap) {
                delete this.rowsMap[rowId]; // Remove from map

                var removedRow;
                var row;

                var indexOf = arrays.indexOfId(this.rows, rowId, ['model', 'id']);
                if (indexOf > -1) {
                    removedRow = this.rows.splice(indexOf, 1)[0]; // Remove from array
                    var deregisterFunction = this.rowsTaskWatchers.splice(indexOf, 1)[0]; // Remove watcher
                    deregisterFunction();
                }

                arrays.removeId(this.sortedRows, rowId, ['model', 'id']);
                arrays.removeId(this.filteredRows, rowId, ['model', 'id']);
                arrays.removeId(this.customFilteredRows, rowId, ['model', 'id']);
                arrays.removeId(this.visibleRows, rowId, ['model', 'id']);

                this.gantt.api.rows.raise.remove(removedRow);
                return row;
            }

            return undefined;
        };

        RowsManager.prototype.removeAll = function() {
            this.rowsMap = {};
            this.rows = [];
            this.sortedRows = [];
            this.filteredRows = [];
            this.customFilteredRows = [];
            this.visibleRows = [];

            for (var i = 0, l = this.rowsTaskWatchers.length; i < l; i++) {
                var deregisterFunction = this.rowsTaskWatchers[i];
                deregisterFunction();
            }
            this.rowsTaskWatchers = [];
        };

        RowsManager.prototype.sortRows = function() {
            var expression = this.gantt.options.value('sortMode');

            if (expression !== undefined) {
                var reverse = false;
                if (angular.isString(expression) && expression.charAt(0) === '-') {
                    reverse = true;
                    expression = expression.substr(1);
                }

                var angularOrderBy = $filter('orderBy');
                this.sortedRows = angularOrderBy(this.rows, expression, reverse);
            } else {
                this.sortedRows = this.rows.slice();
            }

            this.sortedRows = this.applyCustomRowSorters(this.sortedRows);

            this.updateVisibleRows();
        };

        RowsManager.prototype.removeCustomRowSorter = function(sorterFunction) {
            var i = this.customRowSorters.indexOf(sorterFunction);
            if (i > -1) {
                this.customRowSorters.splice(i, 1);
            }
        };

        RowsManager.prototype.addCustomRowSorter = function(sorterFunction) {
            this.customRowSorters.push(sorterFunction);
        };

        RowsManager.prototype.applyCustomRowSorters = function(sortedRows) {
            for (var i = 0; i < this.customRowSorters.length; i++) {
                sortedRows = this.customRowSorters[i](sortedRows);
            }
            return sortedRows;
        };

        /**
         * Applies current view sort to data model.
         */
        RowsManager.prototype.applySort = function() {
            var data = this.gantt.$scope.data;
            data.splice(0, data.length); // empty data.
            var rows = [];
            for (var i = 0, l = this.sortedRows.length; i < l; i++) {
                data.push(this.sortedRows[i].model);
                rows.push(this.sortedRows[i]);
            }

            this.rows = rows;
        };

        RowsManager.prototype.moveRow = function(row, targetRow) {
            var sortMode = this.gantt.options.value('sortMode');
            if (sortMode !== undefined) {
                // Apply current sort to model
                this.applySort();
                this.gantt.options.set('sortMode', undefined);
            }

            var targetRowIndex = this.rows.indexOf(targetRow);
            var rowIndex = this.rows.indexOf(row);

            if (targetRowIndex > -1 && rowIndex > -1 && targetRowIndex !== rowIndex) {
                arrays.moveToIndex(this.rows, rowIndex, targetRowIndex);
                arrays.moveToIndex(this.rowsTaskWatchers, rowIndex, targetRowIndex);
                arrays.moveToIndex(this.gantt.$scope.data, rowIndex, targetRowIndex);

                this.gantt.api.rows.raise.change(row);
                this.gantt.api.rows.raise.move(row, rowIndex, targetRowIndex);

                this.updateVisibleObjects();
                this.sortRows();
            }
        };

        RowsManager.prototype.updateVisibleObjects = function() {
            this.updateVisibleRows();
            this.updateVisibleTasks();
        };

        RowsManager.prototype.updateVisibleRows = function() {
            var oldFilteredRows = this.filteredRows;
            var filterRow = this.gantt.options.value('filterRow');
            if (filterRow) {
                if (typeof(filterRow) === 'object') {
                    filterRow = {model: filterRow};
                }

                var filterRowComparator = this.gantt.options.value('filterRowComparator');
                if (typeof(filterRowComparator) === 'function') {
                    //fix issue this.gantt is undefined
                    //
                    var gantt = this.gantt;
                    filterRowComparator = function(actual, expected) {
                        //fix actual.model is undefined
                        return gantt.options.value('filterRowComparator')(actual, expected);
                    };
                }

                this.filteredRows = this.filterImpl(this.sortedRows, filterRow, filterRowComparator);
            } else {
                this.filteredRows = this.sortedRows.slice(0);
            }

            var raiseEvent = !angular.equals(oldFilteredRows, this.filteredRows);
            this.customFilteredRows = this.applyCustomRowFilters(this.filteredRows);

            // TODO: Implement rowLimit like columnLimit to enhance performance for gantt with many rows
            this.visibleRows = this.customFilteredRows;

            this.gantt.api.rows.raise.displayed(this.sortedRows, this.filteredRows, this.visibleRows);

            if (raiseEvent) {
                this.gantt.api.rows.raise.filter(this.sortedRows, this.filteredRows);
            }
        };

        RowsManager.prototype.removeCustomRowFilter = function(filterFunction) {
            var i = this.customRowFilters.indexOf(filterFunction);
            if (i > -1) {
                this.customRowFilters.splice(i, 1);
            }
        };

        RowsManager.prototype.addCustomRowFilter = function(filterFunction) {
            this.customRowFilters.push(filterFunction);
        };

        RowsManager.prototype.applyCustomRowFilters = function(filteredRows) {
            for (var i = 0; i < this.customRowFilters.length; i++) {
                filteredRows = this.customRowFilters[i](filteredRows);
            }
            return filteredRows;
        };

        RowsManager.prototype.setFilterImpl = function(filterImpl) {
            if (!filterImpl) {
                this.filterImpl = this._defaultFilterImpl;
            } else {
                this.filterImpl = filterImpl;
            }
        };

        RowsManager.prototype.updateVisibleTasks = function() {
            var oldFilteredTasks = [];
            var filteredTasks = [];
            var tasks = [];
            var visibleTasks = [];

            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];
                oldFilteredTasks = oldFilteredTasks.concat(row.filteredTasks);
                row.updateVisibleTasks();
                filteredTasks = filteredTasks.concat(row.filteredTasks);
                visibleTasks = visibleTasks.concat(row.visibleTasks);
                tasks = tasks.concat(row.tasks);
            }

            this.gantt.api.tasks.raise.displayed(tasks, filteredTasks, visibleTasks);

            var filterEvent = !angular.equals(oldFilteredTasks, filteredTasks);

            if (filterEvent) {
                this.gantt.api.tasks.raise.filter(tasks, filteredTasks, visibleTasks);
            }
        };

        // Update the position/size of all tasks in the Gantt
        RowsManager.prototype.updateTasksPosAndSize = function() {
            for (var i = 0, l = this.rows.length; i < l; i++) {
                this.rows[i].updateTasksPosAndSize();
            }
        };

        RowsManager.prototype.getExpandedFrom = function(from) {
            from = from ? moment(from) : from;

            var minRowFrom = from;
            for (var i = 0; i < this.rows.length; i++) {
                if (minRowFrom === undefined || minRowFrom > this.rows[i].from) {
                    minRowFrom = this.rows[i];
                }
            }
            if (minRowFrom && (!from || minRowFrom < from)) {
                return minRowFrom;
            }
            return from;
        };

        RowsManager.prototype.getExpandedTo = function(to) {
            to = to ? moment(to) : to;

            var maxRowTo = to;
            for (var i = 0; i < this.rows.length; i++) {
                if (maxRowTo === undefined || maxRowTo < this.rows[i].to) {
                    maxRowTo = this.rows[i].to;
                }
            }
            var toDate = this.gantt.options.value('toDate');
            if (maxRowTo && (!toDate || maxRowTo > toDate)) {
                return maxRowTo;
            }
            return to;
        };

        RowsManager.prototype.getDefaultFrom = function() {
            var defaultFrom;
            for (var i = 0; i < this.rows.length; i++) {
                if (defaultFrom === undefined || this.rows[i].from < defaultFrom) {
                    defaultFrom = this.rows[i].from;
                }
            }
            return defaultFrom;
        };

        RowsManager.prototype.getDefaultTo = function() {
            var defaultTo;
            for (var i = 0; i < this.rows.length; i++) {
                if (defaultTo === undefined || this.rows[i].to > defaultTo) {
                    defaultTo = this.rows[i].to;
                }
            }
            return defaultTo;
        };

        return RowsManager;
    }]);
}());

(function() {
    'use strict';
    angular.module('gantt').factory('GanttTask', ['moment', function(moment) {
        var Task = function(row, model) {
            this.rowsManager = row.rowsManager;
            this.row = row;
            this.model = model;
            this.truncatedLeft = false;
            this.truncatedRight = false;
        };

        Task.prototype.isMilestone = function() {
            return !this.model.to || this.model.from - this.model.to === 0;
        };

        Task.prototype.isOutOfRange = function() {
            var firstColumn = this.rowsManager.gantt.columnsManager.getFirstColumn();
            var lastColumn = this.rowsManager.gantt.columnsManager.getLastColumn();

            return (firstColumn === undefined || this.model.to < firstColumn.date ||
            lastColumn === undefined || this.model.from > lastColumn.endDate);
        };

        // Updates the pos and size of the task according to the from - to date
        Task.prototype.updatePosAndSize = function() {
            var oldViewLeft = this.left;
            var oldViewWidth = this.width;
            var oldTruncatedRight = this.truncatedRight;
            var oldTruncatedLeft = this.truncatedLeft;

            if (!this.isMoving && this.isOutOfRange()) {
                this.modelLeft = undefined;
                this.modelWidth = undefined;
            } else {
                this.modelLeft = this.rowsManager.gantt.getPositionByDate(this.model.from);
                this.modelWidth = this.rowsManager.gantt.getPositionByDate(this.model.to) - this.modelLeft;
            }

            var lastColumn = this.rowsManager.gantt.columnsManager.getLastColumn();
            var maxModelLeft = lastColumn ? lastColumn.left + lastColumn.width : 0;

            var modelLeft = this.modelLeft;
            var modelWidth = this.modelWidth;

            if (this.rowsManager.gantt.options.value('daily')) {
                modelLeft = this.rowsManager.gantt.getPositionByDate(moment(this.model.from).startOf('day'));
                modelWidth = this.rowsManager.gantt.getPositionByDate(moment(this.model.to).endOf('day')) - modelLeft;
            }

            if (modelLeft === undefined || modelWidth === undefined ||
                modelLeft + modelWidth < 0 || modelLeft > maxModelLeft) {
                this.left = undefined;
                this.width = undefined;
            } else {
                this.left = Math.min(Math.max(modelLeft, 0), this.rowsManager.gantt.width);
                if (modelLeft < 0) {
                    this.truncatedLeft = true;
                    if (modelWidth + modelLeft > this.rowsManager.gantt.width) {
                        this.truncatedRight = true;
                        this.width = this.rowsManager.gantt.width;
                    } else {
                        this.truncatedRight = false;
                        this.width = modelWidth + modelLeft;
                    }
                } else if (modelWidth + modelLeft > this.rowsManager.gantt.width) {
                    this.truncatedRight = true;
                    this.truncatedLeft = false;
                    this.width = this.rowsManager.gantt.width - modelLeft;
                } else {
                    this.truncatedLeft = false;
                    this.truncatedRight = false;
                    this.width = modelWidth;
                }

                if (this.width < 0) {
                    this.left = this.left + this.width;
                    this.width = -this.width;
                }
            }

            this.updateView();
            if (!this.rowsManager.gantt.isRefreshingColumns &&
                (oldViewLeft !== this.left ||
                oldViewWidth !== this.width ||
                oldTruncatedRight !== this.truncatedRight ||
                oldTruncatedLeft !== this.truncatedLeft)) {
                this.rowsManager.gantt.api.tasks.raise.viewChange(this);
            }
        };

        Task.prototype.updateView = function() {
            if (this.$element) {
                if (this.left === undefined || this.width === undefined) {
                    this.$element.css('display', 'none');
                } else {
                    this.$element.css({'left': this.left + 'px', 'width': this.width + 'px', 'display': ''});

                    if (this.model.priority > 0) {
                        var priority = this.model.priority;
                        var children = this.$element.children();
                        for (var i = 0; i < children.length; i++) {
                            angular.element(children[i]).css('z-index', priority);
                        }
                    }

                    this.$element.toggleClass('gantt-task-milestone', this.isMilestone());
                }
            }
        };

        Task.prototype.getBackgroundElement = function() {
            if (this.$element !== undefined) {
                var backgroundElement = this.$element[0].querySelector('.gantt-task-background');
                if (backgroundElement !== undefined) {
                    backgroundElement = angular.element(backgroundElement);
                }
                return backgroundElement;
            }
        };

        Task.prototype.getContentElement = function() {
            if (this.$element !== undefined) {
                var contentElement = this.$element[0].querySelector('.gantt-task-content');
                if (contentElement !== undefined) {
                    contentElement = angular.element(contentElement);
                }
                return contentElement;
            }
        };

        Task.prototype.getForegroundElement = function() {
            if (this.$element !== undefined) {
                var foregroundElement = this.$element[0].querySelector('.gantt-task-foreground');
                if (foregroundElement !== undefined) {
                    foregroundElement = angular.element(foregroundElement);
                }
                return foregroundElement;
            }
        };

        // Expands the start of the task to the specified position (in em)
        Task.prototype.setFrom = function(x, magnetEnabled) {
            this.model.from = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
            this.row.setFromTo();
            this.updatePosAndSize();
        };

        // Expands the end of the task to the specified position (in em)
        Task.prototype.setTo = function(x, magnetEnabled) {
            this.model.to = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
            this.row.setFromTo();
            this.updatePosAndSize();
        };

        // Moves the task to the specified position (in em)
        Task.prototype.moveTo = function(x, magnetEnabled) {
            var newTaskRight;
            var newTaskLeft;
            if (x > this.modelLeft) {
                // Driven by right/to side.
                this.model.to = this.rowsManager.gantt.getDateByPosition(x + this.modelWidth, magnetEnabled);
                newTaskRight = this.rowsManager.gantt.getPositionByDate(this.model.to);
                newTaskLeft = newTaskRight - this.modelWidth;
                this.model.from = this.rowsManager.gantt.getDateByPosition(newTaskLeft, false);
            } else {
                // Drive by left/from side.
                this.model.from = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
                newTaskLeft = this.rowsManager.gantt.getPositionByDate(this.model.from);
                newTaskRight = newTaskLeft + this.modelWidth;
                this.model.to = this.rowsManager.gantt.getDateByPosition(newTaskRight, false);
            }

            this.row.setFromTo();
            this.updatePosAndSize();
        };

        Task.prototype.clone = function() {
            return new Task(this.row, angular.copy(this.model));
        };

        return Task;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttBody', ['GanttBodyColumns', 'GanttBodyRows', 'GanttBodyBackground', 'GanttBodyForeground', function(BodyColumns, BodyRows, BodyBackground, BodyForeground) {
        var Body= function(gantt) {
            this.gantt = gantt;

            this.background = new BodyBackground(this);
            this.foreground = new BodyForeground(this);
            this.columns = new BodyColumns(this);
            this.rows = new BodyRows(this);
        };
        return Body;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttBodyBackground', [function() {
        var GanttBodyBackground = function(body) {
            this.body = body;
        };
        return GanttBodyBackground;
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').factory('GanttBodyColumns', [function() {
        var BodyColumns = function(body) {
            this.body = body;
        };
        return BodyColumns;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttBodyForeground', [function() {
        var GanttBodyForeground = function(body) {
            this.body = body;
        };
        return GanttBodyForeground;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttBodyRows', [function() {
        var BodyRows = function(body) {
            this.body = body;
        };
        return BodyRows;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttHeader', ['GanttHeaderColumns', function(HeaderColumns) {
        var Header = function(gantt) {
            this.gantt = gantt;
            this.columns = new HeaderColumns(this);

            this.getHeight = function() {
                return this.$element[0].offsetHeight;
            };
        };
        return Header;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttHeaderColumns', [function() {
        var HeaderColumns = function($element) {
            this.$element = $element;
        };
        return HeaderColumns;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttScroll', [function() {
        var Scroll = function(gantt) {
            this.gantt = gantt;

            this.gantt.api.registerEvent('scroll', 'scroll');

            this.gantt.api.registerMethod('scroll', 'to', Scroll.prototype.scrollTo, this);
            this.gantt.api.registerMethod('scroll', 'toDate', Scroll.prototype.scrollToDate, this);
            this.gantt.api.registerMethod('scroll', 'left', Scroll.prototype.scrollToLeft, this);
            this.gantt.api.registerMethod('scroll', 'right', Scroll.prototype.scrollToRight, this);

            this.gantt.api.registerMethod('scroll', 'setWidth', Scroll.prototype.setWidth, this);
        };

        Scroll.prototype.getScrollLeft = function() {
            if (this.$element === undefined) {
                return undefined;
            } else {
                if (this.cachedScrollLeft === undefined) {
                    this.cachedScrollLeft = this.$element[0].scrollLeft;
                }

                return this.cachedScrollLeft;
            }
        };

        Scroll.prototype.getScrollWidth = function() {
            return this.$element === undefined ? undefined : this.$element[0].scrollWidth;
        };

        Scroll.prototype.getWidth = function() {
            return this.$element === undefined ? undefined : this.$element[0].offsetWidth;
        };

        Scroll.prototype.setWidth = function(width) {
            if (this.$element[0]) {
                this.$element[0].offsetWidth = width;
            }
        };

        Scroll.prototype.getBordersWidth = function() {
            if (this.$element === undefined) {
               return undefined;
            }

            if (this.$element[0].clientWidth) {
               return this.$element[0].offsetWidth - this.$element[0].clientWidth;
            } else {
               //fix for IE11
               var borderLeft = window.getComputedStyle(this.$element[0]).getPropertyValue('border-left-width') ? window.getComputedStyle(this.$element[0]).getPropertyValue('border-left-width').match(/\d+/)[0] : 0;
               var borderRight = window.getComputedStyle(this.$element[0]).getPropertyValue('border-right-width') ? window.getComputedStyle(this.$element[0]).getPropertyValue('border-right-width').match(/\d+/)[0] : 0;

               return parseInt(borderLeft) + parseInt(borderRight);
            }
        };

        Scroll.prototype.getBordersHeight = function() {
            return this.$element === undefined ? undefined : (this.$element[0].offsetHeight - this.$element[0].clientHeight);
        };

        Scroll.prototype.isVScrollbarVisible = function () {
            if (this.$element !== undefined) {
                return this.$element[0].scrollHeight > this.$element[0].offsetHeight;
            }
        };

        Scroll.prototype.isHScrollbarVisible = function () {
            if (this.$element !== undefined) {
                return this.$element[0].scrollWidth > this.$element[0].offsetWidth;
            }
        };

        /**
         * Scroll to a position
         *
         * @param {number} position Position to scroll to.
         */
        Scroll.prototype.scrollTo = function(position) {
            this.$element[0].scrollLeft = position;
            this.$element.triggerHandler('scroll');
        };

        /**
         * Scroll to the left side
         *
         * @param {number} offset Offset to scroll.
         */
        Scroll.prototype.scrollToLeft = function(offset) {
            this.$element[0].scrollLeft -= offset;
            this.$element.triggerHandler('scroll');
        };

        /**
         * Scroll to the right side
         *
         * @param {number} offset Offset to scroll.
         */
        Scroll.prototype.scrollToRight = function(offset) {
            this.$element[0].scrollLeft += offset;
            this.$element.triggerHandler('scroll');
        };

        /**
         * Scroll to a date
         *
         * @param {moment} date moment to scroll to.
         */
        Scroll.prototype.scrollToDate = function(date) {
            var position = this.gantt.getPositionByDate(date);

            if (position !== undefined) {
                this.$element[0].scrollLeft = position - this.$element[0].offsetWidth / 2;
            }
        };

        return Scroll;
    }]);
}());

(function(){
    'use strict';

    angular.module('gantt').factory('GanttSide', [function() {
        var Side= function(gantt) {
            this.gantt = gantt;
        };
        Side.prototype.getWidth = function() {
            if (this.gantt.options.value('showSide')) {
                var width = this.gantt.options.value('sideWidth');
                if (width === undefined && this.$element !== undefined) {
                    if (this.$element.css('width') !== undefined) {
                        this.$element.css('width', '');
                    }
                }
                if (this.$element !== undefined) {
                    width = this.$element[0].offsetWidth;
                }
                if (width !== undefined) {
                    return width;
                }
            }
            return 0;
        };
        Side.prototype.show = function(value) {
            if (this.$element !== undefined) {
                this.$element.toggleClass('ng-hide', !value);
            }
        };
        Side.prototype.isShown = function() {
            if (this.$element !== undefined) {
                return !this.$element.hasClass('ng-hide');
            }
        };

        return Side;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttTimespan', [function() {
        var Timespan = function(gantt, model) {
            this.gantt = gantt;
            this.model = model;
        };

        // Updates the pos and size of the timespan according to the from - to date
        Timespan.prototype.updatePosAndSize = function() {
            this.modelLeft = this.gantt.getPositionByDate(this.model.from);
            this.modelWidth = this.gantt.getPositionByDate(this.model.to) - this.modelLeft;

            var lastColumn = this.gantt.columnsManager.getLastColumn();
            var maxModelLeft = lastColumn ? lastColumn.left + lastColumn.width : 0;

            if (this.modelLeft + this.modelWidth < 0 || this.modelLeft > maxModelLeft) {
                this.left = undefined;
                this.width = undefined;
            } else {
                this.left = Math.min(Math.max(this.modelLeft, 0), this.gantt.width);
                if (this.modelLeft < 0) {
                    this.truncatedLeft = true;
                    if (this.modelWidth + this.modelLeft > this.gantt.width) {
                        this.truncatedRight = true;
                        this.width = this.gantt.width;
                    } else {
                        this.truncatedRight = false;
                        this.width = this.modelWidth + this.modelLeft;
                    }
                } else if (this.modelWidth + this.modelLeft > this.gantt.width) {
                    this.truncatedRight = true;
                    this.truncatedLeft = false;
                    this.width = this.gantt.width - this.modelLeft;
                } else {
                    this.truncatedLeft = false;
                    this.truncatedRight = false;
                    this.width = this.modelWidth;
                }

                if (this.width < 0) {
                    this.left = this.left + this.width;
                    this.width = -this.width;
                }
            }


            this.updateView();
        };

        Timespan.prototype.updateView = function() {
            if (this.$element) {
                if (this.left === undefined || this.width === undefined) {
                    this.$element.css('display', 'none');
                } else {
                    this.$element.css('display', '');
                    this.$element.css('left', this.left + 'px');
                    this.$element.css('width', this.width + 'px');
                }
            }
        };

        // Expands the start of the timespan to the specified position (in em)
        Timespan.prototype.setFrom = function(x) {
            this.from = this.gantt.getDateByPosition(x);
            this.updatePosAndSize();
        };

        // Expands the end of the timespan to the specified position (in em)
        Timespan.prototype.setTo = function(x) {
            this.to = this.gantt.getDateByPosition(x);
            this.updatePosAndSize();
        };

        // Moves the timespan to the specified position (in em)
        Timespan.prototype.moveTo = function(x) {
            this.from = this.gantt.getDateByPosition(x);
            this.to = this.gantt.getDateByPosition(x + this.width);
            this.updatePosAndSize();
        };

        Timespan.prototype.clone = function() {
            return new Timespan(this.gantt, angular.copy(this.model));
        };

        return Timespan;
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('GanttTimespansManager', ['GanttTimespan', function(Timespan) {
        var GanttTimespansManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.timespansMap = {};
            this.timespans = [];

            this.gantt.$scope.$watchCollection('timespans', function(newValue) {
                self.clearTimespans();
                self.loadTimespans(newValue);
            });

            this.gantt.api.registerMethod('timespans', 'load', this.loadTimespans, this);
            this.gantt.api.registerMethod('timespans', 'remove', this.removeTimespans, this);
            this.gantt.api.registerMethod('timespans', 'clear', this.clearTimespans, this);

            this.gantt.api.registerEvent('timespans', 'add');
            this.gantt.api.registerEvent('timespans', 'remove');
            this.gantt.api.registerEvent('timespans', 'change');
        };

        // Adds or updates timespans
        GanttTimespansManager.prototype.loadTimespans = function(timespans) {
            if (!angular.isArray(timespans)) {
                timespans = timespans !== undefined ? [timespans] : [];
            }

            this.gantt.$scope.timespans = timespans;
            for (var i = 0, l = timespans.length; i < l; i++) {
                var timespanModel = timespans[i];
                this.gantt.objectModel.cleanTimespan(timespanModel);
                this.loadTimespan(timespanModel);
            }
        };

        // Adds a timespan or merges the timespan if there is already one with the same id
        GanttTimespansManager.prototype.loadTimespan = function(timespanModel) {
            // Copy to new timespan (add) or merge with existing (update)
            var timespan, isUpdate = false;

            if (timespanModel.id in this.timespansMap) {
                timespan = this.timespansMap[timespanModel.id];
                timespan.model = timespanModel;
                isUpdate = true;
                this.gantt.api.timespans.raise.change(timespan);
            } else {
                timespan = new Timespan(this.gantt, timespanModel);
                this.timespansMap[timespanModel.id] = timespan;
                this.timespans.push(timespan);
                this.gantt.api.timespans.raise.add(timespan);
            }

            timespan.updatePosAndSize();
            return isUpdate;
        };

        GanttTimespansManager.prototype.removeTimespans = function(timespans) {
            if (!angular.isArray(timespans)) {
                timespans = [timespans];
            }

            for (var i = 0, l = timespans.length; i < l; i++) {
                var timespanData = timespans[i];
                // Delete the timespan
                this.removeTimespan(timespanData.id);
            }
            this.updateVisibleObjects();
        };

        GanttTimespansManager.prototype.removeTimespan = function(timespanId) {
            if (timespanId in this.timespansMap) {
                delete this.timespansMap[timespanId]; // Remove from map

                var removedTimespan;
                var timespan;
                for (var i = this.timespans.length - 1; i >= 0; i--) {
                    timespan = this.timespans[i];
                    if (timespan.model.id === timespanId) {
                        removedTimespan = timespan;
                        this.timespans.splice(i, 1); // Remove from array
                        break;
                    }
                }

                this.gantt.api.timespans.raise.remove(removedTimespan);
                return removedTimespan;
            }

            return undefined;
        };

        // Removes all timespans
        GanttTimespansManager.prototype.clearTimespans = function() {
            this.timespansMap = {};
            this.timespans = [];
        };

        GanttTimespansManager.prototype.updateTimespansPosAndSize = function() {
            for (var i = 0, l = this.timespans.length; i < l; i++) {
                this.timespans[i].updatePosAndSize();
            }
        };

        return GanttTimespansManager;
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').service('ganttArrays', [function() {
        return {
            moveToIndex: function(array, oldIndex, newIndex) {
                if (newIndex >= array.length) {
                    var k = newIndex - array.length;
                    while ((k--) + 1) {
                        array.push(undefined);
                    }
                }
                array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
                return array;
            },
            getRemovedIds: function(newArray, oldArray, idProperty) {
                if (idProperty === undefined) {
                    idProperty = 'id';
                }

                var i, l;
                var removedIds = [];

                if (oldArray !== undefined) {
                    for (i = 0, l = oldArray.length; i < l; i++) {
                        removedIds.push(oldArray[i][idProperty]);
                    }
                }

                if (newArray !== undefined) {
                    for (i = 0, l = newArray.length; i < l; i++) {
                        var newObject = newArray[i];

                        if (newObject[idProperty] !== undefined) {
                            var newObjectIndex = removedIds.indexOf(newObject[idProperty]);
                            if (newObjectIndex > -1) {
                                removedIds.splice(newObjectIndex, 1);
                            }
                        }
                    }
                }

                return removedIds;
            },
            indexOfId: function(array, value, idProperties) {
                var i;
                if (idProperties === undefined) {
                    idProperties = 'id';
                } else if (idProperties instanceof Array) {
                    for (i = array.length - 1; i >= 0; i--) {
                        var arrayValue = array[i];
                        for (var k = 0, l = idProperties.length; k < l; k++) {
                            arrayValue = arrayValue[idProperties[k]];
                        }
                        if (arrayValue === value) {
                            return i;
                        }
                    }
                    return -1;
                }
                for (i = array.length - 1; i >= 0; i--) {
                    if (array[i][idProperties] === value) {
                        return i;
                    }
                }
                return -1;
            },
            removeId: function(array, value, idProperties) {
                var indexOf = this.indexOfId(array, value, idProperties);
                if (indexOf > -1) {
                    return array.splice(indexOf, 1)[0];
                }
            },
            remove: function(array, value) {
                var index = array.indexOf(value);
                if (index > -1) {
                    array.splice(index, 1);
                    return true;
                }
                return false;
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').service('ganttBinarySearch', [ function() {
        // Returns the object on the left and right in an array using the given cmp function.
        // The compare function defined which property of the value to compare (e.g.: c => c.left)

        return {
            getIndicesOnly: function(input, value, comparer, strict) {
                var lo = -1, hi = input.length;
                while (hi - lo > 1) {
                    var mid = Math.floor((lo + hi) / 2);
                    if (strict ? comparer(input[mid]) < value : comparer(input[mid]) <= value) {
                        lo = mid;
                    } else {
                        hi = mid;
                    }
                }
                if (!strict && input[lo] !== undefined && comparer(input[lo]) === value) {
                    hi = lo;
                }
                return [lo, hi];
            },
            get: function(input, value, comparer, strict) {
                var res = this.getIndicesOnly(input, value, comparer, strict);
                return [input[res[0]], input[res[1]]];
            }
        };
    }]);
}());

(function() {
    'use strict';

    angular.module('gantt').factory('GanttHierarchy', [function() {
        var Hierarchy = function() {
            var self = this;

            var nameToRow = {};

            var idToRow = {};

            var nameToChildren = {};
            var idToChildren = {};

            var nameToParent = {};
            var idToParent = {};

            var registerChildRow = function(row, childRow) {
                if (childRow !== undefined) {
                    var nameChildren = nameToChildren[row.model.name];
                    if (nameChildren === undefined) {
                        nameChildren = [];
                        nameToChildren[row.model.name] = nameChildren;
                    }
                    nameChildren.push(childRow);


                    var idChildren = idToChildren[row.model.id];
                    if (idChildren === undefined) {
                        idChildren = [];
                        idToChildren[row.model.id] = idChildren;
                    }
                    idChildren.push(childRow);

                    nameToParent[childRow.model.name] = row;
                    idToParent[childRow.model.id] = row;
                }
            };

            this.refresh = function(rows) {
                nameToRow = {};
                idToRow = {};

                nameToChildren = {};
                idToChildren = {};

                nameToParent = {};
                idToParent = {};

                var row;

                for (var i = 0; i < rows.length; i++) {
                    row = rows[i];
                    nameToRow[row.model.name] = row;
                    idToRow[row.model.id] = row;
                }

                for (i = 0; i < rows.length; i++) {
                    row = rows[i];
                    if (row.model.parent !== undefined) {
                        var parentRow = nameToRow[row.model.parent];
                        if (parentRow === undefined) {
                            parentRow = idToRow[row.model.parent];
                        }

                        if (parentRow !== undefined) {
                            registerChildRow(parentRow, row);
                        }
                    }

                    if (row.model.children !== undefined) {
                        var children = row.model.children;
                        for (var j = 0; j<children.length; j++) {
                            var childRowNameOrId = children[j];
                            var childRow = nameToRow[childRowNameOrId];
                            if (childRow === undefined) {
                                childRow = idToRow[childRowNameOrId];
                            }

                            if (childRow !== undefined) {
                                registerChildRow(row, childRow);
                            }
                        }
                    }
                }

                var rootRows = [];
                for (i = 0; i < rows.length; i++) {
                    row = rows[i];
                    if (self.parent(row) === undefined) {
                        rootRows.push(row);
                    }
                }

                return rootRows;
            };

            this.children = function(row) {
                var children = idToChildren[row.model.id];
                return children;
            };

            this.descendants = function(row) {
                var descendants = [];

                var children = self.children(row);
                descendants.push.apply(descendants, children);
                if (children !== undefined) {
                    for (var i=0; i<children.length; i++) {
                        var childDescendants = self.descendants(children[i]);
                        descendants.push.apply(descendants, childDescendants);
                    }
                }

                return descendants;
            };

            this.parent = function(row) {
                var parent = idToParent[row.model.id];
                return parent;
            };

            this.ancestors = function(row) {
                var ancestors = [];

                var parent = self.parent(row);
                while (parent !== undefined) {
                    ancestors.push(parent);
                    parent = self.parent(parent);
                }

                return ancestors;
            };
        };

        return Hierarchy;
    }]);
}());

(function() {
    'use strict';
    angular.module('gantt').service('ganttUtils', [function() {
        return {
            createBoundedWrapper: function(object, method) {
                return function() {
                    return method.apply(object, arguments);
                };
            },
            firstProperty: function(objects, propertyName, defaultValue) {
                for (var i = 0, l = objects.length; i < l; i++) {
                    var object = objects[i];
                    if (object !== undefined && propertyName in object) {
                        if (object[propertyName] !== undefined) {
                            return object[propertyName];
                        }
                    }
                }
                return defaultValue;
            },
            angularIndexOf: function(arr, obj) {
                for (var i = 0; i < arr.length; i++) {
                    if (angular.equals(arr[i], obj)) {
                        return i;
                    }
                }
                return -1;
            },
            random4: function() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            },
            randomUuid: function() {
                return this.random4() + this.random4() + '-' + this.random4() + '-' + this.random4() + '-' +
                    this.random4() + '-' + this.random4() + this.random4() + this.random4();
            },
            newId: (function() {
                var seedId = new Date().getTime();
                return function() {
                    return seedId += 1;
                };
            })()
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').filter('ganttColumnLimit', [ 'ganttBinarySearch', function(bs) {
        // Returns only the columns which are visible on the screen
        var leftComparator = function(c) {
            return c.left;
        };

        return function(input, gantt) {
            var scrollLeft = gantt.scroll.getScrollLeft();
            var scrollContainerWidth = gantt.getWidth() - gantt.side.getWidth();

            if (scrollContainerWidth > 0) {
                var start = bs.getIndicesOnly(input, scrollLeft, leftComparator)[0];
                var end = bs.getIndicesOnly(input, scrollLeft + scrollContainerWidth, leftComparator)[1];
                return input.slice(start, end);
            } else {
                return input.slice();
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').filter('ganttTaskLimit', [function() {
        // Returns only the tasks which are visible on the screen
        // Use the task width and position to decide if a task is still visible

        return function(input, gantt) {
            var firstColumn = gantt.columnsManager.getFirstColumn();
            var lastColumn = gantt.columnsManager.getLastColumn();

            if (firstColumn !== undefined && lastColumn !== undefined) {
                var fromDate = firstColumn.date;
                var toDate = lastColumn.endDate;

                var res = [];

                var scrollLeft = gantt.scroll.getScrollLeft();
                var scrollContainerWidth = gantt.getWidth() - gantt.side.getWidth();

                for (var i = 0, l = input.length; i < l; i++) {
                    var task = input[i];

                    if (task.active) {
                        res.push(task);
                    } else {
                        // If the task can be drawn with gantt columns only.
                        if (task.model.to >= fromDate && task.model.from <= toDate) {

                            if (task.left === undefined) {
                                task.updatePosAndSize();
                            }

                            // If task has a visible part on the screen
                            if (!scrollContainerWidth ||
                                task.left >= scrollLeft && task.left <= scrollLeft + scrollContainerWidth ||
                                task.left + task.width >= scrollLeft && task.left + task.width <= scrollLeft + scrollContainerWidth ||
                                task.left < scrollLeft && task.left + task.width > scrollLeft + scrollContainerWidth) {

                                res.push(task);
                            }
                        }
                    }
                }

                return res;
            } else {
                return input.splice();
            }
        };
    }]);
}());


(function() {
    'use strict';

    angular.module('gantt').directive('ganttResizer', ['$document', '$parse', '$timeout', 'ganttMouseOffset', function($document, $parse, $timeout, mouseOffset) {
        return {
            restrict: 'A',
            require: '^gantt',
            scope: {
                targetElement: '=ganttResizer',
                enabled: '@?ganttResizerEnabled'
            },
            link: function ($scope, $element, $attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;
                var eventTopic = $attrs.ganttResizerEventTopic;

                if ($scope.enabled === undefined) {
                    $scope.enabled = true;
                }

                function getWidth() {
                    return ganttCtrl.gantt.options.value($attrs.resizerWidth);
                }

                function setWidth(width) {
                    if (width !== getWidth()) {
                        ganttCtrl.gantt.options.set($attrs.resizerWidth, width);

                        if (eventTopic !== undefined) {
                            api[eventTopic].raise.resize(width);
                        }

                        $timeout(function() {
                            ganttCtrl.gantt.columnsManager.updateColumnsMeta();
                        });
                    }
                }

                function dblclick(event) {
                    event.preventDefault();
                    setWidth(undefined);
                }

                function mousemove(event) {
                    $scope.$evalAsync(function (){
                        var offset = mouseOffset.getOffsetForElement($scope.targetElement[0], event);
                        var maxWidth = ganttCtrl.gantt.getWidth()-ganttCtrl.gantt.scroll.getBordersWidth();
                        var width = Math.min(Math.max(offset.x, 0), maxWidth);
                        setWidth(width);
                    });
                }

                function mouseup() {
                    if (eventTopic !== undefined) {
                        api[eventTopic].raise.resizeEnd(getWidth());
                    }
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }


                function mousedown(event) {
                    event.preventDefault();

                    if (eventTopic !== undefined) {
                        api[eventTopic].raise.resizeBegin(getWidth());
                    }
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                }

                $attrs.$observe('ganttResizerEnabled', function(value) {
                    $scope.enabled = $parse(value)();
                });

                $scope.$watch('enabled', function (value) {
                    if (value === undefined) {
                        value = true;
                    }

                    $element.toggleClass('gantt-resizer-enabled', value);

                    if (value) {
                        $element.on('dblclick', dblclick);
                        $element.on('mousedown', mousedown);
                    } else {
                        $element.off('dblclick', dblclick);
                        $element.off('mousedown', mousedown);
                    }
                });

                $scope.$watch(function() {
                    return getWidth();
                }, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.targetElement.css('width', newValue + 'px');
                        // Setting width again is required when min-width of max-width is set on targetElement.
                        // This avoid going to a smaller or bigger value than targetElement capabilities.
                        // Call of 'offsetWidth' is slow. Behaviour needs to be improved.
                        if ($scope.targetElement[0].offsetWidth > 0) {
                            setWidth($scope.targetElement[0].offsetWidth);
                        }
                    }
                });

                if (eventTopic) {
                    api.registerEvent(eventTopic, 'resize');
                    api.registerEvent(eventTopic, 'resizeBegin');
                    api.registerEvent(eventTopic, 'resizeEnd');
                    api.registerMethod(eventTopic, 'setWidth', setWidth, this);
                    api.registerMethod(eventTopic, 'getWidth', getWidth, this);
                }
            }
        };
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').directive('ganttHorizontalScrollReceiver', function() {
        // The element with this attribute will scroll at the same time as the scrollSender element

        return {
            restrict: 'A',
            require: '^ganttScrollManager',
            link: function(scope, element, attrs, ganttScrollManagerCtrl) {
                ganttScrollManagerCtrl.registerHorizontalReceiver(element);
            }
        };
    });
}());

(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollManager', function() {
        // The element with this attribute will scroll at the same time as the scrollSender element

        return {
            restrict: 'A',
            scope: {},
            controller: ['$scope', function($scope) {
                $scope.horizontal = [];
                $scope.vertical = [];

                this.registerVerticalReceiver = function (element) {
                    element.css('position', 'relative');
                    $scope.vertical.push(element[0]);
                };

                this.registerHorizontalReceiver = function (element) {
                    element.css('position', 'relative');
                    $scope.horizontal.push(element[0]);
                };

                this.getHorizontalRecievers = function() {
                    return $scope.horizontal;
                };

                this.getVerticalRecievers = function() {
                    return $scope.vertical;
                };
            }]
        };
    });
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollSender', [function() {
        // Updates the element which are registered for the horizontal or vertical scroll event

        return {
            restrict: 'A',
            require: ['^gantt', '^ganttScrollManager'],
            link: function(scope, element, attrs, controllers) {
                var el = element[0];

                var updateListeners = function() {
                    var i, l;

                    var vertical = controllers[1].getVerticalRecievers();
                    for (i = 0, l = vertical.length; i < l; i++) {
                        var vElement = vertical[i];
                        if (vElement.parentNode.scrollTop !== el.scrollTop) {
                            vElement.parentNode.scrollTop = el.scrollTop;
                        }
                    }

                    var horizontal = controllers[1].getHorizontalRecievers();
                    for (i = 0, l = horizontal.length; i < l; i++) {
                        var hElement = horizontal[i];
                        if (hElement.parentNode.scrollLeft !== el.scrollLeft) {
                            hElement.parentNode.scrollLeft  = el.scrollLeft;
                        }
                    }
                };

                element.bind('scroll', updateListeners);

                scope.$watch(function() {
                    return controllers[0].gantt.width;
                }, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var horizontal = controllers[1].getHorizontalRecievers();
                        for (var i = 0, l = horizontal.length; i < l; i++) {
                            var hElement = horizontal[i];
                            hElement.style.width = newValue + 'px';
                        }
                    }
                });
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollable', ['GanttDirectiveBuilder', '$timeout', 'ganttDebounce', 'moment', function(Builder, $timeout, debounce, moment) {
        var builder = new Builder('ganttScrollable');
        builder.controller = function($scope, $element) {
            $scope.gantt.scroll.$element = $element;
            var lastScrollLeft;
            var autoExpandTimer;

            var autoExpandColumns = function(el, date, direction) {
                var autoExpand = $scope.gantt.options.value('autoExpand');
                if (autoExpand !== 'both' && autoExpand !== true && autoExpand !== direction) {
                    return;
                }

                var from, to;

                var viewScale = $scope.gantt.options.value('viewScale');
                viewScale = viewScale.trim();
                if (viewScale.charAt(viewScale.length - 1) === 's') {
                    viewScale = viewScale.substring(0, viewScale.length - 1);
                }
                var viewScaleValue;
                var viewScaleUnit;
                var splittedViewScale;

                if (viewScale) {
                    splittedViewScale = viewScale.split(' ');
                }
                if (splittedViewScale && splittedViewScale.length > 1) {
                    viewScaleValue = parseFloat(splittedViewScale[0]);
                    viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
                } else {
                    viewScaleValue = 1;
                    viewScaleUnit = viewScale;
                }

                if (direction === 'left') {
                    from = moment(date).add(-5 * viewScaleValue, viewScaleUnit);
                    $scope.fromDate = from;
                } else {
                    to = moment(date).add(5 * viewScaleValue, viewScaleUnit);
                    $scope.toDate = to;
                }

                $scope.gantt.api.scroll.raise.scroll(el.scrollLeft, date, direction);
            };

            $element.bind('scroll', debounce(function() {
                var el = $element[0];
                var currentScrollLeft = el.scrollLeft;
                var direction;
                var date;

                $scope.gantt.scroll.cachedScrollLeft = currentScrollLeft;
                $scope.gantt.columnsManager.updateVisibleColumns();
                $scope.gantt.rowsManager.updateVisibleObjects();

                if (currentScrollLeft < lastScrollLeft && currentScrollLeft === 0) {
                    direction = 'left';
                    date = $scope.gantt.columnsManager.from;
                } else if (currentScrollLeft > lastScrollLeft && el.offsetWidth + currentScrollLeft >= el.scrollWidth - 1) {
                    direction = 'right';
                    date = $scope.gantt.columnsManager.to;
                }

                lastScrollLeft = currentScrollLeft;

                if (date !== undefined) {
                    if (autoExpandTimer) {
                        $timeout.cancel(autoExpandTimer);
                    }

                    autoExpandTimer = $timeout(function() {
                        autoExpandColumns(el, date, direction);
                    }, 300);
                } else {
                    $scope.gantt.api.scroll.raise.scroll(currentScrollLeft);
                }
            }, 5));

            $scope.getScrollableCss = function() {
                var css = {};

                var maxHeight = $scope.gantt.options.value('maxHeight');
                if (maxHeight > 0) {
                    css['max-height'] = maxHeight - $scope.gantt.header.getHeight() + 'px';
                    css['overflow-y'] = 'auto';

                    if ($scope.gantt.scroll.isVScrollbarVisible()) {
                        css['border-right'] = 'none';
                    }
                }

                var columnWidth = this.gantt.options.value('columnWidth');
                var bodySmallerThanGantt = $scope.gantt.width === 0 ? false: $scope.gantt.width < $scope.gantt.getWidth() - $scope.gantt.side.getWidth();
                if (columnWidth !== undefined && bodySmallerThanGantt) {
                    css.width = ($scope.gantt.width + this.gantt.scroll.getBordersWidth()) + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttVerticalScrollReceiver', function() {
        // The element with this attribute will scroll at the same time as the scrollSender element

        return {
            restrict: 'A',
            require: '^ganttScrollManager',
            link: function(scope, element, attrs, ganttScrollManagerCtrl) {
                ganttScrollManagerCtrl.registerVerticalReceiver(element);
            }
        };
    });
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttElementHeightListener', [function() {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var scopeVariable = $attrs.ganttElementHeightListener;
                if (scopeVariable === '') {
                    scopeVariable = 'ganttElementHeight';
                }

                var effectiveScope = $scope;

                while(scopeVariable.indexOf('$parent.') === 0) {
                    scopeVariable = scopeVariable.substring('$parent.'.length);
                    effectiveScope = effectiveScope.$parent;
                }

                effectiveScope.$watch(function() {
                    return $element[0].offsetHeight;
                }, function(newValue) {
                    if (newValue > 0) {
                        effectiveScope[scopeVariable] = newValue;
                    }
                });
            }]
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttElementWidthListener', [function() {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var scopeVariable = $attrs.ganttElementWidthListener;
                if (scopeVariable === '') {
                    scopeVariable = 'ganttElementWidth';
                }

                var effectiveScope = $scope;

                while(scopeVariable.indexOf('$parent.') === 0) {
                    scopeVariable = scopeVariable.substring('$parent.'.length);
                    effectiveScope = effectiveScope.$parent;
                }

                effectiveScope.$watch(function() {
                    return $element[0].offsetWidth;
                }, function(newValue) {
                    if (newValue > 0) {
                        effectiveScope[scopeVariable] = newValue;
                    }
                });
            }]
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttBody', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBody');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.$element = $element;
            $scope.gantt.body.$scope = $scope;
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttBodyBackground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBodyBackground');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.background.$element = $element;
            $scope.gantt.body.background.$scope = $scope;
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttBodyColumns', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBodyColumns');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.columns.$element = $element;
            $scope.gantt.body.background.$scope = $scope;
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttBodyForeground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBodyForeground');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.foreground.$element = $element;
            $scope.gantt.body.foreground.$scope = $scope;
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttBodyRows', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBodyRows');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.rows.$element = $element;
            $scope.gantt.body.rows.$scope = $scope;
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttColumn', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttColumn');
        builder.controller = function($scope, $element) {
            $scope.column.$element = $element;
            $scope.column.$scope = $scope;
            $scope.column.updateView();
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttColumnHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttColumnHeader');
        builder.controller = function($scope, $element) {
            $scope.column.$element = $element;
            $scope.column.$scope = $scope;
            $scope.column.updateView();
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttHeader');
        builder.controller = function($scope, $element) {
            $scope.gantt.header.$element = $element;
            $scope.gantt.header.$scope = $scope;
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttHeaderColumns', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttHeaderColumns');
        builder.controller = function($scope, $element) {
            $scope.gantt.header.columns.$element = $element;
            $scope.gantt.header.columns.$scope = $scope;
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttRow', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRow');
        builder.controller = function($scope, $element) {
            $scope.row.$element = $element;
            $scope.row.$scope = $scope;
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttRowBackground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRowBackground');
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttRowLabel', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRowLabel');
        builder.restrict = 'A';
        builder.templateUrl = undefined;
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollableHeader', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttScrollableHeader');
        builder.controller = function($scope) {
            var scrollBarWidth = layout.getScrollBarWidth();
            //var oldMaxHeightActivated = false;
            $scope.getScrollableHeaderCss = function() {
                var css = {};

                var maxHeightActivated = $scope.gantt.scroll.isVScrollbarVisible();
                var vScrollbarWidth = maxHeightActivated ? scrollBarWidth: 0;
                var columnWidth = this.gantt.options.value('columnWidth');
                var bodySmallerThanGantt = $scope.gantt.width === 0 ? false: $scope.gantt.width < $scope.gantt.getWidth() - $scope.gantt.side.getWidth();

                if (columnWidth !== undefined && bodySmallerThanGantt) {
                    css.width = ($scope.gantt.width - vScrollbarWidth + this.gantt.scroll.getBordersWidth()) + 'px';
                } else if (maxHeightActivated) {
                    css.width = $scope.gantt.getWidth() - $scope.gantt.side.getWidth() - vScrollbarWidth + 'px';
                }

                /*
                if (oldMaxHeightActivated !== maxHeightActivated) {
                    oldMaxHeightActivated = maxHeightActivated;
                    $scope.gantt.columnsManager.updateColumnsMeta();
                }
                */

                return css;
            };
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttSide', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSide');
        builder.controller = function($scope, $element) {
            $scope.gantt.side.$element = $element;
            $scope.gantt.side.$scope = $scope;
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttSideBackground', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttSideBackground');
        builder.controller = function($scope) {
            var hScrollBarHeight = layout.getScrollBarHeight();

            $scope.getMaxHeightCss = function() {
                var css = {};

                if ($scope.maxHeight) {
                    var bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
                    css['max-height'] = $scope.maxHeight - bodyScrollBarHeight - $scope.gantt.header.getHeight() + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttSideContent', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSideContent');
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttTask', ['GanttDirectiveBuilder', 'moment', function(Builder, moment) {
        var builder = new Builder('ganttTask');
        builder.controller = function($scope, $element) {
            $scope.task.$element = $element;
            $scope.task.$scope = $scope;

            $scope.getTaskContent = function() {
                if ($scope.task.model.content !== undefined) {
                    return $scope.task.model.content;
                }
                return $scope.task.rowsManager.gantt.options.value('taskContent');
            };

            $scope.simplifyMoment = function(d) {
                return moment.isMoment(d) ? d.unix() : d;
            };

            $scope.$watchGroup(['simplifyMoment(task.model.from)', 'simplifyMoment(task.model.to)'], function() {
                $scope.task.updatePosAndSize();
            });
        };
        return builder.build();
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').directive('ganttTaskBackground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTaskBackground');
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttTaskContent', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTaskContent');
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttTaskForeground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTaskForeground');
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttTimeFrame', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTimeFrame');
        builder.controller = function($scope, $element) {
            $scope.timeFrame.$element = $element;
            $scope.timeFrame.$scope = $scope;
            $scope.timeFrame.updateView();
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').directive('ganttTimespan', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTimespan');
        builder.controller = function($scope, $element) {
            $scope.timespan.$element = $element;
            $scope.timespan.$scope = $scope;
            $scope.timespan.updateView();
        };
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').factory('ganttDebounce', ['$timeout', function($timeout) {
        function debounce(fn, timeout, invokeApply) {
            var nthCall = 0;
            return function() {
                var self = this;
                var argz = arguments;
                nthCall++;
                var later = (function(version) {
                    return function() {
                        if (version === nthCall) {
                            return fn.apply(self, argz);
                        }
                    };
                })(nthCall);
                return $timeout(later, timeout, invokeApply === undefined ? true: invokeApply);
            };
        }

        return debounce;
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').service('GanttDirectiveBuilder', ['$templateCache', function($templateCache) {
        var DirectiveBuilder = function DirectiveBuilder(directiveName, templateUrl, require, restrict) {
            var self = this;

            this.directiveName = directiveName;
            this.templateUrl = templateUrl === undefined ? 'template/' + directiveName + '.tmpl.html' : templateUrl;
            this.require = require === undefined ? '^gantt' : require;
            this.restrict = restrict === undefined ? 'E' : restrict;
            this.scope = false;
            this.transclude = true;
            this.replace = true;

            this.build = function() {
                var directiveName = self.directiveName;
                var templateUrl = self.templateUrl;
                var controllerFunction = self.controller;

                var directive = {
                    restrict: self.restrict,
                    require: self.require,
                    transclude: self.transclude,
                    replace: self.replace,
                    scope: self.scope,
                    templateUrl: function(tElement, tAttrs) {
                        if (tAttrs.templateUrl !== undefined) {
                            templateUrl = tAttrs.templateUrl;
                        }
                        if (tAttrs.template !== undefined) {
                            $templateCache.put(templateUrl, tAttrs.template);
                        }
                        return templateUrl;
                    },
                    compile: function () {
                        return {
                            pre: function preLink(scope, iElement, iAttrs, controller) {
                                scope.gantt.api.directives.raise.preLink(directiveName, scope, iElement, iAttrs, controller);
                            },
                            post: function postLink(scope, iElement, iAttrs, controller) {
                                scope.gantt.api.directives.raise.postLink(directiveName, scope, iElement, iAttrs, controller);

                            }
                        };
                    },
                    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                        var controller = this;

                        if (controllerFunction !== undefined) {
                            controllerFunction($scope, $element, $attrs, controller);
                        }

                        $scope.gantt.api.directives.raise.controller(directiveName, $scope, $element, $attrs, controller);
                        $scope.$on('$destroy', function() {
                            $scope.gantt.api.directives.raise.destroy(directiveName, $scope, $element, $attrs, controller);
                        });

                        $scope.$applyAsync(function() {
                            $scope.gantt.api.directives.raise.new(directiveName, $scope, $element, $attrs, controller);
                        });
                    }]
                };

                if (!templateUrl) {
                    delete directive.templateUrl;
                    delete directive.replace;
                    delete directive.transclude;
                }

                return directive;
            };
        };

        return DirectiveBuilder;
    }]);
}());

(function() {
    'use strict';
    angular.module('gantt').service('ganttDom', ['$document', function($document) {
        return {
            elementFromPoint: function(x, y) {
                return $document[0].elementFromPoint(x, y);
            },
            elementsFromPoint: function(x, y, depth) {
                var elements = [], previousPointerEvents = [], cDepth = 0, current, i, l, d;

                // get all elements via elementFromPoint, and remove them from hit-testing in order
                while ((current = this.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current !== null &&
                (depth === undefined || cDepth < depth)) {

                    // push the element and its current style
                    elements.push(current);
                    previousPointerEvents.push({
                        value: current.style.getPropertyValue('visibility'),
                        priority: current.style.getPropertyPriority('visibility')
                    });

                    // add "pointer-events: none", to get to the underlying element
                    current.style.setProperty('visibility', 'hidden', 'important');

                    cDepth++;
                }

                // restore the previous pointer-events values
                for (i = 0, l = previousPointerEvents.length; i < l; i++) {
                    d = previousPointerEvents[i];
                    elements[i].style.setProperty('visibility', d.value ? d.value : '', d.priority);
                }

                return elements;
            },
            findElementFromPoint: function(x, y, checkFunction) {
                var elements = [], previousPointerEvents = [], cDepth = 0, current, found, i, l, d;

                // get all elements via elementFromPoint, and remove them from hit-testing in order
                while ((current = this.elementFromPoint(x, y)) && elements.indexOf(current) === -1 && current !== null) {

                    // push the element and its current style
                    elements.push(current);
                    previousPointerEvents.push({
                        value: current.style.getPropertyValue('visibility'),
                        priority: current.style.getPropertyPriority('visibility')
                    });

                    // add "visibility: hidden", to get to the underlying element.
                    // Would be better with pointer-events: none, but IE<11 doesn't support this.
                    current.style.setProperty('visibility', 'hidden', 'important');

                    cDepth++;

                    if (checkFunction(current)) {
                        found = current;
                        break;
                    }
                }

                // restore the previous pointer-events values
                for (i = 0, l = previousPointerEvents.length; i < l; i++) {
                    d = previousPointerEvents[i];
                    elements[i].style.setProperty('visibility', d.value ? d.value : '', d.priority);
                }

                return found;
            },
            isElementVisible: function(element) {
                return element.offsetParent !== undefined && element.offsetParent !== null;
            }
        };
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').service('ganttEnableNgAnimate', ['$injector', function($injector) {
        var ngAnimate;
        try {
            ngAnimate = $injector.get('$animate');
        } catch (e) {
        }

        if (ngAnimate !== undefined) {
            return function(element, enabled) {
                if (angular.version.major >= 1 && angular.version.minor >= 4) {
                    // AngularJS 1.4 breaking change, arguments are flipped.
                    ngAnimate.enabled(element, enabled);
                } else {
                    ngAnimate.enabled(enabled, element);
                }

            };
        } else {
            return angular.noop;
        }


    }]);
}());


(function() {
    'use strict';
    angular.module('gantt').directive('ganttBindCompileHtml', ['$compile', function($compile) {
        return {
            restrict: 'A',
            require: '^gantt',
            link: function(scope, element, attrs, ganttCtrl) {
                scope.scope = ganttCtrl.gantt.$scope.$parent;
                scope.$watch(function() {
                    return scope.$eval(attrs.ganttBindCompileHtml);
                }, function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                });
            }
        };
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').service('ganttLayout', ['$document', function($document) {
        return {
            /**
             * Compute the width of scrollbar.
             *
             * @returns {number} width of the scrollbar, in px.
             */
            getScrollBarWidth: function() {
                var inner = $document[0].createElement('p');
                inner.style.width = '100%';
                inner.style.height = '200px';

                var outer = $document[0].createElement('div');
                outer.style.position = 'absolute';
                outer.style.top = '0px';
                outer.style.left = '0px';
                outer.style.visibility = 'hidden';
                outer.style.width = '200px';
                outer.style.height = '150px';
                outer.style.overflow = 'hidden';
                outer.appendChild (inner);

                $document[0].body.appendChild (outer);

                var w1 = inner.offsetWidth;
                outer.style.overflow = 'scroll';

                var w2 = inner.offsetWidth;
                if (w1 === w2) {
                    w2 = outer.clientWidth;
                }

                $document[0].body.removeChild (outer);

                return (w1 - w2);
            },
            /**
             * Compute the height of scrollbar.
             *
             * @returns {number} height of the scrollbar, in px.
             */
            getScrollBarHeight: function() {
                var inner = $document[0].createElement('p');
                inner.style.width = '200px;';
                inner.style.height = '100%';

                var outer = $document[0].createElement('div');
                outer.style.position = 'absolute';
                outer.style.top = '0px';
                outer.style.left = '0px';
                outer.style.visibility = 'hidden';
                outer.style.width = '150px';
                outer.style.height = '200px';
                outer.style.overflow = 'hidden';
                outer.appendChild (inner);

                $document[0].body.appendChild (outer);

                var h1 = inner.offsetHeight;
                outer.style.overflow = 'scroll';

                var h2 = inner.offsetHeight;
                if (h1 === h2) {
                    h2 = outer.clientHeight;
                }

                $document[0].body.removeChild (outer);

                return (h1 - h2);
            },

            setColumnsWidthFactor: function(columns, widthFactor, originalLeftOffset) {
                if (!columns) {
                    return;
                }

                if (!originalLeftOffset) {
                    originalLeftOffset = 0;
                }

                for (var i=0; i<columns.length; i++) {
                    var column = columns[i];
                    column.left = (widthFactor * (column.originalSize.left + originalLeftOffset)) - originalLeftOffset;
                    column.width = widthFactor * column.originalSize.width;

                    for (var j=0; j<column.timeFrames.length; j++) {
                        var timeFrame = column.timeFrames[j];
                        timeFrame.left = widthFactor * timeFrame.originalSize.left;
                        timeFrame.width = widthFactor * timeFrame.originalSize.width;
                    }
                }
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt').service('ganttMouseButton', [ function() {
        // Mouse button cross browser normalization

        return {
            getButton: function(e) {
                e = e || window.event;

                if (!e.which) {
                    if (e.button === undefined) {
                        return 1;
                    }
                    return e.button < 2 ? 1 : e.button === 4 ? 2 : 3;
                } else {
                    return e.which;
                }
            }
        };
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').service('ganttMouseOffset', [ function() {
        // Mouse offset support for lesser browsers (read IE 8)

        return {
            getTouch: function(evt) {
                if (evt.touches !== undefined) {
                    return evt.touches[0];
                }
                return evt;
            },
            getOffset: function(evt) {
                if (evt.offsetX && evt.offsetY) {
                    return { x: evt.offsetX, y: evt.offsetY };
                }
                if (evt.layerX && evt.layerY) {
                    return { x: evt.layerX, y: evt.layerY };
                }
                return this.getOffsetForElement(evt.target, evt);
            },
            getOffsetForElement: function(el, evt) {
                var bb = el.getBoundingClientRect();
                return { x: evt.clientX - bb.left, y: evt.clientY - bb.top };
            }
        };
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').factory('ganttSmartEvent', [function() {
        // Auto released the binding when the scope is destroyed. Use if an event is registered on another element than the scope.

        function smartEvent($scope, $element, event, fn) {
            $scope.$on('$destroy', function() {
                $element.unbind(event, fn);
            });

            return {
                bindOnce: function() {
                    $element.one(event, fn);
                },
                bind: function() {
                    $element.bind(event, fn);
                },
                unbind: function() {
                    $element.unbind(event, fn);
                }
            };
        }

        return smartEvent;
    }]);
}());

angular.module('gantt.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('template/gantt.tmpl.html',
        '<div class="gantt unselectable" ng-cloak gantt-scroll-manager gantt-element-width-listener="ganttElementWidth">\n' +
        '    <gantt-side>\n' +
        '        <gantt-side-background>\n' +
        '        </gantt-side-background>\n' +
        '        <gantt-side-content>\n' +
        '        </gantt-side-content>\n' +
        '        <div gantt-resizer="gantt.side.$element" gantt-resizer-event-topic="side" gantt-resizer-enabled="{{$parent.gantt.options.value(\'allowSideResizing\')}}" resizer-width="sideWidth" class="gantt-resizer">\n' +
        '            <div ng-show="$parent.gantt.options.value(\'allowSideResizing\')" class="gantt-resizer-display"></div>\n' +
        '        </div>\n' +
        '    </gantt-side>\n' +
        '    <gantt-scrollable-header>\n' +
        '        <gantt-header gantt-element-height-listener="$parent.ganttHeaderHeight">\n' +
        '            <gantt-header-columns>\n' +
        '                <div ng-repeat="header in gantt.columnsManager.visibleHeaders track by $index">\n' +
        '                    <div class="gantt-header-row" ng-class="{\'gantt-header-row-last\': $last, \'gantt-header-row-first\': $first}">\n' +
        '                        <gantt-column-header ng-repeat="column in header"></gantt-column-header>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </gantt-header-columns>\n' +
        '        </gantt-header>\n' +
        '    </gantt-scrollable-header>\n' +
        '    <gantt-scrollable>\n' +
        '        <gantt-body>\n' +
        '            <gantt-body-background>\n' +
        '                <gantt-row-background ng-repeat="row in gantt.rowsManager.visibleRows track by row.model.id"></gantt-row-background>\n' +
        '            </gantt-body-background>\n' +
        '            <gantt-body-foreground>\n' +
        '                <div class="gantt-current-date-line" ng-show="currentDate === \'line\' && gantt.currentDateManager.position >= 0 && gantt.currentDateManager.position <= gantt.width" ng-style="{\'left\': gantt.currentDateManager.position + \'px\' }"></div>\n' +
        '            </gantt-body-foreground>\n' +
        '            <gantt-body-columns>\n' +
        '                <gantt-column ng-repeat="column in gantt.columnsManager.visibleColumns">\n' +
        '                    <gantt-time-frame ng-repeat="timeFrame in column.visibleTimeFrames"></gantt-time-frame>\n' +
        '                </gantt-column>\n' +
        '            </gantt-body-columns>\n' +
        '            <div ng-if="gantt.columnsManager.visibleColumns == 0" style="background-color: #808080"></div>\n' +
        '            <gantt-body-rows>\n' +
        '                <gantt-timespan ng-repeat="timespan in gantt.timespansManager.timespans track by timespan.model.id"></gantt-timespan>\n' +
        '                <gantt-row ng-repeat="row in gantt.rowsManager.visibleRows track by row.model.id">\n' +
        '                    <gantt-task ng-repeat="task in row.visibleTasks track by task.model.id">\n' +
        '                    </gantt-task>\n' +
        '                </gantt-row>\n' +
        '            </gantt-body-rows>\n' +
        '        </gantt-body>\n' +
        '    </gantt-scrollable>\n' +
        '\n' +
        '    <!-- Plugins -->\n' +
        '    <ng-transclude></ng-transclude>\n' +
        '\n' +
        '    <!--\n' +
        '    ******* Inline templates *******\n' +
        '    You can specify your own templates by either changing the default ones below or by\n' +
        '    adding an attribute template-url="<url to your template>" on the specific element.\n' +
        '    -->\n' +
        '\n' +
        '    <!-- Body template -->\n' +
        '    <script type="text/ng-template" id="template/ganttBody.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-body" ng-style="{\'width\': gantt.width > 0 ? gantt.width +\'px\' : undefined}"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Header template -->\n' +
        '    <script type="text/ng-template" id="template/ganttHeader.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-header"\n' +
        '             ng-show="gantt.columnsManager.columns.length > 0 && gantt.columnsManager.headers.length > 0"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Side template -->\n' +
        '    <script type="text/ng-template" id="template/ganttSide.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-side" style="width: auto;"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Side content template-->\n' +
        '    <script type="text/ng-template" id="template/ganttSideContent.tmpl.html">\n' +
        '        <div class="gantt-side-content">\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Header columns template -->\n' +
        '    <script type="text/ng-template" id="template/ganttHeaderColumns.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-header-columns"\n' +
        '              gantt-horizontal-scroll-receiver></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <script type="text/ng-template" id="template/ganttColumnHeader.tmpl.html">\n' +
        '        <div class="gantt-column-header" ng-class="{\'gantt-column-header-last\': $last, \'gantt-column-header-first\': $first}">{{::column.label}}</div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Body background template -->\n' +
        '    <script type="text/ng-template" id="template/ganttBodyBackground.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-body-background"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Body foreground template -->\n' +
        '    <script type="text/ng-template" id="template/ganttBodyForeground.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-body-foreground"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Body columns template -->\n' +
        '    <script type="text/ng-template" id="template/ganttBodyColumns.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-body-columns"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <script type="text/ng-template" id="template/ganttColumn.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-column gantt-foreground-col" ng-class="{\'gantt-column-last\': $last, \'gantt-column-first\': $first}"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <script type="text/ng-template" id="template/ganttTimeFrame.tmpl.html">\n' +
        '        <div class="gantt-timeframe"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Scrollable template -->\n' +
        '    <script type="text/ng-template" id="template/ganttScrollable.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-scrollable" gantt-scroll-sender ng-style="getScrollableCss()"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <script type="text/ng-template" id="template/ganttScrollableHeader.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-scrollable-header" ng-style="getScrollableHeaderCss()"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Rows template -->\n' +
        '    <script type="text/ng-template" id="template/ganttBodyRows.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-body-rows"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Timespan template -->\n' +
        '    <script type="text/ng-template" id="template/ganttTimespan.tmpl.html">\n' +
        '        <div class="gantt-timespan" ng-class="timespan.model.classes">\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Task template -->\n' +
        '    <script type="text/ng-template" id="template/ganttTask.tmpl.html">\n' +
        '        <div class="gantt-task" ng-class="task.model.classes">\n' +
        '            <gantt-task-background></gantt-task-background>\n' +
        '            <gantt-task-foreground></gantt-task-foreground>\n' +
        '            <gantt-task-content></gantt-task-content>\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <script type="text/ng-template" id="template/ganttTaskBackground.tmpl.html">\n' +
        '        <div class="gantt-task-background" ng-style="{\'background-color\': task.model.color}"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <script type="text/ng-template" id="template/ganttTaskForeground.tmpl.html">\n' +
        '        <div class="gantt-task-foreground">\n' +
        '            <div ng-if="task.truncatedRight" class="gantt-task-truncated-right">&gt;</div>\n' +
        '            <div ng-if="task.truncatedLeft" class="gantt-task-truncated-left">&lt;</div>\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Task content template -->\n' +
        '    <script type="text/ng-template" id="template/ganttTaskContent.tmpl.html">\n' +
        '        <div class="gantt-task-content" unselectable="on"><span unselectable="on" gantt-bind-compile-html="getTaskContent()"/></div>\n' +
        '    </script>\n' +
        '\n' +
        '\n' +
        '    <!-- Row background template -->\n' +
        '    <script type="text/ng-template" id="template/ganttRowBackground.tmpl.html">\n' +
        '        <div class="gantt-row gantt-row-height"\n' +
        '             ng-class="row.model.classes"\n' +
        '             ng-class-odd="\'gantt-row-odd\'"\n' +
        '             ng-class-even="\'gantt-row-even\'"\n' +
        '             ng-style="{\'height\': row.model.height}">\n' +
        '            <div class="gantt-row-background"\n' +
        '                 ng-style="{\'background-color\': row.model.color}">\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Row template -->\n' +
        '    <script type="text/ng-template" id="template/ganttRow.tmpl.html">\n' +
        '        <div class="gantt-row gantt-row-height"\n' +
        '             ng-class="row.model.classes"\n' +
        '             ng-class-odd="\'gantt-row-odd\'"\n' +
        '             ng-class-even="\'gantt-row-even\'"\n' +
        '             ng-style="{\'height\': row.model.height}">\n' +
        '            <div ng-transclude class="gantt-row-content"></div>\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Side background template -->\n' +
        '    <script type="text/ng-template" id="template/ganttSideBackground.tmpl.html">\n' +
        '        <div class="gantt-side-background">\n' +
        '            <div class="gantt-side-background-header" ng-style="{height: $parent.ganttHeaderHeight + \'px\'}">\n' +
        '                <div ng-show="$parent.ganttHeaderHeight" class="gantt-header-row gantt-side-header-row"></div>\n' +
        '            </div>\n' +
        '            <div class="gantt-side-background-body" ng-style="getMaxHeightCss()">\n' +
        '                <div gantt-vertical-scroll-receiver>\n' +
        '                    <div class="gantt-row gantt-row-height "\n' +
        '                         ng-class-odd="\'gantt-row-odd\'"\n' +
        '                         ng-class-even="\'gantt-row-even\'"\n' +
        '                         ng-class="row.model.classes"\n' +
        '                         ng-repeat="row in gantt.rowsManager.visibleRows track by row.model.id"\n' +
        '                         ng-style="{\'height\': row.model.height}">\n' +
        '                        <div gantt-row-label class="gantt-row-label gantt-row-background"\n' +
        '                             ng-style="{\'background-color\': row.model.color}">\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </script>\n' +
        '</div>\n' +
        '');
}]);

//# sourceMappingURL=angular-gantt.js.map
/*
Project: angular-gantt v1.2.13 - Gantt chart component for AngularJS
Authors: Marco Schweighauser, Rémi Alvergnat
License: MIT
Homepage: https://www.angular-gantt.com
Github: https://github.com/angular-gantt/angular-gantt.git
*/
(function(){
    'use strict';
    angular.module('gantt.bounds', ['gantt', 'gantt.bounds.templates']).directive('ganttBounds', ['moment', '$compile', '$document', function(moment, $compile, $document) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.bounds) === 'object') {
                    for (var option in scope.options.bounds) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                    if (directiveName === 'ganttTask') {
                        var boundsScope = taskScope.$new();
                        boundsScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'task.model.est && task.model.lct && pluginScope.enabled');
                        var boundsElement = $document[0].createElement('gantt-task-bounds');
                        if (attrs.templateUrl !== undefined) {
                            angular.element(boundsElement).attr('data-template-url', attrs.templateUrl);
                        }
                        if (attrs.template !== undefined) {
                            angular.element(boundsElement).attr('data-template', attrs.template);
                        }
                        angular.element(ifElement).append(boundsElement);
                        taskElement.append($compile(ifElement)(boundsScope));
                    }
                });

                api.tasks.on.clean(scope, function(model) {
                    if (model.est !== undefined && !moment.isMoment(model.est)) {
                        model.est = moment(model.est);  //Earliest Start Time
                    }
                    if (model.lct !== undefined && !moment.isMoment(model.lct)) {
                        model.lct = moment(model.lct);  //Latest Completion Time
                    }
                });
            }
        };
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt.dependencies', ['gantt', 'gantt.dependencies.templates']).directive('ganttDependencies', ['$timeout', '$document', 'ganttDebounce', 'GanttDependenciesManager', function($timeout, $document, debounce, DependenciesManager) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                readOnly: '=?',
                jsPlumbDefaults: '=?',
                endpoints: '=?',
                fallbackEndpoints: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.dependencies) === 'object') {
                    for (var option in scope.options.dependencies) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.readOnly === undefined) {
                    scope.readOnly = false;
                }

                if (scope.jsPlumbDefaults === undefined) {
                    // https://jsplumbtoolkit.com/community/doc/defaults.html
                    scope.jsPlumbDefaults = {
                        Endpoint: ['Dot', {radius: 4}],
                        EndpointStyle: {fillStyle: '#456', strokeStyle: '#456', lineWidth: 1},
                        Connector: 'Flowchart',
                        ConnectionOverlays: [['Arrow', {location: 1, length: 12, width: 12}]]
                    };
                }

                function createLeftOverlay() {
                    return angular.element('<span><span class="gantt-endpoint-overlay start-endpoint arrow-right"></span></span>');
                }

                function createRightOverlay() {
                    return angular.element('<span><span class="gantt-endpoint-overlay end-endpoint arrow-right"></span></span>');
                }

                function createLeftFallbackOverlay() {
                    return angular.element('<span><span class="gantt-endpoint-overlay start-endpoint fallback-endpoint"></span></span>');
                }

                function createRightFallbackOverlay() {
                    return angular.element('<span><span class="gantt-endpoint-overlay end-endpoint fallback-endpoint"></span></span>');
                }

                if (scope.endpoints === undefined) {
                    scope.endpoints = [
                        {
                            anchor: 'Left',
                            isSource: false,
                            isTarget: true,
                            maxConnections: -1,
                            cssClass: 'gantt-endpoint start-endpoint target-endpoint',
                            overlays: [
                                ['Custom', {create: createLeftOverlay}]
                            ]

                        },
                        {
                            anchor: 'Right',
                            isSource: true,
                            isTarget: false,
                            maxConnections: -1,
                            cssClass: 'gantt-endpoint end-endpoint source-endpoint',
                            overlays: [
                                ['Custom', {create: createRightOverlay}]
                            ]
                        }
                    ];
                }

                if (scope.fallbackEndpoints === undefined) {
                    scope.fallbackEndpoints = [
                        {
                            endpoint: 'Blank',
                            anchor: 'Left',
                            isSource: false,
                            isTarget: true,
                            maxConnections: 0,
                            cssClass: 'gantt-endpoint start-endpoint fallback-endpoint',
                            overlays: [
                                ['Custom', {create: createLeftFallbackOverlay}]
                            ]
                        },
                        {
                            endpoint: 'Blank',
                            anchor: 'Right',
                            isSource: true,
                            isTarget: false,
                            maxConnections: 0,
                            cssClass: 'gantt-endpoint end-endpoint fallback-endpoint',
                            overlays: [
                                ['Custom', {create: createRightFallbackOverlay}]
                            ]
                        }
                    ];
                }

                var manager = new DependenciesManager(ganttCtrl.gantt, scope, api);

                api.directives.on.new(scope, function(directiveName, directiveScope, directiveElement) {
                    if (directiveName === 'ganttBody') {
                        manager.plumb.setContainer(directiveElement);
                    }
                });

                api.tasks.on.add(scope, function(task) {
                    manager.addDependenciesFromTask(task);
                });

                api.tasks.on.remove(scope, function(task) {
                    manager.removeDependenciesFromTask(task);
                });

                api.tasks.on.displayed(scope, debounce(function(tasks) {
                    manager.setTasks(tasks);
                    manager.refresh();
                }));

                api.rows.on.displayed(scope, function() {
                    manager.refresh();
                });

                api.tasks.on.viewChange(scope, function(task) {
                    if (task.$element) {
                        manager.plumb.revalidate(task.$element[0]);
                    }
                });

                api.tasks.on.viewRowChange(scope, function(task) {
                    manager.setTask(task);
                });

            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.drawtask', ['gantt']).directive('ganttDrawTask', ['$document', 'ganttMouseOffset', 'ganttUtils', 'moment', function(document, mouseOffset, utils, moment) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                moveThreshold: '=?',
                taskModelFactory: '=?taskFactory'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.moveThreshold === undefined) {
                    scope.moveThreshold = 0;
                }

                if (scope.taskModelFactory === undefined) {
                    scope.taskModelFactory = function() {
                        return {}; // New empty task.
                    };
                }

                api.directives.on.new(scope, function(directiveName, directiveScope, element) {
                    if (directiveName === 'ganttRow') {
                        var addNewTask = function(x) {
                            var startDate = api.core.getDateByPosition(x, true);
                            var endDate = moment(startDate);

                            var taskModel = scope.taskModelFactory();
                            taskModel.from = startDate;
                            taskModel.to = endDate;

                            var task = directiveScope.row.addTask(taskModel);
                            task.isResizing = true;
                            task.updatePosAndSize();
                            directiveScope.row.updateVisibleTasks();

                            directiveScope.row.$scope.$digest();
                        };

                        var deferDrawing = function(startX) {
                            var moveTrigger = function(evt) {
                                var currentX = mouseOffset.getOffset(evt).x;

                                if (Math.abs(startX - currentX) >= scope.moveThreshold) {
                                    element.off('mousemove', moveTrigger);
                                    addNewTask(startX);
                                }
                            };

                            element.on('mousemove', moveTrigger);
                            document.one('mouseup', function() {
                                element.off('mousemove', moveTrigger);
                            });
                        };

                        var drawHandler = function(evt) {
                            var evtTarget = (evt.target ? evt.target : evt.srcElement);
                            var enabled = angular.isFunction(scope.enabled) ? scope.enabled(evt): scope.enabled;
                            if (enabled && evtTarget.className.indexOf('gantt-row') > -1) {
                                var x = mouseOffset.getOffset(evt).x;

                                if (scope.moveThreshold === 0) {
                                    addNewTask(x, x);
                                } else {
                                    deferDrawing(x);
                                }
                            }
                        };

                        element.on('mousedown', drawHandler);
                        directiveScope.drawTaskHandler = drawHandler;
                    }
                });

                api.directives.on.destroy(scope, function(directiveName, directiveScope, element) {
                    if (directiveName === 'ganttRow') {
                        element.off('mousedown', directiveScope.drawTaskHandler);
                        delete directiveScope.drawTaskHandler;
                    }
                });
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.groups', ['gantt', 'gantt.groups.templates']).directive('ganttGroups', ['ganttUtils', 'GanttHierarchy', '$compile', '$document', function(utils, Hierarchy, $compile, $document) {
        // Provides the row sort functionality to any Gantt row
        // Uses the sortableState to share the current row

        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                display: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.sortable) === 'object') {
                    for (var option in scope.options.sortable) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.display === undefined) {
                    scope.display = 'group';
                }

                scope.hierarchy = new Hierarchy();

                function refresh() {
                    scope.hierarchy.refresh(ganttCtrl.gantt.rowsManager.filteredRows);
                }

                ganttCtrl.gantt.api.registerMethod('groups', 'refresh', refresh, this);
                ganttCtrl.gantt.$scope.$watchCollection('gantt.rowsManager.filteredRows', function() {
                    refresh();
                });

                api.directives.on.new(scope, function(directiveName, rowScope, rowElement) {
                    if (directiveName === 'ganttRow') {
                        var taskGroupScope = rowScope.$new();
                        taskGroupScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');

                        var taskGroupElement = $document[0].createElement('gantt-task-group');
                        if (attrs.templateUrl !== undefined) {
                            angular.element(taskGroupElement).attr('data-template-url', attrs.templateUrl);
                        }
                        if (attrs.template !== undefined) {
                            angular.element(taskGroupElement).attr('data-template', attrs.template);
                        }

                        angular.element(ifElement).append(taskGroupElement);

                        rowElement.append($compile(ifElement)(taskGroupScope));
                    }
                });
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.labels', ['gantt', 'gantt.labels.templates']).directive('ganttLabels', ['ganttUtils', '$compile', '$document', '$log', function(utils, $compile, $document, $log) {
        // Provides the row sort functionality to any Gantt row
        // Uses the sortableState to share the current row

        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                header: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                $log.warn('Angular Gantt Labels plugin is deprecated. Please use Table plugin instead.');

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.sortable) === 'object') {
                    for (var option in scope.options.sortable) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.header === undefined) {
                    scope.header = 'Name';
                }

                api.directives.on.new(scope, function(directiveName, sideContentScope, sideContentElement) {
                    if (directiveName === 'ganttSideContent') {
                        var labelsScope = sideContentScope.$new();
                        labelsScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');
                        angular.element(ifElement).addClass('side-element');

                        var labelsElement = $document[0].createElement('gantt-side-content-labels');
                        angular.element(ifElement).append(labelsElement);

                        sideContentElement.append($compile(ifElement)(labelsScope));
                    }
                });

                function fitSideWidthToLabels() {
                    var labels = ganttCtrl.gantt.side.$element[0].getElementsByClassName('gantt-row-label');
                    var newSideWidth = 0;

                    for (var i=0; i<labels.length; i++) {
                        var width = labels[i].children[0].offsetWidth;
                        newSideWidth = Math.max(newSideWidth, width);
                    }

                    if (newSideWidth >= 0) {
                        api.side.setWidth(newSideWidth);
                    }
                }

                api.registerMethod('labels', 'fitSideWidth', fitSideWidthToLabels, this);
            }
        };
    }]);
}());


(function(){
    'use strict';

    /* jshint latedef: false */
    angular.module('gantt.movable', ['gantt']).directive('ganttMovable', ['ganttMouseButton', 'ganttMouseOffset', 'ganttSmartEvent', 'ganttMovableOptions', 'ganttUtils', 'ganttDom', '$window', '$document', '$timeout',
        function(mouseButton, mouseOffset, smartEvent, movableOptions, utils, dom, $window, $document, $timeout) {
            // Provides moving and resizing of tasks
            return {
                restrict: 'E',
                require: '^gantt',
                scope: {
                    enabled: '=?',
                    allowMoving: '=?',
                    allowResizing: '=?',
                    allowRowSwitching: '=?'
                },
                link: function(scope, element, attrs, ganttCtrl) {
                    var api = ganttCtrl.gantt.api;

                    // Load options from global options attribute.
                    if (scope.options && typeof(scope.options.movable) === 'object') {
                        for (var option in scope.options.movable) {
                            scope[option] = scope.options[option];
                        }
                    }

                    movableOptions.initialize(scope);

                    api.registerEvent('tasks', 'move');
                    api.registerEvent('tasks', 'moveBegin');
                    api.registerEvent('tasks', 'moveEnd');
                    api.registerEvent('tasks', 'resize');
                    api.registerEvent('tasks', 'resizeBegin');
                    api.registerEvent('tasks', 'resizeEnd');
                    api.registerEvent('tasks', 'change');

                    var _hasTouch = ('ontouchstart' in $window) || $window.DocumentTouch && $document[0] instanceof $window.DocumentTouch;
                    var _pressEvents = 'touchstart mousedown';
                    var _moveEvents = 'touchmove mousemove';
                    var _releaseEvents = 'touchend mouseup';

                    var taskWithSmallWidth = 15;
                    var resizeAreaWidthBig = 5;
                    var resizeAreaWidthSmall = 3;
                    var scrollSpeed = 15;
                    var scrollTriggerDistance = 5;
                    var mouseStartOffsetX;
                    var moveStartX;

                    api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                        if (directiveName === 'ganttTask') {
                            var windowElement = angular.element($window);
                            var ganttBodyElement = taskScope.row.rowsManager.gantt.body.$element;
                            var ganttScrollElement = taskScope.row.rowsManager.gantt.scroll.$element;

                            var taskHasBeenChanged = false;
                            var taskHasBeenMovedFromAnotherRow = false;
                            var scrollInterval;

                            var foregroundElement = taskScope.task.getForegroundElement();

                            // IE<11 doesn't support `pointer-events: none`
                            // So task content element must be added to support moving properly.
                            var contentElement = taskScope.task.getContentElement();

                            var onPressEvents = function(evt) {
                                evt.preventDefault();
                                if (_hasTouch) {
                                    evt = mouseOffset.getTouch(evt);
                                }
                                var taskMovable = taskScope.task.model.movable;
                                var rowMovable = taskScope.task.row.model.movable;

                                if (typeof(taskMovable) === 'boolean' || angular.isFunction(taskMovable)) {
                                    taskMovable = {enabled: taskMovable};
                                }

                                if (typeof(rowMovable) === 'boolean' || angular.isFunction(rowMovable)) {
                                    rowMovable = {enabled: rowMovable};
                                }

                                var enabledValue = utils.firstProperty([taskMovable, rowMovable], 'enabled', scope.enabled);
                                var enabled = angular.isFunction(enabledValue) ? enabledValue(evt, taskScope.task): enabledValue;
                                if (enabled) {
                                    var taskOffsetX = mouseOffset.getOffsetForElement(foregroundElement[0], evt).x;
                                    var mode = getMoveMode(taskOffsetX);
                                    if (mode !== '' && mouseButton.getButton(evt) === 1) {
                                        var bodyOffsetX = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt).x;
                                        enableMoveMode(mode, bodyOffsetX);
                                    }
                                    taskScope.$digest();
                                }
                            };
                            foregroundElement.on(_pressEvents, onPressEvents);
                            contentElement.on(_pressEvents, onPressEvents);

                            var onMousemove = function (evt) {
                                var taskMovable = taskScope.task.model.movable;
                                var rowMovable = taskScope.task.row.model.movable;

                                if (typeof(taskMovable) === 'boolean' || angular.isFunction(taskMovable)) {
                                    taskMovable = {enabled: taskMovable};
                                }

                                if (typeof(rowMovable) === 'boolean' || angular.isFunction(rowMovable)) {
                                    rowMovable = {enabled: rowMovable};
                                }

                                var enabledValue = utils.firstProperty([taskMovable, rowMovable], 'enabled', scope.enabled);
                                var enabled = angular.isFunction(enabledValue) ? enabledValue(evt, taskScope.task): enabledValue;
                                if (enabled && !taskScope.task.isMoving) {
                                    var taskOffsetX = mouseOffset.getOffsetForElement(foregroundElement[0], evt).x;
                                    var mode = getMoveMode(taskOffsetX);
                                    if (mode !== '' && mode !== 'M') {
                                        foregroundElement.css('cursor', getCursor(mode));
                                        contentElement.css('cursor', getCursor(mode));
                                    } else {
                                        foregroundElement.css('cursor', '');
                                        contentElement.css('cursor', '');
                                    }
                                }
                            };
                            foregroundElement.on('mousemove', onMousemove);
                            contentElement.on('mousemove', onMousemove);

                            var handleMove = function(evt) {
                                if (taskScope.task.isMoving && !taskScope.destroyed) {
                                    clearScrollInterval();
                                    moveTask(evt);
                                    scrollScreen(evt);
                                }
                            };

                            var moveTask = function(evt) {
                                var oldTaskHasBeenChanged = taskHasBeenChanged;

                                var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt);
                                var x = mousePos.x;
                                taskScope.task.mouseOffsetX = x;
                                var taskOutOfRange = taskScope.task.row.rowsManager.gantt.options.value('taskOutOfRange');

                                var taskMovable = taskScope.task.model.movable;
                                var rowMovable = taskScope.task.row.model.movable;

                                if (typeof(taskMovable) === 'boolean' || angular.isFunction(taskMovable)) {
                                    taskMovable = {enabled: taskMovable};
                                }

                                if (typeof(rowMovable) === 'boolean' || angular.isFunction(rowMovable)) {
                                    rowMovable = {enabled: rowMovable};
                                }

                                if (taskScope.task.moveMode === 'M') {
                                    var allowRowSwitching = utils.firstProperty([taskMovable, rowMovable], 'allowRowSwitching', scope.allowRowSwitching);
                                    if (allowRowSwitching) {
                                        var scrollRect = ganttScrollElement[0].getBoundingClientRect();
                                        var rowCenterLeft = scrollRect.left + scrollRect.width / 2;
                                        var ganttBody = angular.element($document[0].querySelectorAll('.gantt-body'));
                                        ganttBody.css('pointer-events', 'auto'); // pointer-events must be enabled for following to work.
                                        var targetRowElement = dom.findElementFromPoint(rowCenterLeft, evt.clientY, function(element) {
                                            return angular.element(element).hasClass('gantt-row');
                                        });
                                        ganttBody.css('pointer-events', '');

                                        var rows = ganttCtrl.gantt.rowsManager.rows;
                                        var targetRow;
                                        for (var i= 0, l=rows.length; i<l; i++) {
                                            if (targetRowElement === rows[i].$element[0]) {
                                                targetRow = rows[i];
                                                break;
                                            }
                                        }

                                        var sourceRow = taskScope.task.row;

                                        if (targetRow !== undefined && sourceRow !== targetRow) {
                                            targetRow.moveTaskToRow(taskScope.task, true);
                                            taskHasBeenChanged = true;
                                        }
                                    }

                                    var allowMoving = utils.firstProperty([taskMovable, rowMovable], 'allowMoving', scope.allowMoving);
                                    if (allowMoving) {
                                        x = x - mouseStartOffsetX;

                                        if (taskOutOfRange !== 'truncate') {
                                            if (x < 0) {
                                                x = 0;
                                            } else if (x + taskScope.task.width >= taskScope.gantt.width) {
                                                x = taskScope.gantt.width - taskScope.task.width;
                                            }
                                        }

                                        taskScope.task.moveTo(x, true);
                                        taskScope.$digest();

                                        if (taskHasBeenChanged) {
                                            taskScope.row.rowsManager.gantt.api.tasks.raise.move(taskScope.task);
                                        }
                                        taskHasBeenChanged = true;
                                    }
                                } else if (taskScope.task.moveMode === 'E') {
                                    if (x <= taskScope.task.left) {
                                        x = taskScope.task.left;
                                        taskScope.task.moveMode = 'W';
                                        setGlobalCursor(getCursor(taskScope.task.moveMode ));
                                    }

                                    if (taskOutOfRange !== 'truncate' && x >= taskScope.gantt.width) {
                                        x = taskScope.gantt.width;
                                    }

                                    taskScope.task.setTo(x, true);
                                    taskScope.$digest();

                                    if (taskHasBeenChanged) {
                                        taskScope.row.rowsManager.gantt.api.tasks.raise.resize(taskScope.task);
                                    }
                                    taskHasBeenChanged = true;
                                } else {
                                    if (x > taskScope.task.left + taskScope.task.width) {
                                        x = taskScope.task.left + taskScope.task.width;
                                        taskScope.task.moveMode = 'E';
                                        setGlobalCursor(getCursor(taskScope.task.moveMode ));
                                    }

                                    if (taskOutOfRange !== 'truncate' && x < 0) {
                                        x = 0;
                                    }

                                    taskScope.task.setFrom(x, true);
                                    taskScope.$digest();

                                    if (taskHasBeenChanged) {
                                        taskScope.row.rowsManager.gantt.api.tasks.raise.resize(taskScope.task);
                                    }
                                    taskHasBeenChanged = true;
                                }

                                if (!oldTaskHasBeenChanged && taskHasBeenChanged && !taskHasBeenMovedFromAnotherRow) {
                                    var backgroundElement = taskScope.task.getBackgroundElement();
                                    if (taskScope.task.moveMode === 'M') {
                                        backgroundElement.addClass('gantt-task-moving');
                                        taskScope.row.rowsManager.gantt.api.tasks.raise.moveBegin(taskScope.task);
                                    } else {
                                        backgroundElement.addClass('gantt-task-resizing');
                                        taskScope.row.rowsManager.gantt.api.tasks.raise.resizeBegin(taskScope.task);
                                    }
                                }
                            };

                            var scrollScreen = function(evt) {
                                var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt);
                                var leftScreenBorder = ganttScrollElement[0].scrollLeft;
                                var screenWidth = ganttScrollElement[0].offsetWidth;
                                var scrollWidth = ganttScrollElement[0].scrollWidth;
                                var rightScreenBorder = leftScreenBorder + screenWidth;
                                var keepOnScrolling = false;

                                if (mousePos.x < moveStartX) {
                                    // Scroll to the left
                                    if (leftScreenBorder > 0 && mousePos.x <= leftScreenBorder + scrollTriggerDistance) {
                                        mousePos.x -= scrollSpeed;
                                        keepOnScrolling = true;
                                        taskScope.row.rowsManager.gantt.api.scroll.left(scrollSpeed);
                                    }
                                } else {
                                    // Scroll to the right
                                    if (rightScreenBorder < scrollWidth && mousePos.x >= rightScreenBorder - scrollTriggerDistance) {
                                        mousePos.x += scrollSpeed;
                                        keepOnScrolling = true;
                                        taskScope.row.rowsManager.gantt.api.scroll.right(scrollSpeed);
                                    }
                                }

                                if (keepOnScrolling) {
                                    scrollInterval = $timeout(function() {
                                        handleMove(evt);
                                    }, 100, true);
                                }
                            };

                            var clearScrollInterval = function() {
                                if (scrollInterval !== undefined) {
                                    $timeout.cancel(scrollInterval);
                                    scrollInterval = undefined;
                                }
                            };

                            var getMoveMode = function(x) {
                                var distance = 0;


                                var taskMovable = taskScope.task.model.movable;
                                var rowMovable = taskScope.task.row.model.movable;

                                if (typeof(taskMovable) === 'boolean') {
                                    taskMovable = {enabled: taskMovable};
                                }

                                if (typeof(rowMovable) === 'boolean') {
                                    rowMovable = {enabled: rowMovable};
                                }

                                var allowResizing = utils.firstProperty([taskMovable, rowMovable], 'allowResizing', scope.allowResizing);
                                var allowRowSwitching = utils.firstProperty([taskMovable, rowMovable], 'allowRowSwitching', scope.allowRowSwitching);
                                var allowMoving = utils.firstProperty([taskMovable, rowMovable], 'allowMoving', scope.allowMoving);

                                // Define resize&move area. Make sure the move area does not get too small.
                                if (allowResizing) {
                                    distance = foregroundElement[0].offsetWidth < taskWithSmallWidth ? resizeAreaWidthSmall : resizeAreaWidthBig;
                                }

                                if (allowResizing && x > foregroundElement[0].offsetWidth - distance) {
                                    return 'E';
                                } else if (allowResizing && x < distance) {
                                    return 'W';
                                } else if ((allowMoving || allowRowSwitching) && x >= distance && x <= foregroundElement[0].offsetWidth - distance) {
                                    return 'M';
                                } else {
                                    return '';
                                }
                            };

                            var getCursor = function(mode) {
                                switch (mode) {
                                    case 'E':
                                        return 'e-resize';
                                    case 'W':
                                        return 'w-resize';
                                    case 'M':
                                        return 'move';
                                }
                            };

                            var setGlobalCursor = function(cursor) {
                                taskElement.css('cursor', cursor);
                                angular.element($document[0].body).css({
                                 '-moz-user-select': cursor === '' ? '': '-moz-none',
                                 '-webkit-user-select': cursor === '' ? '': 'none',
                                 '-ms-user-select': cursor === '' ? '': 'none',
                                 'user-select': cursor === '' ? '': 'none',
                                 'cursor': cursor
                                 });
                            };

                            var enableMoveMode = function(mode, x) {
                                // Clone taskModel
                                if (taskScope.task.originalModel === undefined) {
                                    taskScope.task.originalRow = taskScope.task.row;
                                    taskScope.task.originalModel = taskScope.task.model;
                                    taskScope.task.model = angular.copy(taskScope.task.originalModel);
                                }

                                // Init mouse start variables
                                if (!taskHasBeenMovedFromAnotherRow) {
                                    moveStartX = x;
                                    mouseStartOffsetX = x - taskScope.task.modelLeft;
                                }

                                // Init task move
                                taskHasBeenChanged = false;
                                taskScope.task.moveMode = mode;
                                taskScope.task.isMoving = true;
                                taskScope.task.active = true;

                                // Add move event handler
                                var taskMoveHandler = function(evt) {
                                    evt.stopImmediatePropagation();
                                    if (_hasTouch) {
                                        evt = mouseOffset.getTouch(evt);
                                    }

                                    handleMove(evt);
                                };
                                var moveSmartEvent = smartEvent(taskScope, windowElement, _moveEvents, taskMoveHandler);
                                moveSmartEvent.bind();

                                // Remove move event handler on mouse up / touch end
                                smartEvent(taskScope, windowElement, _releaseEvents, function(evt) {
                                    if (_hasTouch) {
                                        evt = mouseOffset.getTouch(evt);
                                    }
                                    moveSmartEvent.unbind();
                                    disableMoveMode(evt);
                                    taskScope.$digest();
                                }).bindOnce();

                                setGlobalCursor(getCursor(mode));
                            };

                            var disableMoveMode = function() {
                                var getBackgroundElement = taskScope.task.getBackgroundElement();
                                getBackgroundElement.removeClass('gantt-task-moving');
                                getBackgroundElement.removeClass('gantt-task-resizing');

                                if (taskScope.task.originalModel !== undefined) {

                                    taskScope.task.originalModel.from = taskScope.task.model.from;
                                    taskScope.task.originalModel.to = taskScope.task.model.to;
                                    taskScope.task.originalModel.lct = taskScope.task.model.lct;
                                    taskScope.task.originalModel.est = taskScope.task.model.est;

                                    taskScope.task.model = taskScope.task.originalModel;
                                    if (taskScope.task.row.model.id !== taskScope.task.originalRow.model.id) {
                                        var targetRow = taskScope.task.row;
                                        targetRow.removeTask(taskScope.task.model.id, false, true);
                                        taskScope.task.row = taskScope.task.originalRow;
                                        targetRow.moveTaskToRow(taskScope.task, false);
                                    }
                                    delete taskScope.task.originalModel;
                                    delete taskScope.task.originalRow;

                                    taskScope.$apply();
                                }

                                taskHasBeenMovedFromAnotherRow = false;
                                taskScope.task.isMoving = false;
                                taskScope.task.active = false;

                                // Stop any active auto scroll
                                clearScrollInterval();

                                // Set mouse cursor back to default
                                setGlobalCursor('');

                                // Raise task changed event
                                if (taskHasBeenChanged === true) {
                                    // Raise move end event
                                    if (taskScope.task.moveMode === 'M') {
                                        taskScope.row.rowsManager.gantt.api.tasks.raise.moveEnd(taskScope.task);
                                    } else {
                                        taskScope.row.rowsManager.gantt.api.tasks.raise.resizeEnd(taskScope.task);
                                    }

                                    taskHasBeenChanged = false;
                                    taskScope.task.row.sortTasks(); // Sort tasks so they have the right z-order
                                    taskScope.row.rowsManager.gantt.api.tasks.raise.change(taskScope.task);
                                }

                                taskScope.task.moveMode = undefined;
                            };

                            // Stop scroll cycle (if running) when scope is destroyed.
                            // This is needed when the task is moved to a new row during scroll because
                            // the old scope will continue to scroll otherwise
                            taskScope.$on('$destroy', function() {
                                taskScope.destroyed = true;
                                clearScrollInterval();
                            });

                            if (taskScope.task.isResizing) {
                                taskHasBeenMovedFromAnotherRow = true;
                                enableMoveMode('E', taskScope.task.mouseOffsetX);
                                delete taskScope.task.isResizing;
                            } else if (taskScope.task.isMoving) {
                                // In case the task has been moved to another row a new controller is is created by angular.
                                // Enable the move mode again if this was the case.
                                taskHasBeenMovedFromAnotherRow = true;
                                enableMoveMode('M', taskScope.task.mouseOffsetX);
                            }
                        }
                    });
                }
            };
        }]);
}());


(function() {
    'use strict';
    angular.module('gantt.overlap', ['gantt', 'gantt.overlap.templates']).directive('ganttOverlap', ['moment', function(moment) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                global: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.global === undefined) {
                    scope.global = false;
                }

                function getStartEnd(task) {
                    var start, end;

                    if (task.model.from.isBefore(task.model.to)) {
                        start = task.model.from;
                        end = task.model.to;
                    } else {
                        start = task.model.to;
                        end = task.model.from;
                    }

                    return [start, end];
                }

                function getRange(task) {
                    var startEnd = getStartEnd(task);
                    return moment().range(startEnd[0], startEnd[1]);
                }

                function handleTaskOverlap(overlapsList, task) {
                    if (!(task.model.id in overlapsList)) {
                        task.$element.addClass('gantt-task-overlaps');
                        overlapsList[task.model.id] = task;
                    }
                }

                function handleTaskNonOverlaps(overlapsList, allTasks) {
                    for (var i = 0, l = allTasks.length; i < l; i++) {
                        var task = allTasks[i];
                        if (!(task.model.id in overlapsList)) {
                            task.$element.removeClass('gantt-task-overlaps');
                        }
                    }
                }

                function handleOverlaps(tasks) {
                    // Assume that tasks are ordered with from date.
                    var newOverlapsTasks = {};

                    if (tasks.length > 1) {
                        var previousTask = tasks[0];
                        var previousRange = getRange(previousTask);

                        for (var i = 1, l = tasks.length; i < l; i++) {
                            var task = tasks[i];
                            var range = getRange(task);

                            if (range.overlaps(previousRange)) {
                                handleTaskOverlap(newOverlapsTasks, task);
                                handleTaskOverlap(newOverlapsTasks, previousTask);
                            }

                            if (previousTask.left + previousTask.width < task.left + task.width) {
                                previousTask = task;
                                previousRange = range;
                            }
                        }
                    }

                    handleTaskNonOverlaps(newOverlapsTasks, tasks);
                }

                function sortOn(array, supplier) {
                    return array.sort(function(a, b) {
                        if (supplier(a) < supplier(b)) {
                            return -1;
                        } else if (supplier(a) > supplier(b)) {
                            return 1;
                        }
                        return 0;
                    });
                }

                if (scope.enabled) {
                    api.core.on.rendered(scope, function(api) {
                        var rows = ganttCtrl.gantt.rowsManager.rows;
                        var i;
                        if (scope.global) {
                            var globalTasks = [];
                            for (i = 0; i < rows.length; i++) {
                                globalTasks.push.apply(globalTasks, rows[i].tasks);
                            }
                            globalTasks = sortOn(globalTasks, function(task) {
                                return task.model.from;
                            });
                            handleOverlaps(globalTasks);
                        } else {
                            rows = api.gantt.rowsManager.rows;
                            for (i = 0; i < rows.length; i++) {
                                handleOverlaps(rows[i].tasks);
                            }
                        }
                    });

                    api.tasks.on.change(scope, function(task) {
                        if (scope.global) {
                            var rows = task.row.rowsManager.rows;
                            var globalTasks = [];
                            for (var i = 0; i < rows.length; i++) {
                                globalTasks.push.apply(globalTasks, rows[i].tasks);
                            }
                            globalTasks = sortOn(globalTasks, function(task) {
                                return task.model.from;
                            });
                            handleOverlaps(globalTasks);
                        } else {
                            handleOverlaps(task.row.tasks);
                        }
                    });

                    api.tasks.on.rowChange(scope, function(task, oldRow) {
                        if (scope.global) {
                            var rows = oldRow.rowsManager.rows;
                            var globalTasks = [];
                            for (var i = 0; i < rows.length; i++) {
                                globalTasks.push.apply(globalTasks, rows[i].tasks);
                            }
                            globalTasks = sortOn(globalTasks, function(task) {
                                return task.model.from;
                            });
                            handleOverlaps(globalTasks);
                        } else {
                            handleOverlaps(oldRow.tasks);
                        }
                    });
                }

            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.progress', ['gantt', 'gantt.progress.templates']).directive('ganttProgress', ['moment', '$compile', '$document', function(moment, $compile, $document) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.progress) === 'object') {
                    for (var option in scope.options.progress) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                    if (directiveName === 'ganttTaskBackground') {
                        var progressScope = taskScope.$new();
                        progressScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'task.model.progress !== undefined && pluginScope.enabled');

                        var progressElement = $document[0].createElement('gantt-task-progress');
                        if (attrs.templateUrl !== undefined) {
                            angular.element(progressElement).attr('data-template-url', attrs.templateUrl);
                        }
                        if (attrs.template !== undefined) {
                            angular.element(progressElement).attr('data-template', attrs.template);
                        }
                        angular.element(ifElement).append(progressElement);
                        taskElement.append($compile(ifElement)(progressScope));
                    }
                });

                api.tasks.on.clean(scope, function(model) {
                    if (model.est !== undefined && !moment.isMoment(model.est)) {
                        model.est = moment(model.est); //Earliest Start Time
                    }

                    if (model.lct !== undefined && !moment.isMoment(model.lct)) {
                        model.lct = moment(model.lct); //Latest Completion Time
                    }
                });
            }
        };
    }]);
}());


(function(){
    /* global ResizeSensor: false */
    /* global ElementQueries: false */
    'use strict';
    angular.module('gantt.resizeSensor', ['gantt']).directive('ganttResizeSensor', [function() {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.progress) === 'object') {
                    for (var option in scope.options.progress) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                function buildSensor() {
                    var ganttElement = element.parent().parent().parent()[0].querySelectorAll('div.gantt')[0];
                    return new ResizeSensor(ganttElement, function() {
                        ganttCtrl.gantt.$scope.ganttElementWidth = ganttElement.clientWidth;
                        ganttCtrl.gantt.$scope.$apply();
                    });
                }

                var rendered = false;
                var sensor;

                api.core.on.rendered(scope, function() {
                    rendered = true;
                    if (sensor !== undefined) {
                        sensor.detach();
                    }
                    if (scope.enabled) {
                        ElementQueries.update();
                        sensor = buildSensor();
                    }
                });

                scope.$watch('enabled', function(newValue) {
                    if (rendered) {
                        if (newValue && sensor === undefined) {
                            ElementQueries.update();
                            sensor = buildSensor();
                        } else if (!newValue && sensor !== undefined) {
                            sensor.detach();
                            sensor = undefined;
                        }
                    }
                });
            }
        };
    }]);
}());


(function(){
    'use strict';

    var moduleName = 'gantt.sortable';
    var directiveName = 'ganttSortable';
    var pluginDependencies = [
        'gantt',
        {module:'ang-drag-drop', url:'https://github.com/ganarajpr/angular-dragdrop.git#master'}
    ];

    var failedDependencies = [];
    var loadedDependencies = [];
    var failedDependency;

    for (var i = 0, l = pluginDependencies.length; i < l; i++) {
        var currentDependency = pluginDependencies[i];
        try {
            if (angular.isString(currentDependency)) {
                currentDependency = {module: currentDependency};
                pluginDependencies[i] = currentDependency;
            }
            angular.module(currentDependency.module);
            loadedDependencies.push(currentDependency.module);
        } catch (e) {
            currentDependency.exception = e;
            failedDependencies.push(currentDependency);
        }
    }

    if (failedDependencies.length > 0) {
        angular.module(moduleName, []).directive(directiveName, ['$log', function($log) {
            return {
                restrict: 'E',
                require: '^gantt',
                scope: {
                    enabled: '=?'
                },
                link: function() {
                    $log.warn(moduleName + ' module can\'t require some dependencies:');
                    for (var i= 0,l =failedDependencies.length; i<l; i++) {
                        failedDependency = failedDependencies[i];

                        var errorMessage = failedDependency.module;
                        if (failedDependency.url) {
                            errorMessage += ' (' + failedDependency.url + ')';
                        }
                        if (failedDependency.exception && failedDependency.exception.message) {
                            errorMessage += ': ' + failedDependency.exception.message;
                        }

                        $log.warn(errorMessage);
                    }
                    $log.warn(directiveName + ' plugin directive won\'t be available');
                }
            };
        }]);
    } else {
        angular.module(moduleName, loadedDependencies).directive(directiveName, ['ganttUtils', '$compile', function(utils, $compile) {
            // Provides the row sort functionality to any Gantt row
            // Uses the sortableState to share the current row

            return {
                restrict: 'E',
                require: '^gantt',
                scope: {
                    enabled: '=?'
                },
                link: function(scope, element, attrs, ganttCtrl) {
                    var api = ganttCtrl.gantt.api;

                    // Load options from global options attribute.
                    if (scope.options && typeof(scope.options.sortable) === 'object') {
                        for (var option in scope.options.sortable) {
                            scope[option] = scope.options[option];
                        }
                    }

                    if (scope.enabled === undefined) {
                        scope.enabled = true;
                    }

                    api.directives.on.new(scope, function(directiveName, rowScope, rowElement) {
                        if (directiveName === 'ganttRowLabel' && rowElement.attr('drag') === undefined) {
                            rowScope.checkDraggable = function() {
                                var rowSortable = rowScope.row.model.sortable;

                                if (typeof(rowSortable) === 'boolean') {
                                    rowSortable = {enabled: rowSortable};
                                }

                                return utils.firstProperty([rowSortable], 'enabled', scope.enabled);
                            };

                            rowScope.onDropSuccess = function() {
                                rowScope.$evalAsync();
                            };

                            rowScope.onDrop = function(evt, data) {
                                var row = rowScope.row.rowsManager.rowsMap[data.id];
                                if (row !== rowScope) {
                                    rowScope.row.rowsManager.moveRow(row, rowScope.row);
                                    rowScope.$evalAsync();
                                }
                            };

                            rowElement.attr('ui-draggable', '{{checkDraggable()}}');
                            rowElement.attr('drag-channel', '\'sortable\'');
                            rowElement.attr('ui-on-drop', 'onDrop($event, $data)');
                            rowElement.attr('on-drop-success', 'onDropSuccess()');

                            rowElement.attr('drop-channel', '\'sortable\'');
                            rowElement.attr('drag', 'row.model');

                            $compile(rowElement)(rowScope);
                        }
                    });

                }
            };
        }]);
    }

}());


(function(){
    'use strict';
    angular.module('gantt.table', ['gantt', 'gantt.table.templates']).directive('ganttTable', ['ganttUtils', '$compile', '$document', function(utils, $compile, $document) {
        // Provides the row sort functionality to any Gantt row
        // Uses the sortableState to share the current row

        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                columns: '=?',
                headers: '=?',
                classes: '=?',
                contents: '=?',
                headerContents: '=?',
                formatters: '=?',
                headerFormatter: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.sortable) === 'object') {
                    for (var option in scope.options.sortable) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.columns === undefined) {
                    scope.columns = ['model.name'];
                }

                if (scope.headers === undefined) {
                    scope.headers = {'model.name': 'Name'};
                }

                if (scope.contents === undefined) {
                    scope.contents = {};
                }

                if (scope.headerContents === undefined) {
                    scope.headerContents = {};
                }

                if (scope.classes === undefined) {
                    scope.classes = {};
                }

                if (scope.formatters === undefined) {
                    scope.formatters = {};
                }

                api.directives.on.new(scope, function(directiveName, sideContentScope, sideContentElement) {
                    if (directiveName === 'ganttSideContent') {
                        var tableScope = sideContentScope.$new();
                        tableScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');
                        angular.element(ifElement).addClass('side-element');

                        var tableElement = $document[0].createElement('gantt-side-content-table');
                        angular.element(ifElement).append(tableElement);

                        sideContentElement.append($compile(ifElement)(tableScope));
                    }
                });

            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.tooltips', ['gantt', 'gantt.tooltips.templates']).directive('ganttTooltips', ['$compile', '$document', function($compile, $document) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                dateFormat: '=?',
                content: '=?',
                delay: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.tooltips) === 'object') {
                    for (var option in scope.options.tooltips) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }
                if (scope.dateFormat === undefined) {
                    scope.dateFormat = 'MMM DD, HH:mm';
                }
                if (scope.delay === undefined) {
                    scope.delay = 500;
                }
                if (scope.content === undefined) {
                    scope.content = '{{task.model.name}}</br>'+
                                    '<small>'+
                                    '{{task.isMilestone() === true && getFromLabel() || getFromLabel() + \' - \' + getToLabel()}}'+
                                    '</small>';
                }

                scope.api = api;

                api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                    if (directiveName === 'ganttTask') {
                        var tooltipScope = taskScope.$new();

                        tooltipScope.pluginScope = scope;
                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');

                        var tooltipElement = $document[0].createElement('gantt-tooltip');
                        if (attrs.templateUrl !== undefined) {
                            angular.element(tooltipElement).attr('data-template-url', attrs.templateUrl);
                        }
                        if (attrs.template !== undefined) {
                            angular.element(tooltipElement).attr('data-template', attrs.template);
                        }

                        angular.element(ifElement).append(tooltipElement);
                        taskElement.append($compile(ifElement)(tooltipScope));
                    }
                });
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.tree', ['gantt', 'gantt.tree.templates', 'ui.tree']).directive('ganttTree', ['ganttUtils', '$compile', '$document', function(utils, $compile, $document) {
        // Provides the row sort functionality to any Gantt row
        // Uses the sortableState to share the current row

        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                header: '=?',
                content: '=?',
                headerContent: '=?',
                keepAncestorOnFilterRow: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.sortable) === 'object') {
                    for (var option in scope.options.sortable) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.header === undefined) {
                    scope.header = 'Name';
                }

                if (scope.headerContent === undefined) {
                    scope.headerContent = '{{getHeader()}}';
                }

                if (scope.keepAncestorOnFilterRow === undefined) {
                    scope.keepAncestorOnFilterRow = false;
                }

                api.directives.on.new(scope, function(directiveName, sideContentScope, sideContentElement) {
                    if (directiveName === 'ganttSideContent') {
                        var labelsScope = sideContentScope.$new();
                        labelsScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');
                        angular.element(ifElement).addClass('side-element');

                        var labelsElement = $document[0].createElement('gantt-side-content-tree');
                        angular.element(ifElement).append(labelsElement);

                        sideContentElement.append($compile(ifElement)(labelsScope));
                    }
                });
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.bounds').directive('ganttTaskBounds', ['$templateCache', 'moment', function($templateCache, moment) {
        // Displays a box representing the earliest allowable start time and latest completion time for a job

        return {
            restrict: 'E',
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
                if (tAttrs.templateUrl === undefined) {
                    templateUrl = 'plugins/bounds/taskBounds.tmpl.html';
                } else {
                    templateUrl = tAttrs.templateUrl;
                }
                if (tAttrs.template) {
                    $templateCache.put(templateUrl, tAttrs.template);
                }
                return templateUrl;
            },
            replace: true,
            scope: true,
            controller: ['$scope', '$element', function($scope, $element) {
                $element.toggleClass('ng-hide', true);

                $scope.simplifyMoment = function(d) {
                    return moment.isMoment(d) ? d.unix() : d;
                };

                $scope.$watchGroup(['simplifyMoment(task.model.est)', 'simplifyMoment(task.model.lct)', 'task.left', 'task.width'], function() {
                    var left = $scope.task.rowsManager.gantt.getPositionByDate($scope.task.model.est);
                    var right = $scope.task.rowsManager.gantt.getPositionByDate($scope.task.model.lct);

                    $element.css('left', left - $scope.task.left + 'px');
                    $element.css('width', right - left + 'px');

                    $element.toggleClass('gantt-task-bounds-in', false);
                    $element.toggleClass('gantt-task-bounds-out', false);
                    if ($scope.task.model.est === undefined || $scope.task.model.lct === undefined) {
                        $element.toggleClass('gantt-task-bounds-in', true);
                    } else if ($scope.task.model.est > $scope.task.model.from) {
                        $element.toggleClass('gantt-task-bounds-out', true);
                    }
                    else if ($scope.task.model.lct < $scope.task.model.to) {
                        $element.toggleClass('gantt-task-bounds-out', true);
                    } else {
                        $element.toggleClass('gantt-task-bounds-in', true);
                    }
                });

                $scope.task.$element.bind('mouseenter', function() {
                    $element.toggleClass('ng-hide', false);
                });

                $scope.task.$element.bind('mouseleave', function() {
                    $element.toggleClass('ng-hide', true);
                });

                $scope.task.rowsManager.gantt.api.directives.raise.new('ganttBounds', $scope, $element);
                $scope.$on('$destroy', function() {
                    $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttBounds', $scope, $element);
                });
            }]
        };
    }]);
}());


(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependenciesEvents', [function() {
        /**
         * Creates a new DependenciesEvents object.
         *
         * @param manager DependenciesManager object
         * @constructor
         */
        var DependenciesEvents = function(manager) {
            var self = this;

            this.manager = manager;

            // Deny the start of a drag when in readonly
            var denyDragWhenReadOnly = function () {
                return !self.manager.pluginScope.readOnly;
            };

            this.manager.plumb.bind('beforeDrag', denyDragWhenReadOnly);
            this.manager.plumb.bind('beforeStartDetach', denyDragWhenReadOnly);

            // Deny drop on the same task.
            var denyDropOnSameTask = function(params) {
                return params.sourceId !== params.targetId;
            };

            this.manager.plumb.bind('beforeDrop', denyDropOnSameTask);


            // Notify the manager that a connection is being created.
            this.manager.plumb.bind('connectionDrag', function(connection) {
                self.manager.setDraggingConnection(connection);
            });

            this.manager.plumb.bind('connectionDragStop', function() {
                self.manager.setDraggingConnection(undefined);
            });

            this.manager.plumb.bind('beforeDrop', function() {
                self.manager.setDraggingConnection(undefined);
                return true;
            });

            var createConnection = function(info, mouseEvent) {
                if (mouseEvent) {
                    var oldDependency;
                    if (info.connection.$dependency) {
                        oldDependency = info.connection.$dependency;
                    }

                    var sourceEndpoint = info.sourceEndpoint;
                    var targetEndpoint = info.targetEndpoint;

                    var sourceModel = sourceEndpoint.$task.model;

                    var dependenciesModel = sourceModel.dependencies;
                    if (dependenciesModel === undefined) {
                        dependenciesModel = [];
                        sourceModel.dependencies = dependenciesModel;
                    }

                    var connectionModel = {to: targetEndpoint.$task.model.id};
                    dependenciesModel.push(connectionModel);

                    if (oldDependency) {
                        oldDependency.removeFromTaskModel();
                        self.manager.removeDependency(oldDependency, true); // Connection will be disconnected later by jsPlumb.
                    }

                    var dependency = self.manager.addDependency(sourceEndpoint.$task, connectionModel);
                    info.connection.$dependency = dependency;
                    dependency.connection = info.connection;

                    self.manager.api.dependencies.raise.add(dependency);

                }
            };

            var updateConnection = function(info, mouseEvent) {
                if (mouseEvent) {
                    var oldDependency;
                    if (info.connection.$dependency) {
                        oldDependency = info.connection.$dependency;
                    }

                    var sourceEndpoint = info.newSourceEndpoint;
                    var targetEndpoint = info.newTargetEndpoint;

                    var sourceModel = sourceEndpoint.$task.model;

                    var dependenciesModel = sourceModel.dependencies;
                    if (dependenciesModel === undefined) {
                        dependenciesModel = [];
                        sourceModel.dependencies = dependenciesModel;
                    }

                    var connectionModel = {to: targetEndpoint.$task.model.id};
                    dependenciesModel.push(connectionModel);

                    if (oldDependency) {
                        oldDependency.removeFromTaskModel();
                        self.manager.removeDependency(oldDependency, true); // Connection will be disconnected later by jsPlumb.
                    }

                    var dependency = self.manager.addDependency(sourceEndpoint.$task, connectionModel);
                    info.connection.$dependency = dependency;
                    dependency.connection = info.connection;

                    self.manager.api.dependencies.raise.change(dependency, oldDependency);
                }
            };

            var deleteConnection = function(info, mouseEvent) {
                if (mouseEvent) {
                    var dependency = info.connection.$dependency;

                    dependency.removeFromTaskModel();
                    self.manager.removeDependency(dependency, true); // Connection will be disconnected later by jsPlumb.
                    self.manager.api.dependencies.raise.remove(dependency);
                }
            };

            this.manager.plumb.bind('connectionMoved', updateConnection);
            this.manager.plumb.bind('connection', createConnection);
            this.manager.plumb.bind('connectionDetached', deleteConnection);

        };
        return DependenciesEvents;
    }]);
}());

/* globals jsPlumb */
(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependenciesManager', ['GanttDependency', 'GanttDependenciesEvents', 'GanttDependencyTaskMouseHandler', function(Dependency, DependenciesEvents, TaskMouseHandler) {
        var DependenciesManager = function(gantt, pluginScope, api) {
            var self = this;

            this.gantt = gantt;
            this.pluginScope = pluginScope;
            this.api = api;

            this.api.registerEvent('dependencies', 'add');
            this.api.registerEvent('dependencies', 'change');
            this.api.registerEvent('dependencies', 'remove');

            this.plumb = jsPlumb.getInstance();
            this.plumb.importDefaults(this.pluginScope.jsPlumbDefaults);

            this.dependenciesFrom = {};
            this.dependenciesTo = {};

            this.tasksList = [];
            this.tasks = {};

            this.events = new DependenciesEvents(this);

            this.pluginScope.$watch('enabled', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.refresh();
                }
            });

            this.pluginScope.$watch('readOnly', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.setTasks(self.tasksList);
                    self.refresh();
                }
            });

            this.pluginScope.$watch('jsPlumbDefaults', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.plumb.importDefaults(newValue);
                    self.refresh();
                }
            }, true);

            /**
             * Add all dependencies defined from a task. Dependencies will be added only if plugin is enabled.
             *
             * @param task
             */
            this.addDependenciesFromTask = function(task) {
                if (this.pluginScope.enabled) {
                    var taskDependencies = task.model.dependencies;

                    if (taskDependencies !== undefined) {
                        if (!angular.isArray(taskDependencies)) {
                            taskDependencies = [taskDependencies];
                            task.model.dependencies = taskDependencies;
                        }

                        for (var i = 0, l = taskDependencies.length; i < l; i++) {
                            var dependency = self.addDependency(task, taskDependencies[i]);
                            dependency.connect();
                        }
                    }
                }
            };

            /**
             * Remove all dependencies defined for a task.
             *
             * @param task
             * @param keepConnection if true, dependency will not be disconnected.
             */
            this.removeDependenciesFromTask = function(task, keepConnection) {
                var dependencies = this.getTaskDependencies(task);

                if (dependencies) {
                    for (var i = 0; i < dependencies.length; i++) {
                        if (!keepConnection) {
                            dependencies[i].disconnect();
                        }
                        self.removeDependency(dependencies[i]);
                    }
                }
            };

            /**
             * Add definition of a dependency.
             *
             * @param task Task defining the dependency.
             * @param model Model object for the dependency.
             */
            this.addDependency = function(task, model) {
                var dependency = new Dependency(this, task, model);

                var fromTaskId = dependency.getFromTaskId();
                var toTaskId = dependency.getToTaskId();

                if (!(fromTaskId in this.dependenciesFrom)) {
                    this.dependenciesFrom[fromTaskId] = [];
                }
                if (!(toTaskId in this.dependenciesTo)) {
                    this.dependenciesTo[toTaskId] = [];
                }

                if (fromTaskId) {
                    this.dependenciesFrom[fromTaskId].push(dependency);
                }

                if (toTaskId) {
                    this.dependenciesTo[toTaskId].push(dependency);
                }

                return dependency;
            };

            /**
             * Remove definition of a dependency
             *
             * @param dependency Dependency object
             * @param keepConnection if true, dependency will not be disconnected.
             */
            this.removeDependency = function(dependency, keepConnection) {
                var fromDependencies = this.dependenciesFrom[dependency.getFromTaskId()];
                var fromRemove = [];
                var i;

                if (fromDependencies) {
                    for (i = 0; i < fromDependencies.length; i++) {
                        if (dependency === fromDependencies[i]) {
                            fromRemove.push(dependency);
                        }
                    }
                }

                var toDependencies = this.dependenciesTo[dependency.getToTaskId()];
                var toRemove = [];

                if (toDependencies) {
                    for (i = 0; i < toDependencies.length; i++) {
                        if (dependency === toDependencies[i]) {
                            toRemove.push(dependency);
                        }
                    }
                }

                for (i = 0; i < fromRemove.length; i++) {
                    if (!keepConnection) {
                        fromRemove[i].disconnect();
                    }
                    fromDependencies.splice(fromDependencies.indexOf(dependency), 1);
                }

                for (i = 0; i < toRemove.length; i++) {
                    if (!keepConnection) {
                        toRemove[i].disconnect();
                    }
                    toDependencies.splice(toDependencies.indexOf(dependency), 1);
                }

                if (this.dependenciesFrom[dependency.getFromTaskId()] &&
                    this.dependenciesFrom[dependency.getFromTaskId()].length === 0) {
                    delete this.dependenciesFrom[dependency.getFromTaskId()];
                }

                if (this.dependenciesTo[dependency.getToTaskId()] &&
                    this.dependenciesTo[dependency.getToTaskId()].length === 0) {
                    delete this.dependenciesTo[dependency.getToTaskId()];
                }
            };

            this.getTaskDependencies = function(task) {
                var dependencies = [];

                var fromDependencies = self.dependenciesFrom[task.model.id];
                if (fromDependencies) {
                    dependencies = dependencies.concat(fromDependencies);
                }

                var toDependencies = self.dependenciesTo[task.model.id];
                if (toDependencies) {
                    dependencies = dependencies.concat(toDependencies);
                }

                return dependencies;
            };

            this.setDraggingConnection = function(connection) {
                if (connection) {
                    self.draggingConnection = connection;
                    angular.forEach(self.tasks, function(task) {
                        task.dependencies.mouseHandler.release();
                    });
                } else {
                    self.draggingConnection = undefined;
                    angular.forEach(self.tasks, function(task) {
                        task.dependencies.mouseHandler.install();
                    });
                }
            };

            var addTaskEndpoints = function(task) {
                if (!task.dependencies) {
                    task.dependencies = {};
                }

                task.dependencies.endpoints = [];

                if (self.pluginScope.endpoints) {
                    for (var i = 0; i < self.pluginScope.endpoints.length; i++) {
                        var endpointObject = self.plumb.addEndpoint(task.$element, self.pluginScope.endpoints[i]);
                        endpointObject.setVisible(false, true, true); // hide endpoint
                        endpointObject.$task = task;
                        task.dependencies.endpoints.push(endpointObject);
                    }
                }

            };

            var removeTaskEndpoint = function(task) {
                for (var i = 0; i < task.dependencies.endpoints.length; i++) {
                    var endpointObject = task.dependencies.endpoints[i];
                    self.plumb.deleteEndpoint(endpointObject);
                    endpointObject.$task = undefined;
                }

                task.dependencies.endpoints = undefined;
            };

            var addTaskMouseHandler = function(task) {
                if (!task.dependencies) {
                    task.dependencies = {};
                }

                if (!self.pluginScope.readOnly) {
                    task.dependencies.mouseHandler = new TaskMouseHandler(self, task);
                    task.dependencies.mouseHandler.install();
                }
            };

            var removeTaskMouseHandler = function(task) {
                if (task.dependencies.mouseHandler) {
                    task.dependencies.mouseHandler.release();
                    task.dependencies.mouseHandler = undefined;
                }
            };

            /**
             * Set tasks objects that can be used to display dependencies.
             *
             * @param tasks
             */
            this.setTasks = function(tasks) {
                angular.forEach(self.tasks, function(task) {
                    removeTaskMouseHandler(task);
                    removeTaskEndpoint(task);
                });

                var newTasks = {};
                for (var i = 0; i < tasks.length; i++) {
                    var task = tasks[i];
                    newTasks[task.model.id] = task;
                    addTaskEndpoints(task);
                    addTaskMouseHandler(task);
                }
                self.tasks = newTasks;
                self.tasksList = tasks;
            };

            var disconnectTaskDependencies = function(task) {
                var dependencies = self.getTaskDependencies(task);
                if (dependencies) {
                    for (var i = 0; i < dependencies.length; i++) {
                        dependencies[i].disconnect();
                    }
                }
                return dependencies;
            };

            var connectTaskDependencies = function(task) {
                var dependencies = self.getTaskDependencies(task);
                if (dependencies) {
                    for (var i = 0; i < dependencies.length; i++) {
                        dependencies[i].connect();
                    }
                }
                return dependencies;
            };

            /**
             * Set task object in replacement of an existing with the same id.
             *
             * @param task
             */
            this.setTask = function(task) {
                self.plumb.setSuspendDrawing(true);
                try {
                    var oldTask = self.tasks[task.model.id];
                    if (oldTask !== undefined) {
                        disconnectTaskDependencies(oldTask);
                        removeTaskMouseHandler(oldTask);
                        removeTaskEndpoint(oldTask);
                    }
                    self.tasks[task.model.id] = task;
                    addTaskEndpoints(task);
                    addTaskMouseHandler(task);
                    connectTaskDependencies(task);
                } finally {
                    self.plumb.setSuspendDrawing(false, true);
                }
            };

            /**
             * Retrieve the task from it's id.
             *
             * @param taskId id of the task element to retrieve.
             * @returns {*}
             */
            this.getTask = function(taskId) {
                return self.tasks[taskId];
            };

            var getSourceEndpoints = function(task) {
                return task.dependencies.endpoints.filter(function(endpoint) {
                    return endpoint.isSource;
                });
            };

            var getTargetEndpoints = function(task) {
                return task.dependencies.endpoints.filter(function(endpoint) {
                    return endpoint.isTarget;
                });
            };

            /**
             * Connects two tasks together using source endpoint from fromTask and target endpoint from toTask.
             *
             * @param fromTask
             * @param toTask
             * @param model
             * @returns connection object
             */
            this.connect = function(fromTask, toTask, model) {
                var sourceEndpoints = getSourceEndpoints(fromTask);
                var targetEndpoints = getTargetEndpoints(toTask);
                if (sourceEndpoints && targetEndpoints) {
                    var sourceEndpoint;
                    var targetEndpoint;

                    if (model.connectParameters && model.connectParameters.sourceEndpointIndex) {
                        sourceEndpoint = sourceEndpoints[model.connectParameters.sourceEndpointIndex];
                    } else {
                        sourceEndpoint = sourceEndpoints[0];
                    }

                    if (model.connectParameters && model.connectParameters.targetEndpointIndex) {
                        targetEndpoint = targetEndpoints[model.connectParameters.targetEndpointIndex];
                    } else {
                        targetEndpoint = targetEndpoints[0];
                    }

                    var connection = self.plumb.connect({
                        source: sourceEndpoint,
                        target: targetEndpoint
                    }, model.connectParameters);
                    return connection;
                }
            };

            /**
             * Get all defined dependencies.
             *
             * @returns {Array}
             */
            this.getDependencies = function() {
                var allDependencies = [];

                angular.forEach(this.dependenciesFrom, function(dependencies) {
                    for (var i = 0; i < dependencies.length; i++) {
                        if (!(dependencies[i] in allDependencies)) {
                            allDependencies.push(dependencies[i]);
                        }
                    }
                });

                return allDependencies;
            };

            /**
             * Refresh jsplumb status based on tasks dependencies models.
             */
            this.refresh = function(tasks) {
                self.plumb.setSuspendDrawing(true);

                try {
                    var tasksDependencies;
                    var i;
                    if (tasks && !angular.isArray(tasks)) {
                        tasks = [tasks];
                    }

                    if (tasks === undefined) {
                        tasks = this.tasks;
                        tasksDependencies = this.getDependencies();
                    } else {
                        tasksDependencies = [];
                        angular.forEach(tasks, function(task) {
                            var taskDependencies = self.getTaskDependencies(task);
                            angular.forEach(taskDependencies, function(taskDependency) {
                                if (!(taskDependency in tasksDependencies)) {
                                    tasksDependencies.push(taskDependency);
                                }
                            });
                        });
                    }

                    for (i = 0; i < tasksDependencies.length; i++) {
                        self.removeDependency(tasksDependencies[i]);
                    }

                    angular.forEach(tasks, function(task) {
                        self.addDependenciesFromTask(task);
                    });
                } finally {
                    self.plumb.setSuspendDrawing(false, true);
                }
            };

            this.api.registerMethod('dependencies', 'refresh', this.refresh, this);
        };
        return DependenciesManager;
    }]);
}());

(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependency', ['ganttUtils', 'ganttDom', function(utils, dom) {
        /**
         * Constructor of Dependency object.
         * 
         * @param manager Dependency manager used by this dependency
         * @param task Task declaring the dependency
         * @param model model of the dependency
         *
         * @constructor
         *
         * @see https://jsplumbtoolkit.com/community/apidocs/classes/jsPlumb.html#method_connect
         */
        var Dependency = function(manager, task, model) {
            var self = this;

            this.manager = manager;
            this.task = task;
            this.model = model;
            this.connection = undefined;
            this.fallbackEndpoints = [];

            /**
             * Check if this dependency is connected.
             *
             * @returns {boolean}
             */
            this.isConnected = function() {
                if (this.connection) {
                    return true;
                }
                return false;
            };

            /**
             * Disconnect this dependency.
             */
            this.disconnect = function() {
                if (this.connection) {
                    if (this.connection.endpoints) {
                        this.manager.plumb.detach(this.connection);
                    }
                    this.connection.$dependency = undefined;
                    this.connection = undefined;
                }

                this.deleteFallbackEndpoints();
            };

            this.deleteFallbackEndpoints = function() {
                if (this.fallbackEndpoints) {
                    for (var i=0; i<this.fallbackEndpoints.length; i++) {
                        self.manager.plumb.deleteEndpoint(this.fallbackEndpoints[i]);
                    }
                    this.fallbackEndpoints = [];
                }
            };

            this.getFromTaskId = function() {
                if (this.model.from !== undefined) {
                    return this.model.from;
                }
                return this.task.model.id;
            };

            this.getToTaskId = function() {
                if (this.model.to !== undefined) {
                    return this.model.to;
                }
                return this.task.model.id;
            };

            this.getFromTask = function() {
                if (this.model.from !== undefined) {
                    return this.manager.getTask(this.model.from);
                }
                return this.task;
            };

            this.getToTask = function() {
                if (this.model.to !== undefined) {
                    return this.manager.getTask(this.model.to);
                }
                return this.task;
            };

            this.removeFromTaskModel = function() {
                var modelIndex = utils.angularIndexOf(this.task.model.dependencies, this.model);
                if (modelIndex >= 0) {
                    this.task.model.dependencies.splice(modelIndex, 1);
                }
                return modelIndex;
            };

            var isTaskVisible = function(task) {
                if (task === undefined || task.$element === undefined) {
                    return false;
                }
                var element = task.$element[0];
                return dom.isElementVisible(element);
            };

            /**
             * Connect this dependency if both elements are available.
             *
             * @returns {boolean}
             */
            this.connect = function() {
                var fromTask = this.getFromTask();
                var toTask = this.getToTask();

                if (!isTaskVisible(fromTask)) {
                    fromTask = undefined;
                }

                if (!isTaskVisible(toTask)) {
                    toTask = undefined;
                }

                if (fromTask && toTask) {
                    var connection = this.manager.connect(fromTask, toTask, this.model);
                    if (connection) {
                        connection.$dependency = this;
                        this.connection = connection;
                        return true;
                    }
                }

                this.deleteFallbackEndpoints();
                if (fromTask !== undefined) {
                    var toFallbackEndpoint = this.manager.pluginScope.fallbackEndpoints[1];
                    this.fallbackEndpoints.push(this.manager.plumb.addEndpoint(fromTask.$element, toFallbackEndpoint));
                }
                if (toTask !== undefined) {
                    var fromFallbackEndpoint = this.manager.pluginScope.fallbackEndpoints[0];
                    this.fallbackEndpoints.push(this.manager.plumb.addEndpoint(toTask.$element, fromFallbackEndpoint));
                }
                return false;
            };
        };
        return Dependency;
    }]);
}());

(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependencyTaskMouseHandler', ['$timeout', function($timeout) {
        var TaskMouseHandler = function(manager, task) {
            var self = this;

            this.manager = manager;
            this.task = task;
            this.installed = false;
            this.elementHandlers = [];

            this.display = true;
            this.hideEndpointsPromise = undefined;

            /**
             * Handler for a single DOM element.
             *
             * @param element
             * @constructor
             */
            var ElementHandler = function(element) {
                this.element = element;

                this.mouseExitHandler = function() {
                    $timeout.cancel(self.hideEndpointsPromise);
                    self.hideEndpointsPromise = $timeout(self.hideEndpoints, 1000, false);
                };

                this.mouseEnterHandler = function() {
                    $timeout.cancel(self.hideEndpointsPromise);
                    self.displayEndpoints();
                };

                this.install = function() {
                    this.element.bind('mouseenter', this.mouseEnterHandler);
                    this.element.bind('mouseleave', this.mouseExitHandler);
                };

                this.release = function() {
                    this.element.unbind('mouseenter', this.mouseEnterHandler);
                    this.element.unbind('mouseleave', this.mouseExitHandler);
                    $timeout.cancel(self.hideEndpointsPromise);
                };

            };



            /**
             * Install mouse handler for this task, and hide all endpoints.
             */
            this.install = function() {
                if (!self.installed) {
                    self.hideEndpoints();

                    self.elementHandlers.push(new ElementHandler(self.task.getContentElement()));
                    angular.forEach(self.task.dependencies.endpoints, function(endpoint) {
                        self.elementHandlers.push(new ElementHandler(angular.element(endpoint.canvas)));
                    });

                    angular.forEach(self.elementHandlers, function(elementHandler) {
                        elementHandler.install();
                    });

                    self.installed = true;
                }
            };

            /**
             * Release mouse handler for this task, and display all endpoints.
             */
            this.release = function() {
                if (self.installed) {
                    angular.forEach(self.elementHandlers, function(elementHandler) {
                        elementHandler.release();
                    });

                    self.elementHandlers = [];

                    self.displayEndpoints();
                    self.installed = false;
                }
            };

            /**
             * Display all endpoints for this task.
             */
            this.displayEndpoints = function() {
                self.display = true;
                angular.forEach(self.task.dependencies.endpoints, function(endpoint) {
                    endpoint.setVisible(true, true, true);
                });
            };

            /**
             * Hide all endpoints for this task.
             */
            this.hideEndpoints = function() {
                angular.forEach(self.task.dependencies.endpoints, function(endpoint) {
                    endpoint.setVisible(false, true, true);
                });
                self.display = false;
            };
        };
        return TaskMouseHandler;
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt.groups').controller('GanttGroupController', ['$scope', 'GanttTaskGroup', 'ganttUtils', function($scope, TaskGroup, utils) {
        var updateTaskGroup = function() {
            var rowGroups = $scope.row.model.groups;

            if (typeof(rowGroups) === 'boolean') {
                rowGroups = {enabled: rowGroups};
            }

            var enabledValue = utils.firstProperty([rowGroups], 'enabled', $scope.pluginScope.enabled);
            if (enabledValue) {
                $scope.display = utils.firstProperty([rowGroups], 'display', $scope.pluginScope.display);
                $scope.taskGroup = new TaskGroup($scope.row, $scope.pluginScope);

                $scope.row.setFromTo();
                $scope.row.setFromToByValues($scope.taskGroup.from, $scope.taskGroup.to);
            } else {
                $scope.taskGroup = undefined;
                $scope.display = undefined;
            }
        };

        $scope.gantt.api.tasks.on.viewChange($scope, function(task) {
            if ($scope.taskGroup !== undefined) {
                if ($scope.taskGroup.tasks.indexOf(task) > -1) {
                    updateTaskGroup();
                    if(!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$digest();
                    }
                } else {
                    var descendants = $scope.pluginScope.hierarchy.descendants($scope.row);
                    if (descendants.indexOf(task.row) > -1) {
                        updateTaskGroup();
                        if(!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$digest();
                        }
                    }
                }
            }
        });

        var removeWatch = $scope.pluginScope.$watch('display', updateTaskGroup);

        $scope.$watchCollection('gantt.rowsManager.filteredRows', updateTaskGroup);

        $scope.gantt.api.columns.on.refresh($scope, updateTaskGroup);

        $scope.$on('$destroy', removeWatch);
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.groups').directive('ganttTaskGroup', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTaskGroup', 'plugins/groups/taskGroup.tmpl.html');
        return builder.build();
    }]);
}());


(function() {
    'use strict';

    angular.module('gantt').factory('GanttTaskGroup', ['ganttUtils', 'GanttTask', function(utils, Task) {
        var TaskGroup = function(row, pluginScope) {
            var self = this;

            self.row = row;
            self.pluginScope = pluginScope;

            self.descendants = self.pluginScope.hierarchy.descendants(self.row);

            self.tasks = [];
            self.overviewTasks = [];
            self.promotedTasks = [];
            self.showGrouping = false;

            var groupRowGroups = self.row.model.groups;
            if (typeof(groupRowGroups) === 'boolean') {
                groupRowGroups = {enabled: groupRowGroups};
            }

            var getTaskDisplay = function(task) {
                var taskGroups = task.model.groups;
                if (typeof(taskGroups) === 'boolean') {
                    taskGroups = {enabled: taskGroups};
                }

                var rowGroups = task.row.model.groups;
                if (typeof(rowGroups) === 'boolean') {
                    rowGroups = {enabled: rowGroups};
                }

                var enabledValue = utils.firstProperty([taskGroups, rowGroups, groupRowGroups], 'enabled', self.pluginScope.enabled);

                if (enabledValue) {
                    var display = utils.firstProperty([taskGroups, rowGroups, groupRowGroups], 'display', self.pluginScope.display);
                    return display;
                }
            };

            for (var i = 0; i < self.descendants.length; i++) {
                var tasks = self.descendants[i].tasks;

                for (var j = 0; j < tasks.length; j++) {
                    var task = tasks[j];

                    var taskDisplay = getTaskDisplay(task);
                    if (taskDisplay !== undefined) {
                        self.tasks.push(task);
                        var clone = new Task(self.row, task.model);

                        if (taskDisplay === 'overview') {
                            self.overviewTasks.push(clone);
                        } else if (taskDisplay === 'promote') {
                            self.promotedTasks.push(clone);
                        } else {
                            self.showGrouping = true;
                        }
                    }
                }
            }

            self.from = undefined;
            if (groupRowGroups) {
                self.from = groupRowGroups.from;
            }
            if (self.from === undefined) {
                for (i=0; i<self.tasks.length; i++) {
                    if (self.from === undefined || self.tasks[i].model.from < self.from) {
                        self.from = self.tasks[i].model.from;
                    }
                }
            }

            self.to = undefined;
            if (groupRowGroups) {
                self.to = groupRowGroups.to;
            }
            if (self.to === undefined) {
                for (i=0; i<self.tasks.length; i++) {
                    if (self.to === undefined || self.tasks[i].model.to > self.to) {
                        self.to = self.tasks[i].model.to;
                    }
                }
            }

            if (self.showGrouping) {
                self.left = row.rowsManager.gantt.getPositionByDate(self.from);
                self.width = row.rowsManager.gantt.getPositionByDate(self.to) - self.left;
            }
        };
        return TaskGroup;
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').directive('ganttTaskOverview', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTaskOverview', 'plugins/groups/taskOverview.tmpl.html');
        builder.controller = function($scope, $element) {
            $scope.task.$element = $element;
            $scope.task.$scope = $scope;
            $scope.task.updatePosAndSize();
        };
        return builder.build();
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt.labels').directive('ganttLabelsBody', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttLabelsBody', 'plugins/labels/labelsBody.tmpl.html');
        builder.controller = function($scope) {
            var hScrollBarHeight = layout.getScrollBarHeight();

            $scope.getLabelsCss = function() {
                var css = {};

                if ($scope.maxHeight) {
                    var bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
                    css['max-height'] = $scope.maxHeight - bodyScrollBarHeight - $scope.gantt.header.getHeight() + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());



(function(){
    'use strict';
    angular.module('gantt.labels').directive('ganttLabelsHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttLabelsHeader', 'plugins/labels/labelsHeader.tmpl.html');
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.labels').directive('ganttSideContentLabels', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSideContentLabels', 'plugins/labels/sideContentLabels.tmpl.html');
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.movable').factory('ganttMovableOptions', [function() {
        return {
            initialize: function(options) {

                options.enabled = options.enabled !== undefined ? options.enabled : true;
                options.allowMoving = options.allowMoving !== undefined ? !!options.allowMoving : true;
                options.allowResizing = options.allowResizing !== undefined ? !!options.allowResizing : true;
                options.allowRowSwitching = options.allowRowSwitching !== undefined ? !!options.allowRowSwitching : true;

                return options;
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.progress').directive('ganttTaskProgress', ['$templateCache', function($templateCache) {
        return {
            restrict: 'E',
            requires: '^ganttTask',
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
                if (tAttrs.templateUrl === undefined) {
                    templateUrl = 'plugins/progress/taskProgress.tmpl.html';
                } else {
                    templateUrl = tAttrs.templateUrl;
                }
                if (tAttrs.template !== undefined) {
                    $templateCache.put(templateUrl, tAttrs.template);
                }
                return templateUrl;
            },
            replace: true,
            scope: true,
            controller: ['$scope', '$element', function($scope, $element) {
                $scope.getClasses = function() {
                    var classes = [];

                    if (typeof($scope.task.model.progress) === 'object') {
                        classes = $scope.task.model.progress.classes;
                    }

                    return classes;
                };

                $scope.getCss = function() {
                    var css = {};

                    var progress;
                    if ($scope.task.model.progress !== undefined) {
                        if (typeof($scope.task.model.progress) === 'object') {
                            progress = $scope.task.model.progress;
                        } else {
                            progress = {percent: $scope.task.model.progress};
                        }
                    }

                    if (progress) {
                        if (progress.color) {
                            css['background-color'] = progress.color;
                        } else {
                            css['background-color'] = '#6BC443';
                        }

                        css.width = progress.percent + '%';
                    }

                    return css;
                };

                $scope.task.rowsManager.gantt.api.directives.raise.new('ganttTaskProgress', $scope, $element);
                $scope.$on('$destroy', function() {
                    $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttTaskProgress', $scope, $element);
                });
            }]
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.table').directive('ganttSideContentTable', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttSideContentTable', 'plugins/table/sideContentTable.tmpl.html');
        builder.controller = function($scope) {
            var hScrollBarHeight = layout.getScrollBarHeight();

            $scope.getMaxHeightCss = function() {
                var css = {};

                if ($scope.maxHeight) {
                    var bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
                    css['max-height'] = $scope.maxHeight - bodyScrollBarHeight - $scope.gantt.header.getHeight() + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt.table').controller('TableColumnController', ['$scope', function($scope) {
        $scope.getHeader = function() {
            var header = $scope.pluginScope.headers[$scope.column];
            if (header !== undefined) {
                return header;
            }
            if ($scope.pluginScope.headerFormatter !== undefined) {
                header = $scope.pluginScope.headerFormatter($scope.column);
            }
            if (header !== undefined) {
                return header;
            }
            return header;
        };

        $scope.getHeaderContent = function() {
            var headerContent = $scope.pluginScope.headerContents[$scope.column];
            if (headerContent === undefined) {
                return '{{getHeader()}}';
            }
            return headerContent;
        };

        $scope.getClass = function() {
            return $scope.pluginScope.classes[$scope.column];
        };
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt.table').controller('TableColumnRowController', ['$scope', function($scope) {
        $scope.getValue = function() {
            var value = $scope.$eval($scope.column, $scope.row);

            var formatter = $scope.pluginScope.formatters[$scope.column];
            if (formatter !== undefined) {
                value = formatter(value, $scope.column, $scope.row);
            }

            return value;
        };

        $scope.getRowContent = function() {
            var content;
            if ($scope.row.model.columnContents) {
                content = $scope.row.model.columnContents[$scope.column];
            }
            if (content === undefined && $scope.column === 'model.name') {
                content = $scope.row.model.content;
            }
            if (content === undefined) {
                content = $scope.pluginScope.contents[$scope.column];
            }
            if (content === undefined && $scope.column === 'model.name') {
                content = $scope.row.rowsManager.gantt.options.value('rowContent');
            }
            if (content === undefined && $scope.pluginScope.content !== undefined) {
                content = $scope.pluginScope.content;
            }
            if (content === undefined) {
                return '{{getValue()}}';
            }
            return content;
        };
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt.tooltips').directive('ganttTooltip', ['$log','$timeout', '$compile', '$document', '$templateCache', 'ganttDebounce', 'ganttSmartEvent', function($log, $timeout, $compile, $document, $templateCache, debounce, smartEvent) {
        // This tooltip displays more information about a task

        return {
            restrict: 'E',
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
                if (tAttrs.templateUrl === undefined) {
                    templateUrl = 'plugins/tooltips/tooltip.tmpl.html';
                } else {
                    templateUrl = tAttrs.templateUrl;
                }
                if (tAttrs.template !== undefined) {
                    $templateCache.put(templateUrl, tAttrs.template);
                }
                return templateUrl;
            },
            scope: true,
            replace: true,
            controller: ['$scope', '$element', 'ganttUtils', function($scope, $element, utils) {
                var bodyElement = angular.element($document[0].body);
                var parentElement = $scope.task.$element;
                var showTooltipPromise;
                var visible = false;
                var mouseEnterX;
                var mouseMoveHandler;

                var getViewPortWidth = function() {
                    var d = $document[0];
                    return d.documentElement.clientWidth || d.documentElement.getElementById('body')[0].clientWidth;
                };

                var updateTooltip = function(x) {
                    // Check if info is overlapping with view port
                    if (x + $element[0].offsetWidth > getViewPortWidth()) {
                        $element.css('left', (x + 20 - $element[0].offsetWidth) + 'px');
                        $scope.isRightAligned = true;
                    } else {
                        $element.css('left', (x - 20) + 'px');
                        $scope.isRightAligned = false;
                    }
                };

                var showTooltip = function(x) {
                    visible = true;
                    mouseMoveHandler.bind();

                    $scope.displayed = true;

                    $scope.$evalAsync(function() {
                        var restoreNgHide;
                        if ($element.hasClass('ng-hide')) {
                            $element.removeClass('ng-hide');
                            restoreNgHide = true;
                        }
                        $scope.elementHeight = $element[0].offsetHeight;
                        if (restoreNgHide) {
                            $element.addClass('ng-hide');
                        }
                        $scope.taskRect = parentElement[0].getBoundingClientRect();
                        updateTooltip(x);
                    });
                };

                var hideTooltip = function() {
                    visible = false;
                    mouseMoveHandler.unbind();
                    $scope.$evalAsync(function() {
                        $scope.displayed = false;
                    });
                };

                var displayTooltip = function(newValue, showDelayed) {
                    if (showTooltipPromise) {
                        $timeout.cancel(showTooltipPromise);
                    }

                    var taskTooltips = $scope.task.model.tooltips;
                    var rowTooltips = $scope.task.row.model.tooltips;

                    if (typeof(taskTooltips) === 'boolean') {
                        taskTooltips = {enabled: taskTooltips};
                    }

                    if (typeof(rowTooltips) === 'boolean') {
                        rowTooltips = {enabled: rowTooltips};
                    }

                    var enabled = utils.firstProperty([taskTooltips, rowTooltips], 'enabled', $scope.pluginScope.enabled);
                    if (enabled && !visible && mouseEnterX !== undefined && newValue) {
                        if (showDelayed) {
                            showTooltipPromise = $timeout(function() {
                                showTooltip(mouseEnterX);
                            }, $scope.pluginScope.delay, false);
                        } else {
                            showTooltip(mouseEnterX);
                        }
                    } else if (!newValue) {
                        if (!$scope.task.active) {
                            hideTooltip();
                        }
                    }
                };

                mouseMoveHandler = smartEvent($scope, bodyElement, 'mousemove', debounce(function(e) {
                    if (!visible) {
                        mouseEnterX = e.clientX;
                        displayTooltip(true, false);
                    } else {
                        // check if mouse goes outside the parent
                        if(
                            !$scope.taskRect ||
                            e.clientX < $scope.taskRect.left ||
                            e.clientX > $scope.taskRect.right ||
                            e.clientY > $scope.taskRect.bottom ||
                            e.clientY < $scope.taskRect.top
                        ) {
                            displayTooltip(false, false);
                        }

                        updateTooltip(e.clientX);
                    }
                }, 5, false));

                $scope.getFromLabel = function() {
                    var taskTooltips = $scope.task.model.tooltips;
                    var rowTooltips = $scope.task.row.model.tooltips;

                    if (typeof(taskTooltips) === 'boolean') {
                        taskTooltips = {enabled: taskTooltips};
                    }

                    if (typeof(rowTooltips) === 'boolean') {
                        rowTooltips = {enabled: rowTooltips};
                    }

                    var dateFormat = utils.firstProperty([taskTooltips, rowTooltips], 'dateFormat', $scope.pluginScope.dateFormat);
                    return $scope.task.model.from.format(dateFormat);
                };

                $scope.getToLabel = function() {
                    var taskTooltips = $scope.task.model.tooltips;
                    var rowTooltips = $scope.task.row.model.tooltips;

                    if (typeof(taskTooltips) === 'boolean') {
                        taskTooltips = {enabled: taskTooltips};
                    }

                    if (typeof(rowTooltips) === 'boolean') {
                        rowTooltips = {enabled: rowTooltips};
                    }

                    var dateFormat = utils.firstProperty([taskTooltips, rowTooltips], 'dateFormat', $scope.pluginScope.dateFormat);
                    return $scope.task.model.to.format(dateFormat);
                };

                $scope.task.getContentElement().bind('mousemove', function(evt) {
                    mouseEnterX = evt.clientX;
                });

                $scope.task.getContentElement().bind('mouseenter', function(evt) {
                    mouseEnterX = evt.clientX;
                    displayTooltip(true, true);
                });

                $scope.task.getContentElement().bind('mouseleave', function() {
                    displayTooltip(false);
                });

                if ($scope.pluginScope.api.tasks.on.moveBegin) {
                    $scope.pluginScope.api.tasks.on.moveBegin($scope, function(task) {
                        if (task === $scope.task) {
                            displayTooltip(true);
                        }
                    });

                    $scope.pluginScope.api.tasks.on.moveEnd($scope, function(task) {
                        if (task === $scope.task) {
                            displayTooltip(false);
                        }
                    });

                    $scope.pluginScope.api.tasks.on.resizeBegin($scope, function(task) {
                        if (task === $scope.task) {
                            displayTooltip(true);
                        }
                    });

                    $scope.pluginScope.api.tasks.on.resizeEnd($scope, function(task) {
                        if (task === $scope.task) {
                            displayTooltip(false);
                        }
                    });
                }

                if ($scope.task.isMoving) {
                    // Display tooltip because task has been moved to a new row
                    displayTooltip(true, false);
                }

                $scope.gantt.api.directives.raise.new('ganttTooltip', $scope, $element);
                $scope.$on('$destroy', function() {
                    $scope.gantt.api.directives.raise.destroy('ganttTooltip', $scope, $element);
                });
            }]
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.tree').directive('ganttRowTreeLabel', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRowTreeLabel');
        builder.restrict = 'A';
        builder.templateUrl = undefined;
        return builder.build();
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.tree').directive('ganttSideContentTree', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSideContentTree', 'plugins/tree/sideContentTree.tmpl.html');
        return builder.build();
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt.tree').controller('GanttTreeController', ['$scope', '$filter', 'GanttHierarchy', function($scope, $filter, Hierarchy) {
        $scope.rootRows = [];

        $scope.getHeader = function() {
            return $scope.pluginScope.header;
        };

        var hierarchy = new Hierarchy();

        $scope.pluginScope.$watchGroup(['keepAncestorOnFilterRow', 'enabled'], function(value) {
            var keepAncestor = value[0] && value[1];

            if (keepAncestor) {
                var filterImpl = function(sortedRows, filterRow, filterRowComparator) {
                    hierarchy.refresh(sortedRows);

                    var leaves = [];
                    for (var i = 0; i < sortedRows.length; i++) {
                        var children = hierarchy.children(sortedRows[i]);
                        if (!children || children.length === 0) {
                            leaves.push(sortedRows[i]);
                        }
                    }

                    var filteredLeaves = $filter('filter')(leaves, filterRow, filterRowComparator);

                    var filterRowKeepAncestor = function(row) {
                        if (filteredLeaves.indexOf(row) > -1) {
                            return true;
                        }

                        var descendants = hierarchy.descendants(row);

                        for (var i = 0; i < descendants.length; i++) {
                            if (filteredLeaves.indexOf(descendants[i]) > -1) {
                                return true;
                            }
                        }

                        return false;
                    };

                    return $filter('filter')(sortedRows, filterRowKeepAncestor, filterRowComparator);
                };
                $scope.gantt.rowsManager.setFilterImpl(filterImpl);
            } else {
                $scope.gantt.rowsManager.setFilterImpl(false);
            }
        });

        var isVisible = function(row) {
            var parentRow = $scope.parent(row);
            while (parentRow !== undefined) {
                if (parentRow !== undefined && parentRow._collapsed) {
                    return false;
                }
                parentRow = $scope.parent(parentRow);
            }
            return true;
        };

        var filterRowsFunction = function(rows) {
            return rows.filter(function(row) {
                return isVisible(row);
            });
        };

        var sortRowsFunction = function(rows) {
            var sortedRows = [];
            var rootRows = [];

            var hasParent = false;

            for (var i=0; i<rows.length; i++) {
                var rowParent = $scope.parent(rows[i]);
                if (rowParent === undefined) {
                    rootRows.push(rows[i]);
                } else {
                    hasParent = true;
                }
            }

            var handleChildren = function(row) {
                sortedRows.push(row);
                var children = $scope.children(row);


                if (children !== undefined && children.length > 0) {
                    var sortedChildren = children.sort(function(a, b) {
                        return rows.indexOf(a) - rows.indexOf(b);
                    });

                    for (var i=0;i<sortedChildren.length;i++) {
                        handleChildren(sortedChildren[i]);
                    }
                }
            };

            for (i=0; i<rootRows.length; i++) {
                handleChildren(rootRows[i]);
            }

            return sortedRows;
        };
        $scope.gantt.api.rows.addRowSorter(sortRowsFunction);
        $scope.gantt.api.rows.addRowFilter(filterRowsFunction);

        $scope.$on('$destroy', function() {
            $scope.gantt.api.rows.removeRowSorter(sortRowsFunction);
            $scope.gantt.api.rows.removeRowFilter(filterRowsFunction);
        });

        var refresh = function() {
            $scope.rootRows = hierarchy.refresh($scope.gantt.rowsManager.filteredRows);

            if ($scope.gantt.rowsManager.filteredRows.length > 0) {
                $scope.gantt.api.rows.sort();
                $scope.gantt.api.rows.refresh();
            }
        };

        $scope.gantt.api.rows.on.remove($scope, refresh);
        $scope.gantt.api.rows.on.add($scope, refresh);

        var isRowCollapsed = function(rowId) {
            var row;
            if (typeof rowId === 'string') {
                row = $scope.gantt.rowsManager.rowsMap[rowId];
            } else {
                row = rowId;
            }
            if (row === undefined) {
                return undefined;
            }
            if (row._collapsed === undefined) {
                return false;
            }
            return row._collapsed;
        };

        var expandRow = function(rowId) {
            var row;
            if (typeof rowId === 'string') {
                row = $scope.gantt.rowsManager.rowsMap[rowId];
            } else {
                row = rowId;
            }
            if (row === undefined) {
                return;
            }

            var rowScope = $scope.nodeScopes[row.model.id];
            if (rowScope.collapsed) {
                rowScope.toggle();
            }
        };

        var collapseRow = function(rowId) {
            var row;
            if (typeof rowId === 'string') {
                row = $scope.gantt.rowsManager.rowsMap[rowId];
            } else {
                row = rowId;
            }
            if (row === undefined) {
                return;
            }

            var rowScope = $scope.nodeScopes[row.model.id];
            if (!rowScope.collapsed) {
                rowScope.toggle();
            }
        };

        var getHierarchy = function() {
            return hierarchy;
        };

        $scope.getHeaderContent = function() {
            return $scope.pluginScope.headerContent;
        };

        $scope.gantt.api.registerMethod('tree', 'refresh', refresh, this);
        $scope.gantt.api.registerMethod('tree', 'isCollapsed', isRowCollapsed, this);
        $scope.gantt.api.registerMethod('tree', 'expand', expandRow, this);
        $scope.gantt.api.registerMethod('tree', 'collapse', collapseRow, this);

        $scope.gantt.api.registerEvent('tree', 'collapsed');

        $scope.gantt.api.registerMethod('tree', 'getHierarchy', getHierarchy, this);

        $scope.$watchCollection('gantt.rowsManager.filteredRows', function() {
            refresh();
        });

        $scope.children = function(row) {
            if (row === undefined) {
                return $scope.rootRows;
            }
            return hierarchy.children(row);
        };

        $scope.parent = function(row) {
            return hierarchy.parent(row);
        };

        $scope.nodeScopes = {};
    }]).controller('GanttUiTreeController', ['$scope', function($scope) {
        var collapseAll = function() {
            $scope.$broadcast('angular-ui-tree:collapse-all');
        };

        var expandAll = function() {
            $scope.$broadcast('angular-ui-tree:expand-all');
        };

        $scope.gantt.api.registerMethod('tree', 'collapseAll', collapseAll, $scope);
        $scope.gantt.api.registerMethod('tree', 'expandAll', expandAll, $scope);
    }]).controller('GanttTreeNodeController', ['$scope', function($scope) {
        $scope.$parent.nodeScopes[$scope.row.model.id] = $scope;
        $scope.$on('$destroy', function() {
            delete $scope.$parent.nodeScopes[$scope.row.model.id];
        });

        $scope.$watch('children(row)', function(newValue) {
            if (newValue) {
                // Children rows may have been filtered out
                // So we need to filter the raw hierarchy before displaying children in tree.
                var visibleRows = $scope.row.rowsManager.filteredRows;

                var filteredChildrenRows = [];
                for (var i = 0; i < newValue.length; i++) {
                    var childRow = newValue[i];
                    if (visibleRows.indexOf(childRow) > -1) {
                        filteredChildrenRows.push(childRow);
                    }
                }

                $scope.$parent.childrenRows = filteredChildrenRows;
            } else {
                $scope.$parent.childrenRows = newValue;
            }
        });

        $scope.isCollapseDisabled = function() {
            return !$scope.$parent.childrenRows || $scope.$parent.childrenRows.length === 0;
        };

        $scope.getValue = function() {
            return $scope.row.model.name;
        };

        $scope.getRowContent = function() {
            if ($scope.row.model.content !== undefined) {
                return $scope.row.model.content;
            }
            if ($scope.pluginScope.content !== undefined) {
                return $scope.pluginScope.content;
            }

            var content = $scope.row.rowsManager.gantt.options.value('rowContent');
            if (content === undefined) {
                content = '{{row.model.name}}';
            }
            return content;
        };

        $scope.$watch('collapsed', function(newValue) {
            if ($scope.$modelValue._collapsed !== newValue) {
                var oldValue = $scope.$modelValue._collapsed;
                $scope.$modelValue._collapsed = newValue; // $modelValue contains the Row object
                if (oldValue !== undefined && newValue !== oldValue) {
                    $scope.gantt.api.tree.raise.collapsed($scope, $scope.$modelValue, newValue);
                    $scope.gantt.api.rows.refresh();
                }
            }
        });
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.tree').directive('ganttTreeBody', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttTreeBody', 'plugins/tree/treeBody.tmpl.html');
        builder.controller = function($scope) {
            var hScrollBarHeight = layout.getScrollBarHeight();

            $scope.getLabelsCss = function() {
                var css = {};

                if ($scope.maxHeight) {
                    var bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
                    css['max-height'] = $scope.maxHeight - bodyScrollBarHeight - $scope.gantt.header.getHeight() + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());



(function(){
    'use strict';
    angular.module('gantt.tree').directive('ganttTreeHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTreeHeader', 'plugins/tree/treeHeader.tmpl.html');
        return builder.build();
    }]);
}());


angular.module('gantt.bounds.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/bounds/taskBounds.tmpl.html',
        '<div ng-cloak class="gantt-task-bounds" ng-style="getCss()" ng-class="getClass()"></div>\n' +
        '');
}]);

angular.module('gantt.dependencies.templates', []).run(['$templateCache', function($templateCache) {

}]);

angular.module('gantt.drawtask.templates', []).run(['$templateCache', function($templateCache) {

}]);

angular.module('gantt.groups.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/groups/taskGroup.tmpl.html',
        '<div ng-controller="GanttGroupController">\n' +
        '    <div class="gantt-task-group-overview" ng-if="taskGroup.overviewTasks.length > 0">\n' +
        '        <gantt-task-overview ng-repeat="task in taskGroup.overviewTasks"></gantt-task-overview>\n' +
        '    </div>\n' +
        '    <div class="gantt-task-group-promote" ng-if="taskGroup.row._collapsed && taskGroup.promotedTasks.length > 0">\n' +
        '        <gantt-task ng-repeat="task in taskGroup.promotedTasks"></gantt-task>\n' +
        '    </div>\n' +
        '    <div class="gantt-task-group"\n' +
        '         ng-if="taskGroup.showGrouping"\n' +
        '         ng-style="{\'left\': taskGroup.left + \'px\', \'width\': taskGroup.width + \'px\'}">\n' +
        '        <div class="gantt-task-group-left-main"></div>\n' +
        '        <div class="gantt-task-group-right-main"></div>\n' +
        '        <div class="gantt-task-group-left-symbol"></div>\n' +
        '        <div class="gantt-task-group-right-symbol"></div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '\n' +
        '');
    $templateCache.put('plugins/groups/taskOverview.tmpl.html',
        '<div class="gantt-task gantt-task-overview" ng-class="task.model.classes">\n' +
        '    <gantt-task-background></gantt-task-background>\n' +
        '    <gantt-task-content></gantt-task-content>\n' +
        '    <gantt-task-foreground></gantt-task-foreground>\n' +
        '</div>\n' +
        '\n' +
        '');
}]);

angular.module('gantt.labels.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/labels/labelsBody.tmpl.html',
        '<div class="gantt-labels-body" ng-style="getLabelsCss()">\n' +
        '    <div gantt-vertical-scroll-receiver>\n' +
        '        <div ng-repeat="row in gantt.rowsManager.visibleRows track by row.model.id">\n' +
        '            <div gantt-row-label\n' +
        '                 class="gantt-row-label gantt-row-height"\n' +
        '                 ng-class="row.model.classes"\n' +
        '                 ng-style="{\'height\': row.model.height}">\n' +
        '                <span class="gantt-label-text">{{row.model.name}}</span>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
    $templateCache.put('plugins/labels/labelsHeader.tmpl.html',
        '<div class="gantt-labels-header">\n' +
        '    <div ng-show="gantt.columnsManager.columns.length > 0 && gantt.columnsManager.headers.length > 0">\n' +
        '        <div ng-repeat="header in gantt.columnsManager.headers">\n' +
        '            <div class="gantt-row-height" ng-class="{\'gantt-labels-header-row\': $last, \'gantt-labels-header-row-last\': $last}"><span>{{$last ? pluginScope.header : ""}}</span></div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
    $templateCache.put('plugins/labels/sideContentLabels.tmpl.html',
        '<div class="gantt-side-content-labels">\n' +
        '    <gantt-labels-header>\n' +
        '    </gantt-labels-header>\n' +
        '    <gantt-labels-body>\n' +
        '    </gantt-labels-body>\n' +
        '</div>\n' +
        '');
}]);

angular.module('gantt.movable.templates', []).run(['$templateCache', function($templateCache) {

}]);

angular.module('gantt.overlap.templates', []).run(['$templateCache', function($templateCache) {

}]);

angular.module('gantt.progress.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/progress/taskProgress.tmpl.html',
        '<div ng-cloak class="gantt-task-progress" ng-style="getCss()" ng-class="getClasses()"></div>\n' +
        '');
}]);

angular.module('gantt.resizeSensor.templates', []).run(['$templateCache', function($templateCache) {

}]);

angular.module('gantt.sortable.templates', []).run(['$templateCache', function($templateCache) {

}]);

angular.module('gantt.table.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/table/sideContentTable.tmpl.html',
        '<div class="gantt-side-content-table">\n' +
        '\n' +
        '    <div class="gantt-table-column {{getClass()}}" ng-repeat="column in pluginScope.columns" ng-controller="TableColumnController">\n' +
        '\n' +
        '        <div class="gantt-table-header" ng-style="{height: ganttHeaderHeight + \'px\'}">\n' +
        '            <div ng-show="ganttHeaderHeight" class="gantt-row-label-header gantt-row-label gantt-table-row gantt-table-header-row">\n' +
        '                <span class="gantt-label-text" gantt-bind-compile-html="getHeaderContent()"/>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '\n' +
        '        <div class="gantt-table-content" ng-style="getMaxHeightCss()">\n' +
        '            <div gantt-vertical-scroll-receiver>\n' +
        '                <div class="gantt-table-row" ng-repeat="row in gantt.rowsManager.visibleRows track by row.model.id" ng-controller="TableColumnRowController">\n' +
        '                    <div gantt-row-label class="gantt-row-label gantt-row-height" ng-class="row.model.classes" ng-style="{\'height\': row.model.height}">\n' +
        '                        <div class="gantt-valign-container">\n' +
        '                            <div class="gantt-valign-content">\n' +
        '                                <span class="gantt-label-text" gantt-bind-compile-html="getRowContent()"></span>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
}]);

angular.module('gantt.tooltips.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/tooltips/tooltip.tmpl.html',
        '<div ng-cloak\n' +
        '     class="gantt-task-info"\n' +
        '     ng-show="displayed"\n' +
        '     ng-class="isRightAligned ? \'gantt-task-infoArrowR\' : \'gantt-task-infoArrow\'"\n' +
        '     ng-style="{top: taskRect.top + \'px\', marginTop: -elementHeight - 8 + \'px\'}">\n' +
        '    <div class="gantt-task-info-content">\n' +
        '        <div gantt-bind-compile-html="pluginScope.content"></div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
}]);

angular.module('gantt.tree.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('plugins/tree/sideContentTree.tmpl.html',
        '<div class="gantt-side-content-tree" ng-controller="GanttTreeController">\n' +
        '    <gantt-tree-header>\n' +
        '    </gantt-tree-header>\n' +
        '    <gantt-tree-body>\n' +
        '    </gantt-tree-body>\n' +
        '</div>\n' +
        '');
    $templateCache.put('plugins/tree/treeBody.tmpl.html',
        '<div class="gantt-tree-body" ng-style="getLabelsCss()">\n' +
        '    <div gantt-vertical-scroll-receiver>\n' +
        '        <div class="gantt-row-label-background">\n' +
        '            <div class="gantt-row-label gantt-row-height"\n' +
        '                 ng-class="row.model.classes"\n' +
        '                 ng-style="{\'height\': row.model.height}"\n' +
        '                 ng-repeat="row in gantt.rowsManager.visibleRows track by row.model.id">\n' +
        '                &nbsp;\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div ui-tree ng-controller="GanttUiTreeController" data-drag-enabled="false" data-empty-place-holder-enabled="false">\n' +
        '            <ol class="gantt-tree-root" ui-tree-nodes ng-model="rootRows">\n' +
        '                <li ng-repeat="row in rootRows" ui-tree-node\n' +
        '                    ng-include="\'plugins/tree/treeBodyChildren.tmpl.html\'">\n' +
        '                </li>\n' +
        '            </ol>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
    $templateCache.put('plugins/tree/treeBodyChildren.tmpl.html',
        '<div ng-controller="GanttTreeNodeController"\n' +
        '     class="gantt-row-label gantt-row-height"\n' +
        '     ng-class="row.model.classes"\n' +
        '     ng-style="{\'height\': row.model.height}">\n' +
        '    <div class="gantt-valign-container">\n' +
        '        <div class="gantt-valign-content">\n' +
        '            <a ng-disabled="isCollapseDisabled()" data-nodrag\n' +
        '               class="gantt-tree-handle-button btn btn-xs"\n' +
        '               ng-class="{\'gantt-tree-collapsed\': collapsed, \'gantt-tree-expanded\': !collapsed}"\n' +
        '               ng-click="!isCollapseDisabled() && toggle()"><span\n' +
        '                class="gantt-tree-handle glyphicon glyphicon-chevron-down"\n' +
        '                ng-class="{\n' +
        '                \'glyphicon-chevron-right\': collapsed, \'glyphicon-chevron-down\': !collapsed,\n' +
        '                \'gantt-tree-collapsed\': collapsed, \'gantt-tree-expanded\': !collapsed}"></span>\n' +
        '            </a>\n' +
        '            <span gantt-row-label class="gantt-label-text" gantt-bind-compile-html="getRowContent()"/>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<ol ui-tree-nodes ng-class="{hidden: collapsed}" ng-model="childrenRows">\n' +
        '    <li ng-repeat="row in childrenRows" ui-tree-node>\n' +
        '        <div ng-include="\'plugins/tree/treeBodyChildren.tmpl.html\'"></div>\n' +
        '    </li>\n' +
        '</ol>\n' +
        '');
    $templateCache.put('plugins/tree/treeHeader.tmpl.html',
        '<div class="gantt-tree-header" ng-style="{height: $parent.ganttHeaderHeight + \'px\'}">\n' +
        '    <div ng-if="$parent.ganttHeaderHeight" class="gantt-row-label gantt-row-label-header gantt-tree-row gantt-tree-header-row"><span class="gantt-label-text" gantt-bind-compile-html="getHeaderContent()"/></div>\n' +
        '</div>\n' +
        '');
}]);

//# sourceMappingURL=angular-gantt-plugins.js.map
/**
 * angular-strap
 * @version v2.3.7 - 2016-01-16
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(window, document, undefined) {
  'use strict';
  bsCompilerService.$inject = [ '$q', '$http', '$injector', '$compile', '$controller', '$templateCache' ];
  angular.module('mgcrea.ngStrap.typeahead', [ 'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions' ]).provider('$typeahead', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'typeahead',
      prefixEvent: '$typeahead',
      placement: 'bottom-left',
      templateUrl: 'typeahead/typeahead.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      minLength: 1,
      filter: 'bsAsyncFilter',
      limit: 6,
      autoSelect: false,
      comparator: '',
      trimValue: true
    };
    this.$get = [ '$window', '$rootScope', '$tooltip', '$$rAF', '$timeout', function($window, $rootScope, $tooltip, $$rAF, $timeout) {
      function TypeaheadFactory(element, controller, config) {
        var $typeahead = {};
        var options = angular.extend({}, defaults, config);
        $typeahead = $tooltip(element, options);
        var parentScope = config.scope;
        var scope = $typeahead.$scope;
        scope.$resetMatches = function() {
          scope.$matches = [];
          scope.$activeIndex = options.autoSelect ? 0 : -1;
        };
        scope.$resetMatches();
        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $typeahead.activate(index);
          });
        };
        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $typeahead.select(index);
          });
        };
        scope.$isVisible = function() {
          return $typeahead.$isVisible();
        };
        $typeahead.update = function(matches) {
          scope.$matches = matches;
          if (scope.$activeIndex >= matches.length) {
            scope.$activeIndex = options.autoSelect ? 0 : -1;
          }
          safeDigest(scope);
          $$rAF($typeahead.$applyPlacement);
        };
        $typeahead.activate = function(index) {
          scope.$activeIndex = index;
        };
        $typeahead.select = function(index) {
          if (index === -1) return;
          var value = scope.$matches[index].value;
          controller.$setViewValue(value);
          controller.$render();
          scope.$resetMatches();
          if (parentScope) parentScope.$digest();
          scope.$emit(options.prefixEvent + '.select', value, index, $typeahead);
        };
        $typeahead.$isVisible = function() {
          if (!options.minLength || !controller) {
            return !!scope.$matches.length;
          }
          return scope.$matches.length && angular.isString(controller.$viewValue) && controller.$viewValue.length >= options.minLength;
        };
        $typeahead.$getIndex = function(value) {
          var index;
          for (index = scope.$matches.length; index--; ) {
            if (angular.equals(scope.$matches[index].value, value)) break;
          }
          return index;
        };
        $typeahead.$onMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
        };
        $typeahead.$onKeyDown = function(evt) {
          if (!/(38|40|13)/.test(evt.keyCode)) return;
          if ($typeahead.$isVisible() && !(evt.keyCode === 13 && scope.$activeIndex === -1)) {
            evt.preventDefault();
            evt.stopPropagation();
          }
          if (evt.keyCode === 13 && scope.$matches.length) {
            $typeahead.select(scope.$activeIndex);
          } else if (evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--; else if (evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++; else if (angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
          scope.$digest();
        };
        var show = $typeahead.show;
        $typeahead.show = function() {
          show();
          $timeout(function() {
            if ($typeahead.$element) {
              $typeahead.$element.on('mousedown', $typeahead.$onMouseDown);
              if (options.keyboard) {
                if (element) element.on('keydown', $typeahead.$onKeyDown);
              }
            }
          }, 0, false);
        };
        var hide = $typeahead.hide;
        $typeahead.hide = function() {
          if ($typeahead.$element) $typeahead.$element.off('mousedown', $typeahead.$onMouseDown);
          if (options.keyboard) {
            if (element) element.off('keydown', $typeahead.$onKeyDown);
          }
          if (!options.autoSelect) {
            $typeahead.activate(-1);
          }
          hide();
        };
        return $typeahead;
      }
      function safeDigest(scope) {
        scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
      }
      TypeaheadFactory.defaults = defaults;
      return TypeaheadFactory;
    } ];
  }).filter('bsAsyncFilter', [ '$filter', function($filter) {
    return function(array, expression, comparator) {
      if (array && angular.isFunction(array.then)) {
        return array.then(function(results) {
          return $filter('filter')(results, expression, comparator);
        });
      }
      return $filter('filter')(array, expression, comparator);
    };
  } ]).directive('bsTypeahead', [ '$window', '$parse', '$q', '$typeahead', '$parseOptions', function($window, $parse, $q, $typeahead, $parseOptions) {
    var defaults = $typeahead.defaults;
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'filter', 'limit', 'minLength', 'watchOptions', 'selectMode', 'autoSelect', 'comparator', 'id', 'prefixEvent', 'prefixClass' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'trimValue' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        if (!element.attr('autocomplete')) element.attr('autocomplete', 'off');
        var filter = options.filter || defaults.filter;
        var limit = options.limit || defaults.limit;
        var comparator = options.comparator || defaults.comparator;
        var bsOptions = attr.bsOptions;
        if (filter) bsOptions += ' | ' + filter + ':$viewValue';
        if (comparator) bsOptions += ':' + comparator;
        if (limit) bsOptions += ' | limitTo:' + limit;
        var parsedOptions = $parseOptions(bsOptions);
        var typeahead = $typeahead(element, controller, options);
        if (options.watchOptions) {
          var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').replace(/\(.*\)/g, '').trim();
          scope.$watchCollection(watchedOptions, function(newValue, oldValue) {
            parsedOptions.valuesFn(scope, controller).then(function(values) {
              typeahead.update(values);
              controller.$render();
            });
          });
        }
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          scope.$modelValue = newValue;
          parsedOptions.valuesFn(scope, controller).then(function(values) {
            if (options.selectMode && !values.length && newValue.length > 0) {
              controller.$setViewValue(controller.$viewValue.substring(0, controller.$viewValue.length - 1));
              return;
            }
            if (values.length > limit) values = values.slice(0, limit);
            typeahead.update(values);
            controller.$render();
          });
        });
        controller.$formatters.push(function(modelValue) {
          var displayValue = parsedOptions.displayValue(modelValue);
          if (displayValue) {
            return displayValue;
          }
          if (modelValue && typeof modelValue !== 'object') {
            return modelValue;
          }
          return '';
        });
        controller.$render = function() {
          if (controller.$isEmpty(controller.$viewValue)) {
            return element.val('');
          }
          var index = typeahead.$getIndex(controller.$modelValue);
          var selected = index !== -1 ? typeahead.$scope.$matches[index].label : controller.$viewValue;
          selected = angular.isObject(selected) ? parsedOptions.displayValue(selected) : selected;
          var value = selected ? selected.toString().replace(/<(?:.|\n)*?>/gm, '') : '';
          element.val(options.trimValue === false ? value : value.trim());
        };
        scope.$on('$destroy', function() {
          if (typeahead) typeahead.destroy();
          options = null;
          typeahead = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.tooltip', [ 'mgcrea.ngStrap.core', 'mgcrea.ngStrap.helpers.dimensions' ]).provider('$tooltip', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      customClass: '',
      prefixClass: 'tooltip',
      prefixEvent: 'tooltip',
      container: false,
      target: false,
      placement: 'top',
      templateUrl: 'tooltip/tooltip.tpl.html',
      template: '',
      contentTemplate: false,
      trigger: 'hover focus',
      keyboard: false,
      html: false,
      show: false,
      title: '',
      type: '',
      delay: 0,
      autoClose: false,
      bsEnabled: true,
      viewport: {
        selector: 'body',
        padding: 0
      }
    };
    this.$get = [ '$window', '$rootScope', '$bsCompiler', '$q', '$templateCache', '$http', '$animate', '$sce', 'dimensions', '$$rAF', '$timeout', function($window, $rootScope, $bsCompiler, $q, $templateCache, $http, $animate, $sce, dimensions, $$rAF, $timeout) {
      var isTouch = 'createTouch' in $window.document;
      var $body = angular.element($window.document);
      function TooltipFactory(element, config) {
        var $tooltip = {};
        var options = $tooltip.$options = angular.extend({}, defaults, config);
        var promise = $tooltip.$promise = $bsCompiler.compile(options);
        var scope = $tooltip.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        var nodeName = element[0].nodeName.toLowerCase();
        if (options.delay && angular.isString(options.delay)) {
          var split = options.delay.split(',').map(parseFloat);
          options.delay = split.length > 1 ? {
            show: split[0],
            hide: split[1]
          } : split[0];
        }
        $tooltip.$id = options.id || element.attr('id') || '';
        if (options.title) {
          scope.title = $sce.trustAsHtml(options.title);
        }
        scope.$setEnabled = function(isEnabled) {
          scope.$$postDigest(function() {
            $tooltip.setEnabled(isEnabled);
          });
        };
        scope.$hide = function() {
          scope.$$postDigest(function() {
            $tooltip.hide();
          });
        };
        scope.$show = function() {
          scope.$$postDigest(function() {
            $tooltip.show();
          });
        };
        scope.$toggle = function() {
          scope.$$postDigest(function() {
            $tooltip.toggle();
          });
        };
        $tooltip.$isShown = scope.$isShown = false;
        var timeout;
        var hoverState;
        var compileData;
        var tipElement;
        var tipContainer;
        var tipScope;
        promise.then(function(data) {
          compileData = data;
          $tooltip.init();
        });
        $tooltip.init = function() {
          if (options.delay && angular.isNumber(options.delay)) {
            options.delay = {
              show: options.delay,
              hide: options.delay
            };
          }
          if (options.container === 'self') {
            tipContainer = element;
          } else if (angular.isElement(options.container)) {
            tipContainer = options.container;
          } else if (options.container) {
            tipContainer = findElement(options.container);
          }
          bindTriggerEvents();
          if (options.target) {
            options.target = angular.isElement(options.target) ? options.target : findElement(options.target);
          }
          if (options.show) {
            scope.$$postDigest(function() {
              if (options.trigger === 'focus') {
                element[0].focus();
              } else {
                $tooltip.show();
              }
            });
          }
        };
        $tooltip.destroy = function() {
          unbindTriggerEvents();
          destroyTipElement();
          scope.$destroy();
        };
        $tooltip.enter = function() {
          clearTimeout(timeout);
          hoverState = 'in';
          if (!options.delay || !options.delay.show) {
            return $tooltip.show();
          }
          timeout = setTimeout(function() {
            if (hoverState === 'in') $tooltip.show();
          }, options.delay.show);
        };
        $tooltip.show = function() {
          if (!options.bsEnabled || $tooltip.$isShown) return;
          scope.$emit(options.prefixEvent + '.show.before', $tooltip);
          var parent;
          var after;
          if (options.container) {
            parent = tipContainer;
            if (tipContainer[0].lastChild) {
              after = angular.element(tipContainer[0].lastChild);
            } else {
              after = null;
            }
          } else {
            parent = null;
            after = element;
          }
          if (tipElement) destroyTipElement();
          tipScope = $tooltip.$scope.$new();
          tipElement = $tooltip.$element = compileData.link(tipScope, function(clonedElement, scope) {});
          tipElement.css({
            top: '-9999px',
            left: '-9999px',
            right: 'auto',
            display: 'block',
            visibility: 'hidden'
          });
          if (options.animation) tipElement.addClass(options.animation);
          if (options.type) tipElement.addClass(options.prefixClass + '-' + options.type);
          if (options.customClass) tipElement.addClass(options.customClass);
          if (after) {
            after.after(tipElement);
          } else {
            parent.prepend(tipElement);
          }
          $tooltip.$isShown = scope.$isShown = true;
          safeDigest(scope);
          $tooltip.$applyPlacement();
          if (angular.version.minor <= 2) {
            $animate.enter(tipElement, parent, after, enterAnimateCallback);
          } else {
            $animate.enter(tipElement, parent, after).then(enterAnimateCallback);
          }
          safeDigest(scope);
          $$rAF(function() {
            if (tipElement) tipElement.css({
              visibility: 'visible'
            });
            if (options.keyboard) {
              if (options.trigger !== 'focus') {
                $tooltip.focus();
              }
              bindKeyboardEvents();
            }
          });
          if (options.autoClose) {
            bindAutoCloseEvents();
          }
        };
        function enterAnimateCallback() {
          scope.$emit(options.prefixEvent + '.show', $tooltip);
        }
        $tooltip.leave = function() {
          clearTimeout(timeout);
          hoverState = 'out';
          if (!options.delay || !options.delay.hide) {
            return $tooltip.hide();
          }
          timeout = setTimeout(function() {
            if (hoverState === 'out') {
              $tooltip.hide();
            }
          }, options.delay.hide);
        };
        var _blur;
        var _tipToHide;
        $tooltip.hide = function(blur) {
          if (!$tooltip.$isShown) return;
          scope.$emit(options.prefixEvent + '.hide.before', $tooltip);
          _blur = blur;
          _tipToHide = tipElement;
          if (angular.version.minor <= 2) {
            $animate.leave(tipElement, leaveAnimateCallback);
          } else {
            $animate.leave(tipElement).then(leaveAnimateCallback);
          }
          $tooltip.$isShown = scope.$isShown = false;
          safeDigest(scope);
          if (options.keyboard && tipElement !== null) {
            unbindKeyboardEvents();
          }
          if (options.autoClose && tipElement !== null) {
            unbindAutoCloseEvents();
          }
        };
        function leaveAnimateCallback() {
          scope.$emit(options.prefixEvent + '.hide', $tooltip);
          if (tipElement === _tipToHide) {
            if (_blur && options.trigger === 'focus') {
              return element[0].blur();
            }
            destroyTipElement();
          }
        }
        $tooltip.toggle = function() {
          if ($tooltip.$isShown) {
            $tooltip.leave();
          } else {
            $tooltip.enter();
          }
        };
        $tooltip.focus = function() {
          tipElement[0].focus();
        };
        $tooltip.setEnabled = function(isEnabled) {
          options.bsEnabled = isEnabled;
        };
        $tooltip.setViewport = function(viewport) {
          options.viewport = viewport;
        };
        $tooltip.$applyPlacement = function() {
          if (!tipElement) return;
          var placement = options.placement;
          var autoToken = /\s?auto?\s?/i;
          var autoPlace = autoToken.test(placement);
          if (autoPlace) {
            placement = placement.replace(autoToken, '') || defaults.placement;
          }
          tipElement.addClass(options.placement);
          var elementPosition = getPosition();
          var tipWidth = tipElement.prop('offsetWidth');
          var tipHeight = tipElement.prop('offsetHeight');
          $tooltip.$viewport = options.viewport && findElement(options.viewport.selector || options.viewport);
          if (autoPlace) {
            var originalPlacement = placement;
            var viewportPosition = getPosition($tooltip.$viewport);
            if (/bottom/.test(originalPlacement) && elementPosition.bottom + tipHeight > viewportPosition.bottom) {
              placement = originalPlacement.replace('bottom', 'top');
            } else if (/top/.test(originalPlacement) && elementPosition.top - tipHeight < viewportPosition.top) {
              placement = originalPlacement.replace('top', 'bottom');
            }
            if (/left/.test(originalPlacement) && elementPosition.left - tipWidth < viewportPosition.left) {
              placement = placement.replace('left', 'right');
            } else if (/right/.test(originalPlacement) && elementPosition.right + tipWidth > viewportPosition.width) {
              placement = placement.replace('right', 'left');
            }
            tipElement.removeClass(originalPlacement).addClass(placement);
          }
          var tipPosition = getCalculatedOffset(placement, elementPosition, tipWidth, tipHeight);
          applyPlacement(tipPosition, placement);
        };
        $tooltip.$onKeyUp = function(evt) {
          if (evt.which === 27 && $tooltip.$isShown) {
            $tooltip.hide();
            evt.stopPropagation();
          }
        };
        $tooltip.$onFocusKeyUp = function(evt) {
          if (evt.which === 27) {
            element[0].blur();
            evt.stopPropagation();
          }
        };
        $tooltip.$onFocusElementMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          if ($tooltip.$isShown) {
            element[0].blur();
          } else {
            element[0].focus();
          }
        };
        function bindTriggerEvents() {
          var triggers = options.trigger.split(' ');
          angular.forEach(triggers, function(trigger) {
            if (trigger === 'click') {
              element.on('click', $tooltip.toggle);
            } else if (trigger !== 'manual') {
              element.on(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
              element.on(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
              if (nodeName === 'button' && trigger !== 'hover') {
                element.on(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
              }
            }
          });
        }
        function unbindTriggerEvents() {
          var triggers = options.trigger.split(' ');
          for (var i = triggers.length; i--; ) {
            var trigger = triggers[i];
            if (trigger === 'click') {
              element.off('click', $tooltip.toggle);
            } else if (trigger !== 'manual') {
              element.off(trigger === 'hover' ? 'mouseenter' : 'focus', $tooltip.enter);
              element.off(trigger === 'hover' ? 'mouseleave' : 'blur', $tooltip.leave);
              if (nodeName === 'button' && trigger !== 'hover') {
                element.off(isTouch ? 'touchstart' : 'mousedown', $tooltip.$onFocusElementMouseDown);
              }
            }
          }
        }
        function bindKeyboardEvents() {
          if (options.trigger !== 'focus') {
            tipElement.on('keyup', $tooltip.$onKeyUp);
          } else {
            element.on('keyup', $tooltip.$onFocusKeyUp);
          }
        }
        function unbindKeyboardEvents() {
          if (options.trigger !== 'focus') {
            tipElement.off('keyup', $tooltip.$onKeyUp);
          } else {
            element.off('keyup', $tooltip.$onFocusKeyUp);
          }
        }
        var _autoCloseEventsBinded = false;
        function bindAutoCloseEvents() {
          $timeout(function() {
            tipElement.on('click', stopEventPropagation);
            $body.on('click', $tooltip.hide);
            _autoCloseEventsBinded = true;
          }, 0, false);
        }
        function unbindAutoCloseEvents() {
          if (_autoCloseEventsBinded) {
            tipElement.off('click', stopEventPropagation);
            $body.off('click', $tooltip.hide);
            _autoCloseEventsBinded = false;
          }
        }
        function stopEventPropagation(event) {
          event.stopPropagation();
        }
        function getPosition($element) {
          $element = $element || (options.target || element);
          var el = $element[0];
          var isBody = el.tagName === 'BODY';
          var elRect = el.getBoundingClientRect();
          var rect = {};
          for (var p in elRect) {
            rect[p] = elRect[p];
          }
          if (rect.width === null) {
            rect = angular.extend({}, rect, {
              width: elRect.right - elRect.left,
              height: elRect.bottom - elRect.top
            });
          }
          var elOffset = isBody ? {
            top: 0,
            left: 0
          } : dimensions.offset(el);
          var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.prop('scrollTop') || 0
          };
          var outerDims = isBody ? {
            width: document.documentElement.clientWidth,
            height: $window.innerHeight
          } : null;
          return angular.extend({}, rect, scroll, outerDims, elOffset);
        }
        function getCalculatedOffset(placement, position, actualWidth, actualHeight) {
          var offset;
          var split = placement.split('-');
          switch (split[0]) {
           case 'right':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left + position.width
            };
            break;

           case 'bottom':
            offset = {
              top: position.top + position.height,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;

           case 'left':
            offset = {
              top: position.top + position.height / 2 - actualHeight / 2,
              left: position.left - actualWidth
            };
            break;

           default:
            offset = {
              top: position.top - actualHeight,
              left: position.left + position.width / 2 - actualWidth / 2
            };
            break;
          }
          if (!split[1]) {
            return offset;
          }
          if (split[0] === 'top' || split[0] === 'bottom') {
            switch (split[1]) {
             case 'left':
              offset.left = position.left;
              break;

             case 'right':
              offset.left = position.left + position.width - actualWidth;
              break;

             default:
              break;
            }
          } else if (split[0] === 'left' || split[0] === 'right') {
            switch (split[1]) {
             case 'top':
              offset.top = position.top - actualHeight + position.height;
              break;

             case 'bottom':
              offset.top = position.top;
              break;

             default:
              break;
            }
          }
          return offset;
        }
        function applyPlacement(offset, placement) {
          var tip = tipElement[0];
          var width = tip.offsetWidth;
          var height = tip.offsetHeight;
          var marginTop = parseInt(dimensions.css(tip, 'margin-top'), 10);
          var marginLeft = parseInt(dimensions.css(tip, 'margin-left'), 10);
          if (isNaN(marginTop)) marginTop = 0;
          if (isNaN(marginLeft)) marginLeft = 0;
          offset.top = offset.top + marginTop;
          offset.left = offset.left + marginLeft;
          dimensions.setOffset(tip, angular.extend({
            using: function(props) {
              tipElement.css({
                top: Math.round(props.top) + 'px',
                left: Math.round(props.left) + 'px',
                right: ''
              });
            }
          }, offset), 0);
          var actualWidth = tip.offsetWidth;
          var actualHeight = tip.offsetHeight;
          if (placement === 'top' && actualHeight !== height) {
            offset.top = offset.top + height - actualHeight;
          }
          if (/top-left|top-right|bottom-left|bottom-right/.test(placement)) return;
          var delta = getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);
          if (delta.left) {
            offset.left += delta.left;
          } else {
            offset.top += delta.top;
          }
          dimensions.setOffset(tip, offset);
          if (/top|right|bottom|left/.test(placement)) {
            var isVertical = /top|bottom/.test(placement);
            var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
            var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';
            replaceArrow(arrowDelta, tip[arrowOffsetPosition], isVertical);
          }
        }
        function getViewportAdjustedDelta(placement, position, actualWidth, actualHeight) {
          var delta = {
            top: 0,
            left: 0
          };
          if (!$tooltip.$viewport) return delta;
          var viewportPadding = options.viewport && options.viewport.padding || 0;
          var viewportDimensions = getPosition($tooltip.$viewport);
          if (/right|left/.test(placement)) {
            var topEdgeOffset = position.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = position.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) {
              delta.top = viewportDimensions.top - topEdgeOffset;
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
              delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
          } else {
            var leftEdgeOffset = position.left - viewportPadding;
            var rightEdgeOffset = position.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) {
              delta.left = viewportDimensions.left - leftEdgeOffset;
            } else if (rightEdgeOffset > viewportDimensions.right) {
              delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
          }
          return delta;
        }
        function replaceArrow(delta, dimension, isHorizontal) {
          var $arrow = findElement('.tooltip-arrow, .arrow', tipElement[0]);
          $arrow.css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isHorizontal ? 'top' : 'left', '');
        }
        function destroyTipElement() {
          clearTimeout(timeout);
          if ($tooltip.$isShown && tipElement !== null) {
            if (options.autoClose) {
              unbindAutoCloseEvents();
            }
            if (options.keyboard) {
              unbindKeyboardEvents();
            }
          }
          if (tipScope) {
            tipScope.$destroy();
            tipScope = null;
          }
          if (tipElement) {
            tipElement.remove();
            tipElement = $tooltip.$element = null;
          }
        }
        return $tooltip;
      }
      function safeDigest(scope) {
        scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
      }
      function findElement(query, element) {
        return angular.element((element || document).querySelectorAll(query));
      }
      return TooltipFactory;
    } ];
  }).directive('bsTooltip', [ '$window', '$location', '$sce', '$tooltip', '$$rAF', function($window, $location, $sce, $tooltip, $$rAF) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        var tooltip;
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'backdropAnimation', 'type', 'customClass', 'id' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
            options[key] = false;
          }
        });
        var dataTarget = element.attr('data-target');
        if (angular.isDefined(dataTarget)) {
          if (falseValueRegExp.test(dataTarget)) {
            options.target = false;
          } else {
            options.target = dataTarget;
          }
        }
        if (!scope.hasOwnProperty('title')) {
          scope.title = '';
        }
        attr.$observe('title', function(newValue) {
          if (angular.isDefined(newValue) || !scope.hasOwnProperty('title')) {
            var oldValue = scope.title;
            scope.title = $sce.trustAsHtml(newValue);
            if (angular.isDefined(oldValue)) {
              $$rAF(function() {
                if (tooltip) tooltip.$applyPlacement();
              });
            }
          }
        });
        if (attr.bsTooltip) {
          scope.$watch(attr.bsTooltip, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.title = newValue;
            }
            if (angular.isDefined(oldValue)) {
              $$rAF(function() {
                if (tooltip) tooltip.$applyPlacement();
              });
            }
          }, true);
        }
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function(newValue, oldValue) {
            if (!tooltip || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(tooltip),?/i);
            if (newValue === true) {
              tooltip.show();
            } else {
              tooltip.hide();
            }
          });
        }
        if (attr.bsEnabled) {
          scope.$watch(attr.bsEnabled, function(newValue, oldValue) {
            if (!tooltip || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|1|,?(tooltip),?/i);
            if (newValue === false) {
              tooltip.setEnabled(false);
            } else {
              tooltip.setEnabled(true);
            }
          });
        }
        if (attr.viewport) {
          scope.$watch(attr.viewport, function(newValue) {
            if (!tooltip || !angular.isDefined(newValue)) return;
            tooltip.setViewport(newValue);
          });
        }
        tooltip = $tooltip(element, options);
        scope.$on('$destroy', function() {
          if (tooltip) tooltip.destroy();
          options = null;
          tooltip = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.timepicker', [ 'mgcrea.ngStrap.helpers.dateParser', 'mgcrea.ngStrap.helpers.dateFormatter', 'mgcrea.ngStrap.tooltip' ]).provider('$timepicker', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'timepicker',
      placement: 'bottom-left',
      templateUrl: 'timepicker/timepicker.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      useNative: true,
      timeType: 'date',
      timeFormat: 'shortTime',
      timezone: null,
      modelTimeFormat: null,
      autoclose: false,
      minTime: -Infinity,
      maxTime: +Infinity,
      length: 5,
      hourStep: 1,
      minuteStep: 5,
      secondStep: 5,
      roundDisplay: false,
      iconUp: 'glyphicon glyphicon-chevron-up',
      iconDown: 'glyphicon glyphicon-chevron-down',
      arrowBehavior: 'pager'
    };
    this.$get = [ '$window', '$document', '$rootScope', '$sce', '$dateFormatter', '$tooltip', '$timeout', function($window, $document, $rootScope, $sce, $dateFormatter, $tooltip, $timeout) {
      var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
      var isTouch = 'createTouch' in $window.document && isNative;
      if (!defaults.lang) {
        defaults.lang = $dateFormatter.getDefaultLocale();
      }
      function timepickerFactory(element, controller, config) {
        var $timepicker = $tooltip(element, angular.extend({}, defaults, config));
        var parentScope = config.scope;
        var options = $timepicker.$options;
        var scope = $timepicker.$scope;
        var lang = options.lang;
        var formatDate = function(date, format, timezone) {
          return $dateFormatter.formatDate(date, format, lang, timezone);
        };
        function floorMinutes(time) {
          var coeff = 1e3 * 60 * options.minuteStep;
          return new Date(Math.floor(time.getTime() / coeff) * coeff);
        }
        var selectedIndex = 0;
        var defaultDate = options.roundDisplay ? floorMinutes(new Date()) : new Date();
        var startDate = controller.$dateValue || defaultDate;
        var viewDate = {
          hour: startDate.getHours(),
          meridian: startDate.getHours() < 12,
          minute: startDate.getMinutes(),
          second: startDate.getSeconds(),
          millisecond: startDate.getMilliseconds()
        };
        var format = $dateFormatter.getDatetimeFormat(options.timeFormat, lang);
        var hoursFormat = $dateFormatter.hoursFormat(format);
        var timeSeparator = $dateFormatter.timeSeparator(format);
        var minutesFormat = $dateFormatter.minutesFormat(format);
        var secondsFormat = $dateFormatter.secondsFormat(format);
        var showSeconds = $dateFormatter.showSeconds(format);
        var showAM = $dateFormatter.showAM(format);
        scope.$iconUp = options.iconUp;
        scope.$iconDown = options.iconDown;
        scope.$select = function(date, index) {
          $timepicker.select(date, index);
        };
        scope.$moveIndex = function(value, index) {
          $timepicker.$moveIndex(value, index);
        };
        scope.$switchMeridian = function(date) {
          $timepicker.switchMeridian(date);
        };
        $timepicker.update = function(date) {
          if (angular.isDate(date) && !isNaN(date.getTime())) {
            $timepicker.$date = date;
            angular.extend(viewDate, {
              hour: date.getHours(),
              minute: date.getMinutes(),
              second: date.getSeconds(),
              millisecond: date.getMilliseconds()
            });
            $timepicker.$build();
          } else if (!$timepicker.$isBuilt) {
            $timepicker.$build();
          }
        };
        $timepicker.select = function(date, index, keep) {
          if (!controller.$dateValue || isNaN(controller.$dateValue.getTime())) controller.$dateValue = new Date(1970, 0, 1);
          if (!angular.isDate(date)) date = new Date(date);
          if (index === 0) controller.$dateValue.setHours(date.getHours()); else if (index === 1) controller.$dateValue.setMinutes(date.getMinutes()); else if (index === 2) controller.$dateValue.setSeconds(date.getSeconds());
          controller.$setViewValue(angular.copy(controller.$dateValue));
          controller.$render();
          if (options.autoclose && !keep) {
            $timeout(function() {
              $timepicker.hide(true);
            });
          }
        };
        $timepicker.switchMeridian = function(date) {
          if (!controller.$dateValue || isNaN(controller.$dateValue.getTime())) {
            return;
          }
          var hours = (date || controller.$dateValue).getHours();
          controller.$dateValue.setHours(hours < 12 ? hours + 12 : hours - 12);
          controller.$setViewValue(angular.copy(controller.$dateValue));
          controller.$render();
        };
        $timepicker.$build = function() {
          var i;
          var midIndex = scope.midIndex = parseInt(options.length / 2, 10);
          var hours = [];
          var hour;
          for (i = 0; i < options.length; i++) {
            hour = new Date(1970, 0, 1, viewDate.hour - (midIndex - i) * options.hourStep);
            hours.push({
              date: hour,
              label: formatDate(hour, hoursFormat),
              selected: $timepicker.$date && $timepicker.$isSelected(hour, 0),
              disabled: $timepicker.$isDisabled(hour, 0)
            });
          }
          var minutes = [];
          var minute;
          for (i = 0; i < options.length; i++) {
            minute = new Date(1970, 0, 1, 0, viewDate.minute - (midIndex - i) * options.minuteStep);
            minutes.push({
              date: minute,
              label: formatDate(minute, minutesFormat),
              selected: $timepicker.$date && $timepicker.$isSelected(minute, 1),
              disabled: $timepicker.$isDisabled(minute, 1)
            });
          }
          var seconds = [];
          var second;
          for (i = 0; i < options.length; i++) {
            second = new Date(1970, 0, 1, 0, 0, viewDate.second - (midIndex - i) * options.secondStep);
            seconds.push({
              date: second,
              label: formatDate(second, secondsFormat),
              selected: $timepicker.$date && $timepicker.$isSelected(second, 2),
              disabled: $timepicker.$isDisabled(second, 2)
            });
          }
          var rows = [];
          for (i = 0; i < options.length; i++) {
            if (showSeconds) {
              rows.push([ hours[i], minutes[i], seconds[i] ]);
            } else {
              rows.push([ hours[i], minutes[i] ]);
            }
          }
          scope.rows = rows;
          scope.showSeconds = showSeconds;
          scope.showAM = showAM;
          scope.isAM = ($timepicker.$date || hours[midIndex].date).getHours() < 12;
          scope.timeSeparator = timeSeparator;
          $timepicker.$isBuilt = true;
        };
        $timepicker.$isSelected = function(date, index) {
          if (!$timepicker.$date) return false; else if (index === 0) {
            return date.getHours() === $timepicker.$date.getHours();
          } else if (index === 1) {
            return date.getMinutes() === $timepicker.$date.getMinutes();
          } else if (index === 2) {
            return date.getSeconds() === $timepicker.$date.getSeconds();
          }
        };
        $timepicker.$isDisabled = function(date, index) {
          var selectedTime;
          if (index === 0) {
            selectedTime = date.getTime() + viewDate.minute * 6e4 + viewDate.second * 1e3;
          } else if (index === 1) {
            selectedTime = date.getTime() + viewDate.hour * 36e5 + viewDate.second * 1e3;
          } else if (index === 2) {
            selectedTime = date.getTime() + viewDate.hour * 36e5 + viewDate.minute * 6e4;
          }
          return selectedTime < options.minTime * 1 || selectedTime > options.maxTime * 1;
        };
        scope.$arrowAction = function(value, index) {
          if (options.arrowBehavior === 'picker') {
            $timepicker.$setTimeByStep(value, index);
          } else {
            $timepicker.$moveIndex(value, index);
          }
        };
        $timepicker.$setTimeByStep = function(value, index) {
          var newDate = new Date($timepicker.$date || startDate);
          var hours = newDate.getHours();
          var minutes = newDate.getMinutes();
          var seconds = newDate.getSeconds();
          if (index === 0) {
            newDate.setHours(hours - parseInt(options.hourStep, 10) * value);
          } else if (index === 1) {
            newDate.setMinutes(minutes - parseInt(options.minuteStep, 10) * value);
          } else if (index === 2) {
            newDate.setSeconds(seconds - parseInt(options.secondStep, 10) * value);
          }
          $timepicker.select(newDate, index, true);
        };
        $timepicker.$moveIndex = function(value, index) {
          var targetDate;
          if (index === 0) {
            targetDate = new Date(1970, 0, 1, viewDate.hour + value * options.length, viewDate.minute, viewDate.second);
            angular.extend(viewDate, {
              hour: targetDate.getHours()
            });
          } else if (index === 1) {
            targetDate = new Date(1970, 0, 1, viewDate.hour, viewDate.minute + value * options.length * options.minuteStep, viewDate.second);
            angular.extend(viewDate, {
              minute: targetDate.getMinutes()
            });
          } else if (index === 2) {
            targetDate = new Date(1970, 0, 1, viewDate.hour, viewDate.minute, viewDate.second + value * options.length * options.secondStep);
            angular.extend(viewDate, {
              second: targetDate.getSeconds()
            });
          }
          $timepicker.$build();
        };
        $timepicker.$onMouseDown = function(evt) {
          if (evt.target.nodeName.toLowerCase() !== 'input') evt.preventDefault();
          evt.stopPropagation();
          if (isTouch) {
            var targetEl = angular.element(evt.target);
            if (targetEl[0].nodeName.toLowerCase() !== 'button') {
              targetEl = targetEl.parent();
            }
            targetEl.triggerHandler('click');
          }
        };
        $timepicker.$onKeyDown = function(evt) {
          if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
          evt.preventDefault();
          evt.stopPropagation();
          if (evt.keyCode === 13) {
            $timepicker.hide(true);
            return;
          }
          var newDate = new Date($timepicker.$date);
          var hours = newDate.getHours();
          var hoursLength = formatDate(newDate, hoursFormat).length;
          var minutes = newDate.getMinutes();
          var minutesLength = formatDate(newDate, minutesFormat).length;
          var seconds = newDate.getSeconds();
          var secondsLength = formatDate(newDate, secondsFormat).length;
          var sepLength = 1;
          var lateralMove = /(37|39)/.test(evt.keyCode);
          var count = 2 + showSeconds * 1 + showAM * 1;
          if (lateralMove) {
            if (evt.keyCode === 37) selectedIndex = selectedIndex < 1 ? count - 1 : selectedIndex - 1; else if (evt.keyCode === 39) selectedIndex = selectedIndex < count - 1 ? selectedIndex + 1 : 0;
          }
          var selectRange = [ 0, hoursLength ];
          var incr = 0;
          if (evt.keyCode === 38) incr = -1;
          if (evt.keyCode === 40) incr = +1;
          var isSeconds = selectedIndex === 2 && showSeconds;
          var isMeridian = selectedIndex === 2 && !showSeconds || selectedIndex === 3 && showSeconds;
          if (selectedIndex === 0) {
            newDate.setHours(hours + incr * parseInt(options.hourStep, 10));
            hoursLength = formatDate(newDate, hoursFormat).length;
            selectRange = [ 0, hoursLength ];
          } else if (selectedIndex === 1) {
            newDate.setMinutes(minutes + incr * parseInt(options.minuteStep, 10));
            minutesLength = formatDate(newDate, minutesFormat).length;
            selectRange = [ hoursLength + sepLength, minutesLength ];
          } else if (isSeconds) {
            newDate.setSeconds(seconds + incr * parseInt(options.secondStep, 10));
            secondsLength = formatDate(newDate, secondsFormat).length;
            selectRange = [ hoursLength + sepLength + minutesLength + sepLength, secondsLength ];
          } else if (isMeridian) {
            if (!lateralMove) $timepicker.switchMeridian();
            selectRange = [ hoursLength + sepLength + minutesLength + sepLength + (secondsLength + sepLength) * showSeconds, 2 ];
          }
          $timepicker.select(newDate, selectedIndex, true);
          createSelection(selectRange[0], selectRange[1]);
          parentScope.$digest();
        };
        function createSelection(start, length) {
          var end = start + length;
          if (element[0].createTextRange) {
            var selRange = element[0].createTextRange();
            selRange.collapse(true);
            selRange.moveStart('character', start);
            selRange.moveEnd('character', end);
            selRange.select();
          } else if (element[0].setSelectionRange) {
            element[0].setSelectionRange(start, end);
          } else if (angular.isUndefined(element[0].selectionStart)) {
            element[0].selectionStart = start;
            element[0].selectionEnd = end;
          }
        }
        function focusElement() {
          element[0].focus();
        }
        var _init = $timepicker.init;
        $timepicker.init = function() {
          if (isNative && options.useNative) {
            element.prop('type', 'time');
            element.css('-webkit-appearance', 'textfield');
            return;
          } else if (isTouch) {
            element.prop('type', 'text');
            element.attr('readonly', 'true');
            element.on('click', focusElement);
          }
          _init();
        };
        var _destroy = $timepicker.destroy;
        $timepicker.destroy = function() {
          if (isNative && options.useNative) {
            element.off('click', focusElement);
          }
          _destroy();
        };
        var _show = $timepicker.show;
        $timepicker.show = function() {
          if (!isTouch && element.attr('readonly') || element.attr('disabled')) return;
          _show();
          $timeout(function() {
            if ($timepicker.$element) $timepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $timepicker.$onMouseDown);
            if (options.keyboard) {
              if (element) element.on('keydown', $timepicker.$onKeyDown);
            }
          }, 0, false);
        };
        var _hide = $timepicker.hide;
        $timepicker.hide = function(blur) {
          if (!$timepicker.$isShown) return;
          if ($timepicker.$element) $timepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $timepicker.$onMouseDown);
          if (options.keyboard) {
            if (element) element.off('keydown', $timepicker.$onKeyDown);
          }
          _hide(blur);
        };
        return $timepicker;
      }
      timepickerFactory.defaults = defaults;
      return timepickerFactory;
    } ];
  }).directive('bsTimepicker', [ '$window', '$parse', '$q', '$dateFormatter', '$dateParser', '$timepicker', function($window, $parse, $q, $dateFormatter, $dateParser, $timepicker) {
    var defaults = $timepicker.defaults;
    var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'autoclose', 'timeType', 'timeFormat', 'timezone', 'modelTimeFormat', 'useNative', 'hourStep', 'minuteStep', 'secondStep', 'length', 'arrowBehavior', 'iconUp', 'iconDown', 'roundDisplay', 'id', 'prefixClass', 'prefixEvent' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'autoclose', 'useNative', 'roundDisplay' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
            options[key] = false;
          }
        });
        if (isNative && (options.useNative || defaults.useNative)) options.timeFormat = 'HH:mm';
        var timepicker = $timepicker(element, controller, options);
        options = timepicker.$options;
        var lang = options.lang;
        var formatDate = function(date, format, timezone) {
          return $dateFormatter.formatDate(date, format, lang, timezone);
        };
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function(newValue, oldValue) {
            if (!timepicker || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(timepicker),?/i);
            if (newValue === true) {
              timepicker.show();
            } else {
              timepicker.hide();
            }
          });
        }
        var dateParser = $dateParser({
          format: options.timeFormat,
          lang: lang
        });
        angular.forEach([ 'minTime', 'maxTime' ], function(key) {
          if (angular.isDefined(attr[key])) {
            attr.$observe(key, function(newValue) {
              timepicker.$options[key] = dateParser.getTimeForAttribute(key, newValue);
              if (!isNaN(timepicker.$options[key])) timepicker.$build();
              validateAgainstMinMaxTime(controller.$dateValue);
            });
          }
        });
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          timepicker.update(controller.$dateValue);
        }, true);
        function validateAgainstMinMaxTime(parsedTime) {
          if (!angular.isDate(parsedTime)) return;
          var isMinValid = isNaN(options.minTime) || new Date(parsedTime.getTime()).setFullYear(1970, 0, 1) >= options.minTime;
          var isMaxValid = isNaN(options.maxTime) || new Date(parsedTime.getTime()).setFullYear(1970, 0, 1) <= options.maxTime;
          var isValid = isMinValid && isMaxValid;
          controller.$setValidity('date', isValid);
          controller.$setValidity('min', isMinValid);
          controller.$setValidity('max', isMaxValid);
          if (!isValid) {
            return;
          }
          controller.$dateValue = parsedTime;
        }
        controller.$parsers.unshift(function(viewValue) {
          var date;
          if (!viewValue) {
            controller.$setValidity('date', true);
            return null;
          }
          var parsedTime = angular.isDate(viewValue) ? viewValue : dateParser.parse(viewValue, controller.$dateValue);
          if (!parsedTime || isNaN(parsedTime.getTime())) {
            controller.$setValidity('date', false);
            return undefined;
          }
          validateAgainstMinMaxTime(parsedTime);
          if (options.timeType === 'string') {
            date = dateParser.timezoneOffsetAdjust(parsedTime, options.timezone, true);
            return formatDate(date, options.modelTimeFormat || options.timeFormat);
          }
          date = dateParser.timezoneOffsetAdjust(controller.$dateValue, options.timezone, true);
          if (options.timeType === 'number') {
            return date.getTime();
          } else if (options.timeType === 'unix') {
            return date.getTime() / 1e3;
          } else if (options.timeType === 'iso') {
            return date.toISOString();
          }
          return new Date(date);
        });
        controller.$formatters.push(function(modelValue) {
          var date;
          if (angular.isUndefined(modelValue) || modelValue === null) {
            date = NaN;
          } else if (angular.isDate(modelValue)) {
            date = modelValue;
          } else if (options.timeType === 'string') {
            date = dateParser.parse(modelValue, null, options.modelTimeFormat);
          } else if (options.timeType === 'unix') {
            date = new Date(modelValue * 1e3);
          } else {
            date = new Date(modelValue);
          }
          controller.$dateValue = dateParser.timezoneOffsetAdjust(date, options.timezone);
          return getTimeFormattedString();
        });
        controller.$render = function() {
          element.val(getTimeFormattedString());
        };
        function getTimeFormattedString() {
          return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.timeFormat);
        }
        scope.$on('$destroy', function() {
          if (timepicker) timepicker.destroy();
          options = null;
          timepicker = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.tab', []).provider('$tab', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      template: 'tab/tab.tpl.html',
      navClass: 'nav-tabs',
      activeClass: 'active'
    };
    var controller = this.controller = function($scope, $element, $attrs) {
      var self = this;
      self.$options = angular.copy(defaults);
      angular.forEach([ 'animation', 'navClass', 'activeClass' ], function(key) {
        if (angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });
      $scope.$navClass = self.$options.navClass;
      $scope.$activeClass = self.$options.activeClass;
      self.$panes = $scope.$panes = [];
      self.$activePaneChangeListeners = self.$viewChangeListeners = [];
      self.$push = function(pane) {
        if (angular.isUndefined(self.$panes.$active)) {
          $scope.$setActive(pane.name || 0);
        }
        self.$panes.push(pane);
      };
      self.$remove = function(pane) {
        var index = self.$panes.indexOf(pane);
        var active = self.$panes.$active;
        var activeIndex;
        if (angular.isString(active)) {
          activeIndex = self.$panes.map(function(pane) {
            return pane.name;
          }).indexOf(active);
        } else {
          activeIndex = self.$panes.$active;
        }
        self.$panes.splice(index, 1);
        if (index < activeIndex) {
          activeIndex--;
        } else if (index === activeIndex && activeIndex === self.$panes.length) {
          activeIndex--;
        }
        if (activeIndex >= 0 && activeIndex < self.$panes.length) {
          self.$setActive(self.$panes[activeIndex].name || activeIndex);
        } else {
          self.$setActive();
        }
      };
      self.$setActive = $scope.$setActive = function(value) {
        self.$panes.$active = value;
        self.$activePaneChangeListeners.forEach(function(fn) {
          fn();
        });
      };
      self.$isActive = $scope.$isActive = function($pane, $index) {
        return self.$panes.$active === $pane.name || self.$panes.$active === $index;
      };
    };
    this.$get = function() {
      var $tab = {};
      $tab.defaults = defaults;
      $tab.controller = controller;
      return $tab;
    };
  }).directive('bsTabs', [ '$window', '$animate', '$tab', '$parse', function($window, $animate, $tab, $parse) {
    var defaults = $tab.defaults;
    return {
      require: [ '?ngModel', 'bsTabs' ],
      transclude: true,
      scope: true,
      controller: [ '$scope', '$element', '$attrs', $tab.controller ],
      templateUrl: function(element, attr) {
        return attr.template || defaults.template;
      },
      link: function postLink(scope, element, attrs, controllers) {
        var ngModelCtrl = controllers[0];
        var bsTabsCtrl = controllers[1];
        if (ngModelCtrl) {
          bsTabsCtrl.$activePaneChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(bsTabsCtrl.$panes.$active);
          });
          ngModelCtrl.$formatters.push(function(modelValue) {
            bsTabsCtrl.$setActive(modelValue);
            return modelValue;
          });
        }
        if (attrs.bsActivePane) {
          var parsedBsActivePane = $parse(attrs.bsActivePane);
          bsTabsCtrl.$activePaneChangeListeners.push(function() {
            parsedBsActivePane.assign(scope, bsTabsCtrl.$panes.$active);
          });
          scope.$watch(attrs.bsActivePane, function(newValue, oldValue) {
            bsTabsCtrl.$setActive(newValue);
          }, true);
        }
      }
    };
  } ]).directive('bsPane', [ '$window', '$animate', '$sce', function($window, $animate, $sce) {
    return {
      require: [ '^?ngModel', '^bsTabs' ],
      scope: true,
      link: function postLink(scope, element, attrs, controllers) {
        var bsTabsCtrl = controllers[1];
        element.addClass('tab-pane');
        attrs.$observe('title', function(newValue, oldValue) {
          scope.title = $sce.trustAsHtml(newValue);
        });
        scope.name = attrs.name;
        if (bsTabsCtrl.$options.animation) {
          element.addClass(bsTabsCtrl.$options.animation);
        }
        attrs.$observe('disabled', function(newValue, oldValue) {
          scope.disabled = scope.$eval(newValue);
        });
        bsTabsCtrl.$push(scope);
        scope.$on('$destroy', function() {
          bsTabsCtrl.$remove(scope);
        });
        function render() {
          var index = bsTabsCtrl.$panes.indexOf(scope);
          $animate[bsTabsCtrl.$isActive(scope, index) ? 'addClass' : 'removeClass'](element, bsTabsCtrl.$options.activeClass);
        }
        bsTabsCtrl.$activePaneChangeListeners.push(function() {
          render();
        });
        render();
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.select', [ 'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.helpers.parseOptions' ]).provider('$select', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'select',
      prefixEvent: '$select',
      placement: 'bottom-left',
      templateUrl: 'select/select.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      multiple: false,
      allNoneButtons: false,
      sort: true,
      caretHtml: '&nbsp;<span class="caret"></span>',
      placeholder: 'Choose among the following...',
      allText: 'All',
      noneText: 'None',
      maxLength: 3,
      maxLengthHtml: 'selected',
      iconCheckmark: 'glyphicon glyphicon-ok'
    };
    this.$get = [ '$window', '$document', '$rootScope', '$tooltip', '$timeout', function($window, $document, $rootScope, $tooltip, $timeout) {
      var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
      var isTouch = 'createTouch' in $window.document && isNative;
      function SelectFactory(element, controller, config) {
        var $select = {};
        var options = angular.extend({}, defaults, config);
        $select = $tooltip(element, options);
        var scope = $select.$scope;
        scope.$matches = [];
        if (options.multiple) {
          scope.$activeIndex = [];
        } else {
          scope.$activeIndex = -1;
        }
        scope.$isMultiple = options.multiple;
        scope.$showAllNoneButtons = options.allNoneButtons && options.multiple;
        scope.$iconCheckmark = options.iconCheckmark;
        scope.$allText = options.allText;
        scope.$noneText = options.noneText;
        scope.$activate = function(index) {
          scope.$$postDigest(function() {
            $select.activate(index);
          });
        };
        scope.$select = function(index, evt) {
          scope.$$postDigest(function() {
            $select.select(index);
          });
        };
        scope.$isVisible = function() {
          return $select.$isVisible();
        };
        scope.$isActive = function(index) {
          return $select.$isActive(index);
        };
        scope.$selectAll = function() {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (!scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };
        scope.$selectNone = function() {
          for (var i = 0; i < scope.$matches.length; i++) {
            if (scope.$isActive(i)) {
              scope.$select(i);
            }
          }
        };
        $select.update = function(matches) {
          scope.$matches = matches;
          $select.$updateActiveIndex();
        };
        $select.activate = function(index) {
          if (options.multiple) {
            if ($select.$isActive(index)) {
              scope.$activeIndex.splice(scope.$activeIndex.indexOf(index), 1);
            } else {
              scope.$activeIndex.push(index);
            }
            if (options.sort) scope.$activeIndex.sort(function(a, b) {
              return a - b;
            });
          } else {
            scope.$activeIndex = index;
          }
          return scope.$activeIndex;
        };
        $select.select = function(index) {
          var value = scope.$matches[index].value;
          scope.$apply(function() {
            $select.activate(index);
            if (options.multiple) {
              controller.$setViewValue(scope.$activeIndex.map(function(index) {
                if (angular.isUndefined(scope.$matches[index])) {
                  return null;
                }
                return scope.$matches[index].value;
              }));
            } else {
              controller.$setViewValue(value);
              $select.hide();
            }
          });
          scope.$emit(options.prefixEvent + '.select', value, index, $select);
        };
        $select.$updateActiveIndex = function() {
          if (options.multiple) {
            if (angular.isArray(controller.$modelValue)) {
              scope.$activeIndex = controller.$modelValue.map(function(value) {
                return $select.$getIndex(value);
              });
            } else {
              scope.$activeIndex = [];
            }
          } else {
            if (angular.isDefined(controller.$modelValue) && scope.$matches.length) {
              scope.$activeIndex = $select.$getIndex(controller.$modelValue);
            } else {
              scope.$activeIndex = -1;
            }
          }
        };
        $select.$isVisible = function() {
          if (!options.minLength || !controller) {
            return scope.$matches.length;
          }
          return scope.$matches.length && controller.$viewValue.length >= options.minLength;
        };
        $select.$isActive = function(index) {
          if (options.multiple) {
            return scope.$activeIndex.indexOf(index) !== -1;
          }
          return scope.$activeIndex === index;
        };
        $select.$getIndex = function(value) {
          var index;
          for (index = scope.$matches.length; index--; ) {
            if (angular.equals(scope.$matches[index].value, value)) break;
          }
          return index;
        };
        $select.$onMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          if (isTouch) {
            var targetEl = angular.element(evt.target);
            targetEl.triggerHandler('click');
          }
        };
        $select.$onKeyDown = function(evt) {
          if (!/(9|13|38|40)/.test(evt.keyCode)) return;
          if (evt.keyCode !== 9) {
            evt.preventDefault();
            evt.stopPropagation();
          }
          if (options.multiple && evt.keyCode === 9) {
            return $select.hide();
          }
          if (!options.multiple && (evt.keyCode === 13 || evt.keyCode === 9)) {
            return $select.select(scope.$activeIndex);
          }
          if (!options.multiple) {
            if (evt.keyCode === 38 && scope.$activeIndex > 0) scope.$activeIndex--; else if (evt.keyCode === 38 && scope.$activeIndex < 0) scope.$activeIndex = scope.$matches.length - 1; else if (evt.keyCode === 40 && scope.$activeIndex < scope.$matches.length - 1) scope.$activeIndex++; else if (angular.isUndefined(scope.$activeIndex)) scope.$activeIndex = 0;
            scope.$digest();
          }
        };
        $select.$isIE = function() {
          var ua = $window.navigator.userAgent;
          return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0;
        };
        $select.$selectScrollFix = function(e) {
          if ($document[0].activeElement.tagName === 'UL') {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.target.focus();
          }
        };
        var _show = $select.show;
        $select.show = function() {
          _show();
          if (options.multiple) {
            $select.$element.addClass('select-multiple');
          }
          $timeout(function() {
            $select.$element.on(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
            if (options.keyboard) {
              element.on('keydown', $select.$onKeyDown);
            }
          }, 0, false);
        };
        var _hide = $select.hide;
        $select.hide = function() {
          if (!options.multiple && angular.isUndefined(controller.$modelValue)) {
            scope.$activeIndex = -1;
          }
          $select.$element.off(isTouch ? 'touchstart' : 'mousedown', $select.$onMouseDown);
          if (options.keyboard) {
            element.off('keydown', $select.$onKeyDown);
          }
          _hide(true);
        };
        return $select;
      }
      SelectFactory.defaults = defaults;
      return SelectFactory;
    } ];
  }).directive('bsSelect', [ '$window', '$parse', '$q', '$select', '$parseOptions', function($window, $parse, $q, $select, $parseOptions) {
    var defaults = $select.defaults;
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = {
          scope: scope,
          placeholder: defaults.placeholder
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'placeholder', 'allNoneButtons', 'maxLength', 'maxLengthHtml', 'allText', 'noneText', 'iconCheckmark', 'autoClose', 'id', 'sort', 'caretHtml', 'prefixClass', 'prefixEvent' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'allNoneButtons', 'sort' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
            options[key] = false;
          }
        });
        var dataMultiple = element.attr('data-multiple');
        if (angular.isDefined(dataMultiple)) {
          if (falseValueRegExp.test(dataMultiple)) {
            options.multiple = false;
          } else {
            options.multiple = dataMultiple;
          }
        }
        if (element[0].nodeName.toLowerCase() === 'select') {
          var inputEl = element;
          inputEl.css('display', 'none');
          element = angular.element('<button type="button" class="btn btn-default"></button>');
          inputEl.after(element);
        }
        var parsedOptions = $parseOptions(attr.bsOptions);
        var select = $select(element, controller, options);
        if (select.$isIE()) {
          element[0].addEventListener('blur', select.$selectScrollFix);
        }
        var watchedOptions = parsedOptions.$match[7].replace(/\|.+/, '').trim();
        scope.$watch(watchedOptions, function(newValue, oldValue) {
          parsedOptions.valuesFn(scope, controller).then(function(values) {
            select.update(values);
            controller.$render();
          });
        }, true);
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          select.$updateActiveIndex();
          controller.$render();
        }, true);
        controller.$render = function() {
          var selected;
          var index;
          if (options.multiple && angular.isArray(controller.$modelValue)) {
            selected = controller.$modelValue.map(function(value) {
              index = select.$getIndex(value);
              return index !== -1 ? select.$scope.$matches[index].label : false;
            }).filter(angular.isDefined);
            if (selected.length > (options.maxLength || defaults.maxLength)) {
              selected = selected.length + ' ' + (options.maxLengthHtml || defaults.maxLengthHtml);
            } else {
              selected = selected.join(', ');
            }
          } else {
            index = select.$getIndex(controller.$modelValue);
            selected = index !== -1 ? select.$scope.$matches[index].label : false;
          }
          element.html((selected ? selected : options.placeholder) + (options.caretHtml ? options.caretHtml : defaults.caretHtml));
        };
        if (options.multiple) {
          controller.$isEmpty = function(value) {
            return !value || value.length === 0;
          };
        }
        scope.$on('$destroy', function() {
          if (select) select.destroy();
          options = null;
          select = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.popover', [ 'mgcrea.ngStrap.tooltip' ]).provider('$popover', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      customClass: '',
      container: false,
      target: false,
      placement: 'right',
      templateUrl: 'popover/popover.tpl.html',
      contentTemplate: false,
      trigger: 'click',
      keyboard: true,
      html: false,
      title: '',
      content: '',
      delay: 0,
      autoClose: false
    };
    this.$get = [ '$tooltip', function($tooltip) {
      function PopoverFactory(element, config) {
        var options = angular.extend({}, defaults, config);
        var $popover = $tooltip(element, options);
        if (options.content) {
          $popover.$scope.content = options.content;
        }
        return $popover;
      }
      return PopoverFactory;
    } ];
  }).directive('bsPopover', [ '$window', '$sce', '$popover', function($window, $sce, $popover) {
    var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr) {
        var popover;
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'customClass', 'autoClose', 'id', 'prefixClass', 'prefixEvent' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'autoClose' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        var dataTarget = element.attr('data-target');
        if (angular.isDefined(dataTarget)) {
          if (falseValueRegExp.test(dataTarget)) {
            options.target = false;
          } else {
            options.target = dataTarget;
          }
        }
        angular.forEach([ 'title', 'content' ], function(key) {
          if (attr[key]) {
            attr.$observe(key, function(newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
              if (angular.isDefined(oldValue)) {
                requestAnimationFrame(function() {
                  if (popover) popover.$applyPlacement();
                });
              }
            });
          }
        });
        if (attr.bsPopover) {
          scope.$watch(attr.bsPopover, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
            if (angular.isDefined(oldValue)) {
              requestAnimationFrame(function() {
                if (popover) popover.$applyPlacement();
              });
            }
          }, true);
        }
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function(newValue, oldValue) {
            if (!popover || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(popover),?/i);
            if (newValue === true) {
              popover.show();
            } else {
              popover.hide();
            }
          });
        }
        if (attr.viewport) {
          scope.$watch(attr.viewport, function(newValue) {
            if (!popover || !angular.isDefined(newValue)) return;
            popover.setViewport(newValue);
          });
        }
        popover = $popover(element, options);
        scope.$on('$destroy', function() {
          if (popover) popover.destroy();
          options = null;
          popover = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.scrollspy', [ 'mgcrea.ngStrap.helpers.debounce', 'mgcrea.ngStrap.helpers.dimensions' ]).provider('$scrollspy', function() {
    var spies = this.$$spies = {};
    var defaults = this.defaults = {
      debounce: 150,
      throttle: 100,
      offset: 100
    };
    this.$get = [ '$window', '$document', '$rootScope', 'dimensions', 'debounce', 'throttle', function($window, $document, $rootScope, dimensions, debounce, throttle) {
      var windowEl = angular.element($window);
      var docEl = angular.element($document.prop('documentElement'));
      var bodyEl = angular.element($window.document.body);
      function nodeName(element, name) {
        return element[0].nodeName && element[0].nodeName.toLowerCase() === name.toLowerCase();
      }
      function ScrollSpyFactory(config) {
        var options = angular.extend({}, defaults, config);
        if (!options.element) options.element = bodyEl;
        var isWindowSpy = nodeName(options.element, 'body');
        var scrollEl = isWindowSpy ? windowEl : options.element;
        var scrollId = isWindowSpy ? 'window' : options.id;
        if (spies[scrollId]) {
          spies[scrollId].$$count++;
          return spies[scrollId];
        }
        var $scrollspy = {};
        var unbindViewContentLoaded;
        var unbindIncludeContentLoaded;
        var trackedElements = $scrollspy.$trackedElements = [];
        var sortedElements = [];
        var activeTarget;
        var debouncedCheckPosition;
        var throttledCheckPosition;
        var debouncedCheckOffsets;
        var viewportHeight;
        var scrollTop;
        $scrollspy.init = function() {
          this.$$count = 1;
          debouncedCheckPosition = debounce(this.checkPosition, options.debounce);
          throttledCheckPosition = throttle(this.checkPosition, options.throttle);
          scrollEl.on('click', this.checkPositionWithEventLoop);
          windowEl.on('resize', debouncedCheckPosition);
          scrollEl.on('scroll', throttledCheckPosition);
          debouncedCheckOffsets = debounce(this.checkOffsets, options.debounce);
          unbindViewContentLoaded = $rootScope.$on('$viewContentLoaded', debouncedCheckOffsets);
          unbindIncludeContentLoaded = $rootScope.$on('$includeContentLoaded', debouncedCheckOffsets);
          debouncedCheckOffsets();
          if (scrollId) {
            spies[scrollId] = $scrollspy;
          }
        };
        $scrollspy.destroy = function() {
          this.$$count--;
          if (this.$$count > 0) {
            return;
          }
          scrollEl.off('click', this.checkPositionWithEventLoop);
          windowEl.off('resize', debouncedCheckPosition);
          scrollEl.off('scroll', throttledCheckPosition);
          unbindViewContentLoaded();
          unbindIncludeContentLoaded();
          if (scrollId) {
            delete spies[scrollId];
          }
        };
        $scrollspy.checkPosition = function() {
          if (!sortedElements.length) return;
          scrollTop = (isWindowSpy ? $window.pageYOffset : scrollEl.prop('scrollTop')) || 0;
          viewportHeight = Math.max($window.innerHeight, docEl.prop('clientHeight'));
          if (scrollTop < sortedElements[0].offsetTop && activeTarget !== sortedElements[0].target) {
            return $scrollspy.$activateElement(sortedElements[0]);
          }
          for (var i = sortedElements.length; i--; ) {
            if (angular.isUndefined(sortedElements[i].offsetTop) || sortedElements[i].offsetTop === null) continue;
            if (activeTarget === sortedElements[i].target) continue;
            if (scrollTop < sortedElements[i].offsetTop) continue;
            if (sortedElements[i + 1] && scrollTop > sortedElements[i + 1].offsetTop) continue;
            return $scrollspy.$activateElement(sortedElements[i]);
          }
        };
        $scrollspy.checkPositionWithEventLoop = function() {
          setTimeout($scrollspy.checkPosition, 1);
        };
        $scrollspy.$activateElement = function(element) {
          if (activeTarget) {
            var activeElement = $scrollspy.$getTrackedElement(activeTarget);
            if (activeElement) {
              activeElement.source.removeClass('active');
              if (nodeName(activeElement.source, 'li') && nodeName(activeElement.source.parent().parent(), 'li')) {
                activeElement.source.parent().parent().removeClass('active');
              }
            }
          }
          activeTarget = element.target;
          element.source.addClass('active');
          if (nodeName(element.source, 'li') && nodeName(element.source.parent().parent(), 'li')) {
            element.source.parent().parent().addClass('active');
          }
        };
        $scrollspy.$getTrackedElement = function(target) {
          return trackedElements.filter(function(obj) {
            return obj.target === target;
          })[0];
        };
        $scrollspy.checkOffsets = function() {
          angular.forEach(trackedElements, function(trackedElement) {
            var targetElement = document.querySelector(trackedElement.target);
            trackedElement.offsetTop = targetElement ? dimensions.offset(targetElement).top : null;
            if (options.offset && trackedElement.offsetTop !== null) trackedElement.offsetTop -= options.offset * 1;
          });
          sortedElements = trackedElements.filter(function(el) {
            return el.offsetTop !== null;
          }).sort(function(a, b) {
            return a.offsetTop - b.offsetTop;
          });
          debouncedCheckPosition();
        };
        $scrollspy.trackElement = function(target, source) {
          trackedElements.push({
            target: target,
            source: source
          });
        };
        $scrollspy.untrackElement = function(target, source) {
          var toDelete;
          for (var i = trackedElements.length; i--; ) {
            if (trackedElements[i].target === target && trackedElements[i].source === source) {
              toDelete = i;
              break;
            }
          }
          trackedElements = trackedElements.splice(toDelete, 1);
        };
        $scrollspy.activate = function(i) {
          trackedElements[i].addClass('active');
        };
        $scrollspy.init();
        return $scrollspy;
      }
      return ScrollSpyFactory;
    } ];
  }).directive('bsScrollspy', [ '$rootScope', 'debounce', 'dimensions', '$scrollspy', function($rootScope, debounce, dimensions, $scrollspy) {
    return {
      restrict: 'EAC',
      link: function postLink(scope, element, attr) {
        var options = {
          scope: scope
        };
        angular.forEach([ 'offset', 'target' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var scrollspy = $scrollspy(options);
        scrollspy.trackElement(options.target, element);
        scope.$on('$destroy', function() {
          if (scrollspy) {
            scrollspy.untrackElement(options.target, element);
            scrollspy.destroy();
          }
          options = null;
          scrollspy = null;
        });
      }
    };
  } ]).directive('bsScrollspyList', [ '$rootScope', 'debounce', 'dimensions', '$scrollspy', function($rootScope, debounce, dimensions, $scrollspy) {
    return {
      restrict: 'A',
      compile: function postLink(element, attr) {
        var children = element[0].querySelectorAll('li > a[href]');
        angular.forEach(children, function(child) {
          var childEl = angular.element(child);
          childEl.parent().attr('bs-scrollspy', '').attr('data-target', childEl.attr('href'));
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.navbar', []).provider('$navbar', function() {
    var defaults = this.defaults = {
      activeClass: 'active',
      routeAttr: 'data-match-route',
      strict: false
    };
    this.$get = function() {
      return {
        defaults: defaults
      };
    };
  }).directive('bsNavbar', [ '$window', '$location', '$navbar', function($window, $location, $navbar) {
    var defaults = $navbar.defaults;
    return {
      restrict: 'A',
      link: function postLink(scope, element, attr, controller) {
        var options = angular.copy(defaults);
        angular.forEach(Object.keys(defaults), function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        scope.$watch(function() {
          return $location.path();
        }, function(newValue, oldValue) {
          var liElements = element[0].querySelectorAll('li[' + options.routeAttr + ']');
          angular.forEach(liElements, function(li) {
            var liElement = angular.element(li);
            var pattern = liElement.attr(options.routeAttr).replace('/', '\\/');
            if (options.strict) {
              pattern = '^' + pattern + '$';
            }
            var regexp = new RegExp(pattern, 'i');
            if (regexp.test(newValue)) {
              liElement.addClass(options.activeClass);
            } else {
              liElement.removeClass(options.activeClass);
            }
          });
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.modal', [ 'mgcrea.ngStrap.core', 'mgcrea.ngStrap.helpers.dimensions' ]).provider('$modal', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      backdropAnimation: 'am-fade',
      customClass: '',
      prefixClass: 'modal',
      prefixEvent: 'modal',
      placement: 'top',
      templateUrl: 'modal/modal.tpl.html',
      template: '',
      contentTemplate: false,
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      html: false,
      show: true
    };
    this.$get = [ '$window', '$rootScope', '$bsCompiler', '$animate', '$timeout', '$sce', 'dimensions', function($window, $rootScope, $bsCompiler, $animate, $timeout, $sce, dimensions) {
      var forEach = angular.forEach;
      var requestAnimationFrame = $window.requestAnimationFrame || $window.setTimeout;
      var bodyElement = angular.element($window.document.body);
      var backdropCount = 0;
      var dialogBaseZindex = 1050;
      var backdropBaseZindex = 1040;
      function ModalFactory(config) {
        var $modal = {};
        var options = $modal.$options = angular.extend({}, defaults, config);
        var promise = $modal.$promise = $bsCompiler.compile(options);
        var scope = $modal.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        if (!options.element && !options.container) {
          options.container = 'body';
        }
        $modal.$id = options.id || options.element && options.element.attr('id') || '';
        forEach([ 'title', 'content' ], function(key) {
          if (options[key]) scope[key] = $sce.trustAsHtml(options[key]);
        });
        scope.$hide = function() {
          scope.$$postDigest(function() {
            $modal.hide();
          });
        };
        scope.$show = function() {
          scope.$$postDigest(function() {
            $modal.show();
          });
        };
        scope.$toggle = function() {
          scope.$$postDigest(function() {
            $modal.toggle();
          });
        };
        $modal.$isShown = scope.$isShown = false;
        var compileData;
        var modalElement;
        var modalScope;
        var backdropElement = angular.element('<div class="' + options.prefixClass + '-backdrop"/>');
        backdropElement.css({
          position: 'fixed',
          top: '0px',
          left: '0px',
          bottom: '0px',
          right: '0px'
        });
        promise.then(function(data) {
          compileData = data;
          $modal.init();
        });
        $modal.init = function() {
          if (options.show) {
            scope.$$postDigest(function() {
              $modal.show();
            });
          }
        };
        $modal.destroy = function() {
          destroyModalElement();
          if (backdropElement) {
            backdropElement.remove();
            backdropElement = null;
          }
          scope.$destroy();
        };
        $modal.show = function() {
          if ($modal.$isShown) return;
          var parent;
          var after;
          if (angular.isElement(options.container)) {
            parent = options.container;
            after = options.container[0].lastChild ? angular.element(options.container[0].lastChild) : null;
          } else {
            if (options.container) {
              parent = findElement(options.container);
              after = parent[0] && parent[0].lastChild ? angular.element(parent[0].lastChild) : null;
            } else {
              parent = null;
              after = options.element;
            }
          }
          if (modalElement) destroyModalElement();
          modalScope = $modal.$scope.$new();
          modalElement = $modal.$element = compileData.link(modalScope, function(clonedElement, scope) {});
          if (options.backdrop) {
            modalElement.css({
              'z-index': dialogBaseZindex + backdropCount * 20
            });
            backdropElement.css({
              'z-index': backdropBaseZindex + backdropCount * 20
            });
            backdropCount++;
          }
          if (scope.$emit(options.prefixEvent + '.show.before', $modal).defaultPrevented) {
            return;
          }
          modalElement.css({
            display: 'block'
          }).addClass(options.placement);
          if (options.customClass) {
            modalElement.addClass(options.customClass);
          }
          if (options.animation) {
            if (options.backdrop) {
              backdropElement.addClass(options.backdropAnimation);
            }
            modalElement.addClass(options.animation);
          }
          if (options.backdrop) {
            $animate.enter(backdropElement, bodyElement, null);
          }
          if (angular.version.minor <= 2) {
            $animate.enter(modalElement, parent, after, enterAnimateCallback);
          } else {
            $animate.enter(modalElement, parent, after).then(enterAnimateCallback);
          }
          $modal.$isShown = scope.$isShown = true;
          safeDigest(scope);
          var el = modalElement[0];
          requestAnimationFrame(function() {
            el.focus();
          });
          bodyElement.addClass(options.prefixClass + '-open');
          if (options.animation) {
            bodyElement.addClass(options.prefixClass + '-with-' + options.animation);
          }
          bindBackdropEvents();
          bindKeyboardEvents();
        };
        function enterAnimateCallback() {
          scope.$emit(options.prefixEvent + '.show', $modal);
        }
        $modal.hide = function() {
          if (!$modal.$isShown) return;
          if (options.backdrop) {
            backdropCount--;
          }
          if (scope.$emit(options.prefixEvent + '.hide.before', $modal).defaultPrevented) {
            return;
          }
          if (angular.version.minor <= 2) {
            $animate.leave(modalElement, leaveAnimateCallback);
          } else {
            $animate.leave(modalElement).then(leaveAnimateCallback);
          }
          if (options.backdrop) {
            $animate.leave(backdropElement);
          }
          $modal.$isShown = scope.$isShown = false;
          safeDigest(scope);
          unbindBackdropEvents();
          unbindKeyboardEvents();
        };
        function leaveAnimateCallback() {
          scope.$emit(options.prefixEvent + '.hide', $modal);
          bodyElement.removeClass(options.prefixClass + '-open');
          if (options.animation) {
            bodyElement.removeClass(options.prefixClass + '-with-' + options.animation);
          }
        }
        $modal.toggle = function() {
          if ($modal.$isShown) {
            $modal.hide();
          } else {
            $modal.show();
          }
        };
        $modal.focus = function() {
          modalElement[0].focus();
        };
        $modal.$onKeyUp = function(evt) {
          if (evt.which === 27 && $modal.$isShown) {
            $modal.hide();
            evt.stopPropagation();
          }
        };
        function bindBackdropEvents() {
          if (options.backdrop) {
            modalElement.on('click', hideOnBackdropClick);
            backdropElement.on('click', hideOnBackdropClick);
            backdropElement.on('wheel', preventEventDefault);
          }
        }
        function unbindBackdropEvents() {
          if (options.backdrop) {
            modalElement.off('click', hideOnBackdropClick);
            backdropElement.off('click', hideOnBackdropClick);
            backdropElement.off('wheel', preventEventDefault);
          }
        }
        function bindKeyboardEvents() {
          if (options.keyboard) {
            modalElement.on('keyup', $modal.$onKeyUp);
          }
        }
        function unbindKeyboardEvents() {
          if (options.keyboard) {
            modalElement.off('keyup', $modal.$onKeyUp);
          }
        }
        function hideOnBackdropClick(evt) {
          if (evt.target !== evt.currentTarget) return;
          if (options.backdrop === 'static') {
            $modal.focus();
          } else {
            $modal.hide();
          }
        }
        function preventEventDefault(evt) {
          evt.preventDefault();
        }
        function destroyModalElement() {
          if ($modal.$isShown && modalElement !== null) {
            unbindBackdropEvents();
            unbindKeyboardEvents();
          }
          if (modalScope) {
            modalScope.$destroy();
            modalScope = null;
          }
          if (modalElement) {
            modalElement.remove();
            modalElement = $modal.$element = null;
          }
        }
        return $modal;
      }
      function safeDigest(scope) {
        scope.$$phase || scope.$root && scope.$root.$$phase || scope.$digest();
      }
      function findElement(query, element) {
        return angular.element((element || document).querySelectorAll(query));
      }
      return ModalFactory;
    } ];
  }).directive('bsModal', [ '$window', '$sce', '$modal', function($window, $sce, $modal) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        var options = {
          scope: scope,
          element: element,
          show: false
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation', 'backdropAnimation', 'id', 'prefixEvent', 'prefixClass', 'customClass', 'modalClass' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        if (options.modalClass) {
          options.customClass = options.modalClass;
        }
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'backdrop', 'keyboard', 'html', 'container' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        angular.forEach([ 'title', 'content' ], function(key) {
          if (attr[key]) {
            attr.$observe(key, function(newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
            });
          }
        });
        if (attr.bsModal) {
          scope.$watch(attr.bsModal, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
          }, true);
        }
        var modal = $modal(options);
        element.on(attr.trigger || 'click', modal.toggle);
        scope.$on('$destroy', function() {
          if (modal) modal.destroy();
          options = null;
          modal = null;
        });
      }
    };
  } ]);
  if (angular.version.minor < 3 && angular.version.dot < 14) {
    angular.module('ng').factory('$$rAF', [ '$window', '$timeout', function($window, $timeout) {
      var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;
      var cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.mozCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame;
      var rafSupported = !!requestAnimationFrame;
      var raf = rafSupported ? function(fn) {
        var id = requestAnimationFrame(fn);
        return function() {
          cancelAnimationFrame(id);
        };
      } : function(fn) {
        var timer = $timeout(fn, 16.66, false);
        return function() {
          $timeout.cancel(timer);
        };
      };
      raf.supported = rafSupported;
      return raf;
    } ]);
  }
  angular.module('mgcrea.ngStrap.helpers.parseOptions', []).provider('$parseOptions', function() {
    var defaults = this.defaults = {
      regexp: /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/
    };
    this.$get = [ '$parse', '$q', function($parse, $q) {
      function ParseOptionsFactory(attr, config) {
        var $parseOptions = {};
        var options = angular.extend({}, defaults, config);
        $parseOptions.$values = [];
        var match;
        var displayFn;
        var valueName;
        var keyName;
        var groupByFn;
        var valueFn;
        var valuesFn;
        $parseOptions.init = function() {
          $parseOptions.$match = match = attr.match(options.regexp);
          displayFn = $parse(match[2] || match[1]);
          valueName = match[4] || match[6];
          keyName = match[5];
          groupByFn = $parse(match[3] || '');
          valueFn = $parse(match[2] ? match[1] : valueName);
          valuesFn = $parse(match[7]);
        };
        $parseOptions.valuesFn = function(scope, controller) {
          return $q.when(valuesFn(scope, controller)).then(function(values) {
            if (!angular.isArray(values)) {
              values = [];
            }
            $parseOptions.$values = values.length ? parseValues(values, scope) : [];
            return $parseOptions.$values;
          });
        };
        $parseOptions.displayValue = function(modelValue) {
          var scope = {};
          scope[valueName] = modelValue;
          return displayFn(scope);
        };
        function parseValues(values, scope) {
          return values.map(function(match, index) {
            var locals = {};
            var label;
            var value;
            locals[valueName] = match;
            label = displayFn(scope, locals);
            value = valueFn(scope, locals);
            return {
              label: label,
              value: value,
              index: index
            };
          });
        }
        $parseOptions.init();
        return $parseOptions;
      }
      return ParseOptionsFactory;
    } ];
  });
  angular.module('mgcrea.ngStrap.helpers.dimensions', []).factory('dimensions', function() {
    var fn = {};
    var nodeName = fn.nodeName = function(element, name) {
      return element.nodeName && element.nodeName.toLowerCase() === name.toLowerCase();
    };
    fn.css = function(element, prop, extra) {
      var value;
      if (element.currentStyle) {
        value = element.currentStyle[prop];
      } else if (window.getComputedStyle) {
        value = window.getComputedStyle(element)[prop];
      } else {
        value = element.style[prop];
      }
      return extra === true ? parseFloat(value) || 0 : value;
    };
    fn.offset = function(element) {
      var boxRect = element.getBoundingClientRect();
      var docElement = element.ownerDocument;
      return {
        width: boxRect.width || element.offsetWidth,
        height: boxRect.height || element.offsetHeight,
        top: boxRect.top + (window.pageYOffset || docElement.documentElement.scrollTop) - (docElement.documentElement.clientTop || 0),
        left: boxRect.left + (window.pageXOffset || docElement.documentElement.scrollLeft) - (docElement.documentElement.clientLeft || 0)
      };
    };
    fn.setOffset = function(element, options, i) {
      var curPosition;
      var curLeft;
      var curCSSTop;
      var curTop;
      var curOffset;
      var curCSSLeft;
      var calculatePosition;
      var position = fn.css(element, 'position');
      var curElem = angular.element(element);
      var props = {};
      if (position === 'static') {
        element.style.position = 'relative';
      }
      curOffset = fn.offset(element);
      curCSSTop = fn.css(element, 'top');
      curCSSLeft = fn.css(element, 'left');
      calculatePosition = (position === 'absolute' || position === 'fixed') && (curCSSTop + curCSSLeft).indexOf('auto') > -1;
      if (calculatePosition) {
        curPosition = fn.position(element);
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }
      if (angular.isFunction(options)) {
        options = options.call(element, i, curOffset);
      }
      if (options.top !== null) {
        props.top = options.top - curOffset.top + curTop;
      }
      if (options.left !== null) {
        props.left = options.left - curOffset.left + curLeft;
      }
      if ('using' in options) {
        options.using.call(curElem, props);
      } else {
        curElem.css({
          top: props.top + 'px',
          left: props.left + 'px'
        });
      }
    };
    fn.position = function(element) {
      var offsetParentRect = {
        top: 0,
        left: 0
      };
      var offsetParentEl;
      var offset;
      if (fn.css(element, 'position') === 'fixed') {
        offset = element.getBoundingClientRect();
      } else {
        offsetParentEl = offsetParentElement(element);
        offset = fn.offset(element);
        if (!nodeName(offsetParentEl, 'html')) {
          offsetParentRect = fn.offset(offsetParentEl);
        }
        offsetParentRect.top += fn.css(offsetParentEl, 'borderTopWidth', true);
        offsetParentRect.left += fn.css(offsetParentEl, 'borderLeftWidth', true);
      }
      return {
        width: element.offsetWidth,
        height: element.offsetHeight,
        top: offset.top - offsetParentRect.top - fn.css(element, 'marginTop', true),
        left: offset.left - offsetParentRect.left - fn.css(element, 'marginLeft', true)
      };
    };
    function offsetParentElement(element) {
      var docElement = element.ownerDocument;
      var offsetParent = element.offsetParent || docElement;
      if (nodeName(offsetParent, '#document')) return docElement.documentElement;
      while (offsetParent && !nodeName(offsetParent, 'html') && fn.css(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docElement.documentElement;
    }
    fn.height = function(element, outer) {
      var value = element.offsetHeight;
      if (outer) {
        value += fn.css(element, 'marginTop', true) + fn.css(element, 'marginBottom', true);
      } else {
        value -= fn.css(element, 'paddingTop', true) + fn.css(element, 'paddingBottom', true) + fn.css(element, 'borderTopWidth', true) + fn.css(element, 'borderBottomWidth', true);
      }
      return value;
    };
    fn.width = function(element, outer) {
      var value = element.offsetWidth;
      if (outer) {
        value += fn.css(element, 'marginLeft', true) + fn.css(element, 'marginRight', true);
      } else {
        value -= fn.css(element, 'paddingLeft', true) + fn.css(element, 'paddingRight', true) + fn.css(element, 'borderLeftWidth', true) + fn.css(element, 'borderRightWidth', true);
      }
      return value;
    };
    return fn;
  });
  angular.module('mgcrea.ngStrap.helpers.debounce', []).factory('debounce', [ '$timeout', function($timeout) {
    return function(func, wait, immediate) {
      var timeout = null;
      return function() {
        var context = this;
        var args = arguments;
        var callNow = immediate && !timeout;
        if (timeout) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(function later() {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        }, wait, false);
        if (callNow) {
          func.apply(context, args);
        }
        return timeout;
      };
    };
  } ]).factory('throttle', [ '$timeout', function($timeout) {
    return function(func, wait, options) {
      var timeout = null;
      if (!options) options = {};
      return function() {
        var context = this;
        var args = arguments;
        if (!timeout) {
          if (options.leading !== false) {
            func.apply(context, args);
          }
          timeout = $timeout(function later() {
            timeout = null;
            if (options.trailing !== false) {
              func.apply(context, args);
            }
          }, wait, false);
        }
      };
    };
  } ]);
  angular.module('mgcrea.ngStrap.helpers.dateParser', []).provider('$dateParser', [ '$localeProvider', function($localeProvider) {
    function ParseDate() {
      this.year = 1970;
      this.month = 0;
      this.day = 1;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.milliseconds = 0;
    }
    ParseDate.prototype.setMilliseconds = function(value) {
      this.milliseconds = value;
    };
    ParseDate.prototype.setSeconds = function(value) {
      this.seconds = value;
    };
    ParseDate.prototype.setMinutes = function(value) {
      this.minutes = value;
    };
    ParseDate.prototype.setHours = function(value) {
      this.hours = value;
    };
    ParseDate.prototype.getHours = function() {
      return this.hours;
    };
    ParseDate.prototype.setDate = function(value) {
      this.day = value;
    };
    ParseDate.prototype.setMonth = function(value) {
      this.month = value;
    };
    ParseDate.prototype.setFullYear = function(value) {
      this.year = value;
    };
    ParseDate.prototype.fromDate = function(value) {
      this.year = value.getFullYear();
      this.month = value.getMonth();
      this.day = value.getDate();
      this.hours = value.getHours();
      this.minutes = value.getMinutes();
      this.seconds = value.getSeconds();
      this.milliseconds = value.getMilliseconds();
      return this;
    };
    ParseDate.prototype.toDate = function() {
      return new Date(this.year, this.month, this.day, this.hours, this.minutes, this.seconds, this.milliseconds);
    };
    var proto = ParseDate.prototype;
    function noop() {}
    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function indexOfCaseInsensitive(array, value) {
      var len = array.length;
      var str = value.toString().toLowerCase();
      for (var i = 0; i < len; i++) {
        if (array[i].toLowerCase() === str) {
          return i;
        }
      }
      return -1;
    }
    var defaults = this.defaults = {
      format: 'shortDate',
      strict: false
    };
    this.$get = [ '$locale', 'dateFilter', function($locale, dateFilter) {
      var DateParserFactory = function(config) {
        var options = angular.extend({}, defaults, config);
        var $dateParser = {};
        var regExpMap = {
          sss: '[0-9]{3}',
          ss: '[0-5][0-9]',
          s: options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
          mm: '[0-5][0-9]',
          m: options.strict ? '[1-5]?[0-9]' : '[0-9]|[0-5][0-9]',
          HH: '[01][0-9]|2[0-3]',
          H: options.strict ? '1?[0-9]|2[0-3]' : '[01]?[0-9]|2[0-3]',
          hh: '[0][1-9]|[1][012]',
          h: options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
          a: 'AM|PM',
          EEEE: $locale.DATETIME_FORMATS.DAY.join('|'),
          EEE: $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
          dd: '0[1-9]|[12][0-9]|3[01]',
          d: options.strict ? '[1-9]|[1-2][0-9]|3[01]' : '0?[1-9]|[1-2][0-9]|3[01]',
          MMMM: $locale.DATETIME_FORMATS.MONTH.join('|'),
          MMM: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
          MM: '0[1-9]|1[012]',
          M: options.strict ? '[1-9]|1[012]' : '0?[1-9]|1[012]',
          yyyy: '[1]{1}[0-9]{3}|[2]{1}[0-9]{3}',
          yy: '[0-9]{2}',
          y: options.strict ? '-?(0|[1-9][0-9]{0,3})' : '-?0*[0-9]{1,4}'
        };
        var setFnMap = {
          sss: proto.setMilliseconds,
          ss: proto.setSeconds,
          s: proto.setSeconds,
          mm: proto.setMinutes,
          m: proto.setMinutes,
          HH: proto.setHours,
          H: proto.setHours,
          hh: proto.setHours,
          h: proto.setHours,
          EEEE: noop,
          EEE: noop,
          dd: proto.setDate,
          d: proto.setDate,
          a: function(value) {
            var hours = this.getHours() % 12;
            return this.setHours(value.match(/pm/i) ? hours + 12 : hours);
          },
          MMMM: function(value) {
            return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.MONTH, value));
          },
          MMM: function(value) {
            return this.setMonth(indexOfCaseInsensitive($locale.DATETIME_FORMATS.SHORTMONTH, value));
          },
          MM: function(value) {
            return this.setMonth(1 * value - 1);
          },
          M: function(value) {
            return this.setMonth(1 * value - 1);
          },
          yyyy: proto.setFullYear,
          yy: function(value) {
            return this.setFullYear(2e3 + 1 * value);
          },
          y: function(value) {
            return 1 * value <= 50 && value.length === 2 ? this.setFullYear(2e3 + 1 * value) : this.setFullYear(1 * value);
          }
        };
        var regex;
        var setMap;
        $dateParser.init = function() {
          $dateParser.$format = $locale.DATETIME_FORMATS[options.format] || options.format;
          regex = regExpForFormat($dateParser.$format);
          setMap = setMapForFormat($dateParser.$format);
        };
        $dateParser.isValid = function(date) {
          if (angular.isDate(date)) return !isNaN(date.getTime());
          return regex.test(date);
        };
        $dateParser.parse = function(value, baseDate, format, timezone) {
          if (format) format = $locale.DATETIME_FORMATS[format] || format;
          if (angular.isDate(value)) value = dateFilter(value, format || $dateParser.$format, timezone);
          var formatRegex = format ? regExpForFormat(format) : regex;
          var formatSetMap = format ? setMapForFormat(format) : setMap;
          var matches = formatRegex.exec(value);
          if (!matches) return false;
          var date = baseDate && !isNaN(baseDate.getTime()) ? new ParseDate().fromDate(baseDate) : new ParseDate().fromDate(new Date(1970, 0, 1, 0));
          for (var i = 0; i < matches.length - 1; i++) {
            if (formatSetMap[i]) formatSetMap[i].call(date, matches[i + 1]);
          }
          var newDate = date.toDate();
          if (parseInt(date.day, 10) !== newDate.getDate()) {
            return false;
          }
          return newDate;
        };
        $dateParser.getDateForAttribute = function(key, value) {
          var date;
          if (value === 'today') {
            var today = new Date();
            date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (key === 'maxDate' ? 1 : 0), 0, 0, 0, key === 'minDate' ? 0 : -1);
          } else if (angular.isString(value) && value.match(/^".+"$/)) {
            date = new Date(value.substr(1, value.length - 2));
          } else if (isNumeric(value)) {
            date = new Date(parseInt(value, 10));
          } else if (angular.isString(value) && value.length === 0) {
            date = key === 'minDate' ? -Infinity : +Infinity;
          } else {
            date = new Date(value);
          }
          return date;
        };
        $dateParser.getTimeForAttribute = function(key, value) {
          var time;
          if (value === 'now') {
            time = new Date().setFullYear(1970, 0, 1);
          } else if (angular.isString(value) && value.match(/^".+"$/)) {
            time = new Date(value.substr(1, value.length - 2)).setFullYear(1970, 0, 1);
          } else if (isNumeric(value)) {
            time = new Date(parseInt(value, 10)).setFullYear(1970, 0, 1);
          } else if (angular.isString(value) && value.length === 0) {
            time = key === 'minTime' ? -Infinity : +Infinity;
          } else {
            time = $dateParser.parse(value, new Date(1970, 0, 1, 0));
          }
          return time;
        };
        $dateParser.daylightSavingAdjust = function(date) {
          if (!date) {
            return null;
          }
          date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
          return date;
        };
        $dateParser.timezoneOffsetAdjust = function(date, timezone, undo) {
          if (!date) {
            return null;
          }
          if (timezone && timezone === 'UTC') {
            date = new Date(date.getTime());
            date.setMinutes(date.getMinutes() + (undo ? -1 : 1) * date.getTimezoneOffset());
          }
          return date;
        };
        function regExpForFormat(format) {
          var re = buildDateAbstractRegex(format);
          return buildDateParseRegex(re);
        }
        function buildDateAbstractRegex(format) {
          var escapedFormat = escapeReservedSymbols(format);
          var escapedLiteralFormat = escapedFormat.replace(/''/g, '\\\'');
          var literalRegex = /('(?:\\'|.)*?')/;
          var formatParts = escapedLiteralFormat.split(literalRegex);
          var dateElements = Object.keys(regExpMap);
          var dateRegexParts = [];
          angular.forEach(formatParts, function(part) {
            if (isFormatStringLiteral(part)) {
              part = trimLiteralEscapeChars(part);
            } else {
              for (var i = 0; i < dateElements.length; i++) {
                part = part.split(dateElements[i]).join('${' + i + '}');
              }
            }
            dateRegexParts.push(part);
          });
          return dateRegexParts.join('');
        }
        function escapeReservedSymbols(text) {
          return text.replace(/\\/g, '[\\\\]').replace(/-/g, '[-]').replace(/\./g, '[.]').replace(/\*/g, '[*]').replace(/\+/g, '[+]').replace(/\?/g, '[?]').replace(/\$/g, '[$]').replace(/\^/g, '[^]').replace(/\//g, '[/]').replace(/\\s/g, '[\\s]');
        }
        function isFormatStringLiteral(text) {
          return /^'.*'$/.test(text);
        }
        function trimLiteralEscapeChars(text) {
          return text.replace(/^'(.*)'$/, '$1');
        }
        function buildDateParseRegex(abstractRegex) {
          var dateElements = Object.keys(regExpMap);
          var re = abstractRegex;
          for (var i = 0; i < dateElements.length; i++) {
            re = re.split('${' + i + '}').join('(' + regExpMap[dateElements[i]] + ')');
          }
          return new RegExp('^' + re + '$', [ 'i' ]);
        }
        function setMapForFormat(format) {
          var re = buildDateAbstractRegex(format);
          return buildDateParseValuesMap(re);
        }
        function buildDateParseValuesMap(abstractRegex) {
          var dateElements = Object.keys(regExpMap);
          var valuesRegex = new RegExp('\\${(\\d+)}', 'g');
          var valuesMatch;
          var keyIndex;
          var valueKey;
          var valueFunction;
          var valuesFunctionMap = [];
          while ((valuesMatch = valuesRegex.exec(abstractRegex)) !== null) {
            keyIndex = valuesMatch[1];
            valueKey = dateElements[keyIndex];
            valueFunction = setFnMap[valueKey];
            valuesFunctionMap.push(valueFunction);
          }
          return valuesFunctionMap;
        }
        $dateParser.init();
        return $dateParser;
      };
      return DateParserFactory;
    } ];
  } ]);
  angular.module('mgcrea.ngStrap.helpers.dateFormatter', []).service('$dateFormatter', [ '$locale', 'dateFilter', function($locale, dateFilter) {
    this.getDefaultLocale = function() {
      return $locale.id;
    };
    this.getDatetimeFormat = function(format, lang) {
      return $locale.DATETIME_FORMATS[format] || format;
    };
    this.weekdaysShort = function(lang) {
      return $locale.DATETIME_FORMATS.SHORTDAY;
    };
    function splitTimeFormat(format) {
      return /(h+)([:\.])?(m+)([:\.])?(s*)[ ]?(a?)/i.exec(format).slice(1);
    }
    this.hoursFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[0];
    };
    this.minutesFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[2];
    };
    this.secondsFormat = function(timeFormat) {
      return splitTimeFormat(timeFormat)[4];
    };
    this.timeSeparator = function(timeFormat) {
      return splitTimeFormat(timeFormat)[1];
    };
    this.showSeconds = function(timeFormat) {
      return !!splitTimeFormat(timeFormat)[4];
    };
    this.showAM = function(timeFormat) {
      return !!splitTimeFormat(timeFormat)[5];
    };
    this.formatDate = function(date, format, lang, timezone) {
      return dateFilter(date, format, timezone);
    };
  } ]);
  angular.module('mgcrea.ngStrap.core', []).service('$bsCompiler', bsCompilerService);
  function bsCompilerService($q, $http, $injector, $compile, $controller, $templateCache) {
    this.compile = function(options) {
      if (options.template && /\.html$/.test(options.template)) {
        console.warn('Deprecated use of `template` option to pass a file. Please use the `templateUrl` option instead.');
        options.templateUrl = options.template;
        options.template = '';
      }
      var templateUrl = options.templateUrl;
      var template = options.template || '';
      var controller = options.controller;
      var controllerAs = options.controllerAs;
      var resolve = angular.copy(options.resolve || {});
      var locals = angular.copy(options.locals || {});
      var transformTemplate = options.transformTemplate || angular.identity;
      var bindToController = options.bindToController;
      angular.forEach(resolve, function(value, key) {
        if (angular.isString(value)) {
          resolve[key] = $injector.get(value);
        } else {
          resolve[key] = $injector.invoke(value);
        }
      });
      angular.extend(resolve, locals);
      if (template) {
        resolve.$template = $q.when(template);
      } else if (templateUrl) {
        resolve.$template = fetchTemplate(templateUrl);
      } else {
        throw new Error('Missing `template` / `templateUrl` option.');
      }
      if (options.contentTemplate) {
        resolve.$template = $q.all([ resolve.$template, fetchTemplate(options.contentTemplate) ]).then(function(templates) {
          var templateEl = angular.element(templates[0]);
          var contentEl = findElement('[ng-bind="content"], [ng-bind="title"]', templateEl[0]).removeAttr('ng-bind').html(templates[1]);
          if (!options.templateUrl) contentEl.next().remove();
          return templateEl[0].outerHTML;
        });
      }
      return $q.all(resolve).then(function(locals) {
        var template = transformTemplate(locals.$template);
        if (options.html) {
          template = template.replace(/ng-bind="/gi, 'ng-bind-html="');
        }
        var element = angular.element('<div>').html(template.trim()).contents();
        var linkFn = $compile(element);
        return {
          locals: locals,
          element: element,
          link: function link(scope) {
            locals.$scope = scope;
            if (controller) {
              var invokeCtrl = $controller(controller, locals, true);
              if (bindToController) {
                angular.extend(invokeCtrl.instance, locals);
              }
              var ctrl = angular.isObject(invokeCtrl) ? invokeCtrl : invokeCtrl();
              element.data('$ngControllerController', ctrl);
              element.children().data('$ngControllerController', ctrl);
              if (controllerAs) {
                scope[controllerAs] = ctrl;
              }
            }
            return linkFn.apply(null, arguments);
          }
        };
      });
    };
    function findElement(query, element) {
      return angular.element((element || document).querySelectorAll(query));
    }
    var fetchPromises = {};
    function fetchTemplate(template) {
      if (fetchPromises[template]) return fetchPromises[template];
      return fetchPromises[template] = $http.get(template, {
        cache: $templateCache
      }).then(function(res) {
        return res.data;
      });
    }
  }
  angular.module('mgcrea.ngStrap.dropdown', [ 'mgcrea.ngStrap.tooltip' ]).provider('$dropdown', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'dropdown',
      prefixEvent: 'dropdown',
      placement: 'bottom-left',
      templateUrl: 'dropdown/dropdown.tpl.html',
      trigger: 'click',
      container: false,
      keyboard: true,
      html: false,
      delay: 0
    };
    this.$get = [ '$window', '$rootScope', '$tooltip', '$timeout', function($window, $rootScope, $tooltip, $timeout) {
      var bodyEl = angular.element($window.document.body);
      var matchesSelector = Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;
      function DropdownFactory(element, config) {
        var $dropdown = {};
        var options = angular.extend({}, defaults, config);
        $dropdown.$scope = options.scope && options.scope.$new() || $rootScope.$new();
        $dropdown = $tooltip(element, options);
        var parentEl = element.parent();
        $dropdown.$onKeyDown = function(evt) {
          if (!/(38|40)/.test(evt.keyCode)) return;
          evt.preventDefault();
          evt.stopPropagation();
          var items = angular.element($dropdown.$element[0].querySelectorAll('li:not(.divider) a'));
          if (!items.length) return;
          var index;
          angular.forEach(items, function(el, i) {
            if (matchesSelector && matchesSelector.call(el, ':focus')) index = i;
          });
          if (evt.keyCode === 38 && index > 0) index--; else if (evt.keyCode === 40 && index < items.length - 1) index++; else if (angular.isUndefined(index)) index = 0;
          items.eq(index)[0].focus();
        };
        var show = $dropdown.show;
        $dropdown.show = function() {
          show();
          $timeout(function() {
            if (options.keyboard && $dropdown.$element) $dropdown.$element.on('keydown', $dropdown.$onKeyDown);
            bodyEl.on('click', onBodyClick);
          }, 0, false);
          if (parentEl.hasClass('dropdown')) parentEl.addClass('open');
        };
        var hide = $dropdown.hide;
        $dropdown.hide = function() {
          if (!$dropdown.$isShown) return;
          if (options.keyboard && $dropdown.$element) $dropdown.$element.off('keydown', $dropdown.$onKeyDown);
          bodyEl.off('click', onBodyClick);
          if (parentEl.hasClass('dropdown')) parentEl.removeClass('open');
          hide();
        };
        var destroy = $dropdown.destroy;
        $dropdown.destroy = function() {
          bodyEl.off('click', onBodyClick);
          destroy();
        };
        function onBodyClick(evt) {
          if (evt.target === element[0]) return;
          return evt.target !== element[0] && $dropdown.hide();
        }
        return $dropdown;
      }
      return DropdownFactory;
    } ];
  }).directive('bsDropdown', [ '$window', '$sce', '$dropdown', function($window, $sce, $dropdown) {
    return {
      restrict: 'EAC',
      scope: true,
      compile: function(tElement, tAttrs) {
        if (!tAttrs.bsDropdown) {
          var nextSibling = tElement[0].nextSibling;
          while (nextSibling && nextSibling.nodeType !== 1) {
            nextSibling = nextSibling.nextSibling;
          }
          if (nextSibling && nextSibling.classList.contains('dropdown-menu')) {
            tAttrs.template = nextSibling.outerHTML;
            tAttrs.templateUrl = undefined;
            nextSibling.parentNode.removeChild(nextSibling);
          }
        }
        return function postLink(scope, element, attr) {
          var options = {
            scope: scope
          };
          angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'keyboard', 'html', 'animation', 'id', 'autoClose' ], function(key) {
            if (angular.isDefined(tAttrs[key])) options[key] = tAttrs[key];
          });
          var falseValueRegExp = /^(false|0|)$/i;
          angular.forEach([ 'html', 'container' ], function(key) {
            if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
          });
          if (attr.bsDropdown) {
            scope.$watch(attr.bsDropdown, function(newValue, oldValue) {
              scope.content = newValue;
            }, true);
          }
          var dropdown = $dropdown(element, options);
          if (attr.bsShow) {
            scope.$watch(attr.bsShow, function(newValue, oldValue) {
              if (!dropdown || !angular.isDefined(newValue)) return;
              if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(dropdown),?/i);
              if (newValue === true) {
                dropdown.show();
              } else {
                dropdown.hide();
              }
            });
          }
          scope.$on('$destroy', function() {
            if (dropdown) dropdown.destroy();
            options = null;
            dropdown = null;
          });
        };
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.datepicker', [ 'mgcrea.ngStrap.helpers.dateParser', 'mgcrea.ngStrap.helpers.dateFormatter', 'mgcrea.ngStrap.tooltip' ]).provider('$datepicker', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'datepicker',
      placement: 'bottom-left',
      templateUrl: 'datepicker/datepicker.tpl.html',
      trigger: 'focus',
      container: false,
      keyboard: true,
      html: false,
      delay: 0,
      useNative: false,
      dateType: 'date',
      dateFormat: 'shortDate',
      timezone: null,
      modelDateFormat: null,
      dayFormat: 'dd',
      monthFormat: 'MMM',
      yearFormat: 'yyyy',
      monthTitleFormat: 'MMMM yyyy',
      yearTitleFormat: 'yyyy',
      strictFormat: false,
      autoclose: false,
      minDate: -Infinity,
      maxDate: +Infinity,
      startView: 0,
      minView: 0,
      startWeek: 0,
      daysOfWeekDisabled: '',
      iconLeft: 'glyphicon glyphicon-chevron-left',
      iconRight: 'glyphicon glyphicon-chevron-right'
    };
    this.$get = [ '$window', '$document', '$rootScope', '$sce', '$dateFormatter', 'datepickerViews', '$tooltip', '$timeout', function($window, $document, $rootScope, $sce, $dateFormatter, datepickerViews, $tooltip, $timeout) {
      var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
      var isTouch = 'createTouch' in $window.document && isNative;
      if (!defaults.lang) defaults.lang = $dateFormatter.getDefaultLocale();
      function DatepickerFactory(element, controller, config) {
        var $datepicker = $tooltip(element, angular.extend({}, defaults, config));
        var parentScope = config.scope;
        var options = $datepicker.$options;
        var scope = $datepicker.$scope;
        if (options.startView) options.startView -= options.minView;
        var pickerViews = datepickerViews($datepicker);
        $datepicker.$views = pickerViews.views;
        var viewDate = pickerViews.viewDate;
        scope.$mode = options.startView;
        scope.$iconLeft = options.iconLeft;
        scope.$iconRight = options.iconRight;
        var $picker = $datepicker.$views[scope.$mode];
        scope.$select = function(date) {
          $datepicker.select(date);
        };
        scope.$selectPane = function(value) {
          $datepicker.$selectPane(value);
        };
        scope.$toggleMode = function() {
          $datepicker.setMode((scope.$mode + 1) % $datepicker.$views.length);
        };
        $datepicker.update = function(date) {
          if (angular.isDate(date) && !isNaN(date.getTime())) {
            $datepicker.$date = date;
            $picker.update.call($picker, date);
          }
          $datepicker.$build(true);
        };
        $datepicker.updateDisabledDates = function(dateRanges) {
          options.disabledDateRanges = dateRanges;
          for (var i = 0, l = scope.rows.length; i < l; i++) {
            angular.forEach(scope.rows[i], $datepicker.$setDisabledEl);
          }
        };
        $datepicker.select = function(date, keep) {
          if (!angular.isDate(controller.$dateValue)) controller.$dateValue = new Date(date);
          if (!scope.$mode || keep) {
            controller.$setViewValue(angular.copy(date));
            controller.$render();
            if (options.autoclose && !keep) {
              $timeout(function() {
                $datepicker.hide(true);
              });
            }
          } else {
            angular.extend(viewDate, {
              year: date.getFullYear(),
              month: date.getMonth(),
              date: date.getDate()
            });
            $datepicker.setMode(scope.$mode - 1);
            $datepicker.$build();
          }
        };
        $datepicker.setMode = function(mode) {
          scope.$mode = mode;
          $picker = $datepicker.$views[scope.$mode];
          $datepicker.$build();
        };
        $datepicker.$build = function(pristine) {
          if (pristine === true && $picker.built) return;
          if (pristine === false && !$picker.built) return;
          $picker.build.call($picker);
        };
        $datepicker.$updateSelected = function() {
          for (var i = 0, l = scope.rows.length; i < l; i++) {
            angular.forEach(scope.rows[i], updateSelected);
          }
        };
        $datepicker.$isSelected = function(date) {
          return $picker.isSelected(date);
        };
        $datepicker.$setDisabledEl = function(el) {
          el.disabled = $picker.isDisabled(el.date);
        };
        $datepicker.$selectPane = function(value) {
          var steps = $picker.steps;
          var targetDate = new Date(Date.UTC(viewDate.year + (steps.year || 0) * value, viewDate.month + (steps.month || 0) * value, 1));
          angular.extend(viewDate, {
            year: targetDate.getUTCFullYear(),
            month: targetDate.getUTCMonth(),
            date: targetDate.getUTCDate()
          });
          $datepicker.$build();
        };
        $datepicker.$onMouseDown = function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          if (isTouch) {
            var targetEl = angular.element(evt.target);
            if (targetEl[0].nodeName.toLowerCase() !== 'button') {
              targetEl = targetEl.parent();
            }
            targetEl.triggerHandler('click');
          }
        };
        $datepicker.$onKeyDown = function(evt) {
          if (!/(38|37|39|40|13)/.test(evt.keyCode) || evt.shiftKey || evt.altKey) return;
          evt.preventDefault();
          evt.stopPropagation();
          if (evt.keyCode === 13) {
            if (!scope.$mode) {
              $datepicker.hide(true);
            } else {
              scope.$apply(function() {
                $datepicker.setMode(scope.$mode - 1);
              });
            }
            return;
          }
          $picker.onKeyDown(evt);
          parentScope.$digest();
        };
        function updateSelected(el) {
          el.selected = $datepicker.$isSelected(el.date);
        }
        function focusElement() {
          element[0].focus();
        }
        var _init = $datepicker.init;
        $datepicker.init = function() {
          if (isNative && options.useNative) {
            element.prop('type', 'date');
            element.css('-webkit-appearance', 'textfield');
            return;
          } else if (isTouch) {
            element.prop('type', 'text');
            element.attr('readonly', 'true');
            element.on('click', focusElement);
          }
          _init();
        };
        var _destroy = $datepicker.destroy;
        $datepicker.destroy = function() {
          if (isNative && options.useNative) {
            element.off('click', focusElement);
          }
          _destroy();
        };
        var _show = $datepicker.show;
        $datepicker.show = function() {
          if (!isTouch && element.attr('readonly') || element.attr('disabled')) return;
          _show();
          $timeout(function() {
            if (!$datepicker.$isShown) return;
            $datepicker.$element.on(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
            if (options.keyboard) {
              element.on('keydown', $datepicker.$onKeyDown);
            }
          }, 0, false);
        };
        var _hide = $datepicker.hide;
        $datepicker.hide = function(blur) {
          if (!$datepicker.$isShown) return;
          $datepicker.$element.off(isTouch ? 'touchstart' : 'mousedown', $datepicker.$onMouseDown);
          if (options.keyboard) {
            element.off('keydown', $datepicker.$onKeyDown);
          }
          _hide(blur);
        };
        return $datepicker;
      }
      DatepickerFactory.defaults = defaults;
      return DatepickerFactory;
    } ];
  }).directive('bsDatepicker', [ '$window', '$parse', '$q', '$dateFormatter', '$dateParser', '$datepicker', function($window, $parse, $q, $dateFormatter, $dateParser, $datepicker) {
    var isNative = /(ip[ao]d|iphone|android)/gi.test($window.navigator.userAgent);
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = {
          scope: scope
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'container', 'delay', 'trigger', 'html', 'animation', 'autoclose', 'dateType', 'dateFormat', 'timezone', 'modelDateFormat', 'dayFormat', 'strictFormat', 'startWeek', 'startDate', 'useNative', 'lang', 'startView', 'minView', 'iconLeft', 'iconRight', 'daysOfWeekDisabled', 'id', 'prefixClass', 'prefixEvent' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'html', 'container', 'autoclose', 'useNative' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) {
            options[key] = false;
          }
        });
        var datepicker = $datepicker(element, controller, options);
        options = datepicker.$options;
        if (isNative && options.useNative) options.dateFormat = 'yyyy-MM-dd';
        var lang = options.lang;
        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };
        var dateParser = $dateParser({
          format: options.dateFormat,
          lang: lang,
          strict: options.strictFormat
        });
        if (attr.bsShow) {
          scope.$watch(attr.bsShow, function(newValue, oldValue) {
            if (!datepicker || !angular.isDefined(newValue)) return;
            if (angular.isString(newValue)) newValue = !!newValue.match(/true|,?(datepicker),?/i);
            if (newValue === true) {
              datepicker.show();
            } else {
              datepicker.hide();
            }
          });
        }
        angular.forEach([ 'minDate', 'maxDate' ], function(key) {
          if (angular.isDefined(attr[key])) {
            attr.$observe(key, function(newValue) {
              datepicker.$options[key] = dateParser.getDateForAttribute(key, newValue);
              if (!isNaN(datepicker.$options[key])) datepicker.$build(false);
              validateAgainstMinMaxDate(controller.$dateValue);
            });
          }
        });
        if (angular.isDefined(attr.dateFormat)) {
          attr.$observe('dateFormat', function(newValue) {
            datepicker.$options.dateFormat = newValue;
          });
        }
        scope.$watch(attr.ngModel, function(newValue, oldValue) {
          datepicker.update(controller.$dateValue);
        }, true);
        function normalizeDateRanges(ranges) {
          if (!ranges || !ranges.length) return null;
          return ranges;
        }
        if (angular.isDefined(attr.disabledDates)) {
          scope.$watch(attr.disabledDates, function(disabledRanges, previousValue) {
            disabledRanges = normalizeDateRanges(disabledRanges);
            previousValue = normalizeDateRanges(previousValue);
            if (disabledRanges) {
              datepicker.updateDisabledDates(disabledRanges);
            }
          });
        }
        function validateAgainstMinMaxDate(parsedDate) {
          if (!angular.isDate(parsedDate)) return;
          var isMinValid = isNaN(datepicker.$options.minDate) || parsedDate.getTime() >= datepicker.$options.minDate;
          var isMaxValid = isNaN(datepicker.$options.maxDate) || parsedDate.getTime() <= datepicker.$options.maxDate;
          var isValid = isMinValid && isMaxValid;
          controller.$setValidity('date', isValid);
          controller.$setValidity('min', isMinValid);
          controller.$setValidity('max', isMaxValid);
          if (isValid) controller.$dateValue = parsedDate;
        }
        controller.$parsers.unshift(function(viewValue) {
          var date;
          if (!viewValue) {
            controller.$setValidity('date', true);
            return null;
          }
          var parsedDate = dateParser.parse(viewValue, controller.$dateValue);
          if (!parsedDate || isNaN(parsedDate.getTime())) {
            controller.$setValidity('date', false);
            return;
          }
          validateAgainstMinMaxDate(parsedDate);
          if (options.dateType === 'string') {
            date = dateParser.timezoneOffsetAdjust(parsedDate, options.timezone, true);
            return formatDate(date, options.modelDateFormat || options.dateFormat);
          }
          date = dateParser.timezoneOffsetAdjust(controller.$dateValue, options.timezone, true);
          if (options.dateType === 'number') {
            return date.getTime();
          } else if (options.dateType === 'unix') {
            return date.getTime() / 1e3;
          } else if (options.dateType === 'iso') {
            return date.toISOString();
          }
          return new Date(date);
        });
        controller.$formatters.push(function(modelValue) {
          var date;
          if (angular.isUndefined(modelValue) || modelValue === null) {
            date = NaN;
          } else if (angular.isDate(modelValue)) {
            date = modelValue;
          } else if (options.dateType === 'string') {
            date = dateParser.parse(modelValue, null, options.modelDateFormat);
          } else if (options.dateType === 'unix') {
            date = new Date(modelValue * 1e3);
          } else {
            date = new Date(modelValue);
          }
          controller.$dateValue = dateParser.timezoneOffsetAdjust(date, options.timezone);
          return getDateFormattedString();
        });
        controller.$render = function() {
          element.val(getDateFormattedString());
        };
        function getDateFormattedString() {
          return !controller.$dateValue || isNaN(controller.$dateValue.getTime()) ? '' : formatDate(controller.$dateValue, options.dateFormat);
        }
        scope.$on('$destroy', function() {
          if (datepicker) datepicker.destroy();
          options = null;
          datepicker = null;
        });
      }
    };
  } ]).provider('datepickerViews', function() {
    function split(arr, size) {
      var arrays = [];
      while (arr.length > 0) {
        arrays.push(arr.splice(0, size));
      }
      return arrays;
    }
    function mod(n, m) {
      return (n % m + m) % m;
    }
    this.$get = [ '$dateFormatter', '$dateParser', '$sce', function($dateFormatter, $dateParser, $sce) {
      return function(picker) {
        var scope = picker.$scope;
        var options = picker.$options;
        var lang = options.lang;
        var formatDate = function(date, format) {
          return $dateFormatter.formatDate(date, format, lang);
        };
        var dateParser = $dateParser({
          format: options.dateFormat,
          lang: lang,
          strict: options.strictFormat
        });
        var weekDaysMin = $dateFormatter.weekdaysShort(lang);
        var weekDaysLabels = weekDaysMin.slice(options.startWeek).concat(weekDaysMin.slice(0, options.startWeek));
        var weekDaysLabelsHtml = $sce.trustAsHtml('<th class="dow text-center">' + weekDaysLabels.join('</th><th class="dow text-center">') + '</th>');
        var startDate = picker.$date || (options.startDate ? dateParser.getDateForAttribute('startDate', options.startDate) : new Date());
        var viewDate = {
          year: startDate.getFullYear(),
          month: startDate.getMonth(),
          date: startDate.getDate()
        };
        var views = [ {
          format: options.dayFormat,
          split: 7,
          steps: {
            month: 1
          },
          update: function(date, force) {
            if (!this.built || force || date.getFullYear() !== viewDate.year || date.getMonth() !== viewDate.month) {
              angular.extend(viewDate, {
                year: picker.$date.getFullYear(),
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$build();
            } else if (date.getDate() !== viewDate.date || date.getDate() === 1) {
              viewDate.date = picker.$date.getDate();
              picker.$updateSelected();
            }
          },
          build: function() {
            var firstDayOfMonth = new Date(viewDate.year, viewDate.month, 1);
            var firstDayOfMonthOffset = firstDayOfMonth.getTimezoneOffset();
            var firstDate = new Date(+firstDayOfMonth - mod(firstDayOfMonth.getDay() - options.startWeek, 7) * 864e5);
            var firstDateOffset = firstDate.getTimezoneOffset();
            var today = dateParser.timezoneOffsetAdjust(new Date(), options.timezone).toDateString();
            if (firstDateOffset !== firstDayOfMonthOffset) firstDate = new Date(+firstDate + (firstDateOffset - firstDayOfMonthOffset) * 6e4);
            var days = [];
            var day;
            for (var i = 0; i < 42; i++) {
              day = dateParser.daylightSavingAdjust(new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate() + i));
              days.push({
                date: day,
                isToday: day.toDateString() === today,
                label: formatDate(day, this.format),
                selected: picker.$date && this.isSelected(day),
                muted: day.getMonth() !== viewDate.month,
                disabled: this.isDisabled(day)
              });
            }
            scope.title = formatDate(firstDayOfMonth, options.monthTitleFormat);
            scope.showLabels = true;
            scope.labels = weekDaysLabelsHtml;
            scope.rows = split(days, this.split);
            this.built = true;
          },
          isSelected: function(date) {
            return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth() && date.getDate() === picker.$date.getDate();
          },
          isDisabled: function(date) {
            var time = date.getTime();
            if (time < options.minDate || time > options.maxDate) return true;
            if (options.daysOfWeekDisabled.indexOf(date.getDay()) !== -1) return true;
            if (options.disabledDateRanges) {
              for (var i = 0; i < options.disabledDateRanges.length; i++) {
                if (time >= options.disabledDateRanges[i].start && time <= options.disabledDateRanges[i].end) {
                  return true;
                }
              }
            }
            return false;
          },
          onKeyDown: function(evt) {
            if (!picker.$date) {
              return;
            }
            var actualTime = picker.$date.getTime();
            var newDate;
            if (evt.keyCode === 37) newDate = new Date(actualTime - 1 * 864e5); else if (evt.keyCode === 38) newDate = new Date(actualTime - 7 * 864e5); else if (evt.keyCode === 39) newDate = new Date(actualTime + 1 * 864e5); else if (evt.keyCode === 40) newDate = new Date(actualTime + 7 * 864e5);
            if (!this.isDisabled(newDate)) picker.select(newDate, true);
          }
        }, {
          name: 'month',
          format: options.monthFormat,
          split: 4,
          steps: {
            year: 1
          },
          update: function(date, force) {
            if (!this.built || date.getFullYear() !== viewDate.year) {
              angular.extend(viewDate, {
                year: picker.$date.getFullYear(),
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$build();
            } else if (date.getMonth() !== viewDate.month) {
              angular.extend(viewDate, {
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$updateSelected();
            }
          },
          build: function() {
            var months = [];
            var month;
            for (var i = 0; i < 12; i++) {
              month = new Date(viewDate.year, i, 1);
              months.push({
                date: month,
                label: formatDate(month, this.format),
                selected: picker.$isSelected(month),
                disabled: this.isDisabled(month)
              });
            }
            scope.title = formatDate(month, options.yearTitleFormat);
            scope.showLabels = false;
            scope.rows = split(months, this.split);
            this.built = true;
          },
          isSelected: function(date) {
            return picker.$date && date.getFullYear() === picker.$date.getFullYear() && date.getMonth() === picker.$date.getMonth();
          },
          isDisabled: function(date) {
            var lastDate = +new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return lastDate < options.minDate || date.getTime() > options.maxDate;
          },
          onKeyDown: function(evt) {
            if (!picker.$date) {
              return;
            }
            var actualMonth = picker.$date.getMonth();
            var newDate = new Date(picker.$date);
            if (evt.keyCode === 37) newDate.setMonth(actualMonth - 1); else if (evt.keyCode === 38) newDate.setMonth(actualMonth - 4); else if (evt.keyCode === 39) newDate.setMonth(actualMonth + 1); else if (evt.keyCode === 40) newDate.setMonth(actualMonth + 4);
            if (!this.isDisabled(newDate)) picker.select(newDate, true);
          }
        }, {
          name: 'year',
          format: options.yearFormat,
          split: 4,
          steps: {
            year: 12
          },
          update: function(date, force) {
            if (!this.built || force || parseInt(date.getFullYear() / 20, 10) !== parseInt(viewDate.year / 20, 10)) {
              angular.extend(viewDate, {
                year: picker.$date.getFullYear(),
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$build();
            } else if (date.getFullYear() !== viewDate.year) {
              angular.extend(viewDate, {
                year: picker.$date.getFullYear(),
                month: picker.$date.getMonth(),
                date: picker.$date.getDate()
              });
              picker.$updateSelected();
            }
          },
          build: function() {
            var firstYear = viewDate.year - viewDate.year % (this.split * 3);
            var years = [];
            var year;
            for (var i = 0; i < 12; i++) {
              year = new Date(firstYear + i, 0, 1);
              years.push({
                date: year,
                label: formatDate(year, this.format),
                selected: picker.$isSelected(year),
                disabled: this.isDisabled(year)
              });
            }
            scope.title = years[0].label + '-' + years[years.length - 1].label;
            scope.showLabels = false;
            scope.rows = split(years, this.split);
            this.built = true;
          },
          isSelected: function(date) {
            return picker.$date && date.getFullYear() === picker.$date.getFullYear();
          },
          isDisabled: function(date) {
            var lastDate = +new Date(date.getFullYear() + 1, 0, 0);
            return lastDate < options.minDate || date.getTime() > options.maxDate;
          },
          onKeyDown: function(evt) {
            if (!picker.$date) {
              return;
            }
            var actualYear = picker.$date.getFullYear();
            var newDate = new Date(picker.$date);
            if (evt.keyCode === 37) newDate.setYear(actualYear - 1); else if (evt.keyCode === 38) newDate.setYear(actualYear - 4); else if (evt.keyCode === 39) newDate.setYear(actualYear + 1); else if (evt.keyCode === 40) newDate.setYear(actualYear + 4);
            if (!this.isDisabled(newDate)) picker.select(newDate, true);
          }
        } ];
        return {
          views: options.minView ? Array.prototype.slice.call(views, options.minView) : views,
          viewDate: viewDate
        };
      };
    } ];
  });
  angular.module('mgcrea.ngStrap.collapse', []).provider('$collapse', function() {
    var defaults = this.defaults = {
      animation: 'am-collapse',
      disallowToggle: false,
      activeClass: 'in',
      startCollapsed: false,
      allowMultiple: false
    };
    var controller = this.controller = function($scope, $element, $attrs) {
      var self = this;
      self.$options = angular.copy(defaults);
      angular.forEach([ 'animation', 'disallowToggle', 'activeClass', 'startCollapsed', 'allowMultiple' ], function(key) {
        if (angular.isDefined($attrs[key])) self.$options[key] = $attrs[key];
      });
      var falseValueRegExp = /^(false|0|)$/i;
      angular.forEach([ 'disallowToggle', 'startCollapsed', 'allowMultiple' ], function(key) {
        if (angular.isDefined($attrs[key]) && falseValueRegExp.test($attrs[key])) {
          self.$options[key] = false;
        }
      });
      self.$toggles = [];
      self.$targets = [];
      self.$viewChangeListeners = [];
      self.$registerToggle = function(element) {
        self.$toggles.push(element);
      };
      self.$registerTarget = function(element) {
        self.$targets.push(element);
      };
      self.$unregisterToggle = function(element) {
        var index = self.$toggles.indexOf(element);
        self.$toggles.splice(index, 1);
      };
      self.$unregisterTarget = function(element) {
        var index = self.$targets.indexOf(element);
        self.$targets.splice(index, 1);
        if (self.$options.allowMultiple) {
          deactivateItem(element);
        }
        fixActiveItemIndexes(index);
        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };
      self.$targets.$active = !self.$options.startCollapsed ? [ 0 ] : [];
      self.$setActive = $scope.$setActive = function(value) {
        if (angular.isArray(value)) {
          self.$targets.$active = value;
        } else if (!self.$options.disallowToggle && isActive(value)) {
          deactivateItem(value);
        } else {
          activateItem(value);
        }
        self.$viewChangeListeners.forEach(function(fn) {
          fn();
        });
      };
      self.$activeIndexes = function() {
        if (self.$options.allowMultiple) {
          return self.$targets.$active;
        }
        return self.$targets.$active.length === 1 ? self.$targets.$active[0] : -1;
      };
      function fixActiveItemIndexes(index) {
        var activeIndexes = self.$targets.$active;
        for (var i = 0; i < activeIndexes.length; i++) {
          if (index < activeIndexes[i]) {
            activeIndexes[i] = activeIndexes[i] - 1;
          }
          if (activeIndexes[i] === self.$targets.length) {
            activeIndexes[i] = self.$targets.length - 1;
          }
        }
      }
      function isActive(value) {
        var activeItems = self.$targets.$active;
        return activeItems.indexOf(value) === -1 ? false : true;
      }
      function deactivateItem(value) {
        var index = self.$targets.$active.indexOf(value);
        if (index !== -1) {
          self.$targets.$active.splice(index, 1);
        }
      }
      function activateItem(value) {
        if (!self.$options.allowMultiple) {
          self.$targets.$active.splice(0, 1);
        }
        if (self.$targets.$active.indexOf(value) === -1) {
          self.$targets.$active.push(value);
        }
      }
    };
    this.$get = function() {
      var $collapse = {};
      $collapse.defaults = defaults;
      $collapse.controller = controller;
      return $collapse;
    };
  }).directive('bsCollapse', [ '$window', '$animate', '$collapse', function($window, $animate, $collapse) {
    return {
      require: [ '?ngModel', 'bsCollapse' ],
      controller: [ '$scope', '$element', '$attrs', $collapse.controller ],
      link: function postLink(scope, element, attrs, controllers) {
        var ngModelCtrl = controllers[0];
        var bsCollapseCtrl = controllers[1];
        if (ngModelCtrl) {
          bsCollapseCtrl.$viewChangeListeners.push(function() {
            ngModelCtrl.$setViewValue(bsCollapseCtrl.$activeIndexes());
          });
          ngModelCtrl.$formatters.push(function(modelValue) {
            if (angular.isArray(modelValue)) {
              bsCollapseCtrl.$setActive(modelValue);
            } else {
              var activeIndexes = bsCollapseCtrl.$activeIndexes();
              if (angular.isArray(activeIndexes)) {
                if (activeIndexes.indexOf(modelValue * 1) === -1) {
                  bsCollapseCtrl.$setActive(modelValue * 1);
                }
              } else if (activeIndexes !== modelValue * 1) {
                bsCollapseCtrl.$setActive(modelValue * 1);
              }
            }
            return modelValue;
          });
        }
      }
    };
  } ]).directive('bsCollapseToggle', function() {
    return {
      require: [ '^?ngModel', '^bsCollapse' ],
      link: function postLink(scope, element, attrs, controllers) {
        var bsCollapseCtrl = controllers[1];
        element.attr('data-toggle', 'collapse');
        bsCollapseCtrl.$registerToggle(element);
        scope.$on('$destroy', function() {
          bsCollapseCtrl.$unregisterToggle(element);
        });
        element.on('click', function() {
          if (!attrs.disabled) {
            var index = attrs.bsCollapseToggle && attrs.bsCollapseToggle !== 'bs-collapse-toggle' ? attrs.bsCollapseToggle : bsCollapseCtrl.$toggles.indexOf(element);
            bsCollapseCtrl.$setActive(index * 1);
            scope.$apply();
          }
        });
      }
    };
  }).directive('bsCollapseTarget', [ '$animate', function($animate) {
    return {
      require: [ '^?ngModel', '^bsCollapse' ],
      link: function postLink(scope, element, attrs, controllers) {
        var bsCollapseCtrl = controllers[1];
        element.addClass('collapse');
        if (bsCollapseCtrl.$options.animation) {
          element.addClass(bsCollapseCtrl.$options.animation);
        }
        bsCollapseCtrl.$registerTarget(element);
        scope.$on('$destroy', function() {
          bsCollapseCtrl.$unregisterTarget(element);
        });
        function render() {
          var index = bsCollapseCtrl.$targets.indexOf(element);
          var active = bsCollapseCtrl.$activeIndexes();
          var action = 'removeClass';
          if (angular.isArray(active)) {
            if (active.indexOf(index) !== -1) {
              action = 'addClass';
            }
          } else if (index === active) {
            action = 'addClass';
          }
          $animate[action](element, bsCollapseCtrl.$options.activeClass);
        }
        bsCollapseCtrl.$viewChangeListeners.push(function() {
          render();
        });
        render();
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.button', []).provider('$button', function() {
    var defaults = this.defaults = {
      activeClass: 'active',
      toggleEvent: 'click'
    };
    this.$get = function() {
      return {
        defaults: defaults
      };
    };
  }).directive('bsCheckboxGroup', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      compile: function postLink(element, attr) {
        element.attr('data-toggle', 'buttons');
        element.removeAttr('ng-model');
        var children = element[0].querySelectorAll('input[type="checkbox"]');
        angular.forEach(children, function(child) {
          var childEl = angular.element(child);
          childEl.attr('bs-checkbox', '');
          childEl.attr('ng-model', attr.ngModel + '.' + childEl.attr('value'));
        });
      }
    };
  }).directive('bsCheckbox', [ '$button', '$$rAF', function($button, $$rAF) {
    var defaults = $button.defaults;
    var constantValueRegExp = /^(true|false|\d+)$/;
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = defaults;
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;
        var trueValue = angular.isDefined(attr.trueValue) ? attr.trueValue : true;
        if (constantValueRegExp.test(attr.trueValue)) {
          trueValue = scope.$eval(attr.trueValue);
        }
        var falseValue = angular.isDefined(attr.falseValue) ? attr.falseValue : false;
        if (constantValueRegExp.test(attr.falseValue)) {
          falseValue = scope.$eval(attr.falseValue);
        }
        var hasExoticValues = typeof trueValue !== 'boolean' || typeof falseValue !== 'boolean';
        if (hasExoticValues) {
          controller.$parsers.push(function(viewValue) {
            return viewValue ? trueValue : falseValue;
          });
          controller.$formatters.push(function(modelValue) {
            return angular.equals(modelValue, trueValue);
          });
          scope.$watch(attr.ngModel, function(newValue, oldValue) {
            controller.$render();
          });
        }
        controller.$render = function() {
          var isActive = angular.equals(controller.$modelValue, trueValue);
          $$rAF(function() {
            if (isInput) element[0].checked = isActive;
            activeElement.toggleClass(options.activeClass, isActive);
          });
        };
        element.bind(options.toggleEvent, function() {
          scope.$apply(function() {
            if (!isInput) {
              controller.$setViewValue(!activeElement.hasClass('active'));
            }
            if (!hasExoticValues) {
              controller.$render();
            }
          });
        });
      }
    };
  } ]).directive('bsRadioGroup', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      compile: function postLink(element, attr) {
        element.attr('data-toggle', 'buttons');
        element.removeAttr('ng-model');
        var children = element[0].querySelectorAll('input[type="radio"]');
        angular.forEach(children, function(child) {
          angular.element(child).attr('bs-radio', '');
          angular.element(child).attr('ng-model', attr.ngModel);
        });
      }
    };
  }).directive('bsRadio', [ '$button', '$$rAF', function($button, $$rAF) {
    var defaults = $button.defaults;
    var constantValueRegExp = /^(true|false|\d+)$/;
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attr, controller) {
        var options = defaults;
        var isInput = element[0].nodeName === 'INPUT';
        var activeElement = isInput ? element.parent() : element;
        var value;
        attr.$observe('value', function(v) {
          value = constantValueRegExp.test(v) ? scope.$eval(v) : v;
          controller.$render();
        });
        controller.$render = function() {
          var isActive = angular.equals(controller.$modelValue, value);
          $$rAF(function() {
            if (isInput) element[0].checked = isActive;
            activeElement.toggleClass(options.activeClass, isActive);
          });
        };
        element.bind(options.toggleEvent, function() {
          scope.$apply(function() {
            controller.$setViewValue(value);
            controller.$render();
          });
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.aside', [ 'mgcrea.ngStrap.modal' ]).provider('$aside', function() {
    var defaults = this.defaults = {
      animation: 'am-fade-and-slide-right',
      prefixClass: 'aside',
      prefixEvent: 'aside',
      placement: 'right',
      templateUrl: 'aside/aside.tpl.html',
      contentTemplate: false,
      container: false,
      element: null,
      backdrop: true,
      keyboard: true,
      html: false,
      show: true
    };
    this.$get = [ '$modal', function($modal) {
      function AsideFactory(config) {
        var $aside = {};
        var options = angular.extend({}, defaults, config);
        $aside = $modal(options);
        return $aside;
      }
      return AsideFactory;
    } ];
  }).directive('bsAside', [ '$window', '$sce', '$aside', function($window, $sce, $aside) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        var options = {
          scope: scope,
          element: element,
          show: false
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'contentTemplate', 'placement', 'backdrop', 'keyboard', 'html', 'container', 'animation' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'backdrop', 'keyboard', 'html', 'container' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        angular.forEach([ 'title', 'content' ], function(key) {
          if (attr[key]) {
            attr.$observe(key, function(newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
            });
          }
        });
        if (attr.bsAside) {
          scope.$watch(attr.bsAside, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
          }, true);
        }
        var aside = $aside(options);
        element.on(attr.trigger || 'click', aside.toggle);
        scope.$on('$destroy', function() {
          if (aside) aside.destroy();
          options = null;
          aside = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.alert', [ 'mgcrea.ngStrap.modal' ]).provider('$alert', function() {
    var defaults = this.defaults = {
      animation: 'am-fade',
      prefixClass: 'alert',
      prefixEvent: 'alert',
      placement: null,
      templateUrl: 'alert/alert.tpl.html',
      container: false,
      element: null,
      backdrop: false,
      keyboard: true,
      show: true,
      duration: false,
      type: false,
      dismissable: true
    };
    this.$get = [ '$modal', '$timeout', function($modal, $timeout) {
      function AlertFactory(config) {
        var $alert = {};
        var options = angular.extend({}, defaults, config);
        $alert = $modal(options);
        $alert.$scope.dismissable = !!options.dismissable;
        if (options.type) {
          $alert.$scope.type = options.type;
        }
        var show = $alert.show;
        if (options.duration) {
          $alert.show = function() {
            show();
            $timeout(function() {
              $alert.hide();
            }, options.duration * 1e3);
          };
        }
        return $alert;
      }
      return AlertFactory;
    } ];
  }).directive('bsAlert', [ '$window', '$sce', '$alert', function($window, $sce, $alert) {
    return {
      restrict: 'EAC',
      scope: true,
      link: function postLink(scope, element, attr, transclusion) {
        var options = {
          scope: scope,
          element: element,
          show: false
        };
        angular.forEach([ 'template', 'templateUrl', 'controller', 'controllerAs', 'placement', 'keyboard', 'html', 'container', 'animation', 'duration', 'dismissable' ], function(key) {
          if (angular.isDefined(attr[key])) options[key] = attr[key];
        });
        var falseValueRegExp = /^(false|0|)$/i;
        angular.forEach([ 'keyboard', 'html', 'container', 'dismissable' ], function(key) {
          if (angular.isDefined(attr[key]) && falseValueRegExp.test(attr[key])) options[key] = false;
        });
        if (!scope.hasOwnProperty('title')) {
          scope.title = '';
        }
        angular.forEach([ 'title', 'content', 'type' ], function(key) {
          if (attr[key]) {
            attr.$observe(key, function(newValue, oldValue) {
              scope[key] = $sce.trustAsHtml(newValue);
            });
          }
        });
        if (attr.bsAlert) {
          scope.$watch(attr.bsAlert, function(newValue, oldValue) {
            if (angular.isObject(newValue)) {
              angular.extend(scope, newValue);
            } else {
              scope.content = newValue;
            }
          }, true);
        }
        var alert = $alert(options);
        element.on(attr.trigger || 'click', alert.toggle);
        scope.$on('$destroy', function() {
          if (alert) alert.destroy();
          options = null;
          alert = null;
        });
      }
    };
  } ]);
  angular.module('mgcrea.ngStrap.affix', [ 'mgcrea.ngStrap.helpers.dimensions', 'mgcrea.ngStrap.helpers.debounce' ]).provider('$affix', function() {
    var defaults = this.defaults = {
      offsetTop: 'auto',
      inlineStyles: true
    };
    this.$get = [ '$window', 'debounce', 'dimensions', function($window, debounce, dimensions) {
      var bodyEl = angular.element($window.document.body);
      var windowEl = angular.element($window);
      function AffixFactory(element, config) {
        var $affix = {};
        var options = angular.extend({}, defaults, config);
        var targetEl = options.target;
        var reset = 'affix affix-top affix-bottom';
        var setWidth = false;
        var initialAffixTop = 0;
        var initialOffsetTop = 0;
        var offsetTop = 0;
        var offsetBottom = 0;
        var affixed = null;
        var unpin = null;
        var parent = element.parent();
        if (options.offsetParent) {
          if (options.offsetParent.match(/^\d+$/)) {
            for (var i = 0; i < options.offsetParent * 1 - 1; i++) {
              parent = parent.parent();
            }
          } else {
            parent = angular.element(options.offsetParent);
          }
        }
        $affix.init = function() {
          this.$parseOffsets();
          initialOffsetTop = dimensions.offset(element[0]).top + initialAffixTop;
          setWidth = !element[0].style.width;
          targetEl.on('scroll', this.checkPosition);
          targetEl.on('click', this.checkPositionWithEventLoop);
          windowEl.on('resize', this.$debouncedOnResize);
          this.checkPosition();
          this.checkPositionWithEventLoop();
        };
        $affix.destroy = function() {
          targetEl.off('scroll', this.checkPosition);
          targetEl.off('click', this.checkPositionWithEventLoop);
          windowEl.off('resize', this.$debouncedOnResize);
        };
        $affix.checkPositionWithEventLoop = function() {
          setTimeout($affix.checkPosition, 1);
        };
        $affix.checkPosition = function() {
          var scrollTop = getScrollTop();
          var position = dimensions.offset(element[0]);
          var elementHeight = dimensions.height(element[0]);
          var affix = getRequiredAffixClass(unpin, position, elementHeight);
          if (affixed === affix) return;
          affixed = affix;
          if (affix === 'top') {
            unpin = null;
            if (setWidth) {
              element.css('width', '');
            }
            if (options.inlineStyles) {
              element.css('position', options.offsetParent ? '' : 'relative');
              element.css('top', '');
            }
          } else if (affix === 'bottom') {
            if (options.offsetUnpin) {
              unpin = -(options.offsetUnpin * 1);
            } else {
              unpin = position.top - scrollTop;
            }
            if (setWidth) {
              element.css('width', '');
            }
            if (options.inlineStyles) {
              element.css('position', options.offsetParent ? '' : 'relative');
              element.css('top', options.offsetParent ? '' : bodyEl[0].offsetHeight - offsetBottom - elementHeight - initialOffsetTop + 'px');
            }
          } else {
            unpin = null;
            if (setWidth) {
              element.css('width', element[0].offsetWidth + 'px');
            }
            if (options.inlineStyles) {
              element.css('position', 'fixed');
              element.css('top', initialAffixTop + 'px');
            }
          }
          element.removeClass(reset).addClass('affix' + (affix !== 'middle' ? '-' + affix : ''));
        };
        $affix.$onResize = function() {
          $affix.$parseOffsets();
          $affix.checkPosition();
        };
        $affix.$debouncedOnResize = debounce($affix.$onResize, 50);
        $affix.$parseOffsets = function() {
          var initialPosition = element.css('position');
          if (options.inlineStyles) {
            element.css('position', options.offsetParent ? '' : 'relative');
          }
          if (options.offsetTop) {
            if (options.offsetTop === 'auto') {
              options.offsetTop = '+0';
            }
            if (options.offsetTop.match(/^[-+]\d+$/)) {
              initialAffixTop = -options.offsetTop * 1;
              if (options.offsetParent) {
                offsetTop = dimensions.offset(parent[0]).top + options.offsetTop * 1;
              } else {
                offsetTop = dimensions.offset(element[0]).top - dimensions.css(element[0], 'marginTop', true) + options.offsetTop * 1;
              }
            } else {
              offsetTop = options.offsetTop * 1;
            }
          }
          if (options.offsetBottom) {
            if (options.offsetParent && options.offsetBottom.match(/^[-+]\d+$/)) {
              offsetBottom = getScrollHeight() - (dimensions.offset(parent[0]).top + dimensions.height(parent[0])) + options.offsetBottom * 1 + 1;
            } else {
              offsetBottom = options.offsetBottom * 1;
            }
          }
          if (options.inlineStyles) {
            element.css('position', initialPosition);
          }
        };
        function getRequiredAffixClass(_unpin, position, elementHeight) {
          var scrollTop = getScrollTop();
          var scrollHeight = getScrollHeight();
          if (scrollTop <= offsetTop) {
            return 'top';
          } else if (_unpin !== null && scrollTop + _unpin <= position.top) {
            return 'middle';
          } else if (offsetBottom !== null && position.top + elementHeight + initialAffixTop >= scrollHeight - offsetBottom) {
            return 'bottom';
          }
          return 'middle';
        }
        function getScrollTop() {
          return targetEl[0] === $window ? $window.pageYOffset : targetEl[0].scrollTop;
        }
        function getScrollHeight() {
          return targetEl[0] === $window ? $window.document.body.scrollHeight : targetEl[0].scrollHeight;
        }
        $affix.init();
        return $affix;
      }
      return AffixFactory;
    } ];
  }).directive('bsAffix', [ '$affix', '$window', function($affix, $window) {
    return {
      restrict: 'EAC',
      require: '^?bsAffixTarget',
      link: function postLink(scope, element, attr, affixTarget) {
        var options = {
          scope: scope,
          target: affixTarget ? affixTarget.$element : angular.element($window)
        };
        angular.forEach([ 'offsetTop', 'offsetBottom', 'offsetParent', 'offsetUnpin', 'inlineStyles' ], function(key) {
          if (angular.isDefined(attr[key])) {
            var option = attr[key];
            if (/true/i.test(option)) option = true;
            if (/false/i.test(option)) option = false;
            options[key] = option;
          }
        });
        var affix = $affix(element, options);
        scope.$on('$destroy', function() {
          if (affix) affix.destroy();
          options = null;
          affix = null;
        });
      }
    };
  } ]).directive('bsAffixTarget', function() {
    return {
      controller: [ '$element', function($element) {
        this.$element = $element;
      } ]
    };
  });
  angular.module('mgcrea.ngStrap', [ 'mgcrea.ngStrap.modal', 'mgcrea.ngStrap.aside', 'mgcrea.ngStrap.alert', 'mgcrea.ngStrap.button', 'mgcrea.ngStrap.select', 'mgcrea.ngStrap.datepicker', 'mgcrea.ngStrap.timepicker', 'mgcrea.ngStrap.navbar', 'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.popover', 'mgcrea.ngStrap.dropdown', 'mgcrea.ngStrap.typeahead', 'mgcrea.ngStrap.scrollspy', 'mgcrea.ngStrap.affix', 'mgcrea.ngStrap.tab', 'mgcrea.ngStrap.collapse' ]);
})(window, document);
/**
 * angular-strap
 * @version v2.3.7 - 2016-01-16
 * @link http://mgcrea.github.io/angular-strap
 * @author Olivier Louvignes <olivier@mg-crea.com> (https://github.com/mgcrea)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(window, document, undefined) {
  'use strict';
  angular.module('mgcrea.ngStrap.alert').run([ '$templateCache', function($templateCache) {
    $templateCache.put('alert/alert.tpl.html', '<div class="alert" ng-class="[type ? \'alert-\' + type : null]"><button type="button" class="close" ng-if="dismissable" ng-click="$hide()">&times;</button> <strong ng-bind="title"></strong>&nbsp;<span ng-bind-html="content"></span></div>');
  } ]);
  angular.module('mgcrea.ngStrap.aside').run([ '$templateCache', function($templateCache) {
    $templateCache.put('aside/aside.tpl.html', '<div class="aside" tabindex="-1" role="dialog"><div class="aside-dialog"><div class="aside-content"><div class="aside-header" ng-show="title"><button type="button" class="close" ng-click="$hide()">&times;</button><h4 class="aside-title" ng-bind="title"></h4></div><div class="aside-body" ng-bind="content"></div><div class="aside-footer"><button type="button" class="btn btn-default" ng-click="$hide()">Close</button></div></div></div></div>');
  } ]);
  angular.module('mgcrea.ngStrap.datepicker').run([ '$templateCache', function($templateCache) {
    $templateCache.put('datepicker/datepicker.tpl.html', '<div class="dropdown-menu datepicker" ng-class="\'datepicker-mode-\' + $mode" style="max-width: 320px"><table style="table-layout: fixed; height: 100%; width: 100%"><thead><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$selectPane(-1)"><i class="{{$iconLeft}}"></i></button></th><th colspan="{{ rows[0].length - 2 }}"><button tabindex="-1" type="button" class="btn btn-default btn-block text-strong" ng-click="$toggleMode()"><strong style="text-transform: capitalize" ng-bind="title"></strong></button></th><th><button tabindex="-1" type="button" class="btn btn-default pull-right" ng-click="$selectPane(+1)"><i class="{{$iconRight}}"></i></button></th></tr><tr ng-if="showLabels" ng-bind-html="labels"></tr></thead><tbody><tr ng-repeat="(i, row) in rows" height="{{ 100 / rows.length }}%"><td class="text-center" ng-repeat="(j, el) in row"><button tabindex="-1" type="button" class="btn btn-default" style="width: 100%" ng-class="{\'btn-primary\': el.selected, \'btn-info btn-today\': el.isToday && !el.selected}" ng-click="$select(el.date)" ng-disabled="el.disabled"><span ng-class="{\'text-muted\': el.muted}" ng-bind="el.label"></span></button></td></tr></tbody></table></div>');
  } ]);
  angular.module('mgcrea.ngStrap.dropdown').run([ '$templateCache', function($templateCache) {
    $templateCache.put('dropdown/dropdown.tpl.html', '<ul tabindex="-1" class="dropdown-menu" role="menu" ng-show="content && content.length"><li role="presentation" ng-class="{divider: item.divider, active: item.active}" ng-repeat="item in content"><a role="menuitem" tabindex="-1" ng-href="{{item.href}}" ng-if="!item.divider && item.href" target="{{item.target || \'\'}}" ng-bind="item.text"></a> <a role="menuitem" tabindex="-1" href="javascript:void(0)" ng-if="!item.divider && item.click" ng-click="$eval(item.click);$hide()" ng-bind="item.text"></a></li></ul>');
  } ]);
  angular.module('mgcrea.ngStrap.modal').run([ '$templateCache', function($templateCache) {
    $templateCache.put('modal/modal.tpl.html', '<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" ng-show="title"><button type="button" class="close" aria-label="Close" ng-click="$hide()"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" ng-bind="title"></h4></div><div class="modal-body" ng-bind="content"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="$hide()">Close</button></div></div></div></div>');
  } ]);
  angular.module('mgcrea.ngStrap.popover').run([ '$templateCache', function($templateCache) {
    $templateCache.put('popover/popover.tpl.html', '<div class="popover" tabindex="-1"><div class="arrow"></div><h3 class="popover-title" ng-bind="title" ng-show="title"></h3><div class="popover-content" ng-bind="content"></div></div>');
  } ]);
  angular.module('mgcrea.ngStrap.select').run([ '$templateCache', function($templateCache) {
    $templateCache.put('select/select.tpl.html', '<ul tabindex="-1" class="select dropdown-menu" ng-show="$isVisible()" role="select"><li ng-if="$showAllNoneButtons"><div class="btn-group" style="margin-bottom: 5px; margin-left: 5px"><button type="button" class="btn btn-default btn-xs" ng-click="$selectAll()">{{$allText}}</button> <button type="button" class="btn btn-default btn-xs" ng-click="$selectNone()">{{$noneText}}</button></div></li><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $isActive($index)}"><a style="cursor: default" role="menuitem" tabindex="-1" ng-click="$select($index, $event)"><i class="{{$iconCheckmark}} pull-right" ng-if="$isMultiple && $isActive($index)"></i> <span ng-bind="match.label"></span></a></li></ul>');
  } ]);
  angular.module('mgcrea.ngStrap.tab').run([ '$templateCache', function($templateCache) {
    $templateCache.put('tab/tab.tpl.html', '<ul class="nav" ng-class="$navClass" role="tablist"><li role="presentation" ng-repeat="$pane in $panes track by $index" ng-class="[ $isActive($pane, $index) ? $activeClass : \'\', $pane.disabled ? \'disabled\' : \'\' ]"><a role="tab" data-toggle="tab" ng-click="!$pane.disabled && $setActive($pane.name || $index)" data-index="{{ $index }}" ng-bind-html="$pane.title" aria-controls="$pane.title"></a></li></ul><div ng-transclude class="tab-content"></div>');
  } ]);
  angular.module('mgcrea.ngStrap.timepicker').run([ '$templateCache', function($templateCache) {
    $templateCache.put('timepicker/timepicker.tpl.html', '<div class="dropdown-menu timepicker" style="min-width: 0px;width: auto"><table height="100%"><thead><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 0)"><i class="{{ $iconUp }}"></i></button></th><th>&nbsp;</th><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 1)"><i class="{{ $iconUp }}"></i></button></th><th>&nbsp;</th><th><button ng-if="showSeconds" tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(-1, 2)"><i class="{{ $iconUp }}"></i></button></th></tr></thead><tbody><tr ng-repeat="(i, row) in rows"><td class="text-center"><button tabindex="-1" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[0].selected}" ng-click="$select(row[0].date, 0)" ng-disabled="row[0].disabled"><span ng-class="{\'text-muted\': row[0].muted}" ng-bind="row[0].label"></span></button></td><td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td><td class="text-center"><button tabindex="-1" ng-if="row[1].date" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[1].selected}" ng-click="$select(row[1].date, 1)" ng-disabled="row[1].disabled"><span ng-class="{\'text-muted\': row[1].muted}" ng-bind="row[1].label"></span></button></td><td><span ng-bind="i == midIndex ? timeSeparator : \' \'"></span></td><td class="text-center"><button tabindex="-1" ng-if="showSeconds && row[2].date" style="width: 100%" type="button" class="btn btn-default" ng-class="{\'btn-primary\': row[2].selected}" ng-click="$select(row[2].date, 2)" ng-disabled="row[2].disabled"><span ng-class="{\'text-muted\': row[2].muted}" ng-bind="row[2].label"></span></button></td><td ng-if="showAM">&nbsp;</td><td ng-if="showAM"><button tabindex="-1" ng-show="i == midIndex - !isAM * 1" style="width: 100%" type="button" ng-class="{\'btn-primary\': !!isAM}" class="btn btn-default" ng-click="$switchMeridian()" ng-disabled="el.disabled">AM</button> <button tabindex="-1" ng-show="i == midIndex + 1 - !isAM * 1" style="width: 100%" type="button" ng-class="{\'btn-primary\': !isAM}" class="btn btn-default" ng-click="$switchMeridian()" ng-disabled="el.disabled">PM</button></td></tr></tbody><tfoot><tr class="text-center"><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 0)"><i class="{{ $iconDown }}"></i></button></th><th>&nbsp;</th><th><button tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 1)"><i class="{{ $iconDown }}"></i></button></th><th>&nbsp;</th><th><button ng-if="showSeconds" tabindex="-1" type="button" class="btn btn-default pull-left" ng-click="$arrowAction(1, 2)"><i class="{{ $iconDown }}"></i></button></th></tr></tfoot></table></div>');
  } ]);
  angular.module('mgcrea.ngStrap.tooltip').run([ '$templateCache', function($templateCache) {
    $templateCache.put('tooltip/tooltip.tpl.html', '<div class="tooltip in" ng-show="title"><div class="tooltip-arrow"></div><div class="tooltip-inner" ng-bind="title"></div></div>');
  } ]);
  angular.module('mgcrea.ngStrap.typeahead').run([ '$templateCache', function($templateCache) {
    $templateCache.put('typeahead/typeahead.tpl.html', '<ul tabindex="-1" class="typeahead dropdown-menu" ng-show="$isVisible()" role="select"><li role="presentation" ng-repeat="match in $matches" ng-class="{active: $index == $activeIndex}"><a role="menuitem" tabindex="-1" ng-click="$select($index, $event)" ng-bind="match.label"></a></li></ul>');
  } ]);
})(window, document);
/**
 * Created by liaohui1080 on 16/2/26. factory.js
 *
 * 服务创建页面
 */

var lhFactory = (function () {


    /*
     * http 服务
     * 参数
     * o ={url:"服务器url地址" ,
     * params:{"参数key":"参数val"}这个会追加到 url后面,
     * success:function(){} 成功消息,
     * error:function(){} 失败消息
     * }
     * */
    var http = ["$http", function ($http) {

        var ajax = {

            "get": function (o) {
                $http({
                    ignoreLoadingBar: true,
                    method: 'get',
                    url: o.url,
                    params: o.data
                }).success(function (data, status, headers, config) {

                    o.success(data, status, headers, config);

                }).error(o.error);

            },
            "post": function (o) {

                $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    method: "post",
                    url: o.url,
                    params: o.params, //这个是url后缀 ?key=val的,不一定会用到
                    data: jQuery.param(o.data) //把json数据 序列化
                }).success(function (data, status, headers, config) {

                    o.success(data, status, headers, config);

                }).error(o.error);

            }

        };

        return ajax;
    }];



    /*
    * {url:url地址,infoSuccess:成功消息内容,infoError:失败消息内容 ,infoShow:true false 控制是否显示 ,success:成功方法}
    *
    *
    * */
    var ajax = ["$http", 'cfpLoadingBar', 'ngNotify', function ($http, cfpLoadingBar, ngNotify) {

        var ajax = {


            "get": function (o) {
               // cfpLoadingBar.start();
                var load=layer.msg('正在努力加载中', {icon: 16});
                $http({
                    ignoreLoadingBar: true,
                    method: 'get',
                    url: o.url,
                    params: o.data
                }).success(function (data, status, headers, config) {
                   // cfpLoadingBar.complete();
                   layer.close(load);
                    var infoSuccess = o.infoSuccess ? o.infoSuccess : data.info ? data.info : "成功";
                    var infoError = o.infoSuccess ? o.infoSuccess : data.info ? data.info :  '数据格式错误';

                    if (data.status == 1) {

                        if(o.infoShow){

                            //ngNotify.set(infoSuccess, {
                            //    position: 'top',
                            //    duration: 1500,
                            //    type: "success"
                            //});

                            layer.msg(infoSuccess);
                        }

                        o.success(data, status, headers, config);

                    } else {
                        if(o.infoShow) {

                            //ngNotify.set(infoError, {
                            //    position: 'top',
                            //    duration: 1500,
                            //    type: "warn"
                            //});

                            layer.msg(infoError, function(){
                                //回震动提示的
                            });
                        }

                    }


                }).error(function (e) {
                    alert("服务器错误");
                    //console.log(e);
                });
            },
            "post": function (o) {
                cfpLoadingBar.start();
                $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    method: "post",
                    url: o.url,
                    params: o.params, //这个是url后缀 ?key=val的,不一定会用到
                    data: jQuery.param(o.data) //把json数据 序列化
                }).success(function (data, status, headers, config) {
                    cfpLoadingBar.complete();

                    var infoSuccess = o.infoSuccess ? o.infoSuccess : data.info ? data.info : "成功";
                    var infoError = o.infoSuccess ? o.infoSuccess : data.info ? data.info :  '数据格式错误';

                    if (data.status == 1) {

                        if(o.infoShow){

                            ngNotify.set(infoSuccess, {
                                position: 'top',
                                duration: 1500,
                                type: "success"
                            });
                        }

                        o.success(data, status, headers, config);

                    } else {
                        if(o.infoShow) {

                            ngNotify.set(infoError, {
                                position: 'top',
                                duration: 1500,
                                type: "warn"
                            });
                        }

                    }


                }).error(function (e) {
                    alert("服务器错误");
                    //console.log(e);
                });
            }
        };

        return ajax;
    }];

    return {
        http: http,
        ajax: ajax

    };

})();



/**
 * Created by liaohui1080 on 16/2/26. factory.js
 *
 * 过滤器创建页面
 */

var lhFilter=(function(){



    //分页过滤器
    var pageStart=[function () {
        return function(input, start) {
            start = +start;

            if (input){
                return input.slice(start);
            }

        }

    }];


    // Y , N 转汉字
    var YNtoHanzi=[function () {
        return function(input, str) {

            if(input=='Y'){
                str="启用"
            }
            if(input=='N'){
                str="禁用"
            }

            return str

        }

    }];


    // Y , N 在线离线
    var YNtoZaixian=[function () {
        return function(input, str) {

            if(input=='Y'){
                str="在线"
            }
            if(input=='N'){
                str="离线"
            }

            return str

        }

    }];

    //ui-select菜单必须用到的
    var uiSelectPropsFilter=[function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                var keys = Object.keys(props);

                items.forEach(function(item) {
                    var itemMatches = false;

                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }];


    return {
        uiSelectPropsFilter:uiSelectPropsFilter,
        YNtoHanzi:YNtoHanzi,
        YNtoZaixian:YNtoZaixian,
        pageStart:pageStart
    };

})();







