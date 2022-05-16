import { cond, defaultTo, equals, gt, lte, pipe, reverse } from 'ramda';

const SCORE_EMPTY = 0;
const SCORE_WORST = 28;
const SCORE_BAD = 35;
const SCORE_WEAK = 59;
const SCORE_GOOD = 85;

const REQ_CHAR = 0;
const MULT_MID_CHAR = 2;
const MULT_CONSEC_ALPHA_UC = 2;
const MULT_CONSEC_ALPHA_LC = 2;
const MULT_CONSEC_NUMBER = 2;
const MULT_SEQ_ALPHA = 3;
const MULT_SEQ_NUMBER = 3;
const MULT_SEQ_SYMBOL = 3;
const MULT_LENGHT = 4;
const MULT_NUMBER = 4;
const MULT_SYMBOL = 6;
const ALPHAS = 'abcdefghijklmnopqrstuvwxyz';
const NUMERICS = '01234567890';
const SYMBOLS = ')!@#$%^&*()';
const MIN_PWD_LEN = 8;

// Used reference http://www.passwordmeter.com/
export function checkPass(pwd: string): number {
  let score = 0;
  let length = 0;
  let alphaUC = 0;
  let alphaLC = 0;
  let number = 0;
  let symbol = 0;
  let midChar = 0;
  let requirements = 0;
  let unqChar = 0;
  let repChar = 0;
  let repInc = 0;
  let consecAlphaUC = 0;
  let consecAlphaLC = 0;
  let consecNumber = 0;
  let seqAlpha = 0;
  let seqNumber = 0;
  let seqSymbol = 0;
  let minReqChars = 4;
  let tmpAlphaUC = '';
  let tmpAlphaLC = '';
  let tmpNumber = '';

  if (pwd) {
    score = pwd.length * MULT_LENGHT;
    length = pwd.length;
    const arrPwd = pwd.replace(/\s+/g, '').split(/\s*/);
    const arrPwdLen = arrPwd.length;
    /*
     * Loop through password to check for Symbol,
     * Numeric, Lowercase and Uppercase pattern matches
     */
    for (let a = 0; a < arrPwdLen; a++) {
      if (arrPwd[a].match(/[A-Z]/g)) {
        if (tmpAlphaUC !== '') {
          if (tmpAlphaUC === arrPwd[a]) {
            consecAlphaUC++;
          }
        }
        tmpAlphaUC = arrPwd[a];
        alphaUC++;
      } else if (arrPwd[a].match(/[a-z]/g)) {
        if (tmpAlphaLC !== '') {
          if (tmpAlphaLC === arrPwd[a]) {
            consecAlphaLC++;
          }
        }
        tmpAlphaLC = arrPwd[a];
        alphaLC++;
      } else if (arrPwd[a].match(/[0-9]/g)) {
        if (a > 0 && a < arrPwdLen - 1) {
          midChar++;
        }
        if (tmpNumber !== '') {
          if (tmpNumber === arrPwd[a]) {
            consecNumber++;
          }
        }
        tmpNumber = arrPwd[a];
        number++;
      } else if (arrPwd[a].match(/[^a-zA-Z0-9_]/g)) {
        if (a > 0 && a < arrPwdLen - 1) {
          midChar++;
        }
        symbol++;
      }
      /* Internal loop through password to check for repeat characters */
      let bCharExists = false;
      for (let b = 0; b < arrPwdLen; b++) {
        /* Repeat character exists */
        if (arrPwd[a] === arrPwd[b] && a !== b) {
          bCharExists = true;
          /*
           * Calculate icrement deduction based on
           * proximity to identical characters
           * Deduction is incremented each time
           * a new match is discovered
           * Deduction amount is based on total
           * password length divided by the
           * difference of distance between currently selected match
           */
          repInc += Math.abs(arrPwdLen / (b - a));
        }
      }
      if (bCharExists) {
        repChar++;
        unqChar = arrPwdLen - repChar;
        repInc = unqChar ? Math.ceil(repInc / unqChar) : Math.ceil(repInc);
      }
    }
    /* Check for sequential alpha string patterns (forward and reverse) */
    for (let s = 0; s < 23; s++) {
      const sFwd = ALPHAS.substring(s, s + 3);
      const sRev = reverse(sFwd);
      if (
        pwd.toLowerCase().includes(sFwd) ||
        pwd.toLowerCase().includes(sRev)
      ) {
        seqAlpha++;
      }
    }
    /* Check for sequential numeric string patterns (forward and reverse) */
    for (let s = 0; s < 8; s++) {
      const sFwd = NUMERICS.substring(s, s + 3);
      const sRev = reverse(sFwd);
      if (
        pwd.toLowerCase().includes(sFwd) ||
        pwd.toLowerCase().includes(sRev)
      ) {
        seqNumber++;
      }
    }
    /* Check for sequential symbol string patterns (forward and reverse) */
    for (let s = 0; s < 8; s++) {
      const sFwd = SYMBOLS.substring(s, s + 3);
      const sRev = reverse(sFwd);
      if (
        pwd.toLowerCase().includes(sFwd) ||
        pwd.toLowerCase().includes(sRev)
      ) {
        seqSymbol++;
      }
    }
    /* Modify overall score value based on usage vs requirements */
    /* General point assignment */
    if (alphaUC > 0 && alphaUC < length) {
      score = score + (length - alphaUC) * 2;
    }
    if (alphaLC > 0 && alphaLC < length) {
      score = score + (length - alphaLC) * 2;
    }
    if (number > 0 && number < length) {
      score = score + number * MULT_NUMBER;
    }
    if (symbol > 0) {
      score = score + symbol * MULT_SYMBOL;
    }
    if (midChar > 0) {
      score = score + midChar * MULT_MID_CHAR;
    }
    /* Point deductions for poor practices */
    // Only Letters
    if ((alphaLC > 0 || alphaUC > 0) && symbol === 0 && number === 0) {
      score = score - length;
    }
    // Only Numbers
    if (alphaLC === 0 && alphaUC === 0 && symbol === 0 && number > 0) {
      score = score - length;
    }
    if (repChar > 0) {
      // Same character exists more than once
      score = score - repInc;
    }
    if (consecAlphaUC > 0) {
      // Consecutive Uppercase Letters exist
      score = score - consecAlphaUC * MULT_CONSEC_ALPHA_UC;
    }
    if (consecAlphaLC > 0) {
      // Consecutive Lowercase Letters exist
      score = score - consecAlphaLC * MULT_CONSEC_ALPHA_LC;
    }
    if (consecNumber > 0) {
      // Consecutive Numbers exist
      score = score - consecNumber * MULT_CONSEC_NUMBER;
    }
    // Sequential alpha strings exist (3 characters or more)
    if (seqAlpha > 0) {
      score = score - seqAlpha * MULT_SEQ_ALPHA;
    }
    // Sequential numeric strings exist (3 characters or more)
    if (seqNumber > 0) {
      score = score - seqNumber * MULT_SEQ_NUMBER;
    }
    // Sequential symbol strings exist (3 characters or more)
    if (seqSymbol > 0) {
      score = score - seqSymbol * MULT_SEQ_SYMBOL;
    }
    requirements = REQ_CHAR;
    if (pwd.length >= MIN_PWD_LEN) {
      minReqChars = 3;
    }
    // One or more required characters exist
    if (requirements > minReqChars) {
      score = score + requirements * 2;
    }

    if (score < 0) {
      return 0;
    }

    return score;
  }

  return 0;
}

export default pipe(
  defaultTo(''),
  checkPass,
  cond([
    [equals(SCORE_EMPTY), score => [score, 'empty', '']],
    [
      gt(SCORE_WORST),
      score => [score, 'worst', 'Please create a stronger password!'],
    ],
    [
      gt(SCORE_BAD),
      score => [score, 'bad', 'Please create a stronger password!'],
    ],
    [
      gt(SCORE_WEAK),
      score => [score, 'weak', 'Good password, but can be better!'],
    ],
    [gt(SCORE_GOOD), score => [score, 'good', 'Very good!']],
    [lte(SCORE_GOOD), score => [score, 'strong', 'Excellent!']],
  ])
);
