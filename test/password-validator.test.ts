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

  describe("uppercase", () => {
    it("should return false if password has at least one uppercase letter", () => {
      const password = "Abcdefgh";
      const result = PwValidator({
        password,
        options: ["uppercase"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return true if password has no uppercase letter", () => {
      const password = "abcdefgh";
      const result = PwValidator({
        password,
        options: ["uppercase"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.false;
      expect(result.hasInvalidFields).to.be.true;
    });
  });

  describe("lowercase", () => {
    it("should return false if password has at least one lowercase letter", () => {
      const password = "ABCDEFg";
      const result = PwValidator({
        password,
        options: ["lowercase"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return true if password has no lowercase letter", () => {
      const password = "ABCDEFG";
      const result = PwValidator({
        password,
        options: ["lowercase"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.false;
      expect(result.hasInvalidFields).to.be.true;
    });
  });

  describe("symbol", () => {
    it("should return false if password has at least one symbol", () => {
      const password = "@bcdefgh";
      const result = PwValidator({
        password,
        options: ["symbol"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return true if password has no symbol", () => {
      const password = "abcdefgh";
      const result = PwValidator({
        password,
        options: ["symbol"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.false;
      expect(result.hasInvalidFields).to.be.true;
    });
  });

  describe("number", () => {
    it("should return false if password has at least one number", () => {
      const password = "1abcdefgh";
      const result = PwValidator({
        password,
        options: ["number"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return true if password has no number", () => {
      const password = "abcdefgh";
      const result = PwValidator({
        password,
        options: ["number"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.false;
      expect(result.hasInvalidFields).to.be.true;
    });
  });

  describe("space", () => {
    it("should return false if password hasn't space", () => {
      const password = "abcdefgh";
      const result = PwValidator({
        password,
        options: ["space"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return true if password has space", () => {
      const password = "abcd efgh";
      const result = PwValidator({
        password,
        options: ["space"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.false;
      expect(result.hasInvalidFields).to.be.true;
    });
  });

  describe("sequential", () => {
    it("should return false if password hasn't sequential letters", () => {
      const password = "abcdefgh";
      const result = PwValidator({
        password,
        options: ["sequential"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return true if password has sequential letters", () => {
      const password = "abcddefgh";
      const result = PwValidator({
        password,
        options: ["sequential"],
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.false;
      expect(result.hasInvalidFields).to.be.true;
    });
  });

  describe("strength", () => {
    it("should return strong when strong password is provided", () => {
      const password = "ASDasd@#$123_";
      const result = PwValidator({
        password,
        options: ["strength"],
        config: { scoreConfig: { minAcceptable: "strong" } },
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.data[0].tag).to.be.equal("strong");
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return good when good password is provided", () => {
      const password = "ASDasd$12";
      const result = PwValidator({
        password,
        options: ["strength"],
        config: { scoreConfig: { minAcceptable: "good" } },
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.data[0].tag).to.be.equal("good");
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return weak when weak password is provided", () => {
      const password = "ASDasd11";
      const result = PwValidator({
        password,
        options: ["strength"],
        config: { scoreConfig: { minAcceptable: "weak" } },
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.data[0].tag).to.be.equal("weak");
      expect(result.hasInvalidFields).to.be.false;
    });

    it("should return bad when bad password is provided", () => {
      const password = "ASDasd";
      const result = PwValidator({
        password,
        options: ["strength"],
        config: { scoreConfig: { minAcceptable: "bad" } },
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.data[0].tag).to.be.equal("bad");
      expect(result.hasInvalidFields).to.be.false;
    });

    it("should return worst when worst password is provided", () => {
      const password = "asd";
      const result = PwValidator({
        password,
        options: ["strength"],
        config: { scoreConfig: { minAcceptable: "worst" } },
      });
      expect(result.data.length).to.be.equal(1);
      expect(result.data[0].satisfied).to.be.true;
      expect(result.data[0].tag).to.be.equal("worst");
      expect(result.hasInvalidFields).to.be.false;
    });
  });

  describe("Multiples Configs", () => {
    it("should return false if the password matches min/max/uppercase requirements", () => {
      const password = "123123Abc";
      const minLength = 8;
      const maxLength = 16;
      const result = PwValidator({
        password,
        options: ["min", "max", "uppercase"],
        config: { length: { minLength, maxLength } },
      });
      expect(result.data.length).to.be.equal(3);
      expect(result.data.some((x) => x.satisfied === false)).to.be.false;
      expect(result.hasInvalidFields).to.be.false;
    });
    it("should return true if password do not matches with one of min/max/uppercase requirements", () => {
      const passwordCase1 = "12312A";
      const passwordCase2 = "123123Abccc";
      const passwordCase3 = "123123abc";
      const passwordCase4 = "123123abcccc";
      const passwordCase5 = "12abc";
      const minLength = 8;
      const maxLength = 10;
      const validate = (pw: string) =>
        PwValidator({
          password: pw,
          options: ["min", "max", "uppercase"],
          config: { length: { minLength, maxLength } },
        });

      const resultCase1 = validate(passwordCase1);
      const resultCase2 = validate(passwordCase2);
      const resultCase3 = validate(passwordCase3);
      const resultCase4 = validate(passwordCase4);
      const resultCase5 = validate(passwordCase5);

      expect(resultCase1.data.some((x) => x.satisfied === false)).to.be.true;
      expect(resultCase2.data.some((x) => x.satisfied === false)).to.be.true;
      expect(resultCase3.data.some((x) => x.satisfied === false)).to.be.true;
      expect(
        resultCase4.data.filter((x) => x.satisfied === false).length
      ).to.be.equal(2);
      expect(
        resultCase5.data.filter((x) => x.satisfied === false).length
      ).to.be.equal(2);
    });
  });
});
