import { Controller } from "@hotwired/stimulus";
import { useClickOutside } from "stimulus-use";

export default class extends Controller {
  static targets = ["backdrop", "dialog"];

  connect() {
    this.boundKeyHandler = this.handleKeyPress.bind(this);
    document.addEventListener("keydown", this.boundKeyHandler);
    useClickOutside(this, this.handleClickOutside.bind(this));
  }

  disconnect() {
    document.removeEventListener("keydown", this.boundKeyHandler);
  }

  open() {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.classList.remove("hidden");

    const frame = document.getElementById("modal_content");
    frame.src = "/posts/new";
  }

  close(event) {
    const modalContainer = document.getElementById("modal-container");
    modalContainer.classList.add("hidden");
  }

  handleKeyPress(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }

  handleClickOutside(event) {
    console.log("Clicked outside");
    this.close();
  }
}
