import PasswordValidator from 'password-validator';
import getStrength from './password-strength';

const DEFAULT_MIN_LENGTH = 10;
const DEFAULT_MAX_LENGTH = 128;
const AVAILABLE_TAGS: TagOptions[] = ['worst', 'bad', 'weak', 'good', 'strong'];

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
  }
): IErrors => {
  return {
    validation: 'min',
    arguments: argument.minLength,
    message: `Must contain at least ${argument.minLength} characters`,
    satisfied: new PasswordValidator()
      .min(argument.minLength)
      .validate(pw) as boolean,
  };
};

const max = (pw: string, argument: { maxLength: number }): IErrors => {
  return {
    validation: 'max',
    arguments: argument.maxLength,
    message: `Must contain at most ${argument.maxLength} characters`,
    satisfied: new PasswordValidator()
      .max(argument.maxLength)
      .validate(pw) as boolean,
  };
};

const hasUppercase = (pw: string): IErrors => {
  return {
    validation: 'uppercase',
    message: 'At least one uppercase letter',
    satisfied: new PasswordValidator().uppercase().validate(pw) as boolean,
  };
};

const hasLowercase = (pw: string): IErrors => {
  return {
    validation: 'lowercase',
    message: 'At least one lowercase letter',
    satisfied: new PasswordValidator()
      .has()
      .lowercase()
      .validate(pw) as boolean,
  };
};

const hasSpace = (pw: string): IErrors => {
  return {
    validation: 'space',
    message: 'Can not contain spaces',
    satisfied: new PasswordValidator()
      .has()
      .not()
      .spaces()
      .validate(pw) as boolean,
  };
};

const hasSymbol = (pw: string): IErrors => {
  return {
    validation: 'symbol',
    message: 'At least one special character',
    satisfied: new PasswordValidator()
      .has()
      .symbols()
      .validate(pw) as boolean,
  };
};

const hasNumber = (pw: string): IErrors => {
  return {
    validation: 'number',
    message: 'Must contain numbers',
    satisfied: new PasswordValidator()
      .has()
      .digits()
      .validate(pw) as boolean,
  };
};

const hasSequential = (pw: string): IErrors => {
  const regex = /(\w)\1+/;
  return {
    validation: 'sequential',
    message: 'No sequential characters',
    satisfied: !regex.test(pw),
  };
};

const passwdScore = (
  pw: string,
  argument: { minAcceptable: TagOptions }
): IErrors => {
  const pwStrength = getStrength(pw);
  const isZeroScore = pwStrength[0] === 0;
  const tag = isZeroScore ? 'worst' : (pwStrength[1] as TagOptions);

  const message = `Password level: ${tag}`;

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

const PwValidator = ({ password, options, config }: Props): Response => {
  const validationConfig = {
    minLength: config?.length?.minLength ?? DEFAULT_MIN_LENGTH,
    maxLength: config?.length?.maxLength ?? DEFAULT_MAX_LENGTH,
    minAcceptable: config?.scoreConfig?.minAcceptable ?? 'strong',
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

export default PwValidator;
