import { SpeechNotifications } from "./SpeechNotifications.js";

describe("SpeechNotifications", () => {
  let speechNotifications: SpeechNotifications;
  let mockSpeechSynthesis: any;
  let mockUtterance: any;

  beforeEach(() => {
    mockUtterance = {
      text: "",
      pitch: 1,
      rate: 1,
      volume: 10,
      lang: "zh-CN",
    };

    mockSpeechSynthesis = {
      speak: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      cancel: jest.fn(),
      speaking: false,
    };

    global.SpeechSynthesisUtterance = jest.fn(() => mockUtterance);
    global.speechSynthesis = mockSpeechSynthesis;

    speechNotifications = new SpeechNotifications();
  });

  describe("constructor", () => {
    it("should initialize with default options", () => {
      expect(mockUtterance.pitch).toBe(1);
      expect(mockUtterance.rate).toBe(1);
      expect(mockUtterance.volume).toBe(10);
      expect(mockUtterance.lang).toBe("zh-CN");
    });

    it("should override default options with provided options", () => {
      speechNotifications = new SpeechNotifications({
        pitch: 2,
        rate: 0.5,
        volume: 5,
        lang: "en-US",
      });

      expect(mockUtterance.pitch).toBe(2);
      expect(mockUtterance.rate).toBe(0.5);
      expect(mockUtterance.volume).toBe(5);
      expect(mockUtterance.lang).toBe("en-US");
    });
  });

  describe("play", () => {
    it("should set text and call speak", () => {
      speechNotifications.play("测试文本");

      expect(mockUtterance.text).toBe("测试文本");
      expect(mockSpeechSynthesis.speak).toHaveBeenCalledWith(mockUtterance);
    });

    it("should resume if paused", () => {
      speechNotifications.play("测试文本");
      mockSpeechSynthesis.speaking = true;
      speechNotifications.pause();

      speechNotifications.resume();

      expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
    });
  });

  describe("pause", () => {
    it("should pause speech synthesis when speaking", () => {
      mockSpeechSynthesis.speaking = true;

      speechNotifications.pause();

      expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
    });

    it("should not pause when not speaking", () => {
      mockSpeechSynthesis.speaking = false;

      speechNotifications.pause();

      expect(mockSpeechSynthesis.pause).not.toHaveBeenCalled();
    });
  });

  describe("resume", () => {
    it("should resume speech synthesis when paused", () => {
      mockSpeechSynthesis.speaking = true;
      speechNotifications.pause();
      speechNotifications.resume();

      expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
    });
  });

  describe("cancel", () => {
    it("should cancel speech synthesis when speaking", () => {
      mockSpeechSynthesis.speaking = true;

      speechNotifications.cancel();

      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });

    it("should not cancel when not speaking", () => {
      mockSpeechSynthesis.speaking = false;

      speechNotifications.cancel();

      expect(mockSpeechSynthesis.cancel).not.toHaveBeenCalled();
    });
  });
});
