const Polyglot = require('node-polyglot');

class Translation {

    constructor() {
        this.polyglot = new Polyglot();
        this.t = this.t.bind(this);
        this.initTranslations();

        // Define supported languages
        this.supportedLanguages = {
            en: true,
            ru: true,
            hy: true,
        };

        // Default language
        this.language = 'en';
    }

    setLanguage(language) {

        // If passed language is not supported then choose {en} as a default language
        if(this.supportedLanguages[language]) {
            this.language = language;
        } else {
            this.language = 'en';
        }
    }

    initTranslations() {
        this.polyglot.extend({
            road: {
                findV: {
                    en: 'Within %{T} hours, the car crossed %{S} km. Find the speed of the car.',
                    ru: 'Машина проехала %{S} км за %{T} часа. Найдите скорость автомобиля.',
                    hy: 'Ավտոմեքենան %{S} կմ ճանապարհն անցավ %{T} ժամում. Գտնել ավտոմեքենայի արագությունը.',
                },
                findT: {
                    en: 'The car crossed %{S} km with a speed of %{V} km/hr. How long did the car spent on the road?',
                    ru: 'Машина проехала %{S} км со скоростью %{V} км/ч. Как долго машина шел по дороге?',
                    hy: 'Ավտոմեքենան %{S} կիլոմետրն անցավ %{V} կմ/ժ արագությամբ. Որքա՞ն ժամանակ ձախսվեց ճանապարհին.',
                },
                findS: {
                    en: 'A car moving with a speed of %{V} km/hr. How far will it pass in %{T} hours?',
                    ru: 'Автомобиль движется со скоростью %{V} км/ч. Сколько километров пройдет через %{T} часов?',
                    hy: 'Մեքենան ընթանում է %{V} կմ/ժ արագությամբ. Որքա՞ն ճանապարհ կանցնի նա %{T} ժամում.',
                },
            },
        });
    }

    t(key, options, language = 'en') {
        // Set language
        this.setLanguage(language);

        // Concat language with key
        const keyWithLanguage = `${key}.${this.language}`;

        // Do translation
        return this.polyglot.t(keyWithLanguage, options);
    }
}

const tr = new Translation();

module.exports = tr;
