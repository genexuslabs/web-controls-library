// import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from "@angular/core";
// import { Title } from "@angular/platform-browser";
// import { AppContainer } from "app/gx/base/app-container";
// import { UriCacheService } from "app/gx/utils/uri-cache/uri-cache.service";

// @Component({
//   selector: "gx-image-upload",
//   templateUrl: "./image-upload.component.html",
//   styleUrls: ["./image-upload.component.scss"],
// })
// export class ImageUploadComponent implements OnChanges {

//   @Input() src = "";
//   @Input() alt = "";
//   @Input() disabled = false;
//   @Input() readonly = false;
//   @Input() uploadService = null;

//   @Output() click: EventEmitter<MouseEvent> = new EventEmitter();
//   @Output() onImageChanged: EventEmitter<string> = new EventEmitter<string>();

//   @ViewChild("fileInput", { static: false }) file;

//   src1 = "";
//   show = false;
//   modalTitle: string;
//   uploading = false;

//   constructor(
//     protected uriCacheService: UriCacheService,
//     protected app: AppContainer,
//     protected titleService: Title
//   ) { }

//   ngOnChanges() {
//     this.modalTitle = this.titleService.getTitle();
//   }

//   clickImageAction(event) {
//     this.click.emit(event);
//   }

//   triggerAction() {
//     if (this.src === "") {
//       this.file.nativeElement.click();
//     } else {
//       this.show = !this.show;
//     }
//   }

//   clearImageAction() {
//     this.src = null;
//     this.alt = "";
//     this.onImageChanged.emit("");
//   }

//   async fileSelectedAction() {
//     const files: { [key: string]: File } = this.file.nativeElement.files;
//     for (let key in files) {
//       if (!isNaN(parseInt(key))) {
//         this.uploading = true;
//         const objectId = await this.onFileSelected(files[key]);
//         if (objectId) {
//           await this.updateImage(files[key], objectId);
//         }
//         this.uploading = false;
//         return;
//       }
//     }
//   }

//   async onFileSelected(file: File): Promise<string> {
//     let result = await this.uploadService(file);
//     return result.object_id;
//   }

//   closeAction() {
//     this.show = false;
//   }

//   translate(key: string) {
//     return this.app.translate(key);
//   }

//   updateImage(file: File, objectId: string): Promise<void> {
//     return new Promise((complete) => {
//       if (FileReader && file) {
//         const fr = new FileReader();
//         fr.onload = () => {
//           this.src = fr.result.toString();
//           this.alt = this.getFileNameWithoutExtension(file.name);
//           this.uriCacheService.storeImage(objectId, this.src);
//           this.onImageChanged.emit(objectId);
//           complete();
//         };
//         fr.readAsDataURL(file);
//       }
//     });
//   }

//   getFileNameWithoutExtension(fileName: string) {
//     const index = fileName.lastIndexOf(".");
//     if (index === -1) {
//       return fileName;
//     } else {
//       return fileName.substring(0, index);
//     }
//   }
// }
