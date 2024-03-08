export interface IconEvents {
  "icon.found": CustomEvent<boolean>;
}

export interface IconEventsMapping {
  onIconFoundChange: "icon.found";
}
