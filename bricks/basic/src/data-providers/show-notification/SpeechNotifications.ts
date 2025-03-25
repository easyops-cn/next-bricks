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
    volume: 10,
    lang: "zh-CN",
  };

  constructor(options: Partial<SpeechNotificationsOptions> = {}) {
    this.#setup(options);
  }

  #setup(options: Partial<SpeechNotificationsOptions>) {
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
