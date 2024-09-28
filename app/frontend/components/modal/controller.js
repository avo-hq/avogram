import { Controller } from "@hotwired/stimulus";
import { useClickOutside } from "stimulus-use";

export default class extends Controller {
  static targets = ["container", "backdrop", "panel"];

  connect() {
    console.log(this);
    useClickOutside(this, { element: this.panelTarget });
  }

  open() {
    this.containerTarget.classList.remove("hidden");
    setTimeout(() => {
      this.backdropTarget.classList.remove("opacity-0");
      this.backdropTarget.classList.add("opacity-100");
      this.panelTarget.classList.remove(
        "opacity-0",
        "translate-y-4",
        "sm:translate-y-0",
        "sm:scale-95"
      );
      this.panelTarget.classList.add(
        "opacity-100",
        "translate-y-0",
        "sm:scale-100"
      );
    }, 10);
  }

  close() {
    this.backdropTarget.classList.remove("opacity-100");
    this.backdropTarget.classList.add("opacity-0");
    this.panelTarget.classList.remove(
      "opacity-100",
      "translate-y-0",
      "sm:scale-100"
    );
    this.panelTarget.classList.add(
      "opacity-0",
      "translate-y-4",
      "sm:translate-y-0",
      "sm:scale-95"
    );
    setTimeout(() => {
      this.containerTarget.classList.add("hidden");
    }, 300);
  }

  clickOutside(event) {
    if (!this.panelTarget.contains(event.target)) {
      this.close();
    }
  }
}
