// import { h } from "@stencil/core";
// import Popper from "popper.js";
// import { Renderer } from "../../../common/interfaces";
// import { Card } from "../../../card/card";

// // Class transforms
// import { getClasses } from "../../../common/css-transforms/css-transforms";

// export class CardRender implements Renderer {
//   constructor(private component: Card) {
//     this.handleDropDownToggleClick = this.handleDropDownToggleClick.bind(this);
//   }

//   private bodyClickHandler;

//   private popper;

//   private handleDropDownToggleClick(evt) {
//     const dropDownMenu = this.component.element.querySelector(".dropdown-menu");
//     dropDownMenu.classList.toggle("show");
//     const toggleButton = evt.target;

//     if (this.popper) {
//       this.popper.destroy();
//     }
//     this.popper = new Popper(toggleButton, dropDownMenu, {
//       placement: "bottom-start"
//     });

//     this.bodyClickHandler = bodyClickEvt => {
//       const target: HTMLElement = bodyClickEvt.target as HTMLElement;

//       if (target === toggleButton) {
//         return;
//       }

//       dropDownMenu.classList.remove("show");
//     };

//     setTimeout(() => {
//       document.body.addEventListener("click", this.bodyClickHandler, {
//         once: true
//       });
//     }, 10);
//   }

//   disconnectedCallback() {
//     if (this.bodyClickHandler) {
//       document.body.removeEventListener("click", this.bodyClickHandler);
//     }
//     if (this.popper) {
//       this.popper.destroy();
//     }
//   }

//   componentDidLoad() {
//     this.toggleHeaderFooterVisibility();
//   }

//   componentDidUpdate() {
//     this.toggleHeaderFooterVisibility();
//   }

//   private toggleHeaderFooterVisibility() {
//     const card = this.component;

//     const cardHeader = card.element.querySelector(
//       ":scope > .card > .card-header"
//     ) as HTMLElement;
//     const cardFooter = card.element.querySelector(
//       ":scope > .card > .card-footer"
//     ) as HTMLElement;

//     const lowPriorityActions =
//       cardFooter !== null
//         ? Array.from(
//             cardFooter.querySelectorAll("[slot='low-priority-action']")
//           )
//         : [];

//     const highPriorityActions =
//       cardHeader !== null
//         ? Array.from(
//             cardHeader.querySelectorAll("[slot='high-priority-action']")
//           )
//         : [];

//     const normalPriorityActions =
//       cardFooter !== null
//         ? Array.from(
//             cardFooter.querySelectorAll("[slot='normal-priority-action']")
//           )
//         : [];

//     const buttonActions = [...highPriorityActions, ...normalPriorityActions];
//     buttonActions.forEach((btn: any) => (btn.size = "small"));

//     lowPriorityActions.forEach((action: any) => {
//       if (action.cssClass && action.cssClass.indexOf("dropdown-item") >= 0) {
//         return;
//       }

//       action.cssClass = (action.cssClass || "") + " dropdown-item";
//     });

//     const hasLowPriorityActions = lowPriorityActions.length > 0;

//     const hasFooterActions =
//       hasLowPriorityActions || normalPriorityActions.length > 0;

//     const hasHeaderActions = highPriorityActions.length > 0;

//     const renderHeader =
//       hasHeaderActions ||
//       (cardHeader !== null &&
//         cardHeader.querySelector("[slot='header']") !== null);

//     const renderFooter =
//       hasFooterActions ||
//       (cardFooter !== null &&
//         cardFooter.querySelector("[slot='footer']") !== null);

//     if (cardHeader !== null) {
//       cardHeader.hidden = !(renderHeader && card.showHeader);
//     }
//     if (cardFooter !== null) {
//       cardFooter.hidden = !(renderFooter && card.showFooter);
//     }
//   }

//   render(slots) {
//     const card = this.component;

//     const lowPriorityActions = Array.from(
//       card.element.querySelectorAll("[slot='low-priority-action']")
//     );

//     const highPriorityActions = Array.from(
//       card.element.querySelectorAll("[slot='high-priority-action']")
//     );

//     const normalPriorityActions = Array.from(
//       card.element.querySelectorAll("[slot='normal-priority-action']")
//     );

//     const buttonActions = [...highPriorityActions, ...normalPriorityActions];
//     buttonActions.forEach((btn: any) => (btn.size = "small"));

//     lowPriorityActions.forEach((action: any) => {
//       if (action.cssClass && action.cssClass.indexOf("dropdown-item") >= 0) {
//         return;
//       }

//       action.cssClass = (action.cssClass || "") + " dropdown-item";
//     });

//     const hasLowPriorityActions = lowPriorityActions.length > 0;

//     const hasFooterActions =
//       hasLowPriorityActions || normalPriorityActions.length > 0;

//     const renderFooter =
//       hasFooterActions ||
//       card.element.querySelector("[slot='footer']") !== null;

//     // Styling for gx-card control.
//     const classes = getClasses(this.component.cssClass);

//     return [
//       <div
//         class={{
//           "border-0": !card.showBorder,
//           "rounded-0": !card.showBorder,
//           card: true
//         }}
//       >
//         <div
//           class={{
//             "border-0": !card.showBorder,
//             "card-header": true,
//             [card.cssClass]: !!card.cssClass,
//             [classes.vars]: true
//           }}
//         >
//           {slots.header}
//           <div class="gx-card-actions-container">
//             {slots.highPriorityAction}
//           </div>
//         </div>
//         {slots.body}
//         {slots.default}
//         {renderFooter && (
//           <div
//             class={{
//               "border-0": !card.showBorder,
//               "card-footer": true,
//               [card.cssClass]: !!card.cssClass,
//               [classes.vars]: true
//             }}
//           >
//             {slots.footer}
//             {hasFooterActions && (
//               <div class="gx-card-actions-container">
//                 {slots.normalPriorityAction}
//                 {hasLowPriorityActions && (
//                   <button
//                     class="btn btn-sm gx-dropdown-toggle"
//                     type="button"
//                     aria-haspopup="true"
//                     aria-expanded="false"
//                     aria-label="More actions"
//                     onClick={this.handleDropDownToggleClick}
//                   />
//                 )}
//                 {hasLowPriorityActions && (
//                   <div class="dropdown-menu">{slots.lowPriorityAction}</div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     ];
//   }
// }
