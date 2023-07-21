export type AccessibleRole =
  | "article"
  | "banner"
  | "complementary"
  | "contentinfo"
  | "list"
  | "main"
  | "region";

export type AccessibleRoleCell = "listitem";

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
