import { expect } from 'chai';
import PasswordValidator from '../src';

describe('Translations', () => {
  // ANCHOR - English
  describe('en-US', () => {
    it('should return min text in english if none lang were provided', () => {
      const password = 'minpw';
      const minLength = 6;
      const result = PasswordValidator({
        password,
        options: ['min'],
        config: { length: { minLength } },
      });
      expect(result.data[0].message).to.be.equal(
        `Must contain as least ${minLength} characters`
      );
    });
    it('should return max text in english if none lang were provided', () => {
      const password = 'maxpw';
      const maxLength = 3;
      const result = PasswordValidator({
        password,
        options: ['max'],
        config: { length: { maxLength } },
      });
      expect(result.data[0].message).to.be.equal(
        `Must contain as most ${maxLength} characters`
      );
    });
    it('should return uppercase text in english if none lang were provided', () => {
      const password = 'nouppercasepassword';
      const result = PasswordValidator({
        password,
        options: ['uppercase'],
      });
      expect(result.data[0].message).to.be.equal(
        'At least one uppercase letter'
      );
    });
    it('should return lowercase text in english if none lang were provided', () => {
      const password = 'HASNOLOWERCASE';
      const result = PasswordValidator({
        password,
        options: ['lowercase'],
      });
      expect(result.data[0].message).to.be.equal(
        'At least one lowercase letter'
      );
    });
    it('should return space text in english if none lang were provided', () => {
      const password = 'pw with space';
      const result = PasswordValidator({
        password,
        options: ['space'],
      });
      expect(result.data[0].message).to.be.equal('Can not contain spaces');
    });
    it('should return symbol text in english if none lang were provided', () => {
      const password = 'pwwithnosymbol';
      const result = PasswordValidator({
        password,
        options: ['symbol'],
      });
      expect(result.data[0].message).to.be.equal(
        'At least one special character'
      );
    });
    it('should return number text in english if none lang were provided', () => {
      const password = 'pwwithnosymbol';
      const result = PasswordValidator({
        password,
        options: ['number'],
      });
      expect(result.data[0].message).to.be.equal('Must contain numbers');
    });
    it('should return sequential text in english if none lang were provided', () => {
      const password = 'pwwithsequentiallll';
      const result = PasswordValidator({
        password,
        options: ['sequential'],
      });
      expect(result.data[0].message).to.be.equal(
        'Must not contain sequential characters'
      );
    });
    it('should return strength text in english if none lang were provided', () => {
      const password = 'worstpw';
      const result = PasswordValidator({
        password,
        options: ['strength'],
      });
      expect(result.data[0].message).to.be.equal('Password strength: worst');
    });
  });
  // ANCHOR - Portuguese BR
  describe('pt-BR', () => {
    it('should return min text in portuguese br', () => {
      const password = 'minpw';
      const minLength = 6;
      const result = PasswordValidator({
        password,
        options: ['min'],
        config: { length: { minLength }, lang: 'pt-BR' },
      });
      expect(result.data[0].message).to.be.equal(
        `Deve conter no mínimo ${minLength} caracteres`
      );
    });
    it('should return max text in portuguese br', () => {
      const password = 'maxpw';
      const maxLength = 3;
      const result = PasswordValidator({
        password,
        options: ['max'],
        config: { length: { maxLength }, lang: 'pt-BR' },
      });
      expect(result.data[0].message).to.be.equal(
        `Deve conter no máximo ${maxLength} caracteres`
      );
    });
    it('should return uppercase text in portuguese br', () => {
      const password = 'nouppercasepassword';
      const result = PasswordValidator({
        password,
        options: ['uppercase'],
        config: { lang: 'pt-BR' },
      });
      expect(result.data[0].message).to.be.equal(
        'Pelo menos uma letra maiúscula'
      );
    });
    it('should return lowercase text in portuguese br', () => {
      const password = 'HASNOLOWERCASE';
      const result = PasswordValidator({
        password,
        options: ['lowercase'],
        config: { lang: 'pt-BR' },
      });
      expect(result.data[0].message).to.be.equal(
        'Pelo menos uma letra minúscula'
      );
    });
    it('should return space text in portuguese br', () => {
      const password = 'pw with space';
      const result = PasswordValidator({
        password,
        options: ['space'],
        config: { lang: 'pt-BR' },
      });
      expect(result.data[0].message).to.be.equal('Não pode conter espaços');
    });
    it('should return symbol text in portuguese br', () => {
      const password = 'pwwithnosymbol';
      const result = PasswordValidator({
        password,
        options: ['symbol'],
        config: { lang: 'pt-BR' },
      });
      expect(result.data[0].message).to.be.equal(
        'Pelo menos um caractere especial'
      );
    });
    it('should return number text in portuguese br', () => {
      const password = 'pwwithnosymbol';
      const result = PasswordValidator({
        password,
        options: ['number'],
        config: { lang: 'pt-BR' },
      });
      expect(result.data[0].message).to.be.equal('Deve conter números');
    });
    it('should return sequential text in portuguese br', () => {
      const password = 'pwwithsequentiallll';
      const result = PasswordValidator({
        password,
        options: ['sequential'],
        config: { lang: 'pt-BR' },
      });
      expect(result.data[0].message).to.be.equal(
        'Não pode conter sequências de caracteres'
      );
    });
    it('should return strength text in portuguese br', () => {
      const password = 'worstpw';
      const result = PasswordValidator({
        password,
        options: ['strength'],
        config: { lang: 'pt-BR' },
      });
      expect(result.data[0].message).to.be.equal('Força da senha: worst');
    });
  });
});
