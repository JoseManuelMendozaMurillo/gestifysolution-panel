export default class RegexUtils {
    static readonly RFC_PATTERN: RegExp = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    static readonly LATITUDE_PATTERN: RegExp = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    static readonly LONGITUDE_PATTERN: RegExp = /^[-+]?((1[0-7]\d|[1-9]?\d)(\.\d+)?|180(\.0+)?)$/;
    static readonly NUMBERS_ONLY_PATTERN: RegExp = /^\d*$/;
    static readonly CAPITAL_LETTERS_ONLY_PATTERN: RegExp = /^[A-Z]+$/;
    static readonly POSTAL_CODE_PATTERN: RegExp = /^\d{5}$/;
    static readonly PHONE_NUMBER_PATTERN: RegExp = /^\+\d{2} \d{10}$/;
    static readonly EMAIL_PATTERN: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    static readonly USERNAME_PATTERN: RegExp = /^[a-zA-Z0-9_.@-]+$/;
    static readonly NAME_PATTERN: RegExp = /^[a-zA-ZñÑ ]+$/;
}