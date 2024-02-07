export const animations = {
  center: {
    active: [
      {
        opacity: 0,
        scale: 0.9,
        transform: "translateY(-100%)",
      },
      {
        opacity: 1,
        scale: 1,
        transform: "translateY(0%)",
      },
    ],
    hide: [
      {
        opacity: 1,
        scale: 1,
        transform: "translateY(0%)",
      },
      {
        opacity: 0,
        scale: 0.9,
        transform: "translateY(-100%)",
      },
    ],
  },
  topRight: {
    active: [
      {
        opacity: 0,
        scale: 0.9,
        transform: "translateX(100%)",
      },
      {
        opacity: 1,
        scale: 1,
        transform: "translateX(0%)",
      },
    ],
    hide: [
      {
        opacity: 1,
        scale: 1,
        transform: "translateX(0%)",
      },
      {
        opacity: 0,
        scale: 0.9,
        transform: "translateX(100%)",
      },
    ],
  },
};

export const hideKeyframeAnimationOptions = {
  duration: 200,
  easing: "ease",
};

export const activeKeyframeAnimationOptions = {
  duration: 100,
  easing: "ease",
};
