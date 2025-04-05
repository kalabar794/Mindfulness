type TimerCallback = (timeRemaining: number) => void;
type CompletionCallback = () => void;

class SessionTimer {
  private duration: number;
  private timeRemaining: number;
  private timerId: number | null = null;
  private onTick: TimerCallback;
  private onComplete: CompletionCallback;

  constructor(
    durationInMinutes: number,
    onTick: TimerCallback,
    onComplete: CompletionCallback
  ) {
    this.duration = durationInMinutes * 60;
    this.timeRemaining = this.duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  start() {
    if (this.timerId) return;

    this.timerId = window.setInterval(() => {
      this.timeRemaining--;
      this.onTick(this.timeRemaining);

      if (this.timeRemaining <= 0) {
        this.stop();
        this.onComplete();
      }
    }, 1000);
  }

  stop() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  pause() {
    this.stop();
  }

  resume() {
    this.start();
  }

  reset() {
    this.stop();
    this.timeRemaining = this.duration;
    this.onTick(this.timeRemaining);
  }

  getTimeRemaining() {
    return this.timeRemaining;
  }
}

export default SessionTimer;
