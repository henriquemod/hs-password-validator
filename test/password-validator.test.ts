import { expect } from "chai";
import { PwValidator } from "../src/password-validator";

describe("PasswordValidator", () => {
  describe("min", () => {
    it("should return false if the password is longer than the minimum length", () => {
      const password = "123456789";
      const minLength = 8;
      const result = PwValidator({
        password,
        options: ["min"],
        config: { length: { minLength } },
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].arguments).to.be.lessThanOrEqual(password.length);
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return true if the password is shorter than the minimum length", () => {
      const password = "1234567";
      const minLength = 8;
      const result = PwValidator({
        password,
        options: ["min"],
        config: { length: { minLength } },
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].arguments).to.be.greaterThan(password.length);
      expect(result.hasInvalidFields).to.be.true;
    });
  });

  describe("max", () => {
    it("should return false if the password is shorter than the maximum length", () => {
      const password = "123456";
      const maxLength = 8;
      const result = PwValidator({
        password,
        options: ["max"],
        config: { length: { maxLength } },
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].arguments).to.be.greaterThanOrEqual(
        password.length
      );
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return true if the password is longer than the maximum length", () => {
      const password = "123456789";
      const maxLength = 8;
      const result = PwValidator({
        password,
        options: ["max"],
        config: { length: { maxLength } },
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].arguments).to.be.lessThan(password.length);
      expect(result.hasInvalidFields).to.be.true;
    });
  });
});
