import { Controller } from "@hotwired/stimulus";
import { formatFileSize } from "../utils/file";
import { DirectUpload } from "@rails/activestorage";
export default class extends Controller {
  static targets = [
    "input",
    "cta",
    "preview",
    "fileInfo",
    "progressContainer",
    "progressBar",
  ];

  connect() {
    this.inputTarget.addEventListener(
      "change",
      this._handleFileChange.bind(this),
      false
    );
    this.element.addEventListener("dragover", this._handleDragOver.bind(this));
    this.element.addEventListener(
      "dragleave",
      this._handleDragLeave.bind(this)
    );
    this.element.addEventListener("drop", this._handleDrop.bind(this));

    window.addEventListener("direct-upload:start", (event) => {
      this._handleUploadStart(event);
    });

    window.addEventListener("direct-upload:progress", (event) => {
      console.log(event);
      this._handleUploadProgress(event);
    });
  }

  disconnect() {
    this.inputTarget.removeEventListener(
      "change",
      this._handleFileChange.bind(this),
      false
    );
    this.element.removeEventListener(
      "dragover",
      this._handleDragOver.bind(this)
    );
    this.element.removeEventListener(
      "dragleave",
      this._handleDragLeave.bind(this)
    );
  }

  openFileDialog() {
    this.inputTarget.click();
  }

  _handleFileChange(event) {
    this._handleAttachedFile(event);
  }

  _handleDrop(event) {
    this._handleAttachedFile(event);
  }

  _handleDragOver(event) {
    event.preventDefault();
    this.ctaText.textContent = "Drop your image here...";
  }

  _handleAttachedFile(event) {
    event.preventDefault();
    let file;

    if (event.type == "drop") {
      file = event.dataTransfer.files[0];
    } else {
      file = event.target.files[0];
    }

    // Hide the pre-existing content
    this._hideContent();
    // Generate the image thumbnail and display it
    this._displayThumbnail(file);
    // Display the file name and size
    this._displayFileMetadata(file);

    this._uploadFile(file);
  }

  _uploadFile(file) {
    const url = this.uploadUrl;
    const upload = new DirectUpload(file, url);

    upload.create((error, blob) => {
      if (error) {
        console.log("There was an error: ", error);
      } else {
        const hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("value", blob.signed_id);
        hiddenField.name = this.inputTarget.name;
        this.element.appendChild(hiddenField);
      }
    });
  }

  _handleDragLeave(event) {
    event.preventDefault();
    this.ctaText.textContent = "Click to upload or drag and drop";
  }

  _handleUploadStart() {
    const button = document.querySelector("[data-behavior='file-submit']");
    button.setAttribute("disabled", true);
  }

  _handleUploadProgress(event) {
    this.progressContainerTarget.classList.remove("hidden");
    this.progressBarTarget.style.width = `${event.detail.progress}%`;
  }

  _hideContent() {
    this.ctaTarget.classList.add("hidden");
  }

  _displayThumbnail(file) {
    this.previewTarget.classList.remove("hidden");
    this.thumbnailImage.src = URL.createObjectURL(file);
  }

  _displayFileMetadata(file) {
    this.fileInfoTarget.innerHTML = `${file.name} - ${formatFileSize(
      file.size
    )}`;
  }

  get uploadUrl() {
    return this.inputTarget.dataset.directUploadUrl;
  }

  get ctaText() {
    return this.ctaTarget.querySelector("p");
  }

  get thumbnailImage() {
    return this.previewTarget.querySelector("img");
  }
}
