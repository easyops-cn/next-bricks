export type SpeechNotificationsOptions = Pick<
  SpeechSynthesisUtterance,
  "pitch" | "lang" | "rate" | "volume"
>;

export class SpeechNotifications {
  #utterance!: SpeechSynthesisUtterance;
  #isPaused!: boolean;
  #defaultOptions: SpeechNotificationsOptions = {
    pitch: 1,
    rate: 1,
    volume: 1,
    lang: "zh-CN",
  };

  constructor(options: Partial<SpeechNotificationsOptions> = {}) {
    this.#setup(options);
  }

  #setup(options: Partial<SpeechNotificationsOptions>) {
    // istanbul ignore else
    if ("SpeechSynthesisUtterance" in window) {
      this.#utterance = new SpeechSynthesisUtterance();
      for (const [key, value] of Object.entries({
        ...this.#defaultOptions,
        ...options,
      })) {
        (this.#utterance as Record<keyof SpeechNotificationsOptions, any>)[
          key as keyof SpeechNotificationsOptions
        ] = value;
      }
      this.#isPaused = false;
    } else {
      // eslint-disable-next-line no-console
      console.warn("SpeechSynthesisUtterance is not supported in this browser");
    }
  }

  play(text: string): void {
    if (this.#isPaused) {
      this.resume();
      return;
    }

    this.#utterance.text = text;

    speechSynthesis.speak(this.#utterance);
  }

  pause(): void {
    if (speechSynthesis.speaking && !this.#isPaused) {
      speechSynthesis.pause();
      this.#isPaused = true;
    }
  }

  resume(): void {
    // istanbul ignore else
    if (this.#isPaused) {
      speechSynthesis.resume();
      this.#isPaused = false;
    }
  }

  cancel(): void {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }
}
