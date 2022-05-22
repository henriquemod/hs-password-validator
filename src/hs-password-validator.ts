import LibPasswordValidator from 'password-validator';
import getStrength from './password-strength';
import messages from './messages.json';

const StringFormat = (str: string, ...args: string[]) =>
  str.replace(/{(\d+)}/g, (_, index) => args[index]);

const DEFAULT_MIN_LENGTH = 10;
const DEFAULT_MAX_LENGTH = 128;
const AVAILABLE_TAGS: TagOptions[] = ['worst', 'bad', 'weak', 'good', 'strong'];

type Language = 'en-US' | 'pt-BR';
type TagOptions = 'worst' | 'bad' | 'weak' | 'good' | 'strong';
export type ErrorsOutput =
  | 'min'
  | 'max'
  | 'uppercase'
  | 'lowercase'
  | 'symbol'
  | 'number'
  | 'space'
  | 'sequential'
  | 'strength';

export interface IErrors {
  validation: ErrorsOutput;
  arguments?: number;
  inverted?: boolean;
  tag?: string;
  message: string;
  satisfied: boolean | undefined;
}

export interface Response {
  hasInvalidFields: boolean;
  data: IErrors[];
}

interface ConfigLengthProps {
  minLength?: number;
  maxLength?: number;
}

interface ConfigScoreOptions {
  minAcceptable: TagOptions;
}

export interface ConfigProps {
  length?: ConfigLengthProps;
  scoreConfig?: ConfigScoreOptions;
  lang?: Language;
}

interface Props {
  password: string;
  options?: ErrorsOutput[];
  config?: ConfigProps;
}

const min = (
  pw: string,
  argument: {
    minLength: number;
    maxLength: number;
    minAcceptable: TagOptions;
    lang: Language;
  }
): IErrors => {
  return {
    validation: 'min',
    arguments: argument.minLength,
    message: StringFormat(
      messages[argument.lang].min,
      argument.minLength.toString()
    ),
    satisfied: new LibPasswordValidator()
      .min(argument.minLength)
      .validate(pw) as boolean,
  };
};

const max = (
  pw: string,
  argument: { maxLength: number; lang: Language }
): IErrors => {
  return {
    validation: 'max',
    arguments: argument.maxLength,
    message: StringFormat(
      messages[argument.lang].max,
      argument.maxLength.toString()
    ),
    satisfied: new LibPasswordValidator()
      .max(argument.maxLength)
      .validate(pw) as boolean,
  };
};

const hasUppercase = (pw: string, argument: { lang: Language }): IErrors => {
  return {
    validation: 'uppercase',
    message: messages[argument.lang].uppercase,
    satisfied: new LibPasswordValidator().uppercase().validate(pw) as boolean,
  };
};

const hasLowercase = (pw: string, argument: { lang: Language }): IErrors => {
  return {
    validation: 'lowercase',
    message: messages[argument.lang].lowercase,
    satisfied: new LibPasswordValidator()
      .has()
      .lowercase()
      .validate(pw) as boolean,
  };
};

const hasSpace = (pw: string, argument: { lang: Language }): IErrors => {
  return {
    validation: 'space',
    message: messages[argument.lang].space,
    satisfied: new LibPasswordValidator()
      .has()
      .not()
      .spaces()
      .validate(pw) as boolean,
  };
};

const hasSymbol = (pw: string, argument: { lang: Language }): IErrors => {
  return {
    validation: 'symbol',
    message: messages[argument.lang].symbol,
    satisfied: new LibPasswordValidator()
      .has()
      .symbols()
      .validate(pw) as boolean,
  };
};

const hasNumber = (pw: string, argument: { lang: Language }): IErrors => {
  return {
    validation: 'number',
    message: messages[argument.lang].number,
    satisfied: new LibPasswordValidator()
      .has()
      .digits()
      .validate(pw) as boolean,
  };
};

const hasSequential = (pw: string, argument: { lang: Language }): IErrors => {
  const regex = /(\w)\1+/;
  return {
    validation: 'sequential',
    message: messages[argument.lang].hasSequential,
    satisfied: !regex.test(pw),
  };
};

const passwdScore = (
  pw: string,
  argument: { minAcceptable: TagOptions; lang: Language }
): IErrors => {
  const pwStrength = getStrength(pw);
  const isZeroScore = pwStrength[0] === 0;
  const tag = isZeroScore ? 'worst' : (pwStrength[1] as TagOptions);

  const message = StringFormat(messages[argument.lang].strength, tag);

  return {
    validation: 'strength',
    tag,
    message,
    satisfied:
      AVAILABLE_TAGS.indexOf(tag) >=
      AVAILABLE_TAGS.indexOf(argument.minAcceptable),
  } as IErrors;
};

const isValidInput = (errors: IErrors[]): boolean => {
  return errors.some(error => error.satisfied === false);
};

const casesMap: Map<
  string,
  (
    password: string,
    argument: {
      minLength: number;
      maxLength: number;
      minAcceptable: TagOptions;
      lang: Language;
    }
  ) => IErrors
> = new Map([
  ['min', min],
  ['max', max],
  ['uppercase', hasUppercase],
  ['lowercase', hasLowercase],
  ['symbol', hasSymbol],
  ['number', hasNumber],
  ['space', hasSpace],
  ['sequential', hasSequential],
  ['strength', passwdScore],
]);

export const PasswordValidator = ({
  password,
  options,
  config,
}: Props): Response => {
  const validationConfig = {
    minLength: config?.length?.minLength ?? DEFAULT_MIN_LENGTH,
    maxLength: config?.length?.maxLength ?? DEFAULT_MAX_LENGTH,
    minAcceptable: config?.scoreConfig?.minAcceptable ?? 'strong',
    lang: config?.lang ?? 'en-US',
  };

  const result: IErrors[] = [];

  if (options) {
    options.forEach(option => {
      const validation = casesMap.get(option);
      validation && result.push(validation(password, validationConfig));
    });
  } else {
    casesMap.forEach(value => {
      result.push(value(password, validationConfig));
    });
  }

  return {
    hasInvalidFields: isValidInput(result),
    data: result,
  };
};
