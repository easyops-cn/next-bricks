export enum AlertType {
  "SUCCESS" = "success",
  "INFO" = "info",
  "WARNING" = "warning",
  "ERROR" = "error",
}

export const alertTypeMap = {
  [AlertType.SUCCESS]: {
    outlinedIcon: {
      lib: "antd",
      icon: "check-circle",
      theme: "outlined",
    },
    filledIcon: {
      lib: "antd",
      icon: "check-circle",
      theme: "filled",
    },
    color: "var(--theme-green-color)",
    bgColor: "var(--theme-green-background)",
  },
  [AlertType.INFO]: {
    outlinedIcon: {
      lib: "antd",
      icon: "info-circle",
      theme: "outlined",
    },
    filledIcon: {
      lib: "antd",
      icon: "info-circle",
      theme: "filled",
    },
    color: "var(--theme-blue-color)",
    bgColor: "var(--theme-blue-background)",
  },
  [AlertType.WARNING]: {
    outlinedIcon: {
      lib: "antd",
      icon: "exclamation-circle",
      theme: "outlined",
    },
    filledIcon: {
      lib: "antd",
      icon: "exclamation-circle",
      theme: "filled",
    },
    color: "var(--theme-orange-color)",
    bgColor: "var(--theme-orange-background)",
  },
  [AlertType.ERROR]: {
    outlinedIcon: {
      lib: "antd",
      icon: "close-circle",
      theme: "outlined",
    },
    filledIcon: {
      lib: "antd",
      icon: "close-circle",
      theme: "filled",
    },
    color: "var(--theme-red-color)",
    bgColor: "var(--theme-red-background)",
  },
};

export const LOCAL_STORAGE_PREFIX = "presentational.general-alert-hidden";
