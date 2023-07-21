export type AccessibleRole =
  | "article"
  | "banner"
  | "complementary"
  | "contentinfo"
  | "list"
  | "main"
  | "region";

export type AccessibleRoleCell = "listitem";

export interface AccessibleNameComponent {
  /**
   * Specifies a short string, typically 1 to 3 words, that authors associate
   * with an element to provide users of assistive technologies with a label
   * for the element.
   */
  accessibleName: string;
}

export interface AccessibleRoleComponent {
  /**
   * Specifies the semantics of the control. Specifying the Role allows
   * assistive technologies to give information about how to use the control to
   * the user.
   */
  accessibleRole: AccessibleRole;
}

export interface AccessibleRoleCellComponent {
  /**
   * Specifies the semantics of the control. Specifying the Role allows
   * assistive technologies to give information about how to use the control to
   * the user.
   */
  accessibleRole: AccessibleRoleCell;
}
